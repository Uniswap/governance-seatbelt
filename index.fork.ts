/**
 * @notice Entry point for executing a single proposal against a forked mainnet
 */

require('dotenv').config()
import { ethers, network } from 'hardhat'
import { BigNumber, Contract } from 'ethers'
import { governorBravo } from './utils/contracts/governor-bravo'
import { getAbi } from './utils/clients/etherscan'
import { Proposal } from './types'

// TODO modularize to avoid hardcoding fork block + proposal ID
// TODO enable running in CI, this only runs locally

const PROPOSAL_ID = 43 // arbitrary proposal
const provider = ethers.provider

async function simulate(proposal: Proposal, governor: Contract) {
  // Get timelock address from the governor
  const timelockAddress: string = await governor.admin()
  const timelockAbi = await getAbi(timelockAddress)
  let timelock = new Contract(timelockAddress, timelockAbi, ethers.provider)
  const timelockAdmin: string = await timelock.admin()

  // Get a signer for the timelock admin and give them an ETH balance
  await network.provider.request({ method: 'hardhat_impersonateAccount', params: [timelockAdmin] })
  const timelockAdminSigner = await ethers.getSigner(timelockAdmin)
  timelock = timelock.connect(timelockAdminSigner)
  await provider.send('hardhat_setBalance', [timelockAdmin, '0x56bc75e2d63100000']) // 100 ETH

  // Compute proposal ETA
  const now = (await provider.getBlock('latest')).timestamp
  const delay: BigNumber = await timelock.delay()
  const eta = delay.add(now).add(10) // some margin to ensure we satisfy: eta >= block.timestamp.add(delay)

  // Turn off Hardhat's automine so we can mine all transactions in the same block, to mimic all proposal calls
  // being executed atomically in the transaction. This is simpler than making the required state modifications
  // to call the governor's `execute` method
  await provider.send('evm_setAutomine', [false])

  // Queue all calls in the proposal
  const { targets, values, signatures, calldatas } = proposal
  await Promise.all(
    targets.map((_, i) => timelock.queueTransaction(targets[i], values[i] || 0, signatures[i], calldatas[i], eta))
  )
  await provider.send('evm_mine', [])

  // Fast-forward to the ETA and execute transactions
  await provider.send('evm_setNextBlockTimestamp', [eta.toHexString()])
  for (let i = 0; i < targets.length; i += 1) {
    await timelock.executeTransaction(targets[i], values[i] || 0, signatures[i], calldatas[i], eta)
  }
  await provider.send('evm_mine', [])
}

async function main() {
  // --- Save off current block/datetime (where "current" means the block we forked at) ---
  const latestBlock = await provider.getBlock('latest')
  const currentDateTime = new Date(latestBlock.timestamp * 1000)
  const formattedDateTime = currentDateTime.toISOString()

  // --- Find the proposal we're analyzing ---
  const blockRange = [0, latestBlock.number]
  const createProposalLogs = await governorBravo.queryFilter(governorBravo.filters.ProposalCreated(), ...blockRange)
  const proposalEvent = createProposalLogs.filter((log) => log.args?.id.toNumber() === PROPOSAL_ID)[0]
  if (!proposalEvent) {
    throw new Error(`Proposal ID ${PROPOSAL_ID} not found in logs for governor at ${governorBravo.address}`)
  }
  const proposal = proposalEvent.args as unknown as Proposal

  // --- Simulate proposal execution ---
  await simulate(proposal, governorBravo)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
