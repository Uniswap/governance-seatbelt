import { BigNumber, Contract } from 'ethers'
import { hexStripZeros } from 'ethers/lib/utils'
import { TenderlyPayload, TenderlySimulation } from '../../types'
import { provider } from '../clients/ethers'
import { sendSimulation } from '../clients/tenderly'
import { BLOCK_GAS_LIMIT, FROM } from '../constants'
import { abi as ARC_TIMELOCK_ABI } from '../contracts/arc-timelock'

const STATES = {
  Queued: 0,
  Executed: 1,
  Canceled: 2,
  Expired: 3,
}

const ARC_ADDRESS = '0xAce1d11d836cb3F51Ef658FD4D353fFb3c301218'

export function targetsArc(simulation: TenderlySimulation) {
  return simulation.transaction.transaction_info.state_diff?.some(
    (diff) =>
      diff.raw?.[0]?.address.toLowerCase() === ARC_ADDRESS.toLowerCase() && diff.soltype?.name === '_actionsSets'
  )
}

export function getArcPayload(simulation: TenderlySimulation) {
  const arc = simulation.transaction.transaction_info.state_diff.find(
    (diff) => diff.raw[0].address.toLowerCase() === ARC_ADDRESS.toLowerCase() && diff.soltype?.name === '_actionsSets'
  )
  const proposalId = Object.keys(arc?.dirty as any)[0]
  const timestamp = (arc as any).dirty?.[proposalId].executionTime
  return {
    proposalId: proposalId.replace(/"/g, ''),
    timestamp,
  }
}

export async function simulateArc(simulation: TenderlySimulation) {
  const { proposalId, timestamp } = getArcPayload(simulation)
  const arcContract = new Contract(ARC_ADDRESS, ARC_TIMELOCK_ABI, provider)
  const actionSetExecutedLogs = await arcContract.queryFilter(arcContract.filters.ActionsSetExecuted())
  const actionSetExecutedEvent = actionSetExecutedLogs.find((log) => log.args?.id.eq(proposalId))
  if (actionSetExecutedEvent) {
    const tx = await provider.getTransaction(actionSetExecutedEvent.transactionHash)
    const simulationPayload: TenderlyPayload = {
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
    return await sendSimulation(simulationPayload)
  } else {
    const arcContract = new Contract(ARC_ADDRESS, ARC_TIMELOCK_ABI, provider)
    const state = simulation.transaction.transaction_info.state_diff.reduce((acc, diff) => {
      diff.raw.forEach((raw) => {
        if (!acc[raw.address]) acc[raw.address] = { storage: {} }
        acc[raw.address].storage[raw.key] = raw.dirty
      })
      return acc
    }, {} as { [key: string]: { storage: { [key: string]: string } } })
    const simulationPayload: TenderlyPayload = {
      network_id: '1',
      block_number: simulation.simulation.block_number + 1,
      from: FROM,
      to: ARC_ADDRESS,
      input: arcContract.interface.encodeFunctionData('execute', [Number(proposalId)]),
      save: true,
      gas: BLOCK_GAS_LIMIT,
      gas_price: '0',
      generate_access_list: true,
      block_header: {
        // number: hexStripZeros(BigNumber.from(simulation.simulation.block_number + 1).toHexString()),
        timestamp: hexStripZeros(BigNumber.from(timestamp).toHexString()),
      },
      root: simulation.simulation.id,
      state_objects: state,
    }

    return await sendSimulation(simulationPayload)
  }
}
