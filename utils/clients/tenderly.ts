import { getAddress } from '@ethersproject/address'
import { defaultAbiCoder } from '@ethersproject/abi'
import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { hexStripZeros, hexZeroPad } from '@ethersproject/bytes'
import { Contract } from '@ethersproject/contracts'
import { keccak256 } from '@ethersproject/keccak256'
import { parseEther } from '@ethersproject/units'
import { provider } from './ethers'

import fetchUrl, { FETCH_OPT } from 'micro-ftch'
import { aaveGovV2 } from '../contracts/aave-governance-v2'
import { BLOCK_GAS_LIMIT, TENDERLY_ACCESS_TOKEN, TENDERLY_BASE_URL, TENDERLY_SIM_URL } from '../constants'
import {
  ProposalCreatedEvent,
  ProposalStruct,
  SimulationConfig,
  SimulationConfigExecuted,
  SimulationConfigProposed,
  SimulationResult,
  TenderlyContract,
  TenderlyPayload,
  TenderlySimulation,
} from '../../types'
import { votingStrategy } from '../contracts/voting-strategy'
import { executor } from '../contracts/executor'

const TENDERLY_FETCH_OPTIONS = { type: 'json', headers: { 'X-Access-Key': TENDERLY_ACCESS_TOKEN } }

// --- Simulation methods ---

/**
 * @notice Simulates a proposal based on the provided configuration
 * @param config Configuration object
 */
export async function simulate(config: SimulationConfig) {
  if (config.type === 'executed') return await simulateExecuted(config)
  else if (config.type === 'proposed') return await simulateProposed(config)
  throw new Error(`Unsupported simulation type`)
}

/**
 * @notice Simulates execution of an on-chain proposal that has not yet been executed
 * @param config Configuration object
 */
