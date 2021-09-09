import { AllCheckResults, Proposal } from "../types";

/**
 * Summarize the results of a specific check
 * @param errors the errors returned by the check
 * @param warnings the warnings returned by the check
 * @param name the descriptive name of the check
 */
function toCheckSummary({
  result: { errors, warnings },
  name,
}: AllCheckResults[string]): string {
  const status =
    errors.length === 0
      ? warnings.length === 0
        ? "✅ Passed"
        : "⚠️ Passed with warnings"
      : "❌ Failed";

  return `#### ${name} ${status}

${
  errors.length > 0
    ? "Errors:\n" + errors.map((msg) => `- ${msg}`).join("\n")
    : ""
}

${
  warnings.length > 0
    ? "Warnings:\n" + warnings.map((msg) => `- ${msg}`).join("\n")
    : ""
}
`;
}

function getProposalTitle(description: string) {
  const match = description.match(/^#\s*(.*)\s*\n/);
  if (!match || match.length < 2) return "Title not found";
  return match[1];
}

function toAddressLink(address: string): string {
  return `[${address}](https://etherscan.io/address/${address})`;
}

function toCodeLink(address: string): string {
  return `[${address}](https://etherscan.io/address/${address}#code)`;
}

/**
 * Produce a markdown report summarizing the result of all the checks for a given proposal
 * @param proposal
 * @param checks
 */
export function toProposalReport(
  proposal: Proposal,
  checks: AllCheckResults
): string {
  const { id, proposer, targets, endBlock, startBlock, description } = proposal;

  return `
## #${id}: ${getProposalTitle(description)}
- Proposer: ${toAddressLink(proposer)}
- Start Block: ${startBlock}
- End Block: ${endBlock}
- Targets: ${targets.map(toCodeLink).join("; ")}

<details>
  <summary>Proposal text</summary>
${description}
</details>

### Checks
${Object.keys(checks)
  .map((checkId) => toCheckSummary(checks[checkId]))
  .join("\n")}`;
}
