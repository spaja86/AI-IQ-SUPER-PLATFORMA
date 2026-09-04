// SpajaUltraOmegaCore -∞Ω+∞ — Agent Resilience: withResilience Wrapper
// Kompanija SPAJA — Digitalna Industrija
//
// Higher-order wrapper that gates any agent handler through the kill switch
// and circuit breaker, and records results for health monitoring.
//
// Usage:
//   const protectedHandler = withResilience('my-agent', config)(originalHandler);
//   const result = await protectedHandler(input);

import type { AgentResilienceConfig } from './types';
import { DEFAULT_RESILIENCE_CONFIG } from './types';
import { isKilled, triggerKillSwitch } from './kill-switch';
import { isCallAllowed, recordSuccess, recordFailure } from './circuit-breaker';
import { checkAutoHeal } from './health-monitor';

// ─── Errors ──────────────────────────────────────────────────────────────────

export class AgentKilledError extends Error {
  constructor(public readonly agentId: string) {
    super(`Agent "${agentId}" is killed. All invocations are blocked.`);
    this.name = 'AgentKilledError';
  }
}

export class CircuitOpenError extends Error {
  constructor(public readonly agentId: string) {
    super(`Agent "${agentId}" circuit is OPEN. Call rejected.`);
    this.name = 'CircuitOpenError';
  }
}

// ─── Wrapper ─────────────────────────────────────────────────────────────────

/**
 * Wraps an agent handler with resilience controls.
 *
 * Call order per invocation:
 *   1. Check kill switch → throw AgentKilledError if active
 *   2. Check circuit breaker → throw CircuitOpenError if OPEN and timeout not elapsed
 *   3. Run auto-heal if applicable
 *   4. Execute handler
 *   5a. On success: record success
 *   5b. On error: record failure; if threshold reached, trip circuit
 *        and auto-trigger kill switch on CRITICAL_ERROR escalation
 */
export function withResilience<TInput, TOutput>(
  agentId: string,
  config: AgentResilienceConfig = DEFAULT_RESILIENCE_CONFIG,
) {
  return function wrap(
    handler: (input: TInput) => Promise<TOutput>,
  ): (input: TInput) => Promise<TOutput> {
    return async function resilientHandler(input: TInput): Promise<TOutput> {
      // ── 1. Kill switch check ──────────────────────────────────────────────
      if (isKilled(agentId)) {
        throw new AgentKilledError(agentId);
      }

      // ── 2. Circuit breaker check ──────────────────────────────────────────
      if (!isCallAllowed(agentId, config)) {
        // Try auto-heal before rejecting
        checkAutoHeal(agentId, config);

        // Re-check after potential auto-heal
        if (!isCallAllowed(agentId, config)) {
          throw new CircuitOpenError(agentId);
        }
      }

      // ── 3. Execute handler ────────────────────────────────────────────────
      try {
        const result = await handler(input);
        recordSuccess(agentId, config);
        return result;
      } catch (err) {
        const circuit = recordFailure(agentId, config);

        // ── 4. Escalation: trip to kill switch if circuit just opened
        //       and the error looks like a CRITICAL_ERROR ─────────────────
        if (circuit.state === 'OPEN' && circuit.consecutiveFailures >= config.failureThreshold) {
          const message = err instanceof Error ? err.message : String(err);
          if (!isKilled(agentId)) {
            triggerKillSwitch(agentId, 'CRITICAL_ERROR', 'with-resilience', message);
          }
        }

        throw err;
      }
    };
  };
}
