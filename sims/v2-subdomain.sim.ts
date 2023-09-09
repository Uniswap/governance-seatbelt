/**
 * @notice
 This proposal creates a new subdomain on the uniswap.eth ENS name and populates its text records
 with addresses of v2 deployments
 */
import { SimulationConfigNew } from '../types'
import { Interface } from '@ethersproject/abi'
import { labelhash } from '@ensdomains/ensjs/utils/labels'
import { namehash } from '@ensdomains/ensjs/utils/normalise'
import ENSPublicResolverABI from '../utils/abis/ENSPublicResolverABI.json' assert { type: 'json' }

const ensRegistryAbi = [
  'function setSubnodeRecord(bytes32 node, bytes32 label, address owner, address resolver, uint64 ttl) external',
]

const ensRegistryAddress = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
const ensRegistryInterface = new Interface(ensRegistryAbi)

const ensPublicResolverAddress = '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41'
const ensPublicResolverInterface = new Interface(ENSPublicResolverABI)

const timelock = '0x1a9C8182C09F50C8318d769245beA52c32BE35BC'
const nameHash = namehash("uniswap.eth")
const labelHash = labelhash("v2deployments")
const subnameHash = namehash("v2deployments.uniswap.eth")

// generate Optimism bytes
const optimism = ensPublicResolverInterface.encodeFunctionData('setText', [
  // Node.
  subnameHash,
  // Key.
  '10',
  // Value.
  '0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1, 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
])

// generate arbitrum bytes
const arbitrum = ensPublicResolverInterface.encodeFunctionData('setText', [
  // Node.
  subnameHash,
  // Key.
  '42161',
  // Value.
  '0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f, 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
])

// generate avalanche bytes
const avalanche = ensPublicResolverInterface.encodeFunctionData('setText', [
  // Node.
  subnameHash,
  // Key.
  '43114',
  // Value.
  '0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f, 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
])

// generate base bytes
const base = ensPublicResolverInterface.encodeFunctionData('setText', [
  // Node.
  subnameHash,
  // Key.
  '8453',
  // Value.
  '0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f, 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
])

// generate binance bytes
const binance = ensPublicResolverInterface.encodeFunctionData('setText', [
  // Node.
  subnameHash,
  // Key.
  '56',
  // Value.
  '0xf5F4496219F31CDCBa6130B5402873624585615a, 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
])

// generate polygon bytes
const polygon = ensPublicResolverInterface.encodeFunctionData('setText', [
  // Node.
  subnameHash,
  // Key.
  '137',
  // Value.
  '0xfe5e5D361b2ad62c541bAb87C45a0B9B018389a2, 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
])

// generate gnosis bytes
const gnosis = ensPublicResolverInterface.encodeFunctionData('setText', [
  // Node.
  subnameHash,
  // Key.
  '100',
  // Value.
  '0xf5F4496219F31CDCBa6130B5402873624585615a, 0x7146c626be7ee5e70747aa75e295439e643fc034',
])
// generate Boba bytes
const boba = ensPublicResolverInterface.encodeFunctionData('setText', [
  // Node.
  subnameHash,
  // Key.
  '288',
  // Value.
  '0x6D4528d192dB72E282265D6092F4B872f9Dff69e, 0x53163235746ceb81da32293bb0932e1a599256b4',
])

// generate linea bytes
const linea = ensPublicResolverInterface.encodeFunctionData('setText', [
  // Node.
  subnameHash,
  // Key.
  '59144',
  // Value.
  '0xd19d4B5d358258f05D7B411E21A1460D11B0876F, 0x056588f18869a626b0Ae9e89f077eFE6BA752633',
])

// generate moonbeam bytes
const moonbeam = ensPublicResolverInterface.encodeFunctionData('setText', [
  // Node.
  subnameHash,
  // Key.
  '288',
  // Value.
  '0xf5F4496219F31CDCBa6130B5402873624585615a, 0x91FbCAe76de0b852519C26D9f8CA865b5027eeFA',
])

// generate celo bytes
const celo = ensPublicResolverInterface.encodeFunctionData('setText', [
  // Node.
  subnameHash,
  // Key.
  '288',
  // Value.
  '0xf5F4496219F31CDCBa6130B5402873624585615a, 0x79a530c8e2fA8748B7B40dd3629C0520c2cCf03f',
])

// log outputs for tally
console.log({
  nameHash,
  labelHash,
  subnameHash, bytes: [optimism, arbitrum, avalanche, polygon, base, binance, celo, gnosis, boba, moonbeam, linea]
})

// add subname
const call1 = {
  target: ensRegistryAddress, // ENS Registry.
  calldata: ensRegistryInterface.encodeFunctionData('setSubnodeRecord', [
    nameHash, // Node.
    labelHash, // Label.
    timelock, // Owner.
    ensPublicResolverAddress, // Resolver.
    0, // TTL.
  ]),
  value: 0,
  signature: '',
}

// add text records in multicall
const call2 = {
  target: ensPublicResolverAddress, // ENS Public Resolver.
  calldata: ensPublicResolverInterface.encodeFunctionData('multicall',
    [[optimism, arbitrum, avalanche, polygon, base, binance, celo, gnosis, boba, moonbeam, linea]]
  ),
  value: 0,
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
  description: 'Deploy and Populate new subdomain',
}
