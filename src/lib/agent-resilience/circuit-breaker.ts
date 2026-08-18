// SpajaUltraOmegaCore -∞Ω+∞ — Agent Resilience: Circuit Breaker
// Kompanija SPAJA — Digitalna Industrija
//
// Three-state circuit breaker: CLOSED → OPEN → HALF-OPEN → CLOSED
// Trips automatically on consecutive failure threshold.
// Probes after timeout expires (HALF-OPEN), closes on success threshold.

import type {
  CircuitBreakerConfig,
  CircuitBreakerState,
  CircuitState,
  CircuitStateTransitionEvent,
} from './types';
import {
  getOrCreateEntry,
  setCircuitState,
  appendTransitionEvent,
} from './store';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function transitionTo(
  agentId: string,
  current: CircuitBreakerState,
  to: CircuitState,
  reason: string,
): CircuitBreakerState {
  const now = new Date().toISOString();
  const event: CircuitStateTransitionEvent = {
    agentId,
    from: current.state,
    to,
    reason,
    timestamp: now,
  };
  appendTransitionEvent(agentId, event);

  const updated: CircuitBreakerState = {
    ...current,
    state: to,
    lastStateChange: now,
    consecutiveFailures: to === 'CLOSED' || to === 'HALF-OPEN' ? 0 : current.consecutiveFailures,
    consecutiveSuccesses: to === 'OPEN' ? 0 : current.consecutiveSuccesses,
  };
  setCircuitState(agentId, updated);
  return updated;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Checks whether the circuit allows a call to proceed.
 * - CLOSED: always allows.
 * - OPEN: blocks unless timeout has elapsed (then transitions to HALF-OPEN).
 * - HALF-OPEN: allows one probe call.
 *
 * Returns `true` if the call is allowed, `false` if blocked.
 */
export function isCallAllowed(agentId: string, config: CircuitBreakerConfig): boolean {
  const entry = getOrCreateEntry(agentId, { ...config, autoHeal: false, recoveryWindow: 60_000 });
  const circuit = entry.circuit;

  if (circuit.state === 'CLOSED') return true;

  if (circuit.state === 'OPEN') {
    const elapsed = Date.now() - new Date(circuit.lastStateChange).getTime();
    if (elapsed >= config.timeout) {
      transitionTo(agentId, circuit, 'HALF-OPEN', `Timeout elapsed (${elapsed}ms >= ${config.timeout}ms)`);
      return true; // probe call allowed
    }
    return false;
  }

  // HALF-OPEN: allow one probe
  return true;
}

/**
 * Records a successful call. Moves HALF-OPEN → CLOSED after successThreshold.
 */
export function recordSuccess(agentId: string, config: CircuitBreakerConfig): CircuitBreakerState {
  const entry = getOrCreateEntry(agentId, { ...config, autoHeal: false, recoveryWindow: 60_000 });
  const now = new Date().toISOString();

  let circuit: CircuitBreakerState = {
    ...entry.circuit,
    consecutiveFailures: 0,
    consecutiveSuccesses: entry.circuit.consecutiveSuccesses + 1,
    totalSuccesses: entry.circuit.totalSuccesses + 1,
    lastSuccessAt: now,
  };
  setCircuitState(agentId, circuit);

  if (circuit.state === 'HALF-OPEN' && circuit.consecutiveSuccesses >= config.successThreshold) {
    circuit = transitionTo(agentId, circuit, 'CLOSED', `Success threshold reached (${circuit.consecutiveSuccesses})`);
  }

  return circuit;
}

/**
 * Records a failed call. Trips the circuit CLOSED/HALF-OPEN → OPEN after failureThreshold.
 */
export function recordFailure(agentId: string, config: CircuitBreakerConfig): CircuitBreakerState {
  const entry = getOrCreateEntry(agentId, { ...config, autoHeal: false, recoveryWindow: 60_000 });
  const now = new Date().toISOString();

  let circuit: CircuitBreakerState = {
    ...entry.circuit,
    consecutiveFailures: entry.circuit.consecutiveFailures + 1,
    consecutiveSuccesses: 0,
    totalFailures: entry.circuit.totalFailures + 1,
    lastFailureAt: now,
  };
  setCircuitState(agentId, circuit);

  if (circuit.state !== 'OPEN' && circuit.consecutiveFailures >= config.failureThreshold) {
    circuit = transitionTo(
      agentId,
      circuit,
      'OPEN',
      `Failure threshold reached (${circuit.consecutiveFailures} >= ${config.failureThreshold})`,
    );
  }

  return circuit;
}

/**
 * Manually resets the circuit breaker to HALF-OPEN (used by recovery flow).
 */
export function resetCircuit(agentId: string, config: CircuitBreakerConfig): CircuitBreakerState {
  const entry = getOrCreateEntry(agentId, { ...config, autoHeal: false, recoveryWindow: 60_000 });
  return transitionTo(agentId, entry.circuit, 'HALF-OPEN', 'Manual reset via recovery');
}

/**
 * Returns the current circuit state for an agent.
 */
export function getCircuitState(agentId: string): CircuitBreakerState {
  return getOrCreateEntry(agentId).circuit;
}
