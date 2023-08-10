import { BigNumber, BigNumberish, Contract, ethers } from 'ethers'
import { getAddress } from '@ethersproject/address'
import { toUtf8Bytes } from '@ethersproject/strings'
import { keccak256 } from '@ethersproject/keccak256'
import { defaultAbiCoder } from '@ethersproject/abi'
import { provider } from '../clients/ethers'
import { governorAlpha, getAlphaSlots } from './governor-alpha'
import { governorBravo, getBravoSlots } from './governor-bravo'
import { governorOz, getOzSlots } from './governor-oz'
import { timelock } from './timelock'
import { GovernorType, ProposalEvent, ProposalStruct } from '../../types'

// --- Exported methods ---
export async function inferGovernorType(address: string): Promise<GovernorType> {
  if (address === '0xB3a87172F555ae2a2AB79Be60B336D2F7D0187f0') return 'alpha'

  const abi = ['function initialProposalId() external view returns (uint256)']
  const governor = new Contract(address, abi, provider)

  try {
    // If the `initialProposalId` function exists, and the initial proposal was a "small" value,
    // it's overwhelmingly likely this is GovernorBravo. OZ style governors use a hash as the
    // proposal IDs so IDs will be very large numbers.
    const id = <BigNumberish>await governor.initialProposalId()
    if (BigNumber.from(id).lte(100_000)) return 'bravo'
  } catch (err) {}

  return 'oz'
}

export function getGovernor(governorType: GovernorType, address: string) {
  if (governorType === 'alpha') return governorAlpha(address)
  if (governorType === 'bravo') return governorBravo(address)
  if (governorType === 'oz') return governorOz(address)
  throw new Error(`Unknown governor type: ${governorType}`)
}

export async function getProposal(
  governorType: GovernorType,
  address: string,
  proposalId: BigNumberish
): Promise<ProposalStruct> {
  const governor = getGovernor(governorType, address)
  if (governorType === 'alpha') return governor.proposals(proposalId)
  if (governorType === 'bravo') return governor.proposals(proposalId)

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
  if (governorType === 'alpha') return timelock(await governor.timelock())
  if (governorType === 'bravo') return timelock(await governor.admin())
  return timelock(await governor.timelock())
}

export async function getVotingToken(governorType: GovernorType, address: string, proposalId: BigNumberish) {
  const governor = getGovernor(governorType, address)
  if (governorType === 'alpha') return erc20(await governor.pool()) // Only supports POOL.
  if (governorType === 'bravo') {
    // Get voting token and total supply
    const govSlots = getBravoSlots(proposalId)
    const rawVotingToken = await provider.getStorageAt(governor.address, govSlots.votingToken)
    const votingToken = getAddress(`0x${rawVotingToken.slice(26)}`)
    return erc20(votingToken)
  }

  return erc20(await governor.token())
}

export function getGovSlots(governorType: GovernorType, proposalId: BigNumberish) {
  if (governorType === 'alpha') return getAlphaSlots(proposalId)
  if (governorType === 'bravo') return getBravoSlots(proposalId)
  return getOzSlots(proposalId)
}

export async function getProposalIds(
  governorType: GovernorType,
  address: string,
  latestBlockNum: number
): Promise<BigNumber[]> {
  if (governorType === 'alpha') {
    // Fetch all proposal IDs
    const governor = governorAlpha(address)
    const proposalCreatedLogs = await governor.queryFilter(governor.filters.ProposalCreated(), 0, latestBlockNum)
    const allProposalIds = proposalCreatedLogs.map((logs) => (logs.args as unknown as ProposalEvent).id!)
    return allProposalIds
  }

  if (governorType === 'bravo') {
    // Fetch all proposal IDs
    const governor = governorBravo(address)
    const proposalCreatedLogs = await governor.queryFilter(governor.filters.ProposalCreated(), 0, latestBlockNum)
    const allProposalIds = proposalCreatedLogs.map((logs) => (logs.args as unknown as ProposalEvent).id!)

    // Remove proposals from GovernorAlpha based on the initial GovernorBravo proposal ID
    const initialProposalId = await governor.initialProposalId()
    return allProposalIds.filter((id) => id.gt(initialProposalId))
  }

  const governor = governorOz(address)
  const proposalCreatedLogs = await governor.queryFilter(governor.filters.ProposalCreated(), 0, latestBlockNum)
  return proposalCreatedLogs.map((logs) => (logs.args as unknown as ProposalEvent).proposalId!)
}

export function getProposalId(proposal: ProposalEvent): BigNumber {
  const id = proposal.id || proposal.proposalId
  if (!id) throw new Error(`Proposal ID not found for proposal: ${JSON.stringify(proposal)}`)
  return id
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
  if (governorType === 'alpha') throw new Error('generateProposalId not supported for GovernorAlpha')
  // Fetch proposal count from the contract and increment it by 1.
  if (governorType === 'bravo') {
    const count: BigNumber = await governorBravo(address).proposalCount()
    return count.add(1)
  }

  // Compute proposal ID from the tx data
  return BigNumber.from(
    keccak256(
      defaultAbiCoder.encode(
        ['address[]', 'uint256[]', 'bytes[]', 'bytes32'],
        [targets, values, calldatas, keccak256(toUtf8Bytes(description))]
      )
    )
  )
}

// Returns the identifier of an operation containing a single transaction.
// For OZ governors, predecessor is often zero and salt is often description hash.
// This is only intended to be used with OZ governors.
export function hashOperationOz(
  target: string,
  value: BigNumberish,
  calldata: string,
  predecessor: string,
  salt: string
): BigNumber {
  return BigNumber.from(
    keccak256(
      defaultAbiCoder.encode(
        ['address', 'uint256', 'bytes', 'bytes32', 'bytes32'],
        [target, value, calldata, predecessor, salt]
      )
    )
  )
}

// Returns the identifier of an operation containing a batch of transactions.
// For OZ governors, predecessor is often zero and salt is often description hash.
// This is only intended to be used with OZ governors.
export function hashOperationBatchOz(
  targets: string[],
  values: BigNumberish[],
  calldatas: string[],
  predecessor: string,
  salt: string
): BigNumber {
  return BigNumber.from(
    keccak256(
      defaultAbiCoder.encode(
        ['address[]', 'uint256[]', 'bytes[]', 'bytes32', 'bytes32'],
        [targets, values, calldatas, predecessor, salt]
      )
    )
  )
}

export async function getImplementation(address: string, blockTag: number) {
  // First try calling an `implementation` method.
  const abi = ['function implementation() external view returns (address)']
  const governor = new Contract(address, abi, provider)
  try {
    const implementation = await governor.implementation({ blockTag })
    return implementation
  } catch {}

  // Next we try reading the EIP-1967 storage slot directly.
  try {
    const slot = '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc'
    const rawImplementation = await provider.getStorageAt(address, slot, blockTag)
    const implementation = getAddress(`0x${rawImplementation.slice(26)}`)
    if (implementation !== ethers.constants.AddressZero) return implementation
  } catch {}

  return null
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