async function simulateProposed(config: SimulationConfigProposed): Promise<SimulationResult> {
  const { governanceAddress, proposalId } = config

  // --- Get details about the proposal we're simulating ---
  const network = await provider.getNetwork()
  const blockNumberToUse = (await getLatestBlock(network.chainId)) - 3 // subtracting a few blocks to ensure tenderly has the block
  const latestBlock = await provider.getBlock(blockNumberToUse)
  const blockRange = [0, latestBlock.number]
  const governance = aaveGovV2(governanceAddress)

  const [_proposal, proposalCreatedLogs] = await Promise.all([
    governance.getProposalById(proposalId),
    governance.queryFilter(governance.filters.ProposalCreated(), ...blockRange),
  ])

  const proposal = <ProposalStruct>_proposal
  const { targets, signatures: sigs, calldatas, executor: executorAddress } = proposal

  // When there is no values, the contract doesn't return any named parameter
  const values = _proposal[4]
  const withDelegatecalls = _proposal[7]

  const proposalCreatedEvent = proposalCreatedLogs.filter((log) => log.args?.id.toNumber() === proposalId)[0]
  if (!proposalCreatedEvent) throw new Error(`Proposal creation log for #${proposalId} not found in governance logs`)

  // --- Storage slots and offsets for AaveGovernanceV2 ---
  const govSlots = getAaveGovernanceV2Slots(proposal.id)
  const queuedTxsSlot = '0x3' // executor mapping from tx hash to bool about it's queue status

  // --- Prepare simulation configuration ---
  // We need the following state conditions to be true to successfully simulate a proposal:
  //   - proposal.canceled == false
  //   - proposal.executed == false
  //   - block.number > proposal.endBlock
  //   - proposal.forVotes > proposal.againstVotes
  //   - proposal.forVotes > quorumVotes
  //   - proposal.eta !== 0
  //   - block.timestamp >= proposal.eta
  //   - block.timestamp <  proposal.eta + executor.GRACE_PERIOD()
  //   - queuedTransactions[txHash] = true for each action in the proposal

  // Get voting token and total supply
  const rawVotingStrategyAddress = await provider.getStorageAt(governance.address, govSlots.votingStrategySlot)
  const votingStrategyAddress = getAddress(`0x${rawVotingStrategyAddress.slice(26)}`)
  const totalVotingSupply = <BigNumber>(
    await votingStrategy(votingStrategyAddress).getTotalVotingSupplyAt(_proposal.startBlock)
  )
  const FAKE_IPFS_HASH = `0000`

  console.log('votingStrategyAddress', votingStrategyAddress)
  console.log('executor', executorAddress)

  // Set `from` arbitrarily, and set `value` and `simBlock` based on proposal properties
  const from = '0xD73a92Be73EfbFcF3854433A5FcbAbF9c1316073' // arbitrary EOA not used on-chain
  const value = (values as BigNumber[]).reduce((sum, cur) => sum.add(cur), BigNumber.from(0)).toString()
  const endBlock = proposal.endBlock

  const executorContract = executor(executorAddress)
  const delay = await executorContract.getDelay()
  const duration = await executorContract.VOTING_DURATION()
  const quorum = await executorContract.MINIMUM_QUORUM()

  const SNAPSHOT_BLOCK_NUMBER = proposal.startBlock.add(1).toNumber()
  const VOTING_DURATION = duration.toNumber() + 1 // block number voting duration
  const VOTING_DELAY = delay.toNumber() + 1 // 1 sec margin in seconds
  const EVM_BLOCK_NUMBER = SNAPSHOT_BLOCK_NUMBER + VOTING_DURATION
  const EVM_EXECUTION_TIME = (await provider.getBlock(SNAPSHOT_BLOCK_NUMBER)).timestamp + VOTING_DURATION * 13
  const FORCED_EXECUTION_TIME = EVM_EXECUTION_TIME + VOTING_DELAY

  console.log('Snapshot block number', SNAPSHOT_BLOCK_NUMBER)
  console.log('Execution time to force on proposal & simulation timestamp', FORCED_EXECUTION_TIME)
  console.log('Simulation block number', EVM_BLOCK_NUMBER)

  // Compute the approximate earliest possible execution time based on governance parameters. This
  // can only be approximate because voting period is defined in blocks, not as a timestamp. We
  // assume 12 second block times to prefer underestimating timestamp rather than overestimating,
  // and we prefer underestimating to avoid simulations reverting in cases where governance
  // proposals call methods that pass in a start timestamp that must be lower than the current
  // block timestamp (represented by the `simTimestamp` variable below)

  // Compute transaction hashes used by the Executor
  const txHashes = targets.map((target, i) => {
    const [val, sig, calldata, withDelegatecall] = [values[i], sigs[i], calldatas[i], withDelegatecalls[i]]
    return keccak256(
      defaultAbiCoder.encode(
        ['address', 'uint256', 'string', 'bytes', 'uint256', 'bool'],
        [target, val, sig, calldata, FORCED_EXECUTION_TIME, withDelegatecall]
      )
    )
  })

  // Generate the state object needed to mark the transactions as queued in the Executor's storage
  const executorStorageObj: Record<string, string> = {}
  txHashes.forEach((hash) => {
    const slot = getSolidityStorageSlotBytes(queuedTxsSlot, hash)
    executorStorageObj[slot] = hexZeroPad('0x1', 32) // boolean value of true, encoded
  })

  // --- Simulate it ---
  // Note: The Tenderly API is sensitive to the input types, so all formatting below (e.g. stripping
  // leading zeroes, padding with zeros, strings vs. hex, etc.) are all intentional decisions to
  // ensure Tenderly properly parses the simulation payload
  const simulationPayload: TenderlyPayload = {
    network_id: '1',
    // this field represents the block state to simulate against, so we use the latest block number
    block_number: SNAPSHOT_BLOCK_NUMBER,
    from,
    to: governance.address,
    input: governance.interface.encodeFunctionData('execute', [proposal.id]),
    gas: BLOCK_GAS_LIMIT,
    gas_price: '0',
    value,
    save: true, // set this to true to see the simulated transaction in your Tenderly dashboard (useful for debugging)
    generate_access_list: true, // not required, but useful as a sanity check to ensure consistency in the simulation response
    block_header: {
      // this data represents what block.number and block.timestamp should return in the EVM during the simulation
      number: hexStripZeros(BigNumber.from(EVM_BLOCK_NUMBER).toHexString()),
      timestamp: hexStripZeros(BigNumber.from(FORCED_EXECUTION_TIME).toHexString()),
    },
    state_objects: {
      // Give `from` address 10 ETH to send transaction
      [from]: { balance: parseEther('10').toString() },
      // Ensure transactions are queued in the executor
      [executorAddress]: { storage: executorStorageObj },
      // Ensure governance storage is properly configured so `state(proposalId)` returns `Queued`
      [governance.address]: {
        storage: {
          // Set the proposal ETA to a random future timestamp
          [govSlots.eta]: hexZeroPad(BigNumber.from(FORCED_EXECUTION_TIME).toHexString(), 32),
          // Set for votes to 2% of total votingPower so quorum is valid
          [govSlots.forVotes]: hexZeroPad(totalVotingSupply.mul(quorum).div(10000).toHexString(), 32),
          // Set against votes to 0 so the diff is valid
          [govSlots.againstVotes]: hexZeroPad('0x0', 32),
          // The canceled and execute slots are packed, so we can zero out that full slot
          [govSlots.canceled]: hexZeroPad(`${votingStrategyAddress}${FAKE_IPFS_HASH}`, 32),
        },
      },
    },
  }
  const sim = await sendSimulation(simulationPayload)
  return { sim, proposal: proposalCreatedEvent.args as unknown as ProposalCreatedEvent, latestBlock }
}

