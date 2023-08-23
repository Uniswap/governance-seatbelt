/**
 * @notice Sample simulation configuration file for the Celo bridge reconfiguration proposal.
 */
import { SimulationConfigNew } from '../types'
import { Interface } from '@ethersproject/abi'
import ArbitrumDelayedInboxAbi from '../utils/abis/ArbitrumDelayedInboxAbi.json' assert { type: 'json' }
import ArbTokenAbi from '../utils/abis/ArbTokenAbi.json' assert { type: 'json' }
import { parseUnits } from 'ethers/lib/utils'

// Get interfaces to facilitate encoding the calls we want to execute.
const DelayedInboxInterface = new Interface(ArbitrumDelayedInboxAbi)
const delayedInboxAddress = "0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"

const ArbTokenInterface = new Interface(ArbTokenAbi)
const arbTokenAddress = '0x912CE59144191C1204E64559FE8253a0e49E6548'

const timelockAliasAddress = '0x2BAD8182C09F50c8318d769245beA52C32Be46CD'

const gauntletAddress = '0xFd2892eFf2615C9F29AF83Fb528fAf3fE41c1426'
const openBlockAddress = '0x66cCbf509cD28c2fc0f40b4469D6b6AA1FC0FeD3'
const multisigAddress = '0xB3f1AdE4eF508fe8379f44fA6A25111977B9AEB6'

const gauntletAmount = parseUnits('150000', 18)
const openBlockAmount = parseUnits('15000', 18)
const multisigAmount = parseUnits('1835000', 18)

// get encoded function calls
const openBlockCallBytes = ArbTokenInterface.encodeFunctionData('transfer', [openBlockAddress, openBlockAmount])
const gauntletCallBytes = ArbTokenInterface.encodeFunctionData('transfer', [gauntletAddress, gauntletAmount])
const multisigCallBytes = ArbTokenInterface.encodeFunctionData('transfer', [multisigAddress, multisigAmount])

console.log({ openBlockCallBytes, gauntletCallBytes, multisigCallBytes })

// send OpenBlock their ARB
const call1 = {
  target: delayedInboxAddress, // ENS Public Resolver.
  calldata: DelayedInboxInterface.encodeFunctionData('createRetryableTicket', [
    // to string address
    arbTokenAddress,
    // l2CallValue uint256
    0,
    // maxSubmissionCost unit256
    180800000000000,
    // excessFeeRefundAddress address
    timelockAliasAddress,
    // callValueRefundAddress address
    timelockAliasAddress,
    // gasLimit uint256
    200000,
    // maxFeePerGas uinst256
    1000000000,
    // data
    openBlockCallBytes
  ]),
  value: 380800000000000,
  signature: '',
}

// send Gauntlet their ARB
const call2 = {
  target: delayedInboxAddress, // ENS Public Resolver.
  calldata: DelayedInboxInterface.encodeFunctionData('createRetryableTicket', [
    // to string address
    arbTokenAddress,
    // l2CallValue uint256
    0,
    // maxSubmissionCost unit256
    180800000000000,
    // excessFeeRefundAddress address
    timelockAliasAddress,
    // callValueRefundAddress address
    timelockAliasAddress,
    // gasLimit uint256
    200000,
    // maxFeePerGas uinst256
    1000000000,
    // data
    gauntletCallBytes
  ]),
  value: 380800000000000,
  signature: '',
}

// send Multisig its ARB
const call3 = {
  target: delayedInboxAddress, // ENS Public Resolver.
  calldata: DelayedInboxInterface.encodeFunctionData('createRetryableTicket', [
    // to string address
    arbTokenAddress,
    // l2CallValue uint256
    0,
    // maxSubmissionCost unit256
    180800000000000,
    // excessFeeRefundAddress address
    timelockAliasAddress,
    // callValueRefundAddress address
    timelockAliasAddress,
    // gasLimit uint256
    200000,
    // maxFeePerGas uinst256
    1000000000,
    // data
    multisigCallBytes
  ]),
  value: 380800000000000,
  signature: '',
}

const calls = [call1, call2, call3]

export const config: SimulationConfigNew = {
  type: 'new',
  daoName: 'Uniswap',
  governorAddress: '0x408ED6354d4973f66138C91495F2f2FCbd8724C3',
  governorType: 'bravo',
  targets: calls.map(item => item.target), // Array of targets to call.
  values: calls.map(item => item.value), // Array of values with each call.
  signatures: calls.map(item => item.signature), // Array of function signatures. Leave empty if generating calldata with ethers like we do here.
  calldatas: calls.map(item => item.calldata), // Array of encoded calldatas.
  description: 'Deploy and Populate new subdomain',
}
