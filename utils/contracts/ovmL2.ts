import { Contract } from 'ethers'
import { optimismProvider } from '../clients/ethers'

const abi = [
  {
    inputs: [{ internalType: 'address', name: '_l1CrossDomainMessenger', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: 'bytes32', name: 'msgHash', type: 'bytes32' }],
    name: 'FailedRelayedMessage',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: 'bytes32', name: 'msgHash', type: 'bytes32' }],
    name: 'RelayedMessage',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'target', type: 'address' },
      { indexed: false, internalType: 'address', name: 'sender', type: 'address' },
      { indexed: false, internalType: 'bytes', name: 'message', type: 'bytes' },
      { indexed: false, internalType: 'uint256', name: 'messageNonce', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'gasLimit', type: 'uint256' },
    ],
    name: 'SentMessage',
    type: 'event',
  },
  {
    inputs: [],
    name: 'l1CrossDomainMessenger',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'messageNonce',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_target', type: 'address' },
      { internalType: 'address', name: '_sender', type: 'address' },
      { internalType: 'bytes', name: '_message', type: 'bytes' },
      { internalType: 'uint256', name: '_messageNonce', type: 'uint256' },
    ],
    name: 'relayMessage',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    name: 'relayedMessages',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_target', type: 'address' },
      { internalType: 'bytes', name: '_message', type: 'bytes' },
      { internalType: 'uint32', name: '_gasLimit', type: 'uint32' },
    ],
    name: 'sendMessage',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    name: 'sentMessages',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    name: 'successfulMessages',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'xDomainMessageSender',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
]

export const OVM_L2 = '0x4200000000000000000000000000000000000007'

export const opChildContract = new Contract(OVM_L2, abi, optimismProvider)
