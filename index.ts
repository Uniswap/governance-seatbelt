import {
  DAO_NAME,
  GITHUB_REPO_NAME,
  GITHUB_REPO_OWNER,
} from "./utils/constants";
import { github } from "./utils/clients/github";
import { governorBravo } from "./utils/contracts/governor-bravo";
import { provider } from "./utils/clients/ethers";
import { AllCheckResults, Proposal } from "./types";
import ALL_CHECKS from "./checks";
import { toProposalReport } from "./presentation/markdown";

async function main() {
  const currentBlock = await provider.getBlockNumber();
  const createProposalLogs = await governorBravo.queryFilter(
    governorBravo.filters.ProposalCreated(),
    0,
    "latest"
  );

  const activeProposals: Proposal[] = createProposalLogs
    .filter(
      (proposal) =>
        proposal.args /*&& proposal.args.endBlock.gte(cu¡rrentBlock)*/
    )
    .map((proposal) => {
      return proposal.args as unknown as Proposal;
    });

  const resultsByProposalIndex: AllCheckResults[] = [];

  for (let proposal of activeProposals) {
    resultsByProposalIndex.push(
      Object.fromEntries(
        await Promise.all(
          Object.keys(ALL_CHECKS).map(async (checkId) => [
            checkId,
            {
              name: ALL_CHECKS[checkId].name,
              result: await ALL_CHECKS[checkId].checkProposal(proposal),
            },
          ])
        )
      )
    );
  }

  await github.issues.create({
    owner: GITHUB_REPO_OWNER,
    repo: GITHUB_REPO_NAME,
    title: `${DAO_NAME} report result`,
    body: `# Active proposals
${activeProposals
  .map((proposal, ix) => toProposalReport(proposal, resultsByProposalIndex[ix]))
  .join("\n\n")}
`,
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
