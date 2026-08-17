// SpajaUltraOmegaCore -∞Ω+∞ — REKLAMITIN Tests
// Kompanija SPAJA — Digitalna Industrija
// NOTE 14856 — RADIKALNI NIVO

import {
  evaluateReklamitin,
  getReklamitiнHealthReport,
  _resetReklamitiнMetrics,
  REKLAMITIN_CONTRACT_VERSION,
  REKLAMITIN_DISCLAIMER,
  REKLAMITIN_MAX_INTENSITY_SCORE,
  REKLAMITIN_PERFORMANCE_MAX_MS,
  REKLAMITIN_PERSONA_ID,
} from '../../lib/reklamitin';
import { escalateLevel, deescalateLevel, computeIntensityScore, isValidLevel } from '../../lib/reklamitin/level-engine';
import { broadcastAll, computeTotalReachScore, deduplicateTargets, isValidTarget } from '../../lib/reklamitin/broadcast-engine';
import { getAudienceMultiplier, isValidSegment, computeReachScore } from '../../lib/reklamitin/reach-engine';

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
  _resetReklamitiнMetrics();

  console.log('\n🔎 [reklamitin] constants');

  await test('contract version is non-empty', () => {
    assert(REKLAMITIN_CONTRACT_VERSION.length > 0, 'contract version must be defined');
  });

  await test('persona id is stable', () => {
    assert(REKLAMITIN_PERSONA_ID === 'reklamitin-core', `unexpected persona id: ${REKLAMITIN_PERSONA_ID}`);
  });

  await test('disclaimer is non-empty', () => {
    assert(REKLAMITIN_DISCLAIMER.length > 0, 'disclaimer must be defined');
  });

  await test('disclaimer contains expected text', () => {
    assert(
      REKLAMITIN_DISCLAIMER.includes('Reklamitin rezultati su automatski generisani'),
      'disclaimer must contain the mandatory Serbian phrase',
    );
  });

  // ─── Level Engine ────────────────────────────────────────────────────────────

  console.log('\n🔎 [reklamitin] level-engine');

  await test('isValidLevel — valid levels', () => {
    for (const level of ['STANDARD', 'ELEVATED', 'AGGRESSIVE', 'RADICAL'] as const) {
      assert(isValidLevel(level), `${level} should be valid`);
    }
  });

  await test('isValidLevel — invalid values', () => {
    assert(!isValidLevel('SUPER'), 'SUPER should not be valid');
    assert(!isValidLevel(null), 'null should not be valid');
    assert(!isValidLevel(42), '42 should not be valid');
  });

  await test('escalateLevel — STANDARD → ELEVATED', () => {
    assert(escalateLevel('STANDARD') === 'ELEVATED', 'should escalate to ELEVATED');
  });

  await test('escalateLevel — AGGRESSIVE → RADICAL', () => {
    assert(escalateLevel('AGGRESSIVE') === 'RADICAL', 'should escalate to RADICAL');
  });

  await test('escalateLevel — RADICAL stays RADICAL', () => {
    assert(escalateLevel('RADICAL') === 'RADICAL', 'RADICAL should not escalate further');
  });

  await test('deescalateLevel — RADICAL → AGGRESSIVE', () => {
    assert(deescalateLevel('RADICAL') === 'AGGRESSIVE', 'should de-escalate to AGGRESSIVE');
  });

  await test('deescalateLevel — STANDARD stays STANDARD', () => {
    assert(deescalateLevel('STANDARD') === 'STANDARD', 'STANDARD should not de-escalate');
  });

  await test('computeIntensityScore — RADICAL with high budget', () => {
    const score = computeIntensityScore('RADICAL', 1000, 120);
    assert(score === REKLAMITIN_MAX_INTENSITY_SCORE, `expected ${REKLAMITIN_MAX_INTENSITY_SCORE}, got ${score}`);
  });

  await test('computeIntensityScore — NaN budget → 0 bonus', () => {
    const score = computeIntensityScore('STANDARD', NaN, 30);
    assert(score >= 100 && score <= 150, `score ${score} should be near STANDARD base`);
  });

  await test('computeIntensityScore — Infinity budget → clamped', () => {
    const score = computeIntensityScore('STANDARD', Infinity, 30);
    assert(score <= REKLAMITIN_MAX_INTENSITY_SCORE, `score ${score} must not exceed max`);
  });

  await test('computeIntensityScore — negative values → 0 bonus', () => {
    const score = computeIntensityScore('STANDARD', -100, -50);
    assert(score >= 100, `score ${score} should be at least STANDARD base`);
  });

  // ─── Broadcast Engine ────────────────────────────────────────────────────────

  console.log('\n🔎 [reklamitin] broadcast-engine');

  await test('isValidTarget — valid targets', () => {
    for (const t of ['WEB', 'MOBILE', 'EMAIL', 'SOCIAL', 'TV', 'RADIO', 'PUSH_NOTIFICATION', 'IN_APP'] as const) {
      assert(isValidTarget(t), `${t} should be valid`);
    }
  });

  await test('isValidTarget — invalid target', () => {
    assert(!isValidTarget('BILLBOARD'), 'BILLBOARD should not be valid');
  });

  await test('deduplicateTargets removes duplicates', () => {
    const result = deduplicateTargets(['WEB', 'WEB', 'MOBILE', 'MOBILE', 'WEB']);
    assert(result.length === 2, `expected 2 unique targets, got ${result.length}`);
    assert(result.includes('WEB'), 'WEB must be present');
    assert(result.includes('MOBILE'), 'MOBILE must be present');
  });

  await test('broadcastAll — RADICAL level has high reach', () => {
    const results = broadcastAll(['WEB', 'MOBILE', 'SOCIAL'], 'RADICAL', 10.0, 1.0);
    assert(results.length === 3, `expected 3 results, got ${results.length}`);
    for (const r of results) {
      assert(r.dispatched, `target ${r.target} should be dispatched`);
      assert(r.reachScore > 0, `target ${r.target} should have reachScore > 0`);
    }
  });

  await test('broadcastAll — empty targets returns empty array', () => {
    const results = broadcastAll([], 'STANDARD', 1.0, 1.0);
    assert(results.length === 0, 'empty targets should return empty results');
  });

  await test('computeTotalReachScore — averages correctly', () => {
    const results = [
      { target: 'WEB' as const, dispatched: true, dispatchMs: 1, reachScore: 80 },
      { target: 'MOBILE' as const, dispatched: true, dispatchMs: 1, reachScore: 100 },
    ];
    const total = computeTotalReachScore(results);
    assert(total === 90, `expected 90, got ${total}`);
  });

  await test('computeTotalReachScore — empty array returns 0', () => {
    const total = computeTotalReachScore([]);
    assert(total === 0, 'empty results should return 0');
  });

  // ─── Reach Engine ─────────────────────────────────────────────────────────────

  console.log('\n🔎 [reklamitin] reach-engine');

  await test('isValidSegment — valid segments', () => {
    for (const s of ['GENERAL', 'YOUTH', 'PROFESSIONAL', 'SENIOR', 'HIGH_VALUE', 'RETARGETING'] as const) {
      assert(isValidSegment(s), `${s} should be valid`);
    }
  });

  await test('isValidSegment — invalid segment', () => {
    assert(!isValidSegment('UNKNOWN'), 'UNKNOWN should not be valid');
  });

  await test('getAudienceMultiplier — RETARGETING has highest multiplier', () => {
    const retarget = getAudienceMultiplier('RETARGETING');
    const general = getAudienceMultiplier('GENERAL');
    assert(retarget > general, `RETARGETING (${retarget}) should have higher multiplier than GENERAL (${general})`);
  });

  await test('computeReachScore — NaN inputs → 0', () => {
    const score = computeReachScore(NaN, 1.0, 1.0);
    assert(score === 0, `expected 0, got ${score}`);
  });

  await test('computeReachScore — negative inputs → 0', () => {
    const score = computeReachScore(-50, -1.0, 1.0);
    assert(score === 0, `expected 0, got ${score}`);
  });

  await test('computeReachScore — clamped to 1000 max', () => {
    const score = computeReachScore(100, 100, 100);
    assert(score <= 1000, `score ${score} must not exceed 1000`);
  });

  // ─── Full Engine ────────────────────────────────────────────────────────────

  console.log('\n🔎 [reklamitin] engine — valid cases');

  await test('RADICAL level returns valid result with zero-cap', () => {
    const start = performance.now();
    const result = evaluateReklamitin({
      referenceId: 'radical-test',
      level: 'RADICAL',
      broadcastTargets: ['WEB', 'MOBILE', 'SOCIAL', 'EMAIL'],
      audienceSegment: 'HIGH_VALUE',
      durationSeconds: 120,
      budgetScore: 1000,
    });
    const elapsed = performance.now() - start;

    assert(result.valid, 'result should be valid');
    assert(result.level === 'RADICAL', 'level should be RADICAL');
    assert(result.zeroCap === true, 'RADICAL must have zeroCap');
    assert(result.frequencyCapHz === 0, 'RADICAL must have frequencyCapHz = 0');
    assert(result.intensityScore === REKLAMITIN_MAX_INTENSITY_SCORE, `expected max intensity, got ${result.intensityScore}`);
    assert(result.disclaimer.length > 0, 'disclaimer must be present');
    assert(result.disclaimer.includes('Reklamitin rezultati'), 'disclaimer must contain mandatory phrase');
    assert(result.broadcastResults.length > 0, 'broadcastResults must be non-empty');
    assert(elapsed <= REKLAMITIN_PERFORMANCE_MAX_MS * 3, `evaluation took ${elapsed.toFixed(1)}ms`);
  });

  await test('STANDARD level returns valid result', () => {
    const result = evaluateReklamitin({
      level: 'STANDARD',
      broadcastTargets: ['WEB'],
      audienceSegment: 'GENERAL',
      durationSeconds: 30,
      budgetScore: 200,
    });

    assert(result.valid, 'result should be valid');
    assert(result.zeroCap === false, 'STANDARD should not have zeroCap');
    assert(result.reachMultiplier === 1.0, 'STANDARD reachMultiplier should be 1.0');
  });

  await test('RADICAL level warning is present', () => {
    const result = evaluateReklamitin({
      level: 'RADICAL',
      broadcastTargets: ['WEB', 'MOBILE'],
      audienceSegment: 'RETARGETING',
      durationSeconds: 60,
      budgetScore: 800,
    });

    assert(result.valid, 'result should be valid');
    const hasRadicalWarning = result.warnings.some((w) => w.includes('RADICAL'));
    assert(hasRadicalWarning, 'RADICAL warning must be present');
  });

  await test('health report is accurate after evaluations', () => {
    _resetReklamitiнMetrics();
    evaluateReklamitin({
      level: 'ELEVATED',
      broadcastTargets: ['WEB'],
      audienceSegment: 'YOUTH',
      durationSeconds: 45,
      budgetScore: 300,
    });
    const report = getReklamitiнHealthReport();
    assert(report.evaluations === 1, `expected 1 evaluation, got ${report.evaluations}`);
    assert(report.lastLevel === 'ELEVATED', `expected ELEVATED, got ${report.lastLevel}`);
    assert(report.personaId === 'reklamitin-core', 'personaId must be stable');
  });

  // ─── Invalid inputs ──────────────────────────────────────────────────────────

  console.log('\n🔎 [reklamitin] engine — invalid inputs');

  await test('invalid level returns invalid result', () => {
    const result = evaluateReklamitin({
      level: 'MEGA' as never,
      broadcastTargets: ['WEB'],
      audienceSegment: 'GENERAL',
      durationSeconds: 30,
      budgetScore: 100,
    });
    assert(!result.valid, 'result should be invalid');
    assert(result.warnings.length > 0, 'should have a warning');
  });

  await test('empty broadcastTargets returns invalid result', () => {
    const result = evaluateReklamitin({
      level: 'STANDARD',
      broadcastTargets: [],
      audienceSegment: 'GENERAL',
      durationSeconds: 30,
      budgetScore: 100,
    });
    assert(!result.valid, 'result should be invalid');
  });

  await test('invalid audienceSegment returns invalid result', () => {
    const result = evaluateReklamitin({
      level: 'STANDARD',
      broadcastTargets: ['WEB'],
      audienceSegment: 'ALIENS' as never,
      durationSeconds: 30,
      budgetScore: 100,
    });
    assert(!result.valid, 'result should be invalid');
  });

  await test('NaN durationSeconds returns invalid result', () => {
    const result = evaluateReklamitin({
      level: 'STANDARD',
      broadcastTargets: ['WEB'],
      audienceSegment: 'GENERAL',
      durationSeconds: NaN,
      budgetScore: 100,
    });
    assert(!result.valid, 'NaN durationSeconds should be invalid');
  });

  await test('Infinity budgetScore returns invalid result', () => {
    const result = evaluateReklamitin({
      level: 'STANDARD',
      broadcastTargets: ['WEB'],
      audienceSegment: 'GENERAL',
      durationSeconds: 30,
      budgetScore: Infinity,
    });
    assert(!result.valid, 'Infinity budgetScore should be invalid');
  });

  await test('disclaimer always present even on invalid result', () => {
    const result = evaluateReklamitin({
      level: 'BAD' as never,
      broadcastTargets: [],
      audienceSegment: 'GENERAL',
      durationSeconds: 30,
      budgetScore: 100,
    });
    assert(result.disclaimer.length > 0, 'disclaimer must always be present');
    assert(result.disclaimer.includes('Reklamitin rezultati'), 'disclaimer must contain mandatory phrase');
  });

  // ─── Summary ─────────────────────────────────────────────────────────────────

  console.log('\n────────────────────────────────────────');
  console.log(`Results: ${passed} passed, ${failed} failed`);
  if (failures.length > 0) {
    console.error('\nFailures:');
    for (const f of failures) {
      console.error(`  • ${f}`);
    }
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
