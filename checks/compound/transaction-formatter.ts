import { configuratorFormatters } from './formatters/configurator-formatters'
import { ExecuteTransactionInfo } from './compound-types'

export type TransactionFormatter = (transaction: ExecuteTransactionInfo, decodedParams: string[]) => Promise<string>

export const formattersLookup: {
  [contractName: string]: {
    [functionName: string]: TransactionFormatter
  }
} = {
  Configurator: configuratorFormatters,
}
