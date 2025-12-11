# API Key Management

This document provides a reference for the API keys and secrets required by governance-seatbelt.

## Required Secrets

| Secret | Purpose | Where to Obtain |
|--------|---------|-----------------|
| `ETHERSCAN_API_KEY` | Contract ABI fetching, verification | [Etherscan API Keys](https://etherscan.io/myapikey) |
| `RPC_URL` | Ethereum mainnet access | Infura, Alchemy, or other RPC provider |
| `MAINNET_RPC_URL` | Explicit mainnet RPC for cross-chain | Same as RPC_URL |
| `ARBITRUM_RPC_URL` | Arbitrum L2 access | [Alchemy](https://dashboard.alchemy.com/) or [Infura](https://infura.io/) |
| `TENDERLY_ACCESS_TOKEN` | Simulation API access | [Tenderly Dashboard](https://dashboard.tenderly.co/) > Account > Authorization |
| `TENDERLY_USER` | Tenderly org/user identifier | Your Tenderly username or org name |
| `TENDERLY_PROJECT_SLUG` | Tenderly project identifier | From your Tenderly project URL |

## Optional Secrets

| Secret | Purpose | When Needed |
|--------|---------|-------------|
| `OPTIMISM_RPC_URL` | Optimism L2 access | Cross-chain proposals targeting Optimism |
| `BASE_RPC_URL` | Base L2 access | Cross-chain proposals targeting Base |
| `ALCHEMY_API_KEY` | Fallback for optional chain RPCs | When chain-specific RPC URLs aren't set |

## Local Development

Copy `.env.example` to `.env` and fill in your keys:

```bash
cp .env.example .env
```

## GitHub Actions (CI)

Secrets are configured at the repository level and in the `ci` environment.

### Updating a GitHub Secret

1. Go to **Repository Settings** > **Secrets and variables** > **Actions**
2. Click on the secret to update, or create a new one
3. For environment-specific secrets, navigate to **Environments** > **ci** > **Environment secrets**
4. Enter the new value and save

### Verification After Update

After updating any secret, verify the change works:

1. Trigger a manual workflow run:
   - Go to **Actions** > **Governance Checks** > **Run workflow**
2. Check the workflow completes without API errors
3. For local changes, run:
   ```bash
   SIM_NAME=uni-transfer bun start
   ```

## Replacing a Compromised Key

If you suspect a key has been compromised:

1. **Revoke immediately** at the source (Etherscan, Tenderly, RPC provider)
2. Generate a new key
3. Update GitHub Secrets (both repository and `ci` environment)
4. Update local `.env` files
5. Notify team members to update their local environments
6. Verify with a test workflow run
