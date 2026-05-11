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

export const defaultWalletRetryPolicy: WalletRetryPolicy = {
  maxRetries: 5,
  baseDelayMs: 250,
  maxDelayMs: 8_000,
  jitter: true,
};

export function computeBackoffDelay(attempt: number, policy = defaultWalletRetryPolicy): number {
  const exp = Math.min(policy.baseDelayMs * 2 ** attempt, policy.maxDelayMs);
  if (!policy.jitter) return exp;
  const jitter = Math.round(Math.random() * Math.min(250, exp * 0.1));
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
