import { JsonRpcProvider } from '@ethersproject/providers'
import { Content, UnorderedListElement } from 'pdfmake/interfaces'
import { ProposalCheck, TenderlySimulation } from '../types'

/**
 * Check all targets with code are verified on Etherscan
 */
export const checkTargetsVerifiedEtherscan: ProposalCheck = {
  name: 'Check all targets are verified on Etherscan',
  async checkProposal(proposal, sim, deps) {
    const uniqueTargets = proposal.targets.filter((addr, i, targets) => targets.indexOf(addr) === i)
    const statuses = await checkVerificationStatuses(sim, uniqueTargets, deps.provider)
    const details: Content = [{ text: 'Targets:', style: 'bold' }, { ul: statuses }]
    return { description: 'Check all targets are verified on Etherscan', status: 'Passed', details }
  },
}

/**
 * Check all touched contracts with code are verified on Etherscan
 */
export const checkTouchedContractsVerifiedEtherscan: ProposalCheck = {
  name: 'Check all touched contracts are verified on Etherscan',
  async checkProposal(proposal, sim, deps) {
    const statuses = await checkVerificationStatuses(sim, sim.transaction.addresses, deps.provider)
    const details: Content = [{ text: 'Touched contracts:', style: 'bold' }, { ul: statuses }]
    return { description: 'Check all touched contracts are verified on Etherscan', status: 'Passed', details }
  },
}

/**
 * For a given simulation response, check verification status of a set of addresses
 */
async function checkVerificationStatuses(
  sim: TenderlySimulation,
  addresses: string[],
  provider: JsonRpcProvider
): Promise<UnorderedListElement[]> {
  const statuses: UnorderedListElement[] = []
  for (const addr of addresses) {
    const status = await checkVerificationStatus(sim, addr, provider)
    if (status === 'eoa') statuses.push({ text: `${addr}: EOA (verification not applicable)`, style: 'list' })
    else if (status === 'verified') statuses.push({ text: `${addr}: Contract (verified)`, style: 'list' })
    else statuses.push({ text: `${addr}: Contract (not verified)`, style: 'list' })
  }
  return statuses
}

/**
 * For a given address, check if it's an EOA, a verified contract, or an unverified contract
 */
async function checkVerificationStatus(
  sim: TenderlySimulation,
  addr: string,
  provider: JsonRpcProvider
): Promise<'verified' | 'eoa' | 'unverified'> {
  // If an address exists in the contracts array, it's verified on Etherscan
  const contract = sim.contracts.find((item) => item.address === addr)
  if (contract) return 'verified'
  // Otherwise, check if there's code at the address. Addresses with code not in the contracts array are not verified
  const code = await provider.getCode(addr)
  return code === '0x' ? 'eoa' : 'unverified'
}
