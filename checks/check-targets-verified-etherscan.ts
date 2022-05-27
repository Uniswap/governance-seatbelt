import { JsonRpcProvider } from '@ethersproject/providers'
import { ProposalCheck, TenderlySimulation } from '../types'

/**
 * Check all targets with code are verified on Etherscan
 */
export const checkTargetsVerifiedEtherscan: ProposalCheck = {
  name: 'Check all targets are verified on Etherscan',
  async checkProposal(proposal, sim, deps) {
    const uniqueTargets = proposal.targets.filter((addr, i, targets) => targets.indexOf(addr) === i)
    const info = await checkVerificationStatuses(sim, uniqueTargets, deps.provider)
    return { info: [`Targets:${info}`], warnings: [], errors: [] }
  },
}

/**
 * Check all touched contracts with code are verified on Etherscan
 */
export const checkTouchedContractsVerifiedEtherscan: ProposalCheck = {
  name: 'Check all touched contracts are verified on Etherscan',
  async checkProposal(proposal, sim, deps) {
    const info = await checkVerificationStatuses(sim, sim.transaction.addresses, deps.provider)
    return { info: [`Touched address:${info}`], warnings: [], errors: [] }
  },
}

/**
 * For a given simulation response, check verification status of a set of addresses
 */
async function checkVerificationStatuses(
  sim: TenderlySimulation,
  addresses: string[],
  provider: JsonRpcProvider
): Promise<string> {
  let info = '' // prepare output
  for (const addr of addresses) {
    const status = await checkVerificationStatus(sim, addr, provider)
    if (status === 'eoa') {
      info += `\n    - ${addr}: EOA (verification not applicable)`
    } else if (status === 'verified') {
      const contract = getContract(sim, addr)
      info += `\n    - ${addr}: Contract (verified) (${contract?.contract_name})`
    } else {
      info += `\n    - ${addr}: Contract (not verified)`
    }
  }
  return info
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
  const contract = getContract(sim, addr)
  if (contract) return 'verified'
  // Otherwise, check if there's code at the address. Addresses with code not in the contracts array are not verified
  const code = await provider.getCode(addr)
  return code === '0x' ? 'eoa' : 'unverified'
}

function getContract(sim: TenderlySimulation, addr: string) {
  return sim.contracts.find((item) => item.address === addr)
}
