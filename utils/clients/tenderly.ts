import { getAddress } from '@ethersproject/address'
import { defaultAbiCoder } from '@ethersproject/abi'
import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { hexStripZeros } from '@ethersproject/bytes'
import { HashZero, Zero } from '@ethersproject/constants'
import { keccak256 } from '@ethersproject/keccak256'
import { toUtf8Bytes } from '@ethersproject/strings'
import { l1provider, provider, arb1provider } from './ethers'
import mftch, { FETCH_OPT } from 'micro-ftch'
// @ts-ignore
const fetchUrl = mftch.default
import {
  generateProposalId,
  getGovernor,
  getProposal,
  getProposalId,
  getTimelock,
  getVotingToken,
  hashOperationOz,
  hashOperationBatchOz,
} from '../contracts/governor'
import {
  BLOCK_GAS_LIMIT,
  TENDERLY_ACCESS_TOKEN,
  TENDERLY_BASE_URL,
  TENDERLY_ENCODE_URL,
  TENDERLY_SIM_URL,
} from '../constants'
import {
  ProposalEvent,
  ProposalStruct,
  SimulationConfig,
  SimulationConfigExecuted,
  SimulationConfigNew,
  SimulationConfigProposed,
  SimulationConfigArbL2ToL1,
  SimulationResult,
  StorageEncodingResponse,
  TenderlyContract,
  TenderlyPayload,
  TenderlySimulation,
  SimulationConfigArbRetryable,
} from '../../types'
import { writeFileSync } from 'fs'
import { Interface } from 'ethers/lib/utils'
import { ethers } from 'ethers'

const TENDERLY_FETCH_OPTIONS = { type: 'json', headers: { 'X-Access-Key': TENDERLY_ACCESS_TOKEN } }
const DEFAULT_FROM = '0xD73a92Be73EfbFcF3854433A5FcbAbF9c1316073' // arbitrary EOA not used on-chain

// --- Simulation methods ---

/**
 * @notice Simulates a proposal based on the provided configuration
 * @param config Configuration object
 */
export async function simulate(config: SimulationConfig) {
  if (config.type === 'executed') return await simulateExecuted(config)
  else if (config.type === 'proposed') return await simulateProposed(config)
  else if (config.type === 'new') return await simulateNew(config)
  else if (config.type === 'arbl2tol1') return await simulateArbitrumL2ToL1(config)
  else if (config.type === 'arbretryable') return await simulateArbitrumRetryable(config)
  throw new Error('Invalid simulation type')
}

function govTypeToNetwork(govType: string) {
  switch (govType) {
    case 'arb':
      return '42161'
    default:
      return '1'
  }
}

/**
 * @notice Simulates execution of an on-chain proposal that has not yet been executed
 * @param config Configuration object
 */
