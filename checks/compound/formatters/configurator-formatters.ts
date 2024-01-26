import { ExecuteTransactionInfo } from '@/checks/compound/compound-types'

export const configuratorFormatters = {
  'setBorrowPerYearInterestRateBase(address,uint64)': async (
    transaction: ExecuteTransactionInfo,
    decodedParams: string[],
  ) => {
    return `**Set Borrow Per Year Interest Rate Base** \n \n \n ${decodedParams} \n \n \n  `
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
}
