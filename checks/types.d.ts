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

export type ErrorMessage = string;

export type CheckResult = ErrorMessage[];

export interface Check {
  name: string;
  checkProposal(proposal: Proposal): Promise<CheckResult>;
}
