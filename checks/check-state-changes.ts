import { getAddress } from 'viem';
import type { ProposalCheck, StateDiff } from '../types';
import { getContractName } from '../utils/clients/tenderly';

/**
 * Reports all state changes from the proposal
 */
export const checkStateChanges: ProposalCheck = {
  name: 'Reports all state changes from the proposal',
  async checkProposal(_, sim, deps) {
    const info: string[] = [];
    const warnings: string[] = [];
    const warningsSeen = new Set<string>();
    // Check if the transaction reverted, and if so return revert reason
    if (!sim.transaction.status) {
      const txInfo = sim.transaction.transaction_info;
      const callTraceError = txInfo.call_trace.error_reason;
      const reason = callTraceError
        ? callTraceError
        : txInfo.stack_trace
          ? txInfo.stack_trace[0].error_reason
          : 'unknown error';
      const error = `Transaction reverted with reason: ${reason}`;
      return { info: [], warnings: [], errors: [error] };
    }

    // State diffs in the simulation are an array, so first we organize them by address. We skip
    // recording state changes for (1) the `queuedTransactions` mapping of the timelock, and
    // (2) the `proposal.executed` change of the governor, because this will be consistent across
    // all proposals and mainly add noise to the output
    if (!sim.transaction.transaction_info.state_diff) {
      const warnings = `State diff is empty`
      return { info: [], warnings: [warnings], errors: [] }
    }

    const stateDiffs = sim.transaction.transaction_info.state_diff.reduce(
      (diffs, diff) => {
        const addr = getAddress(diff.raw[0].address);
        // Check if this is a diff that should be filtered out
        const isGovernor = getAddress(addr) === deps.governor.address;
        const isProposalsVar =
          diff.soltype?.name === 'proposals' || diff.soltype?.name === '_proposals';
        const isTimelock = getAddress(addr) === deps.timelock.address;
        const isTimelockTimestamps = diff.soltype?.name === '_timestamps';
        const isQueuedTx = diff.soltype?.name.includes('queuedTransactions');
        const isExecutedSlot =
          diff.raw[0].original ===
            '0x0000000000000000000000000000000000000000000000000000000000000000' &&
          diff.raw[0].dirty ===
            '0x0000000000000000000000000000000000000000000000000000000000000100';

        const shouldSkipDiff =
          (isGovernor && isProposalsVar) ||
          (isGovernor && isExecutedSlot) ||
          (isTimelock && isQueuedTx) ||
          (isTimelock && isTimelockTimestamps);

        // Skip diffs as required and add the rest to our diffs object
        if (shouldSkipDiff) return diffs;
        if (!diffs[addr]) {
          diffs[addr] = [diff];
        } else {
          diffs[addr].push(diff);
        }
        return diffs;
      },
      {} as Record<string, StateDiff[]>,
    );

    // Return if no state diffs to show
    if (!Object.keys(stateDiffs).length)
      return { info: ['No state changes'], warnings: [], errors: [] };

    // Parse state changes at each address
    // ETH balance changes are now handled by the checkEthBalanceChanges module
    for (const [address, diffs] of Object.entries(stateDiffs)) {
      const contract = sim.contracts.find((c) => getAddress(c.address) === address);
      info.push(await getContractName(contract ?? { address }, deps.chainConfig?.chainId));

      // Track processed state changes to deduplicate
      const processedChanges = new Set<string>();
      const formatRawValue = (value: unknown) => {
        if (typeof value === 'string') return value;
        return JSON.stringify(value);
      };

      // Parse each diff. A single diff may involve multiple storage changes, e.g. a proposal that
      // executes three transactions will show three state changes to the `queuedTransactions`
      // mapping within a single `diff` element. We always JSON.stringify the values so structs
      // (i.e. tuples) don't print as [object Object]
      diffs.forEach((diff) => {
        if (!diff.soltype) {
          // In this branch, state change is not decoded, so return raw data of each storage write
          // (all other branches have decoded state changes)
          for (const w of diff.raw) {
            const oldVal = formatRawValue(w.original);
            const newVal = formatRawValue(w.dirty);
            const changeKey = `${w.key}:${oldVal}:${newVal}`;
            if (!processedChanges.has(changeKey)) {
              info.push(`    Slot \`${w.key}\` changed from \`${oldVal}\` to \`${newVal}\``);
              processedChanges.add(changeKey);
            }
          }
        } else if (diff.soltype.simple_type) {
          // This is a simple type with a single changed value
          const oldVal = JSON.parse(JSON.stringify(diff.original));
          const newVal = JSON.parse(JSON.stringify(diff.dirty));
          const changeKey = `${diff.soltype.name}:${oldVal}:${newVal}`;
          if (!processedChanges.has(changeKey)) {
            info.push(`    \`${diff.soltype.name}\` changed from \`${oldVal}\` to \`${newVal}\``);
            processedChanges.add(changeKey);
          }
        } else if (/^mapping \((address|uint\d+) => uint\d+\)$/.test(diff.soltype.type)) {
          // This is a complex type like a mapping, which may have multiple changes. The diff.original
          // and diff.dirty fields can be strings or objects, and for complex types they are objects,
          // so we cast them as such

          // The original object can be null if the key was not present in the original state
          // Unsure if the same can happen to dirty, let's assume its possible to collect all keys
          const keys = Object.keys(diff.original || {}).concat(Object.keys(diff.dirty || {}))

          const original = diff.original as Record<string, any>
          const dirty = diff.dirty as Record<string, any>
          keys.forEach((k) => {
            const oldVal = JSON.stringify((original && k in original) ? original[k] : '')
            const newVal = JSON.stringify((dirty && k in dirty) ? dirty[k] : '')
            info.push(bullet(`\`${diff.soltype?.name}\` key \`${k}\` changed from \`${oldVal}\` to \`${newVal}\``, 1))
          })
        } else {
          // TODO arrays and nested mapping are currently not well supported -- find a transaction
          // that changes state of these types to inspect the Tenderly simulation response and
          // handle it accordingly. In the meantime we show a clearer fallback view of raw writes.
          const structuredType = diff.soltype?.type ?? 'unknown';
          const fallbackKey = `unsupported:${structuredType}`;
          if (!warningsSeen.has(fallbackKey)) {
            info.push(
              `    Structured diff fallback for type \`${structuredType}\`: displaying raw storage slot deltas.`,
            );
            warningsSeen.add(fallbackKey);
          }

          for (const w of diff.raw) {
            const oldVal = formatRawValue(w.original);
            const newVal = formatRawValue(w.dirty);
            const changeKey = `${w.key}:${oldVal}:${newVal}`;
            if (!processedChanges.has(changeKey)) {
              info.push(`      • Slot \`${w.key}\`: \`${oldVal}\` → \`${newVal}\``);
              processedChanges.add(changeKey);
            }
          }
        }
      }
    }

    return { info, warnings, errors: [] };
  },
};
