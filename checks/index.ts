import {
  checkTargetsVerifiedEtherscan,
  checkTouchedContractsVerifiedEtherscan,
} from './check-targets-verified-etherscan.js'
import { checkDecodeCalldata } from './check-decode-calldata.js'
import { checkLogs } from './check-logs.js'
import { checkSlither } from './check-slither.js'
import { checkSolc } from './check-solc.js'
import { checkStateChanges } from './check-state-changes.js'
import { ProposalCheck } from '../types.js'

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
