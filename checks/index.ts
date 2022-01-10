import {
  checkTargetsVerifiedEtherscan,
  checkTouchedContractsVerifiedEtherscan,
} from './check-targets-verified-etherscan'
import { checkStateChanges } from './check-state-changes'
import { checkLogs } from './check-logs'
import { ProposalCheck } from '../types'

const ALL_CHECKS: {
  [checkId: string]: ProposalCheck
} = { checkStateChanges, checkLogs, checkTargetsVerifiedEtherscan, checkTouchedContractsVerifiedEtherscan }

export default ALL_CHECKS
