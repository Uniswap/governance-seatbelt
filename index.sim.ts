/**
 * @notice Entry point for executing a single proposal against a forked mainnet
 */

require('dotenv').config()
import fs from 'fs'
import { DAO_NAME, PROPOSAL_ID, RUNNING_LOCALLY } from './utils/constants'
import { governorBravo } from './utils/contracts/governor-bravo'
import { provider } from './utils/clients/ethers'
import { simulate } from './utils/clients/tenderly'
import { AllCheckResults, Proposal } from './types'
import ALL_CHECKS from './checks'
import { toProposalReport } from './presentation/markdown'

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
