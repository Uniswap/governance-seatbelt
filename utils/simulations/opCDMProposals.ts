/**
 * Simulating proposals for Optimism cross-domain-messenger portal bridge (used for optimism cross chain governance)
 */

import { ChainId } from '@aave/contract-helpers'
import { BigNumber, Contract, ethers } from 'ethers'
import { hexDataSlice, hexStripZeros, hexZeroPad } from 'ethers/lib/utils'
import { SHORT_EXECUTOR } from '../../presentation/markdown'
import { TenderlyPayload, TenderlySimulation, Trace } from '../../types'
import { getCloseBlock, getPastLogs, optimismProvider } from '../clients/ethers'
import { sendSimulation } from '../clients/tenderly'
import { BLOCK_GAS_LIMIT, FROM, RPC_OPTIMISM } from '../constants'
import { abi as BRIDGE_EXECUTOR_ABI } from '../contracts/bridge-executor'
import { opChildContract } from '../contracts/ovmL2'

const BRIDGE_ADMIN = '0x4200000000000000000000000000000000000007'
const L1_CROSS_DOMAIN_MESSENGER = '0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1'
const OPTIMISM_BRIDGE_EXECUTOR = '0x7d9103572bE58FfE99dc390E8246f02dcAe6f611'
const OPTIMISM_BRIDGE_CREATION_BLOCK = 18825397

export function getOptimismPayloads(simulation: TenderlySimulation) {
  return simulation.transaction.call_trace.filter(
    (trace) => trace.to.toLowerCase() === L1_CROSS_DOMAIN_MESSENGER.toLowerCase()
  )
}

export function getOptimismActionSetsChanged(simulation: TenderlySimulation) {
  const actionSetsChange = simulation.transaction.transaction_info.state_diff?.find(
    (diff) =>
      diff.raw?.[0]?.address.toLowerCase() === OPTIMISM_BRIDGE_EXECUTOR.toLowerCase() &&
      diff.soltype?.name === '_actionsSets'
  )
  if (!actionSetsChange) return []
  const newActionSets = Object.entries(actionSetsChange?.dirty as { [key: string]: string }).map(([key, value]) => ({
    actionSet: key,
    value: value,
  }))
  return newActionSets
}

