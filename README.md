# @uniswap/governance-seatbelt

This repository contains tools that make on-chain governance safer,
including automated scripts that apply checks to live proposals to allow
for better informed voting.

## Reports

Find the reports [here](https://github.com/Uniswap/governance-seatbelt/tree/reports) when run in CI, or in the `reports` folder if running locally

## Development

Create a file called `.env` with the following environment variables:

```sh
# URL to your node, e.g. Infura or Alchemy endpoint
RPC_URL=yourNodeUrl

# Etherscan API key: https://etherscan.io/myapikey
ETHERSCAN_API_KEY=yourEtherscanApiKey

# Name of the DAO to check
DAO_NAME=Compound

# Address of that DAO's governor contract
GOVERNOR_ADDRESS=0xc0Da02939E1441F497fd74F78cE7Decb17B66529

# Set to 1 if running locally, or 0 for CI
RUNNING_LOCALLY=1
```

Other environment variables needed for CI can be found in `.github/workflows/governance-checks.yaml`
