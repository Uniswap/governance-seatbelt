import { Check } from "../types";
import { etherscan } from "../utils/clients/etherscan";
import { provider } from "../utils/clients/ethers";

/**
 * Check all targets with code are verified on Etherscan
 */
export const checkTargetsVerifiedEtherscan: Check = {
  name: "Check all targets are verified on Etherscan",
  async checkProposal(proposal) {
    const errors: string[] = [];
    for (let target of proposal.targets) {
      if ((await provider.getCode(target)) !== "0x") {
        try {
          const abi = await etherscan.getAbi(target);
        } catch (error) {
          if (error instanceof Error)
            errors.push(`Target ${target} is not verified: ${error.message}`);
          else errors.push(`Target ${target} is not verified`);
        }
      } else {
        errors.push(`Target ${target} has no code`);
      }
    }

    return { warnings: [], errors };
  },
};
