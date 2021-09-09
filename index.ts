import { GITHUB_REPO_NAME, GITHUB_REPO_OWNER } from "./utils/constants";
import { github } from "./utils/clients/github";
import { governorBravo } from "./utils/contracts/governor-bravo";

async function main() {
  const proposals = await governorBravo.queryFilter(
    governorBravo.filters.ProposalCreated(),
    0,
    "latest"
  );

  const { data } = await github.issues.create({
    owner: GITHUB_REPO_OWNER,
    repo: GITHUB_REPO_NAME,
    title: "Report result",
    body: `# Proposals
${proposals.reduce((memo, { args }) => {
  if (!args) return memo;
  const {
    id,
    proposer,
    targets,
    values,
    signatures,
    calldatas,
    startBlock,
    endBlock,
    description,
  } = args;

  return `${memo}\n\nproposal id: ${id}; proposer: ${proposer}; targets: ${targets.join(
    ", "
  )};`;
}, "")}
`,
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
