/**
 * Security-related constants that can be imported without triggering
 * environment variable validation. Safe to use in tests.
 */

// Regex for validating Ethereum addresses (prevents injection attacks)
export const ETH_ADDRESS_REGEX = /^0x[0-9a-fA-F]{40}$/;

// Security tool execution timeout (default: 5 minutes)
// Can be overridden via SECURITY_TOOL_TIMEOUT_MS environment variable
const DEFAULT_SECURITY_TOOL_TIMEOUT_MS = 300_000;

function parseSecurityToolTimeout(): number {
  const envValue = process.env.SECURITY_TOOL_TIMEOUT_MS;
  if (!envValue) return DEFAULT_SECURITY_TOOL_TIMEOUT_MS;

  const parsed = Number.parseInt(envValue, 10);

  // Validate: must be a finite positive integer
  if (!Number.isFinite(parsed) || parsed <= 0) {
    console.warn(
      `Invalid SECURITY_TOOL_TIMEOUT_MS value "${envValue}", using default ${DEFAULT_SECURITY_TOOL_TIMEOUT_MS}ms`,
    );
    return DEFAULT_SECURITY_TOOL_TIMEOUT_MS;
  }

  return parsed;
}

export const SECURITY_TOOL_TIMEOUT_MS = parseSecurityToolTimeout();
