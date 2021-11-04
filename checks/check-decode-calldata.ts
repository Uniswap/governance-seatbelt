import { ABI, FourByteResponse, ProposalCheck } from '../types'
import { Contract, utils } from 'ethers'
import { fetchJson } from '@ethersproject/web'
import { getAbi } from '../utils/clients/etherscan'
import { provider } from '../utils/clients/ethers'
import { fetchTokenMetadata } from '../utils/contracts/erc20'

const { formatUnits, keccak256, toUtf8Bytes } = utils

export const checkDecodeCalldata: ProposalCheck = {
  name: 'Decode calldata of each executed call',
  async checkProposal(proposal, tx) {
    const info: string[] = []
    for (let i = 0; i < proposal.calldatas.length; i += 1) {
      const target = proposal.targets[i]
      const calldata = proposal.calldatas[i]
      const value = proposal.values[i]
      const sig = proposal.signatures[i]

      // Determine if the function signature is included in the calldata
      // https://github.com/compound-finance/compound-protocol/blob/6548ec3e8c733d18cd4bdb2c21197f666f828f35/contracts/Timelock.sol#L92-L96
      const fullCalldata =
        sig.length === 0 ? calldata : `${keccak256(toUtf8Bytes(sig)).slice(0, 10)}${calldata.replace('0x', '')}`

      // Get as detailed of a function signature as possible
      const targetSelector = fullCalldata.slice(0, 10)
      const matchingSig = await getFunctionSignature(target, targetSelector, sig)

      // Decode the calldata based on the function signature
      if (matchingSig) {
        info.push(await prettifyCalldata(target, matchingSig, fullCalldata))
      } else {
        const msg = `On contract ${target}, call ${fullCalldata} (could not decode calldata because no function signature could be found for this call)`
        info.push(msg)
      }
    }

    return { info, warnings: [], errors: [] }
  },
}

/**
 * @notice Returns the function signature for the provided selector, by first checking the ABI of `target`.
 * @param target Address being called. Used to query for an implementation contract to maximize ABI information
 * when `target` is a proxy
 * @param selector The selector we want a function signature for
 * @param sig Optional function signature. If it must be normalized so it can be directly hashed to the selector.
 * Because of that requirement (which stems from the fact that that's how this parameter must be formatted when
 * used in an on-chain proposal), this input argument is only used as a backup if Etherscan does not have
 * the ABI for `target`. See @dev tag for more info
 * @dev Even if a proposal has `sig` defined, we don't use it by default because this is the normalized
 * function signature, meaning it won't have parameter names. We want to get parameter names if possible
 * to maximize the information we can obtain. Therefore we first query Etherscan for the ABI. If the
 * contract is not verified, we use the provided `proposal.signature`, i.e. `sig` if available. If not
 * specified, we fall back to querying 4byte.directory as the last attempt
 */
async function getFunctionSignature(target: string, selector: string, sig: string = ''): Promise<string | null> {
  if (selector.length !== 10) throw new Error(`Invalid function selector: ${selector}`)

  // Helper method to return a function signature which has been formatted by ethers
  const formatSignature = (sig: string) => new utils.Interface([sig]).fragments[0].format('full')

  // Helper method to loop through ABIs to find a matching selector
  const checkAbi = (abi: ABI, selector: string): string | null => {
    const iface = new utils.Interface(abi)
    for (const fragment of iface.fragments) {
      if (fragment.type !== 'function') continue
      if (fragment.type === 'function' && iface.getSighash(fragment) === selector) return fragment.format('full')
    }
    return null
  }

  // First try the ABI of the target address
  const abi = (await getAbi(target)) as ABI
  if (checkAbi(abi, selector)) return checkAbi(abi, selector)

  // Next check try any implementation contracts that exist if this is a proxy
  const proxyAbis = [
    'function implementation() external view returns (address)',
    'function comptrollerImplementation() external view returns (address)',
  ]
  for (const abi of proxyAbis) {
    try {
      const targetContract = new Contract(target, [abi], provider)
      const implementation = await targetContract[targetContract.interface.fragments[0].format()]()
      const newAbi = (await getAbi(implementation)) as ABI
      if (checkAbi(newAbi, selector)) return checkAbi(newAbi, selector)
    } catch (err) {
      // error is thrown if the method does not exist, so in that case ignore the error and continue
    }
  }

  // If a sig is provided, we fall back to that and return it in the standard ethers form for consistency.
  // Based on how this method is used, any `sig` provided is already normalized so it can be hashed into
  // a function signature on chain
  if (sig) return formatSignature(`function ${sig}`)

  // Lastly, we check 4byte.directory. If results are found, we arbitrarily choose to return the last one in
  // the array, which corresponds to the first one added to 4byte
  const url = `https://www.4byte.directory/api/v1/signatures/?hex_signature=${selector}`
  const response = (await fetchJson(url)) as FourByteResponse
  if (response.count === 0) return null // no signature found

  // `partialSig` is of the form `_setVotingDelay(uint256)`, which is not compatible with the ethers human-readable
  // ABI format, so we must format it to be compatible by pre-pending it with "function ""
  const partialSig = response.results[response.results.length - 1].text_signature
  return formatSignature(`function ${partialSig}`)
}

/**
 * @notice Given a human-readable function `sig` and the provided `calldata`, format the
 * call into a human-readable format
 */
async function prettifyCalldata(target: string, sig: string, calldata: string) {
  const iface = new utils.Interface([sig])
  const fragment = iface.fragments[0].format()
  const res = iface.decodeFunctionData(fragment, calldata)
  const isTokenAction = ['0x095ea7b3', '0xba45b0b8', '0x23b872dd'].includes(sig) && sig.includes('transfer')

  const { name, symbol, decimals } = isTokenAction
    ? await fetchTokenMetadata(target)
    : { name: null, symbol: null, decimals: 0 }

  switch (iface.getSighash(fragment)) {
    // --- Custom descriptions for common methods ---
    // Custom descriptions add the word "formatted" to the end so it's clear that this is a custom error
    // message and all numbers with decimals have already been parsed to a human readable format
    case '0x095ea7b3':
      // ERC-20 approve
      return `${target} approves ${res[0]} to spend ${formatUnits(res[1], decimals)} ${symbol} (formatted)`
    case '0xba45b0b8':
      // ERC-20 transfer
      return `${target} transfers ${formatUnits(res[1], decimals)} ${symbol} to ${target} (formatted)`
    case '0x23b872dd':
      // ERC-20 transferFrom
      return `${target} transfers ${formatUnits(res[2], decimals)} ${symbol} from ${res[0]} to ${res[1]} (formatted)`

    // --- Generic handling ---
    // Generic descriptions add the word "generic" to the end so it's clear this is a standardized
    // description and numbers with decimals have NOT been parsed to human readable format
    default:
      // Setup generic description
      let description = `On contract \`${target}\`, call \`${sig}\` with arguments `

      // If we have named arguments in the function signature, use them
      const namedKeys = Object.keys(res).filter((key) => isNaN(Number(key)))
      if (namedKeys.length > 0) {
        namedKeys.forEach((key) => (description += `\`${key} = ${res[key].toString()}\`, `))
      } else {
        const numberedKeys = Object.keys(res).filter((key) => !isNaN(Number(key)))
        numberedKeys.forEach((key) => (description += `\`${res[key].toString()}\`, `))
      }

      // Remove whitespace and trailing commas before returning the description
      const trimmed = description.trim()
      const noCommas = trimmed.endsWith(',') ? trimmed.slice(0, -1) : trimmed
      return `${noCommas} (generic)`
  }
}
