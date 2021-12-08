/**
 * @notice Entry point for executing a single proposal against a forked mainnet
 */

require('dotenv').config()
import fetchUrl, { FETCH_OPT } from 'micro-ftch'
import { RPC_URL, TENDERLY_ACCESS_TOKEN, TENDERLY_URL } from './utils/constants'
import { Contract } from 'ethers'
import { JsonRpcProvider } from '@ethersproject/providers'
import { governorBravo } from './utils/contracts/governor-bravo'
import { Proposal, TenderlyPayload } from './types'

const PROPOSAL_ID = Number(process.env.PROPOSAL_ID)
const provider = new JsonRpcProvider(RPC_URL)

/**
 * @notice Simulates execution of a governance proposal
 * @param proposal Proposal to simulate
 * @param governor Contract instance of the governor contract for that proposal
 * @returns Transaction data and receipt
 */
async function simulate(proposal: Proposal, governor: Contract) {
  const simulationPayload: TenderlyPayload = {
    network_id: '1',
    block_number: 13636201,
    from: '',
    to: '',
    input: '',
    gas: 30000000,
    value: '0',
    save: false,
    generate_access_list: true,
  }

  const fetchOptions = {
    method: 'POST',
    type: 'json',
    headers: { 'X-Access-Key': TENDERLY_ACCESS_TOKEN },
    data: simulationPayload,
  }
  const response = await fetchUrl(TENDERLY_URL, <Partial<FETCH_OPT>>fetchOptions)
  return { tx: response }
}

/**
 * @notice Executes proposal checks and generates a report for the proposal ID specified
 * by the PROPOSAL_ID environment variable, based on simulating execution of that proposal
 * at the block specified by the FORK_BLOCK environment variable.
 */
async function main() {
  // --- Save off current block/datetime (where "current" means the block we forked at) ---
  const latestBlock = await provider.getBlock('latest')
  const currentDateTime = new Date(latestBlock.timestamp * 1000)
  const formattedDateTime = currentDateTime.toISOString()

  // --- Find the proposal we're analyzing ---
  const blockRange = [0, latestBlock.number]
  const createProposalLogs = await governorBravo.queryFilter(governorBravo.filters.ProposalCreated(), ...blockRange)
  const proposalEvent = createProposalLogs.filter((log) => log.args?.id.toNumber() === PROPOSAL_ID)[0]
  if (!proposalEvent) {
    throw new Error(`Proposal ID ${PROPOSAL_ID} not found in logs for governor at ${governorBravo.address}`)
  }
  const proposal = proposalEvent.args as unknown as Proposal

  // --- Simulate proposal execution ---
  const { tx } = await simulate(proposal, governorBravo)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
