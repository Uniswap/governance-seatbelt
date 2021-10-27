import { ProposalCheck } from '../types'
import { etherscan } from '../utils/clients/etherscan'
import { provider } from '../utils/clients/ethers'
import { getTouchedAddresses } from './utils'

/**
 * Check all targets with code are verified on Etherscan
 */
export const checkTargetsVerifiedEtherscan: ProposalCheck = {
  name: 'Check all targets are verified on Etherscan',
  async checkProposal(proposal, tx) {
    const uniqueTargets = proposal.targets.filter((addr, i, targets) => targets.indexOf(addr) === i)
    const { info, errors } = await checkVerifiedAddresses(uniqueTargets, false)
    return { info: [`Targets:${info}`], warnings: [], errors }
  },
}

/**
 * Check all touched contracts with code are verified on Etherscan
 */
export const checkTouchedContractsVerifiedEtherscan: ProposalCheck = {
  name: 'Check all touched contracts are verified on Etherscan',
  async checkProposal(proposal, tx) {
    const addresses = await getTouchedAddresses(tx)
    const { info, errors } = await checkVerifiedAddresses(addresses, false)
    return { info: [`Touched Addresses:${info}`], warnings: [], errors }
  },
}

async function checkVerifiedAddresses(addresses: string[], eoasAllowed = false) {
  const errors: string[] = []
  let info = ''
  for (let address of addresses) {
    if ((await provider.getCode(address)) !== '0x') {
      try {
        const abi = await etherscan.getAbi(address)
        info += `\n    - ${address}: Contract (verified)`
      } catch (error) {
        info += `\n    - ${address}: Contract (not verified)`
        if (error instanceof Error) errors.push(`Address ${address} is not verified: ${error.message}`)
        else errors.push(`Address ${address} is not verified`)
      }
    } else {
      if (!eoasAllowed) errors.push(`Address ${address} has no code`)
      info += `\n    - ${address}: EOA`
    }
  }

  return { info, errors }
}
