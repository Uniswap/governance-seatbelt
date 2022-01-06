import { getAddress } from '@ethersproject/address'
import { defaultAbiCoder } from '@ethersproject/abi'
import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { hexStripZeros, hexZeroPad } from '@ethersproject/bytes'
import { Contract } from '@ethersproject/contracts'
import { keccak256 } from '@ethersproject/keccak256'
import { parseEther } from '@ethersproject/units'
import { provider } from './ethers'

import fetchUrl, { FETCH_OPT } from 'micro-ftch'
import { governorBravo } from '../contracts/governor-bravo'
import { BLOCK_GAS_LIMIT, TENDERLY_ACCESS_TOKEN, TENDERLY_URL } from '../constants'
import {
  ProposalActions,
  ProposalEvent,
  ProposalStruct,
  SimulationConfig,
  SimulationConfigExecuted,
  SimulationConfigProposed,
  SimulationResult,
  TenderlyPayload,
  TenderlySimulation,
} from '../../types'

// --- Simulation methods ---

/**
 * @notice Simulates a proposal based on the provided configuration
 * @param config Configuration object
 */
export async function simulate(config: SimulationConfig) {
  if (config.type === 'executed') return await simulateExecuted(config)
  else if (config.type === 'proposed') return await simulateProposed(config)
  throw new Error(`Unsupported simulation type '${config.type}'`)
}

/**
 * @notice Simulates execution of an on-chain proposal that has not yet been executed
 * @param config Configuration object
 */
