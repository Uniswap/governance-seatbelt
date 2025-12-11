import { execFile as execFileCallback } from 'node:child_process';
import util from 'node:util';
import { getAddress } from 'viem';
import { codeBlock } from '../presentation/report';
import type { ProposalCheck } from '../types';
import { getContractNameFromTenderly } from '../utils/clients/tenderly';
import { ETHERSCAN_API_KEY } from '../utils/constants';
import { getImplementation } from '../utils/contracts/governor';
import { ETH_ADDRESS_REGEX, SECURITY_TOOL_TIMEOUT_MS } from '../utils/security-constants';

// Convert execFile method from a callback to a promise.
const execFile = util.promisify(execFileCallback);

// Data returned from command execution.
type ExecOutput = {
  stdout: string;
  stderr: string;
};

// Result from runCryticCompile with specific failure reason
type CryticResult =
  | { success: true; output: ExecOutput }
  | { success: false; reason: 'invalid_address' | 'timeout' | 'execution_error'; message: string };

/**
 * Runs crytic-compile against verified contracts to obtain solc compiler warnings. Assumes crytic-compile
 * is already installed.
 */
export const checkSolc: ProposalCheck = {
  name: 'Runs solc against the verified contracts',
  async checkProposal(_, sim, deps) {
    const info: string[] = [];
    const warnings: string[] = [];

    // Skip existing timelock and governor contracts to reduce noise. These contracts are already
    // deployed and in use, and if they are being updated, the new contract will be one of the
    // touched contracts that gets analyzed.
    // NOTE: This requires an archive node since we need to query for the governor implementation
    // at the simulation block number, since the implementation may have changed since.
    const addressesToSkip = new Set([deps.timelock.address, deps.governor.address]);
    try {
      const implementation = await getImplementation(
        deps.governor.address,
        BigInt(sim.transaction.block_number),
      );
      if (implementation) addressesToSkip.add(implementation);
    } catch (e) {
      const msg = `Could not read address of governor implementation at block \`${sim.transaction.block_number}\`. Make sure the \`RPC_URL\` is an archive node. As a result the Slither check will show warnings on the governor's implementation contract.`;
      console.warn(`WARNING: ${msg}. Details:`);
      console.warn(e);
      warnings.push(msg);
    }

    // Return early if the only contracts touched are the timelock and governor.
    const contracts = sim.contracts.filter(
      (contract) => !addressesToSkip.has(getAddress(contract.address)),
    );
    if (contracts.length === 0) {
      return {
        info: ['No contracts to analyze: only the timelock and governor are touched'],
        warnings,
        errors: [],
      };
    }

    // For each unique  verified contract we run solc against it via crytic-compile. It has a mode to run it directly against
    // a mainnet contract, which saves us from having to write files to a local temporary directory.
    for (const contract of Array.from(new Set(contracts))) {
      const addr = getAddress(contract.address);
      if (addressesToSkip.has(addr)) continue;

      // Compile the contracts.
      const result = await runCryticCompile(contract.address);
      if (!result.success) {
        warnings.push(
          `crytic-compile failed for \`${contract.contract_name}\` at \`${addr}\`: ${result.message}`,
        );
        continue;
      }

      // Append results to report info.
      const contractName = getContractNameFromTenderly(contract);
      if (result.output.stderr === '') {
        info.push(`No compiler warnings for ${contractName}`);
      } else {
        info.push(`Compiler warnings for ${contractName}${codeBlock(result.output.stderr.trim())}`);
      }
    }

    return { info, warnings, errors: [] };
  },
};

/**
 * Tries to run crytic-compile via python installation in the specified directory.
 * @dev Exports a zip file which is used by the slither check.
 * @dev If you have nix/dapptools installed, you'll need to make sure the path to your python
 * executables (find this with `which solc-select`) comes before the path to your nix executables.
 * This may require editing your $PATH variable prior to running this check. If you don't do this,
 * the nix version of solc will take precedence over the solc-select version, and compilation will fail.
 */
async function runCryticCompile(address: string): Promise<CryticResult> {
  // Validate address format before execution (defense in depth)
  if (!ETH_ADDRESS_REGEX.test(address)) {
    return {
      success: false,
      reason: 'invalid_address',
      message: `Invalid address format: ${address}`,
    };
  }

  try {
    // Use execFile with argument array to prevent shell injection
    const output = await execFile(
      'crytic-compile',
      [address, '--etherscan-apikey', ETHERSCAN_API_KEY],
      { timeout: SECURITY_TOOL_TIMEOUT_MS },
    );
    return { success: true, output };
  } catch (e: unknown) {
    // Handle timeout errors
    if (e && typeof e === 'object' && 'killed' in e && (e as { killed: boolean }).killed) {
      return {
        success: false,
        reason: 'timeout',
        message: `Timed out after ${SECURITY_TOOL_TIMEOUT_MS / 1000}s`,
      };
    }
    // crytic-compile reports via stderr and non-zero exit, which throws
    if (e && typeof e === 'object' && 'stderr' in e) {
      return { success: true, output: e as ExecOutput };
    }
    return {
      success: false,
      reason: 'execution_error',
      message: `Execution failed: ${e instanceof Error ? e.message : String(e)}`,
    };
  }
}
