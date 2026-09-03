import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

type SupabaseServerClient = ReturnType<typeof createClient<Database>>;

export interface SupabasePoolSnapshot {
  poolName: string;
  mode: 'singleton-http-client-pool';
  maxClients: number;
  allocatedClients: number;
  availableSlots: number;
  utilizationPct: number;
  urlConfigured: boolean;
  serviceRoleConfigured: boolean;
  status: 'ok' | 'degraded' | 'offline';
  lastAccessedAt: string | null;
  generatedAt: string;
}

interface SupabasePoolState {
  client: SupabaseServerClient | null;
  maxClients: number;
  lastAccessedAt: string | null;
  urlConfigured: boolean;
  serviceRoleConfigured: boolean;
}

const DEFAULT_MAX_CLIENTS = 10;
const POOLS = new Map<string, SupabasePoolState>();

function normalizePoolName(poolName: string): string {
  return poolName.trim().toLowerCase() || 'default';
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function getState(poolName: string): SupabasePoolState {
  const normalized = normalizePoolName(poolName);
  const existing = POOLS.get(normalized);
  if (existing) return existing;

  const created: SupabasePoolState = {
    client: null,
    maxClients: DEFAULT_MAX_CLIENTS,
    lastAccessedAt: null,
    urlConfigured: false,
    serviceRoleConfigured: false,
  };
  POOLS.set(normalized, created);
  return created;
}

export function getPooledSupabaseServerClient(poolName: string, url: string, serviceKey: string): SupabaseServerClient {
  const state = getState(poolName);
  state.urlConfigured = Boolean(url);
  state.serviceRoleConfigured = Boolean(serviceKey);
  state.lastAccessedAt = new Date().toISOString();

  if (!state.client) {
    state.client = createClient<Database>(url, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return state.client;
}

export function getSupabaseServerPoolSnapshot(
  poolName = 'default',
  opts?: { urlConfigured?: boolean; serviceRoleConfigured?: boolean },
): SupabasePoolSnapshot {
  const normalized = normalizePoolName(poolName);
  const state = getState(normalized);

  if (typeof opts?.urlConfigured === 'boolean') {
    state.urlConfigured = opts.urlConfigured;
  }
  if (typeof opts?.serviceRoleConfigured === 'boolean') {
    state.serviceRoleConfigured = opts.serviceRoleConfigured;
  }

  const allocatedClients = state.client ? 1 : 0;
  const availableSlots = Math.max(0, state.maxClients - allocatedClients);
  const utilizationPct = round((allocatedClients / state.maxClients) * 100);
  const configured = state.urlConfigured && state.serviceRoleConfigured;
  const status = !configured ? 'offline' : utilizationPct >= 90 ? 'degraded' : 'ok';

  return {
    poolName: normalized,
    mode: 'singleton-http-client-pool',
    maxClients: state.maxClients,
    allocatedClients,
    availableSlots,
    utilizationPct,
    urlConfigured: state.urlConfigured,
    serviceRoleConfigured: state.serviceRoleConfigured,
    status,
    lastAccessedAt: state.lastAccessedAt,
    generatedAt: new Date().toISOString(),
  };
}

export function resetSupabasePoolState(poolName?: string): void {
  if (poolName) {
    POOLS.delete(normalizePoolName(poolName));
    return;
  }
  POOLS.clear();
}
