// SpajaUltraOmegaCore -∞Ω+∞ — EKSELENCIO Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  evaluateEkselencio,
  getEkselencioHealthReport,
  _resetEkselencioMetrics,
  EKSELENCIO_CONTRACT_VERSION,
  EKSELENCIO_DISCLAIMER,
  EKSELENCIO_PERSONA_ID,
  EKSELENCIO_PERFORMANCE_MAX_MS,
  EKUARE_PILLARS,
} from '../../lib/ekselencio';
import { computeEvolutionSignal } from '../../lib/ekselencio/evolution-signal';
import { geometricMeanTop4 } from '../../lib/ekselencio/ekuare-engine';

let passed = 0;
let failed = 0;
const failures: string[] = [];

async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`  ❌ ${name}`);
    console.error(`     ${message}`);
    failed++;
    failures.push(`${name}: ${message}`);
  }
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

async function runTests(): Promise<void> {
  _resetEkselencioMetrics();

  // ─── Constants ─────────────────────────────────────────────────────────────

  console.log('\n🔎 [ekselencio] constants');

  await test('contract version is defined', () => {
    assert(EKSELENCIO_CONTRACT_VERSION.length > 0, 'contract version must be defined');
  });

  await test('persona id is stable', () => {
    assert(EKSELENCIO_PERSONA_ID === 'ekselencio-apex', `unexpected persona id: ${EKSELENCIO_PERSONA_ID}`);
  });

  await test('disclaimer is non-empty', () => {
    assert(EKSELENCIO_DISCLAIMER.length > 0, 'disclaimer must be defined');
  });

  await test('EKUARE_PILLARS has exactly 6 entries', () => {
    assert(EKUARE_PILLARS.length === 6, `expected 6 pillars, got ${EKUARE_PILLARS.length}`);
  });

  // ─── Tiers ─────────────────────────────────────────────────────────────────

  console.log('\n🔎 [ekselencio] tier thresholds');

  await test('score 0 → GENESIS', () => {
    const r = evaluateEkselencio({ agentId: 'test', domainScores: {} });
    assert(r.tier === 'GENESIS', `expected GENESIS, got ${r.tier}`);
    assert(r.ekuareRaScore === 0, `expected 0, got ${r.ekuareRaScore}`);
  });

  await test('score ~800+ → TRANSCENDENT', () => {
    const r = evaluateEkselencio({
      agentId: 'test',
      domainScores: { ES: 100, KC: 100, UOA: 100, AR: 100, RT: 100, EV: 100 },
    });
    assert(r.tier === 'TRANSCENDENT', `expected TRANSCENDENT, got ${r.tier}`);
    assert(r.ekuareRaScore > 800, `expected >800, got ${r.ekuareRaScore}`);
  });

  await test('mid scores → MASTER tier', () => {
    const r = evaluateEkselencio({
      agentId: 'test',
      domainScores: { ES: 70, KC: 70, UOA: 70, AR: 70, RT: 70, EV: 70 },
    });
    assert(['MASTER', 'APEX'].includes(r.tier), `unexpected tier: ${r.tier}`);
  });

  // ─── Blind spots ───────────────────────────────────────────────────────────

  console.log('\n🔎 [ekselencio] blind spots');

  await test('pillar score < 20 → blind spot', () => {
    const r = evaluateEkselencio({
      agentId: 'test',
      domainScores: { ES: 10, KC: 50, UOA: 50, AR: 50, RT: 50, EV: 50 },
    });
    assert(r.blindSpots.includes('ES'), 'ES should be a blind spot');
  });

  await test('all pillars >= 20 → no blind spots', () => {
    const r = evaluateEkselencio({
      agentId: 'test',
      domainScores: { ES: 20, KC: 20, UOA: 20, AR: 20, RT: 20, EV: 20 },
    });
    assert(r.blindSpots.length === 0, `unexpected blind spots: ${r.blindSpots.join(', ')}`);
  });

  // ─── Edge cases ────────────────────────────────────────────────────────────

  console.log('\n🔎 [ekselencio] edge cases');

  await test('NaN scores clamped to 0', () => {
    const r = evaluateEkselencio({
      agentId: 'test',
      domainScores: { ES: NaN, KC: 50, UOA: 50, AR: 50, RT: 50, EV: 50 },
    });
    assert(r.valid, 'should be valid');
    const es = r.pillars.find((p) => p.pillar === 'ES');
    assert(es?.score === 0, `ES score should be 0, got ${es?.score}`);
  });

  await test('Infinity scores clamped to 100', () => {
    const r = evaluateEkselencio({
      agentId: 'test',
      domainScores: { ES: Infinity, KC: 50, UOA: 50, AR: 50, RT: 50, EV: 50 },
    });
    const es = r.pillars.find((p) => p.pillar === 'ES');
    assert(es?.score === 100, `ES score should be 100, got ${es?.score}`);
  });

  await test('negative scores clamped to 0', () => {
    const r = evaluateEkselencio({
      agentId: 'test',
      domainScores: { ES: -50, KC: 50, UOA: 50, AR: 50, RT: 50, EV: 50 },
    });
    const es = r.pillars.find((p) => p.pillar === 'ES');
    assert(es?.score === 0, `ES score should be 0, got ${es?.score}`);
  });

  await test('scores > 100 clamped to 100', () => {
    const r = evaluateEkselencio({
      agentId: 'test',
      domainScores: { ES: 999, KC: 50, UOA: 50, AR: 50, RT: 50, EV: 50 },
    });
    const es = r.pillars.find((p) => p.pillar === 'ES');
    assert(es?.score === 100, `ES score should be 100, got ${es?.score}`);
  });

  await test('empty domainScores → GENESIS with all blind spots', () => {
    const r = evaluateEkselencio({ agentId: 'test', domainScores: {} });
    assert(r.tier === 'GENESIS', `expected GENESIS, got ${r.tier}`);
    assert(r.blindSpots.length === 6, `expected 6 blind spots, got ${r.blindSpots.length}`);
  });

  await test('missing agentId → invalid result', () => {
    const r = evaluateEkselencio({ agentId: '', domainScores: { ES: 50 } });
    assert(!r.valid, 'should be invalid');
  });

  await test('all pillars = 0 → score 0, tier GENESIS', () => {
    const r = evaluateEkselencio({
      agentId: 'test',
      domainScores: { ES: 0, KC: 0, UOA: 0, AR: 0, RT: 0, EV: 0 },
    });
    assert(r.ekuareRaScore === 0, `expected 0, got ${r.ekuareRaScore}`);
    assert(r.tier === 'GENESIS', `expected GENESIS, got ${r.tier}`);
  });

  await test('disclaimer always present', () => {
    const r = evaluateEkselencio({ agentId: 'test', domainScores: { ES: 50 } });
    assert(r.disclaimer === EKSELENCIO_DISCLAIMER, 'disclaimer must always be present');
  });

  // ─── Evolution signal ──────────────────────────────────────────────────────

  console.log('\n🔎 [ekselencio] evolution signal');

  await test('ascending history → positive signal', () => {
    const signal = computeEvolutionSignal([10, 20, 30, 40, 50]);
    assert(signal > 0, `expected positive signal, got ${signal}`);
  });

  await test('descending history → negative signal', () => {
    const signal = computeEvolutionSignal([50, 40, 30, 20, 10]);
    assert(signal < 0, `expected negative signal, got ${signal}`);
  });

  await test('flat history → ~0 signal', () => {
    const signal = computeEvolutionSignal([50, 50, 50, 50, 50]);
    assert(Math.abs(signal) < 0.01, `expected ~0, got ${signal}`);
  });

  await test('empty history → 0 signal', () => {
    const signal = computeEvolutionSignal([]);
    assert(signal === 0, `expected 0, got ${signal}`);
  });

  await test('single value history → 0 signal', () => {
    const signal = computeEvolutionSignal([42]);
    assert(signal === 0, `expected 0, got ${signal}`);
  });

  await test('signal clamped to [-1, +1]', () => {
    const signal = computeEvolutionSignal([0, 0, 0, 0, 100]);
    assert(signal >= -1 && signal <= 1, `signal out of bounds: ${signal}`);
  });

  // ─── Geometric mean ────────────────────────────────────────────────────────

  console.log('\n🔎 [ekselencio] geometric mean top-4');

  await test('empty array → 0', () => {
    assert(geometricMeanTop4([]) === 0, 'expected 0');
  });

  await test('all zeros → 0', () => {
    assert(geometricMeanTop4([0, 0, 0, 0]) === 0, 'expected 0');
  });

  await test('top-4 selected from 6', () => {
    const result = geometricMeanTop4([10, 20, 80, 90, 100, 100]);
    assert(result > 0, `expected >0, got ${result}`);
  });

  // ─── Performance ───────────────────────────────────────────────────────────

  console.log('\n🔎 [ekselencio] performance');

  await test(`evaluation completes within ${EKSELENCIO_PERFORMANCE_MAX_MS}ms`, () => {
    const start = performance.now();
    evaluateEkselencio({
      agentId: 'perf-test',
      domainScores: { ES: 80, KC: 75, UOA: 90, AR: 60, RT: 70, EV: 85 },
    });
    const elapsed = performance.now() - start;
    assert(elapsed < EKSELENCIO_PERFORMANCE_MAX_MS, `took ${elapsed.toFixed(2)}ms, limit is ${EKSELENCIO_PERFORMANCE_MAX_MS}ms`);
  });

  // ─── Health report ─────────────────────────────────────────────────────────

  console.log('\n🔎 [ekselencio] health report');

  await test('health report contains evaluations count', () => {
    const report = getEkselencioHealthReport();
    assert(typeof report.evaluations === 'number', 'evaluations must be a number');
    assert(report.personaId === EKSELENCIO_PERSONA_ID, 'persona id mismatch');
  });

  // ─── Summary ───────────────────────────────────────────────────────────────

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
  if (failures.length > 0) {
    console.error('Failures:');
    failures.forEach((f) => console.error(`  • ${f}`));
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
