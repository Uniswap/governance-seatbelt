import { GITHUB_REPO_NAME, GITHUB_REPO_OWNER } from "./utils/constants";
import { github } from "./utils/clients/github";
import { governorBravo } from "./utils/contracts/governor-bravo";
import { provider } from "./utils/clients/ethers";
import { Proposal } from "./checks/types";

async function main() {
  const currentBlock = await provider.getBlockNumber();
  const createProposalLogs = await governorBravo.queryFilter(
    governorBravo.filters.ProposalCreated(),
    0,
    "latest"
  );

  const activeProposals: Proposal[] = createProposalLogs
    .filter(
      (proposal) => proposal.args && proposal.args.endBlock.gte(currentBlock)
    )
    .map((proposal) => {
      return proposal.args as unknown as Proposal;
    });

  await github.issues.create({
    owner: GITHUB_REPO_OWNER,
    repo: GITHUB_REPO_NAME,
    title: "Report result",
    body: `# Active proposals
${activeProposals
  .map(({ id, proposer, targets, endBlock, startBlock, description }) => {
    return `
## Proposal ID: ${id}
- Proposer: ${proposer}
- Start Block: ${startBlock}
- End Block: ${endBlock}
- Targets: ${targets.join("; ")}
- Description: ${description}
`;
  })
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
