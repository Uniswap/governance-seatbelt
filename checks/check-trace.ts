import { ProposalCheck, TraceCall } from '../types'

const SELFDESTRUCT_OP = 'SELFDESTRUCT'

/**
 * Check stack trace of the proposal
 */

// Checking recursivly stack trace if there is self destruct opcode
function checkSelfDestructOpcode(stackCalls: TraceCall[]): boolean {
  for (const stackCall of stackCalls) {
    if (stackCall.caller_op == SELFDESTRUCT_OP) {
      return true
    }

    if (stackCall.calls != null) {
      if (checkSelfDestructOpcode(stackCall.calls)) {
        return true
      }
    }
  }
  return false
}

export const checkTrace: ProposalCheck = {
  name: 'Check stack trace of the proposal',
  async checkProposal(proposal, sim, deps) {
    let info = ''
    const warnings = []
    let selfdestructFound = false

    // Checking if there is self destruct opcode in payload called with delegate call
    for (let [i, delegateCall] of proposal.withDelegatecalls.entries()) {
      if (delegateCall) {
        // i+1 should be index of the i-th payload, as on index 0 there is `getProposalState` call
        if (
          sim.transaction.transaction_info.call_trace.calls[i + 1]?.calls &&
          checkSelfDestructOpcode(sim.transaction.transaction_info.call_trace.calls[i + 1].calls)
        ) {
          selfdestructFound = true
        }
      }
    }

    if (selfdestructFound) {
      const error = 'SELFDESTRUCT opcode detected inside of delegated call'
      return { info: [], warnings: [], errors: [error] }
    } else {
      info += 'There is no SELFDESTRUCT inside of delegated call\n'
    }

    return { info: [`${info}`], warnings: [], errors: [] }
  },
}
