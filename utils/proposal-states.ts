import { existsSync, readFileSync, writeFileSync } from 'fs'
import { BigNumber } from 'ethers'
import { getAddress } from '@ethersproject/address'

export const PROPOSAL_STATES_PATH = './proposal-states.json'

/** GovernorBravo / OZ Governor states that will not change again. */
export const TERMINAL_PROPOSAL_STATES = new Set(['Canceled', 'Defeated', 'Expired', 'Executed'])

type ProposalStatesCache = Record<string, Record<string, number>>

export function loadProposalStates(): ProposalStatesCache {
  if (!existsSync(PROPOSAL_STATES_PATH)) return {}
  try {
    const raw = JSON.parse(readFileSync(PROPOSAL_STATES_PATH, 'utf8')) as ProposalStatesCache
    return raw && typeof raw === 'object' ? raw : {}
  } catch {
    console.warn(`WARNING: could not parse ${PROPOSAL_STATES_PATH}; starting with an empty cache`)
    return {}
  }
}

export function saveProposalStates(cache: ProposalStatesCache): void {
  writeFileSync(PROPOSAL_STATES_PATH, `${JSON.stringify(cache, null, 2)}\n`)
}

export function cachedState(
  cache: ProposalStatesCache,
  governorAddress: string,
  proposalId: BigNumber
): number | undefined {
  const byGov = cache[getAddress(governorAddress)]
  if (!byGov) return undefined
  const value = byGov[proposalId.toString()]
  return typeof value === 'number' ? value : undefined
}

export function setCachedState(
  cache: ProposalStatesCache,
  governorAddress: string,
  proposalId: BigNumber,
  state: number
): void {
  const gov = getAddress(governorAddress)
  if (!cache[gov]) cache[gov] = {}
  cache[gov][proposalId.toString()] = state
}
