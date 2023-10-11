/**
 * @notice Sample simulation configuration file for the arb lm distribution proposal.
 */
import { SimulationConfigNew } from '../types'
import { Interface } from '@ethersproject/abi'
import ArbitrumDelayedInboxAbi from '../utils/abis/ArbitrumDelayedInboxAbi.json' assert { type: 'json' }
import ArbTokenAbi from '../utils/abis/ArbTokenAbi.json' assert { type: 'json' }
import { formatEther, parseUnits } from 'ethers/lib/utils'

// Get interfaces to facilitate encoding the calls we want to execute.
const DelayedInboxInterface = new Interface(ArbitrumDelayedInboxAbi)
const delayedInboxAddress = "0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"

const ArbTokenInterface = new Interface(ArbTokenAbi)
const arbTokenAddress = '0x912CE59144191C1204E64559FE8253a0e49E6548'

const timelockAliasAddress = '0x2BAD8182C09F50c8318d769245beA52C32Be46CD'


const multisigAddress = '0xB3f1AdE4eF508fe8379f44fA6A25111977B9AEB6'
const multisigAmount = parseUnits('1200000', 18)

const ethAmount = formatEther('380800000000000')
console.log({ ethAmount })
// get encoded function calls

const transferCallBytes = ArbTokenInterface.encodeFunctionData('transfer', [multisigAddress, multisigAmount])

const delegateCallBytes = ArbTokenInterface.encodeFunctionData('delegate', [multisigAddress])

console.log({ delegateCallBytes, transferCallBytes })

// delegate to the multisig
const call1 = {
  target: delayedInboxAddress,
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
    // maxFeePerGas uint256
    1000000000,
    // data
    delegateCallBytes
  ]),
  value: 380800000000000,
  signature: '',
}

// send Multisig its ARB
const call2 = {
  target: delayedInboxAddress,
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
    // maxFeePerGas uint256
    1000000000,
    // data
    transferCallBytes
  ]),
  value: 380800000000000,
  signature: '',
}

const calls = [call1, call2]

export const config: SimulationConfigNew = {
  type: 'new',
  daoName: 'Uniswap',
  governorAddress: '0x408ED6354d4973f66138C91495F2f2FCbd8724C3',
  governorType: 'bravo',
  targets: calls.map(item => item.target), // Array of targets to call.
  values: calls.map(item => item.value), // Array of values with each call.
  signatures: calls.map(item => item.signature), // Array of function signatures. Leave empty if generating calldata with ethers like we do here.
  calldatas: calls.map(item => item.calldata), // Array of encoded calldatas.
  description: 'Send ARB to three recipients',
}
