import fs from 'fs'
import os from 'os'
import path from 'path'
import util from 'util'
import { exec as execCallback } from 'child_process'
import { getAddress } from '@ethersproject/address'
import { getContractName } from '../utils/clients/tenderly'
import { ProposalCheck } from '../types'

// convert exec method from a callback to a promise
const exec = util.promisify(execCallback)

// Data returned from command execution
type ExecOutput = {
  stdout: string
  stderr: string
}

/**
 * Runs slither against the verified contracts and reports the outputs.
 * Assumes solc-select and slither are both already installed with python
 */
export const checkSlither: ProposalCheck = {
  name: 'Runs slither against the verified contracts',
  async checkProposal(proposal, sim, deps) {
    let info = ''
    let warnings: string[] = []

    // Skip existing timelock and governor contracts to reduce noise. These contracts are already
    // deployed and in use, and if they are being updated, the new contract will be one of the
    // touched contracts that get's analyzed
    // NOTE: This requires an archive node since we need to query for the governor implementation
    // at the simulation block number, since the implementation may have changed since
    const addressesToSkip = new Set([deps.timelock.address, deps.governor.address])
    try {
      addressesToSkip.add(await deps.governor.implementation({ blockTag: sim.transaction.block_number }))
    } catch (e) {
      const msg = `Could not read address of governor implementation at block \`${sim.transaction.block_number}\`. Make sure the \`RPC_URL\` is an archive node. As a result the Slither check will show warnings on the governor's implementation contract.`
      console.warn(`WARNING: ${msg}. Details:`)
      console.warn(e)
      warnings.push(msg)
    }

    // Return early if the only contracts touched are the timelock and governor
    const contracts = sim.contracts.filter((contract) => !addressesToSkip.has(getAddress(contract.address)))
    if (contracts.length === 0) {
      return { info: ['No contracts to analyze: only the timelock and governor are touched'], warnings, errors: [] }
    }

    // For each verified contract, we write the files, run slither, then delete the files. We do
    // this instead of running Slither on all contracts at once because the running against all
    // contracts at once would cause errors when:
    //   1. contracts at different addresses rely on different compiler versions, or
    //   2. contracts at different addresses have the same names
    const tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), 'seatbelt-contracts-'))
    for (const contract of contracts) {
      const addr = getAddress(contract.address)
      if (addressesToSkip.has(addr)) continue

      // Get solc version used
      const solcVersionMatch = contract.compiler_version.match(/\d*\.\d*\.\d*/)
      if (!solcVersionMatch) {
        const msg = `Slither not run for \`${contract.contract_name}\` at \`${addr}\`: could not parse solc version`
        warnings.push(msg)
        continue
      }
      const solcVersion = solcVersionMatch[0]

      // Save the contract locally
      for (const file of contract.data.contract_info) fs.writeFileSync(`${tmpdir}/${file.name}`, file.source)

      // Run slither
      const slitherOutput = await runSlither(solcVersion, tmpdir)
      if (!slitherOutput) {
        warnings.push(`Slither execution failed for \`${contract.contract_name}\` at \`${addr}\``)
        continue
      }

      // Append results to report info
      // Note that slither supports a `--json` flag  we could use, but directly printing the formatted
      // results in a code block is simpler and sufficient for now
      const formatting = info === '' ? '' : '\n- '
      info += `${formatting}Slither report for ${getContractName(contract)}`
      if (slitherOutput) {
        info += `\n\n<details>\n<summary>View Report</summary>\n\n\`\`\`\n${slitherOutput.stderr}\`\`\`\n\n</details>\n\n`
      }

      // Delete the contract files
      for (const file of contract.data.contract_info) fs.unlinkSync(`${tmpdir}/${file.name}`)
    }

    fs.rmdirSync(tmpdir)
    return { info: [info], warnings, errors: [] }
  },
}

/**
 * Tries to run slither via python installation in the specified directory. If a printer name is
 * passed, the printer will be run
 * @dev Requires solc-select and slither to be installed
 * @dev If you have nix/dapptools installed, you'll need to make sure the path to your python
 * executables (find this with `which solc-select`) comes before the path to your nix executables.
 * This may require editing your $PATH variable prior to running this check. If you don't do this,
 * the nix version of solc will take precedence over the solc-select version, and slither will fail
 * @dev The list of available printers can be found here: https://github.com/crytic/slither/wiki/Printer-documentation
 */
async function runSlither(
  solcVersion: string,
  dir: string,
  printer: string | undefined = undefined
): Promise<ExecOutput | null> {
  try {
    const printerCmd = printer ? ` --print ${printer}` : ''
    return await exec(
      `cd ${dir} && solc-select install ${solcVersion} && SOLC_VERSION=${solcVersion} slither .${printerCmd}`
    )
  } catch (e: any) {
    if ('stderr' in e) return e // output is in stderr, but slither reports results as an exception
    console.warn(`Error: Could not run slither${printer ? ` printer ${printer}` : ''} via Python: ${JSON.stringify(e)}`)
    return null
  }
}
