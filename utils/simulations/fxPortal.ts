/**
 * Simulating proposals for FX portal bridge (used for polygon cross chain governance)
 */

import { BigNumber, Contract } from 'ethers'
import { hexDataSlice, hexStripZeros } from 'ethers/lib/utils'
import { Log, TenderlyPayload, TenderlySimulation } from '../../types'
import { polygonProvider } from '../clients/ethers'
import { sendSimulation } from '../clients/tenderly'
import { BLOCK_GAS_LIMIT, FROM, RPC_URL_POLYGON } from '../constants'
import { abi as BRIDGE_EXECUTOR_ABI } from '../contracts/bridge-executor'
import { fxChildContract, FX_CHILD } from '../contracts/fxChild'

const STATE_SENDER = '0x28e4F3a7f651294B9564800b2D01f35189A5bFbE'
const BRIDGE_ADMIN = '0x0000000000000000000000000000000000001001'
const POLYGON_BRIDGE_EXECUTOR = '0xdc9A35B16DB4e126cFeDC41322b3a36454B1F772'

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

export async function simulateFxPortal(simulation: TenderlySimulation, log: Log) {
  const receiver = BigNumber.from(log.raw.topics[1]).toHexString()
  const data = hexDataSlice(log.raw.data, 64)

  const bridgeSimulationPayload: TenderlyPayload = {
    network_id: '137',
    from: BRIDGE_ADMIN,
    to: FX_CHILD,
    input: fxChildContract.interface.encodeFunctionData('onStateReceive', [receiver, data]),
    save: true,
    gas: BLOCK_GAS_LIMIT,
    gas_price: '0',
    generate_access_list: true,
    root: simulation.simulation.id,
  }

  const bridgeSim = await sendSimulation(bridgeSimulationPayload, 1000, RPC_URL_POLYGON)

  const queueEvent = bridgeSim.transaction.transaction_info.logs?.find((e) => e.name === 'ActionsSetQueued')
  const executionTime = queueEvent?.inputs.find((e) => e.soltype?.name === 'executionTime')?.value as string
  const id = queueEvent?.inputs.find((e) => e.soltype?.name === 'id')?.value as string

  const bridgeExecutor = new Contract(POLYGON_BRIDGE_EXECUTOR, BRIDGE_EXECUTOR_ABI, polygonProvider)

  const state = bridgeSim.transaction.transaction_info.state_diff.reduce((acc, diff) => {
    diff.raw.forEach((raw) => {
      if (!acc[raw.address]) acc[raw.address] = { storage: {} }
      acc[raw.address].storage[raw.key] = raw.dirty
    })
    return acc
  }, {} as { [key: string]: { storage: { [key: string]: string } } })

  console.log(BigNumber.from(executionTime).add(1).toString())

  const simulationPayload: TenderlyPayload = {
    network_id: '137',
    block_number: bridgeSim.simulation.block_number, // doesn't matter as it's a new simulation (not on top)
    from: FROM,
    to: POLYGON_BRIDGE_EXECUTOR,
    input: bridgeExecutor.interface.encodeFunctionData('execute', [Number(id)]),
    save: true,
    gas: BLOCK_GAS_LIMIT,
    gas_price: '0',
    block_header: {
      number: hexStripZeros(BigNumber.from(bridgeSim.simulation.block_number).toHexString()),
      timestamp: hexStripZeros(BigNumber.from(executionTime).add(1).toHexString()),
    },
    generate_access_list: true,
    state_objects: state,
  }

  return await sendSimulation(simulationPayload, 1000, RPC_URL_POLYGON)
}
