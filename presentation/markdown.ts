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

/**
 * Pulls the title out of the markdown description, from the first markdown h1 line
 * @param description the proposal description
 */
function getProposalTitle(description: string) {
  const match = description.match(/^\s*#\s*(.*)\s*\n/);
  if (!match || match.length < 2) return "Title not found";
  return match[1];
}

/**
 * Turns a plaintext address into a link to etherscan page of that address
 * @param address to be linked
 * @param code whether to link to the code tab
 */
function toAddressLink(address: string, code: boolean = false): string {
  return `[${address}](https://etherscan.io/address/${address}${
    code ? "#code" : ""
  })`;
}

/**
 * Block quotes a string in markdown
 * @param str string to block quote
 */
function blockQuote(str: string): string {
  return str
    .split("\n")
    .map((s) => "> " + s)
    .join("\n");
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

  return `## ${getProposalTitle(description)}
- ID: ${id}
- Proposer: ${toAddressLink(proposer)}
- Start Block: ${startBlock}
- End Block: ${endBlock}
- Targets: ${targets.map((target) => toAddressLink(target, true)).join("; ")}

<details>
  <summary>Proposal text</summary>

${blockQuote(description)}
</details>

### Checks
${Object.keys(checks)
  .map((checkId) => toCheckSummary(checks[checkId]))
  .join("\n")}`;
}
