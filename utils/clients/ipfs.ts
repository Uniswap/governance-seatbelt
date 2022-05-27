import { ProposalMetadata } from '@aave/contract-helpers'
import matter from 'gray-matter'
import { base58 } from 'ethers/lib/utils'
import fetchUrl from 'micro-ftch'

export function getLink(hash: string, gateway: string): string {
  return `${gateway}/${hash}`
}

export async function getProposalMetadata(hash: string, gateway: string): Promise<ProposalMetadata> {
  const ipfsHash = hash.startsWith('0x') ? base58.encode(Buffer.from(`1220${hash.slice(2)}`, 'hex')) : hash
  const response: ProposalMetadata = await fetchUrl(getLink(ipfsHash, gateway), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  try {
    const { content, data } = matter(response.description)

    return {
      ...response,
      ipfsHash,
      description: content,
      ...data,
    }
    // matter will error in case the proposal is not valid yaml (like on proposal 0)
    // therefore in the case of an error we just inline the complete ipfs content
  } catch (e) {
    return {
      ...response,
      ipfsHash,
      description: response?.description || (response as unknown as string),
      title: response?.title || 'title not found',
    }
  }
}
