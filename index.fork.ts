/**
 * @notice Entry point for executing a single proposal against a forked mainnet
 */

require('dotenv').config()
import { artifacts, ethers } from 'hardhat'
import { BigNumber, Contract } from 'ethers'
import { governorBravo } from './utils/contracts/governor-bravo'
import { Proposal } from './types'

// TODO enable running in CI, this only runs locally
// TODO modify Bravo's code and impersonate Bravo to get more accurate gas estimates? Or just hardcode
// some margin based on the opcode costs of what's going on in Bravo.execute?

const PROPOSAL_ID = Number(process.env.PROPOSAL_ID)
const provider = ethers.provider

async function simulate(proposal: Proposal, governor: Contract) {
  // --- Modify code at timelock ---
  // See ModifiedTimelock.sol for details on what's changed over the standard Timelock

  // Place the modified bytecode at the timelock address
  const timelockAddress: string = await governor.admin()
  const { abi, deployedBytecode } = artifacts.readArtifactSync('ModifiedTimelock')
  await provider.send('hardhat_setCode', [timelockAddress, deployedBytecode])

  // Verify the admin matches the first Hardhat signer
  const [admin] = await ethers.getSigners()
  const timelock = new Contract(timelockAddress, abi, admin)
  const timelockAdmin = await timelock.admin()
  if (timelockAdmin !== admin.address) {
    throw new Error(`Expected timelock to have admin of ${admin.address}, but found ${timelockAdmin}`)
  }

  // --- Execution setup ---
  // Make sure admin has an ETH balance
  await provider.send('hardhat_setBalance', [admin.address, '0x21e19e0c9bab2400000']) // 10000 ETH

  // Compute proposal ETA
  const now = (await provider.getBlock('latest')).timestamp
  const delay: BigNumber = await timelock.delay()
  const eta = delay.add(now).add(10) // some margin to ensure we satisfy: eta >= block.timestamp.add(delay)

  // --- Queue calls ---
  // Send the transactions
  const { targets, values, signatures: sigs, calldatas } = proposal
  const vals = typeof values === 'function' ? sigs.map((_) => 0) : values // TODO sometimes values is a function when it should be zero?
  const queueTxs = await Promise.all(
    sigs.map((_, i) => timelock.queueTransaction(targets[i], vals, sigs[i], calldatas[i], eta))
  )

  // Verify all queue transactions were successful
  const queueReceipts = await Promise.all(queueTxs.map((tx) => provider.getTransactionReceipt(tx.hash)))
  const queueStatus = queueReceipts.map((receipt) => receipt.status)
  if (!queueStatus.every((status) => status === 1)) throw new Error('Transactions were not successfully queued')

  // --- Execute ---
  // Fast-forward to the ETA and execute transactions
  await provider.send('evm_setNextBlockTimestamp', [eta.toHexString()])
  const tx = await timelock.execute(targets, vals, sigs, calldatas, eta)
  const receipt = await provider.getTransactionReceipt(tx.hash)
  return { tx, receipt }
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
  const { tx, receipt } = await simulate(proposal, governorBravo)
  console.log('tx: ', tx)
  console.log('receipt: ', receipt)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
