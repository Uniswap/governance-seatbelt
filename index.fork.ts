/**
 * @notice Entry point for executing a single proposal against a forked mainnet
 */

require('dotenv').config()
import fs from 'fs'
import hre, { artifacts, ethers } from 'hardhat'
import { BigNumber, Contract } from 'ethers'
import { governorBravo } from './utils/contracts/governor-bravo'
import { getCode } from './utils/clients/etherscan'
import { Proposal } from './types'

// TODO modularize to avoid hardcoding fork block + proposal ID
// TODO enable running in CI, this only runs locally
// TODO modify Bravo's code and impersonate Bravo to get more accurate gas estimates? Or just hardcode
// some margin based on the opcode costs of what's going on in Bravo.execute?

const PROPOSAL_ID = 43 // arbitrary proposal
const provider = ethers.provider
const { hexStripZeros, hexZeroPad } = ethers.utils

async function simulate(proposal: Proposal, governor: Contract) {
  // --- Modify code at timelock to allow batch execution of queued transactions ---
  // Get source code of timelock
  const timelockAddress: string = await governor.admin()
  const { SourceCode: code } = await getCode(timelockAddress)

  // Replace the contract's closing brace with our new method and enable ABIEncoderV2. Using `memory` for
  // input parameters to ensure compatibility with older solidity versions that don't support `calldata`
  const batchExecuteMethod = `
    function execute(address[] memory targets, uint[] memory values, string[] memory signatures, bytes[] memory calldatas, uint eta) public payable returns (bytes memory) {
      for (uint i = 0; i < targets.length; i++) {
        executeTransaction(targets[i], values[i], signatures[i], calldatas[i], eta);
      }
    }
  `
  const lastBracketIndex = code.lastIndexOf('}')
  const newCode = `pragma experimental ABIEncoderV2;\n${code.substring(0, lastBracketIndex)}${batchExecuteMethod}}\n`

  // Dump source code to a temporary file, compile it, get the ABI and bytecode, then delete the temporary file
  const tempTimelockContract = 'contracts/tmp.sol'
  fs.writeFileSync(tempTimelockContract, newCode)
  await hre.run('compile') // TODO can we specify compiler settings here based on the data returned from `getCode`?
  const { abi, deployedBytecode } = artifacts.readArtifactSync('Timelock')
  fs.unlinkSync(tempTimelockContract)

  // Place the bytecode at the timelock address
  await provider.send('hardhat_setCode', [timelockAddress, deployedBytecode])

  //  --- Change timelock admin to a regular signer ---
  // Get the original admin address
  let timelock = new Contract(timelockAddress, abi, provider)
  const originalTimelockAdmin: string = await timelock.admin()

  // Find the storage slot containing the admin by testing each slot for the expected admin value
  let slot: string = '0x'
  for (let i = 0; i < 500; i += 1) {
    slot = i === 0 ? '0x0' : hexStripZeros(BigNumber.from(i).toHexString())
    const data = await provider.send('eth_getStorageAt', [timelockAddress, slot])
    const address = `0x${data.slice(26, 66)}`
    if (address.toLowerCase() === originalTimelockAdmin.toLowerCase()) break
  }
  if (slot === '0x') throw new Error('Admin slot was not found')

  // Overwrite the admin with one of the default hardhat signers
  const [admin] = await ethers.getSigners()
  await provider.send('hardhat_setStorageAt', [timelockAddress, slot, hexZeroPad(admin.address, 32)])
  if ((await timelock.admin()) !== admin.address) throw new Error('Admin was not updated')

  // --- Execution setup ---
  // Attach admin signer to timelock contract and make sure they have an ETH balance
  timelock = timelock.connect(admin)
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
