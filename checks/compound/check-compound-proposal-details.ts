import { FunctionFragment, Interface } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import fs from 'fs'
import mftch from 'micro-ftch'
import { ProposalCheck, ProposalData } from './../../types'
import { getContractNameAndAbiFromFile, getFunctionSignature } from './abi-utils'
import { CometChains, ExecuteTransactionsInfo, TargetLookupData } from './compound-types'
import { getDecodedBytesForArbitrum, getDecodedBytesForBase, getDecodedBytesForPolygon } from './l2-utils'
// @ts-ignore
const fetchUrl = mftch.default

async function updateLookupFile(chain: CometChains, proposalId: number, transactions: ExecuteTransactionsInfo) {
  const { targets, signatures, calldatas, values } = transactions

  const targetLookupFilePath = `./checks/compound/lookup/${chain}TargetLookup.json`
  let lookupData: TargetLookupData = {}

  if (fs.existsSync(targetLookupFilePath)) {
    const fileContent = fs.readFileSync(targetLookupFilePath, 'utf-8')
    lookupData = JSON.parse(fileContent || '{}')
  }

  for (const [i, targetNoCase] of targets.entries()) {
    const target = targetNoCase.toLowerCase()
    if (target === '0x4dbd4fc535ac27206064b68ffcf827b0a60bab3f') {
      const arbitrumTransactionsInfo = await getDecodedBytesForArbitrum(target, signatures[i], calldatas[i])
      console.log('arbitrumTransactionsInfo:', arbitrumTransactionsInfo)
      await updateLookupFile(CometChains.arbitrum, proposalId, arbitrumTransactionsInfo)
      continue
    }
    if (target === '0x866e82a600a1414e583f7f13623f1ac5d58b0afa') {
      const baseTransactionsInfo = await getDecodedBytesForBase(target, signatures[i], calldatas[i])
      console.log('baseTransactionsInfo:', baseTransactionsInfo)
      await updateLookupFile(CometChains.base, proposalId, baseTransactionsInfo)
      continue
    }
    if (target === '0xfe5e5d361b2ad62c541bab87c45a0b9b018389a2') {
      const polygonTransactionsInfo = await getDecodedBytesForPolygon(target, signatures[i], calldatas[i])
      console.log('polygonTransactionsInfo:', polygonTransactionsInfo)
      await updateLookupFile(CometChains.polygon, proposalId, polygonTransactionsInfo)
      continue
    }

    const signature = signatures[i]
    const calldata = calldatas[i]
    const value = values?.[i]

    const transactionInfo = { target, value, signature, calldata }
    await storeTargetInfo(chain, proposalId, lookupData, transactionInfo)
  }

  fs.writeFileSync(targetLookupFilePath, JSON.stringify(lookupData, null, 2), 'utf-8')
}

/**
 * Decodes proposal target calldata into a human-readable format
 */
export const checkCompoundProposalDetails: ProposalCheck = {
  name: 'Checks Compound Proposal Details',
  async checkProposal(proposal, sim, deps: ProposalData) {
    const { targets: targets, signatures: signatures, calldatas: calldatas, values } = proposal

    const chain = CometChains.mainnet
    const proposalId = proposal.id?.toNumber() || 0

    await updateLookupFile(chain, proposalId, { targets, signatures, calldatas, values })

    return { info: [], warnings: [], errors: [] }
  },
}

async function storeTargetInfo(
  chain: CometChains,
  proposalId: number,
  targetLookupData: TargetLookupData,
  transactionInfo: { target: string; value: BigNumber; signature: string; calldata: string },
) {
  const { target, value, signature, calldata } = transactionInfo
  if (value?.toString() && value?.toString() !== '0') {
    console.error('Error Error Error Error', value)
    return
  }
  if (isRemovedFunction(target, signature)) {
    console.log(`Function ${signature} is removed from ${target} contract`)
    return
  }
  try {
    // Debugging logs
    const contractNameAndAbi = await getContractNameAndAbiFromFile(chain, target)

    if (!contractNameAndAbi.abi) {
      console.log('No ABI found for address:', target)
      throw new Error('No ABI found for address ' + target)
    }
    const iface = new Interface(contractNameAndAbi.abi)

    let decodedCalldata

    let fun: FunctionFragment
    if (signature.trim()) {
      fun = iface.getFunction(signature)
      decodedCalldata = iface._decodeParams(fun.inputs, calldata)
    } else {
      fun = iface.getFunction(calldata.slice(0, 10))
      const data = calldata.slice(10)
      console.error('data:', data)
      decodedCalldata = iface._decodeParams(fun.inputs, `0x${data}`)
    }

    const functionSignature = getFunctionSignature(fun)

    targetLookupData[target] ||= {
      contractName: contractNameAndAbi.contractName,
      functions: {},
      proposals: [],
    }
    targetLookupData[target].functions[functionSignature] ||= {
      description: functionSignature,
      descriptionTemplate: '',
      proposals: {},
    }

    if (!targetLookupData[target].proposals.includes(proposalId)) {
      targetLookupData[target].proposals.push(proposalId)
      console.log('Added proposalID to proposals array')
    } else {
      console.log('ProposalID already exists in proposals array')
    }

    console.log(`Decoded target: ${target} signature: ${functionSignature} calldata:${decodedCalldata}`)
    targetLookupData[target].functions[functionSignature].proposals[proposalId.toString()] = decodedCalldata.map(
      (data) => data.toString(),
    )
  } catch (e) {
    console.error(e)
    console.log(`Error decoding proposal: ${proposalId} target: ${target} signature: ${signature} calldata:${calldata}`)
  }
}

function isRemovedFunction(target: string, signature: string) {
  const removedFunctions: { [target: string]: string[] } = {
    '0x70e36f6bf80a52b3b46b3af8e106cc0ed743e8e4': ['_setImplementation(address,bool,bytes)'],
    '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643': ['_setImplementation(address,bool,bytes)'],
    '0xface851a4921ce59e912d19329929ce6da6eb0c7': ['_setImplementation(address,bool,bytes)'],
    '0x12392f67bdf24fae0af363c24ac620a2f67dad86': ['_setImplementation(address,bool,bytes)'],
    '0x35a18000230da775cac24873d00ff85bccded550': ['_setImplementation(address,bool,bytes)'],
    '0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9': ['_setImplementation(address,bool,bytes)'],
    '0xccf4429db6322d5c611ee964527d42e5d685dd6a': ['_setImplementation(address,bool,bytes)'],
    '0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b': [
      '_setPendingImplementation(address)',
      '_setCompSpeed(address,uint256)',
      '_sweep(address)',
    ],
    '0xc0da02939e1441f497fd74f78ce7decb17b66529': ['_setImplementation(address)'],
    '0x95b4ef2869ebd94beb4eee400a99824bf5dc325b': ['_setImplementation(address,bool,bytes)'],
    '0x7713dd9ca933848f6819f38b8352d9a15ea73f67': ['_setImplementation(address,bool,bytes)'],
    '0xe65cdb6479bac1e22340e4e755fae7e509ecd06c': ['_setImplementation(address,bool,bytes)'],
    '0x80a2ae356fc9ef4305676f7a3e2ed04e12c33946': ['_setImplementation(address,bool,bytes)'],
    '0x4b0181102a0112a2ef11abee5563bb4a3176c9d7': ['_setImplementation(address,bool,bytes)'],
    '0x041171993284df560249b57358f931d9eb7b925d': ['_setImplementation(address,bool,bytes)'],
  }
  return removedFunctions[target]?.includes(signature)
}
