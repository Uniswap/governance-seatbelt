import { BigNumber } from 'ethers'
import { ContractTransaction } from '@ethersproject/contracts'

// --- Proposals ---
export interface Proposal {
  id: BigNumber
  proposer: string
  targets: string[]
  values: BigNumber[]
  signatures: string[]
  calldatas: string[]
  startBlock: BigNumber
  endBlock: BigNumber
  description: string
}

export type Message = string

export type CheckResult = {
  info: Message[]
  warnings: Message[]
  errors: Message[]
}

export interface ProposalCheck {
  name: string
  checkProposal(proposal: Proposal, tx: ContractTransaction): Promise<CheckResult>
}

export interface AllCheckResults {
  [checkId: string]: { name: string; result: CheckResult }
}

// --- Transaction tracing ---
// RpcStructLog: Describes a single step of execution in a transaction
// RpcDebugTraceOutput: Full output of debug_traceTransaction
export { RpcStructLog, RpcDebugTraceOutput } from 'hardhat/internal/hardhat-network/provider/output'

export interface StorageWrite {
  address: string // address where the state change occurred
  index: number // index in the structLogs of the transaction trace where this SSTORE is
  slot: string // slot written to
  value: string // new value written to the slot
}

export interface StorageDiff extends Omit<StorageWrite, 'address'> {
  oldValue: string
}

export interface StateDiff {
  balance: string;
  storage: StorageDiff[]
}

// --- Etherscan ---
// ABI returned from Etherscan (we could add stronger typing here if required, but this is sufficient for now)
export type ABI = {
  inputs: {
    internalType: string
    name: string
    type: string
  }[]
  payable: boolean
  stateMutability: string
  type: string
}[]

export interface ContractSource {
  SourceCode: string
  ABI: string
  ContractName: string
  CompilerVersion: string
  OptimizationUsed: string
  Runs: string
  ConstructorArguments: string
  EVMVersion: string
  Library: string
  LicenseType: string
  Proxy: string
  Implementation: string
  SwarmSource: string
}

// --- 4byte.directory ---
// Shape of data returned when querying 4byte.directory
export type FourByteResponse = {
  count: number
  next: unknown
  previous: unknown
  results: {
    id: number
    created_at: string // ISO 8601 timestamp
    text_signature: string
    hex_signature: string
    bytes_signature: string
  }[]
}
