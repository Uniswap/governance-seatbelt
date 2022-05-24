import { getAddress } from '@ethersproject/address'
import { getContractName } from '../utils/clients/tenderly'
import { ProposalCheck, Log } from '../types'
import { Content, UnorderedListElement } from 'pdfmake/interfaces'

const name = 'Reports all events emitted from the proposal'

/**
 * Reports all emitted events from the proposal
 */
export const checkLogs: ProposalCheck = {
  name,
  async checkProposal(proposal, sim, deps) {
    let info = ''
    const details: Content = [{ text: 'Events Emitted:', style: 'bold' }]

    // Emitted logs in the simulation are an array, so first we organize them by address. We skip
    // recording logs for (1) the the `queuedTransactions` mapping of the timelock, and
    // (2) the `proposal.executed` change of the governor, because this will be consistent across
    // all proposals and mainly add noise to the output
    // TODO remove some logic currently duplicated in the checkStateChanges check?

    const events = sim.transaction.transaction_info.logs?.reduce((logs, log) => {
      const addr = getAddress(log.raw.address)
      // Check if this is a log that should be filtered out
      const isGovernor = getAddress(addr) == deps.governor.address
      const isTimelock = getAddress(addr) == deps.timelock.address
      const shouldSkipLog =
        (isGovernor && log.name === 'ProposalExecuted') || (isTimelock && log.name === 'ExecuteTransaction')
      // Skip logs as required and add the rest to our logs object
      if (shouldSkipLog) return logs
      else if (!logs[addr]) logs[addr] = [log]
      else logs[addr].push(log)
      return logs
    }, {} as Record<string, Log[]>)

    // Return if no events to show
    if (!events || !Object.keys(events).length) {
      return { description: name, status: 'Passed', details: 'No events emitted' }
    }

    // Parse each event
    for (const [address, logs] of Object.entries(events)) {
      // Use contracts array to get contract name of address
      const contract = sim.contracts.find((c) => c.address === address)
      const sectionHeader = { text: getContractName(contract) }
      const eventList: UnorderedListElement[] = []
      info += `\n    - ${getContractName(contract)}`

      // Format log data for report
      logs.forEach((log) => {
        if (Boolean(log.name)) {
          // Log is decoded, format data as: VotingDelaySet(oldVotingDelay: value, newVotingDelay: value)
          const parsedInputs = log.inputs.map((i) => `${i.soltype!.name}: ${i.value}`).join(', ')
          eventList.push({ text: `${log.name}(${parsedInputs})`, style: 'list' })
        } else {
          // Log is not decoded, report the raw data
          // TODO find a transaction with undecoded logs to know how topics/data are formatted in simulation response
          eventList.push({ text: `Undecoded log: ${JSON.stringify(log)}`, style: 'list' })
        }
      })
      details.push(sectionHeader, eventList)
    }

    return { description: name, status: 'Passed', details }
  },
}
