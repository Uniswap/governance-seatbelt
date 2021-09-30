import { providers } from 'ethers'
import { RPC_URL } from '../constants'

export const provider = new providers.JsonRpcProvider(RPC_URL)
