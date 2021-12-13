import { ProposalCheck } from '../types'

/**
 * Check all targets with code are verified on Etherscan
 */
export const checkTargetsVerifiedEtherscan: ProposalCheck = {
  name: 'Check all targets are verified on Etherscan',
  async checkProposal(proposal, sim) {
    let info = '' // prepare output
    const uniqueTargets = proposal.targets.filter((addr, i, targets) => targets.indexOf(addr) === i)
    uniqueTargets.forEach((addr) => {
      const contract = sim.contracts.find((item) => item.address === addr)
      // TODO verify with tenderly that this is true, i.e. if an address is not in that array it's an EOA
      if (!contract) info += `\n    - ${addr}: EOA (verification not applicable)`
      else if (Boolean(contract.verified_by)) info += `\n    - ${addr}: Contract (verified)`
      else info += `\n    - ${addr}: Contract (not verified)`
    })
    return { info: [`Targets:${info}`], warnings: [], errors: [] }
  },
}

/**
 * Check all touched contracts with code are verified on Etherscan
 */
export const checkTouchedContractsVerifiedEtherscan: ProposalCheck = {
  name: 'Check all touched contracts are verified on Etherscan',
  async checkProposal(proposal, sim) {
    let info = '' // prepare output
    sim.transaction.addresses.forEach((addr) => {
      const contract = sim.contracts.find((item) => item.address === addr)
      // TODO verify with tenderly that this is true, i.e. if an address is not in that array it's an EOA
      if (!contract) info += `\n    - ${addr}: EOA (verification not applicable)`
      else if (Boolean(contract.verified_by)) info += `\n    - ${addr}: Contract (verified)`
      else info += `\n    - ${addr}: Contract (not verified)`
    })
    return { info: [`Touched address:${info}`], warnings: [], errors: [] }
  },
}
