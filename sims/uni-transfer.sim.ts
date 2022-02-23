/**
 * @notice Sample simulation configuration file for a proposal that does not exist on-chain.
 * This proposal simulates transferring UNI to a recipient
 */
import { SimulationConfigNew } from '../types'
import { ERC20_ABI } from '../utils/contracts/erc20'
import { Interface } from '@ethersproject/abi'
import { parseUnits } from '@ethersproject/units'

const UNI_ADDRESS = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'
const to = '0xdead00000000000000000000000000000000dead'
const amount = parseUnits('100', 18) // transfer 100 UNI, which has 18 decimals

const uniInterface = new Interface(ERC20_ABI)
const transferCalldata = uniInterface.encodeFunctionData('transfer', [to, amount])

export const config: SimulationConfigNew = {
  type: 'new',
  daoName: 'Uniswap',
  governorAddress: '0x408ED6354d4973f66138C91495F2f2FCbd8724C3',
  targets: [UNI_ADDRESS], // array of targets to call
  values: [0], // array of values with each call
  signatures: [''], // array of function signatures -- leave empty if generating calldata with ethers like we do here
  calldatas: [transferCalldata], // array of encoded calldata (including function sigs)
  description: 'Transfer 100 UNI to 0xdead',
}
