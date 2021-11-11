import { ProposalCheck } from '../types'
import { getCode } from '../utils/clients/etherscan'
import { provider } from '../utils/clients/ethers'
import { getTouchedAddresses } from './utils'
import { ContractSource } from '../types'
import { formatEther } from '@ethersproject/units'

/**
 * Gets state changes of all touched addresses
 */
export const checkStateChanges: ProposalCheck = {
  name: 'Gets state changes of all touched addresses',
  async checkProposal(proposal, tx) {
    // Get code at each address
    const addresses = await getTouchedAddresses(tx)
    const code = await Promise.all(
      addresses.map(async (address) => ((await provider.getCode(address)) === '0x' ? '0x' : await getCode(address)))
    )
    const data = addresses.map((address, i) => ({ address, code: code[i] }))

    // Get state at prior block and current block to compute state diff
    if (!tx.blockNumber) throw new Error('Transaction is missing block number')
    for (const item of data) {
      const { address, code } = item
      const stateChange =
        code === '0x'
          ? getEthBalanceChange(tx.blockNumber, address)
          : getStateChangeContract(tx.blockNumber, address, code as ContractSource) // code === '0x' is not sufficient for type inference apparently

      // TODO return state change data in `info`
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
  if (prevBalance.eq(newBalance)) return null
  return `${formatEther(newBalance.sub(prevBalance))} ETH`
}

// Returns state changes in contract at `address` between `block-1` and `block`
async function getStateChangeContract(block: number, address: string, code: ContractSource) {
  // 1. Compile `code` at `address` with storageLayout flag enabled
  // 2. For each slot in the storage layout output, get decoded slot value before and after tx execution
  // 3. TODO how to handle mapping keys? Presumably debug_traceTransaction has all the slots, but TBD
  //    how to extract only mapping slots to reduce execution time/effort
  // 4. Call getEthBalanceChange()
  return 'TODO'
}
