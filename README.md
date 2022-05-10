# @uniswap/governance-seatbelt

This repository contains tools that make on-chain governance safer,
including automated scripts that apply checks to live proposals to allow
for better informed voting.

## Reports

Every hour a GitHub workflow is run which simulates all GovernorBravo proposals for each DAO defined in [`governance-checks.yaml`](https://github.com/Uniswap/governance-seatbelt/blob/main/.github/workflows/governance-checks.yaml).
Reports for each proposal are saved as Markdown files associated with the workflow run.
To view the reports, navigate to this repo's [Actions](https://github.com/Uniswap/governance-seatbelt/actions), select a workflow, and download the attached artifacts.
This will download a zip file containing all reports, where you can find the report you're interested in and open it your favorite markdown viewer.
Soon, alternative viewing options will be available so you don't need to download the files.

If running the simulations locally, you can find the reports in the `reports` folder.

Some notes on the outputs of reports:

- If a transaction reverts, that will be reported in the state changes section
- State changes and events around the proposal execution process, such as the `ExecuteTransaction` event and `queuedTransactions` state changes, are omitted from reports to reduce noise
- Slither analysis for the timelock, governor proxy, and governor implementation is skipped to reduce noise in the output. Note that skipping analysis for the implementation on historical proposals requires an archive node, and a warning will be shown if archive data is required not available

## Usage

### Adding DAOs to CI

To add a DAO to CI, submit a pull request that adds the desired `DAO_NAME` and `GOVERNOR_ADDRESS`
to the `matrix` section of `.github/workflows/governance-checks.yaml`.

Note that currently only `GovernorBravo` style governors are supported.

### Running Locally

First, create a file called `.env` with the following environment variables:

```sh
# Etherscan API Key, used when running Slither.
ETHERSCAN_API_KEY=yourEtherscanApiKey

# URL to your node, e.g. Infura or Alchemy endpoint
RPC_URL=yourNodeUrl

# Tenderly access token
# Access token is obtained from the Tenderly UI via Account > Authorization > Generate Access Token
TENDERLY_ACCESS_TOKEN=yourAccessToken

# Tenderly project slug
# Project slug can be found in the URL of your project: https://dashboard.tenderly.co/<username>/<project_slug>/transactions
TENDERLY_PROJECT_SLUG=projectName

# Define the DAO name and the address of its governor
DAO_NAME=Uniswap
GOVERNOR_ADDRESS=0x408ED6354d4973f66138C91495F2f2FCbd8724C3
```

There are now two modes of operation:

1. Run `yarn start` to simulate and run checks on all GovernorBravo proposals
2. Create a file called `<analysisName>.sim.ts` and run a specific simulation with `SIM_NAME=analysisName yarn start`. See the `*.sim.ts` files in the `sims` folder for examples.
