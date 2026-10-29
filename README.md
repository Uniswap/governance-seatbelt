# @uniswap/governance-seatbelt

This repository contains tools that make on-chain governance safer,
including automated scripts that apply checks to live proposals to allow
for better informed voting.

## Reports

Every few hours a GitHub workflow is run which simulates all proposals for each DAO defined in [`governance-checks.yaml`](https://github.com/Uniswap/governance-seatbelt/blob/main/.github/workflows/governance-checks.yaml).
Reports for each proposal are saved as Markdown files associated with the workflow run.
To view the reports, navigate to this repo's [Actions](https://github.com/Uniswap/governance-seatbelt/actions), select a workflow, and download the attached artifacts.
This will download a zip file containing all reports, where you can find the report you're interested in and open it in your favorite markdown viewer.
Soon, alternative viewing options will be available so you don't need to download the files.

If running the simulations locally, you can find the reports in the `reports` folder.

Some notes on the outputs of reports:

- If a transaction reverts, that will be reported in the state changes section
- State changes and events around the proposal execution process, such as the `ExecuteTransaction` event and `queuedTransactions` state changes, are omitted from reports to reduce noise
- Slither analysis for the timelock, governor proxy, and governor implementation is skipped to reduce noise in the output. Note that skipping analysis for the implementation on historical proposals requires an archive node, and a warning will be shown if archive data is required not available

## Proposal checks

Each simulated proposal runs the checks below. Reports group findings as **info**, **warnings**, and **errors**. Treat errors as blockers for a yes vote until understood; investigate warnings before voting; use info to understand what the proposal does.

| Check | What it does | If it warns / errors |
| --- | --- | --- |
| **State changes** | Lists storage diffs from the simulation (timelock queue / governor `executed` noise filtered). | **Error** if the simulated execution reverts — do not vote yes until the revert reason is understood. **Warning** if the state diff is empty. Review every remaining diff for unexpected balances, roles, or parameters. |
| **Decode calldata** | Turns each proposal action's calldata into a human-readable description (including common ERC-20 shapes). | **Warning** if a matching call cannot be found (often means the action reverted or was not executed as expected). Manually decode the raw calldata before voting. |
| **Events** | Lists events emitted during simulation (governor/timelock execute noise filtered). | Informational. Cross-check events against the intended actions; missing expected events or unexpected ones deserve investigation. |
| **Targets verified (Etherscan)** | Whether each proposal target is verified, an EOA, or unverified. | Unverified contracts with code are reported as info but are high risk — confirm the bytecode matches what voters expect before approving. |
| **Touched contracts verified** | Same verification check for every address touched by the simulation. | Same as targets: unverified touched contracts may be proxies, peripherals, or surprise callees — verify intent. |
| **Targets no selfdestruct** | Bytecode scan of targets for `SELFDESTRUCT` / concerning `DELEGATECALL`. | **Error** on `SELFDESTRUCT` in a target — treat as unsafe unless you fully trust the contract. **Warning** on empty accounts (code may appear later) or `DELEGATECALL`-bearing bytecode. |
| **Touched contracts no selfdestruct** | Same bytecode scan for all touched addresses. | Same guidance as the targets selfdestruct check; touched contracts include callees not listed as formal targets. |
| **Value required** | Whether the account that `execute`s must send ETH, given governor balance vs proposal value. | **Warning** if ETH must be sent with `execute`. Confirm the executor will supply it and that the amount matches the proposal. |
| **solc (crytic-compile)** | Compiler warnings from verified touched contracts (skips existing timelock/governor to reduce noise). | **Warning** on compile failure or when an archive node is needed to resolve the governor implementation. New solc warnings on touched code should be understood before voting. |
| **Slither** | Runs Slither on verified touched contracts (after solc; skips timelock/governor). | **Warning** if Slither fails for a contract. Findings are printed as info — triage high/medium severity before voting; known false positives on governance glue are common. |

Checks are registered in [`checks/index.ts`](./checks/index.ts). Solc must run before Slither because compilation exports an artifact Slither consumes.

## Usage

### Adding DAOs to CI

To add a DAO to CI, submit a pull request that adds the desired `DAO_NAME` and `GOVERNOR_ADDRESS`
to the `matrix` section of `.github/workflows/governance-checks.yaml`.

Note that currently only Compound `GovernorBravo` and OpenZeppelin style governors are supported.

### Environment Variable Setup

First, create a file called `.env` with the following environment variables:

```sh
# Etherscan API Key, used when running Slither.
ETHERSCAN_API_KEY=yourEtherscanApiKey

# URL to your node, e.g. Infura or Alchemy endpoint.
RPC_URL=yourNodeUrl

# Tenderly access token.
# Access token is obtained from the Tenderly UI via Account > Authorization > Generate Access Token.
TENDERLY_ACCESS_TOKEN=yourAccessToken

# Tenderly user name.
# User name can be found in the URL of your project: https://dashboard.tenderly.co/<userName>/<project_slug>/transactions
# This is `me` for personal accounts.
TENDERLY_USER=userName

# Tenderly project slug.
# Project slug can be found in the URL of your project: https://dashboard.tenderly.co/<userName>/<project_slug>/transactions.
# The name of your tenderly project may not always be your project slug,
# and the project slug can sometimes just be `project`.
TENDERLY_PROJECT_SLUG=projectName

# Define the DAO name and the address of its governor.
DAO_NAME=Uniswap
GOVERNOR_ADDRESS=0x408ED6354d4973f66138C91495F2f2FCbd8724C3
```

### Running Simulations

There are two modes of operation:

1. Run `yarn start` to simulate and run checks on all Governor proposals.
2. Alternatively, create a file called `<analysisName>.sim.ts` and run a specific simulation with `SIM_NAME=analysisName yarn start`. See the `*.sim.ts` files in the `sims` folder for examples.

When running either of those two modes locally, reports will be saved into a `reports/` folder in the root of the repository.
The specific path will be `./reports/${daoName}/${governorAddress}/${proposalId}.${extension}`.
The `reports/` folder is gitignored, so when searching for reports in this directory your editor may hide the files by default.
