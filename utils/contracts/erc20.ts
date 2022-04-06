import { Contract } from 'ethers'
import { provider } from '../clients/ethers'

export const ERC20_ABI = [
  'function name() public view returns (string)',
  'function symbol() public view returns (string)',
  'function decimals() public view returns (uint8)',
  'function balanceOf(address owner) public view returns (uint256 balance)',
  'function transfer(address to, uint256 value) public returns (bool success)',
  'function transferFrom(address from, address to, uint256 value) public returns (bool success)',
  'function approve(address spender, uint256 value) public returns (bool success)',
  'function allowance(address owner, address spender) public view returns (uint256 remaining)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
]

export async function fetchTokenMetadata(address: string) {
  const token = new Contract(address, ERC20_ABI, provider)
  const response = await Promise.all([token.name(), token.symbol(), token.decimals()])
  return {
    name: response[0] as string,
    symbol: response[1] as string,
    decimals: response[2] as number,
  }
}
