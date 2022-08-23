import { Contract } from 'ethers'
import { polygonProvider } from '../clients/ethers'

const abi = [
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'address', name: 'rootMessageSender', type: 'address' },
      { indexed: false, internalType: 'address', name: 'receiver', type: 'address' },
      { indexed: false, internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'NewFxMessage',
    type: 'event',
  },
  {
    inputs: [],
    name: 'fxRoot',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'stateId', type: 'uint256' },
      { internalType: 'bytes', name: '_data', type: 'bytes' },
    ],
    name: 'onStateReceive',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_fxRoot', type: 'address' }],
    name: 'setFxRoot',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

export const FX_CHILD = '0x8397259c983751DAf40400790063935a11afa28a'

export const fxChildContract = new Contract(FX_CHILD, abi, polygonProvider)
