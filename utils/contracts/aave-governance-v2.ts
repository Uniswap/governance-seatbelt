import { Contract } from 'ethers'
import { provider } from '../clients/ethers'

const AAVE_GOVERNANCE_V2_ABI = [
  'event ExecutorAuthorized(address)',
  'event ExecutorUnauthorized(address)',
  'event GovernanceStrategyChanged(address indexed,address indexed)',
  'event OwnershipTransferred(address indexed,address indexed)',
  'event ProposalCanceled(uint256)',
  'event ProposalCreated(uint256 id,address indexed creator,address indexed executor, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, bool[] withDelegatecalls, uint256 startBlock, uint256 endBlock, address strategy, bytes32 ipfsHash)',
  'event ProposalExecuted(uint256 id,address indexed)',
  'event ProposalQueued(uint256,uint256,address indexed)',
  'event VoteEmitted(uint256,address indexed,bool,uint256)',
  'event VotingDelayChanged(uint256,address indexed)',
  'function DOMAIN_TYPEHASH() view returns (bytes32)',
  'function NAME() view returns (string)',
  'function VOTE_EMITTED_TYPEHASH() view returns (bytes32)',
  'function __abdicate()',
  'function authorizeExecutors(address[])',
  'function cancel(uint256)',
  'function create(address,address[],uint256[],string[],bytes[],bool[],bytes32) returns (uint256)',
  'function execute(uint256) payable',
  'function getGovernanceStrategy() view returns (address)',
  'function getGuardian() view returns (address)',
  'function getProposalById(uint256) view returns (tuple(uint256 id,address creator,address executor, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, bool[] withDelegateCalls, uint256 startBlock, uint256 endBlock, uint256 executionTime, uint256 forVotes, uint256 againstVotes, bool executed, bool canceled, address strategy,bytes32 ipfsHash))',
  'function getProposalState(uint256) view returns (uint8)',
  'function getProposalsCount() view returns (uint256)',
  'function getVoteOnProposal(uint256,address) view returns (tuple(bool,uint248))',
  'function getVotingDelay() view returns (uint256)',
  'function isExecutorAuthorized(address) view returns (bool)',
  'function owner() view returns (address)',
  'function queue(uint256)',
  'function renounceOwnership()',
  'function setGovernanceStrategy(address)',
  'function setVotingDelay(uint256)',
  'function submitVote(uint256,bool)',
  'function submitVoteBySignature(uint256,bool,uint8,bytes32,bytes32)',
  'function transferOwnership(address)',
  'function unauthorizeExecutors(address[])',
]

export const aaveGovV2 = (address: string) => new Contract(address, AAVE_GOVERNANCE_V2_ABI, provider)

// All possible states a proposal might be in.
// These are defined by the `ProposalState` enum so when we fetch the state of a proposal ID
// we receive an integer response, and use this to map that integer to the state
export const PROPOSAL_STATES = {
  '0': 'Pending',
  '1': 'Canceled',
  '2': 'Active',
  '3': 'Failed',
  '4': 'Succeeded',
  '5': 'Queued',
  '6': 'Expired',
  '7': 'Executed',
}

export const isProposalStateImmutable = (state: keyof typeof PROPOSAL_STATES) => !['0', '2', '4', '5'].includes(state)
