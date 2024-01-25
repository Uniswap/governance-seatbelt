import { BigNumber } from '@ethersproject/bignumber'

export interface ExecuteTransactionsInfo {
  targets: string[]
  signatures: string[]
  calldatas: string[]
  values: BigNumber[]
}

export interface ExecuteTransactionInfo {
  target: string
  signature: string
  calldata: string
  value?: BigNumber
}

export interface TargetLookupData {
  [address: string]: {
    contractName: string
    functions: {
      [functionName: string]: {
        description: string
        transactionFormatter: string
        proposals: {
          [proposalNumber: string]: string[]
        }
      }
    }
    proposals: number[]
  }
}

export interface TransactionMessage {
  info?: string
  warning?: string
  error?: string
}

export enum CometChains {
  arbitrum = 'arbitrum',
  polygon = 'polygon',
  mainnet = 'mainnet',
  base = 'base',
}
