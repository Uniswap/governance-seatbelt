require('dotenv').config()
import { aaveGovernanceContract, isProposalStateImmutable } from '../utils/contracts/aave-governance-v2'
import { readFileSync, existsSync } from 'node:fs'

/**
 * We only want to re-simulate proposals that:
 * a) have not yet finished
 * b) were last ran in a different state
 * This allows us to be "faster", so we can run more frequently.
 * As github action has no step level parallelization, we abuse the matrix feature to generate chunks of proposals.
 * The proposal are split in potentially uneven chunks, where the last chunk is smaller.
 * The reasoning behind that is that we can reuse a deterministic cache-key per chunk.
 */
async function generateMatrix() {
  const proposalsCount = await aaveGovernanceContract.getProposalsCount()
  const proposals = [...Array(Number(proposalsCount)).keys()]
  const proposalKeys: number[] = []
  const path = './proposal-states.json'
  const cache = existsSync(path) ? JSON.parse(readFileSync(path).toString()) : {}
  for (let i = 0; i < proposals.length; i++) {
    if (!cache[i] || !isProposalStateImmutable(cache[i])) {
      proposalKeys.push(i)
    }
    if (proposalKeys.length >= 20) break
  }
  console.log(`::set-output name=matrix::${proposalKeys.join(',')}`)
}

generateMatrix()
