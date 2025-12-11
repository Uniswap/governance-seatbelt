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
- ETH balance changes are reported in a dedicated section, showing transfers and net balance changes for each address involved

## Proposing via Frontend

This repository also includes a frontend application that allows you to visualize simulation results and create proposals.

### Running the Frontend

To run the frontend with simulation results:

1. Run a simulation first:

   ```sh
   # run a specific simulation
   SIM_NAME=uni-transfer bun run sim
   ```

2. Start the frontend:

   ```sh
   bun run propose
   ```

3. Or do both in one command:

   ```sh
   # Run specific simulation and start frontend
   SIM_NAME=uni-transfer bun run propose
   ```

The frontend will be available at `http://localhost:3000`.

### Creating Proposals

The frontend allows you to:

1. View simulation results including state changes, events, and checks the same way reports are visualized
2. Connect your wallet to sign and submit proposals using the proposal data

### Environment setup

You will need to set up a `.env.local` file in the frontend folder according to the example [.env.local](/frontend/.env.local.example)

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

1. Run `bun start` to simulate and run checks on all Governor proposals.
2. Alternatively, create a file called `<analysisName>.sim.ts` and run a specific simulation with `SIM_NAME=analysisName bun start`. See the `*.sim.ts` files in the `sims` folder for examples.

When running either of those two modes locally, reports will be saved into a `reports/` folder in the root of the repository.
The specific path will be `./reports/${daoName}/${governorAddress}/${proposalId}.${extension}`.
The `reports/` folder is gitignored, so when searching for reports in this directory your editor may hide the files by default.

### Running Tests

To run the tests:

```sh
cd checks
bun test
```

Or to run a specific test file:

```sh
cd checks
bun test tests/check-eth-balance-changes.test.ts
```

Currently, there is a test for the ETH balance changes check, which verifies that the check correctly identifies and reports ETH transfers and balance changes. As new checks are added or existing checks are modified, corresponding tests should be added to ensure their functionality. The test framework is set up to use Bun's built-in testing capabilities and can be extended to cover additional checks in the future.

## Using Seatbelt for Other DAOs

Seatbelt supports any Governor Bravo or OpenZeppelin Governor contract, making it suitable for governance safety analysis across the ecosystem.

### Setup for Other DAOs

To use Seatbelt with a different DAO:

1. **Fork this repository** to your organization
2. **Update environment variables** in your `.env` file:
   ```bash
   DAO_NAME=YourDAO
   GOVERNOR_ADDRESS=0x... # Your governor contract address
   ```
3. **Test the setup** with a known proposal:
   ```bash
   bun start
   ```

### Supported Governor Types

- **Governor Bravo**: Used by Compound, Uniswap, and many others
- **OpenZeppelin Governor**: Modern governor standard

The system automatically detects the governor type, so no manual configuration is needed.

### Example Configurations

**Compound:**
```bash
DAO_NAME=Compound
GOVERNOR_ADDRESS=0xc0Da02939E1441F497fd74F78cE7Decb17B66529

# Check all proposals
bun start

# Check specific proposal
bun run check-proposal 43
```

**Custom DAO:**
```bash
DAO_NAME=YourDAO
GOVERNOR_ADDRESS=0x... # Your governor address
bun start
```

### Custom Simulations

For hypothetical or new proposals, create a simulation file in `sims/`:

```typescript
// sims/my-proposal.sim.ts
export const config = {
  type: 'proposed', // or 'executed'
  daoName: 'Compound',
  governorAddress: '0xc0Da02939E1441F497fd74F78cE7Decb17B66529',
  governorType: 'bravo',
  // ... proposal details
};
```

Then run: `SIM_NAME=my-proposal bun start`

### Testing Setup

To verify your setup works:
```bash
# Test with existing simulation
SIM_NAME=compound-43 bun start
```

## Security

### Pre-commit Hooks

This repository uses Husky to run secretlint before each commit, preventing accidental secret leaks. Hooks install automatically when you run `bun install`.

### Reporting Vulnerabilities

See [SECURITY.md](SECURITY.md) for our security policy and vulnerability reporting process.
