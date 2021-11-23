import { ethers } from 'hardhat'
import { ContractTransaction } from '@ethersproject/contracts'
import { RpcDebugTraceOutput } from '../types'
const { getAddress } = ethers.utils

export async function getTransactionTrace(tx: ContractTransaction | string) {
  const txHash = typeof tx === 'string' ? tx : tx.hash
  return ethers.provider.send('debug_traceTransaction', [txHash]) as Promise<RpcDebugTraceOutput>
}

export async function getTouchedAddresses(tx: ContractTransaction | string) {
  // Because `eth_createAccessList` is not yet supported in Hardhat, we generate the list of touched addresses
  // from the transaction trace. We do this by searching for all opcodes that consume an address from the
  // stack, and extract the address from the proper location on the stack. Opcodes that return an address
  // such as CREATE and CREATE2 are not included in access lists so are not considered here

  // Mapping from opcode name to which stack element it consumes as the address
  const opcodeMap = {
    BALANCE: 1,
    CALL: 2,
    CALLCODE: 2,
    DELEGATECALL: 2,
    EXTCODECOPY: 1,
    EXTCODEHASH: 1,
    EXTCODESIZE: 1,
    SELFDESTRUCT: 1,
    STATICCALL: 2,
  }
  type Opcodes = keyof typeof opcodeMap

  // Get all addresses from the steps that executed an opcode from `opcodeMap`
  const { structLogs } = await getTransactionTrace(tx)
  const items = structLogs.filter((log) => typeof opcodeMap[<Opcodes>log.op] !== 'undefined')
  return items
    .map((item) => item.stack?.[item.stack.length - opcodeMap[<Opcodes>item.op]]) // get list of addresses from trace
    .map((addr) => (!addr ? null : getAddress(`0x${addr.slice(24)}`))) // convert the 32 byte hex strings from the stack into checksummed addresses
    .filter((addr) => typeof addr === 'string') // remove null values
    .filter((addr, i, checksumAddresses) => checksumAddresses.indexOf(addr) === i) as string[] // remove duplicate addresses
}
