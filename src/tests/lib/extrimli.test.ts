// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  // Registry
  SPORT_REGISTRY, getSportById, getSportsByCategory,
  // Risk
  calculateRisk, _resetRiskMetrics, getRiskMetrics,
  EXTRIMLI_CONTRACT_VERSION, EXTRIMLI_PERFORMANCE_MAX_MS, EXTRIMLI_PERSONA_ID,
  getExtrimliAggregateSignals,
  EXTRIMLI_DESTRUKCIJA_CONTRACT_VERSION,
  EXTRIMLI_DESTRUKCIJA_MODULE_VERSION,
  DESTRUCTIBLE_ASSET_REGISTRY,
  getDestructibleAssetById,
  listDestructibleAssets,
  evaluateDestruction,
  previewDestruction,
  getExtrimliDestructionHealthReport,
  _resetDestructionMetrics,
  // Performance
  logSession, getPerformanceReport, _resetSessionStore,
  // Gear
  addGearItem, getGearItem, listGearItems, updateStock, _resetGearCatalog,
  // Events
  createEvent, registerForEvent, _resetEventStore,
  // Weather
  adaptWeather,
  // Read voice
  prepareReadVoice,
  // Utils
  clamp, round, mphToKph, kphToMph, ftToM, mToFt, isValidSku,
} from '../../lib/extrimli';

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

function assertClose(actual: number, expected: number, tolerance = 0.01, label = ''): void {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(`${label}: expected ${expected} ± ${tolerance}, got ${actual}`);
  }
}

