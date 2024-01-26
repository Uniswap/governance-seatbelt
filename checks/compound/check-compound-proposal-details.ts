import fs from 'fs'
import mftch from 'micro-ftch'
import { CheckResult, ProposalCheck, ProposalData } from './../../types'
import { getContractNameAndAbiFromFile, getFunctionFragmentAndDecodedCalldata, getFunctionSignature } from './abi-utils'
import {
  CometChains,
  ExecuteTransactionInfo,
  ExecuteTransactionsInfo,
  TargetLookupData,
  TransactionMessage,
} from './compound-types'
import { getDecodedBytesForChain, l2Bridges } from './l2-utils'
import { formattersLookup } from './transaction-formatter'
import { BigNumber, Contract, constants } from 'ethers'
import { provider } from '../../utils/clients/ethers'
// @ts-ignore
const fetchUrl = mftch.default

/**
 * Decodes proposal target calldata into a human-readable format
 */
export const checkCompoundProposalDetails: ProposalCheck = {
  name: 'Checks Compound Proposal Details',
  async checkProposal(proposal, sim, deps: ProposalData) {
    const { targets: targets, signatures: signatures, calldatas: calldatas, values } = proposal

    const chain = CometChains.mainnet
    const proposalId = proposal.id?.toNumber() || 0

    const checkResults = await updateLookupFile(chain, proposalId, { targets, signatures, calldatas, values })

    return checkResults
  },
}

async function updateLookupFile(
  chain: CometChains,
  proposalId: number,
  transactions: ExecuteTransactionsInfo
): Promise<CheckResult> {
  const { targets, signatures, calldatas, values } = transactions

  const targetLookupFilePath = `./checks/compound/lookup/${chain}TargetLookup.json`
  let lookupData: TargetLookupData = {}

  if (fs.existsSync(targetLookupFilePath)) {
    const fileContent = fs.readFileSync(targetLookupFilePath, 'utf-8')
    lookupData = JSON.parse(fileContent || '{}')
  }

  const checkResults: CheckResult = { info: [], warnings: [], errors: [] }

  for (const [i, targetNoCase] of targets.entries()) {
    const target = targetNoCase.toLowerCase()
    const transactionInfo: ExecuteTransactionInfo = {
      target,
      signature: signatures[i],
      calldata: calldatas[i],
      value: values?.[i],
    }
    if (Object.keys(l2Bridges).includes(target)) {
      const cometChain = l2Bridges[target]
      const l2TransactionsInfo = await getDecodedBytesForChain(cometChain, proposalId, transactionInfo)
      const l2CheckResults = await updateLookupFile(cometChain, proposalId, l2TransactionsInfo)
      const l2Messages = nestCheckResultsForChain(cometChain, l2CheckResults)
      console.log('l2Messages:', l2Messages)
      pushMessageToCheckResults(checkResults, { info: l2Messages })
      continue
    }

    await storeTargetInfo(chain, proposalId, lookupData, transactionInfo)
    const message = await getTransactionMessages(chain, proposalId, lookupData, transactionInfo)
    console.log('message:', message)
    pushMessageToCheckResults(checkResults, message)
  }

  fs.writeFileSync(targetLookupFilePath, JSON.stringify(lookupData, null, 2), 'utf-8')

  return checkResults
}

function pushMessageToCheckResults(checkResults: CheckResult, message: TransactionMessage) {
  if (message.info) {
    checkResults.info.push(message.info)
  } else if (message.warning) {
    checkResults.warnings.push(message.warning)
  } else if (message.error) {
    checkResults.errors.push(message.error)
  }
}

function nestCheckResultsForChain(chain: CometChains, checkResult: CheckResult): string {
  return `
### ${chain} Updates
  
${checkResult.info.join('\n')}
`
}

