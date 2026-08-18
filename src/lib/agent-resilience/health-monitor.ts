// SpajaUltraOmegaCore -∞Ω+∞ — Agent Resilience: Health Monitor
// Kompanija SPAJA — Digitalna Industrija
//
// Self-healing diagnostics: runDiagnostic, attemptRecovery, auto-heal scheduling.

import type {
  AgentHealthReport,
  AgentResilienceConfig,
  AgentStatus,
  RecoveryAttemptResult,
} from './types';
import { DEFAULT_RESILIENCE_CONFIG } from './types';
import { getOrCreateEntry, incrementRecoveryAttempts, getAllEntries } from './store';
import { resetCircuit, getCircuitState } from './circuit-breaker';
import { isKilled, getKillSwitchRecord, clearKillSwitch } from './kill-switch';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function deriveStatus(
  killed: boolean,
  circuitState: string,
  errorRate: number,
): AgentStatus {
  if (killed) return 'KILLED';
  if (circuitState === 'OPEN') return 'TRIPPED';
  if (circuitState === 'HALF-OPEN' || errorRate > 0.2) return 'DEGRADED';
  return 'HEALTHY';
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Generates a full health report for the given agent.
 * Does not mutate any state — purely diagnostic.
 */
export function runDiagnostic(
  agentId: string,
  config: AgentResilienceConfig = DEFAULT_RESILIENCE_CONFIG,
): AgentHealthReport {
  const entry = getOrCreateEntry(agentId, config);
  const circuit = entry.circuit;
  const ks = entry.killSwitch;

  const total = circuit.totalSuccesses + circuit.totalFailures;
  const errorRate = total > 0 ? circuit.totalFailures / total : 0;

  const lastErrorMessage =
    entry.transitionLog.length > 0
      ? entry.transitionLog
          .filter((e) => e.to === 'OPEN')
          .at(-1)?.reason ?? null
      : null;

  return {
    agentId,
    status: deriveStatus(ks.killed, circuit.state, errorRate),
    circuit,
    killSwitch: ks,
    errorRate,
    lastErrorMessage,
    lastCheckedAt: new Date().toISOString(),
    recoveryAttempts: entry.recoveryAttempts,
    lastRecoveryAt: entry.lastRecoveryAt,
  };
}

/**
 * Attempts to recover a failing agent:
 * 1. Resets the circuit breaker to HALF-OPEN.
 * 2. Optionally clears the kill switch if it was set by CRITICAL_ERROR (auto-heal only).
 *
 * Returns a result describing what happened.
 */
export function attemptRecovery(
  agentId: string,
  config: AgentResilienceConfig = DEFAULT_RESILIENCE_CONFIG,
  initiatedBy = 'health-monitor',
): RecoveryAttemptResult {
  incrementRecoveryAttempts(agentId);
  const timestamp = new Date().toISOString();

  const killed = isKilled(agentId);
  const ks = getKillSwitchRecord(agentId);

  // If killed by MANUAL or SECURITY, do not auto-clear — requires explicit admin action
  if (killed) {
    const reason = ks.event?.reason;
    if (reason === 'MANUAL' || reason === 'SECURITY') {
      return {
        agentId,
        success: false,
        message: `Kill switch active (reason: ${reason}). Manual admin clearance required.`,
        timestamp,
      };
    }
    // Auto-clearable reasons: CRITICAL_ERROR, LOOP_DETECTED, RESOURCE_EXHAUSTED
    clearKillSwitch(agentId, initiatedBy);
  }

  // Reset circuit to HALF-OPEN so the next call is a probe
  resetCircuit(agentId, config);

  return {
    agentId,
    success: true,
    message: killed
      ? `Kill switch cleared (was ${ks.event?.reason}). Circuit reset to HALF-OPEN.`
      : 'Circuit reset to HALF-OPEN. Agent will probe on next call.',
    timestamp,
  };
}

/**
 * Runs auto-heal check for a single agent: if circuit is OPEN and autoHeal is
 * enabled and recoveryWindow has elapsed since last state change, attempts recovery.
 */
export function checkAutoHeal(
  agentId: string,
  config: AgentResilienceConfig = DEFAULT_RESILIENCE_CONFIG,
): RecoveryAttemptResult | null {
  if (!config.autoHeal) return null;

  const circuit = getCircuitState(agentId);
  if (circuit.state !== 'OPEN') return null;

  const elapsed = Date.now() - new Date(circuit.lastStateChange).getTime();
  if (elapsed < config.recoveryWindow) return null;

  return attemptRecovery(agentId, config, 'auto-heal');
}

/**
 * Returns health reports for all registered agents.
 */
export function getAllHealthReports(): AgentHealthReport[] {
  return getAllEntries().map((entry) => runDiagnostic(entry.agentId, entry.config));
}
