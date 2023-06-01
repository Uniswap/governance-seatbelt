import { providers } from 'ethers'
import { RPC_URL, L1_RPC_URL, ARB1_RPC_URL } from '../constants'

export const provider = new providers.JsonRpcProvider(RPC_URL)
export const l1provider = new providers.JsonRpcProvider(L1_RPC_URL)
export const arb1provider = new providers.JsonRpcProvider(ARB1_RPC_URL)

if ((await l1provider.getNetwork()).chainId !== 1) throw new Error('L1_RPC need to be Mainnet')
if ((await arb1provider.getNetwork()).chainId !== 42161) throw new Error('ARB1_RPC need to be Arbitrum')

console.log(`Your primary provider is connected to networkID ${(await provider.getNetwork()).chainId}`)
