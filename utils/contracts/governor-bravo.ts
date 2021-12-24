import { Contract } from 'ethers'
import { provider } from '../clients/ethers'

const GOVERNOR_BRAVO_ABI = [
  'event NewAdmin(address oldAdmin, address newAdmin)',
  'event NewImplementation(address oldImplementation, address newImplementation)',
  'event NewPendingAdmin(address oldPendingAdmin, address newPendingAdmin)',
  'event ProposalCanceled(uint256 id)',
  'event ProposalCreated(uint256 id, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 startBlock, uint256 endBlock, string description)',
  'event ProposalExecuted(uint256 id)',
  'event ProposalQueued(uint256 id, uint256 eta)',
  'event ProposalThresholdSet(uint256 oldProposalThreshold, uint256 newProposalThreshold)',
  'event VoteCast(address indexed voter, uint256 proposalId, uint8 support, uint256 votes, string reason)',
  'event VotingDelaySet(uint256 oldVotingDelay, uint256 newVotingDelay)',
  'event VotingPeriodSet(uint256 oldVotingPeriod, uint256 newVotingPeriod)',
  'function BALLOT_TYPEHASH() view returns (bytes32)',
  'function DOMAIN_TYPEHASH() view returns (bytes32)',
  'function MAX_PROPOSAL_THRESHOLD() view returns (uint256)',
  'function MAX_VOTING_DELAY() view returns (uint256)',
  'function MAX_VOTING_PERIOD() view returns (uint256)',
  'function MIN_PROPOSAL_THRESHOLD() view returns (uint256)',
  'function MIN_VOTING_DELAY() view returns (uint256)',
  'function MIN_VOTING_PERIOD() view returns (uint256)',
  'function _acceptAdmin()',
  'function _initiate(uint256 proposalCount)',
  'function _setPendingAdmin(address newPendingAdmin)',
  'function _setProposalThreshold(uint256 newProposalThreshold)',
  'function _setVotingDelay(uint256 newVotingDelay)',
  'function _setVotingPeriod(uint256 newVotingPeriod)',
  'function admin() view returns (address)',
  'function cancel(uint256 proposalId)',
  'function castVote(uint256 proposalId, uint8 support)',
  'function castVoteBySig(uint256 proposalId, uint8 support, uint8 v, bytes32 r, bytes32 s)',
  'function castVoteWithReason(uint256 proposalId, uint8 support, string reason)',
  'function execute(uint256 proposalId) payable',
  'function getActions(uint256 proposalId) view returns (address[] targets, uint256[] values, string[] signatures, bytes[] calldatas)',
  'function getReceipt(uint256 proposalId, address voter) view returns (tuple(bool hasVoted, uint8 support, uint96 votes))',
  'function implementation() view returns (address)',
  'function initialProposalId() view returns (uint256)',
  'function initialize(address timelock_, address uni_, uint256 votingPeriod_, uint256 votingDelay_, uint256 proposalThreshold_)',
  'function latestProposalIds(address) view returns (uint256)',
  'function name() view returns (string)',
  'function pendingAdmin() view returns (address)',
  'function proposalCount() view returns (uint256)',
  'function proposalMaxOperations() view returns (uint256)',
  'function proposalThreshold() view returns (uint256)',
  'function proposals(uint256) view returns (uint256 id, address proposer, uint256 eta, uint256 startBlock, uint256 endBlock, uint256 forVotes, uint256 againstVotes, uint256 abstainVotes, bool canceled, bool executed)',
  'function propose(address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, string description) returns (uint256)',
  'function queue(uint256 proposalId)',
  'function quorumVotes() view returns (uint256)',
  'function state(uint256 proposalId) view returns (uint8)',
  'function timelock() view returns (address)',
  'function uni() view returns (address)',
  'function votingDelay() view returns (uint256)',
  'function votingPeriod() view returns (uint256)',
]

export const governorBravo = (address: string) => new Contract(address, GOVERNOR_BRAVO_ABI, provider)

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

// Subset of proposal states that indicates a proposal is finalized
export const FINAL_PROPOSAL_STATES = [
  PROPOSAL_STATES['2'],
  PROPOSAL_STATES['3'],
  PROPOSAL_STATES['6'],
  PROPOSAL_STATES['7'],
]
