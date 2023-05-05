import { Contract } from 'ethers'
import { provider, arb1provider, l1provider } from '../clients/ethers'
import { getAddress } from '@ethersproject/address'

const SAI = '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359'

const ERC20_BASE_ABI = [
  'function balanceOf(address owner) public view returns (uint256 balance)',
  'function transfer(address to, uint256 value) public returns (bool success)',
  'function transferFrom(address from, address to, uint256 value) public returns (bool success)',
  'function approve(address spender, uint256 value) public returns (bool success)',
  'function allowance(address owner, address spender) public view returns (uint256 remaining)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
]

export const ERC20_ABI = [
  'function name() public view returns (string)',
  'function symbol() public view returns (string)',
  'function decimals() public view returns (uint8)',
  ...ERC20_BASE_ABI,
]

export const SAI_ABI = [
  'function name() public view returns (bytes32)',
  'function symbol() public view returns (bytes32)',
  'function decimals() public view returns (uint256)',
  ...ERC20_BASE_ABI,
]

export async function fetchTokenMetadata(address: string, chainid: string) {
  const abi = getAddress(address) === SAI ? SAI_ABI : ERC20_ABI
  const token = new Contract(address, abi, chainid === '42161' ? arb1provider : chainid === '1' ? l1provider : provider)
  const response = await Promise.all([token.name(), token.symbol(), token.decimals()])
  return {
    name: response[0] as string,
    symbol: response[1] as string,
    decimals: response[2] as number,
  }
}