async function simulateNew(config: SimulationConfigNew): Promise<SimulationResult> {
  // --- Validate config ---
  const { governorAddress, governorType, targets, values, signatures, calldatas, description } = config
  if (targets.length !== values.length) throw new Error('targets and values must be the same length')
  if (targets.length !== signatures.length) throw new Error('targets and signatures must be the same length')
  if (targets.length !== calldatas.length) throw new Error('targets and calldatas must be the same length')

  // --- Get details about the proposal we're simulating ---
  const network = await provider.getNetwork()
  const blockNumberToUse = (await getLatestBlock(network.chainId)) - 3 // subtracting a few blocks to ensure tenderly has the block
  const latestBlock = await provider.getBlock(blockNumberToUse)
  const governor = getGovernor(governorType, governorAddress)

  const [proposalId, timelock] = await Promise.all([
    generateProposalId(governorType, governorAddress, { targets, values, calldatas, description }),
    getTimelock(governorType, governorAddress),
  ])

  const startBlock = BigNumber.from(latestBlock.number - 100) // arbitrarily subtract 100
  const proposal: ProposalEvent = {
    id: proposalId, // Bravo governor
    proposalId, // OZ governor (for simplicity we just include both ID formats)
    proposer: DEFAULT_FROM,
    startBlock,
    endBlock: startBlock.add(1),
    description,
    targets,
    values: values.map(BigNumber.from),
    signatures,
    calldatas,
    chainid: network.chainId.toString(),
  }

  // --- Prepare simulation configuration ---
  // Get voting token and total supply
  const votingToken = await getVotingToken(governorType, governorAddress, proposalId)
  const votingTokenSupply = <BigNumber>await votingToken.totalSupply() // used to manipulate vote count

  // Set `from` arbitrarily.
  const from = DEFAULT_FROM

  // Run simulation at the block right after the proposal ends.
  const simBlock = proposal.endBlock!.add(1)

  // For OZ governors we arbitrarily choose execution time. For Bravo governors, we
  // compute the approximate earliest possible execution time based on governance parameters. This
  // can only be approximate because voting period is defined in blocks, not as a timestamp. We
  // assume 12 second block times to prefer underestimating timestamp rather than overestimating,
  // and we prefer underestimating to avoid simulations reverting in cases where governance
  // proposals call methods that pass in a start timestamp that must be lower than the current
  // block timestamp (represented by the `simTimestamp` variable below)
  const simTimestamp =
    governorType === 'bravo'
      ? BigNumber.from(latestBlock.timestamp).add(simBlock.sub(proposal.endBlock!).mul(12))
      : BigNumber.from(latestBlock.timestamp + 1)
  const eta = simTimestamp // set proposal eta to be equal to the timestamp we simulate at

  // Compute transaction hashes used by the Timelock
  const txHashes = targets.map((target, i) => {
    const [val, sig, calldata] = [values[i], signatures[i], calldatas[i]]
    return keccak256(
      defaultAbiCoder.encode(['address', 'uint256', 'string', 'bytes', 'uint256'], [target, val, sig, calldata, eta])
    )
  })

  // Generate the state object needed to mark the transactions as queued in the Timelock's storage
  const timelockStorageObj: Record<string, string> = {}
  txHashes.forEach((hash) => {
    timelockStorageObj[`queuedTransactions[${hash}]`] = 'true'
  })

  if (governorType === 'oz' || governorType === 'arb') {
    const id = hashOperationBatchOz(targets, values, calldatas, HashZero, keccak256(toUtf8Bytes(description)))
    timelockStorageObj[`_timestamps[${id.toHexString()}]`] = simTimestamp.toString()
  }

  // Use the Tenderly API to get the encoded state overrides for governor storage
  let governorStateOverrides: Record<string, string> = {}
  if (governorType === 'bravo') {
    const proposalKey = `proposals[${proposalId.toString()}]`
    governorStateOverrides = {
      proposalCount: proposalId.toString(),
      [`${proposalKey}.id`]: proposalId.toString(),
      [`${proposalKey}.proposer`]: DEFAULT_FROM,
      [`${proposalKey}.eta`]: eta.toString(),
      [`${proposalKey}.startBlock`]: proposal.startBlock.toString(),
      [`${proposalKey}.endBlock`]: proposal.endBlock.toString(),
      [`${proposalKey}.canceled`]: 'false',
      [`${proposalKey}.executed`]: 'false',
      [`${proposalKey}.forVotes`]: votingTokenSupply.toString(),
      [`${proposalKey}.againstVotes`]: '0',
      [`${proposalKey}.abstainVotes`]: '0',
    }

    targets.forEach((target, i) => {
      const value = BigNumber.from(values[i]).toString()
      governorStateOverrides[`${proposalKey}.targets[${i}]`] = target
      governorStateOverrides[`${proposalKey}.values[${i}]`] = value
      governorStateOverrides[`${proposalKey}.signatures[${i}]`] = signatures[i]
      governorStateOverrides[`${proposalKey}.calldatas[${i}]`] = calldatas[i]
    })
  } else if (governorType === 'oz') {
    const proposalCoreKey = `_proposals[${proposalId.toString()}]`
    const proposalVotesKey = `_proposalVotes[${proposalId.toString()}]`
    governorStateOverrides = {
      [`${proposalCoreKey}.voteEnd._deadline`]: simBlock.sub(1).toString(),
      [`${proposalCoreKey}.canceled`]: 'false',
      [`${proposalCoreKey}.executed`]: 'false',
      [`${proposalVotesKey}.forVotes`]: votingTokenSupply.toString(),
      [`${proposalVotesKey}.againstVotes`]: '0',
      [`${proposalVotesKey}.abstainVotes`]: '0',
    }

    targets.forEach((target, i) => {
      const id = hashOperationOz(target, values[i], calldatas[i], HashZero, HashZero)
      governorStateOverrides[`_timestamps[${id}]`] = '2' // must be > 1.
    })
  } else if (governorType === 'arb') {
    const proposalCoreKey = `_proposals[${proposalId.toString()}]`
    const proposalVotesKey = `_proposalVotes[${proposalId.toString()}]`
    // this need to be L1 block number but simBlock is L2 block number
    // cannot use 0, but also need be less than current, so using 1 as a dummy value here
    governorStateOverrides = {
      [`${proposalCoreKey}.voteStart._deadline`]: '1',
      [`${proposalCoreKey}.voteEnd._deadline`]: '1',
      [`${proposalCoreKey}.canceled`]: 'false',
      [`${proposalCoreKey}.executed`]: 'false',
      [`${proposalVotesKey}.forVotes`]: votingTokenSupply.toString(),
      [`${proposalVotesKey}.againstVotes`]: '0',
      [`${proposalVotesKey}.abstainVotes`]: '0',
    }

    targets.forEach((target, i) => {
      const id = hashOperationOz(target, values[i], calldatas[i], HashZero, HashZero)
      governorStateOverrides[`_timestamps[${id}]`] = '2' // must be > 1.
    })
  } else {
    throw new Error(`Cannot generate overrides for unknown governor type: ${governorType}`)
  }

  const stateOverrides = {
    networkID: govTypeToNetwork(governorType),
    stateOverrides: {
      [timelock.address]: {
        value: timelockStorageObj,
      },
      [governor.address]: {
        value: governorStateOverrides,
      },
    },
  }

  const storageObj = await sendEncodeRequest(stateOverrides)

  // --- Simulate it ---
  // We need the following state conditions to be true to successfully simulate a proposal:
  //   - proposalCount >= proposal.id
  //   - proposal.canceled == false
  //   - proposal.executed == false
  //   - block.number > proposal.endBlock
  //   - proposal.forVotes > proposal.againstVotes
  //   - proposal.forVotes > quorumVotes
  //   - proposal.eta !== 0
  //   - block.timestamp >= proposal.eta
  //   - block.timestamp <  proposal.eta + timelock.GRACE_PERIOD()
  //   - queuedTransactions[txHash] = true for each action in the proposal
  const descriptionHash = keccak256(toUtf8Bytes(description))
  const executeInputs =
    governorType === 'bravo' ? [proposalId.toString()] : [targets, values, calldatas, descriptionHash]
  const simulationPayload: TenderlyPayload = {
    network_id: govTypeToNetwork(governorType),
    // this field represents the block state to simulate against, so we use the latest block number
    block_number: latestBlock.number,
    from: DEFAULT_FROM,
    to: governor.address,
    input: governor.interface.encodeFunctionData('execute', executeInputs),
    gas: BLOCK_GAS_LIMIT,
    gas_price: '0',
    value: '0', // TODO Support sending ETH in local simulations like we do below in `simulateProposed`.
    save_if_fails: true, // Set to true to save the simulation to your Tenderly dashboard if it fails.
    save: true, // Set to true to save the simulation to your Tenderly dashboard if it succeeds.
    generate_access_list: true, // not required, but useful as a sanity check to ensure consistency in the simulation response
    block_header: {
      // this data represents what block.number and block.timestamp should return in the EVM during the simulation
      number: hexStripZeros(simBlock.toHexString()),
      timestamp: hexStripZeros(simTimestamp.toHexString()),
    },
    state_objects: {
      // Since gas price is zero, the sender needs no balance.
      // TODO Support sending ETH in local simulations like we do below in `simulateProposed`.
      [from]: { balance: '0' },
      // Ensure transactions are queued in the timelock
      [timelock.address]: { storage: storageObj.stateOverrides[timelock.address.toLowerCase()].value },
      // Ensure governor storage is properly configured so `state(proposalId)` returns `Queued`
      [governor.address]: { storage: storageObj.stateOverrides[governor.address.toLowerCase()].value },
    },
  }
  const sim = await sendSimulation(simulationPayload)
  writeFileSync('new-response.json', JSON.stringify(sim, null, 2))
  return { sim, proposal, latestBlock }
}

