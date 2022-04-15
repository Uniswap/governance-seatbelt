import {
  checkTargetsVerifiedEtherscan,
  checkTouchedContractsVerifiedEtherscan,
} from './check-targets-verified-etherscan'
import { checkDecodeCalldata } from './check-decode-calldata'
import { checkLogs } from './check-logs'
import { checkSlither } from './check-slither'
import { checkSolc } from './check-solc'
import { checkStateChanges } from './check-state-changes'
import { ProposalCheck } from '../types'

const ALL_CHECKS: {
  [checkId: string]: ProposalCheck
} = {
  checkStateChanges,
  checkDecodeCalldata,
  checkLogs,
  checkTargetsVerifiedEtherscan,
  checkTouchedContractsVerifiedEtherscan,
  // The solc check must be run before the slither check, because the compilation exports a zip file
  // which is consumed by slither. This prevents us from having to compile the contracts twice.
  checkSolc,
  checkSlither,
}

export default ALL_CHECKS