/**
 * @notice Simulates execution of an already-executed governance proposal
 * @param config Configuration object
 */
async function simulateExecuted(config: SimulationConfigExecuted): Promise<SimulationResult> {
  const { governanceAddress, proposalId } = config

  // --- Get details about the proposal we're analyzing ---
  const latestBlock = await provider.getBlock('latest')
  const blockRange = [0, latestBlock.number]
  const governance = aaveGovV2(governanceAddress)

  const [createProposalLogs, proposalExecutedLogs] = await Promise.all([
    governance.queryFilter(governance.filters.ProposalCreated(), ...blockRange),
    governance.queryFilter(governance.filters.ProposalExecuted(), ...blockRange),
  ])

  const proposalCreatedEvent = createProposalLogs.filter((log) => log.args?.id.toNumber() === proposalId)[0]
  if (!proposalCreatedEvent) throw new Error(`Proposal creation log for #${proposalId} not found in governance logs`)
  const proposal = proposalCreatedEvent.args as unknown as ProposalCreatedEvent

  const proposalExecutedEvent = proposalExecutedLogs.filter((log) => log.args?.id.toNumber() === proposalId)[0]
  if (!proposalExecutedEvent) throw new Error(`Proposal execution log for #${proposalId} not found in governance logs`)

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
export const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay)) // delay in milliseconds

// Get a random integer between two values
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min) // max is exclusive, min is inclusive

/**
 * @notice Given a Tenderly contract object, generates a descriptive human-friendly name for that contract
 * @param contract Tenderly contract object to generate name from
 */
export function getContractName(contract: TenderlyContract | undefined, address: string) {
  if (!contract) return `unknown contract name at \`${getAddress(address)}\``
  let contractName = contract?.contract_name

  // If the contract is a token, include the full token name. This is useful in cases where the
  // token is a proxy, so the contract name doesn't give much useful information
  if (contract?.token_data?.name) contractName += ` (${contract?.token_data?.name})`

  // Lastly, append the contract address and save it off
  return `${contractName} at \`${getAddress(contract.address)}\``
}

/**
 * Gets the latest block number known to Tenderly
 * @param chainId Chain ID to get block number for
 */
async function getLatestBlock(chainId: BigNumberish): Promise<number> {
  // Send simulation request
  const fetchOptions = <Partial<FETCH_OPT>>{ method: 'GET', ...TENDERLY_FETCH_OPTIONS }
  const res = <{ block_number: number }>(
    await fetchUrl(`${TENDERLY_BASE_URL}/network/${BigNumber.from(chainId).toString()}/block-number`, fetchOptions)
  )
  return res.block_number
}

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
    const fetchOptions = <Partial<FETCH_OPT>>{ method: 'POST', data: payload, ...TENDERLY_FETCH_OPTIONS }
    const sim = <TenderlySimulation>await fetchUrl(TENDERLY_SIM_URL, fetchOptions)

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
 * @notice Returns an object containing various AaveGovernanceV2 slots
 * @param id Proposal ID
 */
export function getAaveGovernanceV2Slots(proposalId: BigNumberish) {
  // TODO generalize this for other storage layouts

  // struct Proposal {
  //   uint256 id;
  //   address creator;
  //   IExecutorWithTimelock executor;
  //   address[] targets;
  //   uint256[] values;
  //   string[] signatures;
  //   bytes[] calldatas;
  //   bool[] withDelegatecalls;
  //   uint256 startBlock;
  //   uint256 endBlock;
  //   uint256 executionTime;
  //   uint256 forVotes;
  //   uint256 againstVotes;
  //   bool executed;
  //   bool canceled;
  //   address strategy;
  //   bytes32 ipfsHash;
  //   mapping(address => Vote) votes;
  // }

  const etaOffset = 10
  const forVotesOffset = 11
  const againstVotesOffset = 12
  const canceledSlotOffset = 13 // this is packed with `executed`

  // Compute and return slot numbers
  const proposalsMapSlot = '0x4' // proposals ID to proposal struct mapping
  const proposalSlot = getSolidityStorageSlotUint(proposalsMapSlot, proposalId)
  return {
    votingStrategySlot: '0x1', // slot of voting strategy
    proposalsMap: proposalsMapSlot,
    proposal: proposalSlot,
    canceled: hexZeroPad(BigNumber.from(proposalSlot).add(canceledSlotOffset).toHexString(), 32),
    eta: hexZeroPad(BigNumber.from(proposalSlot).add(etaOffset).toHexString(), 32),
    forVotes: hexZeroPad(BigNumber.from(proposalSlot).add(forVotesOffset).toHexString(), 32),
    againstVotes: hexZeroPad(BigNumber.from(proposalSlot).add(againstVotesOffset).toHexString(), 32),
  }
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
