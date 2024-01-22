import { FunctionFragment, Interface } from '@ethersproject/abi'
import { getAddress } from '@ethersproject/address'
import { formatUnits } from '@ethersproject/units'
import { ProposalCheck, FluffyCall } from '../types'
import { ERC20_ABI, fetchTokenMetadata } from '../utils/contracts/erc20'
import { bullet } from '../presentation/report'
import fs from 'fs'

const ierc20 = new Interface(ERC20_ABI)
const jsonString = fs.readFileSync('./lookup/root.json', 'utf-8')
const jsonData = JSON.parse(jsonString)

interface JsonStructure {
  [network: string]: {
    [asset: string]: {
      [contract: string]: string
    }
  }
}
/**
 * Decodes proposal target calldata into a human-readable format
 */
export const checkDecodeCalldata: ProposalCheck = {
  name: 'Decodes target calldata into a human-readable format',
  async checkProposal(proposal, sim, deps) {
    let warnings: string[] = []
    // Generate the raw calldata for each proposal action
    const calldatas = proposal.signatures.map((sig, i) => {
      return sig ? `${selectorFromSig(sig)}${proposal.calldatas[i].slice(2)}` : proposal.calldatas[i]
    })

    // Find the call with that calldata and parse it
    const calls = sim.transaction.transaction_info.call_trace.calls
    const descriptions = await Promise.all(
      calldatas.map(async (calldata, i) => {
        // Find the first matching call
        let call = findMatchingCall(getAddress(deps.timelock.address), calldata, calls)
        if (!call) {
          const msg = `This transaction may have reverted: Could not find matching call for calldata ${calldata}`
          warnings.push(msg)
          return null
        }
        // Now look for any subcalls that have the same input data, since if present these are the
        // decoded calls. This often happens with proxies which aren't always decoded nicely, and
        // will show the function name as `fallback`. Therefore, we look for the deepest function
        // in the callstack with the same input data and use that to decode/prettify calldata
        call = returnCallOrMatchingSubcall(calldata, call)
        return prettifyCalldata(call, proposal.targets[i])
      })
    )

    const info = descriptions.filter((d) => d !== null).map((d) => bullet(d as string))
    return { info, warnings, errors: [] }
  },
}

// --- Helper methods ---

/**
 * Given a human readable function signature, return the function selector
 */
function selectorFromSig(sig: string): string {
  return Interface.getSighash(FunctionFragment.from(sig))
}

/**
 * Given an array of calls, find the call matching the provided from address and calldata by
 * recursively traversing all calls in the trace. This is required because the call we're looking
 * for is not always at the same depth of the call stack. If all governor `execute` calls were made
 * from an EOA this would be true, but because calls to `execute` can also be made from contracts
 * we don't know the depth of the call containing `calldata`
 */
function findMatchingCall(from: string, calldata: string, calls: any[]): FluffyCall | null {
  from = getAddress(from)
  const callMatches = (f: string, c: string) => getAddress(f) === from && c === calldata
  for (const call of calls) {
    if (callMatches(call.from, call.input)) return call
    if (call.calls) {
      const foundCall = findMatchingCall(from, calldata, call.calls)
      if (foundCall) return foundCall
    }
  }
  return null
}

/**
 * Given a call, check if any subcalls have matching calldata. If so, return the deepest call as
 * this will be the decoded call (e.g. if there are proxies the top level call with matching
 * calldata will be the fallback function)
 */
function returnCallOrMatchingSubcall(calldata: string, call: FluffyCall): FluffyCall {
  if (!call.calls || !call.calls?.length) return call
  return call.calls[0].input === calldata ? returnCallOrMatchingSubcall(calldata, call.calls[0] as FluffyCall) : call
}

/**
 * Given a call, generate a human-readable function signature
 */
function getSignature(call: FluffyCall) {
  // Return selector if call is not decoded, otherwise generate the signature
  if (!call.function_name) return call.input.slice(0, 10)
  let sig = `${call.function_name}(`
  call.decoded_input?.forEach((arg, i) => {
    if (i !== 0) sig += ', '
    sig += arg.soltype.type
    sig += arg.soltype.name ? ` ${arg.soltype.name}` : ''
  })
  sig += ')('
  call.decoded_output?.forEach((arg, i) => {
    if (i !== 0) sig += ', '
    sig += arg.soltype.type
    sig += arg.soltype.name ? ` ${arg.soltype.name}` : ''
  })
  sig += ')'
  return sig
}

/**
 * Given a target, signature, and call, generate a human-readable description
 */
