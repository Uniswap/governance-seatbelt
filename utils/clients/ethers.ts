import { Contract, Event, EventFilter, providers } from 'ethers'
import { RPC_URL, RPC_POLYGON, RPC_OPTIMISM, RPC_ARBITRUM } from '../constants'

export const provider = new providers.StaticJsonRpcProvider(RPC_URL)

export const polygonProvider = new providers.StaticJsonRpcProvider(RPC_POLYGON)

export const optimismProvider = new providers.StaticJsonRpcProvider(RPC_OPTIMISM)

export const arbitrumProvider = new providers.StaticJsonRpcProvider(RPC_ARBITRUM)

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

export async function getCloseBlock(
  minBlockNumber: number,
  maxBlockNumber: number,
  targetTimestamp: number,
  provider: providers.StaticJsonRpcProvider
): Promise<number> {
  if (targetTimestamp >= Math.floor(new Date().getTime() / 1000)) {
    return maxBlockNumber
    // throw new Error('targetTimestamp in the future') TODO: should throw instead
  }
  const block = await binarySearchBlock(
    provider,
    targetTimestamp,
    await getBlock(provider, minBlockNumber),
    await getBlock(provider, maxBlockNumber)
  )
  return block.number
}

type BlockTimestamp = {
  number: number
  timestamp: number
}

export async function getBlock(provider: providers.StaticJsonRpcProvider, number: number): Promise<BlockTimestamp> {
  const block = await provider.getBlock(number)
  return { number: number, timestamp: block.timestamp }
}

export async function binarySearchBlock(
  provider: providers.StaticJsonRpcProvider,
  timestamp: number,
  low: BlockTimestamp,
  high: BlockTimestamp
): Promise<BlockTimestamp> {
  // not found
  if (low.number > high.number) throw Error('timestamp unreachable')
  // find mid
  const mid = await getBlock(provider, Math.floor((low.number + high.number) / 2))
  // mid = search word
  const distance = timestamp - mid.timestamp
  if (distance < 60 * 30 && distance > 0) return mid
  // mid earlier
  if (timestamp > mid.timestamp) return binarySearchBlock(provider, timestamp, mid, high)
  // mid later
  return binarySearchBlock(provider, timestamp, low, mid)
}
