import { checkTargetsVerifiedEtherscan } from "./check-targets-verified-etherscan";
import { Check } from "../types";

const ALL_CHECKS: {
  [checkId: string]: Check;
} = { checkTargetsVerifiedEtherscan };

export default ALL_CHECKS;
