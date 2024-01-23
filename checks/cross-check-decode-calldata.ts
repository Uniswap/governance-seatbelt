import { ProposalCheck, ProposalData } from '@/types'
import { Interface, AbiCoder } from '@ethersproject/abi'
import fs from 'fs'
import mftch, { FETCH_OPT } from 'micro-ftch'
// @ts-ignore
const fetchUrl = mftch.default

interface LookupData {
  [address: string]: {
    contractName: string
    functions: {
      [functionName: string]: {
        description: string
        descriptionTemplate: string
        proposals: {
          [proposalNumber: string]: string
        }
      }
    }
    proposals: number[]
  }
}

/**
 * Decodes proposal target calldata into a human-readable format
 */
export const crossCheckDecodeCalldata: ProposalCheck = {
  name: 'Decodes target calldata into a human-readable format',
  async checkProposal(proposal, sim, deps: ProposalData) {
    const { targets: targets, signatures: signatures, calldatas: calldatas } = proposal

    const proposalID = proposal.id?.toNumber() || 0

    const { contracts } = sim
    const targetLookupFilePath = './lookup/verifyLookup.json'
    let lookupData: LookupData = {}

    if (fs.existsSync(targetLookupFilePath)) {
      const fileContent = fs.readFileSync(targetLookupFilePath, 'utf-8')
      lookupData = JSON.parse(fileContent)
    }

    for (const [i, target] of targets.entries()) {
      try {
        const functionName = signatures[i]
        const calldata = calldatas[i]

        let matchingContract = contracts.find((contract) => contract.address === target)
        lookupData[target] ||= {
          contractName: matchingContract?.contract_name || 'Unknown Contract Name',
          functions: {},
          proposals: [],
        }
        lookupData[target].functions[functionName] ||= {
          description: functionName,
          descriptionTemplate: '',
          proposals: {},
        }

        // Debugging logs
        const abi = await getContractAbiFromFile(target)

        if (!abi) {
          console.log('No ABI found for address:', target)
          throw new Error('No ABI found for address ' + target)
        }
        const iface = new Interface(abi)

        const fun = iface.getFunction(functionName)
        const parsedData = iface._decodeParams(fun.inputs, calldata)
        // const parsedData = iface.decodeFunctionData(functionName, callData)
        console.log('target:', target)
        console.log('function:', functionName)
        console.log(
          'Decoded data:',
          parsedData.map((data) => data.toString()),
        )

        const abiCoder = new AbiCoder()

        if (functionName.startsWith('sendMessageToChild')) {
          const parsedDataToBridge = parsedData.at(1).toString()
          console.log('Decoded data to bridge:', parsedDataToBridge)
          const decoded = abiCoder.decode(['address[]', 'uint256[]', 'string[]', 'bytes[]'], parsedDataToBridge)
          console.log(
            'Decoded data to bridge:',

            decoded.map((data) => data),
          )
        }

        if (!lookupData[target].proposals.includes(proposalID)) {
          lookupData[target].proposals.push(proposalID)
          console.log('Added proposalID to proposals array')
        } else {
          console.log('ProposalID already exists in proposals array')
        }

        lookupData[target].functions[functionName].proposals[proposalID.toString()] = calldata
        lookupData[target].contractName = matchingContract?.contract_name || 'Unknown Contract Name'
      } catch (e) {
        console.log('Error decoding calldata:', targets[i], signatures[i], calldatas[i])
      }
    }

    fs.writeFileSync(targetLookupFilePath, JSON.stringify(lookupData, null, 2), 'utf-8')

    return { info: [], warnings: [], errors: [] }
  },
}

async function getContractAbiFromFile(addr: string) {
  const address = addr.toLowerCase()
  // read abi from file in contracts folder
  const abiFilePath = `./contracts/${address}.json`
  if (fs.existsSync(abiFilePath)) {
    const fileContent = fs.readFileSync(abiFilePath, 'utf-8')
    const abiFile = JSON.parse(fileContent)
    return abiFile.abi
  } else {
    await storeContractNameAndAbi(address)
    return getContractAbiFromFile(address)
  }
}
async function storeContractNameAndAbi(addr: string) {
  const address = addr.toLowerCase()
  const { contractName, abi } = await getContractNameAndAbi(address)
  const abiFilePath = `./contracts/${address}.json`
  const abiFileContent = JSON.stringify({ abi, contractName, address }, null, 2)
  fs.writeFileSync(abiFilePath, abiFileContent, 'utf-8')
}
async function getContractNameAndAbi(address: string) {
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
