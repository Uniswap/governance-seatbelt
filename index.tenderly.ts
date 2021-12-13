/**
 * @notice Entry point for executing a single proposal against a forked mainnet
 */

require('dotenv').config()
import fs from 'fs'
import fetchUrl, { FETCH_OPT } from 'micro-ftch'
import { Contract } from 'ethers'
import { getAddress } from '@ethersproject/address'

import {
  DAO_NAME,
  FORK_BLOCK,
  PROPOSAL_ID,
  RUNNING_LOCALLY,
  TENDERLY_ACCESS_TOKEN,
  TENDERLY_URL,
} from './utils/constants'
import { governorBravo } from './utils/contracts/governor-bravo'
import { provider } from './utils/clients/ethers'
import { AllCheckResults, Proposal, TenderlyPayload, TenderlySimulation } from './types'
import ALL_CHECKS from './checks'
import { toProposalReport } from './presentation/markdown'

/**
 * @notice Simulates execution of a governance proposal
 * @dev TODO support sending value (seems proposal.values is a function when it should be an array?)
 * @param proposal Proposal to simulate
 * @param governor Contract instance of the governor contract for that proposal
 * @returns Transaction data and receipt
 */
async function simulate(proposal: Proposal, governor: Contract) {
  // Arbitrary, random EOA that we'll use to kick off the transaction
  const eoa = '0xFFa23F5068972666B99496aAAA639f3Ec5A1FE91'

  // Prepare tenderly payload
  const simulationPayload: TenderlyPayload = {
    network_id: String(provider.network.chainId) as TenderlyPayload['network_id'],
    block_number: FORK_BLOCK,
    from: eoa,
    to: governor.address,
    input: governor.interface.encodeFunctionData('execute', [proposal.id]),
    gas: 30000000, // current block gas limit
    gas_price: '0',
    value: '0',
    save: false,
    generate_access_list: true,
  }

  // Send simulation request
  const fetchOptions = <Partial<FETCH_OPT>>{
    method: 'POST',
    type: 'json',
    headers: { 'X-Access-Key': TENDERLY_ACCESS_TOKEN },
    data: simulationPayload,
  }
  const sim = <TenderlySimulation>await fetchUrl(TENDERLY_URL, fetchOptions)

  // Post-processing to ensure addresses we use are checksummed (since ethers returns checksummed addresses)
  sim.transaction.addresses = sim.transaction.addresses.map(getAddress)
  sim.contracts.forEach((contract) => (contract.address = getAddress(contract.address)))
  return sim
}

/**
 * @notice Executes proposal checks and generates a report for the proposal ID specified
 * by the PROPOSAL_ID environment variable, based on simulating execution of that proposal
 * at the block specified by the FORK_BLOCK environment variable.
 */
async function main() {
  // --- Save off current block/datetime (where "current" means the block we forked at) ---
  const latestBlock = await provider.getBlock('latest')

  // --- Find the proposal we're analyzing ---
  const blockRange = [0, latestBlock.number]
  const createProposalLogs = await governorBravo.queryFilter(governorBravo.filters.ProposalCreated(), ...blockRange)
  const proposalEvent = createProposalLogs.filter((log) => log.args?.id.toNumber() === PROPOSAL_ID)[0]
  if (!proposalEvent) {
    throw new Error(`Proposal ID ${PROPOSAL_ID} not found in logs for governor at ${governorBravo.address}`)
  }
  const proposal = proposalEvent.args as unknown as Proposal

  // --- Simulate proposal execution ---
  const sim = await simulate(proposal, governorBravo)

  // --- Run proposal checks ---
  const checkResults: AllCheckResults = Object.fromEntries(
    await Promise.all(
      Object.keys(ALL_CHECKS).map(async (checkId) => [
        checkId,
        {
          name: ALL_CHECKS[checkId].name,
          result: await ALL_CHECKS[checkId].checkProposal(proposal, sim),
        },
      ])
    )
  )

  // --- Save report ---
  const [startBlock, endBlock] = await Promise.all([
    proposal.startBlock.toNumber() <= latestBlock.number ? provider.getBlock(proposal.startBlock.toNumber()) : null,
    proposal.endBlock.toNumber() <= latestBlock.number ? provider.getBlock(proposal.endBlock.toNumber()) : null,
  ])

  const report = toProposalReport({ start: startBlock, end: endBlock, current: latestBlock }, proposal, checkResults)

  if (RUNNING_LOCALLY) {
    // Running locally, dump to file
    const dir = `./reports/${DAO_NAME}/${governorBravo.address}/`
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(`${dir}/${proposal.id}.md`, report)
  } else {
    // Running in CI, save to file on REPORTS_BRANCH
    // TODO
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
