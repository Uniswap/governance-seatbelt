import { BigNumber, BigNumberish, Contract } from 'ethers'
import { provider } from '../clients/ethers'
import { governorBravo } from './governor-bravo'
import { governorOz } from './governor-oz'
import { timelock } from './timelock'
import { GovernorType, ProposalEvent } from '../../types'

// --- Exported methods ---
export async function inferGovernorType(address: string): Promise<'oz' | 'compound'> {
  const abi = ['function initialProposalId() external view returns (uint256)']
  const governor = new Contract(address, abi, provider)

  try {
    // If the `initialProposalId` function exists, and the initial proposal was a "small" value,
    // it's overwhelmingly likely this is. OZ style governors use a hash as the proposal IDs so IDs
    // will be very large numbers.
    const id = <BigNumberish>await governor.initialProposalId()
    if (BigNumber.from(id).lte(100_000)) return 'compound'
  } catch (err) {}

  return 'oz'
}

export function getGovernor(governorType: GovernorType, address: string) {
  if (governorType === 'compound') return governorBravo(address)
  if (governorType === 'oz') return governorOz(address)
  throw new Error(`Unknown governor type: ${governorType}`)
}

export async function getProposal(
  governorType: GovernorType,
  address: string,
  proposalId: BigNumberish
): Promise<ProposalStruct> {
  const governor = getGovernor(governorType, address)
  if (governorType === 'compound') return governor.proposals(proposalId)

  // Piece together the struct for OZ Governors.
  const [[againstVotes, forVotes, abstainVotes], state, eta, startTime, endTime] = await Promise.all([
    governor.proposalVotes(proposalId),
    governor.state(proposalId),
    governor.proposalEta(proposalId),
    governor.proposalSnapshot(proposalId),
    governor.proposalDeadline(proposalId),
  ])

  return {
    id: BigNumber.from(proposalId),
    eta,
    startTime,
    endTime,
    forVotes,
    againstVotes,
    abstainVotes,
    canceled: state === 2,
    executed: state === 7,
  }
}

export async function getTimelock(governorType: GovernorType, address: string) {
  const governor = getGovernor(governorType, address)
  if (governorType === 'compound') return timelock(await governor.admin())
  return timelock(await governor.timelock())
}

export async function getProposalIds(
  governorType: GovernorType,
  address: string,
  latestBlockNum: number
): Promise<bigint[]> {
  if (governorType === 'compound') {
    // Fetch all proposal IDs
    const governor = governorBravo(address)
    const proposalCreatedLogs = await governor.queryFilter(governor.filters.ProposalCreated(), 0, latestBlockNum)
    const allProposalIds = proposalCreatedLogs.map((logs) => (logs.args as unknown as ProposalEvent).id!.toBigInt())

    // Remove proposals from GovernorAlpha based on the initial GovernorBravo proposal ID
    const initialProposalId = await governor.initialProposalId()
    return allProposalIds.filter((id) => id > initialProposalId.toBigInt())
  }

  const governor = governorOz(address)
  const proposalCreatedLogs = await governor.queryFilter(governor.filters.ProposalCreated(), 0, latestBlockNum)
  return proposalCreatedLogs.map((logs) => (logs.args as unknown as ProposalEvent).proposalId!.toBigInt())
}

export function getProposalId(proposal: ProposalEvent): bigint {
  const id = proposal.id || proposal.proposalId
  if (!id) throw new Error(`Proposal ID not found for proposal: ${JSON.stringify(proposal)}`)
  return id.toBigInt()
}

export function formatProposalId(governorType: GovernorType, id: BigNumberish) {
  if (governorType === 'oz') return BigNumber.from(id).toHexString()
  return BigNumber.from(id).toString()
}
