/**
 * @notice Entry point for executing a single proposal against a forked mainnet
 */

require('dotenv').config()
import fs from 'fs'
import { DAO_NAME, PROPOSAL_FILTER, OMIT_CACHE, AAVE_GOV_V2_ADDRESS } from './utils/constants'
import { provider } from './utils/clients/ethers'
import { AllCheckResults, ProposalData, SimulationResult } from './types'
import ALL_CHECKS from './checks'
import { toArcReport, toProposalReport } from './presentation/markdown'
import { aaveGovernanceContract, isProposalStateImmutable, PROPOSAL_STATES } from './utils/contracts/aave-governance-v2'
import { executor } from './utils/contracts/executor'
import { PromisePool } from '@supercharge/promise-pool'
import { simulateProposal } from './utils/simulations/proposal'
import { getArcPayload, simulateArc, targetsArc } from './utils/simulations/arc'

// load cache
const proposalStateCachePath = './proposal-states.json'
let cache: { [key: string]: number } = {}
if (fs.existsSync(proposalStateCachePath)) cache = require(proposalStateCachePath)

function getProposalFileName(proposalId: number, simulationFileSuffix?: string) {
  const basePath = `${DAO_NAME}/${AAVE_GOV_V2_ADDRESS}`
  // zero padding so the alphabetic file sorting on github works
  const filename = `${proposalId.toString().padStart(3, '0')}${
    simulationFileSuffix ? `_${simulationFileSuffix}` : ''
  }.md`
  const dir = `./reports/${basePath}`
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  return `${dir}/${filename}`
}

async function runSimulation() {
  // --- Run simulations ---
  // Fetch all proposal IDs
  const proposalsCount = await aaveGovernanceContract.getProposalsCount()
  const _allProposalIds = [...Array(Number(proposalsCount)).keys()]

  const allProposalIds = PROPOSAL_FILTER
    ? _allProposalIds.filter((id) => PROPOSAL_FILTER!.includes(id))
    : _allProposalIds

  // Simulate them
  // We intentionally do not run these in parallel to avoid hitting Tenderly API rate limits or flooding
  // them with requests if we e.g. simulate all proposals for a governance (instead of just active ones)
  console.log(`Simulating ${allProposalIds.length} ${DAO_NAME} proposals: IDs of ${JSON.stringify(allProposalIds)}`)

  const errors: any[] = []
  console.log(`\n### cacheConfig ###\ncache:${JSON.stringify(cache)}\nOMIT_CACHE:${OMIT_CACHE}\n`)
  const { results: _results } = await PromisePool.for(allProposalIds)
    .withConcurrency(5)
    .handleError(async (error, proposalId) => {
      errors.push(error)
      console.log(`error simulating proposal ${proposalId}`)
      throw error
    })
    .process(async (proposalId) => {
      console.log(`  Simulating ${DAO_NAME} proposal ${proposalId}...`)
      // skip proposals when they were simulated before in an immutable state
      const proposalState = (await aaveGovernanceContract.getProposalState(proposalId)) as keyof typeof PROPOSAL_STATES
      const skip = isProposalStateImmutable(proposalState) && cache[proposalId] === proposalState
      if (fs.existsSync(getProposalFileName(proposalId)) && skip && !OMIT_CACHE) {
        console.log(`Skipped simulation for ${proposalId}`)
      } else {
        const { sim, latestBlock, proposal } = await simulateProposal(proposalId)
        if (targetsArc(sim)) {
          return { sim, proposal, latestBlock, arc: await simulateArc(sim) }
        }
        return { sim, proposal, latestBlock }
      }
    })
  if (errors.length) throw errors
  return _results.flat().filter((r) => r) as SimulationResult[]
}

async function generateReports(simOutputs: SimulationResult[]) {
  console.log('Starting proposal checks and report generation...')
  const errors: any[] = []
  await PromisePool.for(simOutputs)
    .withConcurrency(2)
    .handleError(async (error, simOutput) => {
      errors.push(error)
      console.log(error)
      console.log(`error generating report for proposal ${simOutput.proposal.id}`)
      throw error
    })
    .process(async (simOutput) => {
      // Run checks
      const { sim, proposal, latestBlock, arc } = simOutput
      const proposalData: ProposalData = {
        governance: aaveGovernanceContract,
        provider,
        executor: executor(proposal.executor),
      }
      console.log(`  Running for proposal ${proposal.id} ...`)
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

      const subReports: { name: string; link: string }[] = []
      if (arc) {
        console.log(`  Running for proposal ${proposal.id} arc ...`)
        const arcCheckResults: AllCheckResults = Object.fromEntries(
          await Promise.all(
            Object.keys(ALL_CHECKS).map(async (checkId) => [
              checkId,
              {
                name: ALL_CHECKS[checkId].name,
                result: await ALL_CHECKS[checkId].checkProposal(proposal, arc, proposalData),
              },
            ])
          )
        )

        const { proposalId } = getArcPayload(sim)
        const arcReport = await toArcReport(
          { start: startBlock, end: endBlock, current: latestBlock },
          arcCheckResults,
          arc,
          `${proposalId} arc proposal`
        )
        const filename = getProposalFileName(proposal.id.toNumber(), 'arc')
        fs.writeFileSync(filename, arcReport)
        cache[proposal.id.toString()] = proposal.state
        // will be rendered in another markdown so the path cannot be relative to the file
        subReports.push({ link: filename.replace('./', '/'), name: 'arc' })
      }

      const report = await toProposalReport(
        { start: startBlock, end: endBlock, current: latestBlock },
        proposal,
        checkResults,
        sim,
        subReports
      )

      // save report
      fs.writeFileSync(getProposalFileName(proposal.id.toNumber()), report)
      cache[proposal.id.toString()] = proposal.state
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
