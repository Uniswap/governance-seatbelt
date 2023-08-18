/**
 * @notice Sample simulation configuration file for a proposal that does not exist on-chain.
 * This proposal configures ENS records so the Uniswap DAO Grants Voltz an additional use grant.
 * Be aware this is identical to an already executed proposal: https://app.uniswap.org/#/vote/2/11?chain=mainnet
 */
import { SimulationConfigNew } from '../types'
import { Interface } from '@ethersproject/abi'
import { labelhash } from '@ensdomains/ensjs/utils/labels'
import { namehash } from '@ensdomains/ensjs/utils/normalise'


// Get interfaces to facilitate encoding the calls we want to execute.
const ensPublicResolverAbi = ['function setText(bytes32 node, string calldata key, string calldata value) external']

const ensPublicResolverInterface = new Interface(ensPublicResolverAbi)
const ensPublicResolver = '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41'
const subnameHash = namehash("v3deployments.uniswap.eth")

console.log({
  subnameHash
})

// update celo text record
const call1 = {
  target: ensPublicResolver, // ENS Public Resolver.
  calldata: ensPublicResolverInterface.encodeFunctionData('setText', [
    // Node.
    subnameHash,
    // Key.
    '42220',
    // Value.
    '0xf5F4496219F31CDCBa6130B5402873624585615a, 0xf7e46b233abd1edaad8dbbbda12129b97b071025',
  ]),
  value: 0,
  signature: '',
}

const calls = [call1]

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