async function simulateProposed(config: SimulationConfigProposed): Promise<SimulationResult> {
  const { governorAddress, proposalId } = config

  // --- Get details about the proposal we're simulating ---
  const latestBlock = await provider.getBlock('latest')
  const blockRange = [0, latestBlock.number]
  const governor = governorBravo(governorAddress)

  const [_proposal, _actions, proposalCreatedLogs, timelockAddress] = await Promise.all([
    governor.proposals(proposalId),
    governor.getActions(proposalId),
    governor.queryFilter(governor.filters.ProposalCreated(), ...blockRange),
    governor.admin(),
  ])
  const proposal = <ProposalStruct>_proposal
  const [targets, values, sigs, calldatas] = <ProposalActions>_actions

  const proposalCreatedEvent = proposalCreatedLogs.filter((log) => log.args?.id.toNumber() === proposalId)[0]
  if (!proposalCreatedEvent) throw new Error(`Proposal creation log for #${proposalId} not found in governor logs`)

  // --- Storage slots and offsets for GovernorBravo ---
  // TODO generalize this for other storage layouts by probing for slot numbers

  // Storage slots of variables in Governor
  const votingTokenSlot = '0x9' // slot of voting token, e.g. UNI, COMP  (getter is named after token, so can't generalize it that way)
  const proposalsMapSlot = '0xa' // proposals ID to proposal struct mapping

  // Storage slots of variables in Timelock
  const queuedTxsSlot = '0x3' // mapping from tx hash to bool about it's queue status

  // Proposal struct slot offsets, based on the proposal struct
  //     struct Proposal {
  //       uint id;
  //       address proposer;
  //       uint eta;
  //       address[] targets;
  //       uint[] values;
  //       string[] signatures;
  //       bytes[] calldatas;
  //       uint startBlock;
  //       uint endBlock;
  //       uint forVotes;
  //       uint againstVotes;
  //       uint abstainVotes;
  //       bool canceled;
  //       bool executed;
  //       mapping (address => Receipt) receipts;
  //     }
  const etaOffset = 2
  const forVotesOffset = 9
  const againstVotesOffset = 10
  const abstainVotesOffset = 11
  const canceledSlotOffset = 12 // this is packed with `executed`

  // Compute slot numbers
  const proposalSlot = getSolidityStorageSlotUint(proposalsMapSlot, proposal.id)
  const canceledSlot = hexZeroPad(BigNumber.from(proposalSlot).add(canceledSlotOffset).toHexString(), 32)
  const etaSlot = hexZeroPad(BigNumber.from(proposalSlot).add(etaOffset).toHexString(), 32)
  const forVotesSlot = hexZeroPad(BigNumber.from(proposalSlot).add(forVotesOffset).toHexString(), 32)
  const againstVotesSlot = hexZeroPad(BigNumber.from(proposalSlot).add(againstVotesOffset).toHexString(), 32)
  const abstainVotesSlot = hexZeroPad(BigNumber.from(proposalSlot).add(abstainVotesOffset).toHexString(), 32)

  // --- Prepare simulation configuration ---
  // We need the following state conditions to be true to successfully simulate a proposal:
  //   - proposal.canceled == false
  //   - proposal.executed == false
  //   - block.number > proposal.endBlock
  //   - proposal.forVotes > proposal.againstVotes
  //   - proposal.forVotes > quorumVotes
  //   - proposal.eta !== 0
  //   - block.timestamp >= proposal.eta
  //   - block.timestamp <  proposal.eta + timelock.GRACE_PERIOD()
  //   - queuedTransactions[txHash] = true for each action in the proposal

  // Get voting token and total supply
  const rawVotingToken = await provider.getStorageAt(governor.address, votingTokenSlot)
  const votingToken = getAddress(`0x${rawVotingToken.slice(26)}`)
  const votingTokenSupply = <BigNumber>await erc20(votingToken).totalSupply() // used to manipulate vote count

  // Set `from` arbitrarily, and set `value` and `simBlock` based on proposal properties
  const from = '0xD73a92Be73EfbFcF3854433A5FcbAbF9c1316073' // arbitrary EOA not used on-chain
  const value = (values as BigNumber[]).reduce((sum, cur) => sum.add(cur), BigNumber.from(0)).toString()
  const simBlock = proposal.endBlock.add(1)

  // Compute the approximate earliest possible execution time based on governance parameters. This
  // can only be approximate because voting period is defined in blocks, not as a timestamp. We
  // assume 12 second block times to prefer underestimating timestamp rather than overestimating,
  // and we prefer underestimating to avoid simulations reverting in cases where governance
  // proposals call methods that pass in a start timestamp that must be lower than the current
  // block timestamp (represented by the `simTimestamp` variable below)
  const simTimestamp = BigNumber.from(latestBlock.timestamp).add(simBlock.sub(proposal.endBlock).mul(12))
  const eta = simTimestamp // set proposal eta to be equal to the timestamp we simulate at

  // Compute transaction hashes used by the Timelock
  const txHashes = targets.map((target, i) => {
    const [val, sig, calldata] = [values[i], sigs[i], calldatas[i]]
    return keccak256(
      defaultAbiCoder.encode(['address', 'uint256', 'string', 'bytes', 'uint256'], [target, val, sig, calldata, eta])
    )
  })

  // Generate the state object needed to mark the transactions as queued in the Timelock's storage
  const timelockStorageObj: Record<string, string> = {}
  txHashes.forEach((hash) => {
    const slot = getSolidityStorageSlotBytes(queuedTxsSlot, hash)
    timelockStorageObj[slot] = hexZeroPad('0x1', 32) // boolean value of true, encoded
  })

  // --- Simulate it ---
  // Note: The Tenderly API is sensitive to the input types, so all formatting below (e.g. stripping
  // leading zeroes, padding with zeros, strings vs. hex, etc.) are all intentional decisions to
  // ensure Tenderly properly parses the simulation payload
  const simulationPayload: TenderlyPayload = {
    network_id: '1',
    // this field represents the block state to simulate against, so we use the latest block number
    block_number: latestBlock.number - 1, // subtract 1 to ensure block is mined and "finalized"
    from,
    to: governor.address,
    input: governor.interface.encodeFunctionData('execute', [proposal.id]),
    gas: BLOCK_GAS_LIMIT,
    gas_price: '0',
    value,
    save: false, // set this to true to see the simulated transaction in your Tenderly dashboard (useful for debugging)
    generate_access_list: true, // not required, but useful as a sanity check to ensure consistency in the simulation response
    block_header: {
      // this data represents what block.number and block.timestamp should return in the EVM during the simulation
      number: hexStripZeros(simBlock.toHexString()),
      timestamp: hexStripZeros(simTimestamp.toHexString()),
    },
    state_objects: {
      // Give `from` address 10 ETH to send transaction
      [from]: { balance: parseEther('10').toString() },
      // Ensure transactions are queued in the timelock
      [timelockAddress]: { storage: timelockStorageObj },
      // Ensure governor storage is properly configured so `state(proposalId)` returns `Queued`
      [governor.address]: {
        storage: {
          // Set the proposal ETA to a random future timestamp
          [etaSlot]: hexZeroPad(eta.toHexString(), 32),
          // Set for votes to the total supply of the voting token, and against and abstain votes to zero
          [forVotesSlot]: hexZeroPad(votingTokenSupply.toHexString(), 32),
          [againstVotesSlot]: hexZeroPad('0x0', 32),
          [abstainVotesSlot]: hexZeroPad('0x0', 32),
          // The canceled and execute slots are packed, so we can zero out that full slot
          [canceledSlot]: hexZeroPad('0x0', 32),
        },
      },
    },
  }
  const sim = await sendSimulation(simulationPayload)
  return { sim, proposal: proposalCreatedEvent.args as unknown as ProposalEvent, latestBlock }
}

/**
 * @notice Simulates execution of an already-executed governance proposal
 * @param config Configuration object
 */