/**
 * @notice Simulates execution of an on-chain proposal that has not yet been executed
 * @param config Configuration object
 */
async function simulateProposed(config: SimulationConfigProposed): Promise<SimulationResult> {
  const { governorAddress, governorType, proposalId } = config

  // --- Get details about the proposal we're simulating ---
  const network = await provider.getNetwork()
  const blockNumberToUse = (await getLatestBlock(network.chainId)) - 3 // subtracting a few blocks to ensure tenderly has the block
  const latestBlock = await provider.getBlock(blockNumberToUse)
  const blockRange = [0, latestBlock.number]
  const governor = getGovernor(governorType, governorAddress)

  const [_proposal, proposalCreatedLogs, timelock] = await Promise.all([
    getProposal(governorType, governorAddress, proposalId),
    governor.queryFilter(governor.filters.ProposalCreated(), ...blockRange),
    getTimelock(governorType, governorAddress),
  ])
  const proposal = <ProposalStruct>_proposal

  const proposalCreatedEvent = proposalCreatedLogs.filter((log) => {
    return getProposalId(log.args as unknown as ProposalEvent).eq(proposalId)
  })[0]
  if (!proposalCreatedEvent) throw new Error(`Proposal creation log for #${proposalId} not found in governor logs`)
  const { targets, signatures: sigs, calldatas, description } = proposalCreatedEvent.args as unknown as ProposalEvent

  // Workaround an issue that ethers cannot decode the values properly.
  // We know that the values are the 4th parameter in
  // `ProposalCreated(proposalId, proposer, targets, values, signatures, calldatas, startBlock, endBlock, description)`
  const values: BigNumber[] = proposalCreatedEvent.args![3]

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
  const votingToken = await getVotingToken(governorType, governorAddress, proposal.id)
  const votingTokenSupply = <BigNumber>await votingToken.totalSupply() // used to manipulate vote count

  // Set `from` arbitrarily.
  const from = DEFAULT_FROM

  // For Bravo governors, we use the block right after the proposal ends, and for OZ
  // governors we arbitrarily use the next block number.
  const simBlock = governorType === 'bravo' ? proposal.endBlock!.add(1) : BigNumber.from(latestBlock.number + 1)

  // For OZ governors we are given the earliest possible execution time. For Bravo governors, we
  // Compute the approximate earliest possible execution time based on governance parameters. This
  // can only be approximate because voting period is defined in blocks, not as a timestamp. We
  // assume 12 second block times to prefer underestimating timestamp rather than overestimating,
  // and we prefer underestimating to avoid simulations reverting in cases where governance
  // proposals call methods that pass in a start timestamp that must be lower than the current
  // block timestamp (represented by the `simTimestamp` variable below)
  const simTimestamp =
    governorType === 'bravo'
      ? BigNumber.from(latestBlock.timestamp).add(simBlock.sub(proposal.endBlock!).mul(12))
      : proposal.endTime!.add(1)
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
    timelockStorageObj[`queuedTransactions[${hash}]`] = 'true'
  })

  if (governorType === 'oz' || governorType === 'arb') {
    const id = hashOperationBatchOz(targets, values, calldatas, HashZero, keccak256(toUtf8Bytes(description)))
    timelockStorageObj[`_timestamps[${id.toHexString()}]`] = simTimestamp.toString()
  }

  const proposalIdBn = BigNumber.from(proposalId)
  let governorStateOverrides: Record<string, string> = {}
  if (governorType === 'bravo') {
    const proposalKey = `proposals[${proposalIdBn.toString()}]`
    governorStateOverrides = {
      proposalCount: proposalId.toString(),
      [`${proposalKey}.eta`]: eta.toString(),
      [`${proposalKey}.canceled`]: 'false',
      [`${proposalKey}.executed`]: 'false',
      [`${proposalKey}.forVotes`]: votingTokenSupply.toString(),
      [`${proposalKey}.againstVotes`]: '0',
      [`${proposalKey}.abstainVotes`]: '0',
    }
  } else if (governorType === 'oz') {
    const proposalCoreKey = `_proposals[${proposalIdBn.toString()}]`
    const proposalVotesKey = `_proposalVotes[${proposalIdBn.toString()}]`
    governorStateOverrides = {
      [`${proposalCoreKey}.voteEnd._deadline`]: simBlock.sub(1).toString(),
      [`${proposalCoreKey}.canceled`]: 'false',
      [`${proposalCoreKey}.executed`]: 'false',
      [`${proposalVotesKey}.forVotes`]: votingTokenSupply.toString(),
      [`${proposalVotesKey}.againstVotes`]: '0',
      [`${proposalVotesKey}.abstainVotes`]: '0',
    }
  } else if (governorType === 'arb') {
    const proposalCoreKey = `_proposals[${proposalIdBn.toString()}]`
    const proposalVotesKey = `_proposalVotes[${proposalIdBn.toString()}]`
    // this need to be L1 block number but simBlock is L2 block number
    // cannot use 0, but also need be less than current, so using 1 as a dummy value here
    governorStateOverrides = {
      [`${proposalCoreKey}.voteStart._deadline`]: '1',
      [`${proposalCoreKey}.voteEnd._deadline`]: '1',
      [`${proposalCoreKey}.canceled`]: 'false',
      [`${proposalCoreKey}.executed`]: 'false',
      [`${proposalVotesKey}.forVotes`]: votingTokenSupply.toString(),
      [`${proposalVotesKey}.againstVotes`]: '0',
      [`${proposalVotesKey}.abstainVotes`]: '0',
    }
  } else {
    throw new Error(`Cannot generate overrides for unknown governor type: ${governorType}`)
  }

  const stateOverrides = {
    networkID: govTypeToNetwork(governorType),
    stateOverrides: {
      [timelock.address]: {
        value: timelockStorageObj,
      },
      [governor.address]: {
        value: governorStateOverrides,
      },
    },
  }
  const storageObj = await sendEncodeRequest(stateOverrides)

  // --- Simulate it ---
  // Note: The Tenderly API is sensitive to the input types, so all formatting below (e.g. stripping
  // leading zeroes, padding with zeros, strings vs. hex, etc.) are all intentional decisions to
  // ensure Tenderly properly parses the simulation payload
  const descriptionHash = keccak256(toUtf8Bytes(description))
  const executeInputs =
    governorType === 'bravo' ? [proposalId.toString()] : [targets, values, calldatas, descriptionHash]

  let simulationPayload: TenderlyPayload = {
    network_id: govTypeToNetwork(governorType),
    // this field represents the block state to simulate against, so we use the latest block number
    block_number: latestBlock.number,
    from,
    to: governor.address,
    input: governor.interface.encodeFunctionData('execute', executeInputs),
    gas: BLOCK_GAS_LIMIT,
    gas_price: '0',
    value: '0',
    save_if_fails: true, // Set to true to save the simulation to your Tenderly dashboard if it fails.
    save: true, // Set to true to save the simulation to your Tenderly dashboard if it succeeds.
    generate_access_list: true, // not required, but useful as a sanity check to ensure consistency in the simulation response
    block_header: {
      // this data represents what block.number and block.timestamp should return in the EVM during the simulation
      number: hexStripZeros(simBlock.toHexString()),
      timestamp: hexStripZeros(simTimestamp.toHexString()),
    },
    state_objects: {
      // Since gas price is zero, the sender needs no balance. If the sender does need a balance to
      // send ETH with the execution, this will be overridden later.
      [from]: { balance: '0' },
      // Ensure transactions are queued in the timelock
      [timelock.address]: { storage: storageObj.stateOverrides[timelock.address.toLowerCase()].value },
      // Ensure governor storage is properly configured so `state(proposalId)` returns `Queued`
      [governor.address]: { storage: storageObj.stateOverrides[governor.address.toLowerCase()].value },
    },
  }

  const formattedProposal: ProposalEvent = {
    ...(proposalCreatedEvent.args as unknown as ProposalEvent),
    values, // This does not get included otherwise, same reason why we use `proposalCreatedEvent.args![3]` above.
    id: BigNumber.from(proposalId), // Make sure we always have an ID field
    chainid: network.chainId.toString(),
  }

  let sim = await sendSimulation(simulationPayload)
  const totalValue = values.reduce((sum, cur) => sum.add(cur), Zero)

  // Sim succeeded, or failure was not due to an ETH balance issue, so return the simulation.
  if (sim.simulation.status || totalValue.eq(Zero)) return { sim, proposal: formattedProposal, latestBlock }

  // Simulation failed, try again by setting value to the difference between total call values and governor ETH balance.
  const governorEthBalance = await provider.getBalance(governor.address)
  const newValue = totalValue.sub(governorEthBalance).toString()
  simulationPayload.value = newValue
  simulationPayload.state_objects![from].balance = newValue
  sim = await sendSimulation(simulationPayload)
  if (sim.simulation.status) return { sim, proposal: formattedProposal, latestBlock }

  // Simulation failed, try again by setting value to the total call values.
  simulationPayload.value = totalValue.toString()
  simulationPayload.state_objects![from].balance = totalValue.toString()
  sim = await sendSimulation(simulationPayload)
  return { sim, proposal: formattedProposal, latestBlock }
}

