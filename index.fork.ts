/**
 * @notice Entry point for executing a single proposal against a forked mainnet
 */

require('dotenv').config()
import fs from 'fs'
import { DAO_NAME, RUNNING_LOCALLY } from './utils/constants'
import { artifacts, ethers } from 'hardhat'
import { BigNumber, Contract } from 'ethers'
import { ContractTransaction } from '@ethersproject/contracts'
import { governorBravo } from './utils/contracts/governor-bravo'
import { AllCheckResults, Proposal } from './types'
import ALL_CHECKS from './checks'
import { toProposalReport } from './presentation/markdown'

// TODO enable running in CI, this only runs locally
// TODO modify Bravo's code and impersonate Bravo to get more accurate gas estimates? Or just hardcode
// some margin based on the opcode costs of what's going on in Bravo.execute?

const PROPOSAL_ID = Number(process.env.PROPOSAL_ID)
const provider = ethers.provider

/**
 * @notice Simulates execution of a governance proposal
 * @param proposal Proposal to simulate
 * @param governor Contract instance of the governor contract for that proposal
 * @returns Transaction data and receipt
 */
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
  const tx = (await timelock.execute(targets, vals, sigs, calldatas, eta)) as ContractTransaction
  return { tx }
}

/**
 * @notice Executes proposal checks and generates a report for the proposal ID specified
 * by the PROPOSAL_ID environment variable, based on simulating execution of that proposal
 * at the block specified by the FORK_BLOCK environment variable.
 */
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
  const { tx } = await simulate(proposal, governorBravo)

  // --- Run proposal checks ---
  const checkResults: AllCheckResults = Object.fromEntries(
    await Promise.all(
      Object.keys(ALL_CHECKS).map(async (checkId) => [
        checkId,
        {
          name: ALL_CHECKS[checkId].name,
          result: await ALL_CHECKS[checkId].checkProposal(proposal, tx),
        },
      ])
    )
  )

  // --- Save report ---
  const [startBlock, endBlock] = await Promise.all([
    proposal.startBlock.toNumber() <= latestBlock.number ? provider.getBlock(proposal.startBlock.toNumber()) : null,
    proposal.endBlock.toNumber() <= latestBlock.number ? provider.getBlock(proposal.endBlock.toNumber()) : null,
  ])

  const report = toProposalReport({ start: startBlock, end: endBlock, current: latestBlock }, proposal, checkResults)

  if (RUNNING_LOCALLY) {
    // Running locally, dump to file
    const dir = `./reports/${DAO_NAME}/${governorBravo.address}/`
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(`${dir}/${proposal.id}.md`, report)
  } else {
    // Running in CI, save to file on REPORTS_BRANCH
    // TODO
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
