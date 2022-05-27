import { AllCheckResults, ProposalCreatedEvent, TenderlySimulation } from '../types'
import { Block } from '@ethersproject/abstract-provider'
import { BigNumber } from 'ethers'
import { getProposalMetadata } from '../utils/clients/ipfs'
import { IPFS_GATEWAY } from '../utils/constants'

function toMessageList(header: string, errors: string[]): string {
  return errors.length > 0 ? `${header}:\n` + errors.map((msg) => `- ${msg}`).join('\n') : ''
}

/**
 * Summarize the results of a specific check
 * @param errors the errors returned by the check
 * @param warnings the warnings returned by the check
 * @param name the descriptive name of the check
 */
function toCheckSummary({ result: { errors, warnings, info }, name }: AllCheckResults[string]): string {
  const status = errors.length === 0 ? (warnings.length === 0 ? '✅ Passed' : '⚠️ Passed with warnings') : '❌ Failed'

  return `#### ${name} ${status}
  
${toMessageList('Errors', errors)}

${toMessageList('Warnings', warnings)}

${toMessageList('Info', info)}
`
}

/**
 * Turns a plaintext address into a link to etherscan page of that address
 * @param address to be linked
 * @param code whether to link to the code tab
 */
function toAddressLink(address: string, code: boolean = false): string {
  return `[${address}](https://etherscan.io/address/${address}${code ? '#code' : ''})`
}

/**
 * Block quotes a string in markdown
 * @param str string to block quote
 */
function blockQuote(str: string): string {
  return str
    .split('\n')
    .map((s) => '> ' + s)
    .join('\n')
}

/**
 * Format a block timestamp which is always in epoch seconds to a human readable string
 * @param blockTimestamp the block timestamp to format
 */
function formatTime(blockTimestamp: number): string {
  return `${new Date(blockTimestamp * 1000).toLocaleString('en-US', {
    timeZone: 'America/New_York',
  })} ET`
}

/**
 * Estimate the timestamp of a future block number
 * @param current the current block
 * @param block the future block number
 */
function estimateTime(current: Block, block: BigNumber): number {
  if (block.lt(current.number)) throw new Error('end block is less than current')
  return block.sub(current.number).mul(13).add(current.timestamp).toNumber()
}

function humanReadableExecutor(executor: string) {
  if (executor === '0xEE56e2B3D491590B5b31738cC34d5232F378a8D5') return 'Short executor'
  if (executor === '0x61910EcD7e8e942136CE7Fe7943f956cea1CC2f7') return 'Long executor'
  return 'unknown executor'
}

/**
 * Produce a markdown report summarizing the result of all the checks for a given proposal
 * @param blocks the relevant blocks for the proposal
 * @param proposal
 * @param checks
 */
export async function toProposalReport(
  blocks: { current: Block; start: Block | null; end: Block | null },
  proposal: ProposalCreatedEvent,
  checks: AllCheckResults,
  sim: TenderlySimulation
): Promise<string> {
  const { id, creator, targets, endBlock, startBlock, ipfsHash, executor } = proposal
  const ipfsMeta = await getProposalMetadata(ipfsHash, IPFS_GATEWAY)

  return `## ${ipfsMeta.title}

_Updated as of block [${blocks.current.number}](https://etherscan.io/block/${blocks.current.number}) at ${formatTime(
    blocks.current.timestamp
  )}_

- ID: ${id}
- Proposer: ${toAddressLink(creator)}
- Start Block: ${startBlock} (${
    blocks.start ? formatTime(blocks.start.timestamp) : formatTime(estimateTime(blocks.current, startBlock))
  })
- End Block: ${endBlock} (${
    blocks.end ? formatTime(blocks.end.timestamp) : formatTime(estimateTime(blocks.current, endBlock))
  })
- Targets: ${targets.map((target) => toAddressLink(target, true)).join('; ')}
- Executor:  ${toAddressLink(executor)} (${humanReadableExecutor(executor)})
- Simulation: [https://dashboard.tenderly.co/me/simulator/${
    sim.simulation.id
  }](https://dashboard.tenderly.co/me/simulator/${sim.simulation.id})

<details>
  <summary>Proposal text</summary>

${ipfsMeta.description}
</details>

### Checks
${Object.keys(checks)
  .map((checkId) => toCheckSummary(checks[checkId]))
  .join('\n')}`
}
