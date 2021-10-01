import EtherscanClient from '@ethercast/etherscan-client'
import { ETHERSCAN_API_KEY } from '../constants'

export const etherscan = new EtherscanClient({
  apiKey: ETHERSCAN_API_KEY,
  apiUrl: 'https://api.etherscan.io/api',
})