export async function simulateOptimismProposal(simulation: TenderlySimulation, trace: Trace) {
  const emitTrace = simulation.transaction.call_trace.find(
    (trace) => trace.to === '0x25ace71c97b33cc4729cf772ae268934f7ab5fa1'
  )!
  const [receiver, data] = ethers.utils.defaultAbiCoder.decode(
    ['address', 'bytes', 'uint32'],
    hexDataSlice(emitTrace.input, 4) // cutting of selector from trace input
  )

  // find close block to mainnet execution
  const latestBlock = await optimismProvider.getBlock('latest')
  const closeBlock = await getCloseBlock(
    OPTIMISM_BRIDGE_CREATION_BLOCK,
    latestBlock.number,
    BigNumber.from(simulation.simulation.block_header.timestamp).toNumber(),
    optimismProvider
  )

  // create default payload

  const bridgeExecutor = new Contract(OPTIMISM_BRIDGE_EXECUTOR, BRIDGE_EXECUTOR_ABI, optimismProvider)

  const simulationPayload: TenderlyPayload = {
    network_id: ChainId.optimism.toString(),
    // block_number: bridgeSim.simulation.block_number, // doesn't matter as it's a new simulation (not on top)
    from: FROM,
    to: receiver,
    // input: bridgeExecutor.interface.encodeFunctionData('execute', [Number(id)]),
    save: true,
    gas: BLOCK_GAS_LIMIT,
    gas_price: '0',
    // block_header: {
    //   number: hexStripZeros(BigNumber.from(bridgeSim.simulation.block_number).toHexString()),
    //   timestamp: hexStripZeros(BigNumber.from(executionTime).add(1).toHexString()),
    // },
    generate_access_list: true,
    // state_objects: state,
  } as TenderlyPayload

  const stateSyncedLogs = await getPastLogs(
    closeBlock,
    closeBlock + 8000,
    opChildContract.filters.SentMessage(),
    opChildContract
  )

  const correctLog = stateSyncedLogs.find(
    (l) =>
      (l.args as any).rootMessageSender.toLowerCase() === SHORT_EXECUTOR.toLowerCase() &&
      ((l.args as any).receiver.toLowerCase() === OPTIMISM_BRIDGE_EXECUTOR.toLowerCase() && (l.data as any)) === data
  )

  if (correctLog) {
    const tx = await optimismProvider.getTransaction(correctLog.transactionHash)
    const txWithLogs = await tx.wait()
    const log = txWithLogs.logs.find((l) => {
      if (l.address.toLowerCase() !== OPTIMISM_BRIDGE_EXECUTOR.toLowerCase()) return false
      const [id, targets, , , , , executionTime] = ethers.utils.defaultAbiCoder.decode(
        ['uint256', 'address[]', 'uint256[]', 'string[]', 'bytes[]', 'bool[]', 'uint256'],
        l!.data
      )
      return targets.every((target: string) => {
        return data.includes(target.toLowerCase().replace('0x', ''))
      })
    })
    const [id, , , , , , executionTime] = ethers.utils.defaultAbiCoder.decode(
      ['uint256', 'address[]', 'uint256[]', 'string[]', 'bytes[]', 'bool[]', 'uint256'],
      log!.data
    )
    simulationPayload.block_number = log!.blockNumber + 1
    simulationPayload.input = bridgeExecutor.interface.encodeFunctionData('execute', [Number(id)])
    simulationPayload.block_header = {
      number: hexStripZeros(BigNumber.from(log!.blockNumber + 1).toHexString()),
      timestamp: hexStripZeros(BigNumber.from(executionTime).toHexString()),
    }
  } else {
    const bridgeSimulationPayload: TenderlyPayload = {
      network_id: ChainId.optimism.toString(),
      from: BRIDGE_ADMIN,
      to: receiver,
      input: data,
      save: true,
      gas: BLOCK_GAS_LIMIT,
      gas_price: '0',
      generate_access_list: true,
      root: simulation.simulation.id,
      state_objects: {
        [BRIDGE_ADMIN]: {
          storage: {
            [hexZeroPad(BigNumber.from(4).toHexString(), 32)]: SHORT_EXECUTOR,
          },
        },
      },
    }

    const bridgeSim = await sendSimulation(bridgeSimulationPayload, 1000, RPC_OPTIMISM)

    const queueEvent = bridgeSim.transaction.transaction_info.logs?.find((e) => e.name === 'ActionsSetQueued')
    const executionTime = queueEvent?.inputs.find((e) => e.soltype?.name === 'executionTime')?.value as string
    const id = queueEvent?.inputs.find((e) => e.soltype?.name === 'id')?.value as string

    const state = bridgeSim.transaction.transaction_info.state_diff.reduce((acc, diff) => {
      diff.raw.forEach((raw) => {
        if (!acc[raw.address]) acc[raw.address] = { storage: {} }
        acc[raw.address].storage[raw.key] = raw.dirty
      })
      return acc
    }, {} as { [key: string]: { storage: { [key: string]: string } } })

    simulationPayload.state_objects = state
    simulationPayload.block_number = bridgeSim.simulation.block_number
    // patch as currently tenderly doesn't respect blockheader timestamp on rollups
    ;(simulationPayload as any).l1_timestamp = Number(executionTime)
    simulationPayload.block_header = {
      number: hexStripZeros(BigNumber.from(bridgeSim.simulation.block_number).toHexString()),
      timestamp: hexStripZeros(BigNumber.from(executionTime).add(1).toHexString()),
    }
    simulationPayload.input = bridgeExecutor.interface.encodeFunctionData('execute', [Number(id)])
  }

  return await sendSimulation(simulationPayload, 1000, RPC_OPTIMISM)
}
