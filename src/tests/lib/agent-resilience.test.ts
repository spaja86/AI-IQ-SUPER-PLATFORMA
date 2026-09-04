// SpajaUltraOmegaCore -∞Ω+∞ — Agent Resilience Tests
// Kompanija SPAJA — Digitalna Industrija
//
// Full test suite:
//   - Circuit breaker state transitions
//   - Kill switch idempotency and log
//   - Health monitor diagnostics and recovery
//   - withResilience wrapper error propagation

import {
  // store
  _resetResilienceStore,
  getOrCreateEntry,
  // circuit breaker
  isCallAllowed,
  recordSuccess,
  recordFailure,
  resetCircuit,
  getCircuitState,
  // kill switch
  triggerKillSwitch,
  isKilled,
  clearKillSwitch,
  getKillSwitchRecord,
  getKillSwitchLog,
  // health monitor
  runDiagnostic,
  attemptRecovery,
  checkAutoHeal,
  getAllHealthReports,
  // wrapper
  withResilience,
  AgentKilledError,
  CircuitOpenError,
  // types / constants
  DEFAULT_RESILIENCE_CONFIG,
  AGENT_RESILIENCE_CONTRACT_VERSION,
} from '../../lib/agent-resilience';
import type { AgentResilienceConfig } from '../../lib/agent-resilience';

// ─── Test harness ─────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const failures: string[] = [];

async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  _resetResilienceStore();
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`  ❌ ${name}`);
    console.error(`     ${msg}`);
    failed++;
    failures.push(`${name}: ${msg}`);
  }
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`Assert failed: ${message}`);
}

