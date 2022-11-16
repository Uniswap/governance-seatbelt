import { BigNumber, BigNumberish, Contract } from 'ethers'
import { hexZeroPad } from '@ethersproject/bytes'
import { provider } from '../clients/ethers'
import { getSolidityStorageSlotUint } from '../utils'

const GOVERNOR_OZ_ABI = [
  'event ProposalCanceled(uint256 proposalId)',
  'event ProposalCreated(uint256 proposalId, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 startBlock, uint256 endBlock, string description)',
  'event ProposalExecuted(uint256 proposalId)',
  'event ProposalQueued(uint256 proposalId, uint256 eta)',
  'event QuorumUpdated(uint256 oldQuorum, uint256 newQuorum)',
  'event TimelockChange(address oldTimelock, address newTimelock)',
  'event VoteCast(address indexed voter, uint256 proposalId, uint8 support, uint256 weight, string reason)',
  'event VotingDelayUpdated(uint256 oldVotingDelay, uint256 newVotingDelay)',
  'event VotingPeriodUpdated(uint256 oldVotingPeriod, uint256 newVotingPeriod)',
  'function BALLOT_TYPEHASH() view returns (bytes32)',
  'function COUNTING_MODE() pure returns (string)',
  'function castVote(uint256 proposalId, uint8 support) returns (uint256)',
  'function castVoteBySig(uint256 proposalId, uint8 support, uint8 v, bytes32 r, bytes32 s) returns (uint256)',
  'function castVoteWithReason(uint256 proposalId, uint8 support, string reason) returns (uint256)',
  'function execute(address[] targets, uint256[] values, bytes[] calldatas, bytes32 descriptionHash) payable returns (uint256)',
  'function getVotes(address account, uint256 blockNumber) view returns (uint256)',
  'function hasVoted(uint256 proposalId, address account) view returns (bool)',
  'function hashProposal(address[] targets, uint256[] values, bytes[] calldatas, bytes32 descriptionHash) pure returns (uint256)',
  'function initialize(address _token, address _timelock)',
  'function name() view returns (string)',
  'function proposalDeadline(uint256 proposalId) view returns (uint256)',
  'function proposalEta(uint256 proposalId) view returns (uint256)',
  'function proposalSnapshot(uint256 proposalId) view returns (uint256)',
  'function proposalVotes(uint256 proposalId) view returns (uint256 againstVotes, uint256 forVotes, uint256 abstainVotes)',
  'function propose(address[] targets, uint256[] values, bytes[] calldatas, string description) returns (uint256)',
  'function queue(address[] targets, uint256[] values, bytes[] calldatas, bytes32 descriptionHash) returns (uint256)',
  'function quorum(uint256 blockNumber) view returns (uint256)',
  'function setQuorum(uint256 newQuorum)',
  'function setVotingDelay(uint256 newVotingDelay)',
  'function setVotingPeriod(uint256 newVotingPeriod)',
  'function state(uint256 proposalId) view returns (uint8)',
  'function supportsInterface(bytes4 interfaceId) view returns (bool)',
  'function timelock() view returns (address)',
  'function token() view returns (address)',
  'function updateTimelock(address newTimelock)',
  'function version() view returns (string)',
  'function votingDelay() view returns (uint256)',
  'function votingPeriod() view returns (uint256)',
]

export const governorOz = (address: string) => new Contract(address, GOVERNOR_OZ_ABI, provider)

// All possible states a proposal might be in.
// These are defined by the `ProposalState` enum so when we fetch the state of a proposal ID
// we receive an integer response, and use this to map that integer to the state
export const PROPOSAL_STATES = {
  '0': 'Pending',
  '1': 'Active',
  '2': 'Canceled',
  '3': 'Defeated',
  '4': 'Succeeded',
  '5': 'Queued',
  '6': 'Expired',
  '7': 'Executed',
}

/**
 * @notice Returns an object containing various OZ Governor slots
 * @dev The slots here are for the `GovernorCountingSimpleUpgradeable` and
 * `TimelockControllerUpgradeable` OZ contracts, from lib/openzeppelin-contracts-upgradeable v4.7.3
 * (commit 0a2cb9a445c365870ed7a8ab461b12acf3e27d63)
 * @param id Proposal ID
 */
export function getOzSlots(proposalId: BigNumberish) {
  // Proposal structs:
  //     struct ProposalCore {
  //       TimersUpgradeable.BlockNumber voteStart;  0
  //       TimersUpgradeable.BlockNumber voteEnd;    1
  //       bool executed;                            2
  //       bool canceled;                            3
  //     }
  //     struct ProposalVote {
  //       uint256 againstVotes;                     0
  //       uint256 forVotes;                         1
  //       uint256 abstainVotes;                     2
  //       mapping(address => bool) hasVoted;        3
  //     }
  const etaOffset = 2
  const targetsOffset = 3
  const valuesOffset = 4
  const signaturesOffset = 5
  const calldatasOffset = 6
  const canceledSlotOffset = 3 // this is packed with `executed`

  const againstVotesOffset = 0
  const forVotesOffset = 1
  const abstainVotesOffset = 2

  // Compute and return slot numbers
  const proposalCoreMapSlot = '0xcc' // `_proposals` mapping
  const proposalCoreSlot = getSolidityStorageSlotUint(proposalCoreMapSlot, proposalId)

  const proposalVotesMapSlot = '0xfd' // `_proposalVotes` mapping
  const proposalVotesSlot = getSolidityStorageSlotUint(proposalVotesMapSlot, proposalId)

  return {
    votingToken: '0x9', // slot of voting token, e.g. UNI, COMP  (getter is named after token, so can't generalize it that way),
    canceled: hexZeroPad(BigNumber.from(proposalCoreSlot).add(canceledSlotOffset).toHexString(), 32),
    // We don't need to set the ETA for OZ governors because they don't use it to check which state
    // a proposal is in. Therefore we choose an arbitrary slot here for typing purposes and just
    // set the ETA in an arbitrary slot for consistency. This slot is `keccak256("we don't need this for OZ governor")`
    eta: '0x42a5ef1591012b6beeb9636e75b28a676a23c97ad46ae6d83e11f22f52da96cc',
    againstVotes: hexZeroPad(BigNumber.from(proposalVotesSlot).add(againstVotesOffset).toHexString(), 32),
    forVotes: hexZeroPad(BigNumber.from(proposalVotesSlot).add(forVotesOffset).toHexString(), 32),
    abstainVotes: hexZeroPad(BigNumber.from(proposalVotesSlot).add(abstainVotesOffset).toHexString(), 32),
  }
}
