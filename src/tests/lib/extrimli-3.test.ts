// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI 3 Tests
// Kompanija SPAJA — Digitalna Industrija

import { logSession, _resetSessionStore } from '../../lib/extrimli';
import {
  _resetExtrimli3Metrics,
  calculateRiskV3,
  EXTRIMLI3_CONTRACT_VERSION,
  EXTRIMLI3_MODULE_VERSION,
  EXTRIMLI3_PERSONA_ID,
  getExtrimli3HealthReport,
  getSportRiskProfile,
  listSportRiskProfiles,
  validateSportRiskProfiles,
} from '../../lib/extrimli-3';

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

async function runTests(): Promise<void> {
  console.log('\n🔎 [extrimli-3] constants');

  await test('contract and module versions are stable', () => {
    assert(EXTRIMLI3_CONTRACT_VERSION === 'v3', `unexpected contract version: ${EXTRIMLI3_CONTRACT_VERSION}`);
    assert(EXTRIMLI3_MODULE_VERSION === '3.0.0', `unexpected module version: ${EXTRIMLI3_MODULE_VERSION}`);
    assert(EXTRIMLI3_PERSONA_ID === 'extrimli-core', `unexpected persona: ${EXTRIMLI3_PERSONA_ID}`);
  });

  console.log('\n🔎 [extrimli-3] profiles');

  await test('every EXTRIMLI sport has a v3 risk profile', () => {
    assert(listSportRiskProfiles().length >= 10, 'expected at least 10 sport risk profiles');
    assert(validateSportRiskProfiles().length === 0, `profile validation errors: ${validateSportRiskProfiles().join(', ')}`);
  });

  await test('base-jumping profile is stricter than skateboarding profile', () => {
    const baseJumping = getSportRiskProfile('base-jumping');
    const skateboarding = getSportRiskProfile('skateboarding');
    assert(baseJumping !== undefined, 'base-jumping profile missing');
    assert(skateboarding !== undefined, 'skateboarding profile missing');
    assert(baseJumping!.sportMultiplier > skateboarding!.sportMultiplier, 'expected higher multiplier for base-jumping');
    assert(baseJumping!.minimumExperience > skateboarding!.minimumExperience, 'expected stricter minimum experience');
  });

  console.log('\n🔎 [extrimli-3] risk-engine');

  _resetSessionStore();
  _resetExtrimli3Metrics();

  await test('extreme weather materially increases v3 risk', () => {
    const calm = calculateRiskV3({
      sportId: 'paragliding',
      athleteExperience: 8,
      terrainDifficulty: 4,
      gearQualityIndex: 9,
      weatherData: { windSpeedKph: 10, precipitationMm: 0, temperatureC: 18, visibilityKm: 10 },
    });
    const storm = calculateRiskV3({
      sportId: 'paragliding',
      athleteExperience: 8,
      terrainDifficulty: 4,
      gearQualityIndex: 9,
      weatherData: { windSpeedKph: 140, precipitationMm: 35, temperatureC: 5, visibilityKm: 1 },
    });

    assert(calm.valid, 'calm scenario should be valid');
    assert(storm.valid, 'storm scenario should still be valid when weather data is present');
    assert(storm.riskScore > calm.riskScore, `storm score ${storm.riskScore} should exceed calm score ${calm.riskScore}`);
  });

  await test('sport-specific weighting makes base-jumping riskier than skateboarding', () => {
    const sharedInput = {
      athleteExperience: 7,
      terrainDifficulty: 5,
      gearQualityIndex: 7,
      weatherData: { windSpeedKph: 20, precipitationMm: 1, temperatureC: 16, visibilityKm: 8 },
    };
    const baseJumping = calculateRiskV3({ sportId: 'base-jumping', ...sharedInput });
    const skateboarding = calculateRiskV3({ sportId: 'skateboarding', ...sharedInput });

    assert(baseJumping.riskScore > skateboarding.riskScore, 'base-jumping should score higher than skateboarding');
  });

  await test('athlete progress snapshot improves readiness visibility', () => {
    _resetSessionStore();
    logSession({ sessionId: 'e3-1', athleteId: 'ath-v3', sportId: 'surfing', timestamp: Date.now() - 2_000, speedKph: 20, distanceKm: 2 });
    logSession({ sessionId: 'e3-2', athleteId: 'ath-v3', sportId: 'surfing', timestamp: Date.now() - 1_000, speedKph: 28, distanceKm: 3 });

    const result = calculateRiskV3({
      sportId: 'surfing',
      athleteId: 'ath-v3',
      athleteExperience: 6,
      terrainDifficulty: 4,
      gearQualityIndex: 8,
      weatherData: { windSpeedKph: 18, precipitationMm: 0, temperatureC: 22, visibilityKm: 9 },
    });

    assert(result.athleteProgress !== null, 'athlete progress should be present');
    assert(result.athleteProgress!.sessionCount === 2, `expected 2 sessions, got ${result.athleteProgress!.sessionCount}`);
    assert(result.readinessScore > 0, `expected readiness score > 0, got ${result.readinessScore}`);
  });

  await test('missing weather data blocks weather-sensitive sports', () => {
    const result = calculateRiskV3({
      sportId: 'wingsuit',
      athleteExperience: 10,
      terrainDifficulty: 4,
      gearQualityIndex: 10,
    });

    assert(!result.valid, 'wingsuit should be invalid without weather data');
    assert(result.blockers.some((blocker) => blocker.includes('weather data')), 'missing weather blocker expected');
  });

  await test('minimum experience blocker is enforced', () => {
    const result = calculateRiskV3({
      sportId: 'base-jumping',
      athleteExperience: 3,
      terrainDifficulty: 3,
      gearQualityIndex: 9,
      weatherData: { windSpeedKph: 15, precipitationMm: 0, temperatureC: 12, visibilityKm: 10 },
    });

    assert(!result.valid, 'insufficient experience should be invalid');
    assert(result.blockers.some((blocker) => blocker.includes('below sport minimum')), 'expected minimum experience blocker');
  });

  console.log('\n🔎 [extrimli-3] health');

  await test('health report tracks evaluations and readiness', () => {
    const report = getExtrimli3HealthReport();
    assert(report.profileCount >= 10, `expected >= 10 profiles, got ${report.profileCount}`);
    assert(report.riskEvaluations >= 1, `expected evaluations >= 1, got ${report.riskEvaluations}`);
    assert(report.lastReadinessScore >= 0, 'last readiness score should be non-negative');
  });

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  if (failures.length > 0) {
    console.error('\nFailures:');
    failures.forEach((failure) => console.error(`  • ${failure}`));
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
