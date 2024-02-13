/**
 * @notice Sample simulation configuration file for https://github.com/ethereum-optimism/superchain-ops/blob/jm/StateDiffChecker/tasks/sep/1-op-extended-pause/input.json#L1
 */
// import { SimulationConfigNew } from '../types'
import input from './sep-1-op-extended-pause.input.json'
import { StateObject, TenderlyPayload } from '../types'
import { JsonRpcProvider } from '@ethersproject/providers'
import { Interface } from '@ethersproject/abi'
import { AddressZero, HashZero } from '@ethersproject/constants'
import { BigNumber, Contract } from 'ethers'
import { hexStripZeros, hexZeroPad } from '@ethersproject/bytes'
import { pack as abiEncodePacked } from '@ethersproject/solidity'
import { getLatestBlock, sendSimulation } from '../utils/clients/tenderly'
import { BLOCK_GAS_LIMIT } from '../utils/constants'
import { writeFileSync } from 'fs'

// ======== Setup ========

enum Operation {
  Call,
  DelegateCall,
}

const multicallAddress = '0xcA11bde05977b3631167028862bE2a173976CA11'
const multicallAbi = [
  'function aggregate3(tuple(address target, bool allowFailure, bytes callData)[] calls) payable returns (tuple(bool success, bytes returnData)[] returnData)',
]
const multicallInterface = new Interface(multicallAbi)
const safeAbi = [
  'function nonce() external view returns (uint256)',
  'function execTransaction(address to, uint256 value, bytes memory data, uint8 operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address refundReceiver, bytes memory signatures) external payable returns (bool success)',
]

const OWNER_SAFE_ADDRESS = process.env.OWNER_SAFE // Use 0xDEe57160aAfCF04c34C887B5962D0a69676d3C8B
if (!OWNER_SAFE_ADDRESS) throw new Error('OWNER_SAFE is not set')

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL
if (!SEPOLIA_RPC_URL) throw new Error('SEPOLIA_RPC_URL is not set')

const SENDER = process.env.SENDER // Use any owner from that safe
if (!SENDER) throw new Error('SENDER is not set')

function preValidatedSignature(address: string) {
  const v = 1
  const s = HashZero
  const r = hexZeroPad(address, 32)
  return abiEncodePacked(['bytes32', 'bytes32', 'uint8'], [r, s, v])
}

// ======== Execution ========
async function main() {
  const calls = input.transactions.map((tx) => {
    return {
      target: tx.to,
      allowFailure: false,
      callData: tx.data,
    }
  })
  const data = multicallInterface.encodeFunctionData('aggregate3', [calls])
  const provider = new JsonRpcProvider(SEPOLIA_RPC_URL)
  const safe = new Contract(OWNER_SAFE_ADDRESS!, safeAbi, provider)

  const SAFE_NONCE = process.env.SAFE_NONCE
  const safeNonce = BigNumber.from(SAFE_NONCE || (await safe.nonce())).toHexString()

  const stateOverrides: Record<string, StateObject> = {
    [safe.address]: {
      storage: {
        // Set threshold to 1.
        [hexZeroPad('0x04', 32)]: hexZeroPad('0x01', 32),
        // Include nonce as a state override if the SAFE_NONCE env var is set.
        ...(SAFE_NONCE ? { [hexZeroPad('0x05', 32)]: hexZeroPad(safeNonce, 32) } : {}),
      },
    },
  }

  const calldata = safe.interface.encodeFunctionData('execTransaction', [
    multicallAddress,
    0,
    data,
    Operation.DelegateCall,
    0,
    0,
    0,
    AddressZero,
    AddressZero,
    preValidatedSignature(SENDER!),
  ])

  const config = {
    to: OWNER_SAFE_ADDRESS!,
    data: calldata,
    from: SENDER!,
    stateOverrides,
  }

  const chainId = (await provider.getNetwork()).chainId
  const latestBlockNumber = await getLatestBlock(chainId)
  const latestBlock = await provider.getBlock(latestBlockNumber)

  const simBlock = BigNumber.from(latestBlock.number).add(1)
  const simTimestamp = BigNumber.from(latestBlock.timestamp).add(12)

  const simulationPayload: TenderlyPayload = {
    network_id: String(chainId),
    // this field represents the block state to simulate against, so we use the latest block number
    block_number: latestBlock.number,
    from: config.from,
    to: config.to,
    input: config.data,
    gas: BLOCK_GAS_LIMIT,
    gas_price: '0',
    value: '0',
    save_if_fails: true, // Set to true to save the simulation to your Tenderly dashboard if it fails.
    save: false, // Set to true to save the simulation to your Tenderly dashboard if it succeeds.
    generate_access_list: true, // Not required, but useful as a sanity check to ensure consistency in the simulation response.
    block_header: {
      // This data represents what block.number and block.timestamp should return in the EVM during the simulation.
      number: hexStripZeros(simBlock.toHexString()),
      timestamp: hexStripZeros(simTimestamp.toHexString()),
    },
    state_objects: config.stateOverrides,
  }

  const sim = await sendSimulation(simulationPayload)
  writeFileSync('sim-response.json', JSON.stringify(sim, null, 2))
}

main()
  .then(() => console.log('Simulation completed successfully, output saved to sim-response.json'))
  .catch((error) => console.error('Simulation failed:', error))
