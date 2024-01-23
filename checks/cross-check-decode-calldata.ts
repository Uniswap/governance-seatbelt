import { abis } from './../abis/abis'
import { ProposalCheck, ProposalData } from '@/types'
import { Interface, AbiCoder } from '@ethersproject/abi'
import fs from 'fs'

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
    const { targets: addresses, signatures: functions, calldatas: calldata } = proposal

    const proposalID = proposal.id?.toNumber() || 0

    const { contracts } = sim
    const targetLookupFilePath = './lookup/verifyLookup.json'
    let lookupData: LookupData = {}

    if (fs.existsSync(targetLookupFilePath)) {
      const fileContent = fs.readFileSync(targetLookupFilePath, 'utf-8')
      lookupData = JSON.parse(fileContent)
    }

    for (let i = 0; i < addresses.length; i++) {
      const target = addresses[i]
      const functionName = functions[i]
      const callData = calldata[i]

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
      const abi = abis[target.toLowerCase()]

      if (!abi) {
        console.log('No ABI found for address:', target)
        throw new Error('No ABI found for address ' + target)
      }
      const iface = new Interface(abi.abi)

      const fun = iface.getFunction(functionName)
      const parsedData = iface._decodeParams(fun.inputs, callData)
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

      lookupData[target].functions[functionName].proposals[proposalID.toString()] = callData
      lookupData[target].contractName = matchingContract?.contract_name || 'Unknown Contract Name'
    }

    fs.writeFileSync(targetLookupFilePath, JSON.stringify(lookupData, null, 2), 'utf-8')

    return { info: [], warnings: [], errors: [] }
  },
}