async function simulateExecuted(config: SimulationConfigExecuted): Promise<SimulationResult> {
  const { governorAddress, proposalId } = config

  // --- Get details about the proposal we're analyzing ---
  const latestBlock = await provider.getBlock('latest')
  const blockRange = [0, latestBlock.number]
  const governor = governorBravo(governorAddress)

  const [createProposalLogs, proposalExecutedLogs] = await Promise.all([
    governor.queryFilter(governor.filters.ProposalCreated(), ...blockRange),
    governor.queryFilter(governor.filters.ProposalExecuted(), ...blockRange),
  ])

  const proposalCreatedEvent = createProposalLogs.filter((log) => log.args?.id.toNumber() === proposalId)[0]
  if (!proposalCreatedEvent) throw new Error(`Proposal creation log for #${proposalId} not found in governor logs`)
  const proposal = proposalCreatedEvent.args as unknown as ProposalEvent

  const proposalExecutedEvent = proposalExecutedLogs.filter((log) => log.args?.id.toNumber() === proposalId)[0]
  if (!proposalExecutedEvent) throw new Error(`Proposal execution log for #${proposalId} not found in governor logs`)

  // --- Simulate it ---
  // Prepare tenderly payload. Since this proposal was already executed, we directly use that transaction data
  const tx = await provider.getTransaction(proposalExecutedEvent.transactionHash)
  const simulationPayload: TenderlyPayload = {
    network_id: String(tx.chainId) as TenderlyPayload['network_id'],
    block_number: tx.blockNumber,
    from: tx.from,
    to: tx.to as string,
    input: tx.data,
    gas: tx.gasLimit.toNumber(),
    gas_price: tx.gasPrice?.toString(),
    value: tx.value.toString(),
    save: false,
    generate_access_list: true,
  }
  const sim = await sendSimulation(simulationPayload)
  return { sim, proposal, latestBlock }
}

// --- Helper methods ---

// Sleep for the specified number of milliseconds
const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay)) // delay in milliseconds

// Get a random integer between two values
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min) // max is exclusive, min is inclusive

/**
 * @notice Sends a transaction simulation request to the Tenderly API
 * @dev Uses a simple exponential backoff when requests fail, with the following parameters:
 *   - Initial delay is 1 second
 *   - We randomize the delay duration to avoid synchronization issues if client is sending multiple requests simultaneously
 *   - We double delay each time and throw an error if delay is over 8 seconds
 * @param payload Transaction simulation parameters
 * @param delay How long to wait until next simulation request after failure, in milliseconds
 */
async function sendSimulation(payload: TenderlyPayload, delay = 1000): Promise<TenderlySimulation> {
  try {
    // Send simulation request
    const fetchOptions = <Partial<FETCH_OPT>>{
      method: 'POST',
      type: 'json',
      headers: { 'X-Access-Key': TENDERLY_ACCESS_TOKEN },
      data: payload,
    }
    const sim = <TenderlySimulation>await fetchUrl(TENDERLY_URL, fetchOptions)

    // Post-processing to ensure addresses we use are checksummed (since ethers returns checksummed addresses)
    sim.transaction.addresses = sim.transaction.addresses.map(getAddress)
    sim.contracts.forEach((contract) => (contract.address = getAddress(contract.address)))
    return sim
  } catch (err: any) {
    const is429 = typeof err === 'object' && err?.statusCode === 400
    if (delay > 8000 || !is429) {
      console.warn(`Simulation request failed with the below request payload and error`)
      console.log(JSON.stringify(payload))
      throw err
    }
    console.warn(err)
    console.warn(
      `Simulation request failed with the above error, retrying in ~${delay} milliseconds. See request payload below`
    )
    console.log(JSON.stringify(payload))
    await sleep(delay + randomInt(0, 1000))
    return await sendSimulation(payload, delay * 2)
  }
}

/**
 * @notice Returns the storage slot for a Solidity mapping with uint keys, given the slot of the mapping itself
 * @dev Read more at https://docs.soliditylang.org/en/latest/internals/layout_in_storage.html#mappings-and-dynamic-arrays
 * @param mappingSlot Mapping slot in storage
 * @param key Mapping key to find slot for
 * @returns Storage slot
 */
function getSolidityStorageSlotUint(mappingSlot: string, key: BigNumberish) {
  // this will also work for address types, since address and uints are encoded the same way
  const slot = hexZeroPad(mappingSlot, 32)
  return hexStripZeros(keccak256(defaultAbiCoder.encode(['uint256', 'uint256'], [key, slot])))
}

/**
 * @notice Returns the storage slot for a Solidity mapping with bytes32 keys, given the slot of the mapping itself
 * @dev Read more at https://docs.soliditylang.org/en/latest/internals/layout_in_storage.html#mappings-and-dynamic-arrays
 * @param mappingSlot Mapping slot in storage
 * @param key Mapping key to find slot for
 * @returns Storage slot
 */
function getSolidityStorageSlotBytes(mappingSlot: string, key: BigNumberish) {
  const slot = hexZeroPad(mappingSlot, 32)
  return hexStripZeros(keccak256(defaultAbiCoder.encode(['bytes32', 'uint256'], [key, slot])))
}

/**
 * @notice Returns an ERC20 instance of the specified token
 * @param token Token address
 */
function erc20(token: string) {
  // ABI only contains view methods and events
  const ERC20_ABI = [
    'function name() external view returns (string)',
    'function symbol() external view returns (string)',
    'function decimals() external view returns (uint8)',
    'function balanceOf(address owner) external view returns (uint256 balance)',
    'function totalSupply() external view returns (uint256)',
    'event Transfer(address indexed from, address indexed to, uint256 value)',
    'event Approval(address indexed owner, address indexed spender, uint256 value)',
  ]
  return new Contract(token, ERC20_ABI, provider)
}
