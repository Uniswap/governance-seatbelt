/**
 * @notice Entry point for executing a single proposal against a forked mainnet
 */

require('dotenv').config()
import fs from 'fs'
import {
  DAO_NAME,
  GITHUB_REPO_NAME,
  GITHUB_REPO_OWNER,
  GOVERNOR_ADDRESS,
  REPORTS_BRANCH,
  RUNNING_LOCALLY,
  SIM_NAME,
} from './utils/constants'
import { provider } from './utils/clients/ethers'
import { simulate } from './utils/clients/tenderly'
import { AllCheckResults, ProposalEvent, SimulationConfig, SimulationConfigProposed, SimulationData } from './types'
import ALL_CHECKS from './checks'
import { toProposalReport } from './presentation/markdown'
import { governorBravo } from './utils/contracts/governor-bravo'

/**
 * @notice Simulate governance proposals and run proposal checks against them
 */
async function main() {
  // --- Run simulations ---
  // Prepare array to store all simulation outputs
  const simOutputs: SimulationData[] = []

  // Determine if we are running a specific simulation or all on-chain proposals for a specified governor.
  if (SIM_NAME) {
    // If a SIM_NAME is provided, we run that simulation
    const configPath = `./sims/${SIM_NAME}.sim.ts`
    const config: SimulationConfig = require(configPath).config // dynamic path `import` statements not allowed
    const { sim, proposal, latestBlock } = await simulate(config)
    simOutputs.push({ sim, proposal, latestBlock, config })
  } else {
    // If no SIM_NAME is provided, we simulate all active proposals
    if (!GOVERNOR_ADDRESS) throw new Error('Must provider a GOVERNOR_ADDRESS')
    if (!DAO_NAME) throw new Error('Must provider a DAO_NAME')
    const latestBlock = await provider.getBlock('latest')

    // Look for any active proposal IDs
    // TODO this gives us all proposals, not active ones
    const governor = governorBravo(GOVERNOR_ADDRESS)
    const proposalCreatedLogs = await governor.queryFilter(governor.filters.ProposalCreated(), 0, latestBlock.number)
    const activeProposalIds = proposalCreatedLogs.map((logs) => (logs.args as unknown as ProposalEvent).id.toNumber())

    // Simulate them
    // We intentionally do not run these in parallel to avoid hitting Tenderly API rate limits or flooding
    // them with requests if we e.g. backtest all proposals for a governor (instead of just active ones)
    for (const id of activeProposalIds) {
      const config: SimulationConfigProposed = {
        type: 'proposed',
        daoName: DAO_NAME,
        governorAddress: governor.address,
        proposalId: id,
      }
      const { sim, proposal, latestBlock } = await simulate(config)
      simOutputs.push({ sim, proposal, latestBlock, config })
    }
  }

  // --- Run proposal checks and save output ---
  for (const simOutput of simOutputs) {
    // Run checks
    const { sim, proposal, latestBlock, config } = simOutput
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

    // Save report
    const [startBlock, endBlock] = await Promise.all([
      proposal.startBlock.toNumber() <= latestBlock.number ? provider.getBlock(proposal.startBlock.toNumber()) : null,
      proposal.endBlock.toNumber() <= latestBlock.number ? provider.getBlock(proposal.endBlock.toNumber()) : null,
    ])
    const report = toProposalReport({ start: startBlock, end: endBlock, current: latestBlock }, proposal, checkResults)

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
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
