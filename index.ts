import { GITHUB_REPO_NAME, GITHUB_REPO_OWNER } from "./utils/constants";
import { github } from "./utils/clients/github";
import { governorBravo } from "./utils/contracts/governor-bravo";
import { provider } from "./utils/clients/ethers";
import { CheckResult, Proposal } from "./checks/types";
import ALL_CHECKS from "./checks";

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
        proposal.args /*&& proposal.args.endBlock.gte(currentBlock)*/
    )
    .map((proposal) => {
      return proposal.args as unknown as Proposal;
    });

  const results: CheckResult[][] = [];

  for (let proposal of activeProposals) {
    results.push(
      await Promise.all(
        ALL_CHECKS.map((check) => check.checkProposal(proposal))
      )
    );
  }

  await github.issues.create({
    owner: GITHUB_REPO_OWNER,
    repo: GITHUB_REPO_NAME,
    title: "Report result",
    body: `# Active proposals
${activeProposals
  .map((proposal, ix) => {
    const { id, proposer, targets, endBlock, startBlock, description } =
      proposal;
    results[ix];
    return `
## Proposal ID: ${id}
- Proposer: ${proposer}
- Start Block: ${startBlock}
- End Block: ${endBlock}
- Targets: ${targets.join("; ")}
- Description: ${description}

### Checks
${ALL_CHECKS.map(
  (check, checkIx) =>
    `#### ${check.name} ${
      results[ix][checkIx].length === 0 ? "✅ Passed" : "❌ Failed"
    }

Check errors: 

${results[ix][checkIx].map((err) => `- ${err}`).join("\n")}
`
).join("\n")}
-

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
