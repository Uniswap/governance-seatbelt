# Arbitrum Crosschain Seatbelt

This repository is a modified version of the Uniswap governance-seatbelt that supports Arbitrum Crosschain Governance.

To test it out, configure .env and run

```
// To simulate AIP 1.2
SIM_NAME=arbcore-aip1.2 yarn start
// To simulate onchain proposals
yarn start
```

## Known Issues

- Arbitrum Nova is not supported
- Incorrect time due to crosschain block number
- When simulating executed proposal with retryable, it cannot determine the correct L2 block to use
- ID scheme for child simulation is weird
