import { ProposalCheck, ProposalData } from '@/types'
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
      const address = addresses[i]
      const functionName = functions[i]
      const callData = calldata[i]

      // if (!lookupData[address]) {
      //   lookupData[address] = {
      //     contractName: '',
      //     functions: {},
      //     proposals: [],
      //   }
      // }

      // if (!lookupData[address].functions[functionName]) {
      //   lookupData[address].functions[functionName] = {
      //     description: functionName,
      //     descriptionTemplate: '',
      //     proposals: {},
      //   }
      // }
      let matchingContract = contracts.find((contract) => contract.address === address)
      lookupData[address] ||= {
        contractName: matchingContract?.contract_name || 'Unknown Contract Name',
        functions: {},
        proposals: [],
      }
      lookupData[address].functions[functionName] ||= {
        description: functionName,
        descriptionTemplate: '',
        proposals: {},
      }

      // Debugging logs
      console.log(`Processing address: ${address}, proposalID: ${proposalID}`)
      console.log('Existing proposals:', lookupData[address].proposals)
      console.log('Existing functions proposals:', lookupData[address].functions[functionName].proposals)

      if (!lookupData[address].proposals.includes(proposalID)) {
        lookupData[address].proposals.push(proposalID)
        console.log('Added proposalID to proposals array')
      } else {
        console.log('ProposalID already exists in proposals array')
      }

      lookupData[address].functions[functionName].proposals[proposalID.toString()] = callData
      lookupData[address].contractName = matchingContract?.contract_name || 'Unknown Contract Name'
    }

    fs.writeFileSync(targetLookupFilePath, JSON.stringify(lookupData, null, 2), 'utf-8')

    return { info: [], warnings: [], errors: [] }
  },
}
