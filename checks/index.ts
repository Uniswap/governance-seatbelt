import {
  checkTargetsVerifiedEtherscan,
  checkTouchedContractsVerifiedEtherscan,
} from './check-targets-verified-etherscan'
import { checkStateChanges } from './check-state-changes'
import { checkLogs } from './check-logs'
import { checkSlither } from './check-slither'
import { ProposalCheck } from '../types'

const ALL_CHECKS: {
  [checkId: string]: ProposalCheck
} = {
  checkStateChanges,
  checkLogs,
  checkTargetsVerifiedEtherscan,
  checkTouchedContractsVerifiedEtherscan,
  checkSlither,
}

export default ALL_CHECKS
