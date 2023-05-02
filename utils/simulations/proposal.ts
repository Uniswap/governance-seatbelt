import { ProposalState } from '@aave/contract-helpers'
import { BigNumber, BigNumberish } from 'ethers'
import { defaultAbiCoder, getAddress, hexStripZeros, hexZeroPad, keccak256, parseEther } from 'ethers/lib/utils'
import { ProposalStruct, SimulationResult, TenderlyPayload } from '../../types'
import { getPastLogs, provider } from '../clients/ethers'
import { sendSimulation } from '../clients/tenderly'
import {
  AAVE_GOV_V2_ADDRESS,
  BLOCK_GAS_LIMIT,
  FORCE_SIMULATION,
  FROM,
  RPC_URL,
  TENDERLY_ROOT,
  AAVE_LONG_EXECUTOR,
} from '../constants'
import { aaveGovernanceContract, PROPOSAL_STATES } from '../contracts/aave-governance-v2'
import { executor } from '../contracts/executor'
import { votingStrategy } from '../contracts/voting-strategy'

const BLOCK_TIME = 12

export async function simulateProposal(proposalId: BigNumberish): Promise<SimulationResult> {
  const proposalState = (await aaveGovernanceContract.getProposalState(proposalId)) as keyof typeof PROPOSAL_STATES
  const proposal = (await aaveGovernanceContract.getProposalById(proposalId)) as ProposalStruct
  const latestBlock = await provider.getBlock('latest')
  const executorContract = executor(proposal.executor)
  let simulationPayload: TenderlyPayload
  if (!FORCE_SIMULATION && PROPOSAL_STATES[proposalState] === ProposalState.Executed) {
    const gracePeriod = await executorContract.GRACE_PERIOD()
    const delay = await executorContract.MAXIMUM_DELAY()
    // --- Get details about the proposal we're analyzing ---
    const proposalExecutedLogs = await getPastLogs(
      proposal.endBlock.toNumber(),
      // assuming a 11s blocktime should give us enough margin to cover the endTime
      proposal.endBlock.toNumber() + Math.floor((gracePeriod.toNumber() + delay.toNumber()) / 11),
      aaveGovernanceContract.filters.ProposalExecuted(),
      aaveGovernanceContract
    )

    const proposalExecutedEvent = proposalExecutedLogs.filter(
      // lte check necessary to work around a bug in tenderly TODO: remove once resolved
      (log) => log.args?.id.lte(1000) && log.args?.id.toNumber() === proposalId
    )[0]
    if (!proposalExecutedEvent)
      throw new Error(`Proposal execution log for #${proposalId} not found in governance logs`)
    // --- Simulate it ---
    // Prepare tenderly payload. Since this proposal was already executed, we directly use that transaction data
    const tx = await provider.getTransaction(proposalExecutedEvent.transactionHash)
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
    const { targets, signatures: sigs, calldatas, executor: executorAddress } = proposal
    // When there is no values, the contract doesn't return any named parameter
    const values = (proposal as any)[4]
    const withDelegatecalls = (proposal as any)[7]

    // --- Storage slots and offsets for AaveGovernanceV2 ---
    const govSlots = getAaveGovernanceV2Slots(proposal.id)
    const queuedTxsSlot = proposal.executor === AAVE_LONG_EXECUTOR ? '0x7' : '0x3' // executor mapping from tx hash to bool about it's queue status

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
    const rawVotingStrategyAddress = await provider.getStorageAt(AAVE_GOV_V2_ADDRESS, govSlots.votingStrategySlot)
    const votingStrategyAddress = getAddress(`0x${rawVotingStrategyAddress.slice(26)}`)
    const totalVotingSupply = <BigNumber>(
      await votingStrategy(votingStrategyAddress).getTotalVotingSupplyAt(proposal.startBlock)
    )
    const FAKE_IPFS_HASH = `0000`
    const value = (values as BigNumber[]).reduce((sum, cur) => sum.add(cur), BigNumber.from(0)).toString()
    const quorum = await executorContract.MINIMUM_QUORUM()
    const delay = await executorContract.getDelay()
    const duration = await executorContract.VOTING_DURATION()

    const START_BLOCK_NUMBER = proposal.startBlock.add(1).toNumber()
    const VOTING_DURATION = duration.toNumber() + 1 // block number voting duration
    const VOTING_DELAY = delay.toNumber() + 1 // 1 sec margin in seconds
    const EVM_BLOCK_NUMBER = START_BLOCK_NUMBER + VOTING_DURATION
    const START_TIMESTAMP =
      latestBlock.number < START_BLOCK_NUMBER
        ? latestBlock.timestamp + (START_BLOCK_NUMBER - latestBlock.number) * BLOCK_TIME
        : (await provider.getBlock(START_BLOCK_NUMBER)).timestamp
    const EVM_EXECUTION_TIME = START_TIMESTAMP + VOTING_DURATION * BLOCK_TIME
    const FORCED_EXECUTION_TIME = EVM_EXECUTION_TIME + VOTING_DELAY
    // if a proposal is not yet finished instead of simulating at creation it makes sense to fork of the current block
    const SNAPSHOT_BLOCK_NUMBER = EVM_BLOCK_NUMBER > latestBlock.number ? latestBlock.number : EVM_BLOCK_NUMBER - 1

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
    simulationPayload = {
      network_id: '1',
      // this field represents the block state to simulate against, so we use the latest block number
      block_number: SNAPSHOT_BLOCK_NUMBER,
      from: FROM,
      to: AAVE_GOV_V2_ADDRESS,
      input: aaveGovernanceContract.interface.encodeFunctionData('execute', [proposal.id]),
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
        [FROM]: { balance: parseEther('10').toString() },
        // Ensure transactions are queued in the executor
        [executorAddress]: { storage: executorStorageObj },
        // Ensure governance storage is properly configured so `state(proposalId)` returns `Queued`
        [AAVE_GOV_V2_ADDRESS]: {
          storage: {
            // Set the proposal ETA to a random future timestamp
            [govSlots.eta]: hexZeroPad(BigNumber.from(FORCED_EXECUTION_TIME).toHexString(), 32),
            // Set for votes to 2% of total votingPower so quorum is valid
            [govSlots.forVotes]: hexZeroPad(
              totalVotingSupply.mul(quorum).div(10000).add('100000000000000000000000').toHexString(),
              32
            ),
            // Set against votes to 0 so the diff is valid
            [govSlots.againstVotes]: hexZeroPad('0x0', 32),
            // The canceled and execute slots are packed, so we can zero out that full slot
            [govSlots.canceled]: hexZeroPad(`${votingStrategyAddress}${FAKE_IPFS_HASH}`, 32),
          },
        },
      },
    }
  }

  if (TENDERLY_ROOT) {
    simulationPayload.root = TENDERLY_ROOT
  }

  return {
    sim: await sendSimulation(simulationPayload, 1000, RPC_URL),
    latestBlock,
    proposal: { ...proposal, state: proposalState },
    subSimulations: [],
    provider,
  }
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
export function getSolidityStorageSlotBytes(mappingSlot: string, key: BigNumberish) {
  const slot = hexZeroPad(mappingSlot, 32)
  return hexStripZeros(keccak256(defaultAbiCoder.encode(['bytes32', 'uint256'], [key, slot])))
}

/**
 * @notice Returns the storage slot for a Solidity mapping with uint keys, given the slot of the mapping itself
 * @dev Read more at https://docs.soliditylang.org/en/latest/internals/layout_in_storage.html#mappings-and-dynamic-arrays
 * @param mappingSlot Mapping slot in storage
 * @param key Mapping key to find slot for
 * @returns Storage slot
 */
export function getSolidityStorageSlotUint(mappingSlot: string, key: BigNumberish) {
  // this will also work for address types, since address and uints are encoded the same way
  const slot = hexZeroPad(mappingSlot, 32)
  return hexStripZeros(keccak256(defaultAbiCoder.encode(['uint256', 'uint256'], [key, slot])))
}
