import { Contract } from 'ethers'
import { provider } from '../clients/ethers'

const abi = [
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
]

export const erc20Contract = (address: string) => new Contract(address, abi, provider)
