import { checkTargetsVerifiedEtherscan } from './check-targets-verified-etherscan'
import { ProposalCheck } from '../types'

const ALL_CHECKS: {
  [checkId: string]: ProposalCheck
} = { checkTargetsVerifiedEtherscan }

export default ALL_CHECKS
