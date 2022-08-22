import { Contract } from 'ethers'
import { provider } from '../clients/ethers'

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
