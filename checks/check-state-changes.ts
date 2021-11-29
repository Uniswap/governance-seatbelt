import { AddressStateDiff, ProposalCheck, RpcDebugTraceOutput, StorageDiff, StorageWrite, TxStateDiff } from '../types'
import { getCode } from '../utils/clients/etherscan'
import { provider } from '../utils/clients/ethers'
import { getTransactionTrace } from './utils'
import { OPCODE_MAP } from '../utils/constants'
import { getAddress } from '@ethersproject/address'
import { formatEther } from '@ethersproject/units'

// Given a transaction trace and the `to` address of that transaction, return an array of all storage writes
function getStorageWrites(to: string, trace: RpcDebugTraceOutput): StorageWrite[] {
  return trace.structLogs
    .map((log, index, logs) => {
      // We're only looking for SSTOREs, so ignore everything else
      if (log.op !== 'SSTORE') return null

      // Find the address being modified by the SSTORE by looking for the last address called on the stack.
      // We only need to look for CALL opcodes because it's the only opcode that changes the context of the
      // address being operated on. DELEGATECALL and STATICCALL cannot change storage in the addresses they
      // pop off the stack)
      let address = to // default to the transaction's to address
      for (let i = index - 1; i >= 0; i -= 1) {
        if (logs[i].op === 'CALL') {
          const stack = logs[i].stack as string[]
          const rawAddress = stack[stack.length - OPCODE_MAP['CALL']] // this is the address as a 32 byte hex string
          address = getAddress(`0x${rawAddress.slice(24)}`)
          break
        }
      }

      // Return details of the storage write
      // The first element on the stack (last in the stack array) is the key, and the second element is the value
      const stack = log.stack as string[]
      return { address, index, slot: stack[stack.length - 1], newValue: stack[stack.length - 2] }
    })
    .filter((item) => item !== null) as StorageWrite[]
}

/**
 * Gets state changes of all touched addresses
 */
export const checkStateChanges: ProposalCheck = {
  name: 'Gets state changes of all touched addresses',
  async checkProposal(proposal, tx) {
    if (!tx.blockNumber) throw new Error('Block number must be provided to get ETH balance changes')

    // Get transaction trace and list of touched addresses
    const { trace, addresses } = await getTransactionTrace(tx)

    // Get code at each address
    const codes = await Promise.all(
      addresses.map(async (address) => {
        const code = await provider.getCode(address)
        if (code === '0x') return { address, code }
        return { address, code: await getCode(address) }
      })
    )

    // Get all storage writes from the transaction
    const storageWrites = getStorageWrites(tx.to as string, trace)

    // Only keep the last SSTORE for a given address-slot pairing. Therefore the filter logic below
    // should return false if any items later in the array have the same address and slot value
    const netWrites = storageWrites.filter((write, index, writes) => {
      if (index === writes.length - 1) return true // this is the last SSTORE in the transaction so we keep it
      const subsequentWrites = writes.slice(index + 1)
      const { address, slot } = write
      return !subsequentWrites.some((w) => w.address === address && w.slot === slot)
    })

    // Convert the net storage writes into array of state changes. To do this, we must (1) remove
    // storage writes where the new slot value is the same as the previous slot value, and (2) check
    // for ETH balance changes at each address
    const stateDiff: TxStateDiff = {}
    const block = tx.blockNumber as number
    await Promise.all(
      addresses.map(async (addr) => {
        // We don't actually care about the map return array, we just use it to fire off the async calls
        // required to get the state diff at each address (instead of having to await each address'
        // promises synchronously in e.g. a `for...of` loop)

        // Initialize state change object to set
        const diff = {} as AddressStateDiff

        // Get balance before and after
        const [oldBalance, newBalance] = await Promise.all([
          provider.getBalance(addr, block - 1),
          provider.getBalance(addr, block),
        ])
        if (!oldBalance.eq(newBalance)) {
          diff.balance = { old: oldBalance, new: newBalance }
        }

        // Get state change before and after
        const applicableWrites = netWrites.filter((write) => write.address === addr) // remove storage writes not to this address
        const addrWritesAll = await Promise.all(
          applicableWrites.map(async (write) => {
            // Remove storage writes where the new slot value matches the old slot value
            const [oldVal, newVal] = await Promise.all([
              provider.getStorageAt(write.address, `0x${write.slot}`, block - 1),
              provider.getStorageAt(write.address, `0x${write.slot}`, block),
            ])
            if (oldVal === newVal) return null
            return { index: write.index, slot: write.slot, value: { old: oldVal, new: newVal } } as StorageDiff
          })
        )

        // Save off any state changes left after removing no-ops
        const addrWrites = addrWritesAll.filter((val) => val !== null) as StorageDiff[]
        if (addrWrites.length) {
          diff.storage = addrWrites
        }

        // Set combined state + balance diff
        if (Object.keys(diff).length) {
          stateDiff[addr] = diff
        }
      })
    )

    // At this point, the full state and balance diff of the transaction is contained in the `stateDiff` variable.
    // We now format the data for the report
    if (!Object.keys(stateDiff)) return { info: ['No state changes'], warnings: [], errors: [] }
    let info = 'State changes:'
    for (const [addr, diff] of Object.entries(stateDiff)) {
      const { balance, storage } = diff
      if (balance) info += `\n    - ${addr}: Balance change of ${formatEther(balance.new.sub(balance.old))} ETH`
      if (storage) {
        storage.forEach(({ slot, value }) => (info += `\n    - Slot ${slot} changed from ${value.old} to ${value.new}`))
      }
    }

    return { info: [info], warnings: [], errors: [] }
  },
}
