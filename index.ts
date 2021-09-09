import { GITHUB_REPO_NAME, GITHUB_REPO_OWNER } from "./utils/constants";
import { github } from "./utils/clients/github";
import { governorBravo } from "./utils/contracts/governor-bravo";
import { provider } from "./utils/clients/ethers";
import { CheckResult, Proposal } from "./checks/types";
import ALL_CHECKS from "./checks";

interface AllCheckResults {
  [checkId: string]: { name: string; result: CheckResult };
}

function toProposalBody(proposal: Proposal, checks: AllCheckResults) {
  const { id, proposer, targets, endBlock, startBlock, description } = proposal;

  return `## Proposal ID: ${id}
- Proposer: ${proposer}
- Start Block: ${startBlock}
- End Block: ${endBlock}
- Targets: ${targets.join("; ")}
- Description: ${description}

### Checks
${Object.keys(checks)
  .map(
    (checkId) =>
      `#### ${checks[checkId].name} ${
        checks[checkId].result.errors.length === 0 ? "✅ Passed" : "❌ Failed"
      }

Errors: 
${checks[checkId].result.errors.map((msg) => `- ${msg}`).join("\n")}

Warnings: 
${checks[checkId].result.warnings.map((msg) => `- ${msg}`).join("\n")}`
  )
  .join("\n")}`;
}

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
    title: "Report result",
    body: `# Active proposals
${activeProposals
  .map((proposal, ix) => {
    return toProposalBody(proposal, resultsByProposalIndex[ix]);
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
