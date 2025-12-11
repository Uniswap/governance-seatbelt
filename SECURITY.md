# Security Policy

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please report it responsibly.

**DO NOT** open a public GitHub issue for security vulnerabilities.

Instead, use [GitHub Security Advisories](https://github.com/uniswapfoundation/governance-seatbelt/security/advisories/new) to report vulnerabilities privately.

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Response Timeline

- **Initial Response:** Within 48 hours
- **Status Update:** Within 7 days
- **Resolution Target:** Within 30 days for critical issues

## Secrets Management

This repository follows these security practices:

### Environment Variables

All sensitive data is loaded from environment variables, never hardcoded. See [docs/KEY_MANAGEMENT.md](docs/KEY_MANAGEMENT.md) for details.

### Git Security

- `.env` files are gitignored
- Gitleaks scans all PRs for accidentally committed secrets
- Husky pre-commit hooks run secretlint locally

### CI/CD

- GitHub Actions use encrypted secrets (`${{ secrets.* }}`)
- Secrets are scoped to the `ci` environment where appropriate

## Required Secrets

| Secret | Purpose |
|--------|---------|
| `ETHERSCAN_API_KEY` | Contract ABI fetching |
| `TENDERLY_ACCESS_TOKEN` | Simulation API |
| `RPC_URL` / `MAINNET_RPC_URL` | Blockchain access |
| `ARBITRUM_RPC_URL` | Arbitrum L2 access |

## Simulation Security

Governance simulations are executed in isolated Tenderly environments and do not interact with mainnet funds or execute real transactions.
