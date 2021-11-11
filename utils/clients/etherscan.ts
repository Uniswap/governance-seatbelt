import EtherscanClient from '@ethercast/etherscan-client'
import { fetchJson } from '@ethersproject/web'
import { ETHERSCAN_API_KEY } from '../constants'
import { ABI, ContractSource } from '../../types'

export const etherscan = new EtherscanClient({
  apiKey: ETHERSCAN_API_KEY,
  apiUrl: 'https://api.etherscan.io/api',
})

export async function getAbi(contract: string): Promise<ABI> {
  const url = `https://api.etherscan.io/api?module=contract&action=getabi&address=${contract}&apikey=${ETHERSCAN_API_KEY}`
  const response = (await fetchJson(url)) as { status: string; message: string; result: string }
  if (response.status !== '1') throw new Error(`Error fetching ABI for ${contract}: ${response.message}`)
  return JSON.parse(response.result)
}

export async function getCode(contract: string) {
  // TODO only supports when a single file is returned
  const url = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${contract}&apikey=${ETHERSCAN_API_KEY}`
  const response = (await fetchJson(url)) as { status: string; message: string; result: ContractSource[] }
  if (response.status !== '1') throw new Error(`Error fetching ABI for ${contract}: ${response.message}`)
  return response.result[0]
}
