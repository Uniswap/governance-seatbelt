import { Contract } from 'ethers'
import { provider } from '../clients/ethers'

const TIMELOCK_ABI = [
  'function executeTransaction(address target, uint256 value, string signature, bytes data, uint256 eta) payable returns (bytes)',
  'function acceptAdmin()',
  'function pendingAdmin() view returns (address)',
  'function queueTransaction(address target, uint256 value, string signature, bytes data, uint256 eta) returns (bytes32)',
  'function setPendingAdmin(address pendingAdmin_)',
  'function cancelTransaction(address target, uint256 value, string signature, bytes data, uint256 eta)',
  'function delay() view returns (uint256)',
  'function MAXIMUM_DELAY() view returns (uint256)',
  'function MINIMUM_DELAY() view returns (uint256)',
  'function GRACE_PERIOD() view returns (uint256)',
  'function setDelay(uint256 delay_)',
  'function queuedTransactions(bytes32) view returns (bool)',
  'function admin() view returns (address)',
  'constructor(address admin_, uint256 delay_)',
  'event NewAdmin(address indexed newAdmin)',
  'event NewPendingAdmin(address indexed newPendingAdmin)',
  'event NewDelay(uint256 indexed newDelay)',
  'event CancelTransaction(bytes32 indexed txHash, address indexed target, uint256 value, string signature, bytes data, uint256 eta)',
  'event ExecuteTransaction(bytes32 indexed txHash, address indexed target, uint256 value, string signature, bytes data, uint256 eta)',
  'event QueueTransaction(bytes32 indexed txHash, address indexed target, uint256 value, string signature, bytes data, uint256 eta)',
]

export const timelock = (address: string) => new Contract(address, TIMELOCK_ABI, provider)
