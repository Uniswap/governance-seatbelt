import EtherscanClient from '@ethercast/etherscan-client'
import { ETHERSCAN_API_KEY } from '../constants'
import { fetchJson } from '@ethersproject/web'

export const etherscan = new EtherscanClient({
  apiKey: ETHERSCAN_API_KEY,
  apiUrl: 'https://api.etherscan.io/api',
})

export async function getAbi(contract: string) {
  const url = `https://api.etherscan.io/api?module=contract&action=getabi&address=${contract}&apikey=${ETHERSCAN_API_KEY}`
  const response = (await fetchJson(url)) as { status: string; message: string; result: string }
  if (response.status !== '1') throw new Error(`Error fetching ABI for ${contract}: ${response.message}`)
  return response.result
}
