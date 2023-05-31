/**
 * @notice Entry point for executing a single proposal against a forked mainnet
 */

require('dotenv').config()
import fs from 'fs'
import { DAO_NAME, PROPOSAL_FILTER, OMIT_CACHE, AAVE_GOV_V2_ADDRESS } from './utils/constants'
import { provider, polygonProvider, optimismProvider, arbitrumProvider } from './utils/clients/ethers'
import { AllCheckResults, ProposalData } from './types'
import ALL_CHECKS from './checks'
import { toSubReport, toProposalReport } from './presentation/markdown'
import { aaveGovernanceContract, isProposalStateImmutable, PROPOSAL_STATES } from './utils/contracts/aave-governance-v2'
import { executor } from './utils/contracts/executor'
import { PromisePool } from '@supercharge/promise-pool'

import { simulateProposal } from '@bgd-labs/aave-cli'

Error.stackTraceLimit = Infinity

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
    .withConcurrency(2)
    .handleError(async (error, proposalId) => {
      errors.push(error)
      console.log(`error simulating proposal ${proposalId}`)
      throw error
    })
    .process(async (proposalId) => {
      try {
        console.log(`  Simulating ${DAO_NAME} proposal ${proposalId}...`)
        // skip proposals when they were simulated before in an immutable state
        const proposalState = (await aaveGovernanceContract.getProposalState(
          proposalId
        )) as keyof typeof PROPOSAL_STATES
        const skip = isProposalStateImmutable(proposalState) && cache[proposalId] === proposalState
        if (fs.existsSync(getProposalFileName(proposalId)) && skip && !OMIT_CACHE) {
          console.log(`Skipped simulation for ${proposalId}`)
        } else {
          const { proposal, simulation, subSimulations } = await simulateProposal(BigInt(proposalId))

          return { simulation, proposal: { ...proposal, state: proposalState }, subSimulations }
        }
      } catch (e) {
        console.log(e)
        return null
      }
    })
  if (errors.length) throw errors
  return _results.flat().filter((r) => r) as (Awaited<ReturnType<typeof simulateProposal>> & {
    proposal: { state: number }
  })[]
}

async function generateReports(simOutputs: Awaited<ReturnType<typeof runSimulation>>) {
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
      const { simulation, proposal, subSimulations } = simOutput
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
              result: await ALL_CHECKS[checkId].checkProposal(proposal, simulation as any, proposalData),
            },
          ])
        )
      )

      const subReports: { name: string; link: string }[] = []
      if (subSimulations?.length) {
        for (let i = 0; i < subSimulations.length; i++) {
          const { simulation, name, args, state } = subSimulations[i]
          console.log(`  Running for sub-proposal ${proposal.id} ...`)
          const checkResults: AllCheckResults = Object.fromEntries(
            await Promise.all(
              Object.keys(ALL_CHECKS).map(async (checkId) => [
                checkId,
                {
                  name: ALL_CHECKS[checkId].name,
                  result: await ALL_CHECKS[checkId].checkProposal({ ...args, id: args.proposalId }, simulation as any, {
                    ...proposalData,
                    provider:
                      name === 'Arbitrum'
                        ? arbitrumProvider
                        : name === 'Polygon'
                        ? polygonProvider
                        : name === 'Optimism'
                        ? optimismProvider
                        : provider,
                  }),
                },
              ])
            )
          )

          const subReport = await toSubReport(checkResults, simulation, name)
          const filename = getProposalFileName(Number(proposal.id), `${name}_${args.proposalId || `pending_${i}`}`)
          fs.writeFileSync(filename, subReport)
          // will be rendered in another markdown so the path cannot be relative to the file
          subReports.push({ link: filename.replace('./', '/'), name: 'PolygonBridgeExecution' })
        }
      }

      const report = await toProposalReport(proposal, checkResults, simulation, subReports)

      // save report
      fs.writeFileSync(getProposalFileName(Number(proposal.id)), report)

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
  fs.writeFileSync(proposalStateCachePath, JSON.stringify(cache, null, 2))
  console.log('Done!')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
