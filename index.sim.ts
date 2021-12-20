/**
 * @notice Entry point for executing a single proposal against a forked mainnet
 */

require('dotenv').config()
import fs from 'fs'
import { RUNNING_LOCALLY, SIM_NAME } from './utils/constants'
import { provider } from './utils/clients/ethers'
import { simulate } from './utils/clients/tenderly'
import { AllCheckResults, SimulationConfig } from './types'
import ALL_CHECKS from './checks'
import { toProposalReport } from './presentation/markdown'

/**
 * @notice Executes proposal checks and generates a report for the proposal ID specified
 * by the PROPOSAL_ID environment variable, based on simulating execution of that proposal
 * at the block specified by the FORK_BLOCK environment variable.
 */
async function main() {
  // --- Get simulation parameters ---
  const configPath = `./sims/${SIM_NAME}.sim.ts`
  const config: SimulationConfig = require(configPath).config // dynamic path `import` statements not allowed

  // --- Simulate proposal execution ---
  const { sim, proposal, block } = await simulate(config)

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
    proposal.startBlock.toNumber() <= block.number ? provider.getBlock(proposal.startBlock.toNumber()) : null,
    proposal.endBlock.toNumber() <= block.number ? provider.getBlock(proposal.endBlock.toNumber()) : null,
  ])

  const report = toProposalReport({ start: startBlock, end: endBlock, current: block }, proposal, checkResults)

  if (RUNNING_LOCALLY) {
    // Running locally, dump to file
    const dir = `./reports/${config.daoName}/${config.governorAddress}/`
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