function getDescription(target: string, sig: string, call: FluffyCall) {
  // console.log('Target', target)
  // console.log('Sig', sig)
  // console.log('Call', call)

  let description = ``

  if (!call.decoded_input) return `${description} \`${call.input}\` (not decoded)`
  const result = findKeyByValue(jsonData, target)

  if (call.function_name === 'deployAndUpgradeTo') {
    description += `Deploy and upgrade new implementation for ["${result?.asset}"](https://etherscan.io/address/${call.decoded_input[0].value}) `
    description += `via [${result?.contract}](https://etherscan.io/address/${target})`
  } else if (call.function_name === 'sendMessageToChild') {
    description += getMessageDecoding(call, result)
  } else {
    description = `[${result?.contract}](https://etherscan.io/address/${target}).`
    description += `\`${call.function_name}\`(["${result?.asset}"](https://etherscan.io/address/${call.decoded_input[0].value}),`
    description += `\`${call.decoded_input[1].value}\`)`
  }
  // call.decoded_input?.forEach((arg, i) => {
  //   if (i !== 0) description += ', '
  //   description += '`'
  //   description += arg.soltype.name ? `${arg.soltype.name}=` : ''
  //   description += arg.value
  //   description += '`'
  // })

  return `${description}`
}

function getMessageDecoding(call: FluffyCall, result: { network: string; asset: string; contract: string } | null) {
  let description = ''
  if (!call.decoded_input) return `${description} \`${call.input}\` (not decoded)`
  if (!call.calls) return `${description} \`${call.input}\` (not decoded)`

  // console.log('Dawood: ', call.calls[0].decoded_input)
  // description += `\`${call.function_name}\`(["cUSDCv3"](https://etherscan.io/address/${call.decoded_input[0].value}),`
  // description += `\`${call.decoded_input[1].value}\`)`

  description += `Bridge wrapped actions to Polygon with [${result?.contract}](https://polygonscan.com/address/${call.decoded_input[0].value})`

  return description
}

function findKeyByValue(
  json: JsonStructure,
  targetValue: string
): { network: string; asset: string; contract: string } | null {
  for (const networkKey in json) {
    const network = json[networkKey]

    for (const assetKey in network) {
      const asset = network[assetKey]

      for (const contractKey in asset) {
        const contractAddress = asset[contractKey]

        if (contractAddress.toLowerCase() === targetValue.toLowerCase()) {
          return { network: networkKey, asset: assetKey, contract: contractKey }
        }
      }
    }
  }
  return null
}

/**
 * Given a call, return a human-readable description of the call
 */
async function prettifyCalldata(call: FluffyCall, target: string) {
  // If this is a token action, we decode the amounts and show the token symbol
  const selector = call.input.slice(0, 10)
  const tokenSelectors = new Set([
    '0x095ea7b3', // approve(address,uint256)
    '0xa9059cbb', // transfer(address,uint256)
    '0x23b872dd', // transferFrom(address,address,uint256)
  ])
  const isTokenAction = tokenSelectors.has(selector)
  const { name, symbol, decimals } = isTokenAction
    ? await fetchTokenMetadata(call.to)
    : { name: null, symbol: null, decimals: 0 }

  switch (selector) {
    // --- Custom descriptions for common methods ---
    // Custom descriptions add the word "formatted" to the end so it's clear that this is a custom error
    // message and all numbers with decimals have already been parsed to a human readable format.
    // We decode the calldata manually instead of relying on `call.decoded_input` because it's more
    // robust. Sometimes `call.decoded_input` may be undefined when Tenderly is not familiar with a
    // given proxy pattern, but since this is known calldata we know how it should be decoded regardless.
    case '0x095ea7b3': {
      const decodedCalldata = ierc20.decodeFunctionData('approve', call.input)
      const spender = getAddress(decodedCalldata.spender)
      const amount = formatUnits(decodedCalldata.value, decimals)
      return `\`${call.from}\` approves \`${spender}\` to spend ${amount} ${symbol} (formatted)`
    }
    case '0xba45b0b8': {
      const decodedCalldata = ierc20.decodeFunctionData('transfer', call.input)
      const receiver = getAddress(decodedCalldata.to)
      const amount = formatUnits(decodedCalldata.value, decimals)
      return `\`${call.from}\` transfers \`${amount}\` ${symbol} to ${receiver} (formatted)`
    }
    case '0x23b872dd': {
      const decodedCalldata = ierc20.decodeFunctionData('transferFrom', call.input)
      const from = getAddress(decodedCalldata.from)
      const to = getAddress(decodedCalldata.to)
      const amount = formatUnits(decodedCalldata.value, decimals)
      return `\`${call.from}\` transfers \`${amount}\` ${symbol} from ${from} to ${to} (formatted)`
    }
  }

  // --- Generic handling ---
  // Generic descriptions add the word "generic" to the end so it's clear this is a standardized
  // description and numbers with decimals have NOT been parsed to human readable format
  const sig = getSignature(call)
  return getDescription(target, sig, call)
}
