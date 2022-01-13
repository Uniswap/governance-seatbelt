import { writeFileSync, unlinkSync } from 'fs'
import util from 'util'
import { exec as execCallback } from 'child_process'
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
 * Assumes slither is already installed and can be run with python
 */
export const checkSlither: ProposalCheck = {
  name: 'Runs slither against the verified contracts',
  async checkProposal(proposal, sim, deps) {
    let info = ''
    let warnings: string[] = []
    // For each verified contract with code, we write the files, run slither, then delete the
    // files. We do this instead of running Slither on all contracts at once since contracts at
    // different addresses can have the same names, which would result in an error when compiling
    for (const contract of sim.contracts) {
      // Get solc version used
      const solcVersionMatch = contract.compiler_version.match(/\d*\.\d*\.\d*/)
      if (!solcVersionMatch) {
        const msg = `Slither not run for \`${contract.contract_name}\` at \`${contract.address}\`: could not parse solc version`
        warnings.push(msg)
        continue
      }
      const solcVersion = solcVersionMatch[0]

      // Save the contract locally
      for (const file of contract.data.contract_info) writeFileSync(file.name, file.source)

      // Run slither against it
      const output = await runSlither(solcVersion)
      if (!output) {
        warnings.push(`Slither execution failed for \`${contract.contract_name}\` at \`${contract.address}\``)
        continue
      }

      // Append results to report info
      // Note that slither supports a `--json` flag  we could use, but directly printing the formatted
      // results in a code block is sufficient and simpler
      info += `\n\`\`\`\n${output.stderr}\`\`\``

      // Delete the contract files
      for (const file of contract.data.contract_info) unlinkSync(file.name)
    }

    return { info: [`Slither report:${info}`], warnings, errors: [] }
  },
}

/**
 * Tries to run slither via python installation
 * @dev Requires solc-select and slither to be installed
 * @dev If you have nix/dapptools installed, you'll need to make sure the path to your python
 * executables (find this with `which solc-select`) comes before the path to your nix executables.
 * This may require editing your $PATH variable prior to running this check. If you don't do this,
 * the nix version of solc will take precedence over the solc-select version, and slither will fail
 */
async function runSlither(solcVersion: string): Promise<ExecOutput | null> {
  try {
    return await exec(`solc-select install ${solcVersion} && SOLC_VERSION=${solcVersion} slither .`)
  } catch (e: any) {
    if ('stdout' in e) return e // output is in stdout, but slither reports results as an exception
    console.warn(`Error: Could not run slither via Python: ${JSON.stringify(e)}`)
    return null
  }
}
