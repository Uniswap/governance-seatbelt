import { Contract, Event, EventFilter, providers } from 'ethers'
import { RPC_URL, RPC_URL_POLYGON } from '../constants'

export const provider = new providers.StaticJsonRpcProvider(RPC_URL)

export const polygonProvider = new providers.StaticJsonRpcProvider(RPC_URL_POLYGON)

export async function getPastLogs(
  fromBlock: number,
  toBlock: number,
  event: EventFilter,
  contract: Contract
): Promise<Event[]> {
  if (fromBlock <= toBlock) {
    try {
      return await await contract.queryFilter(event, fromBlock, toBlock)
    } catch (error) {
      const midBlock = (fromBlock + toBlock) >> 1
      const arr1 = await getPastLogs(fromBlock, midBlock, event, contract)
      const arr2 = await getPastLogs(midBlock + 1, toBlock, event, contract)
      return [...arr1, ...arr2]
    }
  }
  return []
}
