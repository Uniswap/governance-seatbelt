require('dotenv').config()
import fs, { createReadStream } from 'node:fs'
import { createInterface } from 'node:readline'

async function readFirstLine(path: string) {
  const inputStream = createReadStream(path)
  try {
    for await (const line of createInterface(inputStream)) return line
    return '' // If the file is empty.
  } finally {
    inputStream.destroy() // Destroy file stream.
  }
}

async function generateReadme() {
  const reportsFolder = './reports'
  const DAOs = fs.readdirSync(reportsFolder)
  let reportsTable = '<!-- ### Reports table start ### -->\n'
  for (const DAO of DAOs) {
    const governances = fs.readdirSync(`${reportsFolder}/${DAO}`)
    for (const governance of governances) {
      reportsTable += `### ${DAO} ( ${governance} )\n\n`
      reportsTable += `| Proposal | Report | App-link |\n| --- | --- | --- |\n`
      const proposals = fs.readdirSync(`${reportsFolder}/${DAO}/${governance}`)
      for (const proposal of proposals) {
        const title = await readFirstLine(`${reportsFolder}/${DAO}/${governance}/${proposal}`)
        const appId = parseInt(proposal.replace(/(_arc)?\.md/, ''), 10)
        reportsTable += `| ${title.replace(
          '## ',
          ''
        )} | [${proposal}](${reportsFolder}/${DAO}/${governance}/${proposal}) | [app](https://app.aave.com/governance/proposal/?proposalId=${appId}) |\n`
      }
    }
    reportsTable += `\n`
  }
  reportsTable += '<!-- ### Reports table end ### -->'
  await fs.readFile('./README.md', 'utf8', function (err, data) {
    if (err) {
      return console.log(err)
    }
    var result = data.replace(
      /<!-- ### Reports table start ### -->[\s\S]*<!-- ### Reports table end ### -->/gm,
      reportsTable
    )

    fs.writeFile('./README.md', result, 'utf8', function (err) {
      if (err) return console.log(err)
    })
  })
}

generateReadme()
