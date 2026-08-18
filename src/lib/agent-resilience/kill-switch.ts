// SpajaUltraOmegaCore -∞Ω+∞ — Agent Resilience: Kill Switch
// Kompanija SPAJA — Digitalna Industrija
//
// Hard-stop kill switch for misbehaving agents.
// Backed by in-memory store with full audit log.

import type { KillSwitchReason, KillSwitchRecord, KillSwitchEvent } from './types';
import {
  getOrCreateEntry,
  setKillSwitchRecord,
  appendKillSwitchEvent,
} from './store';

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Marks an agent as KILLED. Idempotent — triggering twice does not overwrite the
 * original event, but appends to the kill switch log.
 *
 * @param agentId   - Unique agent identifier
 * @param reason    - Machine-readable kill reason
 * @param triggeredBy - Caller identity (agent id, admin user, system)
 * @param message   - Optional human-readable context
 */
export function triggerKillSwitch(
  agentId: string,
  reason: KillSwitchReason,
  triggeredBy: string,
  message?: string,
): KillSwitchRecord {
  const entry = getOrCreateEntry(agentId);
  const now = new Date().toISOString();

  const event: KillSwitchEvent = {
    agentId,
    reason,
    triggeredBy,
    timestamp: now,
    message,
  };

  appendKillSwitchEvent(agentId, event);

  const record: KillSwitchRecord = {
    agentId,
    killed: true,
    event: entry.killSwitch.event ?? event, // preserve original event
    clearedAt: null,
    clearedBy: null,
  };

  setKillSwitchRecord(agentId, record);
  return record;
}

/**
 * Fast check — returns true if the agent's kill switch is active.
 * Should be called at every agent entry point before any work begins.
 */
export function isKilled(agentId: string): boolean {
  const entry = getOrCreateEntry(agentId);
  return entry.killSwitch.killed;
}

/**
 * Clears the kill switch for an agent (manual recovery or system reset).
 */
export function clearKillSwitch(agentId: string, clearedBy: string): KillSwitchRecord {
  const entry = getOrCreateEntry(agentId);
  const now = new Date().toISOString();

  const record: KillSwitchRecord = {
    ...entry.killSwitch,
    killed: false,
    clearedAt: now,
    clearedBy,
  };

  setKillSwitchRecord(agentId, record);
  return record;
}

/**
 * Returns the full kill switch record for an agent.
 */
export function getKillSwitchRecord(agentId: string): KillSwitchRecord {
  return getOrCreateEntry(agentId).killSwitch;
}

/**
 * Returns all kill switch events ever recorded for an agent (audit trail).
 */
export function getKillSwitchLog(agentId: string): KillSwitchEvent[] {
  return getOrCreateEntry(agentId).killSwitchLog;
}
