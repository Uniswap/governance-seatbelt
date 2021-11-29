import {
  checkTargetsVerifiedEtherscan,
  checkTouchedContractsVerifiedEtherscan,
} from './check-targets-verified-etherscan'
import { checkDecodeCalldata } from './check-decode-calldata'
import { checkStateChanges } from './check-state-changes'
import { ProposalCheck } from '../types'

const ALL_CHECKS: {
  [checkId: string]: ProposalCheck
} = {
  checkTargetsVerifiedEtherscan,
  checkTouchedContractsVerifiedEtherscan,
  checkDecodeCalldata,
  checkStateChanges,
}

export default ALL_CHECKS
