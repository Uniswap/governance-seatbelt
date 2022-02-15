import { FunctionFragment, Interface } from '@ethersproject/abi'
import { getAddress } from '@ethersproject/address'
import { ProposalCheck, FluffyCall } from '../types'

/**
 * Decodes proposal target calldata into a human-readable format
 */
export const checkDecodeCalldata: ProposalCheck = {
  name: 'Decodes target calldata into a human-readable format',
  async checkProposal(proposal, sim, deps) {
    const info: string[] = []
    let warnings: string[] = []

    // Generate the raw calldata for each proposal action
    const calldatas = proposal.signatures.map((sig, i) => {
      return sig ? `${selectorFromSig(sig)}${proposal.calldatas[i].slice(2)}` : proposal.calldatas[i]
    })

    // Find the call with that calldata, and parse it
    const timelock = getAddress(deps.timelock.address)
    const calls = sim.transaction.transaction_info.call_trace.calls
    const descriptions = await Promise.all(
      calldatas.map(async (calldata) => {
        // Find the first matching call
        let call = findMatchingCall(timelock, calldata, calls)
        if (!call) throw new Error(`Could not find matching call for calldata: ${calldata}`)
        // Now look for any subcalls that have the same input data, since if present these are the
        // decoded calls. This often happens with proxies which aren't always decoded nicely, and
        // will show the function name as `fallback`. Therefore, we look for the deepest function
        // in the callstack with the same input data
        call = returnCallOrMatchingSubcall(calldata, call)
        return prettifyCalldata(call)
      })
    )
    return { info, warnings, errors: [] }
  },
}

// --- Helper methods ---

/**
 * Given a human readable function signature, return the function selector
 */
function selectorFromSig(sig: string): string {
  return Interface.getSighash(FunctionFragment.from(sig))
}

/**
 * Given a call, return a human-readable description of the call
 */
async function prettifyCalldata(call: FluffyCall) {
  const functionName = `\`${call.function_name}\``
  return `Call ${functionName}`
}

/**
 * Given an array of calls, find the call matching the provided from address and calldata by
 * recursively traversing all calls in the trace
 */
function findMatchingCall(from: string, calldata: string, calls: any[]): FluffyCall | null {
  from = getAddress(from)
  const callMatches = (f: string, c: string) => getAddress(f) === from && c === calldata
  for (const call of calls) {
    if (callMatches(call.from, call.input)) return call
    if (call.calls) {
      const foundCall = findMatchingCall(from, calldata, call.calls)
      if (foundCall) return foundCall
    }
  }
  return null
}

/**
 * Given a call, check if any subcalls have matching calldata. If so, return the deepest call as
 * this will be the decoded call (e.g. if there are proxies the top level call with matching
 * calldata will be the fallback function)
 */
function returnCallOrMatchingSubcall(calldata: string, call: FluffyCall): FluffyCall {
  if (!call.calls || !call.calls?.length) return call
  return call.calls[0].input === calldata ? returnCallOrMatchingSubcall(calldata, call.calls[0] as FluffyCall) : call
}