/**
 * @notice Simulates execution of an already-executed governance proposal
 * @param config Configuration object
 */
async function simulateExecuted(config: SimulationConfigExecuted): Promise<SimulationResult> {
  const { governorAddress, governorType, proposalId } = config

  // --- Get details about the proposal we're analyzing ---
  const latestBlock = await provider.getBlock('latest')
  const blockRange = [0, latestBlock.number]
  const governor = getGovernor(governorType, governorAddress)

  const [createProposalLogs, proposalExecutedLogs] = await Promise.all([
    governor.queryFilter(governor.filters.ProposalCreated(), ...blockRange),
    governor.queryFilter(governor.filters.ProposalExecuted(), ...blockRange),
  ])

  const proposalCreatedEvent = createProposalLogs.filter((log) => {
    return getProposalId(log.args as unknown as ProposalEvent).eq(proposalId)
  })[0]
  if (!proposalCreatedEvent) throw new Error(`Proposal creation log for #${proposalId} not found in governor logs`)
  const proposal = proposalCreatedEvent.args as unknown as ProposalEvent

  const proposalExecutedEvent = proposalExecutedLogs.filter((log) => {
    return getProposalId(log.args as unknown as ProposalEvent).eq(proposalId)
  })[0]
  let proposalExecutedTransactionHash
  if (!proposalExecutedEvent) {
    if (governorType === 'arb') {
      // This is a workaround for a known issue with the Arbitrum governor when the transaction
      // is directly executed in the timelock instead of going through the governor.
      const timelock = new ethers.Contract(
        await governor.timelock(),
        [
          'event CallExecuted(bytes32 indexed id, uint256 indexed index, address target, uint256 value, bytes data)',
          'event CallScheduled(bytes32 indexed id, uint256 indexed index, address target, uint256 value, bytes data, bytes32 predecessor, uint256 delay)',
        ],
        provider
      )
      const [proposalQueuedLogs, callScheduledLogs, callExecutedLogs] = await Promise.all([
        governor.queryFilter(governor.filters.ProposalQueued(), ...blockRange),
        timelock.queryFilter(timelock.filters.CallScheduled(), ...blockRange),
        timelock.queryFilter(timelock.filters.CallExecuted(), ...blockRange),
      ])
      const proposalQueuedEvent = proposalQueuedLogs.filter((log) => {
        return getProposalId(log.args as unknown as ProposalEvent).eq(proposalId)
      })[0]
      // We use the first timelock call id scheduled when the proposal was queued to find the execution log
      // note that if multiple proposals are queued in the same transaction, this may track the wrong proposal
      const callScheduledEvent = callScheduledLogs.filter((log) => {
        return log.transactionHash === proposalQueuedEvent.transactionHash
      })[0]
      const callId = (callScheduledEvent.args as unknown as ProposalEvent).id
      const callExecutedEvent = callExecutedLogs.filter((log) => {
        return log.args!.id === callId
      })[0]
      if (!callExecutedEvent) {
        throw new Error(`Proposal execution log for #${proposalId} not found in governor logs`)
      } else {
        proposalExecutedTransactionHash = callExecutedEvent.transactionHash
      }
    } else {
      throw new Error(`Proposal execution log for #${proposalId} not found in governor logs`)
    }
  } else {
    proposalExecutedTransactionHash = proposalExecutedEvent.transactionHash
  }

  // --- Simulate it ---
  // Prepare tenderly payload. Since this proposal was already executed, we directly use that transaction data
  const tx = await provider.getTransaction(proposalExecutedTransactionHash)
  const simulationPayload: TenderlyPayload = {
    network_id: String(tx.chainId) as TenderlyPayload['network_id'],
    block_number: tx.blockNumber,
    from: tx.from,
    to: tx.to as string,
    input: tx.data,
    gas: tx.gasLimit.toNumber(),
    gas_price: tx.gasPrice?.toString(),
    value: tx.value.toString(),
    save_if_fails: true, // Set to true to save the simulation to your Tenderly dashboard if it fails.
    save: true, // Set to true to save the simulation to your Tenderly dashboard if it succeeds.
    generate_access_list: true,
  }
  const sim = await sendSimulation(simulationPayload)

  const formattedProposal: ProposalEvent = {
    ...proposal,
    id: BigNumber.from(proposalId), // Make sure we always have an ID field
  }
  return { sim, proposal: formattedProposal, latestBlock }
}

