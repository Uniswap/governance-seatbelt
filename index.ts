/**
 * @notice Entry point for executing a single proposal against a forked mainnet
 */

require('dotenv').config()
import fs from 'fs'
import { DAOs, DAO_NAME, PROPOSAL_FILTER, OMIT_CACHE } from './utils/constants'
import { provider } from './utils/clients/ethers'
import { simulate } from './utils/clients/tenderly'
import { AllCheckResults, ProposalData, SimulationConfig, SimulationConfigBase, SimulationData } from './types'
import ALL_CHECKS from './checks'
import { toProposalReport } from './presentation/markdown'
import { aaveGovV2, isProposalStateImmutable, PROPOSAL_STATES } from './utils/contracts/aave-governance-v2'
import { executor } from './utils/contracts/executor'
import { PromisePool } from '@supercharge/promise-pool'

// load cache
const proposalStateCachePath = './proposal-states.json'
let cache: { [key: string]: string } = {}
if (fs.existsSync(proposalStateCachePath)) cache = require(proposalStateCachePath)

// make sure env variables are set
if (!DAOs[DAO_NAME as keyof typeof DAOs]) {
  throw new Error(`DAO_NAME:${DAO_NAME} unknown. Must be one of ${Object.keys(DAOs).join(',')}`)
}
const AAVE_GOV_V2_ADDRESS = DAOs[DAO_NAME as keyof typeof DAOs]

function getProposalFileName(config: SimulationConfig) {
  const basePath = `${config.daoName}/${config.governanceAddress}`
  // zero padding so the alphabetic file sorting on github works
  const filename = `${config.proposalId.toString().padStart(3, '0')}.md`
  const dir = `./reports/${basePath}/`
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  return `${dir}/${filename}`
}

async function runSimulation() {
  // --- Run simulations ---
  // Fetch all proposal IDs
  const governance = aaveGovV2(AAVE_GOV_V2_ADDRESS)
  const proposalsCount = await governance.getProposalsCount()
  const _allProposalIds = [...Array(Number(proposalsCount)).keys()]

  const allProposalIds = PROPOSAL_FILTER
    ? _allProposalIds.filter((id) => PROPOSAL_FILTER!.includes(id))
    : _allProposalIds

  const states = await Promise.all(allProposalIds.map((id) => governance.getProposalState(id)))
  const simProposals: { id: number; simType: SimulationConfigBase['type']; state: keyof typeof PROPOSAL_STATES }[] =
    allProposalIds.map((id, i) => {
      // If state is `Executed` (state 7), we use the executed sim type and effectively just
      // simulate the real transaction. For all other states, we use the `proposed` type because
      // state overrides are required to simulate the transaction
      const state = String(states[i]) as keyof typeof PROPOSAL_STATES
      const isExecuted = PROPOSAL_STATES[state] === 'Executed'
      return { id, simType: isExecuted ? 'executed' : 'proposed', state }
    })
  const simProposalsIds = simProposals.map((sim) => sim.id)

  // Simulate them
  // We intentionally do not run these in parallel to avoid hitting Tenderly API rate limits or flooding
  // them with requests if we e.g. simulate all proposals for a governance (instead of just active ones)
  const numProposals = simProposals.length
  console.log(`Simulating ${numProposals} ${DAO_NAME} proposals: IDs of ${JSON.stringify(simProposalsIds)}`)

  const errors: any[] = []
  const { results: _results } = await PromisePool.for(simProposals)
    .withConcurrency(5)
    .handleError(async (error, simProposal) => {
      errors.push(error)
      console.log(`error simulating proposal ${simProposal.id}`)
      throw error
    })
    .process(async (simProposal) => {
      console.log(`  Simulating ${DAO_NAME} proposal ${simProposal.id}...`)
      const config: SimulationConfig = {
        type: simProposal.simType,
        daoName: DAO_NAME,
        governanceAddress: governance.address,
        proposalId: simProposal.id,
        currentProposalState: simProposal.state,
      }
      // skip proposals when they were simulated before in an immutable state
      const skip = isProposalStateImmutable(simProposal.state) && cache[simProposal.id] === simProposal.state
      if (fs.existsSync(getProposalFileName(config)) && skip && !OMIT_CACHE) {
        console.log(`Skipped simulation for ${simProposal.id}`)
      } else {
        const { sim, proposal, latestBlock } = await simulate(config)
        return { sim, proposal, latestBlock, config }
      }
    })
  if (errors.length) throw errors
  return _results.filter((r) => r) as SimulationData[]
}

async function generateReports(simOutputs: SimulationData[]) {
  const governance = aaveGovV2(AAVE_GOV_V2_ADDRESS)

  console.log('Starting proposal checks and report generation...')
  const errors: any[] = []
  await PromisePool.for(simOutputs)
    .withConcurrency(2)
    .handleError(async (error, simOutput) => {
      errors.push(error)
      console.log(`error generating report for proposal ${simOutput.proposal.id}`)
      throw error
    })
    .process(async (simOutput) => {
      // Run checks
      const { sim, proposal, latestBlock, config } = simOutput
      const proposalData: ProposalData = { governance, provider, executor: executor(await proposal.executor) }
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
      const report = await toProposalReport(
        { start: startBlock, end: endBlock, current: latestBlock },
        proposal,
        checkResults,
        sim
      )

      // save report
      fs.writeFileSync(getProposalFileName(config), report)
      cache[proposal.id.toString()] = config.currentProposalState
    })
  if (errors.length) throw errors
}

/**
 * @notice Simulate governance proposals and run proposal checks against them
 */
async function main() {
  const simOutputs = await runSimulation()
  // --- Run proposal checks and save output ---
  // Generate the proposal data and dependencies needed by checks
  await generateReports(simOutputs)
  // store cache
  fs.writeFileSync(proposalStateCachePath, JSON.stringify(cache))
  console.log('Done!')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
