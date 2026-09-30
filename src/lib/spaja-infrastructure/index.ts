export type SpajaInfrastructureCapability = 'transactions' | 'object-storage' | 'cache' | 'queue' | 'search';
export type SpajaInfrastructureReadiness = 'READY' | 'PARTIAL' | 'UNCONFIGURED';

export interface SpajaInfrastructureAdapter {
  id: 'supabase-postgres' | 'vercel-blob' | 'upstash-redis';
  role: 'system-of-record' | 'object-storage' | 'cache-and-rate-limit';
  capabilities: readonly SpajaInfrastructureCapability[];
  readiness: SpajaInfrastructureReadiness;
  configured: boolean;
  missingConfiguration: readonly string[];
}

export interface SpajaInfrastructureHealth {
  product: 'SPAJA SERVER / SPAJA BAZA';
  version: 'v1';
  runtime: 'vercel-functions';
  readiness: SpajaInfrastructureReadiness;
  adapters: readonly SpajaInfrastructureAdapter[];
  guarantees: readonly string[];
  limits: readonly string[];
}

function configured(...names: string[]): boolean {
  return names.every((name) => Boolean(process.env[name]));
}

function adapter(
  id: SpajaInfrastructureAdapter['id'],
  role: SpajaInfrastructureAdapter['role'],
  capabilities: readonly SpajaInfrastructureCapability[],
  requiredConfiguration: readonly string[],
): SpajaInfrastructureAdapter {
  const isConfigured = configured(...requiredConfiguration);
  return {
    id,
    role,
    capabilities,
    configured: isConfigured,
    readiness: isConfigured ? 'READY' : 'UNCONFIGURED',
    missingConfiguration: isConfigured ? [] : requiredConfiguration.filter((name) => !process.env[name]),
  };
}

/**
 * Returns deployment-safe capability metadata only. It never returns credential values.
 * SPAJA BAZA v1 is a connector control plane, not a database replacement claim.
 */
export function getSpajaInfrastructureHealth(): SpajaInfrastructureHealth {
  const adapters = [
    adapter('supabase-postgres', 'system-of-record', ['transactions', 'search'], [
      'NEXT_PUBLIC_SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
    ]),
    adapter('vercel-blob', 'object-storage', ['object-storage'], ['BLOB_READ_WRITE_TOKEN']),
    adapter('upstash-redis', 'cache-and-rate-limit', ['cache', 'queue'], [
      'VERCEL_KV_REST_API_URL',
      'VERCEL_KV_REST_API_TOKEN',
    ]),
  ] as const;

  const ready = adapters.filter((item) => item.readiness === 'READY').length;
  return {
    product: 'SPAJA SERVER / SPAJA BAZA',
    version: 'v1',
    runtime: 'vercel-functions',
    readiness: ready === adapters.length ? 'READY' : ready > 0 ? 'PARTIAL' : 'UNCONFIGURED',
    adapters,
    guarantees: [
      'Tenant isolation and authorization stay at the application boundary.',
      'Systems of record remain explicit; cache and object storage are not transaction stores.',
      'Capacity is measured and scaled by provider quotas, latency, errors, and cost.',
    ],
    limits: [
      'This module does not claim unlimited clients, storage, throughput, or database compatibility.',
      'Cross-store writes require an explicit workflow with idempotency and retry handling.',
    ],
  };
}
