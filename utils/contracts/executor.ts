import { Contract } from 'ethers'
import { provider } from '../clients/ethers'

const EXECUTOR_ABI = [
  'event CancelledAction(bytes32,address indexed,uint256,string,bytes,uint256,bool)',
  'event ExecutedAction(bytes32,address indexed,uint256,string,bytes,uint256,bool,bytes)',
  'event NewAdmin(address)',
  'event NewDelay(uint256)',
  'event NewPendingAdmin(address)',
  'event QueuedAction(bytes32,address indexed,uint256,string,bytes,uint256,bool)',
  'function VOTING_DURATION() view returns (uint256)',
  'function GRACE_PERIOD() view returns (uint256)',
  'function MAXIMUM_DELAY() view returns (uint256)',
  'function MINIMUM_DELAY() view returns (uint256)',
  'function MINIMUM_QUORUM() view returns (uint256)',
  'function acceptAdmin()',
  'function cancelTransaction(address,uint256,string,bytes,uint256,bool) returns (bytes32)',
  'function executeTransaction(address,uint256,string,bytes,uint256,bool) payable returns (bytes)',
  'function getAdmin() view returns (address)',
  'function getDelay() view returns (uint256)',
  'function getPendingAdmin() view returns (address)',
  'function isActionQueued(bytes32) view returns (bool)',
  'function isProposalOverGracePeriod(address,uint256) view returns (bool)',
  'function queueTransaction(address,uint256,string,bytes,uint256,bool) returns (bytes32)',
  'function setDelay(uint256)',
  'function setPendingAdmin(address)',
]

export const executor = (address: string) => new Contract(address, EXECUTOR_ABI, provider)
