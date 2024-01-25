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

/**
 * Decodes proposal target calldata into a human-readable format
 */
export const checkCompoundProposalDetails: ProposalCheck = {
  name: 'Checks Compound Proposal Details',
  async checkProposal(proposal, sim, deps: ProposalData) {
    const { targets: targets, signatures: signatures, calldatas: calldatas, values } = proposal

    const targetLookupFilePath = './checks/compound/lookup/mainnetTargetLookup.json'
    let lookupData: TargetLookupData = {}

    if (fs.existsSync(targetLookupFilePath)) {
      const fileContent = fs.readFileSync(targetLookupFilePath, 'utf-8')
      lookupData = JSON.parse(fileContent)
    }

    for (const [i, target] of targets.entries()) {
      const signature = signatures[i]
      const calldata = calldatas[i]
      const value = values?.[i]

      const proposalId = proposal.id?.toNumber() || 0
      const transactionInfo = { target, value, signature, calldata }
      await storeTargetInfo(proposalId, lookupData, 'mainnet', transactionInfo)
    }

    fs.writeFileSync(targetLookupFilePath, JSON.stringify(lookupData, null, 2), 'utf-8')

    return { info: [], warnings: [], errors: [] }
  },
}

async function storeTargetInfo(
  proposalId: number,
  targetLookupData: TargetLookupData,
  chain: string,
  transactionInfo: {
    target: string
    value: BigNumber
    signature: string // can be empty string
    calldata: string
  },
) {
  const { target, value, signature, calldata } = transactionInfo
  if (value?.toString() && value?.toString() !== '0') {
    console.error('Error Error Error Error', value)
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

    const functionSignature = `${fun.name}(${fun.inputs.map((input) => input.type).join(',')})`

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
  }

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

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getContractInfoFilePath(chain: string, address: string) {
  return `./checks/compound/contracts/${chain}/${address}.json`
}
