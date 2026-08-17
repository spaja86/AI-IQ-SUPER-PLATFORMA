// SpajaUltraOmegaCore -∞Ω+∞ — EPEKM-D Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  // Constants
  EPEKM_CONTRACT_VERSION,
  EPEKM_MODULE_VERSION,
  EPEKM_PERSONA_ID,
  EPEKM_OCTAVE,
  EPEKM_HIPERMREZA_NODE,
  EPEKM_PERFORMANCE_MAX_MS,
  EPEKM_API_RESPONSE_MAX_MS,
  EPEKM_DELIVERY_ACK_MAX_MS,
  EPEKM_MAX_RETRIES,
  EPEKM_DELIVERY_MAX_MS,
  // Identity registry
  registerIdentity,
  getIdentityByAlias,
  updateIdentityStatus,
  listIdentities,
  getIdentityCount,
  getActiveIdentityCount,
  generateCanonicalAddress,
  // Routing engine
  resolveAlias,
  registerAliasOverride,
  removeAliasOverride,
  getRouteEntry,
  // Email engine
  sendMessage,
  getMessageById,
  getMessageCount,
  generateMessageId,
  // Delivery tracker
  initDelivery,
  markSent,
  markDelivered,
  markFailed,
  archiveDelivery,
  getDeliveryStatus,
  countByStatus,
  getTotalMessageCount,
  getPendingDeliveryCount,
  calcBackoffDelay,
  // Orchestrator
  buildHealthReport,
  executeDenterRequest,
} from '../../lib/epekm-denter';

// Internal test helpers (only in tests)
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { _clearRegistryForTest } = require('../../lib/epekm-denter/identity-registry');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { _clearRoutingOverridesForTest } = require('../../lib/epekm-denter/routing-engine');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { _clearDeliveryStoreForTest } = require('../../lib/epekm-denter/delivery-tracker');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { _clearMessageStoreForTest } = require('../../lib/epekm-denter/email-engine');

let passed = 0;
let failed = 0;
const failures: string[] = [];

async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
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

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function beforeEach(): void {
  _clearRegistryForTest();
  _clearRoutingOverridesForTest();
  _clearDeliveryStoreForTest();
  _clearMessageStoreForTest();
}

