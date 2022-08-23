import { BigNumber, Contract } from 'ethers'
import { hexStripZeros } from 'ethers/lib/utils'
import { TenderlyPayload, TenderlySimulation } from '../../types'
import { getPastLogs, provider } from '../clients/ethers'
import { sendSimulation } from '../clients/tenderly'
import { BLOCK_GAS_LIMIT, FORCE_SIMULATION, FROM, RPC_URL } from '../constants'
import { abi as ARC_TIMELOCK_ABI } from '../contracts/arc-timelock'

const STATES = {
  Queued: 0,
  Executed: 1,
  Canceled: 2,
  Expired: 3,
}

const ARC_ADDRESS = '0xAce1d11d836cb3F51Ef658FD4D353fFb3c301218'

export function getArcPayloads(simulation: TenderlySimulation) {
  const arc = simulation.transaction.transaction_info.state_diff?.find(
    (diff) =>
      diff.raw?.[0]?.address.toLowerCase() === ARC_ADDRESS.toLowerCase() && diff.soltype?.name === '_actionsSets'
  )
  if (!arc) return []
  const newActionSets = Object.entries(arc?.dirty as { [key: string]: string }).map(([key, value]) => ({
    actionSet: key.replace(/"/g, ''),
    timestamp: value,
  }))
  return newActionSets
}

export async function simulateArc(simulation: TenderlySimulation, actionSet: string, timestamp: string) {
  const arcContract = new Contract(ARC_ADDRESS, ARC_TIMELOCK_ABI, provider)
  const gracePeriod = await arcContract.getGracePeriod()
  const actionSetExecutedLogs = await getPastLogs(
    simulation.transaction.block_number,
    simulation.transaction.block_number + Math.floor(gracePeriod / 11),
    arcContract.filters.ActionsSetExecuted(),
    arcContract
  )
  const actionSetExecutedEvent = actionSetExecutedLogs.find(
    // lte check necessary to work around a bug in tenderly TODO: remove once resolved
    (log) => log.args?.id.lte(1000) && log.args?.id.eq(actionSet)
  )
  let simulationPayload: TenderlyPayload
  if (!FORCE_SIMULATION && actionSetExecutedEvent) {
    const tx = await provider.getTransaction(actionSetExecutedEvent.transactionHash)
    simulationPayload = {
      network_id: String(tx.chainId) as TenderlyPayload['network_id'],
      block_number: tx.blockNumber,
      from: tx.from,
      to: tx.to as string,
      input: tx.data,
      gas: tx.gasLimit.toNumber(),
      gas_price: tx.gasPrice?.toString(),
      value: tx.value.toString(),
      save: true,
      generate_access_list: true,
    }
  } else {
    const arcContract = new Contract(ARC_ADDRESS, ARC_TIMELOCK_ABI, provider)
    const state = simulation.transaction.transaction_info.state_diff.reduce((acc, diff) => {
      diff.raw.forEach((raw) => {
        if (!acc[raw.address]) acc[raw.address] = { storage: {} }
        acc[raw.address].storage[raw.key] = raw.dirty
      })
      return acc
    }, {} as { [key: string]: { storage: { [key: string]: string } } })
    simulationPayload = {
      network_id: '1',
      block_number: simulation.simulation.block_number,
      from: FROM,
      to: ARC_ADDRESS,
      input: arcContract.interface.encodeFunctionData('execute', [Number(actionSet)]),
      save: true,
      gas: BLOCK_GAS_LIMIT,
      gas_price: '0',
      generate_access_list: true,
      block_header: {
        number: hexStripZeros(BigNumber.from(simulation.simulation.block_number).toHexString()),
        timestamp: hexStripZeros(BigNumber.from(timestamp).toHexString()),
      },
      root: simulation.simulation.id,
      state_objects: state,
    }
  }

  return await sendSimulation(simulationPayload, 1000, RPC_URL)
}
