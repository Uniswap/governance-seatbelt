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
  SIM_ALL,
  SIM_NAME,
} from './utils/constants'
import { provider } from './utils/clients/ethers'
import { simulate } from './utils/clients/tenderly'
import { AllCheckResults, ProposalEvent, SimulationConfig, SimulationConfigProposed, SimulationData } from './types'
import ALL_CHECKS from './checks'
import { toProposalReport } from './presentation/markdown'
import { governorBravo, PROPOSAL_STATES, FINAL_PROPOSAL_STATES } from './utils/contracts/governor-bravo'

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
    // If no SIM_NAME is provided, we get proposals to simulate from the chain
    if (!GOVERNOR_ADDRESS) throw new Error('Must provider a GOVERNOR_ADDRESS')
    if (!DAO_NAME) throw new Error('Must provider a DAO_NAME')
    const latestBlock = await provider.getBlock('latest')

    // Fetch all proposal IDs
    const governor = governorBravo(GOVERNOR_ADDRESS)
    const proposalCreatedLogs = await governor.queryFilter(governor.filters.ProposalCreated(), 0, latestBlock.number)
    const allProposalIds = proposalCreatedLogs.map((logs) => (logs.args as unknown as ProposalEvent).id.toNumber())

    // Remove proposals from GovernorAlpha based on the initial GovernorBravo proposal ID
    const initialProposalId = await governor.initialProposalId()
    const validProposalIds = allProposalIds.filter((id) => id > initialProposalId.toNumber())

    // If we aren't simulating all proposals, filter down to just the active ones
    let activeProposalIds: number[] = validProposalIds // assume we're simulating all by default
    if (!SIM_ALL) {
      // Remove proposals that are in a finalized state
      const states = await Promise.all(validProposalIds.map((id) => governor.state(id)))
      activeProposalIds = validProposalIds.reduce((activeIds, id, i) => {
        const state = String(states[i]) as keyof typeof PROPOSAL_STATES
        const isFinalized = FINAL_PROPOSAL_STATES.includes(PROPOSAL_STATES[state])
        if (!isFinalized) activeIds.push(id)
        return activeIds
      }, [] as number[])
    }

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

    // Generate report
    const [startBlock, endBlock] = await Promise.all([
      proposal.startBlock.toNumber() <= latestBlock.number ? provider.getBlock(proposal.startBlock.toNumber()) : null,
      proposal.endBlock.toNumber() <= latestBlock.number ? provider.getBlock(proposal.endBlock.toNumber()) : null,
    ])
    const report = toProposalReport({ start: startBlock, end: endBlock, current: latestBlock }, proposal, checkResults)

    // Save report
    const basePath = `${config.daoName}/${config.governorAddress}`
    const filename = `${proposal.id}.md`
    if (RUNNING_LOCALLY) {
      // Running locally, dump to file
      const dir = `./reports/${basePath}/`
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
      fs.writeFileSync(`${dir}/${filename}`, report)
    } else {
      // Running in CI, save to file on REPORTS_BRANCH
      const { github } = await import('./utils/clients/github') // lazy load to avoid errors about missing env vars when not in CI
      const path = `${basePath}/${filename}`
      let sha: string | undefined
      try {
        const { data } = await github.rest.repos.getContent({
          owner: GITHUB_REPO_OWNER,
          repo: GITHUB_REPO_NAME,
          ref: REPORTS_BRANCH,
          path,
        })
        if ('sha' in data) {
          sha = data.sha
        }
      } catch (error) {
        console.warn('Failed to get sha for file at path', path, error)
      }

      const currentDateTime = new Date(latestBlock.timestamp * 1000)
      const formattedDateTime = currentDateTime.toISOString()
      const res = await github.rest.repos.createOrUpdateFileContents({
        owner: GITHUB_REPO_OWNER,
        repo: GITHUB_REPO_NAME,
        branch: REPORTS_BRANCH,
        message: `Update ${path} as of ${formattedDateTime}`,
        content: Buffer.from(report, 'utf-8').toString('base64'),
        path,
        sha,
      })
      if (res.status < 200 || res.status > 299) {
        console.warn(JSON.stringify(res))
        console.warn('createOrUpdateFileContents failed with the above response')
      }
      console.log(`Report successfully generated for ${path}`)
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
