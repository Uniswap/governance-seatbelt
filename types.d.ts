import { BigNumber } from 'ethers'
import { ContractTransaction } from '@ethersproject/contracts'

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

// Describes a single step of execution in a transaction
interface OpcodeExecution {
  pc: number
  op: string
  gas: number
  gasCost: number
  depth: number
  stack: string[]
  memory: string[]
  storage: Record<string, string>
}

// Shape of data returned from debug_traceTransaction
interface TransactionTrace {
  gas: number
  failed: boolean
  returnValue: string
  structLogs: OpcodeExecution[]
}
