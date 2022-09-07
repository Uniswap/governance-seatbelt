import { Contract, providers } from 'ethers'

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

export const erc20Contract = (address: string, provider: providers.StaticJsonRpcProvider) =>
  new Contract(address, abi, provider)
