/**
 * @notice Simulation configuration file for proposal 51.
 */
import { SimulationConfigNew } from '../types'
import { ERC20_ABI } from '../utils/contracts/erc20'
import { Interface } from '@ethersproject/abi'
import { parseUnits } from '@ethersproject/units'

// Token transfer parameters.
const token = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984' // UNI token address.
const to = '0xe571dC7A558bb6D68FfE264c3d7BB98B0C6C73fC' // UF Treasury Safe
const amount = parseUnits('10685984.71', 18) // transfer 10.685m UNI, which has 18 decimals

// Get interface to facilitate encoding the calls we want to execute.
const erc20Interface = new Interface(ERC20_ABI)

// Define the parameters for the token transfer action.
const call1 = {
  target: token,
  calldata: erc20Interface.encodeFunctionData('transfer', [to, amount]),
  value: 0,
  signature: '',
}

export const config: SimulationConfigNew = {
  type: 'new',
  daoName: 'Uniswap',
  governorType: 'bravo',
  governorAddress: '0x408ED6354d4973f66138C91495F2f2FCbd8724C3',
  targets: [call1.target], // Array of targets to call.
  values: [call1.value], // Array of values with each call.
  signatures: [call1.signature], // Array of function signatures. Leave empty if generating calldata with ethers like we do here.
  calldatas: [call1.calldata], // Array of encoded calldatas.
  description: 'Transfer 10.685m UNI to UF Treasury',
}