async function runTests(): Promise<void> {

  // ─── Constants ────────────────────────────────────────────────────────────
  console.log('\n🔎 [epekm-denter] constants');

  await test('contract version is non-empty', () => {
    assert(EPEKM_CONTRACT_VERSION.length > 0, 'contract version must be defined');
  });
  await test('module version is non-empty', () => {
    assert(EPEKM_MODULE_VERSION.length > 0, 'module version must be defined');
  });
  await test('persona id is stable', () => {
    assert(EPEKM_PERSONA_ID === 'epekm-denter-core', `unexpected: ${EPEKM_PERSONA_ID}`);
  });
  await test('octave is 11', () => {
    assert(EPEKM_OCTAVE === 11, `expected 11, got ${EPEKM_OCTAVE}`);
  });
  await test('hipermreza node is 88', () => {
    assert(EPEKM_HIPERMREZA_NODE === 88, `expected 88, got ${EPEKM_HIPERMREZA_NODE}`);
  });
  await test('performance max ≤ 50ms', () => {
    assert(EPEKM_PERFORMANCE_MAX_MS <= 50, `expected ≤ 50, got ${EPEKM_PERFORMANCE_MAX_MS}`);
  });
  await test('API response max ≤ 200ms', () => {
    assert(EPEKM_API_RESPONSE_MAX_MS <= 200, `expected ≤ 200, got ${EPEKM_API_RESPONSE_MAX_MS}`);
  });
  await test('delivery ack max ≤ 500ms', () => {
    assert(EPEKM_DELIVERY_ACK_MAX_MS <= 500, `expected ≤ 500, got ${EPEKM_DELIVERY_ACK_MAX_MS}`);
  });
  await test('max retries is 3', () => {
    assert(EPEKM_MAX_RETRIES === 3, `expected 3, got ${EPEKM_MAX_RETRIES}`);
  });
  await test('delivery max ms is 500', () => {
    assert(EPEKM_DELIVERY_MAX_MS === 500, `expected 500, got ${EPEKM_DELIVERY_MAX_MS}`);
  });

  // ─── Identity Registry ────────────────────────────────────────────────────
  console.log('\n🔎 [epekm-denter] identity-registry');

  await test('registers a new identity', () => {
    beforeEach();
    const result = registerIdentity({ alias: 'agent-alpha', agentRef: 'maksimus', octave: 13, nodeId: 128 });
    assert(result.alias === 'agent-alpha', 'alias mismatch');
    assert(result.emailId.startsWith('epekm-'), 'emailId format');
    assert(result.canonicalAddress === 'agent-alpha@epekm.spaja.platform', 'canonical address format');
    assert(result.status === 'active', 'default status must be active');
  });

  await test('registerIdentity is idempotent for same alias', () => {
    beforeEach();
    const r1 = registerIdentity({ alias: 'agent-beta', agentRef: 'another-maks', octave: 1, nodeId: 1 });
    const r2 = registerIdentity({ alias: 'agent-beta', agentRef: 'another-maks', octave: 1, nodeId: 1 });
    assert(r1.emailId === r2.emailId, 'idempotent: same emailId expected');
  });

  await test('normalizes alias to lowercase', () => {
    beforeEach();
    const r = registerIdentity({ alias: 'Agent-Gamma', agentRef: 'persona-bank', octave: 5, nodeId: 40 });
    assert(r.alias === 'agent-gamma', `expected lowercase, got ${r.alias}`);
  });

  await test('getIdentityByAlias returns correct identity', () => {
    beforeEach();
    registerIdentity({ alias: 'agent-delta', agentRef: 'epekm', octave: 11, nodeId: 88 });
    const identity = getIdentityByAlias('agent-delta');
    assert(identity !== undefined, 'identity should exist');
    assert(identity!.agentRef === 'epekm', 'agentRef mismatch');
  });

  await test('updateIdentityStatus changes status', () => {
    beforeEach();
    registerIdentity({ alias: 'agent-epsilon', agentRef: 'test', octave: 1, nodeId: 1 });
    const updated = updateIdentityStatus('agent-epsilon', 'archived');
    assert(updated === true, 'should return true');
    const identity = getIdentityByAlias('agent-epsilon');
    assert(identity?.status === 'archived', `expected archived, got ${identity?.status}`);
  });

  await test('listIdentities returns all registered', () => {
    beforeEach();
    registerIdentity({ alias: 'agent-a', agentRef: 'test', octave: 1, nodeId: 1 });
    registerIdentity({ alias: 'agent-b', agentRef: 'test', octave: 2, nodeId: 2 });
    const list = listIdentities();
    assert(list.length === 2, `expected 2, got ${list.length}`);
  });

  await test('getActiveIdentityCount counts only active', () => {
    beforeEach();
    registerIdentity({ alias: 'active-1', agentRef: 'test', octave: 1, nodeId: 1 });
    registerIdentity({ alias: 'active-2', agentRef: 'test', octave: 1, nodeId: 1 });
    updateIdentityStatus('active-2', 'dormant');
    assert(getActiveIdentityCount() === 1, `expected 1 active, got ${getActiveIdentityCount()}`);
  });

  await test('throws on empty alias', () => {
    beforeEach();
    let threw = false;
    try { registerIdentity({ alias: '', agentRef: 'test', octave: 1, nodeId: 1 }); }
    catch { threw = true; }
    assert(threw, 'should throw on empty alias');
  });

  await test('throws on empty agentRef', () => {
    beforeEach();
    let threw = false;
    try { registerIdentity({ alias: 'alias-x', agentRef: '', octave: 1, nodeId: 1 }); }
    catch { threw = true; }
    assert(threw, 'should throw on empty agentRef');
  });

  await test('throws on NaN octave', () => {
    beforeEach();
    let threw = false;
    try { registerIdentity({ alias: 'alias-nan', agentRef: 'test', octave: NaN, nodeId: 1 }); }
    catch { threw = true; }
    assert(threw, 'should throw on NaN octave');
  });

  await test('throws on Infinity nodeId', () => {
    beforeEach();
    let threw = false;
    try { registerIdentity({ alias: 'alias-inf', agentRef: 'test', octave: 1, nodeId: Infinity }); }
    catch { threw = true; }
    assert(threw, 'should throw on Infinity nodeId');
  });

  await test('generateCanonicalAddress format', () => {
    const addr = generateCanonicalAddress('my-agent');
    assert(addr === 'my-agent@epekm.spaja.platform', `unexpected: ${addr}`);
  });

  // ─── Routing Engine ───────────────────────────────────────────────────────
  console.log('\n🔎 [epekm-denter] routing-engine');

  await test('resolveAlias returns canonical address for active identity', () => {
    beforeEach();
    registerIdentity({ alias: 'router-agent', agentRef: 'epekm', octave: 11, nodeId: 88 });
    const addr = resolveAlias('router-agent');
    assert(addr === 'router-agent@epekm.spaja.platform', `unexpected: ${addr}`);
  });

  await test('resolveAlias returns null for unknown alias', () => {
    beforeEach();
    const addr = resolveAlias('unknown-alias-xyz');
    assert(addr === null, 'should return null for unknown alias');
  });

  await test('resolveAlias returns null for archived identity', () => {
    beforeEach();
    registerIdentity({ alias: 'archived-agent', agentRef: 'test', octave: 1, nodeId: 1 });
    updateIdentityStatus('archived-agent', 'archived');
    const addr = resolveAlias('archived-agent');
    assert(addr === null, 'should return null for archived identity');
  });

  await test('registerAliasOverride overrides resolution', () => {
    beforeEach();
    registerAliasOverride('alias-override', 'override@external.platform');
    const addr = resolveAlias('alias-override');
    assert(addr === 'override@external.platform', `unexpected: ${addr}`);
  });

  await test('removeAliasOverride removes override', () => {
    beforeEach();
    registerAliasOverride('temp-alias', 'temp@platform.test');
    removeAliasOverride('temp-alias');
    const addr = resolveAlias('temp-alias');
    assert(addr === null, 'override should be removed');
  });

  await test('getRouteEntry returns null for unknown alias', () => {
    beforeEach();
    const entry = getRouteEntry('no-such-alias');
    assert(entry === null, 'should return null');
  });

  await test('getRouteEntry returns entry for active identity', () => {
    beforeEach();
    registerIdentity({ alias: 'route-agent', agentRef: 'epekm', octave: 11, nodeId: 88 });
    const entry = getRouteEntry('route-agent');
    assert(entry !== null, 'entry should exist');
    assert(entry!.active === true, 'entry should be active');
  });

  // ─── Delivery Tracker ─────────────────────────────────────────────────────
  console.log('\n🔎 [epekm-denter] delivery-tracker');

  await test('initDelivery creates queued record', () => {
    beforeEach();
    const record = initDelivery('msg-001');
    assert(record.status === 'queued', `expected queued, got ${record.status}`);
    assert(record.retryCount === 0, 'initial retry count must be 0');
  });

  await test('markSent transitions to sent', () => {
    beforeEach();
    initDelivery('msg-002');
    const record = markSent('msg-002');
    assert(record.status === 'sent', `expected sent, got ${record.status}`);
  });

  await test('markDelivered transitions to delivered', () => {
    beforeEach();
    initDelivery('msg-003');
    const record = markDelivered('msg-003');
    assert(record.status === 'delivered', `expected delivered, got ${record.status}`);
    assert(record.deliveredAt !== null, 'deliveredAt must be set');
  });

  await test('markFailed increments retry count', () => {
    beforeEach();
    initDelivery('msg-004');
    const record = markFailed('msg-004', 'connection refused');
    assert(record.retryCount === 1, `expected 1, got ${record.retryCount}`);
    assert(record.status === 'queued', 'still queued on first failure');
  });

  await test('markFailed bounces after max retries', () => {
    beforeEach();
    initDelivery('msg-005');
    markFailed('msg-005', 'err');
    markFailed('msg-005', 'err');
    const record = markFailed('msg-005', 'err');
    assert(record.status === 'bounced', `expected bounced, got ${record.status}`);
  });

  await test('archiveDelivery transitions to archived', () => {
    beforeEach();
    initDelivery('msg-006');
    const record = archiveDelivery('msg-006');
    assert(record.status === 'archived', `expected archived, got ${record.status}`);
  });

  await test('getDeliveryStatus returns undefined for unknown messageId', () => {
    beforeEach();
    const record = getDeliveryStatus('no-such-message');
    assert(record === undefined, 'should return undefined');
  });

  await test('countByStatus counts correctly', () => {
    beforeEach();
    initDelivery('cnt-a');
    initDelivery('cnt-b');
    markDelivered('cnt-b');
    assert(countByStatus('queued') === 1, `expected 1 queued`);
    assert(countByStatus('delivered') === 1, `expected 1 delivered`);
  });

  await test('getPendingDeliveryCount includes queued and sent', () => {
    beforeEach();
    initDelivery('pend-a'); // queued
    initDelivery('pend-b');
    markSent('pend-b'); // sent
    initDelivery('pend-c');
    markDelivered('pend-c'); // delivered
    assert(getPendingDeliveryCount() === 2, `expected 2 pending, got ${getPendingDeliveryCount()}`);
  });

  await test('calcBackoffDelay doubles on each retry', () => {
    assert(calcBackoffDelay(0) === 100, 'retry 0: 100ms');
    assert(calcBackoffDelay(1) === 200, 'retry 1: 200ms');
    assert(calcBackoffDelay(2) === 400, 'retry 2: 400ms');
  });

  // ─── Email Engine ─────────────────────────────────────────────────────────
  console.log('\n🔎 [epekm-denter] email-engine');

  await test('sendMessage succeeds for registered active aliases', () => {
    beforeEach();
    registerIdentity({ alias: 'sender', agentRef: 'epekm', octave: 11, nodeId: 88 });
    registerIdentity({ alias: 'receiver', agentRef: 'epekm', octave: 11, nodeId: 89 });
    const result = sendMessage({ fromAlias: 'sender', toAlias: 'receiver', payloadType: 'plain-text', payload: 'Hello!' });
    assert(result.status === 'delivered', `expected delivered, got ${result.status}`);
    assert(result.fromAlias === 'sender', 'fromAlias mismatch');
    assert(result.toAlias === 'receiver', 'toAlias mismatch');
  });

  await test('sendMessage is idempotent via messageId', () => {
    beforeEach();
    registerIdentity({ alias: 'sender2', agentRef: 'epekm', octave: 11, nodeId: 88 });
    registerIdentity({ alias: 'receiver2', agentRef: 'epekm', octave: 11, nodeId: 89 });
    const r1 = sendMessage({ fromAlias: 'sender2', toAlias: 'receiver2', payloadType: 'json', payload: '{}', messageId: 'idem-001' });
    const r2 = sendMessage({ fromAlias: 'sender2', toAlias: 'receiver2', payloadType: 'json', payload: '{}', messageId: 'idem-001' });
    assert(r1.messageId === r2.messageId, 'idempotent: same messageId');
    assert(getMessageCount() === 1, `expected 1 message, got ${getMessageCount()}`);
  });

  await test('sendMessage throws for unknown sender alias', () => {
    beforeEach();
    registerIdentity({ alias: 'recv-only', agentRef: 'test', octave: 1, nodeId: 1 });
    let threw = false;
    try { sendMessage({ fromAlias: 'ghost-sender', toAlias: 'recv-only', payloadType: 'plain-text', payload: 'hi' }); }
    catch { threw = true; }
    assert(threw, 'should throw for unknown sender');
  });

  await test('sendMessage throws for archived recipient', () => {
    beforeEach();
    registerIdentity({ alias: 'active-sender', agentRef: 'test', octave: 1, nodeId: 1 });
    registerIdentity({ alias: 'archived-recv', agentRef: 'test', octave: 1, nodeId: 1 });
    updateIdentityStatus('archived-recv', 'archived');
    let threw = false;
    try { sendMessage({ fromAlias: 'active-sender', toAlias: 'archived-recv', payloadType: 'plain-text', payload: 'hi' }); }
    catch { threw = true; }
    assert(threw, 'should throw for archived recipient');
  });

  await test('sendMessage throws for empty payload', () => {
    beforeEach();
    registerIdentity({ alias: 'from-e', agentRef: 'test', octave: 1, nodeId: 1 });
    registerIdentity({ alias: 'to-e', agentRef: 'test', octave: 1, nodeId: 1 });
    let threw = false;
    try { sendMessage({ fromAlias: 'from-e', toAlias: 'to-e', payloadType: 'plain-text', payload: '' }); }
    catch { threw = true; }
    assert(threw, 'should throw for empty payload');
  });

  await test('getMessageById returns undefined for unknown id', () => {
    beforeEach();
    assert(getMessageById('no-msg') === undefined, 'should return undefined');
  });

  await test('generateMessageId has correct prefix', () => {
    const id = generateMessageId('my-agent');
    assert(id.startsWith('msg-'), `expected msg- prefix, got ${id}`);
  });

  // ─── Orchestrator ─────────────────────────────────────────────────────────
  console.log('\n🔎 [epekm-denter] denter-orchestrator');

  await test('buildHealthReport returns ok status with empty store', () => {
    beforeEach();
    const report = buildHealthReport();
    assert(report.status === 'ok', `expected ok, got ${report.status}`);
    assert(report.persona === 'epekm-denter-core', `persona mismatch`);
    assert(report.octave === 11, `octave mismatch`);
    assert(report.hipermrezaNode === 88, `nodeId mismatch`);
  });

  await test('executeDenterRequest: register action', async () => {
    beforeEach();
    const res = await executeDenterRequest({
      action: 'register',
      payload: { alias: 'orch-agent', agentRef: 'epekm', octave: 11, nodeId: 88 },
      requestId: 'req-001',
      timestamp: new Date().toISOString(),
    });
    assert(res.success === true, `expected success, got error: ${res.error}`);
    assert(res.action === 'register', 'action mismatch');
  });

  await test('executeDenterRequest: resolve action', async () => {
    beforeEach();
    registerIdentity({ alias: 'orch-resolve', agentRef: 'epekm', octave: 11, nodeId: 88 });
    const res = await executeDenterRequest({
      action: 'resolve',
      payload: { alias: 'orch-resolve' },
      requestId: 'req-002',
      timestamp: new Date().toISOString(),
    });
    assert(res.success === true, `expected success, got error: ${res.error}`);
  });

  await test('executeDenterRequest: resolve action fails for unknown alias', async () => {
    beforeEach();
    const res = await executeDenterRequest({
      action: 'resolve',
      payload: { alias: 'nonexistent-alias' },
      requestId: 'req-003',
      timestamp: new Date().toISOString(),
    });
    assert(res.success === false, 'should fail for unknown alias');
    assert(res.error !== null, 'error message must be set');
  });

  await test('executeDenterRequest: send action', async () => {
    beforeEach();
    registerIdentity({ alias: 'orch-from', agentRef: 'epekm', octave: 11, nodeId: 88 });
    registerIdentity({ alias: 'orch-to', agentRef: 'epekm', octave: 11, nodeId: 89 });
    const res = await executeDenterRequest({
      action: 'send',
      payload: { fromAlias: 'orch-from', toAlias: 'orch-to', payloadType: 'agent-handoff', payload: '{"handoff":true}' },
      requestId: 'req-004',
      timestamp: new Date().toISOString(),
    });
    assert(res.success === true, `expected success, got error: ${res.error}`);
  });

  await test('executeDenterRequest: status action', async () => {
    beforeEach();
    registerIdentity({ alias: 'stat-from', agentRef: 'epekm', octave: 11, nodeId: 88 });
    registerIdentity({ alias: 'stat-to', agentRef: 'epekm', octave: 11, nodeId: 89 });
    const send = sendMessage({ fromAlias: 'stat-from', toAlias: 'stat-to', payloadType: 'plain-text', payload: 'ping' });
    const res = await executeDenterRequest({
      action: 'status',
      payload: { messageId: send.messageId },
      requestId: 'req-005',
      timestamp: new Date().toISOString(),
    });
    assert(res.success === true, `expected success, got error: ${res.error}`);
  });

  await test('executeDenterRequest: health action', async () => {
    beforeEach();
    const res = await executeDenterRequest({
      action: 'health',
      payload: {},
      requestId: 'req-006',
      timestamp: new Date().toISOString(),
    });
    assert(res.success === true, `expected success, got error: ${res.error}`);
  });

  await test('executeDenterRequest: unknown action returns error', async () => {
    beforeEach();
    const res = await executeDenterRequest({
      action: 'unknown-action' as never,
      payload: {},
      requestId: 'req-007',
      timestamp: new Date().toISOString(),
    });
    assert(res.success === false, 'should fail for unknown action');
  });

  await test('durationMs is non-negative', async () => {
    beforeEach();
    const res = await executeDenterRequest({
      action: 'health',
      payload: {},
      requestId: 'req-008',
      timestamp: new Date().toISOString(),
    });
    assert(res.durationMs >= 0, `durationMs must be non-negative, got ${res.durationMs}`);
  });

  // ─── Integration: end-to-end ──────────────────────────────────────────────
  console.log('\n🔎 [epekm-denter] integration (end-to-end)');

  await test('register → resolve → send → track status', async () => {
    beforeEach();

    // 1. Register
    const regA = registerIdentity({ alias: 'e2e-sender', agentRef: 'maksimus', octave: 13, nodeId: 128 });
    const regB = registerIdentity({ alias: 'e2e-receiver', agentRef: 'persona-bank', octave: 11, nodeId: 88 });
    assert(regA.status === 'active', 'sender should be active');
    assert(regB.status === 'active', 'receiver should be active');

    // 2. Resolve
    const addr = resolveAlias('e2e-sender');
    assert(addr !== null, 'sender alias should resolve');

    // 3. Send
    const sendResult = sendMessage({ fromAlias: 'e2e-sender', toAlias: 'e2e-receiver', payloadType: 'json', payload: '{"test":true}' });
    assert(sendResult.status === 'delivered', 'message should be delivered');

    // 4. Track status
    const status = getDeliveryStatus(sendResult.messageId);
    assert(status !== undefined, 'delivery record must exist');
    assert(status!.status === 'delivered', 'delivery should be delivered');
  });

  // ─── Performance ──────────────────────────────────────────────────────────
  console.log('\n🔎 [epekm-denter] performance');

  await test('1000 resolves complete within budget', () => {
    beforeEach();
    registerIdentity({ alias: 'perf-agent', agentRef: 'test', octave: 1, nodeId: 1 });
    const start = Date.now();
    for (let i = 0; i < 1000; i++) {
      resolveAlias('perf-agent');
    }
    const elapsed = Date.now() - start;
    assert(elapsed < 2000, `1000 resolves took ${elapsed}ms, expected < 2000ms`);
  });

  await test('buildHealthReport is fast', () => {
    beforeEach();
    const start = Date.now();
    buildHealthReport();
    const elapsed = Date.now() - start;
    assert(elapsed <= EPEKM_PERFORMANCE_MAX_MS, `health report took ${elapsed}ms, expected ≤ ${EPEKM_PERFORMANCE_MAX_MS}ms`);
  });

  // ─── Results ──────────────────────────────────────────────────────────────
  console.log('\n========================================');
  console.log('EPEKM-D Test Results');
  console.log('========================================');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  if (failures.length > 0) {
    console.log('\nFailed tests:');
    failures.forEach((f) => console.log(`  - ${f}`));
  }
  console.log('========================================');
  console.log('KPIs:');
  console.log(`  Engine eval:         ≤ ${EPEKM_PERFORMANCE_MAX_MS}ms`);
  console.log(`  API response target: ≤ ${EPEKM_API_RESPONSE_MAX_MS}ms`);
  console.log(`  Delivery ack:        ≤ ${EPEKM_DELIVERY_ACK_MAX_MS}ms`);
  console.log('========================================');

  if (failed > 0) {
    process.exit(1);
  }
}

void runTests();
