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
import { AllCheckResults, ProposalEvent, SimulationConfig, SimulationConfigBase, SimulationData } from './types'
import ALL_CHECKS from './checks'
import { toProposalReport } from './presentation/markdown'
import { governorBravo, PROPOSAL_STATES } from './utils/contracts/governor-bravo'
import { timelock } from './utils/contracts/timelock'

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

    // If we aren't simulating all proposals, filter down to just the active ones. For now we
    // assume we're simulating all by default
    const states = await Promise.all(validProposalIds.map((id) => governor.state(id)))
    const simProposals: { id: number; simType: SimulationConfigBase['type'] }[] = validProposalIds.map((id, i) => {
      // If state is `Executed` (state 7), we use the executed sim type and effectively just
      // simulate the real transaction. For all other states, we use the `proposed` type because
      // state overrides are required to simulate the transaction
      const state = String(states[i]) as keyof typeof PROPOSAL_STATES
      const isExecuted = PROPOSAL_STATES[state] === 'Executed'
      return { id, simType: isExecuted ? 'executed' : 'proposed' }
    })
    const simProposalsIds = simProposals.map((sim) => sim.id)

    // Simulate them
    // We intentionally do not run these in parallel to avoid hitting Tenderly API rate limits or flooding
    // them with requests if we e.g. simulate all proposals for a governor (instead of just active ones)
    const numProposals = simProposals.length
    console.log(`Simulating ${numProposals} ${DAO_NAME} proposals: IDs of ${JSON.stringify(simProposalsIds)}`)
    for (const simProposal of simProposals) {
      if (simProposal.simType === 'new') throw new Error('Simulation type "new" is not supported in this branch')
      // Determine if this proposal is already `executed` or currently in-progress (`proposed`)
      console.log(`  Simulating ${DAO_NAME} proposal ${simProposal.id}...`)
      const config: SimulationConfig = {
        type: simProposal.simType,
        daoName: DAO_NAME,
        governorAddress: governor.address,
        proposalId: simProposal.id,
      }
      const { sim, proposal, latestBlock } = await simulate(config)
      simOutputs.push({ sim, proposal, latestBlock, config })
      console.log(`    done`)
    }
  }

  // --- Run proposal checks and save output ---
  // Generate the proposal data and dependencies needed by checks
  const governor = governorBravo(simOutputs[0].config.governorAddress) // all sims have the same governor address
  const proposalData = { governor, provider, timelock: timelock(await governor.admin()) }

  console.log('Starting proposal checks and report generation...')
  for (const simOutput of simOutputs) {
    // Run checks
    const { sim, proposal, latestBlock, config } = simOutput
    console.log(`  Running for proposal ${proposal.id}...`)
    const checkResults: AllCheckResults = Object.fromEntries(
      await Promise.all(
        Object.keys(ALL_CHECKS).map(async (checkId) => [
          checkId,
          {
            name: ALL_CHECKS[checkId].name,
            result: await ALL_CHECKS[checkId].checkProposal(proposal, sim, proposalData),
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
      console.log(`    Report successfully generated for ${path}`)
    }
  }
  console.log('Done!')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
