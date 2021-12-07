import { artifacts, run } from 'hardhat'
import fs from 'fs'
import EtherscanClient from '@ethercast/etherscan-client'
import { fetchJson } from '@ethersproject/web'
import { ETHERSCAN_API_KEY } from '../constants'
import { ABI, ContractSource } from '../../types'

export const etherscan = new EtherscanClient({
  apiKey: ETHERSCAN_API_KEY,
  apiUrl: 'https://api.etherscan.io/api',
})

export async function getAbi(contract: string): Promise<ABI> {
  const url = `https://api.etherscan.io/api?module=contract&action=getabi&address=${contract}&apikey=${ETHERSCAN_API_KEY}`
  const response = (await fetchJson(url)) as { status: string; message: string; result: string }
  if (response.status !== '1') throw new Error(`Error fetching ABI for ${contract}: ${response.result}`)
  return JSON.parse(response.result)
}

export async function getSourceCode(contract: string) {
  // TODO only supports when a single file is returned
  const url = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${contract}&apikey=${ETHERSCAN_API_KEY}`
  const response = (await fetchJson(url)) as { status: string; message: string; result: ContractSource[] }
  if (response.status !== '1') throw new Error(`Error fetching ABI for ${contract}: ${response.result}`)
  return response.result[0]
}

export async function compileCode(contract: string) {
  // TODO work in progress
  const code = await getSourceCode(contract)

  //  For some reason the source code object returned from Etherscan starts and ends with two braces
  code.SourceCode = code.SourceCode.replace('{{', '{').replace('}}', '}')

  // From the SourceCode field, convert the string to JSON and pull out the source code of each file
  const sourceCodes = Object.values(JSON.parse(code.SourceCode).sources).map(
    (src) => (src as { content: string; keccak256: string }).content
  )

  // Combine source code into one string and dump it to a temporary file.
  const sourceCode = sourceCodes
    .reverse() // reverse before joining to ensure contract definitions are in the correct order based on inheritance
    .join('\n')
    .replace(/import.*/g, '') // remove all import statements since we have everything in one file
    .replace(/(?<=(pragma experimental ABIEncoderV2;)[\s\S]+)\1/g, '') // only keep the first instance of pragmas: https://newbedev.com/how-to-replace-all-occurrences-of-a-string-except-the-first-one-in-javascript
    .replace(/(?<=(pragma abicoder v2;)[\s\S]+)\1/g, '')

  const tempContractFile = 'contracts/tmp.sol'
  fs.writeFileSync(tempContractFile, sourceCode)

  // Compile source code with storageLayout flag
  // TODO you cannot call the compile task this way and pass in custom settings. Probably need to create a custom
  // instance of the compiler class and call its `compile` method: https://github.com/nomiclabs/hardhat/tree/master/packages/hardhat-core/src/internal/solidity/compiler
  await run('compile', {
    solidity: {
      settings: {
        outputSelection: {
          '*': {
            '*': ['storageLayout'],
          },
        },
      },
    },
  })

  const { abi, deployedBytecode } = artifacts.readArtifactSync('ModifiedTimelock')
  fs.unlinkSync(tempContractFile)
}
