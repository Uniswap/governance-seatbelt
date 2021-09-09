import { Check } from "./types";
import { etherscan } from "../utils/clients/etherscan";

export const checkTargetsVerifiedEtherscan: Check = {
  name: "Check all targets are verified on Etherscan",
  async checkProposal(proposal) {
    const errors: string[] = [];
    for (let target of proposal.targets) {
      try {
        const abi = await etherscan.getAbi(target);
      } catch (error) {
        if (error instanceof Error)
          errors.push(`Target ${target} is not verified: ${error.message}`);
        else errors.push(`Target ${target} is not verified`);
      }
    }

    return errors;
  },
};