// This function simulate the L2 -> L1 crosschain proposal execution of arb governor
// it replace the schedule call with a execute call to L1 timelock,
// while overriding storage in the L1 timelock to make it executable without delay
async function simulateArbitrumL2ToL1(config: SimulationConfigArbL2ToL1): Promise<SimulationResult> {
  // --- Validate config ---
  const { governorType, targets, values, calldatas, description, signatures, parentId } = config
  if (targets.length !== 1) throw new Error('targets must be length 1')
  if (targets.length !== values.length) throw new Error('targets and values must be the same length')
  if (targets.length !== calldatas.length) throw new Error('targets and calldatas must be the same length')

  const timelock = targets[0]

  // --- Get details about the proposal we're simulating ---
  const network = await l1provider.getNetwork()
  const blockNumberToUse = (await getLatestBlock(network.chainId)) - 3 // subtracting a few blocks to ensure tenderly has the block
  const latestBlock = await l1provider.getBlock(blockNumberToUse)

  const proposalId = BigNumber.from(parentId).add(config.idoffset)

  const startBlock = BigNumber.from(latestBlock.number - 100) // arbitrarily subtract 100
  const endBlock = startBlock.add(1)

  const proposal: ProposalEvent = {
    id: proposalId, // Bravo governor
    proposalId, // OZ governor (for simplicity we just include both ID formats)
    proposer: DEFAULT_FROM,
    startBlock,
    endBlock,
    description,
    targets,
    values: values.map(BigNumber.from),
    signatures,
    calldatas,
    chainid: network.chainId.toString(),
  }

  // Set `from` arbitrarily.
  const from = DEFAULT_FROM

  // Run simulation at the block right after the proposal ends.
  const simBlock = endBlock.add(1)

  const simTimestamp = BigNumber.from(latestBlock.timestamp + 1)
  const eta = simTimestamp // set proposal eta to be equal to the timestamp we simulate at

  // Compute transaction hashes used by the Timelock
  const txHashes = targets.map((target, i) => {
    const [val, sig, calldata] = [values[i], signatures[i], calldatas[i]]
    return keccak256(
      defaultAbiCoder.encode(['address', 'uint256', 'string', 'bytes', 'uint256'], [target, val, sig, calldata, eta])
    )
  })
  
  // Generate the state object needed to mark the transactions as queued in the Timelock's storage
  const timelockStorageObj: Record<string, string> = {}
  txHashes.forEach((hash) => {
    timelockStorageObj[`queuedTransactions[${hash}]`] = 'true'
  })
  const ITimeLock = new Interface([
    'function schedule(address target, uint256 value, bytes calldata data, bytes32 predecessor, bytes32 salt, uint256 delay) external',
    'function execute(address target, uint256 value, bytes calldata data, bytes32 predecessor, bytes32 salt) external',
    'function scheduleBatch(address[] target, uint256[] value, bytes[] calldata data, bytes32 predecessor, bytes32 salt, uint256 delay) external',
    'function executeBatch(address[] target, uint256[] value, bytes[] calldata data, bytes32 predecessor, bytes32 salt) external',
  ])
  if (governorType === 'oz' || governorType === 'arb') {
    const args = ITimeLock.parseTransaction({ data: calldatas[0] }).args
    let id;
    if(Array.isArray(args[0]) && args[0].length > 0) {
      id = hashOperationBatchOz(args[0], args[1], args[2], args[3], args[4])
    } else {
      id = hashOperationOz(args[0], args[1], args[2], args[3], args[4])
    }
    timelockStorageObj[`_timestamps[${id.toHexString()}]`] = simTimestamp.toString()
  }

  const stateOverrides = {
    networkID: '1',
    stateOverrides: {
      [timelock]: {
        value: timelockStorageObj,
      },
    },
  }
  const storageObj = await sendEncodeRequest(stateOverrides)

  const simulationPayload: TenderlyPayload = {
    network_id: '1',
    // this field represents the block state to simulate against, so we use the latest block number
    block_number: latestBlock.number,
    from: DEFAULT_FROM,
    to: timelock,
    input: calldatas[0]
      .replace(ITimeLock.getSighash('schedule'), ITimeLock.getSighash('execute'))
      .replace(ITimeLock.getSighash('scheduleBatch'), ITimeLock.getSighash('executeBatch')), // replace schedule to execute
    gas: BLOCK_GAS_LIMIT,
    gas_price: '0',
    value: '1000000000000000', // retryable submission cost TODO: don't hardcode this
    save_if_fails: true, // Set to true to save the simulation to your Tenderly dashboard if it fails.
    save: true, // Set to true to save the simulation to your Tenderly dashboard if it succeeds.
    generate_access_list: true, // not required, but useful as a sanity check to ensure consistency in the simulation response
    block_header: {
      // this data represents what block.number and block.timestamp should return in the EVM during the simulation
      number: hexStripZeros(simBlock.toHexString()),
      timestamp: hexStripZeros(simTimestamp.toHexString()),
    },
    state_objects: {
      // Since gas price is zero, the sender needs no balance.
      // TODO Support sending ETH in local simulations like we do below in `simulateProposed`.
      [from]: { balance: '1000000000000000' },
      // Ensure transactions are queued in the timelock
      [timelock]: { storage: storageObj.stateOverrides[timelock.toLowerCase()].value },
    },
  }
  const sim = await sendSimulation(simulationPayload)
  return { sim, proposal, latestBlock }
}

