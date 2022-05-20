import fs from 'fs'
import PdfPrinter from 'pdfmake'
import { TDocumentDefinitions } from 'pdfmake/interfaces'
import { Block } from '@ethersproject/abstract-provider'
import { ProposalEvent } from '../types'

// Raw proposal data needed to make a report.
type ProposalData = {
  proposal: ProposalEvent
  blocks: {
    lastUpdate: Block
    start: Block | null
    end: Block | null
  }
}

// Formatted proposal report that is converted to PDF or Markdown.
type FormattedProposalReport = {
  frontMatter: {
    title: string
    lastUpdateBlock: Block
    proposal: {
      id: string
      proposer: string
      startBlock: Block | null
      endBlock: Block | null
      targets: string[]
    }
  }
}

// Fonts used for the PDF report.
const fonts = {
  Courier: {
    normal: 'Courier',
    bold: 'Courier-Bold',
    italics: 'Courier-Oblique',
    bolditalics: 'Courier-BoldOblique',
  },
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique',
  },
}

const printer = new PdfPrinter(fonts)

export async function createPdfReport(doc: ProposalData) {
  const report = formatReport(doc)
  const lastUpdateBlock = report.frontMatter.lastUpdateBlock
  const startBlock = report.frontMatter.proposal.startBlock
  const endBlock = report.frontMatter.proposal.endBlock
  const proposer = report.frontMatter.proposal.proposer
  const targets = report.frontMatter.proposal.targets

  // --- Front Matter ---
  const lastUpdateString = [
    '\nUpdated as of block ',
    { text: `${lastUpdateBlock.number} `, link: getEtherscanUrl('block', lastUpdateBlock.number), style: 'link' },
    `at ${formatTime(lastUpdateBlock.timestamp)}`,
  ]
  const proposerString = [
    'Proposer: ',
    { text: `${proposer} `, link: getEtherscanUrl('address', proposer), style: 'link' },
  ]
  const startBlockString = [
    'Start Block: ',
    { text: `${startBlock!.number} `, link: getEtherscanUrl('block', startBlock!.number), style: 'link' },
    `(${formatTime(startBlock!.timestamp)})`,
  ]
  const endBlockString = [
    'End Block: ',
    { text: `${endBlock!.number} `, link: getEtherscanUrl('block', endBlock!.number), style: 'link' },
    `(${formatTime(endBlock!.timestamp)})`,
  ]
  const targetsString = [
    'Targets: ',
    ...targets.map((target, i) => {
      const separator = targets.length > 0 && i + 1 !== targets.length ? ', ' : ''
      return { text: `${target}${separator}`, link: getEtherscanUrl('address', target), style: 'link' }
    }),
  ]

  const frontMatterContent: TDocumentDefinitions['content'] = [
    { text: report.frontMatter.title, style: 'h1' },
    { text: lastUpdateString, style: 'italic' },
    {
      ul: [
        { text: `ID: ${report.frontMatter.proposal.id}`, style: 'list' },
        { text: proposerString, style: 'list' },
        { text: startBlockString, style: 'list' },
        { text: endBlockString, style: 'list' },
        { text: targetsString, style: 'list' },
      ],
    },
  ]

  // --- Table of contents ---
  // TODO
  const tocContent: TDocumentDefinitions['content'] = []

  // --- Proposal Checks ---
  // TODO
  const proposalChecksContent: TDocumentDefinitions['content'] = []

  // --- Aggregate Data ---
  const pdfData: TDocumentDefinitions = {
    content: [...frontMatterContent, ...tocContent, ...proposalChecksContent],
    styles: {
      h1: { fontSize: 20, bold: true },
      italic: { italics: true },
      list: { lineHeight: 1.5 },
      link: { color: '#007BFF' },
    },
    defaultStyle: { font: 'Helvetica' },
  }

  // --- Generate Report ---
  return new Promise((resolve) => {
    const pdfDoc = printer.createPdfKitDocument(pdfData)
    const stream = fs.createWriteStream('document.pdf')
    pdfDoc.pipe(stream)
    pdfDoc.end()
    stream.on('finish', resolve)
  })
}

function formatReport(proposalData: ProposalData): FormattedProposalReport {
  return {
    frontMatter: {
      title: getProposalTitle(proposalData.proposal.description),
      lastUpdateBlock: proposalData.blocks.lastUpdate,
      proposal: {
        id: proposalData.proposal.id.toString(),
        proposer: proposalData.proposal.proposer,
        startBlock: proposalData.blocks.start,
        endBlock: proposalData.blocks.end,
        targets: proposalData.proposal.targets,
      },
    },
  }
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

function getEtherscanUrl(type: 'block' | 'tx' | 'address', id: string | number) {
  return `https://etherscan.io/${type}/${id}`
}
