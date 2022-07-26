import { DAO_NAME, OMIT_CACHE } from '../utils/constants'
import { aaveGovernanceContract, isProposalStateImmutable } from '../utils/contracts/aave-governance-v2'
import { restoreCache } from '@actions/cache'
import { unlinkSync, readFileSync, existsSync } from 'node:fs'

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
  const json = { include: [] as { DAO_NAME: string; proposals: string; cacheKey: string }[] }
  const chunkSize = 10
  let shouldRun = OMIT_CACHE
  for (let i = 0; i < proposals.length; i += chunkSize) {
    let chunk = proposals.slice(i, i + chunkSize)
    const cacheKey = [...Array(Number(chunkSize)).keys()]
      .map((n) => n + i)
      .toString()
      .replace(/,/g, '_')
    /**
     * The cache is per matrix chunk, so we have to restore it per chunk and diff the states
     * If we already know all proposals of a chunk are cached, we can omit the whole chunk.
     */
    if (!OMIT_CACHE) {
      const key = await restoreCache(['proposal-states.json'], `${DAO_NAME}-${cacheKey}-${process.env.GITHUB_SHA}`, [
        `${DAO_NAME}-${cacheKey}-`,
      ])
      if (key) {
        const path = './proposal-states.json'
        const cache = existsSync(path) ? JSON.parse(readFileSync(path).toString()) : {}
        console.log(cache)
        let tempChunk = []
        for (const proposalId of chunk) {
          // id not cached
          if (!cache[proposalId] || !isProposalStateImmutable(cache[proposalId])) {
            tempChunk.push(proposalId)
            shouldRun = true
          }
        }
        chunk = tempChunk
        unlinkSync(path)
      }
    }
    // we need to use _ instead of, so we can use it as a cache identifier
    if (chunk.length != 0) {
      json.include.push({
        DAO_NAME: DAO_NAME as string,
        proposals: chunk.toString().replace(/,/g, '_'),
        cacheKey,
      })
    }
  }
  console.log(`::set-output name=matrix::${JSON.stringify(json)}`)
  console.log(`::set-output name=shouldRun::${shouldRun ? 'true' : 'false'}`)
}

generateMatrix()
