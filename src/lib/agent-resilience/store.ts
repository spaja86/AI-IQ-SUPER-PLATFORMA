// SpajaUltraOmegaCore -∞Ω+∞ — Agent Resilience: Store
// Kompanija SPAJA — Digitalna Industrija
//
// In-memory persistence store za circuit breaker state, kill switch records,
// transition logs i recovery history.

import { randomUUID } from 'crypto';
import type {
  ResilienceStoreEntry,
  CircuitBreakerState,
  KillSwitchRecord,
  KillSwitchEvent,
  CircuitStateTransitionEvent,
  AgentResilienceConfig,
} from './types';
import { DEFAULT_RESILIENCE_CONFIG } from './types';

// ─── In-memory store ─────────────────────────────────────────────────────────

const entries = new Map<string, ResilienceStoreEntry>();

// ─── Helpers ─────────────────────────────────────────────────────────────────

function defaultCircuitState(agentId: string): CircuitBreakerState {
  const now = new Date().toISOString();
  return {
    agentId,
    state: 'CLOSED',
    consecutiveFailures: 0,
    consecutiveSuccesses: 0,
    lastStateChange: now,
    lastFailureAt: null,
    lastSuccessAt: null,
    totalFailures: 0,
    totalSuccesses: 0,
  };
}

function defaultKillSwitchRecord(agentId: string): KillSwitchRecord {
  return {
    agentId,
    killed: false,
    event: null,
    clearedAt: null,
    clearedBy: null,
  };
}

// ─── Entry access ─────────────────────────────────────────────────────────────

/**
 * Returns the store entry for an agent, initializing with defaults if absent.
 */
export function getOrCreateEntry(
  agentId: string,
  config: AgentResilienceConfig = DEFAULT_RESILIENCE_CONFIG,
): ResilienceStoreEntry {
  if (!entries.has(agentId)) {
    entries.set(agentId, {
      agentId,
      circuit: defaultCircuitState(agentId),
      killSwitch: defaultKillSwitchRecord(agentId),
      config,
      recoveryAttempts: 0,
      lastRecoveryAt: null,
      transitionLog: [],
      killSwitchLog: [],
    });
  }
  return entries.get(agentId)!;
}

export function getEntry(agentId: string): ResilienceStoreEntry | null {
  return entries.get(agentId) ?? null;
}

export function setCircuitState(agentId: string, state: CircuitBreakerState): void {
  const entry = getOrCreateEntry(agentId);
  entry.circuit = state;
}

export function appendTransitionEvent(agentId: string, event: CircuitStateTransitionEvent): void {
  const entry = getOrCreateEntry(agentId);
  entry.transitionLog.push(event);
}

export function setKillSwitchRecord(agentId: string, record: KillSwitchRecord): void {
  const entry = getOrCreateEntry(agentId);
  entry.killSwitch = record;
}

export function appendKillSwitchEvent(agentId: string, event: KillSwitchEvent): void {
  const entry = getOrCreateEntry(agentId);
  entry.killSwitchLog.push(event);
}

export function incrementRecoveryAttempts(agentId: string): void {
  const entry = getOrCreateEntry(agentId);
  entry.recoveryAttempts += 1;
  entry.lastRecoveryAt = new Date().toISOString();
}

export function getAllEntries(): ResilienceStoreEntry[] {
  return Array.from(entries.values());
}

/**
 * Resets the store (test use only).
 */
export function _resetResilienceStore(): void {
  entries.clear();
}

/** Exported only for testing — generates a uuid. */
export { randomUUID };
