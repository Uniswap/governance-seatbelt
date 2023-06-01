import { Zero } from '@ethersproject/constants'
import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from '@ethersproject/units'
import { ProposalCheck } from '../types'
import { getProvider } from '../utils/utils'

/**
 * Reports on whether the caller initiating the `execute` call needs to send ETH with the call.
 */
export const checkValueRequired: ProposalCheck = {
  name: 'Reports on whether the caller needs to send ETH with the call',
  async checkProposal(proposal, sim, deps) {
    // TODO Fix typings for values. The `values` field is not always present in the proposal object,
    // but key `3` contains them. (Similarly key 0 is proposal ID, 1 is proposer, etc.). This is
    // related to why we use `proposalCreatedEvent.args![3]` in `tenderly.ts`.
    type ProposalValues = { '3': BigNumber[] }
    const totalValue = proposal.values
      ? // For local simulations, `values` exists and `3` does not.
        proposal.values.reduce((sum, cur) => sum.add(cur), Zero)
      : // For simulations read from the chain, `3` exists and `values` does not.
        (proposal as unknown as ProposalValues)['3'].reduce((sum, cur) => sum.add(cur), Zero)

    const txValue = BigNumber.from(sim.simulation.value)
    if (txValue.eq(Zero)) {
      const msg = 'No ETH is required to be sent by the account that executes this proposal.'
      return { info: [msg], warnings: [], errors: [] }
    }

    const valueRequired = formatEther(totalValue)
    const govBalance = formatEther(await getProvider(proposal.chainid).getBalance(deps.governor.address))
    const valueSent = formatEther(txValue)

    const msg1 = 'The account that executes this proposal will need to send ETH along with the transaction.'
    const msg2 = `The calls made by this proposal require a total of ${valueRequired} ETH, and the Governor contract has ${govBalance} ETH.`
    const msg3 = `As a result, the account that executes this proposal will need to send ${valueSent} ETH along with the transaction.`
    const msg = `${msg1}\n\n${msg2} ${msg3}`

    return { info: [], warnings: [msg], errors: [] }
  },
}
