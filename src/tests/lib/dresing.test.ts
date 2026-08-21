// SpajaUltraOmegaCore -∞Ω+∞ — DRESING Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  evaluateDresing,
  getDresingHealthReport,
  _resetDresingMetrics,
  DRESING_CONTRACT_VERSION,
  DRESING_DISCLAIMER,
  DRESING_PERFORMANCE_MAX_MS,
  DRESING_PERSONA_ID,
} from '../../lib/dresing';

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
  _resetDresingMetrics();

  console.log('\n🔎 [dresing] constants');

  await test('contract version is non-empty', () => {
    assert(DRESING_CONTRACT_VERSION.length > 0, 'contract version must be defined');
  });

  await test('persona id is stable', () => {
    assert(DRESING_PERSONA_ID === 'dresing-core', `unexpected persona id: ${DRESING_PERSONA_ID}`);
  });

  await test('disclaimer is non-empty', () => {
    assert(DRESING_DISCLAIMER.length > 0, 'disclaimer must be defined');
  });

  await test('performance max is 50ms', () => {
    assert(DRESING_PERFORMANCE_MAX_MS === 50, `expected 50, got ${DRESING_PERFORMANCE_MAX_MS}`);
  });

  console.log('\n🔎 [dresing] engine — happy path');

  await test('formal occasion with classic style at matching formality returns high score', () => {
    const result = evaluateDresing({
      referenceId: 'dress-1',
      occasion: 'formal',
      weatherTempC: 20,
      windSpeedKmh: 10,
      precipitation: 0,
      formalityLevel: 9,
      colorPalette: ['black', 'white'],
      preferredStyle: 'classic',
    });
    assert(result.valid, `expected valid, got: ${result.warnings.join(', ')}`);
    assert(result.fitScore > 50, `expected fitScore > 50, got ${result.fitScore}`);
    assert(
      result.dresscodeStatus === 'PERFECT_FIT' || result.dresscodeStatus === 'APPROPRIATE',
      `unexpected status: ${result.dresscodeStatus}`,
    );
    assert(result.disclaimer.length > 0, 'disclaimer must be present');
    assert(result.durationMs < DRESING_PERFORMANCE_MAX_MS, `durationMs ${result.durationMs} exceeds limit`);
  });

  await test('business occasion with sporty style gets lower styleCoherence', () => {
    const r1 = evaluateDresing({
      occasion: 'business', weatherTempC: 20, windSpeedKmh: 5, precipitation: 0,
      formalityLevel: 7, colorPalette: ['navy'], preferredStyle: 'classic',
    });
    const r2 = evaluateDresing({
      occasion: 'business', weatherTempC: 20, windSpeedKmh: 5, precipitation: 0,
      formalityLevel: 7, colorPalette: ['navy'], preferredStyle: 'sporty',
    });
    assert(r1.styleCoherence > r2.styleCoherence, 'classic should have higher coherence for business');
  });

  await test('weather adaptation is generated for cold weather', () => {
    const result = evaluateDresing({
      occasion: 'outdoor', weatherTempC: 2, windSpeedKmh: 20, precipitation: 30,
      formalityLevel: 3, colorPalette: ['green'], preferredStyle: 'sporty',
    });
    assert(result.valid, 'expected valid');
    assert(result.weatherAdaptation.length > 0, 'expected weather adaptation text');
  });

  await test('health report increments evaluations', () => {
    _resetDresingMetrics();
    evaluateDresing({ occasion: 'casual', weatherTempC: 22, windSpeedKmh: 5, precipitation: 0, formalityLevel: 3, colorPalette: ['blue'], preferredStyle: 'minimalist' });
    evaluateDresing({ occasion: 'sport', weatherTempC: 18, windSpeedKmh: 10, precipitation: 10, formalityLevel: 1, colorPalette: [], preferredStyle: 'sporty' });
    const report = getDresingHealthReport();
    assert(report.evaluations === 2, `expected 2, got ${report.evaluations}`);
    assert(report.personaId === DRESING_PERSONA_ID, 'personaId mismatch');
  });

  console.log('\n🔎 [dresing] edge cases');

  await test('extreme heat > 45°C triggers warning and NEEDS_ADJUSTMENT', () => {
    const result = evaluateDresing({
      occasion: 'outdoor', weatherTempC: 46, windSpeedKmh: 5, precipitation: 0,
      formalityLevel: 3, colorPalette: ['white'], preferredStyle: 'sporty',
    });
    assert(result.valid, 'expected valid');
    assert(result.warnings.some((w) => w.includes('Extreme') || w.includes('extreme')), 'expected extreme weather warning');
    assert(result.dresscodeStatus === 'NEEDS_ADJUSTMENT', `expected NEEDS_ADJUSTMENT, got ${result.dresscodeStatus}`);
  });

  await test('extreme cold < -20°C triggers warning', () => {
    const result = evaluateDresing({
      occasion: 'outdoor', weatherTempC: -25, windSpeedKmh: 30, precipitation: 20,
      formalityLevel: 3, colorPalette: ['grey'], preferredStyle: 'sporty',
    });
    assert(result.valid, 'expected valid');
    assert(result.warnings.length > 0, 'expected extreme cold warning');
  });

  await test('formalityLevel mismatch > 4 returns MISMATCH', () => {
    const result = evaluateDresing({
      occasion: 'formal',
      weatherTempC: 20, windSpeedKmh: 5, precipitation: 0,
      formalityLevel: 2,
      colorPalette: ['denim'],
      preferredStyle: 'streetwear',
    });
    assert(result.valid, 'expected valid');
    assert(result.dresscodeStatus === 'MISMATCH', `expected MISMATCH, got ${result.dresscodeStatus}`);
  });

  await test('empty colorPalette adds warning but is still valid', () => {
    const result = evaluateDresing({
      occasion: 'casual', weatherTempC: 20, windSpeedKmh: 5, precipitation: 0,
      formalityLevel: 3, colorPalette: [], preferredStyle: 'neutral',
    });
    assert(result.valid, 'expected valid');
    assert(result.warnings.some((w) => w.includes('color')), 'expected color palette warning');
  });

  await test('invalid occasion returns invalid', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = evaluateDresing({ occasion: 'gala-night' as any, weatherTempC: 20, windSpeedKmh: 5, precipitation: 0, formalityLevel: 5, colorPalette: [], preferredStyle: 'neutral' });
    assert(!result.valid, 'expected invalid');
  });

  await test('formalityLevel = -1 returns invalid', () => {
    const result = evaluateDresing({ occasion: 'casual', weatherTempC: 20, windSpeedKmh: 5, precipitation: 0, formalityLevel: -1, colorPalette: [], preferredStyle: 'casual' as never });
    assert(!result.valid, 'expected invalid for negative formalityLevel');
  });

  await test('formalityLevel = 11 returns invalid', () => {
    const result = evaluateDresing({ occasion: 'casual', weatherTempC: 20, windSpeedKmh: 5, precipitation: 0, formalityLevel: 11, colorPalette: [], preferredStyle: 'casual' as never });
    assert(!result.valid, 'expected invalid for formalityLevel > 10');
  });

  await test('NaN weatherTempC returns invalid', () => {
    const result = evaluateDresing({ occasion: 'casual', weatherTempC: NaN, windSpeedKmh: 5, precipitation: 0, formalityLevel: 3, colorPalette: [], preferredStyle: 'neutral' });
    assert(!result.valid, 'expected invalid for NaN temp');
  });

  await test('Infinity precipitation returns invalid', () => {
    const result = evaluateDresing({ occasion: 'casual', weatherTempC: 20, windSpeedKmh: 5, precipitation: Infinity, formalityLevel: 3, colorPalette: [], preferredStyle: 'neutral' });
    assert(!result.valid, 'expected invalid for Infinity precipitation');
  });

  await test('disclaimer is always present in valid result', () => {
    const result = evaluateDresing({ occasion: 'casual', weatherTempC: 22, windSpeedKmh: 5, precipitation: 0, formalityLevel: 3, colorPalette: ['blue'], preferredStyle: 'minimalist' });
    assert(result.valid, 'expected valid');
    assert(result.disclaimer === DRESING_DISCLAIMER, 'disclaimer must match constant');
  });
}

runTests().then(() => {
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
  if (failed > 0) {
    console.error('Failed tests:\n' + failures.map((f) => `  - ${f}`).join('\n'));
    process.exit(1);
  }
});
