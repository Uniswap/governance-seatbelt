/**
 * @notice Simulation configuration file for proposal 51.
 */
import { SimulationConfigNew } from '../types'
import { ERC20_ABI } from '../utils/contracts/erc20'
import { Interface } from '@ethersproject/abi'
import { parseUnits } from '@ethersproject/units'
import FranchiserFactoryAbi from '../utils/abis/FranchiserFactoryAbi.json' assert { type: 'json' }


// Target contracts
const tokenAddress = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984' // UNI token address.
const franchiserFactoryAddress = '0xf754A7E347F81cFdc70AF9FbCCe9Df3D826360FA' // Franchiser Factory contract

// Target contract interfaces
const erc20Interface = new Interface(ERC20_ABI)
const franchiserFactoryInterface = new Interface(FranchiserFactoryAbi)

// Parameters
const fourOhFourDaoAddress = '0xE93D59CC0bcECFD4ac204827eF67c5266079E2b5'
const wintermuteAddress = '0xB933AEe47C438f22DE0747D57fc239FE37878Dd1'
const pGovAddress = '0x3fb19771947072629c8eee7995a2ef23b72d4c8a'
const stableNodeAddress = '0xECC2a9240268BC7a26386ecB49E1Befca2706AC9'
const keyrockAddress = '0x1855f41B8A86e701E33199DE7C25d3e3830698ba'
const karpatkeyAddress = '0x8787FC2De4De95c53e5E3a4e5459247D9773ea52'
const atisAddress = '0xAac35d953Ef23aE2E61a866ab93deA6eC0050bcD'

const fourOhFourAmount = '2250000'
const wintermuteAmount = '1900000'
const pGovAmount = '2250000'
const stableNodeAmount = '2499858'
const keyrockAmount = '493972'
const karpatkeyAmount = '452626'
const atisAmount = '153544'

const delegatees = [fourOhFourDaoAddress, wintermuteAddress, pGovAddress, stableNodeAddress, keyrockAddress, karpatkeyAddress, atisAddress]

const delegateAmounts = [fourOhFourAmount, wintermuteAmount, pGovAmount, stableNodeAmount, keyrockAmount, karpatkeyAmount, atisAmount]

const totalAmount = delegateAmounts.map(item => Number(item)).reduce(((prev, curr) => prev + curr), 0)

const approveAmount = parseUnits(totalAmount.toString(), 18)

const parsedAmounts = delegateAmounts.map(item => parseUnits(item, 18))


// permit the franchiser factory to spend the UNI
const call1 = {
  target: tokenAddress,
  calldata: erc20Interface.encodeFunctionData('approve', [franchiserFactoryAddress, approveAmount]),
  value: 0,
  signature: '',
}

// fund franchiser contracts for each delegate
const call2 = {
  target: franchiserFactoryAddress,
  calldata: franchiserFactoryInterface.encodeFunctionData('fundMany', [delegatees, parsedAmounts]),
  value: 0,
  signature: '',
}

const calls = [call1, call2]

export const config: SimulationConfigNew = {
  type: 'new',
  daoName: 'Uniswap',
  governorType: 'bravo',
  governorAddress: '0x408ED6354d4973f66138C91495F2f2FCbd8724C3',
  targets: calls.map(call => call.target), // Array of targets to call.
  values: calls.map(call => call.value), // Array of values
  signatures: calls.map(call => call.signature), // Array of function signatures.
  calldatas: calls.map(call => call.calldata), // Array of calldatas
  description: 'Approve 10m UNI to FranchiserFactory, fund 7 Franchiser contracts',
}
