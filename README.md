# @uniswap/governance-seatbelt

This repository contains tools that make on-chain governance safer,
including automated scripts that apply checks to live proposals to allow
for better informed voting.

## Reports

Find the reports [here](https://github.com/Uniswap/governance-seatbelt/tree/reports) when run in CI,
or in the `reports` folder if running locally.

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
# URL to your node, e.g. Infura or Alchemy endpoint
RPC_URL=yourNodeUrl

# Tenderly access token
# Access token is obtained from the Tenderly UI via Account > Authorization > Generate Access Token
TENDERLY_ACCESS_TOKEN=yourAccessToken

# Tenderly project slug
# Project slug can be found in the URL of your project: https://dashboard.tenderly.co/<username>/<project_slug>/transactions
TENDERLY_PROJECT_SLUG=projectName

# Set to 1 if running locally, or 0 for CI
RUNNING_LOCALLY=1

# Define the DAO name and the address of its governor
DAO_NAME=Uniswap
GOVERNOR_ADDRESS=0x408ED6354d4973f66138C91495F2f2FCbd8724C3
```

There are now two modes of operation:

1. Run `yarn start` to simulate and run checks on all GovernorBravo proposals
2. Create a file called `<analysisName>.sim.ts` and run a specific simulation with `SIM_NAME=analysisName yarn start:sim`. See `compound-43.sim.ts` for an example.
