import { ExecuteTransactionInfo } from './compound-types'

export type TransactionFormatter = (transaction: ExecuteTransactionInfo, decodedParams: string[]) => Promise<string>

export const formattersLookup: {
  [contractName: string]: {
    [functionName: string]: TransactionFormatter
  }
} = {
  Configurator: {
    'setBorrowPerYearInterestRateBase(address,uint64)': async (
      transaction: ExecuteTransactionInfo,
      decodedParams: string[],
    ) => {
      return `**Set Borrow Per Year Interest Rate Base**`
    },
    'setBorrowPerYearInterestRateSlopeLow(address,uint64)': async (
      transaction: ExecuteTransactionInfo,
      decodedParams: string[],
    ) => {
      return `**Set Borrow Per Year Interest Rate Slope Low**`
    },
    'setBorrowPerYearInterestRateSlopeHigh(address,uint64)': async (
      transaction: ExecuteTransactionInfo,
      decodedParams: string[],
    ) => {
      return `**Set Borrow Per Year Interest Rate Slope High**`
    },
  },
}
