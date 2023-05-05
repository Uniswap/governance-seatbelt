/**
 * @notice Sample simulation configuration file for a proposal that does not exist on-chain.
 * This proposal simulates transferring UNI to a recipient.
 */
import { SimulationConfigNew } from '../types'
import { Interface } from '@ethersproject/abi'
import { parseUnits } from '@ethersproject/units'

// Token transfer parameters.
const wallet = '0xF3FC178157fb3c87548bAA86F9d24BA38E649B58'
const token = '0x912CE59144191C1204E64559FE8253a0e49E6548' // ARB token address.
const to = '0xdead00000000000000000000000000000000dead'
const amount = parseUnits('100', 18) // transfer 100 ARB, which has 18 decimals

// Get interface to facilitate encoding the calls we want to execute.
const erc20WalletInterface = new Interface([
  'function transfer(address token, address to, uint256 value) public returns (bool success)',
])

// Define the parameters for the token transfer action.
const call1 = {
  target: wallet,
  calldata: erc20WalletInterface.encodeFunctionData('transfer', [token, to, amount]),
  value: 0,
  signature: '',
}

export const config: SimulationConfigNew = {
  type: 'new',
  daoName: 'ArbitrumTreasury',
  governorType: 'arb',
  governorAddress: '0x789fc99093b09ad01c34dc7251d0c89ce743e5a4',
  targets: [call1.target], // Array of targets to call.
  values: [call1.value], // Array of values with each call.
  signatures: [call1.signature], // Array of function signatures. Leave empty if generating calldata with ethers like we do here.
  calldatas: [call1.calldata], // Array of encoded calldatas.
  description: 'Transfer 100 ARB to 0xdead',
}