// This function simulate the execution of a retryable ticket on Arbitrum
async function simulateArbitrumRetryable(config: SimulationConfigArbRetryable): Promise<SimulationResult> {
  // --- Validate config ---
  const { targets, values, calldatas, description, signatures, parentId, from } = config
  if (targets.length !== 1) throw new Error('targets must be length 1')
  if (targets.length !== values.length) throw new Error('targets and values must be the same length')
  if (targets.length !== calldatas.length) throw new Error('targets and calldatas must be the same length')

  const target = targets[0]

  // --- Get details about the proposal we're simulating ---
  const network = await arb1provider.getNetwork()
  const blockNumberToUse = (await getLatestBlock(network.chainId)) - 3 // subtracting a few blocks to ensure tenderly has the block
  const latestBlock = await arb1provider.getBlock(blockNumberToUse)

  const proposalId = BigNumber.from(parentId).add(config.idoffset)

  const startBlock = BigNumber.from(latestBlock.number - 100) // arbitrarily subtract 100
  const endBlock = startBlock.add(1)

  const proposal: ProposalEvent = {
    id: proposalId, // Bravo governor
    proposalId, // OZ governor (for simplicity we just include both ID formats)
    proposer: DEFAULT_FROM,
    startBlock,
    endBlock,
    description,
    targets,
    values: values.map(BigNumber.from),
    signatures,
    calldatas,
    chainid: network.chainId.toString(),
  }

  // Run simulation at the block right after the proposal ends.
  const simBlock = endBlock.add(1)

  const simTimestamp = BigNumber.from(latestBlock.timestamp + 1)

  const simulationPayload: TenderlyPayload = {
    network_id: '42161',
    // this field represents the block state to simulate against, so we use the latest block number
    block_number: latestBlock.number,
    from: from,
    to: target,
    input: calldatas[0],
    gas: BLOCK_GAS_LIMIT,
    gas_price: '0',
    value: '0',
    save_if_fails: true, // Set to true to save the simulation to your Tenderly dashboard if it fails.
    save: true, // Set to true to save the simulation to your Tenderly dashboard if it succeeds.
    generate_access_list: true, // not required, but useful as a sanity check to ensure consistency in the simulation response
    block_header: {
      // this data represents what block.number and block.timestamp should return in the EVM during the simulation
      number: hexStripZeros(simBlock.toHexString()),
      timestamp: hexStripZeros(simTimestamp.toHexString()),
    },
    state_objects: {
      // Since gas price is zero, the sender needs no balance.
      // TODO Support sending ETH in local simulations like we do below in `simulateProposed`.
      [from]: { balance: '0' },
    },
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
 * @notice Given a Tenderly contract object, generates a descriptive human-friendly name for that contract
 * @param contract Tenderly contract object to generate name from
 */
export function getContractName(contract: TenderlyContract | undefined, defaultName = 'unknown contract name') {
  if (!contract) return defaultName
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
  try {
    // Send simulation request
    const url = `${TENDERLY_BASE_URL}/network/${BigNumber.from(chainId).toString()}/block-number`
    const fetchOptions = <Partial<FETCH_OPT>>{ method: 'GET', ...TENDERLY_FETCH_OPTIONS }
    const res = await fetchUrl(url, fetchOptions)
    return res.block_number as number
  } catch (err) {
    console.log('logging getLatestBlock error')
    console.log(JSON.stringify(err, null, 2))
    throw err
  }
}

/**
 * @notice Encode state overrides
 * @param payload State overrides to send
 */
async function sendEncodeRequest(payload: any): Promise<StorageEncodingResponse> {
  try {
    const fetchOptions = <Partial<FETCH_OPT>>{
      method: 'POST',
      data: payload,
      ...TENDERLY_FETCH_OPTIONS,
    }
    const response = await fetchUrl(TENDERLY_ENCODE_URL, fetchOptions)

    return response as StorageEncodingResponse
  } catch (err) {
    console.log('logging sendEncodeRequest error')
    console.log(JSON.stringify(err, null, 2))
    console.log(JSON.stringify(payload))
    throw err
  }
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
  const fetchOptions = <Partial<FETCH_OPT>>{ method: 'POST', data: payload, ...TENDERLY_FETCH_OPTIONS }
  try {
    // Send simulation request
    const sim = <TenderlySimulation>await fetchUrl(TENDERLY_SIM_URL, fetchOptions)

    // Post-processing to ensure addresses we use are checksummed (since ethers returns checksummed addresses)
    sim.transaction.addresses = sim.transaction.addresses.map(getAddress)
    sim.contracts.forEach((contract) => (contract.address = getAddress(contract.address)))
    return sim
  } catch (err: any) {
    console.log('err in sendSimulation: ', JSON.stringify(err))
    const is429 = typeof err === 'object' && err?.statusCode === 429
    if (delay > 8000 || !is429) {
      console.warn(`Simulation request failed with the below request payload and error`)
      console.log(JSON.stringify(fetchOptions))
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
