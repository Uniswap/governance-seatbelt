import { FunctionFragment } from '@ethersproject/abi'
import fs from 'fs'
import mftch from 'micro-ftch'
import { CometChains } from './compound-types'
// @ts-ignore
const fetchUrl = mftch.default

export async function getContractNameAndAbiFromFile(chain: CometChains, addr: string) {
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

async function storeContractNameAndAbi(chain: CometChains, addr: string) {
  const address = addr.toLowerCase()
  const { contractName, abi } = await getContractNameAndAbi(chain, address)
  const abiFilePath = getContractInfoFilePath(chain, address)
  const abiFileContent = JSON.stringify({ abi, contractName, address }, null, 2)
  fs.writeFileSync(abiFilePath, abiFileContent, 'utf-8')
}

async function getContractNameAndAbi(chain: CometChains, address: string) {
  console.log(`Fetching contract name and ABI for address: ${address} on chain: ${chain}...`)
  // Add delay to avoid rate limiting from etherscan api
  await delay(2000)
  console.log('Fetching contract name and ABI for address:', address)
  const contractResponse = await fetchUrl(getExplorerApiUrl(chain, address))

  const contractResult = contractResponse.result[0]

  if (contractResult.Implementation) {
    const implResponse = await fetchUrl(getExplorerApiUrl(chain, contractResult.Implementation))
    const implResult = implResponse.result[0]

    const abi = implResult.ABI
    if (!abi) {
      console.log('No ABI found for address:', address, implResponse)
      throw new Error('No ABI found for address ' + address)
    }

    const contractNameAndAbi = {
      contractName: implResult.ContractName,
      abi: abi,
    }
    console.log(`Found contract name and ABI for address: ${address} on chain: ${chain} :`, contractNameAndAbi)
    return contractNameAndAbi
  } else {
    const abi = contractResult.ABI
    if (!abi) {
      console.log('No ABI found for address:', address, contractResponse)
      throw new Error('No ABI found for address ' + address)
    }
    const contractNameAndAbi = {
      contractName: contractResult.ContractName,
      abi: abi,
    }
    console.log(`Found contract name and ABI for address: ${address} on chain: ${chain} :`, contractNameAndAbi)
    return contractNameAndAbi
  }
}

function getContractInfoFilePath(chain: CometChains, address: string) {
  return `./checks/compound/contracts/${chain}/${address}.json`
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getExplorerApiUrl(chain: CometChains, address: string) {
  if (chain === 'mainnet') {
    return `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${address}&apikey=${process.env.ETHERSCAN_API_KEY}`
  } else if (chain === 'polygon') {
    return `https://api.polygonscan.com/api?module=contract&action=getsourcecode&address=${address}&apikey=${process.env.POLYGONSCAN_API_KEY}`
  } else if (chain === 'arbitrum') {
    return `https://api.arbiscan.io/api?module=contract&action=getsourcecode&address=${address}&apikey=${process.env.ARBITRUMSCAN_API_KEY}`
  } else if (chain === 'base') {
    return `https://api.basescan.org/api?module=contract&action=getsourcecode&address=${address}&apikey=${process.env.BASESCAN_API_KEY}`
  } else {
    throw new Error('Unknown chain: ' + chain)
  }
}

export function getFunctionSignature(fun: FunctionFragment) {
  return `${fun.name}(${fun.inputs.map((input) => input.type).join(',')})`
}
