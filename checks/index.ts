import {
  checkTargetsVerifiedEtherscan,
  checkTouchedContractsVerifiedEtherscan,
} from './check-targets-verified-etherscan'
import {
  checkTargetsNoSelfdestruct,
  checkTouchedContractsNoSelfdestruct,
} from './check-targets-no-selfdestruct'
import { checkDecodeCalldata } from './check-decode-calldata'
import { checkLogs } from './check-logs'
import { checkSlither } from './check-slither'
import { checkSolc } from './check-solc'
import { checkStateChanges } from './check-state-changes'
import { checkValueRequired } from './check-value-required'
import { ProposalCheck } from '../types'

const ALL_CHECKS: {
  [checkId: string]: ProposalCheck
} = {
  checkStateChanges,
  checkDecodeCalldata,
  checkLogs,
  checkTargetsVerifiedEtherscan,
  checkTouchedContractsVerifiedEtherscan,
  checkTargetsNoSelfdestruct,
  checkTouchedContractsNoSelfdestruct,
  checkValueRequired,
  // The solc check must be run before the slither check, because the compilation exports a zip file
  // which is consumed by slither. This prevents us from having to compile the contracts twice.
  // disabling slither check for now
  // checkSolc,
  // checkSlither,
}

export default ALL_CHECKS
