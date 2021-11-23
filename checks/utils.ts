import { ethers } from 'hardhat'
import { getAddress } from '@ethersproject/address'
import { ContractTransaction } from '@ethersproject/contracts'
import { OPCODE_MAP } from '../utils/constants'
import { RpcDebugTraceOutput } from '../types'

export async function getTransactionTrace(tx: ContractTransaction | string) {
  // Because `eth_createAccessList` is not yet supported in Hardhat, we generate the list of touched addresses
  // from the transaction trace. We do this by searching for all opcodes that consume an address from the
  // stack, and extract the address from the proper location on the stack. Opcodes that return an address
  // such as CREATE and CREATE2 are not included in access lists so are not considered here

  // Get the transaction trace
  const txHash = typeof tx === 'string' ? tx : tx.hash
  const trace = (await ethers.provider.send('debug_traceTransaction', [txHash])) as RpcDebugTraceOutput

  // Get all addresses from the steps that executed an opcode from `OPCODE_MAP`
  type Opcodes = keyof typeof OPCODE_MAP
  const logs = trace.structLogs.filter((log) => typeof OPCODE_MAP[<Opcodes>log.op] !== 'undefined')
  const addresses = logs
    .map((log) => log.stack?.[log.stack.length - OPCODE_MAP[<Opcodes>log.op]]) // get list of addresses from trace
    .map((addr) => (!addr ? null : getAddress(`0x${addr.slice(24)}`))) // convert the 32 byte hex strings from the stack into checksummed addresses
    .filter((addr) => typeof addr === 'string') // remove null values
    .filter((addr, i, checksumAddresses) => checksumAddresses.indexOf(addr) === i) as string[] // remove duplicate addresses
  return { addresses, trace }
}
