import { getAddress } from '@ethersproject/address'
import { ProposalCheck, StateDiff } from '../types'

/**
 * Reports all state changes from the proposal
 */
export const checkStateChanges: ProposalCheck = {
  name: 'Reports all state changes from the proposal',
  async checkProposal(proposal, sim) {
    let info = ''
    const warnings = []
    // Check if the transaction reverted, and if so return revert reason
    if (!sim.transaction.status) {
      const txInfo = sim.transaction.transaction_info
      const reason = txInfo.stack_trace ? txInfo.stack_trace[0].error_reason : 'unknown error'
      const error = `Transaction reverted with reason: ${reason}`
      return { info: [], warnings: [], errors: [error] }
    }

    // State diffs in the simulation are an array, so first we organize them by address
    const stateDiffs = sim.transaction.transaction_info.state_diff.reduce((diffs, diff) => {
      const addr = getAddress(diff.raw[0].address)
      if (!diffs[addr]) diffs[addr] = [diff]
      else diffs[addr].push(diff)
      return diffs
    }, {} as Record<string, StateDiff[]>)

    // Parse state changes at each address
    // TODO support ETH state changes once tenderly adds support for that in the simulation response
    for (const [address, diffs] of Object.entries(stateDiffs)) {
      // Use contracts array to get contract name of address
      const contract = sim.contracts.find((c) => c.address === address)
      let contractName = contract?.contract_name

      // If the contract is a token, include the full token name. This is useful in cases where the
      // token is a proxy, so the contract name doesn't give much useful information
      if (contract?.token_data?.name) contractName += ` (${contract?.token_data?.name})`

      // Lastly, append the contract address and save it off
      info += `\n    - ${contractName} at \`${address}\``

      // Parse each diff. A single diff may involve multiple storage changes, e.g. a proposal that
      // executes three transactions will show three state changes to the `queuedTransactions`
      // mapping within a single `diff` element. We always JSON.stringify the values so structs
      // (i.e. tuples) don't print as [object Object]
      diffs.forEach((diff) => {
        if (!diff.soltype) {
          // In this branch, state change is not decoded, so return raw data of each storage write
          // (all other branches have decoded state changes)
          diff.raw.forEach((w) => {
            const oldVal = JSON.stringify(w.original)
            const newVal = JSON.stringify(w.dirty)
            info += `\n        - Slot \`${w.key}\` changed from \`${oldVal}\` to \`${newVal}\``
          })
        } else if (diff.soltype.simple_type) {
          // This is a simple type with a single changed value (stringifying not strictly necessary, but can't hurt)
          const oldVal = JSON.stringify(diff.original)
          const newVal = JSON.stringify(diff.dirty)
          info += `\n        - \`${diff.soltype.name}\` changed from \`${oldVal}\` to \`${newVal}\``
        } else if (diff.soltype.type.startsWith('mapping')) {
          // This is a complex type like a mapping, which may have multiple changes. The diff.original
          // and diff.dirty fields can be strings or objects, and for complex types they are objects,
          // so we cast them as such
          const keys = Object.keys(diff.original)
          const original = diff.original as Record<string, any>
          const dirty = diff.dirty as Record<string, any>
          keys.forEach((k) => {
            const oldVal = JSON.stringify(original[k])
            const newVal = JSON.stringify(dirty[k])
            info += `\n        - \`${diff.soltype.name}\` key \`${k}\` changed from \`${oldVal}\` to \`${newVal}\``
          })
        } else {
          // TODO arrays and nested mapping are currently not well supported -- find a transaction
          // that changes state of these types to inspect the Tenderly simulation response and
          // handle it accordingly. In the meantime we show the raw state changes and print a
          // warning about decoding the data
          diff.raw.forEach((w) => {
            const oldVal = JSON.stringify(w.original)
            const newVal = JSON.stringify(w.dirty)
            info += `\n        - Slot \`${w.key}\` changed from \`${oldVal}\` to \`${newVal}\``
            warnings.push(`Could not parse state: add support for formatting type ${diff.soltype.type} (slot ${w.key})`)
          })
        }
      })
    }
    return { info: [`State changes:${info}`], warnings: [], errors: [] }
  },
}
