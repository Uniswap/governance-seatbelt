import { getAddress } from '@ethersproject/address'
import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import fetchUrl, { FETCH_OPT } from 'micro-ftch'
import { TENDERLY_ACCESS_TOKEN, TENDERLY_BASE_URL, TENDERLY_SIM_URL } from '../constants'
import { TenderlyContract, TenderlyPayload, TenderlySimulation } from '../../types'

const TENDERLY_FETCH_OPTIONS = { type: 'json', headers: { 'X-Access-Key': TENDERLY_ACCESS_TOKEN } }

// --- Helper methods ---

// Sleep for the specified number of milliseconds
export const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay)) // delay in milliseconds

// Get a random integer between two values
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min) // max is exclusive, min is inclusive

/**
 * @notice Given a Tenderly contract object, generates a descriptive human-friendly name for that contract
 * @param contract Tenderly contract object to generate name from
 */
export function getContractName(contracts: TenderlyContract[] = [], address: string): string {
  // lower-case comparison as strict equality would fail on child contracts which are lower-cased when returned from tenderly
  const contract = contracts.find((c) => c.address.toLowerCase() === address.toLowerCase())
  if (!contract) return `unknown contract name at \`${getAddress(address)}\``
  let contractName = contract?.contract_name

  // If the contract is a token, include the full token name. This is useful in cases where the
  // token is a proxy, so the contract name doesn't give much useful information
  if (contract?.token_data?.name) contractName += ` (${contract?.token_data?.name})`

  // if the contract is a proxy include it's child
  if (contract.standards?.includes('eip1967') && contract.child_contracts?.[0].address) {
    return `${contractName} at \`${getAddress(contract.address)}\` with implementation ${getContractName(
      contracts,
      contract.child_contracts?.[0].address
    )}`
  }

  // Lastly, append the contract address and save it off
  return `${contractName} at \`${getAddress(contract.address)}\``
}

/**
 * Gets the latest block number known to Tenderly
 * @param chainId Chain ID to get block number for
 */
export async function getLatestBlock(chainId: BigNumberish): Promise<number> {
  // Send simulation request
  const fetchOptions = <Partial<FETCH_OPT>>{ method: 'GET', ...TENDERLY_FETCH_OPTIONS }
  const res = <{ block_number: number }>(
    await fetchUrl(`${TENDERLY_BASE_URL}/network/${BigNumber.from(chainId).toString()}/block-number`, fetchOptions)
  )
  return res.block_number
}

/**
 * @notice Sends a transaction simulation request to the Tenderly API
 * @dev Uses a simple exponential backoff when requests fail, with the following parameters:
 *   - Initial delay is 1 second
 *   - We randomize the delay duration to avoid synchronization issues if client is sending multiple requests simultaneously
 *   - We double delay each time and throw an error if delay is over 8 seconds
 * @param payload Transaction simulation parameters
 * @param delay How long to wait until next simulation request after failure, in milliseconds
 */
export async function sendSimulation(payload: TenderlyPayload, delay = 1000): Promise<TenderlySimulation> {
  try {
    // Send simulation request
    const fetchOptions = <Partial<FETCH_OPT>>{ method: 'POST', data: payload, ...TENDERLY_FETCH_OPTIONS }
    const sim = <TenderlySimulation>await fetchUrl(TENDERLY_SIM_URL, fetchOptions)

    // Post-processing to ensure addresses we use are checksummed (since ethers returns checksummed addresses)
    sim.transaction.addresses = sim.transaction.addresses.map(getAddress)
    sim.contracts.forEach((contract) => (contract.address = getAddress(contract.address)))
    return sim
  } catch (err: any) {
    const is429 = typeof err === 'object' && err?.statusCode === 400
    if (delay > 8000 || !is429) {
      console.warn(`Simulation request failed with the below request payload and error`)
      console.log(JSON.stringify(payload))
      throw err
    }
    console.warn(err)
    console.warn(
      `Simulation request failed with the above error, retrying in ~${delay} milliseconds. See request payload below`
    )
    console.log(JSON.stringify(payload))
    await sleep(delay + randomInt(0, 1000))
    return await sendSimulation(payload, delay * 2)
  }
}