function assertEqual<T>(actual: T, expected: T, label?: string): void {
  if (actual !== expected) {
    throw new Error(`${label ?? 'assertEqual'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

const FAST_CONFIG: AgentResilienceConfig = {
  failureThreshold: 3,
  successThreshold: 2,
  timeout: 50, // 50ms for tests
  autoHeal: true,
  recoveryWindow: 100,
};

const APEX_CONFIG: AgentResilienceConfig = {
  ...FAST_CONFIG,
  autoHeal: false,
};

async function runTests(): Promise<void> {
// ─── Contract version ─────────────────────────────────────────────────────────

console.log('\n📋 Agent Resilience — Contract Version');
await test('contract version is defined and semver-like', () => {
  assert(typeof AGENT_RESILIENCE_CONTRACT_VERSION === 'string', 'version is string');
  assert(/^\d+\.\d+\.\d+$/.test(AGENT_RESILIENCE_CONTRACT_VERSION), 'semver format');
});

// ─── Circuit Breaker ──────────────────────────────────────────────────────────

console.log('\n🔌 Circuit Breaker');

await test('initial state is CLOSED', () => {
  const state = getCircuitState('agent-A');
  assertEqual(state.state, 'CLOSED', 'initial state');
  assertEqual(state.consecutiveFailures, 0, 'no failures');
});

await test('stays CLOSED below threshold', () => {
  isCallAllowed('agent-A', FAST_CONFIG);
  recordFailure('agent-A', FAST_CONFIG);
  recordFailure('agent-A', FAST_CONFIG);
  const state = getCircuitState('agent-A');
  assertEqual(state.state, 'CLOSED', 'still closed after 2 failures');
  assertEqual(state.consecutiveFailures, 2, 'failure count');
});

await test('trips to OPEN at threshold', () => {
  recordFailure('agent-A', FAST_CONFIG);
  recordFailure('agent-A', FAST_CONFIG);
  recordFailure('agent-A', FAST_CONFIG); // threshold = 3
  const state = getCircuitState('agent-A');
  assertEqual(state.state, 'OPEN', 'circuit opened');
});

await test('OPEN blocks calls', () => {
  recordFailure('agent-A', FAST_CONFIG);
  recordFailure('agent-A', FAST_CONFIG);
  recordFailure('agent-A', FAST_CONFIG);
  const allowed = isCallAllowed('agent-A', FAST_CONFIG);
  assertEqual(allowed, false, 'call blocked when OPEN');
});

await test('OPEN transitions to HALF-OPEN after timeout', async () => {
  recordFailure('agent-A', FAST_CONFIG);
  recordFailure('agent-A', FAST_CONFIG);
  recordFailure('agent-A', FAST_CONFIG);
  await new Promise((r) => setTimeout(r, 60)); // > 50ms timeout
  const allowed = isCallAllowed('agent-A', FAST_CONFIG);
  assertEqual(allowed, true, 'probe allowed after timeout');
  const state = getCircuitState('agent-A');
  assertEqual(state.state, 'HALF-OPEN', 'state is HALF-OPEN');
});

await test('HALF-OPEN closes after successThreshold', async () => {
  recordFailure('agent-A', FAST_CONFIG);
  recordFailure('agent-A', FAST_CONFIG);
  recordFailure('agent-A', FAST_CONFIG);
  await new Promise((r) => setTimeout(r, 60));
  isCallAllowed('agent-A', FAST_CONFIG); // transitions to HALF-OPEN
  recordSuccess('agent-A', FAST_CONFIG);
  recordSuccess('agent-A', FAST_CONFIG); // successThreshold = 2
  const state = getCircuitState('agent-A');
  assertEqual(state.state, 'CLOSED', 'circuit closed after successes');
});

await test('success resets consecutive failures', () => {
  recordFailure('agent-A', FAST_CONFIG);
  recordFailure('agent-A', FAST_CONFIG);
  recordSuccess('agent-A', FAST_CONFIG);
  const state = getCircuitState('agent-A');
  assertEqual(state.consecutiveFailures, 0, 'failures reset on success');
  assertEqual(state.consecutiveSuccesses, 1, 'success incremented');
});

await test('manual reset puts circuit to HALF-OPEN', () => {
  recordFailure('agent-A', FAST_CONFIG);
  recordFailure('agent-A', FAST_CONFIG);
  recordFailure('agent-A', FAST_CONFIG);
  resetCircuit('agent-A', FAST_CONFIG);
  const state = getCircuitState('agent-A');
  assertEqual(state.state, 'HALF-OPEN', 'manual reset to HALF-OPEN');
});

await test('total counters accumulate correctly', () => {
  recordSuccess('agent-A', FAST_CONFIG);
  recordSuccess('agent-A', FAST_CONFIG);
  recordFailure('agent-A', FAST_CONFIG);
  const state = getCircuitState('agent-A');
  assertEqual(state.totalSuccesses, 2, 'total successes');
  assertEqual(state.totalFailures, 1, 'total failures');
});

// ─── Kill Switch ──────────────────────────────────────────────────────────────

console.log('\n🔴 Kill Switch');

await test('initially not killed', () => {
  assert(!isKilled('agent-B'), 'not killed by default');
});

await test('triggerKillSwitch marks agent as killed', () => {
  triggerKillSwitch('agent-B', 'MANUAL', 'admin');
  assert(isKilled('agent-B'), 'agent is killed');
});

await test('kill switch record contains correct reason', () => {
  triggerKillSwitch('agent-B', 'SECURITY', 'security-scanner', 'Suspicious pattern');
  const record = getKillSwitchRecord('agent-B');
  assertEqual(record.killed, true, 'killed flag');
  assertEqual(record.event?.reason, 'SECURITY', 'reason');
  assertEqual(record.event?.triggeredBy, 'security-scanner', 'triggeredBy');
  assertEqual(record.event?.message, 'Suspicious pattern', 'message');
});

await test('triggerKillSwitch is idempotent (preserves original event)', () => {
  triggerKillSwitch('agent-B', 'MANUAL', 'admin1');
  triggerKillSwitch('agent-B', 'SECURITY', 'admin2');
  const record = getKillSwitchRecord('agent-B');
  // Original event preserved
  assertEqual(record.event?.triggeredBy, 'admin1', 'original event preserved');
  // But both events in log
  const log = getKillSwitchLog('agent-B');
  assertEqual(log.length, 2, 'both events in log');
});

await test('clearKillSwitch un-kills agent', () => {
  triggerKillSwitch('agent-B', 'CRITICAL_ERROR', 'system');
  clearKillSwitch('agent-B', 'admin');
  assert(!isKilled('agent-B'), 'agent cleared');
  const record = getKillSwitchRecord('agent-B');
  assert(record.clearedAt !== null, 'clearedAt set');
  assertEqual(record.clearedBy, 'admin', 'clearedBy');
});

await test('kill switch log accumulates all events', () => {
  triggerKillSwitch('agent-B', 'CRITICAL_ERROR', 'system');
  triggerKillSwitch('agent-B', 'LOOP_DETECTED', 'monitor');
  triggerKillSwitch('agent-B', 'RESOURCE_EXHAUSTED', 'auto');
  const log = getKillSwitchLog('agent-B');
  assertEqual(log.length, 3, 'three events in log');
  assertEqual(log[0].reason, 'CRITICAL_ERROR', 'first event');
  assertEqual(log[2].reason, 'RESOURCE_EXHAUSTED', 'third event');
});

// ─── Health Monitor ───────────────────────────────────────────────────────────

console.log('\n🏥 Health Monitor');

await test('fresh agent reports HEALTHY', () => {
  const report = runDiagnostic('agent-C');
  assertEqual(report.status, 'HEALTHY', 'status');
  assertEqual(report.agentId, 'agent-C', 'agentId');
  assertEqual(report.errorRate, 0, 'errorRate');
  assert(report.lastCheckedAt.length > 0, 'lastCheckedAt set');
});

await test('reports TRIPPED when circuit is OPEN', () => {
  recordFailure('agent-C', FAST_CONFIG);
  recordFailure('agent-C', FAST_CONFIG);
  recordFailure('agent-C', FAST_CONFIG);
  const report = runDiagnostic('agent-C', FAST_CONFIG);
  assertEqual(report.status, 'TRIPPED', 'status TRIPPED');
});

await test('reports KILLED when kill switch active', () => {
  triggerKillSwitch('agent-C', 'MANUAL', 'admin');
  const report = runDiagnostic('agent-C');
  assertEqual(report.status, 'KILLED', 'status KILLED');
});

await test('error rate reflects total calls', () => {
  recordSuccess('agent-C', FAST_CONFIG);
  recordSuccess('agent-C', FAST_CONFIG);
  recordFailure('agent-C', FAST_CONFIG);
  const report = runDiagnostic('agent-C', FAST_CONFIG);
  // 1 failure / 3 total = 0.333...
  assert(Math.abs(report.errorRate - 1 / 3) < 0.01, 'errorRate approximately 1/3');
});

await test('attemptRecovery resets OPEN circuit to HALF-OPEN', () => {
  recordFailure('agent-C', FAST_CONFIG);
  recordFailure('agent-C', FAST_CONFIG);
  recordFailure('agent-C', FAST_CONFIG);
  const result = attemptRecovery('agent-C', FAST_CONFIG);
  assert(result.success, 'recovery succeeded');
  assertEqual(getCircuitState('agent-C').state, 'HALF-OPEN', 'circuit in HALF-OPEN');
});

await test('attemptRecovery clears CRITICAL_ERROR kill switch', () => {
  triggerKillSwitch('agent-C', 'CRITICAL_ERROR', 'system');
  const result = attemptRecovery('agent-C', FAST_CONFIG);
  assert(result.success, 'recovery succeeded');
  assert(!isKilled('agent-C'), 'agent cleared');
});

await test('attemptRecovery blocks MANUAL kill switch', () => {
  triggerKillSwitch('agent-C', 'MANUAL', 'admin');
  const result = attemptRecovery('agent-C', FAST_CONFIG);
  assert(!result.success, 'recovery blocked for MANUAL kill');
  assert(isKilled('agent-C'), 'agent still killed');
});

await test('attemptRecovery blocks SECURITY kill switch', () => {
  triggerKillSwitch('agent-C', 'SECURITY', 'scanner');
  const result = attemptRecovery('agent-C', FAST_CONFIG);
  assert(!result.success, 'recovery blocked for SECURITY kill');
});

await test('checkAutoHeal returns null when autoHeal=false', () => {
  recordFailure('agent-C', APEX_CONFIG);
  recordFailure('agent-C', APEX_CONFIG);
  recordFailure('agent-C', APEX_CONFIG);
  const result = checkAutoHeal('agent-C', APEX_CONFIG);
  assert(result === null, 'auto-heal null for apex config');
});

await test('checkAutoHeal returns null if circuit is not OPEN', () => {
  const result = checkAutoHeal('agent-C', FAST_CONFIG);
  assert(result === null, 'auto-heal skipped when not OPEN');
});

await test('checkAutoHeal attempts recovery after recoveryWindow', async () => {
  recordFailure('agent-C', FAST_CONFIG);
  recordFailure('agent-C', FAST_CONFIG);
  recordFailure('agent-C', FAST_CONFIG);
  await new Promise((r) => setTimeout(r, 110)); // > 100ms recoveryWindow
  const result = checkAutoHeal('agent-C', FAST_CONFIG);
  assert(result !== null, 'auto-heal triggered');
  assert(result!.success, 'auto-heal succeeded');
});

await test('getAllHealthReports returns all registered agents', () => {
  getOrCreateEntry('agent-X');
  getOrCreateEntry('agent-Y');
  const reports = getAllHealthReports();
  assert(reports.length >= 2, 'at least 2 reports');
  assert(reports.some((r) => r.agentId === 'agent-X'), 'agent-X present');
  assert(reports.some((r) => r.agentId === 'agent-Y'), 'agent-Y present');
});

// ─── withResilience wrapper ───────────────────────────────────────────────────

console.log('\n🛡️  withResilience Wrapper');

await test('passes through successful calls', async () => {
  const handler = withResilience<string, string>('agent-D', FAST_CONFIG)(async (x) => `ok:${x}`);
  const result = await handler('hello');
  assertEqual(result, 'ok:hello', 'passthrough');
});

await test('throws AgentKilledError when killed', async () => {
  triggerKillSwitch('agent-D', 'MANUAL', 'admin');
  const handler = withResilience<string, string>('agent-D', FAST_CONFIG)(async () => 'ok');
  let threw = false;
  try {
    await handler('x');
  } catch (e) {
    threw = true;
    assert(e instanceof AgentKilledError, 'AgentKilledError thrown');
  }
  assert(threw, 'error was thrown');
});

await test('throws CircuitOpenError when circuit is OPEN', async () => {
  // Use a very long timeout so circuit stays OPEN during test
  const cfg: AgentResilienceConfig = { ...FAST_CONFIG, timeout: 60_000, autoHeal: false };
  const fail = withResilience<void, void>('agent-E', cfg)(async () => { throw new Error('boom'); });

  // Trip the circuit
  for (let i = 0; i < 3; i++) {
    try { await fail(); } catch { /* expected */ }
  }

  let threw = false;
  try { await fail(); } catch (e) {
    threw = true;
    assert(e instanceof CircuitOpenError || e instanceof AgentKilledError, 'circuit or kill error');
  }
  assert(threw, 'error was thrown when circuit OPEN');
});

await test('propagates original error on failure', async () => {
  const handler = withResilience<void, void>('agent-F', FAST_CONFIG)(async () => {
    throw new TypeError('specific error');
  });
  let caughtMessage = '';
  try { await handler(); } catch (e) {
    caughtMessage = e instanceof Error ? e.message : String(e);
  }
  assertEqual(caughtMessage, 'specific error', 'original error propagated');
});

await test('overhead per call is ≤ 2ms on average', async () => {
  const handler = withResilience<void, void>('agent-G', FAST_CONFIG)(async () => {});
  const iterations = 100;
  const start = performance.now();
  for (let i = 0; i < iterations; i++) await handler();
  const avgMs = (performance.now() - start) / iterations;
  assert(avgMs <= 2, `avg overhead ${avgMs.toFixed(3)}ms > 2ms`);
});

await test('circuit trips after failureThreshold via wrapper', async () => {
  const cfg: AgentResilienceConfig = { ...FAST_CONFIG, timeout: 60_000, autoHeal: false };
  const fail = withResilience<void, void>('agent-H', cfg)(async () => { throw new Error('x'); });
  for (let i = 0; i < 3; i++) {
    try { await fail(); } catch { /* expected */ }
  }
  assertEqual(getCircuitState('agent-H').state, 'OPEN', 'circuit tripped via wrapper');
});

await test('kill switch auto-triggered after circuit trips via wrapper', async () => {
  const cfg: AgentResilienceConfig = { ...FAST_CONFIG, timeout: 60_000, autoHeal: false };
  const fail = withResilience<void, void>('agent-I', cfg)(async () => { throw new Error('boom'); });
  for (let i = 0; i < 3; i++) {
    try { await fail(); } catch { /* expected */ }
  }
  assert(isKilled('agent-I'), 'auto kill switch after circuit trip');
});

// ─── Summary ──────────────────────────────────────────────────────────────────

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`Agent Resilience Tests: ${passed} passed, ${failed} failed`);
  if (failures.length > 0) {
    console.error('\nFailures:');
    for (const f of failures) console.error(`  • ${f}`);
    process.exit(1);
  }
  console.log('✅ All agent-resilience tests passed');
}

runTests().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