async function storeTargetInfo(
  chain: CometChains,
  proposalId: number,
  targetLookupData: TargetLookupData,
  transactionInfo: ExecuteTransactionInfo
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

    const { fun, decodedCalldata } = await getFunctionFragmentAndDecodedCalldata(proposalId, chain, transactionInfo)

    const functionSignature = getFunctionSignature(fun)

    targetLookupData[target] ||= {
      contractName: contractNameAndAbi.contractName,
      functions: {},
      proposals: [],
    }
    targetLookupData[target].functions[functionSignature] ||= {
      description: functionSignature,
      transactionFormatter: '',
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
      (data) => data.toString()
    )

    const secondsPerYear = 60 * 60 * 24 * 365 //seconds * minutes * hours * days
    const divisor = constants.WeiPerEther
    if (functionSignature.startsWith('setBorrowPerYearInterestRateBase')) {
      console.log('Sig', functionSignature)
      const modifiedString = functionSignature.replace(/^set(.)/, (match, p1) => p1.toLowerCase()).split('(')[0]
      console.log('Extracted function name', modifiedString)
      const { abi } = await getContractNameAndAbiFromFile(chain, decodedCalldata[0])
      const governance = new Contract(decodedCalldata[0], abi, provider)

      const prevBorrowPerSecondInterestRateBase = BigNumber.from(
        await governance.callStatic.borrowPerSecondInterestRateBase()
      )

      const prevBorrowPerYearInterestRateBase: BigNumber = prevBorrowPerSecondInterestRateBase.mul(secondsPerYear)
      console.log(`Previous BorrowPerYearInterestRateBase ${prevBorrowPerYearInterestRateBase}`)

      const newBorrowPerYearInterestRateBase: BigNumber = BigNumber.from(decodedCalldata[1])
      console.log(`New BorrowPerYearInterestRateBase: ${newBorrowPerYearInterestRateBase}`)

      const subtraction = newBorrowPerYearInterestRateBase.sub(prevBorrowPerYearInterestRateBase)
      const changeIntegerPart = subtraction.div(divisor)
      const changeRemainderPart = subtraction.mod(divisor)
      const changeFractionalPart = changeRemainderPart.toString().padStart(18, '0')
      const changeFinalResult = `${changeIntegerPart}.${changeFractionalPart}`
      // console.log(
      //   `${changeFinalResult.startsWith('-') ? 'Decrease' : 'Increase'} in Interest Rate Base: ${changeFinalResult}`
      // )
      console.log(
        `${
          subtraction.toString().startsWith('-') ? 'Decrease' : 'Increase'
        } in Interest Rate Base: ${subtraction.toString()}`
      )

      const percentage = subtraction.mul(100)
      const percentageIntegralPart = percentage.div(prevBorrowPerYearInterestRateBase)
      const percentageRemainderPart = percentage.mod(prevBorrowPerYearInterestRateBase)
      const percentageFractionalPart = percentageRemainderPart.toString().padStart(18, '0')
      const percentageResult = `${percentageIntegralPart}.${percentageFractionalPart}`
      console.log(`Percentage change in Interest Rate Base: ${percentageResult} %`)
    }
  } catch (e) {
    console.error(e)
    console.log(`Error decoding proposal: ${proposalId} target: ${target} signature: ${signature} calldata:${calldata}`)
  }
}

async function getTransactionMessages(
  chain: CometChains,
  proposalId: number,
  targetLookupData: TargetLookupData,
  transactionInfo: ExecuteTransactionInfo
): Promise<TransactionMessage> {
  const { target, value, signature, calldata } = transactionInfo
  if (value?.toString() && value?.toString() !== '0') {
    console.error('Error Error Error Error', value)
    return { error: 'Error Error Error Error' }
  }
  if (isRemovedFunction(target, signature)) {
    console.log(`Function ${signature} is removed from ${target} contract`)
    return { error: `Function ${signature} is removed from ${target} contract` }
  }

  const { fun, decodedCalldata } = await getFunctionFragmentAndDecodedCalldata(proposalId, chain, transactionInfo)

  const functionSignature = getFunctionSignature(fun)

  const transactionFormatter = targetLookupData[target].functions[functionSignature].transactionFormatter

  if (!transactionFormatter) {
    return { info: `**${target} - ${functionSignature} called with :** (${decodedCalldata.join(',')})` }
  } else {
    const [contractName, formatterName] = transactionFormatter.split('.')
    const message = await formattersLookup[contractName][formatterName](
      transactionInfo,
      decodedCalldata.map((data) => data.toString())
    )
    return { info: message }
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
