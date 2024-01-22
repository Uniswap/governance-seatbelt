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

const targetLookupFilePath = './lookup/verifyLookup.json'

export function updateTargetLookup(
  addresses: string[],
  functions: string[],
  calldata: string[],
  proposalID: number
): void {
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

    lookupData[address] ||= { contractName: '', functions: {}, proposals: [] }
    lookupData[address].functions[functionName] ||= {
      description: functionName,
      descriptionTemplate: '',
      proposals: {},
    }

    if (!lookupData[address].proposals.includes(proposalID)) {
      lookupData[address].proposals.push(proposalID)
    }

    lookupData[address].functions[functionName].proposals[proposalID.toString()] = callData
  }

  fs.writeFileSync(targetLookupFilePath, JSON.stringify(lookupData, null, 2), 'utf-8')
}

// Example usage:
// const addressesArray = [
//   '0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B',
//   '0xc00e94Cb662C3520282E6f5717214004A7f26888',
//   '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77',
// ]

// const functionsArray = ['_grantComp(address,uint256)', 'approve(address,uint256)', 'depositFor(address,address,bytes)']
// const calldataArray = ['(address,uint64)', '(address,uint64)', '']
// const proposalID = 206

// updateTargetLookup(addressesArray, functionsArray, calldataArray, proposalID)
