# @uniswap/governance-seatbelt

This repository contains tools that make on-chain governance safer,
including automated scripts that apply checks to live proposals to allow
for better informed voting.

## Reports

Find the reports [here](https://github.com/Uniswap/governance-seatbelt/tree/reports) when run in CI,
or in the `reports` folder if running locally

## Usage

1. Create a file called `.env` with the following environment variables:

```sh
# URL to your node, e.g. Infura or Alchemy endpoint
RPC_URL=yourNodeUrl

# Tenderly access token
# Access token is obtained from the Tenderly UI via Account > Authorization > Generate Access Token
TENDERLY_ACCESS_TOKEN=yourAccessToken

# Tenderly project slug
# Project slug can be found in the URL of your project: https://dashboard.tenderly.co/<username>/<project_slug>/transactions
TENDERLY_PROJECT_SLUG=projectName

# Set to 1 if running locally, or 0 for CI (a value of 0 is currently unsupported)
RUNNING_LOCALLY=1
```

Other environment variables needed for CI can be found in `.github/workflows/governance-checks.yaml`.
Note that support for running in CI has not yet been added back.

2. In the `sims` folder, create a file called `<analysisName>.sim.ts`

3. Run the simulation with `SIM_NAME=analysisName yarn start:sim`
