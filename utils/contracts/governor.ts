import { BigNumber, BigNumberish, Contract } from 'ethers'
import { getAddress } from '@ethersproject/address'
import { toUtf8Bytes } from '@ethersproject/strings'
import { keccak256 } from '@ethersproject/keccak256'
import { defaultAbiCoder } from '@ethersproject/abi'
import { provider } from '../clients/ethers'
import { governorBravo, getBravoSlots } from './governor-bravo'
import { governorOz, getOzSlots } from './governor-oz'
import { timelock } from './timelock'
import { GovernorType, ProposalEvent, ProposalStruct } from '../../types'

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

export async function getVotingToken(governorType: GovernorType, address: string, proposalId: BigNumberish) {
  const governor = getGovernor(governorType, address)
  if (governorType === 'compound') {
    // Get voting token and total supply
    const govSlots = getBravoSlots(proposalId)
    const rawVotingToken = await provider.getStorageAt(governor.address, govSlots.votingToken)
    const votingToken = getAddress(`0x${rawVotingToken.slice(26)}`)
    return erc20(votingToken)
  }

  return erc20(await governor.token())
}

export function getGovSlots(governorType: GovernorType, proposalId: BigNumberish) {
  if (governorType === 'compound') return getBravoSlots(proposalId)
  return getOzSlots(proposalId)
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

// Generate proposal ID, used when simulating new proposals.
export async function generateProposalId(
  governorType: GovernorType,
  address: string,
  // Below arg is only required for OZ governors.
  {
    targets,
    values,
    calldatas,
    description,
  }: { targets: string[]; values: BigNumberish[]; calldatas: string[]; description: string } = {
    targets: [],
    values: [],
    calldatas: [],
    description: '',
  }
): Promise<BigNumber> {
  // Fetch proposal count from the contract and increment it by 1.
  if (governorType === 'compound') {
    const count: BigNumber = await governorBravo(address).proposalCount()
    return count.add(1)
  }

  // Compute proposal ID from the tx data
  return BigNumber.from(
    keccak256(
      defaultAbiCoder.encode(
        ['string[]', 'uint256[]', 'string[]', 'string'],
        [targets, values, calldatas, keccak256(toUtf8Bytes(description))]
      )
    )
  )
}

export function formatProposalId(governorType: GovernorType, id: BigNumberish) {
  if (governorType === 'oz') return BigNumber.from(id).toHexString()
  return BigNumber.from(id).toString()
}

// --- Private helper methods ---
/**
 * @notice Returns an ERC20 instance of the specified token
 * @param token Token address
 */
function erc20(token: string) {
  // This ABI only contains view methods and events
  const ERC20_ABI = [
    'function name() external view returns (string)',
    'function symbol() external view returns (string)',
    'function decimals() external view returns (uint8)',
    'function balanceOf(address owner) external view returns (uint256 balance)',
    'function totalSupply() external view returns (uint256)',
    'event Transfer(address indexed from, address indexed to, uint256 value)',
    'event Approval(address indexed owner, address indexed spender, uint256 value)',
  ]
  return new Contract(token, ERC20_ABI, provider)
}
