import {
  checkTargetsVerifiedEtherscan,
  checkTouchedContractsVerifiedEtherscan,
} from './check-targets-verified-etherscan'
import { checkDecodeCalldata } from './check-decode-calldata'
import { ProposalCheck } from '../types'

const ALL_CHECKS: {
  [checkId: string]: ProposalCheck
} = { checkTargetsVerifiedEtherscan, checkTouchedContractsVerifiedEtherscan, checkDecodeCalldata }

export default ALL_CHECKS
