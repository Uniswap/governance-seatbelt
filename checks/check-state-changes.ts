import { artifacts, run } from 'hardhat'
import fs from 'fs'
import { ContractSource, ProposalCheck, RpcDebugTraceOutput, StorageWrite } from '../types'
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
      const stack = log.stack as string[]
      return { address, index, slot: stack[stack.length - 1], value: stack[stack.length - 2] }
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
      if (index === writes.length - 1) return true; // this is the last SSTORE in the transaction so we keep it
      const subsequentWrites = writes.slice(index + 1)
      const {address, slot} = write
      return !subsequentWrites.some(w => w.address === address && w.slot === slot)
    })

    // Get the ETH balance change for each touched address.
    // We store this as an object that maps from address to balance change to simplify merging of the
    // storage writes with ETH balance changes
    const balanceDiffs: Record<string, string> = {}
    const block = tx.blockNumber as number
    await Promise.all(addresses.map(async (addr) => balanceDiffs[addr] = await getEthBalanceChange(block, addr)))

    // Organize state diffs by address
    addresses.map((addr) => {
      const balanceDiff = `${formatEther(balanceDiffs[addr])} ETH`
      // TODO get StateDiff using StorageDiff type
    })

    // OLD STUFF BELOW

    // Get state at prior block and current block to compute state diff
    if (!tx.blockNumber) throw new Error('Transaction is missing block number')
    let info = ''
    for (const code of codes) {
      const { address, code: sourceCode } = code
      const stateChange =
        sourceCode === '0x'
          ? await getEthBalanceChange(tx.blockNumber, address)
          : await getContractStateChange(tx.blockNumber, address, sourceCode as ContractSource) // code === '0x' is not sufficient for type inference apparently

      // TODO return state change data in `info`
      if (stateChange) info += `State changes for ${address}:\n${stateChange}`
    }

    return { info: [], warnings: [], errors: [] }
  },
}

// Returns change in ETH balance at `address` between `block-1` and `block`
async function getEthBalanceChange(block: number, address: string) {
  const [prevBalance, newBalance] = await Promise.all([
    provider.getBalance(address, block - 1),
    provider.getBalance(address, block),
  ])
  if (prevBalance.eq(newBalance)) return '0'
  return newBalance.sub(prevBalance).toString()
}

// Returns state changes in contract at `address` between `block-1` and `block`
async function getContractStateChange(block: number, address: string, code: ContractSource) {
  // --- Dump source code to a file ---
  //  For some reason the source code object starts and ends with two braces
  code.SourceCode = code.SourceCode.replace('{{', '{').replace('}}', '}')

  // From the SourceCode field, convert the string to JSON and pull out the source code of each file
  const sourceCodes = Object.values(JSON.parse(code.SourceCode).sources).map(
    (src) => (src as { content: string; keccak256: string }).content
  )

  // Combine source code into one string and dump it to a temporary file.
  const sourceCode = sourceCodes
    .reverse() // reverse before joining to ensure contract definitions are in the correct order based on inheritance
    .join('\n')
    .replace(/import.*/g, '') // remove all import statements since we have everything in one file
    .replace(/(?<=(pragma experimental ABIEncoderV2;)[\s\S]+)\1/g, '') // only keep the first instance of pragmas: https://newbedev.com/how-to-replace-all-occurrences-of-a-string-except-the-first-one-in-javascript
    .replace(/(?<=(pragma abicoder v2;)[\s\S]+)\1/g, '')

  const tempContractFile = 'contracts/tmp.sol'
  fs.writeFileSync(tempContractFile, sourceCode)

  // --- Compile source code ---
  // TODO this does not compile as expected -- not passing in settings correctly
  await run('compile', {
    solidity: {
      settings: {
        outputSelection: {
          '*': {
            '*': ['storageLayout'],
          },
        },
      },
    },
  })

  const { abi, deployedBytecode } = artifacts.readArtifactSync('ModifiedTimelock')
  fs.unlinkSync(tempContractFile)

  // 1. Get list of changed slots by (address, slot) tuples
  // 2. Compile each `address` with storageLayout flag enabled

  // 2. For each slot in the storage layout output, get decoded slot value before and after tx execution
  // 3. TODO how to handle mapping keys? Presumably debug_traceTransaction has all the slots, but TBD
  //    how to extract only mapping slots to reduce execution time/effort
  // 4. Call getEthBalanceChange()
  return 'TODO'
}
