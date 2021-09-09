import { BigNumber } from "ethers";

export interface Proposal {
  id: BigNumber;
  proposer: string;
  targets: string[];
  values: BigNumber[];
  signatures: string[];
  calldatas: string[];
  startBlock: BigNumber;
  endBlock: BigNumber;
  description: string;
}

export type Message = string;

export type CheckResult = {
  info: Message[];
  warnings: Message[];
  errors: Message[];
};

export interface ProposalCheck {
  name: string;
  checkProposal(proposal: Proposal): Promise<CheckResult>;
}

export interface AllCheckResults {
  [checkId: string]: { name: string; result: CheckResult };
}
