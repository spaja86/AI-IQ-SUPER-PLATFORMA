// SpajaUltraOmegaCore -∞Ω+∞ — KONVENKCIONALNI ODNOSI Core Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  createRelation,
  changeRelationStatus,
  recordInteraction,
  queryRelations,
  getRelation,
  getKoHealthReport,
  getInteractionsByRelation,
  getInteractionsByActor,
  countInteractions,
  _resetRegistry,
  _resetInteractionLog,
  KO_PERFORMANCE_MAX_MS,
  KO_VALID_TRANSITIONS,
} from '../../lib/konvenkcionalni-odnosi';

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

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`Assert failed: ${message}`);
}

function assertEqual<T>(actual: T, expected: T, label?: string): void {
  if (actual !== expected) {
    throw new Error(
      `${label ?? 'assertEqual'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
    );
  }
}

// ─── Setup / Teardown ─────────────────────────────────────────────────────────

function resetAll() {
  _resetRegistry();
  _resetInteractionLog();
}

// ─── Test Suites ──────────────────────────────────────────────────────────────

async function runCreateTests() {
  console.log('\n📋 createRelation');

  await test('creates a DRAFT relation', () => {
    resetAll();
    const result = createRelation({
      type: 'peer',
      initiatorId: 'agent-A',
      initiatorEntityType: 'agent',
      recipientId: 'agent-B',
      recipientEntityType: 'agent',
    });
    assert(result.ok, 'should succeed');
    assertEqual(result.data.status, 'DRAFT', 'initial status');
    assertEqual(result.data.type, 'peer', 'type');
    assert(result.data.events.length === 1, 'one event on create');
    assertEqual(result.data.events[0].type, 'created', 'first event type');
  });

  await test('assigns correct roles for mentorship', () => {
    resetAll();
    const result = createRelation({
      type: 'mentorship',
      initiatorId: 'mentor-1',
      initiatorEntityType: 'persona',
      recipientId: 'mentee-1',
      recipientEntityType: 'user',
    });
    assert(result.ok, 'should succeed');
    assertEqual(result.data.parties[0].role, 'mentor', 'initiator role');
    assertEqual(result.data.parties[1].role, 'mentee', 'recipient role');
  });

  await test('assigns correct roles for sponsorship', () => {
    resetAll();
    const result = createRelation({
      type: 'sponsorship',
      initiatorId: 'sponsor-1',
      initiatorEntityType: 'organization',
      recipientId: 'user-1',
      recipientEntityType: 'user',
    });
    assert(result.ok, 'should succeed');
    assertEqual(result.data.parties[0].role, 'sponsor', 'sponsor role');
    assertEqual(result.data.parties[1].role, 'beneficiary', 'beneficiary role');
  });

  await test('rejects self-relation', () => {
    resetAll();
    const result = createRelation({
      type: 'peer',
      initiatorId: 'agent-X',
      initiatorEntityType: 'agent',
      recipientId: 'agent-X',
      recipientEntityType: 'agent',
    });
    assert(!result.ok, 'should fail');
    assert(result.error.includes('self-relation'), 'error message');
  });

  await test('rejects missing initiatorId', () => {
    resetAll();
    const result = createRelation({
      type: 'peer',
      initiatorId: '',
      initiatorEntityType: 'agent',
      recipientId: 'agent-B',
      recipientEntityType: 'agent',
    });
    assert(!result.ok, 'should fail');
    assert(result.error.includes('initiatorId'), 'error message');
  });

  await test('rejects missing recipientId', () => {
    resetAll();
    const result = createRelation({
      type: 'peer',
      initiatorId: 'agent-A',
      initiatorEntityType: 'agent',
      recipientId: '   ',
      recipientEntityType: 'agent',
    });
    assert(!result.ok, 'should fail');
    assert(result.error.includes('recipientId'), 'error message');
  });

  await test('prevents duplicate active relations', () => {
    resetAll();
    // create first
    const r1 = createRelation({
      type: 'peer',
      initiatorId: 'agent-A',
      initiatorEntityType: 'agent',
      recipientId: 'agent-B',
      recipientEntityType: 'agent',
    });
    assert(r1.ok, 'first should succeed');
    // activate it
    changeRelationStatus({ relationId: r1.data.id, newStatus: 'ACTIVE', actorId: 'agent-A' });
    // try to create duplicate
    const r2 = createRelation({
      type: 'peer',
      initiatorId: 'agent-A',
      initiatorEntityType: 'agent',
      recipientId: 'agent-B',
      recipientEntityType: 'agent',
    });
    assert(!r2.ok, 'duplicate should fail');
    assert(r2.error.includes('duplicate'), 'error message');
  });

  await test('includes description and tags', () => {
    resetAll();
    const result = createRelation({
      type: 'collaboration',
      initiatorId: 'agent-A',
      initiatorEntityType: 'agent',
      recipientId: 'agent-C',
      recipientEntityType: 'system',
      description: 'Test collaboration',
      tags: ['tag1', 'tag2'],
    });
    assert(result.ok, 'should succeed');
    assertEqual(result.data.description, 'Test collaboration', 'description');
    assert(Array.isArray(result.data.tags) && result.data.tags.length === 2, 'tags');
  });

  await test('performance: createRelation ≤ 50ms', () => {
    resetAll();
    const result = createRelation({
      type: 'peer',
      initiatorId: 'perf-A',
      initiatorEntityType: 'agent',
      recipientId: 'perf-B',
      recipientEntityType: 'agent',
    });
    assert(result.ok, 'should succeed');
    assert(
      result.durationMs <= KO_PERFORMANCE_MAX_MS,
      `durationMs ${result.durationMs} > ${KO_PERFORMANCE_MAX_MS}ms`,
    );
  });
}

async function runStatusTests() {
  console.log('\n🔄 changeRelationStatus');

  await test('DRAFT → ACTIVE transition', () => {
    resetAll();
    const cr = createRelation({
      type: 'hierarchical',
      initiatorId: 'sys-A',
      initiatorEntityType: 'system',
      recipientId: 'agent-B',
      recipientEntityType: 'agent',
    });
    assert(cr.ok, 'create should succeed');
    const sr = changeRelationStatus({ relationId: cr.data.id, newStatus: 'ACTIVE', actorId: 'sys-A' });
    assert(sr.ok, 'status change should succeed');
    assertEqual(sr.data.status, 'ACTIVE', 'new status');
    assert(sr.data.events.length === 2, 'two events');
    assertEqual(sr.data.events[1].type, 'status_changed', 'second event type');
  });

  await test('ACTIVE → SUSPENDED → ACTIVE', () => {
    resetAll();
    const cr = createRelation({ type: 'peer', initiatorId: 'u1', initiatorEntityType: 'user', recipientId: 'u2', recipientEntityType: 'user' });
    assert(cr.ok, 'create');
    const a = changeRelationStatus({ relationId: cr.data.id, newStatus: 'ACTIVE', actorId: 'u1' });
    assert(a.ok, 'activate');
    const s = changeRelationStatus({ relationId: cr.data.id, newStatus: 'SUSPENDED', actorId: 'u1' });
    assert(s.ok, 'suspend');
    const re = changeRelationStatus({ relationId: cr.data.id, newStatus: 'ACTIVE', actorId: 'u1' });
    assert(re.ok, 'reactivate');
    assertEqual(re.data.status, 'ACTIVE', 'reactivated');
  });

  await test('ARCHIVED → ACTIVE is invalid', () => {
    resetAll();
    const cr = createRelation({ type: 'peer', initiatorId: 'u1', initiatorEntityType: 'user', recipientId: 'u2', recipientEntityType: 'user' });
    assert(cr.ok, 'create');
    changeRelationStatus({ relationId: cr.data.id, newStatus: 'ACTIVE', actorId: 'u1' });
    changeRelationStatus({ relationId: cr.data.id, newStatus: 'ARCHIVED', actorId: 'u1' });
    const bad = changeRelationStatus({ relationId: cr.data.id, newStatus: 'ACTIVE', actorId: 'u1' });
    assert(!bad.ok, 'should fail');
    assert(bad.error.includes('invalid status transition'), 'error message');
  });

  await test('TERMINATED → ACTIVE is invalid', () => {
    resetAll();
    const cr = createRelation({ type: 'peer', initiatorId: 'u1', initiatorEntityType: 'user', recipientId: 'u2', recipientEntityType: 'user' });
    assert(cr.ok, 'create');
    changeRelationStatus({ relationId: cr.data.id, newStatus: 'TERMINATED', actorId: 'u1' });
    const bad = changeRelationStatus({ relationId: cr.data.id, newStatus: 'ACTIVE', actorId: 'u1' });
    assert(!bad.ok, 'should fail');
  });

  await test('rejects unknown relation id', () => {
    resetAll();
    const result = changeRelationStatus({ relationId: 'nonexistent-id', newStatus: 'ACTIVE', actorId: 'u1' });
    assert(!result.ok, 'should fail');
    assert(result.error.includes('not found'), 'error message');
  });

  await test('KO_VALID_TRANSITIONS correctness', () => {
    assert(!KO_VALID_TRANSITIONS.ARCHIVED.includes('ACTIVE'), 'ARCHIVED no ACTIVE');
    assert(!KO_VALID_TRANSITIONS.TERMINATED.includes('ACTIVE'), 'TERMINATED no ACTIVE');
    assert(KO_VALID_TRANSITIONS.DRAFT.includes('ACTIVE'), 'DRAFT can go ACTIVE');
    assert(KO_VALID_TRANSITIONS.ACTIVE.includes('SUSPENDED'), 'ACTIVE can go SUSPENDED');
  });
}

async function runInteractionTests() {
  console.log('\n💬 recordInteraction');

  await test('records interaction on active relation', () => {
    resetAll();
    const cr = createRelation({ type: 'collaboration', initiatorId: 'a1', initiatorEntityType: 'agent', recipientId: 'a2', recipientEntityType: 'agent' });
    assert(cr.ok, 'create');
    changeRelationStatus({ relationId: cr.data.id, newStatus: 'ACTIVE', actorId: 'a1' });
    const ir = recordInteraction({ relationId: cr.data.id, actorId: 'a1', note: 'First touch' });
    assert(ir.ok, 'should succeed');
    assert(ir.data.events.length === 3, 'three events (created, status_changed, note_added)');
    assertEqual(ir.data.events[2].type, 'note_added', 'event type');
  });

  await test('records interaction without note as "interaction" type', () => {
    resetAll();
    const cr = createRelation({ type: 'peer', initiatorId: 'a1', initiatorEntityType: 'agent', recipientId: 'a2', recipientEntityType: 'agent' });
    assert(cr.ok, 'create');
    const ir = recordInteraction({ relationId: cr.data.id, actorId: 'a1', payload: { signal: 'ping' } });
    assert(ir.ok, 'should succeed');
    assertEqual(ir.data.events[1].type, 'interaction', 'event type');
  });

  await test('rejects interaction on ARCHIVED relation', () => {
    resetAll();
    const cr = createRelation({ type: 'peer', initiatorId: 'a1', initiatorEntityType: 'agent', recipientId: 'a2', recipientEntityType: 'agent' });
    assert(cr.ok, 'create');
    changeRelationStatus({ relationId: cr.data.id, newStatus: 'ACTIVE', actorId: 'a1' });
    changeRelationStatus({ relationId: cr.data.id, newStatus: 'ARCHIVED', actorId: 'a1' });
    const ir = recordInteraction({ relationId: cr.data.id, actorId: 'a1' });
    assert(!ir.ok, 'should fail');
    assert(ir.error.includes('ARCHIVED'), 'error message');
  });

  await test('rejects interaction on TERMINATED relation', () => {
    resetAll();
    const cr = createRelation({ type: 'peer', initiatorId: 'a1', initiatorEntityType: 'agent', recipientId: 'a2', recipientEntityType: 'agent' });
    assert(cr.ok, 'create');
    changeRelationStatus({ relationId: cr.data.id, newStatus: 'TERMINATED', actorId: 'a1' });
    const ir = recordInteraction({ relationId: cr.data.id, actorId: 'a1' });
    assert(!ir.ok, 'should fail');
    assert(ir.error.includes('TERMINATED'), 'error message');
  });

  await test('rejects empty actorId', () => {
    resetAll();
    const cr = createRelation({ type: 'peer', initiatorId: 'a1', initiatorEntityType: 'agent', recipientId: 'a2', recipientEntityType: 'agent' });
    assert(cr.ok, 'create');
    const ir = recordInteraction({ relationId: cr.data.id, actorId: '' });
    assert(!ir.ok, 'should fail');
    assert(ir.error.includes('actorId'), 'error message');
  });
}

async function runQueryTests() {
  console.log('\n🔍 queryRelations');

  await test('lists all relations', () => {
    resetAll();
    createRelation({ type: 'peer', initiatorId: 'a', initiatorEntityType: 'agent', recipientId: 'b', recipientEntityType: 'agent' });
    createRelation({ type: 'mentorship', initiatorId: 'c', initiatorEntityType: 'persona', recipientId: 'd', recipientEntityType: 'user' });
    const result = queryRelations();
    assert(result.ok, 'should succeed');
    assertEqual(result.data.length, 2, 'two relations');
  });

  await test('filters by entityId', () => {
    resetAll();
    createRelation({ type: 'peer', initiatorId: 'x1', initiatorEntityType: 'agent', recipientId: 'y1', recipientEntityType: 'agent' });
    createRelation({ type: 'peer', initiatorId: 'x2', initiatorEntityType: 'agent', recipientId: 'y2', recipientEntityType: 'agent' });
    const result = queryRelations({ entityId: 'x1' });
    assert(result.ok, 'should succeed');
    assertEqual(result.data.length, 1, 'one result for x1');
  });

  await test('filters by type', () => {
    resetAll();
    createRelation({ type: 'peer', initiatorId: 'a', initiatorEntityType: 'agent', recipientId: 'b', recipientEntityType: 'agent' });
    createRelation({ type: 'mentorship', initiatorId: 'c', initiatorEntityType: 'persona', recipientId: 'd', recipientEntityType: 'user' });
    const result = queryRelations({ type: 'mentorship' });
    assert(result.ok, 'should succeed');
    assertEqual(result.data.length, 1, 'one mentorship');
    assertEqual(result.data[0].type, 'mentorship', 'correct type');
  });

  await test('filters by status', () => {
    resetAll();
    const cr = createRelation({ type: 'peer', initiatorId: 'a', initiatorEntityType: 'agent', recipientId: 'b', recipientEntityType: 'agent' });
    assert(cr.ok, 'create');
    changeRelationStatus({ relationId: cr.data.id, newStatus: 'ACTIVE', actorId: 'a' });
    createRelation({ type: 'collaboration', initiatorId: 'c', initiatorEntityType: 'agent', recipientId: 'd', recipientEntityType: 'agent' });

    const active = queryRelations({ status: 'ACTIVE' });
    assert(active.ok, 'should succeed');
    assertEqual(active.data.length, 1, 'one active');

    const draft = queryRelations({ status: 'DRAFT' });
    assert(draft.ok, 'should succeed');
    assertEqual(draft.data.length, 1, 'one draft');
  });
}

async function runGetTests() {
  console.log('\n🔎 getRelation');

  await test('returns relation by id', () => {
    resetAll();
    const cr = createRelation({ type: 'peer', initiatorId: 'a', initiatorEntityType: 'agent', recipientId: 'b', recipientEntityType: 'agent' });
    assert(cr.ok, 'create');
    const gr = getRelation(cr.data.id);
    assert(gr.ok, 'should succeed');
    assertEqual(gr.data.id, cr.data.id, 'same id');
  });

  await test('returns error for unknown id', () => {
    resetAll();
    const gr = getRelation('unknown-id');
    assert(!gr.ok, 'should fail');
    assert(gr.error.includes('not found'), 'error message');
  });

  await test('returns error for empty id', () => {
    resetAll();
    const gr = getRelation('');
    assert(!gr.ok, 'should fail');
    assert(gr.error.includes('id'), 'error message');
  });
}

async function runHealthTests() {
  console.log('\n🏥 getKoHealthReport');

  await test('returns health report with correct persona', () => {
    resetAll();
    const report = getKoHealthReport();
    assertEqual(report.personaId, 'konvenkcionalni-odnosi-core', 'personaId');
    assertEqual(report.contractVersion, 'v1', 'contractVersion');
    assert(report.performanceMaxMs === 50, 'performanceMaxMs');
    assert(report.apiResponseMaxMs === 200, 'apiResponseMaxMs');
  });

  await test('counts correctly', () => {
    resetAll();
    createRelation({ type: 'peer', initiatorId: 'a', initiatorEntityType: 'agent', recipientId: 'b', recipientEntityType: 'agent' });
    const cr2 = createRelation({ type: 'mentorship', initiatorId: 'c', initiatorEntityType: 'persona', recipientId: 'd', recipientEntityType: 'user' });
    assert(cr2.ok, 'create');
    changeRelationStatus({ relationId: cr2.data.id, newStatus: 'ACTIVE', actorId: 'c' });

    const report = getKoHealthReport();
    assertEqual(report.totalRelations, 2, 'totalRelations');
    assertEqual(report.activeRelations, 1, 'activeRelations');
  });
}

async function runInteractionTrackerTests() {
  console.log('\n📡 Interaction Tracker');

  await test('appendInteraction is called by recordInteraction', () => {
    resetAll();
    const cr = createRelation({ type: 'collaboration', initiatorId: 'trk-a', initiatorEntityType: 'agent', recipientId: 'trk-b', recipientEntityType: 'agent' });
    assert(cr.ok, 'create');
    const ir = recordInteraction({ relationId: cr.data.id, actorId: 'trk-a', note: 'Test note' });
    assert(ir.ok, 'interaction');
    assertEqual(countInteractions(), 1, 'one interaction tracked');
  });

  await test('getInteractionsByRelation returns logged events', () => {
    resetAll();
    const cr = createRelation({ type: 'peer', initiatorId: 'ia', initiatorEntityType: 'agent', recipientId: 'ib', recipientEntityType: 'agent' });
    assert(cr.ok, 'create');
    recordInteraction({ relationId: cr.data.id, actorId: 'ia', note: 'Note 1' });
    recordInteraction({ relationId: cr.data.id, actorId: 'ib', note: 'Note 2' });
    const events = getInteractionsByRelation(cr.data.id);
    assertEqual(events.length, 2, 'two tracked events');
    assert(events.every((e) => e.relationId === cr.data.id), 'all for same relation');
  });

  await test('getInteractionsByActor returns events by actor', () => {
    resetAll();
    const cr = createRelation({ type: 'peer', initiatorId: 'actor-X', initiatorEntityType: 'agent', recipientId: 'actor-Y', recipientEntityType: 'agent' });
    assert(cr.ok, 'create');
    recordInteraction({ relationId: cr.data.id, actorId: 'actor-X' });
    recordInteraction({ relationId: cr.data.id, actorId: 'actor-Y' });
    recordInteraction({ relationId: cr.data.id, actorId: 'actor-X' });
    const xEvents = getInteractionsByActor('actor-X');
    assertEqual(xEvents.length, 2, 'two events for actor-X');
    const yEvents = getInteractionsByActor('actor-Y');
    assertEqual(yEvents.length, 1, 'one event for actor-Y');
  });
}

async function runEdgeCaseTests() {
  console.log('\n⚠️  Edge Cases');

  await test('handles all 7 relation types', () => {
    resetAll();
    const types = ['hierarchical', 'peer', 'mentorship', 'sponsorship', 'collaboration', 'contractual', 'affiliation'] as const;
    let i = 0;
    for (const type of types) {
      const result = createRelation({
        type,
        initiatorId: `e${i}`,
        initiatorEntityType: 'agent',
        recipientId: `r${i}`,
        recipientEntityType: 'agent',
      });
      assert(result.ok, `${type} should create OK`);
      i++;
    }
    const all = queryRelations();
    assert(all.ok, 'list should succeed');
    assertEqual(all.data.length, 7, 'all 7 types created');
  });

  await test('bulk list performance ≤ 50ms', () => {
    resetAll();
    for (let i = 0; i < 50; i++) {
      createRelation({ type: 'peer', initiatorId: `a${i}`, initiatorEntityType: 'agent', recipientId: `b${i}`, recipientEntityType: 'agent' });
    }
    const start = performance.now();
    const result = queryRelations();
    const dur = performance.now() - start;
    assert(result.ok, 'should succeed');
    assertEqual(result.data.length, 50, '50 results');
    assert(dur <= KO_PERFORMANCE_MAX_MS, `bulk query ${dur.toFixed(2)}ms > ${KO_PERFORMANCE_MAX_MS}ms`);
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('========================================');
  console.log('KONVENKCIONALNI ODNOSI — Core Tests');
  console.log('========================================');

  await runCreateTests();
  await runStatusTests();
  await runInteractionTests();
  await runQueryTests();
  await runGetTests();
  await runHealthTests();
  await runInteractionTrackerTests();
  await runEdgeCaseTests();

  console.log('\n========================================');
  console.log(`Results: ${passed} passed, ${failed} failed`);
  if (failures.length > 0) {
    console.error('\nFailures:');
    failures.forEach((f) => console.error(`  - ${f}`));
    process.exit(1);
  } else {
    console.log('✅ All tests passed');
  }
}

main().catch((e) => {
  console.error('Unexpected test runner error:', e);
  process.exit(1);
});
