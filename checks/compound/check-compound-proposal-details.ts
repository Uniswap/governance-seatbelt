import { ProposalCheck, ProposalData, ProposalEvent, TenderlyContract } from '@/types'
import { Interface, AbiCoder, FunctionFragment } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import fs from 'fs'
import mftch, { FETCH_OPT } from 'micro-ftch'
// @ts-ignore
const fetchUrl = mftch.default

interface TargetLookupData {
  [address: string]: {
    contractName: string
    functions: {
      [functionName: string]: {
        description: string
        descriptionTemplate: string
        proposals: {
          [proposalNumber: string]: string[]
        }
      }
    }
    proposals: number[]
  }
}

interface ExecuteTransactionsInfo {
  targets: string[]
  signatures: string[]
  calldatas: string[]
  values: BigNumber[]
}

async function updateLookupFile(chain: string, proposalId: number, transactions: ExecuteTransactionsInfo) {
  const { targets, signatures, calldatas, values } = transactions

  const targetLookupFilePath = `./checks/compound/lookup/${chain}TargetLookup.json`
  let lookupData: TargetLookupData = {}

  if (fs.existsSync(targetLookupFilePath)) {
    const fileContent = fs.readFileSync(targetLookupFilePath, 'utf-8')
    lookupData = JSON.parse(fileContent || '{}')
  }

  for (const [i, target] of targets.entries()) {
    if (target === '0x4dbd4fc535ac27206064b68ffcf827b0a60bab3f') {
      // arbitrum
      continue
    }
    if (target === '0x866e82a600a1414e583f7f13623f1ac5d58b0afa') {
      await updateLookupFile('base', proposalId, await getDecodedBytesForBase(target, signatures[i], calldatas[i]))
      continue
    }
    if (target === '0xfe5e5d361b2ad62c541bab87c45a0b9b018389a2') {
      // polygon
      continue
    }

    const signature = signatures[i]
    const calldata = calldatas[i]
    const value = values?.[i]

    const transactionInfo = { target: target.toLowerCase(), value, signature, calldata }
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

    const chain = 'mainnet'
    const proposalId = proposal.id?.toNumber() || 0

    await updateLookupFile(chain, proposalId, { targets, signatures, calldatas, values })

    return { info: [], warnings: [], errors: [] }
  },
}

function getFunctionSignature(fun: FunctionFragment) {
  return `${fun.name}(${fun.inputs.map((input) => input.type).join(',')})`
}

