/**
 * @notice
 This proposal creates a new subdomain on the uniswap.eth ENS name and populates its text records
 with addresses of v2 deployments
 */
import { SimulationConfigNew } from '../types'
import { Interface } from '@ethersproject/abi'
import { labelhash } from '@ensdomains/ensjs/utils/labels'
import { namehash } from '@ensdomains/ensjs/utils/normalise'


// Get interfaces to facilitate encoding the calls we want to execute.
const ensRegistryAbi = [
  'function setSubnodeRecord(bytes32 node, bytes32 label, address owner, address resolver, uint64 ttl) external',
]
const ensPublicResolverAbi = ['function setText(bytes32 node, string calldata key, string calldata value) external']

const ensRegistryInterface = new Interface(ensRegistryAbi)
const ensPublicResolverInterface = new Interface(ensPublicResolverAbi)

const ensRegistry = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
const ensPublicResolver = '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41'
const timelock = '0x1a9C8182C09F50C8318d769245beA52c32BE35BC'
const nameHash = namehash("uniswap.eth")
const labelHash = labelhash("v2deployments")
const subnameHash = namehash("v2deployments.uniswap.eth")

console.log({
  nameHash,
  labelHash,
  subnameHash
})

// add subname
const call1 = {
  target: ensRegistry, // ENS Registry contract.
  calldata: ensRegistryInterface.encodeFunctionData('setSubnodeRecord', [
    nameHash, // Node.
    labelHash, // Label.
    timelock, // Owner.
    ensPublicResolver, // Resolver.
    0, // TTL.
  ]),
  value: 0,
  signature: '',
}

// add Optimism record
const call2 = {
  target: ensPublicResolver, // ENS Public Resolver.
  calldata: ensPublicResolverInterface.encodeFunctionData('setText', [
    // Node.
    subnameHash,
    // Key.
    '10',
    // Value.
    '0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1, 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
  ]),
  value: 0,
  signature: '',
}

// add arbitrum record
const call3 = {
  target: ensPublicResolver, // ENS Public Resolver.
  calldata: ensPublicResolverInterface.encodeFunctionData('setText', [
    // Node.
    subnameHash,
    // Key.
    '42161',
    // Value.
    '0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f, 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
  ]),
  value: 0,
  signature: '',
}

// add avalanche record
const call4 = {
  target: ensPublicResolver, // ENS Public Resolver.
  calldata: ensPublicResolverInterface.encodeFunctionData('setText', [
    // Node.
    subnameHash,
    // Key.
    '43114',
    // Value.
    '0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f, 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
  ]),
  value: 0,
  signature: '',
}

// add base record
const call5 = {
  target: ensPublicResolver, // ENS Public Resolver.
  calldata: ensPublicResolverInterface.encodeFunctionData('setText', [
    // Node.
    subnameHash,
    // Key.
    '8453',
    // Value.
    '0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f, 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
  ]),
  value: 0,
  signature: '',
}

// add binance record
const call6 = {
  target: ensPublicResolver, // ENS Public Resolver.
  calldata: ensPublicResolverInterface.encodeFunctionData('setText', [
    // Node.
    subnameHash,
    // Key.
    '56',
    // Value.
    '0xf5F4496219F31CDCBa6130B5402873624585615a, 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
  ]),
  value: 0,
  signature: '',
}

// add polygon record
const call7 = {
  target: ensPublicResolver, // ENS Public Resolver.
  calldata: ensPublicResolverInterface.encodeFunctionData('setText', [
    // Node.
    subnameHash,
    // Key.
    '137',
    // Value.
    '0xfe5e5D361b2ad62c541bAb87C45a0B9B018389a2, 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
  ]),
  value: 0,
  signature: '',
}

// add gnosis record
const call8 = {
  target: ensPublicResolver, // ENS Public Resolver.
  calldata: ensPublicResolverInterface.encodeFunctionData('setText', [
    // Node.
    subnameHash,
    // Key.
    '100',
    // Value.
    '0xf5F4496219F31CDCBa6130B5402873624585615a, 0x7146c626be7ee5e70747aa75e295439e643fc034',
  ]),
  value: 0,
  signature: '',
}

// add Boba record
const call9 = {
  target: ensPublicResolver, // ENS Public Resolver.
  calldata: ensPublicResolverInterface.encodeFunctionData('setText', [
    // Node.
    subnameHash,
    // Key.
    '288',
    // Value.
    '0x6D4528d192dB72E282265D6092F4B872f9Dff69e, 0x53163235746ceb81da32293bb0932e1a599256b4',
  ]),
  value: 0,
  signature: '',
}

const calls = [call1, call2, call3, call4, call5, call6, call7, call8, call9]

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
