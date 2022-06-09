import { AllCheckResults, ProposalEvent } from '../types'
import { Block } from '@ethersproject/abstract-provider'
import { BigNumber } from 'ethers'

// --- Markdown helpers ---

export function bullet(text: string, level: number = 0): string {
  return `${' '.repeat(level * 4)}- ${text}`
}

export function bold(text: string): string {
  return `**${text}**`
}

export function codeBlock(text: string): string {
  // Line break, three backticks, line break, the text, line break, three backticks, line break
  return `\n\`\`\`\n${text}\n\`\`\`\n`
}

export function detailsBlock(summary: string, content: string): string {
  return `
<details>
<summary>${summary}</summary>
${content}
</details>
`
}

/**
 * Block quotes a string in markdown
 * @param str string to block quote
 */
export function blockQuote(str: string): string {
  return str
    .split('\n')
    .map((s) => '> ' + s)
    .join('\n')
}

/**
 * Turns a plaintext address into a link to etherscan page of that address
 * @param address to be linked
 * @param code whether to link to the code tab
 */
export function toAddressLink(address: string, code: boolean = false): string {
  return `[\`${address}\`](https://etherscan.io/address/${address}${code ? '#code' : ''})`
}

// -- Report formatters ---

function toMessageList(header: string, text: string[]): string {
  return text.length > 0 ? `${bold(header)}:\n\n` + text.map((msg) => `${msg}`).join('\n') : ''
}

/**
 * Summarize the results of a specific check
 * @param errors the errors returned by the check
 * @param warnings the warnings returned by the check
 * @param name the descriptive name of the check
 */
function toCheckSummary({ result: { errors, warnings, info }, name }: AllCheckResults[string]): string {
  const status = errors.length === 0 ? (warnings.length === 0 ? '✅ Passed' : '⚠️ Passed with warnings') : '❌ Failed'

  return `### ${name} ${status}

${toMessageList('Errors', errors)}

${toMessageList('Warnings', warnings)}

${toMessageList('Info', info)}
`
}

/**
 * Pulls the title out of the markdown description, from the first markdown h1 line
 * @param description the proposal description
 */
function getProposalTitle(description: string) {
  const match = description.match(/^\s*#\s*(.*)\s*\n/)
  if (!match || match.length < 2) return 'Title not found'
  return match[1]
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

/**
 * Produce a markdown report summarizing the result of all the checks for a given proposal
 * @param blocks the relevant blocks for the proposal
 * @param proposal
 * @param checks
 */
export function toProposalReport(
  blocks: { current: Block; start: Block | null; end: Block | null },
  proposal: ProposalEvent,
  checks: AllCheckResults
): string {
  const { id, proposer, targets, endBlock, startBlock, description } = proposal

  // Generate the report
  const report = `
# ${getProposalTitle(description.trim())}

_Updated as of block [${blocks.current.number}](https://etherscan.io/block/${blocks.current.number}) at ${formatTime(
    blocks.current.timestamp
  )}_

- ID: ${id}
- Proposer: ${toAddressLink(proposer)}
- Start Block: ${startBlock} (${
    blocks.start ? formatTime(blocks.start.timestamp) : formatTime(estimateTime(blocks.current, startBlock))
  })
- End Block: ${endBlock} (${
    blocks.end ? formatTime(blocks.end.timestamp) : formatTime(estimateTime(blocks.current, endBlock))
  })
- Targets: ${targets.map((target) => toAddressLink(target, true)).join('; ')}

<details>
  <summary>Proposal text</summary>

${blockQuote(description.trim())}
</details>

## Checks\n
${Object.keys(checks)
  .map((checkId) => toCheckSummary(checks[checkId]))
  .join('\n')}
`

  // Remove superfluous white space. The regex replaces every three line breaks that only have whitespace in between
  // with two line breaks that have no whitespace in between.
  return report.replace(/\n\s*\n\s*\n/g, '\n\n').trim()
}