async function storeTargetInfo(
  chain: string,
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

    const abiCoder = new AbiCoder()

    if (functionSignature.startsWith('sendMessageToChild')) {
      const parsedDataToBridge = decodedCalldata.at(1).toString()
      console.log('Decoded data to bridge:', parsedDataToBridge)
      const decoded = abiCoder.decode(['address[]', 'uint256[]', 'string[]', 'bytes[]'], parsedDataToBridge)
      console.log(
        'Decoded data to bridge:',

        decoded.map((data) => data),
      )
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

async function getContractNameAndAbiFromFile(chain: string, addr: string) {
  const address = addr.toLowerCase()
  // read abi from file in contracts folder
  const abiFilePath = getContractInfoFilePath(chain, address)
  if (fs.existsSync(abiFilePath)) {
    const fileContent = fs.readFileSync(abiFilePath, 'utf-8')
    const abiFile = JSON.parse(fileContent)
    return { abi: abiFile.abi, contractName: abiFile.contractName }
  } else {
    await storeContractNameAndAbi(chain, address)
    return getContractNameAndAbiFromFile(chain, address)
  }
}
async function storeContractNameAndAbi(chain: string, addr: string) {
  const address = addr.toLowerCase()
  const { contractName, abi } = await getContractNameAndAbi(address)
  const abiFilePath = getContractInfoFilePath(chain, address)
  const abiFileContent = JSON.stringify({ abi, contractName, address }, null, 2)
  fs.writeFileSync(abiFilePath, abiFileContent, 'utf-8')
}
async function getContractNameAndAbi(address: string) {
  // Add delay to avoid rate limiting from etherscan api
  await delay(2000)
  console.log('Fetching contract name and ABI for address:', address)
  const contractResponse = await fetchUrl(
    `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${address}&apikey=${process.env.ETHERSCAN_API_KEY}`,
  )

  const contractResult = contractResponse.result[0]

  if (contractResult.Implementation) {
    const implResponse = await fetchUrl(
      `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${contractResult.Implementation}&apikey=${process.env.ETHERSCAN_API_KEY}`,
    )
    const implResult = implResponse.result[0]

    const abi = implResult.ABI
    if (!abi) {
      console.log('No ABI found for address:', address, implResponse)
      throw new Error('No ABI found for address ' + address)
    }
    return {
      contractName: implResult.ContractName,
      abi: abi,
    }
  } else {
    const abi = contractResult.ABI
    if (!abi) {
      console.log('No ABI found for address:', address, contractResponse)
      throw new Error('No ABI found for address ' + address)
    }
    return {
      contractName: contractResult.ContractName,
      abi: abi,
    }
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getContractInfoFilePath(chain: string, address: string) {
  return `./checks/compound/contracts/${chain}/${address}.json`
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

async function getDecodedBytesForArbitrum(
  target: string,
  signature: string,
  calldata: string,
): Promise<ExecuteTransactionsInfo> {
  const contractNameAndAbi = await getContractNameAndAbiFromFile('mainnet', target)
  const iface = new Interface(contractNameAndAbi.abi)
  const fun = iface.getFunction(signature)
  const decodedCalldata = iface._decodeParams(fun.inputs, calldata)
  const functionSignature = getFunctionSignature(fun)
  if (functionSignature !== 'createRetryableTicket(address,uint256,uint256,address,address,uint256,uint256,bytes)') {
    throw new Error('Function signature is not createRetryableTicket')
  }

  const parsedDataToBridge = decodedCalldata.at(7).toString()
  const abiCoder = new AbiCoder()
  const decoded = abiCoder.decode(['address[]', 'uint256[]', 'string[]', 'bytes[]'], parsedDataToBridge)

  return {
    targets: (decoded.at(0) as string[]).map((target) => target.toLowerCase()),
    values: (decoded.at(1) as BigNumber[]).map((value) => value),
    signatures: (decoded.at(2) as string[]).map((signature) => signature.toLowerCase()),
    calldatas: (decoded.at(3) as string[]).map((calldata) => calldata),
  }
}

async function getDecodedBytesForBase(
  target: string,
  signature: string,
  calldata: string,
): Promise<ExecuteTransactionsInfo> {
  const contractNameAndAbi = await getContractNameAndAbiFromFile('mainnet', target)
  const iface = new Interface(contractNameAndAbi.abi)
  const fun = iface.getFunction(signature)
  const decodedCalldata = iface._decodeParams(fun.inputs, calldata)
  const functionSignature = getFunctionSignature(fun)
  if (functionSignature !== 'sendMessage(address,bytes,uint32)') {
    throw new Error('Function signature is not sendMessage')
  }

  const parsedDataToBridge = decodedCalldata.at(1).toString()
  const abiCoder = new AbiCoder()
  const decoded = abiCoder.decode(['address[]', 'uint256[]', 'string[]', 'bytes[]'], parsedDataToBridge)

  return {
    targets: (decoded.at(0) as string[]).map((target) => target.toLowerCase()),
    values: (decoded.at(1) as BigNumber[]).map((value) => value),
    signatures: (decoded.at(2) as string[]).map((signature) => signature.toLowerCase()),
    calldatas: (decoded.at(3) as string[]).map((calldata) => calldata),
  }
}
async function getDecodedBytesForPolygon(
  target: string,
  signature: string,
  calldata: string,
): Promise<ExecuteTransactionsInfo> {
  const contractNameAndAbi = await getContractNameAndAbiFromFile('mainnet', target)
  const iface = new Interface(contractNameAndAbi.abi)
  const fun = iface.getFunction(signature)
  const decodedCalldata = iface._decodeParams(fun.inputs, calldata)
  const functionSignature = getFunctionSignature(fun)
  if (functionSignature !== 'sendMessageToChild(address,bytes)') {
    throw new Error('Function signature is not sendMessageToChild')
  }

  const parsedDataToBridge = decodedCalldata.at(1).toString()
  const abiCoder = new AbiCoder()
  const decoded = abiCoder.decode(['address[]', 'uint256[]', 'string[]', 'bytes[]'], parsedDataToBridge)

  return {
    targets: (decoded.at(0) as string[]).map((target) => target.toLowerCase()),
    values: (decoded.at(1) as BigNumber[]).map((value) => value),
    signatures: (decoded.at(2) as string[]).map((signature) => signature.toLowerCase()),
    calldatas: (decoded.at(3) as string[]).map((calldata) => calldata),
  }
}
