import {
  checkTargetsVerifiedEtherscan,
  checkTouchedContractsVerifiedEtherscan,
} from './check-targets-verified-etherscan'
import { ProposalCheck } from '../types'

const ALL_CHECKS: {
  [checkId: string]: ProposalCheck
} = { checkTargetsVerifiedEtherscan, checkTouchedContractsVerifiedEtherscan }

export default ALL_CHECKS
