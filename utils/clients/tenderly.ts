import fetchUrl, { FETCH_OPT } from 'micro-ftch'
import { getAddress } from '@ethersproject/address'
import { provider } from './ethers'
import { governorBravo } from '../contracts/governor-bravo'
import { TENDERLY_ACCESS_TOKEN, TENDERLY_URL } from '../constants'
import { Proposal, SimulationConfig, SimulationConfigExecuted, TenderlyPayload, TenderlySimulation } from '../../types'

/**
 * @notice Simulates a proposal based on the provided configuration
 * @param config Configuration object
 */
export async function simulate(config: SimulationConfig) {
  if (config.type === 'executed') return await simulateExecuted(config)
  throw new Error(`Unsupported simulation type ${config.type}`)
}

/**
 * @notice Simulates execution of an already-executed governance proposal
 * @param config Configuration object
 */
export async function simulateExecuted(config: SimulationConfigExecuted) {
  const { governorAddress, proposalId } = config

  // --- Get details about the proposal we're analyzing ---
  const latestBlock = await provider.getBlock('latest')
  const blockRange = [0, latestBlock.number]
  const governor = governorBravo(governorAddress)

  const [createProposalLogs, proposalExecutedLogs] = await Promise.all([
    governor.queryFilter(governor.filters.ProposalCreated(), ...blockRange),
    governor.queryFilter(governor.filters.ProposalExecuted(), ...blockRange),
  ])

  const proposalCreatedEvent = createProposalLogs.filter((log) => log.args?.id.toNumber() === proposalId)[0]
  if (!proposalCreatedEvent) throw new Error(`Proposal creation log for #${proposalId} not found in governor logs`)
  const proposal = proposalCreatedEvent.args as unknown as Proposal

  const proposalExecutedEvent = proposalExecutedLogs.filter((log) => log.args?.id.toNumber() === proposalId)[0]
  if (!proposalExecutedEvent) throw new Error(`Proposal execution log for #${proposalId} not found in governor logs`)

  // --- Simulate it ---
  // Prepare tenderly payload. Since this proposal was already executed, we directly use that transaction data
  const tx = await provider.getTransaction(proposalExecutedEvent.transactionHash)
  const simulationPayload: TenderlyPayload = {
    network_id: String(tx.chainId) as TenderlyPayload['network_id'],
    block_number: tx.blockNumber,
    from: tx.from,
    to: tx.to as string,
    input: tx.data,
    gas: tx.gasLimit.toNumber(),
    gas_price: tx.gasPrice?.toString(),
    value: tx.value.toString(),
    save: false,
    generate_access_list: true,
  }
  const sim = await sendSimulation(simulationPayload)
  return { sim, proposal, latestBlock }
}

async function sendSimulation(payload: TenderlyPayload) {
  // Send simulation request
  const fetchOptions = <Partial<FETCH_OPT>>{
    method: 'POST',
    type: 'json',
    headers: { 'X-Access-Key': TENDERLY_ACCESS_TOKEN },
    data: payload,
  }
  const sim = <TenderlySimulation>await fetchUrl(TENDERLY_URL, fetchOptions)

  // Post-processing to ensure addresses we use are checksummed (since ethers returns checksummed addresses)
  sim.transaction.addresses = sim.transaction.addresses.map(getAddress)
  sim.contracts.forEach((contract) => (contract.address = getAddress(contract.address)))
  return sim
}
