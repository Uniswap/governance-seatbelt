import util from 'util'
import { exec as execCallback } from 'child_process'
import { getAddress } from '@ethersproject/address'
import { getContractName } from '../utils/clients/tenderly'
import { ETHERSCAN_API_KEY } from '../utils/constants'
import { ProposalCheck } from '../types'

// Convert exec method from a callback to a promise.
const exec = util.promisify(execCallback)

// Data returned from command execution.
type ExecOutput = {
  stdout: string
  stderr: string
}

/**
 * Runs crytic-compile against verified contracts to obtain solc compiler warnings. Assumes crytic-compile
 * is already installed.
 */
export const checkSolc: ProposalCheck = {
  name: 'Runs solc against the verified contracts',
  async checkProposal(proposal, sim, deps) {
    let info = ''
    let warnings: string[] = []

    // Skip existing executor and governance contracts to reduce noise. These contracts are already
    // deployed and in use, and if they are being updated, the new contract will be one of the
    // touched contracts that get's analyzed.
    // NOTE: This requires an archive node since we need to query for the governance implementation
    // at the simulation block number, since the implementation may have changed since.
    const addressesToSkip = new Set([deps.executor.address, deps.governance.address])

    // Return early if the only contracts touched are the executor and governance.
    const contracts = sim.contracts.filter((contract) => !addressesToSkip.has(getAddress(contract.address)))
    if (contracts.length === 0) {
      return { info: ['No contracts to analyze: only the executor and governance are touched'], warnings, errors: [] }
    }

    // For each unique  verified contract we run solc against it via crytic-compile. It has a mode to run it directly against
    // a mainnet contract, which saves us from having to write files to a local temporary directory.
    for (const contract of Array.from(new Set(contracts))) {
      const addr = getAddress(contract.address)
      if (addressesToSkip.has(addr)) continue

      // Compile the contracts.
      const output = await runCryticCompile(contract.address)
      if (!output) {
        warnings.push(`crytic-compile failed for \`${contract.contract_name}\` at \`${addr}\``)
        continue
      }

      // Append results to report info.
      const formatting = info === '' ? '' : '\n- '
      const contractName = getContractName(contract, contract.address)
      if (output.stderr === '') {
        info += `${formatting}No compiler warnings for ${contractName}`
      } else {
        info += `${formatting}Compiler warnings for ${contractName}`
        info += `\n\n<details>\n<summary>View warnings for ${contractName}</summary>\n\n\`\`\`\n${output.stderr}\`\`\`\n\n</details>\n\n`
      }
    }

    return { info: [`\n\n<details>\n<summary>View Details</summary>\n${info}</details>\n\n`], warnings, errors: [] }
  },
}

/**
 * Tries to run crytic-compile via python installation in the specified directory.
 * @dev Exports a zip file which is used by the slither check.
 * @dev If you have nix/dapptools installed, you'll need to make sure the path to your python
 * executables (find this with `which solc-select`) comes before the path to your nix executables.
 * This may require editing your $PATH variable prior to running this check. If you don't do this,
 * the nix version of solc will take precedence over the solc-select version, and compilation will fail.
 */
async function runCryticCompile(address: string): Promise<ExecOutput | null> {
  try {
    return await exec(`crytic-compile ${address} --etherscan-apikey ${ETHERSCAN_API_KEY}`)
  } catch (e: any) {
    if ('stderr' in e) return e // Output is in stderr, but slither reports results as an exception.
    console.warn(`Error: Could not run crytic-compile via Python: ${JSON.stringify(e)}`)
    return null
  }
}
