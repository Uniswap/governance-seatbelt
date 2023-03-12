/**
 * Simulating proposals for FX portal bridge (used for polygon cross chain governance)
 */

import { ChainId } from '@aave/contract-helpers'
import { BigNumber, Contract, ethers } from 'ethers'
import { hexDataSlice, hexStripZeros } from 'ethers/lib/utils'
import { SHORT_EXECUTOR } from '../../presentation/markdown'
import { Log, TenderlyPayload, TenderlySimulation, StateObject } from '../../types'
import { getCloseBlock, getPastLogs, polygonProvider } from '../clients/ethers'
import { sendSimulation, sleep } from '../clients/tenderly'
import { BLOCK_GAS_LIMIT, FROM, MOCK_EXECUTOR, RPC_POLYGON } from '../constants'
import { abi as BRIDGE_EXECUTOR_ABI } from '../contracts/bridge-executor'
import { fxChildContract, FX_CHILD } from '../contracts/fxChild'

const STATE_SENDER = '0x28e4F3a7f651294B9564800b2D01f35189A5bFbE'
const BRIDGE_ADMIN = '0x0000000000000000000000000000000000001001'
const POLYGON_BRIDGE_EXECUTOR = '0xdc9A35B16DB4e126cFeDC41322b3a36454B1F772'
const POLYGON_BRIDGE_CREATION_BLOCK = 30939532

export function getFxChildPayloads(simulation: TenderlySimulation) {
  const stateSyncedEvents = simulation.transaction.transaction_info.logs?.filter(
    (log) => log.name === 'StateSynced' && log.raw?.address.toLowerCase() === STATE_SENDER.toLowerCase()
  )
  if (!stateSyncedEvents) return []
  const stateSynced = stateSyncedEvents.map((event) => ({
    event,
  }))
  return stateSynced
}

export function getActionSetsChanged(simulation: TenderlySimulation) {
  const actionSetsChange = simulation.transaction.transaction_info.state_diff?.find(
    (diff) =>
      diff.raw?.[0]?.address.toLowerCase() === POLYGON_BRIDGE_EXECUTOR.toLowerCase() &&
      diff.soltype?.name === '_actionsSets'
  )
  if (!actionSetsChange) return []
  const newActionSets = Object.entries(actionSetsChange?.dirty as { [key: string]: string }).map(([key, value]) => ({
    actionSet: key,
    value: value,
  }))
  return newActionSets
}

export async function simulateFxPortal(simulation: TenderlySimulation, log: Log) {
  const receiver = BigNumber.from(log.raw.topics[1]).toHexString()
  const data = hexDataSlice(log.raw.data, 64)

  // find close block to mainnet execution
  const latestBlock = await polygonProvider.getBlock('latest')
  const closeBlock = await getCloseBlock(
    POLYGON_BRIDGE_CREATION_BLOCK,
    latestBlock.number - 1,
    BigNumber.from(simulation.simulation.block_header.timestamp).toNumber(),
    polygonProvider
  )

  // create default payload

  const bridgeExecutor = new Contract(POLYGON_BRIDGE_EXECUTOR, BRIDGE_EXECUTOR_ABI, polygonProvider)

  const simulationPayload: TenderlyPayload = {
    network_id: '137',
    // block_number: bridgeSim.simulation.block_number, // doesn't matter as it's a new simulation (not on top)
    from: FROM,
    to: POLYGON_BRIDGE_EXECUTOR,
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
    fxChildContract.filters.NewFxMessage(),
    fxChildContract
  )

  const correctLog = stateSyncedLogs.find(
    (l) =>
      (l.args as any).rootMessageSender.toLowerCase() === SHORT_EXECUTOR.toLowerCase() &&
      ((l.args as any).receiver.toLowerCase() === POLYGON_BRIDGE_EXECUTOR.toLowerCase() && (l.data as any)) === data
  )

  if (correctLog) {
    const tx = await polygonProvider.getTransaction(correctLog.transactionHash)
    const txWithLogs = await tx.wait()
    const log = txWithLogs.logs.find((l) => {
      if (l.address.toLowerCase() !== POLYGON_BRIDGE_EXECUTOR.toLowerCase()) return false
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
    simulationPayload.input = bridgeExecutor.interface.encodeFunctionData('execute', [Number(id)])
    simulationPayload.block_header = {
      number: hexStripZeros(BigNumber.from(log!.blockNumber + 1).toHexString()),
      timestamp: hexStripZeros(BigNumber.from(executionTime).toHexString()),
    }
  } else {
    const bridgeSimulationPayload: TenderlyPayload = {
      network_id: ChainId.polygon.toString(),
      from: BRIDGE_ADMIN,
      to: FX_CHILD,
      input: fxChildContract.interface.encodeFunctionData('onStateReceive', [receiver, data]),
      save: true,
      gas: BLOCK_GAS_LIMIT,
      gas_price: '0',
      generate_access_list: true,
      root: simulation.simulation.id,
    }

    const bridgeSim = await sendSimulation(bridgeSimulationPayload, 1000, RPC_POLYGON)

    const queueEvent = bridgeSim.transaction.transaction_info.logs?.find((e) => e.name === 'ActionsSetQueued')
    const executionTime = queueEvent?.inputs.find((e) => e.soltype?.name === 'executionTime')?.value as string
    const id = queueEvent?.inputs.find((e) => e.soltype?.name === 'id')?.value as string

    const state = bridgeSim.transaction.transaction_info.state_diff.reduce((acc, diff) => {
      diff.raw.forEach((raw) => {
        if (!acc[raw.address]) acc[raw.address] = { storage: {} }
        acc[raw.address].storage![raw.key] = raw.dirty
      })
      return acc
    }, {} as Record<string, StateObject>)

    if (!state[POLYGON_BRIDGE_EXECUTOR]) {
      state[POLYGON_BRIDGE_EXECUTOR] = { code: MOCK_EXECUTOR }
    } else {
      state[POLYGON_BRIDGE_EXECUTOR].code = MOCK_EXECUTOR
    }

    simulationPayload.state_objects = state
    simulationPayload.block_number = bridgeSim.simulation.block_number
    simulationPayload.block_header = {
      number: hexStripZeros(BigNumber.from(bridgeSim.simulation.block_number).toHexString()),
      timestamp: hexStripZeros(BigNumber.from(executionTime).add(1).toHexString()),
    }
    simulationPayload.input = bridgeExecutor.interface.encodeFunctionData('execute', [Number(id)])
  }
  return await sendSimulation(simulationPayload, 1000, RPC_POLYGON)
}
