import {
  checkTargetsVerifiedEtherscan,
  checkTouchedContractsVerifiedEtherscan,
} from './check-targets-verified-etherscan'
import { checkStateChanges } from './check-state-changes'
import { ProposalCheck } from '../types'

const ALL_CHECKS: {
  [checkId: string]: ProposalCheck
} = { checkStateChanges, checkTargetsVerifiedEtherscan, checkTouchedContractsVerifiedEtherscan }

export default ALL_CHECKS
