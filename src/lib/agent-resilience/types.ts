// SpajaUltraOmegaCore -∞Ω+∞ — Agent Resilience: Types
// Kompanija SPAJA — Digitalna Industrija
//
// Canonical TypeScript types za Agent Kill Switch, Circuit Breaker i Self-Healing.

// ─── Agent Status ─────────────────────────────────────────────────────────────

/** Aggregate health status of an agent. */
export type AgentStatus = 'HEALTHY' | 'DEGRADED' | 'TRIPPED' | 'KILLED';

// ─── Circuit Breaker ─────────────────────────────────────────────────────────

/** Three-state circuit breaker. */
export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF-OPEN';

export interface CircuitBreakerConfig {
  /** Number of consecutive failures that trip the circuit. Default: 5 */
  failureThreshold: number;
  /** Number of consecutive successes in HALF-OPEN that close the circuit. Default: 2 */
  successThreshold: number;
  /** Milliseconds to wait before transitioning OPEN → HALF-OPEN. Default: 30_000 */
  timeout: number;
}

export interface CircuitBreakerState {
  agentId: string;
  state: CircuitState;
  consecutiveFailures: number;
  consecutiveSuccesses: number;
  lastStateChange: string; // ISO 8601
  lastFailureAt: string | null;
  lastSuccessAt: string | null;
  totalFailures: number;
  totalSuccesses: number;
}

export interface CircuitStateTransitionEvent {
  agentId: string;
  from: CircuitState;
  to: CircuitState;
  reason: string;
  timestamp: string;
}

// ─── Kill Switch ─────────────────────────────────────────────────────────────

export type KillSwitchReason =
  | 'CRITICAL_ERROR'
  | 'MANUAL'
  | 'SECURITY'
  | 'LOOP_DETECTED'
  | 'RESOURCE_EXHAUSTED';

export interface KillSwitchEvent {
  agentId: string;
  reason: KillSwitchReason;
  triggeredBy: string;
  timestamp: string;
  message?: string;
}

export interface KillSwitchRecord {
  agentId: string;
  killed: boolean;
  event: KillSwitchEvent | null;
  clearedAt: string | null;
  clearedBy: string | null;
}

// ─── Health Report ────────────────────────────────────────────────────────────

export interface AgentHealthReport {
  agentId: string;
  status: AgentStatus;
  circuit: CircuitBreakerState;
  killSwitch: KillSwitchRecord;
  errorRate: number; // 0–1
  lastErrorMessage: string | null;
  lastCheckedAt: string;
  recoveryAttempts: number;
  lastRecoveryAt: string | null;
}

// ─── Resilience Config ────────────────────────────────────────────────────────

export interface AgentResilienceConfig extends CircuitBreakerConfig {
  /** If true, the health monitor will attempt auto-recovery when circuit is OPEN. */
  autoHeal: boolean;
  /** Milliseconds to wait before auto-recovery attempt. Default: 60_000 */
  recoveryWindow: number;
}

export const DEFAULT_RESILIENCE_CONFIG: AgentResilienceConfig = {
  failureThreshold: 5,
  successThreshold: 2,
  timeout: 30_000,
  autoHeal: true,
  recoveryWindow: 60_000,
};

export const APEX_RESILIENCE_CONFIG: AgentResilienceConfig = {
  failureThreshold: 5,
  successThreshold: 2,
  timeout: 30_000,
  autoHeal: false, // apex agents require manual recovery
  recoveryWindow: 60_000,
};

// ─── Recovery ────────────────────────────────────────────────────────────────

export interface RecoveryAttemptResult {
  agentId: string;
  success: boolean;
  message: string;
  timestamp: string;
}

// ─── Store ───────────────────────────────────────────────────────────────────

export interface ResilienceStoreEntry {
  agentId: string;
  circuit: CircuitBreakerState;
  killSwitch: KillSwitchRecord;
  config: AgentResilienceConfig;
  recoveryAttempts: number;
  lastRecoveryAt: string | null;
  transitionLog: CircuitStateTransitionEvent[];
  killSwitchLog: KillSwitchEvent[];
}
