export interface WalletRetryPolicy {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  jitter: boolean;
}

export interface WalletNetworkHealth {
  service: string;
  healthy: boolean;
  region: string;
  avgLatencyMs: number;
  packetLossPercent: number;
  generatedAt: string;
}

const MAX_JITTER_MS = 250;
const JITTER_PERCENTAGE = 0.1;

export const defaultWalletRetryPolicy: WalletRetryPolicy = {
  maxRetries: 5,
  baseDelayMs: 250,
  maxDelayMs: 8_000,
  jitter: true,
};

export function computeBackoffDelay(attempt: number, policy = defaultWalletRetryPolicy): number {
  const exp = Math.min(policy.baseDelayMs * 2 ** attempt, policy.maxDelayMs);
  if (!policy.jitter) return exp;
  const jitter = Math.round(Math.random() * Math.min(MAX_JITTER_MS, exp * JITTER_PERCENTAGE));
  return exp + jitter;
}

export function getWalletNetworkHealth(region = 'GLOBAL'): WalletNetworkHealth {
  return {
    service: 'wallet-network',
    healthy: true,
    region,
    avgLatencyMs: region === 'RS' ? 72 : 118,
    packetLossPercent: 0.14,
    generatedAt: new Date().toISOString(),
  };
}