async function runTests(): Promise<void> {

  // ─── Constants ─────────────────────────────────────────────────────────────
  console.log('\n🔎 [extrimli] constants');

  await test('contract version is non-empty', () => {
    assert(EXTRIMLI_CONTRACT_VERSION.length > 0, 'contract version must be defined');
  });

  await test('persona id is stable', () => {
    assert(EXTRIMLI_PERSONA_ID === 'extrimli-core', `unexpected: ${EXTRIMLI_PERSONA_ID}`);
  });

  await test('performance max is 50ms', () => {
    assert(EXTRIMLI_PERFORMANCE_MAX_MS === 50, `expected 50, got ${EXTRIMLI_PERFORMANCE_MAX_MS}`);
  });

  await test('destrukcija contract constants are stable', () => {
    assert(EXTRIMLI_DESTRUKCIJA_CONTRACT_VERSION === 'v1-destrukcija', `unexpected: ${EXTRIMLI_DESTRUKCIJA_CONTRACT_VERSION}`);
    assert(EXTRIMLI_DESTRUKCIJA_MODULE_VERSION === '1.0.0', `unexpected: ${EXTRIMLI_DESTRUKCIJA_MODULE_VERSION}`);
  });


  await test('aggregate health signals expose source of truth and bounded values', () => {
    const signals = getExtrimliAggregateSignals();
    assert(signals.sourceOfTruth === '/api/extrimli/health', 'unexpected sourceOfTruth');
    assert(Number.isFinite(signals.readinessSignal) && signals.readinessSignal >= 0 && signals.readinessSignal <= 100, 'readinessSignal must be in [0, 100]');
    assert(Number.isFinite(signals.safetySignal) && signals.safetySignal >= 0 && signals.safetySignal <= 100, 'safetySignal must be in [0, 100]');
    assert([0, 100].includes(signals.degradationSignal), 'degradationSignal should be binary');
  });

  // ─── Registry ──────────────────────────────────────────────────────────────
  console.log('\n🔎 [extrimli] registry');

  await test('registry has at least 10 sports', () => {
    assert(SPORT_REGISTRY.length >= 10, `expected ≥ 10, got ${SPORT_REGISTRY.length}`);
  });

  await test('getSportById returns correct sport', () => {
    const s = getSportById('skateboarding');
    assert(s !== undefined, 'skateboarding should exist');
    assert(s!.riskClass === 'II', `expected II, got ${s!.riskClass}`);
  });

  await test('getSportById returns undefined for unknown id', () => {
    assert(getSportById('unknown-sport') === undefined, 'should return undefined');
  });

  await test('getSportsByCategory returns correct subset', () => {
    const air = getSportsByCategory('air');
    assert(air.length > 0, 'should have air sports');
    assert(air.every((s) => s.category === 'air'), 'all should be air');
  });

  // ─── Risk Engine ────────────────────────────────────────────────────────────
  console.log('\n🔎 [extrimli] risk-engine');

  _resetRiskMetrics();

  await test('calculates LOW risk for expert athlete, calm conditions, best gear', () => {
    const r = calculateRisk({ sportId: 'skateboarding', athleteExperience: 10, weatherScore: 0, terrainDifficulty: 0, gearQualityIndex: 10 });
    assert(r.valid, 'should be valid');
    assert(r.riskLevel === 'LOW', `expected LOW, got ${r.riskLevel}`);
    assert(r.riskScore < 25, `expected < 25, got ${r.riskScore}`);
  });

  await test('calculates EXTREME risk for novice, storm conditions, bad gear', () => {
    const r = calculateRisk({ sportId: 'base-jumping', athleteExperience: 0, weatherScore: 10, terrainDifficulty: 10, gearQualityIndex: 0 });
    assert(r.valid, 'should be valid');
    assert(r.riskLevel === 'EXTREME', `expected EXTREME, got ${r.riskLevel}`);
    assert(r.riskScore >= 75, `expected ≥ 75, got ${r.riskScore}`);
  });

  await test('rejects non-finite weatherScore', () => {
    const r = calculateRisk({ sportId: 'surfing', athleteExperience: 5, weatherScore: NaN, terrainDifficulty: 3, gearQualityIndex: 8 });
    assert(!r.valid, 'should be invalid');
    assert(r.warnings.length > 0, 'should have warnings');
  });

  await test('rejects Infinity in athleteExperience', () => {
    const r = calculateRisk({ sportId: 'surfing', athleteExperience: Infinity, weatherScore: 3, terrainDifficulty: 3, gearQualityIndex: 8 });
    assert(!r.valid, 'should be invalid');
  });

  await test('rejects out-of-range gearQualityIndex', () => {
    const r = calculateRisk({ sportId: 'surfing', athleteExperience: 5, weatherScore: 3, terrainDifficulty: 3, gearQualityIndex: 11 });
    assert(!r.valid, 'should be invalid');
  });

  await test('rejects empty sportId', () => {
    const r = calculateRisk({ sportId: '', athleteExperience: 5, weatherScore: 3, terrainDifficulty: 3, gearQualityIndex: 8 });
    assert(!r.valid, 'should be invalid');
  });

  await test('risk score is clamped to [0, 100]', () => {
    const r = calculateRisk({ sportId: 'paragliding', athleteExperience: 5, weatherScore: 5, terrainDifficulty: 5, gearQualityIndex: 5 });
    assert(r.valid, 'should be valid');
    assert(r.riskScore >= 0 && r.riskScore <= 100, `score out of range: ${r.riskScore}`);
  });

  await test('metrics increment after valid calculation', () => {
    _resetRiskMetrics();
    calculateRisk({ sportId: 'bmx', athleteExperience: 5, weatherScore: 5, terrainDifficulty: 5, gearQualityIndex: 5 });
    const m = getRiskMetrics();
    assert(m.riskEvaluations === 1, `expected 1 evaluation, got ${m.riskEvaluations}`);
  });

  await test('duration is non-negative', () => {
    const r = calculateRisk({ sportId: 'snowboarding', athleteExperience: 7, weatherScore: 2, terrainDifficulty: 4, gearQualityIndex: 8 });
    assert(r.durationMs >= 0, `durationMs should be >= 0, got ${r.durationMs}`);
  });

  // ─── DESTRUKCIJA ──────────────────────────────────────────────────────────────
  console.log('\n🔎 [extrimli] destrukcija');

  _resetDestructionMetrics();

  await test('destructible registry has at least 5 assets', () => {
    assert(DESTRUCTIBLE_ASSET_REGISTRY.length >= 5, `expected ≥ 5, got ${DESTRUCTIBLE_ASSET_REGISTRY.length}`);
  });

  await test('getDestructibleAssetById returns correct asset', () => {
    const asset = getDestructibleAssetById('glass-dome-arena');
    assert(asset !== undefined, 'glass-dome-arena should exist');
    assert(asset!.material === 'glass', `expected glass, got ${asset!.material}`);
  });

  await test('listDestructibleAssets filters by dimension and material', () => {
    const assets = listDestructibleAssets({ dimension: '1440D', material: 'glass' });
    assert(assets.length > 0, 'expected at least one filtered asset');
    assert(assets.every((asset) => asset.material === 'glass' && asset.destructibleDimensions.includes('1440D')), 'filter mismatch');
  });

  await test('evaluateDestruction returns MINOR result for controlled impact', () => {
    const result = evaluateDestruction({
      assetId: 'timber-obstacle-grid',
      dimension: '720D',
      impactForce: 65,
      resonanceIndex: 2,
      containmentLevel: 9,
      athleteExperience: 8,
      sportId: 'bmx',
    });
    assert(result.valid, 'result should be valid');
    assert(result.severityLevel === 'MINOR', `expected MINOR, got ${result.severityLevel}`);
    assert(result.fragmentCount >= 0, 'fragment count should be non-negative');
  });

  await test('evaluateDestruction returns CATASTROPHIC result for extreme impact', () => {
    const result = evaluateDestruction({
      assetId: 'composite-flight-tower',
      dimension: '5760D',
      impactForce: 980,
      resonanceIndex: 10,
      containmentLevel: 0,
      athleteExperience: 1,
      sportId: 'base-jumping',
    });
    assert(result.valid, 'result should be valid');
    assert(result.severityLevel === 'CATASTROPHIC', `expected CATASTROPHIC, got ${result.severityLevel}`);
    assert(result.rollbackRecommended, 'rollback should be recommended');
  });

  await test('evaluateDestruction rejects unsupported dimension for asset', () => {
    const result = evaluateDestruction({
      assetId: 'glass-dome-arena',
      dimension: '5760D',
      impactForce: 300,
      resonanceIndex: 3,
      containmentLevel: 6,
    });
    assert(!result.valid, 'result should be invalid');
    assert(result.warnings.length > 0, 'expected warnings');
  });

  await test('evaluateDestruction rejects non-finite impactForce', () => {
    const result = evaluateDestruction({
      assetId: 'glass-dome-arena',
      dimension: '720D',
      impactForce: NaN,
      resonanceIndex: 4,
      containmentLevel: 6,
    });
    assert(!result.valid, 'result should be invalid');
  });

  await test('previewDestruction clamps unsafe output and marks degraded mode', () => {
    const result = previewDestruction({
      assetId: 'glass-dome-arena',
      dimension: '1440D',
      impactForce: 1000,
      resonanceIndex: 10,
      containmentLevel: 0,
    });
    assert(result.valid, 'preview should be valid');
    assert(result.degraded, 'preview should be degraded');
    assert(result.activationRequired === false, 'preview should not require activation');
    assert(result.degradedMode === 'safety-clamped-output', `unexpected degraded mode: ${result.degradedMode}`);
  });

  await test('destruction health report tracks evaluations and registry size', () => {
    const report = getExtrimliDestructionHealthReport();
    assert(report.registrySize >= 5, `expected registry size >= 5, got ${report.registrySize}`);
    assert(report.destructionEvaluations >= 1, `expected destruction evaluations >= 1, got ${report.destructionEvaluations}`);
    assert(report.previewEvaluations >= 1, `expected preview evaluations >= 1, got ${report.previewEvaluations}`);
  });

  // ─── Performance Tracker ───────────────────────────────────────────────────
  console.log('\n🔎 [extrimli] performance-tracker');

  _resetSessionStore();

  await test('logs a session and returns report', () => {
    logSession({ sessionId: 's1', athleteId: 'ath1', sportId: 'skateboarding', timestamp: 1000, speedKph: 25 });
    const r = getPerformanceReport('ath1');
    assert(r.valid, 'should be valid');
    assert(r.sessions.length === 1, `expected 1 session, got ${r.sessions.length}`);
  });

  await test('detects personal best', () => {
    logSession({ sessionId: 's2', athleteId: 'ath1', sportId: 'skateboarding', timestamp: 2000, speedKph: 35 });
    const r = getPerformanceReport('ath1');
    const pb = r.personalBests.find((p) => p.metric === 'speedKph');
    assert(pb !== undefined, 'should have speedKph PB');
    assert(pb!.value === 35, `expected 35, got ${pb!.value}`);
  });

  await test('calculates improvement rate for multiple sessions', () => {
    _resetSessionStore();
    logSession({ sessionId: 'a1', athleteId: 'ath2', sportId: 'bmx', timestamp: 1000, speedKph: 20, distanceKm: 5 });
    logSession({ sessionId: 'a2', athleteId: 'ath2', sportId: 'bmx', timestamp: 2000, speedKph: 30, distanceKm: 8 });
    const r = getPerformanceReport('ath2');
    assert(r.improvementRate > 0, `expected positive improvement rate, got ${r.improvementRate}`);
  });

  await test('returns warning for athlete with no sessions', () => {
    _resetSessionStore();
    const r = getPerformanceReport('nobody');
    assert(r.valid, 'should be valid');
    assert(r.warnings.length > 0, 'should warn about no sessions');
    assert(r.sessions.length === 0, 'should have 0 sessions');
  });

  await test('returns invalid for empty athleteId', () => {
    const r = getPerformanceReport('');
    assert(!r.valid, 'should be invalid for empty id');
  });

  await test('improvement rate is 0 with single session', () => {
    _resetSessionStore();
    logSession({ sessionId: 'x1', athleteId: 'ath3', sportId: 'surfing', timestamp: 1000, speedKph: 40 });
    const r = getPerformanceReport('ath3');
    assert(r.improvementRate === 0, `expected 0, got ${r.improvementRate}`);
  });

  // ─── Gear Catalog ──────────────────────────────────────────────────────────
  console.log('\n🔎 [extrimli] gear-catalog');

  await test('seed catalog has items', () => {
    const items = listGearItems();
    assert(items.length > 0, 'seed catalog should have items');
  });

  await test('getGearItem returns correct item', () => {
    const item = getGearItem('HLM-001');
    assert(item !== undefined, 'HLM-001 should exist');
    assert(item!.category === 'helmet', `expected helmet, got ${item!.category}`);
  });

  await test('getGearItem returns undefined for unknown SKU', () => {
    assert(getGearItem('NONE-999') === undefined, 'should return undefined');
  });

  await test('affiliateCommission is calculated correctly', () => {
    const item = getGearItem('HLM-001');
    assert(item !== undefined, 'HLM-001 must exist');
    const expected = Math.round((item!.price * item!.affiliateCommissionPct / 100) * 100) / 100;
    assertClose(item!.affiliateCommission, expected, 0.01, 'affiliateCommission');
  });

  await test('addGearItem rejects negative price', () => {
    _resetGearCatalog();
    let threw = false;
    try {
      addGearItem({ sku: 'TEST-01', brand: 'X', name: 'Test', category: 'helmet', safetyRating: 3, price: -10, stock: 5, affiliateCommissionPct: 5, sportIds: [] });
    } catch {
      threw = true;
    }
    assert(threw, 'should throw on negative price');
  });

  await test('addGearItem rejects invalid SKU', () => {
    _resetGearCatalog();
    let threw = false;
    try {
      addGearItem({ sku: 'AB', brand: 'X', name: 'T', category: 'helmet', safetyRating: 3, price: 10, stock: 5, affiliateCommissionPct: 5, sportIds: [] });
    } catch {
      threw = true;
    }
    assert(threw, 'should throw on short SKU');
  });

  await test('updateStock reduces stock correctly', () => {
    _resetGearCatalog();
    addGearItem({ sku: 'TST-100', brand: 'X', name: 'T', category: 'helmet', safetyRating: 3, price: 10, stock: 5, affiliateCommissionPct: 5, sportIds: [] });
    updateStock('TST-100', -3);
    const item = getGearItem('TST-100');
    assert(item!.stock === 2, `expected 2, got ${item!.stock}`);
  });

  await test('updateStock prevents negative stock', () => {
    _resetGearCatalog();
    addGearItem({ sku: 'TST-200', brand: 'X', name: 'T', category: 'helmet', safetyRating: 3, price: 10, stock: 2, affiliateCommissionPct: 5, sportIds: [] });
    let threw = false;
    try { updateStock('TST-200', -5); } catch { threw = true; }
    assert(threw, 'should throw when stock goes negative');
  });

  // ─── Event Engine ──────────────────────────────────────────────────────────
  console.log('\n🔎 [extrimli] event-engine');

  _resetEventStore();

  await test('creates event and returns it', () => {
    const e = createEvent({ name: 'Test Race', location: 'Park', sportId: 'skateboarding', date: Date.now() + 86_400_000, capacity: 10, prizePool: 500, minExperienceLevel: 3, minAge: 16, requiredGearCategories: ['helmet'] });
    assert(e.id.length > 0, 'event must have id');
    assert(e.status === 'upcoming', `expected upcoming, got ${e.status}`);
  });

  await test('registers athlete successfully', () => {
    _resetEventStore();
    const e = createEvent({ name: 'E2', location: 'L', sportId: 'skateboarding', date: Date.now() + 86_400_000, capacity: 5, prizePool: 0, minExperienceLevel: 0, minAge: 0, requiredGearCategories: [] });
    const r = registerForEvent({ eventId: e.id, athleteId: 'ath1', athleteExperienceLevel: 5, athleteAge: 20, ownedGearCategories: [] });
    assert(r.registered, 'should be registered');
  });

  await test('blocks registration when experience too low', () => {
    _resetEventStore();
    const e = createEvent({ name: 'E3', location: 'L', sportId: 'skateboarding', date: Date.now() + 86_400_000, capacity: 5, prizePool: 0, minExperienceLevel: 8, minAge: 0, requiredGearCategories: [] });
    const r = registerForEvent({ eventId: e.id, athleteId: 'ath1', athleteExperienceLevel: 3, athleteAge: 20, ownedGearCategories: [] });
    assert(!r.registered, 'should not register');
    assert(!r.waitlisted, 'should not be waitlisted');
  });

  await test('waitlists athlete when event is full', () => {
    _resetEventStore();
    const e = createEvent({ name: 'E4', location: 'L', sportId: 'skateboarding', date: Date.now() + 86_400_000, capacity: 1, prizePool: 0, minExperienceLevel: 0, minAge: 0, requiredGearCategories: [] });
    registerForEvent({ eventId: e.id, athleteId: 'ath1', athleteExperienceLevel: 5, athleteAge: 20, ownedGearCategories: [] });
    const r = registerForEvent({ eventId: e.id, athleteId: 'ath2', athleteExperienceLevel: 5, athleteAge: 20, ownedGearCategories: [] });
    assert(r.waitlisted, 'ath2 should be waitlisted');
  });

  await test('blocks registration for missing gear', () => {
    _resetEventStore();
    const e = createEvent({ name: 'E5', location: 'L', sportId: 'skateboarding', date: Date.now() + 86_400_000, capacity: 5, prizePool: 0, minExperienceLevel: 0, minAge: 0, requiredGearCategories: ['helmet', 'pads'] });
    const r = registerForEvent({ eventId: e.id, athleteId: 'ath1', athleteExperienceLevel: 5, athleteAge: 20, ownedGearCategories: ['helmet'] });
    assert(!r.registered, 'should not register — missing pads');
  });

  await test('createEvent throws on invalid date', () => {
    _resetEventStore();
    let threw = false;
    try { createEvent({ name: 'Bad', location: 'L', sportId: 'bmx', date: NaN, capacity: 5, prizePool: 0, minExperienceLevel: 0, minAge: 0, requiredGearCategories: [] }); } catch { threw = true; }
    assert(threw, 'should throw on NaN date');
  });

  await test('returns not found for unknown event', () => {
    const r = registerForEvent({ eventId: 'non-existent', athleteId: 'ath1', athleteExperienceLevel: 5, athleteAge: 20, ownedGearCategories: [] });
    assert(!r.registered && !r.waitlisted, 'should not register or waitlist');
  });

  // ─── Weather Adapter ───────────────────────────────────────────────────────
  console.log('\n🔎 [extrimli] weather-adapter');

  await test('adapts calm weather to low risk scores', () => {
    const f = adaptWeather({ windSpeedKph: 5, precipitationMm: 0, temperatureC: 18, visibilityKm: 10 });
    assert(f.valid, 'should be valid');
    assert(f.overallWeatherScore < 3, `expected < 3, got ${f.overallWeatherScore}`);
    assert(f.warnings.length === 0, 'should have no warnings');
  });

  await test('adapts extreme wind to high risk modifier', () => {
    const f = adaptWeather({ windSpeedKph: 150, precipitationMm: 0, temperatureC: 15, visibilityKm: 5 });
    assert(f.windRiskModifier === 10, `expected 10, got ${f.windRiskModifier}`);
  });

  await test('handles missing wind speed with warning and valid false', () => {
    const f = adaptWeather({ precipitationMm: 5, temperatureC: 10 });
    assert(!f.valid, 'should be invalid when wind is missing');
    assert(f.warnings.some((w) => w.includes('windSpeedKph')), 'should warn about missing wind');
  });

  await test('handles all missing data', () => {
    const f = adaptWeather({});
    assert(!f.valid, 'should be invalid when all data missing');
    assert(f.overallWeatherScore === 0, `expected 0, got ${f.overallWeatherScore}`);
  });

  await test('gear recommendation mentions insulation for cold temp', () => {
    const f = adaptWeather({ windSpeedKph: 10, precipitationMm: 0, temperatureC: -15, visibilityKm: 8 });
    assert(f.gearRecommendation.toLowerCase().includes('insulation') || f.gearRecommendation.toLowerCase().includes('thermal'), `unexpected recommendation: ${f.gearRecommendation}`);
  });

  await test('clamps precipitation risk to 10', () => {
    const f = adaptWeather({ windSpeedKph: 0, precipitationMm: 9999, temperatureC: 5, visibilityKm: 1 });
    assert(f.terrainRiskModifier <= 10, `should be ≤ 10, got ${f.terrainRiskModifier}`);
  });

  // ─── Read Voice ─────────────────────────────────────────────────────────────
  console.log('\n🔎 [extrimli] read-voice');

  await test('prepareReadVoice builds combined HARD ULTRA RAGE DILIT prompt', () => {
    const result = prepareReadVoice({
      text: 'Stabilize the landing and lower your speed.',
      modifiers: ['hard', 'ultra', 'rage', 'dilit'],
      locale: 'en',
    });
    assert(result.valid, 'should be valid');
    assert(result.requestLabel === 'EXTRIMLI HARD ULTRA RAGE DILIT', `unexpected label: ${result.requestLabel}`);
    assert(result.selectedVoice === 'onyx', `expected onyx, got ${result.selectedVoice}`);
    assert(result.renderedText.includes('voice read'), 'should include voice read intro');
  });

  await test('prepareReadVoice rejects empty text', () => {
    const result = prepareReadVoice({ text: '   ' });
    assert(!result.valid, 'should be invalid');
    assert(result.warnings.includes('text is required'), 'should warn about missing text');
  });

  // ─── Utils ─────────────────────────────────────────────────────────────────
  console.log('\n🔎 [extrimli] utils');

  await test('clamp keeps value in range', () => {
    assert(clamp(150, 0, 100) === 100, 'should clamp to max');
    assert(clamp(-5, 0, 100)  === 0,   'should clamp to min');
    assert(clamp(50, 0, 100)  === 50,  'should stay at value');
  });

  await test('clamp returns min for NaN, max for Infinity', () => {
    assert(clamp(NaN, 0, 100)       === 0,   'NaN → min');
    assert(clamp(Infinity, 0, 100)  === 100, 'Infinity → max');
    assert(clamp(-Infinity, 0, 100) === 0,   '-Infinity → min');
  });

  await test('round works correctly', () => {
    assertClose(round(3.14159, 2), 3.14, 0.001, 'round');
  });

  await test('mphToKph converts correctly', () => {
    assertClose(mphToKph(60), 96.56, 0.1, 'mphToKph');
  });

  await test('kphToMph converts correctly', () => {
    assertClose(kphToMph(100), 62.14, 0.1, 'kphToMph');
  });

  await test('ftToM converts correctly', () => {
    assertClose(ftToM(1000), 304.8, 0.1, 'ftToM');
  });

  await test('mToFt converts correctly', () => {
    assertClose(mToFt(100), 328.08, 0.1, 'mToFt');
  });

  await test('isValidSku accepts valid SKU', () => {
    assert(isValidSku('HLM-001'), 'HLM-001 should be valid');
  });

  await test('isValidSku rejects short SKU', () => {
    assert(!isValidSku('AB'), 'AB is too short');
  });

  await test('isValidSku rejects spaces', () => {
    assert(!isValidSku('HLM 001'), 'spaces not allowed');
  });

  // ─── Summary ────────────────────────────────────────────────────────────────
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  if (failures.length > 0) {
    console.error('\nFailures:');
    failures.forEach((f) => console.error(`  • ${f}`));
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
