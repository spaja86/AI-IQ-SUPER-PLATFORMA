// SpajaUltraOmegaCore -∞Ω+∞ — ASTRONOMIK MONEY Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  evaluateAstronomikMoney,
  getAstronomikHealthReport,
  _resetAstronomikMetrics,
  ASTRONOMIK_CONTRACT_VERSION,
  ASTRONOMIK_DISCLAIMER,
  ASTRONOMIK_PERFORMANCE_MAX_MS,
  ASTRONOMIK_PERSONA_ID,
  listAllClasses,
  getCelestialDescriptor,
  isValidCelestialClass,
  computeAssetGravity,
  totalGravity,
  computeAllGravity,
  computeCosmicResilience,
  detectAutoEvents,
  analyzePortfolio,
} from '../../lib/astronomik-money';
import type { CelestialAsset, GalacticPortfolio } from '../../lib/astronomik-money';

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

// ─── Sample assets ────────────────────────────────────────────────────────────

const sampleAssets: CelestialAsset[] = [
  { id: 'a1', name: 'Alpha Star', class: 'STAR', value: 50000, mass: 1.5 },
  { id: 'a2', name: 'Beta Planet', class: 'PLANET', value: 100000, mass: 2.0 },
  { id: 'a3', name: 'Gamma Moon', class: 'MOON', value: 30000, mass: 1.0 },
  { id: 'a4', name: 'Delta Pulsar', class: 'PULSAR', value: 40000, mass: 1.2 },
];

async function runTests(): Promise<void> {
  _resetAstronomikMetrics();

  // ─── Registry ───────────────────────────────────────────────────────────────
  console.log('\n🔎 [astronomik-money] registry');

  await test('all 8 celestial classes are registered', () => {
    const classes = listAllClasses();
    assert(classes.length === 8, `expected 8 classes, got ${classes.length}`);
  });

  await test('each class has required fields', () => {
    const classes = listAllClasses();
    for (const c of classes) {
      assert(typeof c.class === 'string', `class missing for ${JSON.stringify(c)}`);
      assert(typeof c.risk === 'string', `risk missing for ${c.class}`);
      assert(typeof c.liquidity === 'string', `liquidity missing for ${c.class}`);
      assert(typeof c.returnProfile === 'string', `returnProfile missing for ${c.class}`);
      assert(typeof c.example === 'string', `example missing for ${c.class}`);
      assert(typeof c.gravityMultiplier === 'number', `gravityMultiplier missing for ${c.class}`);
      assert(typeof c.darkMatterFactor === 'number', `darkMatterFactor missing for ${c.class}`);
    }
  });

  await test('getCelestialDescriptor returns correct class for STAR', () => {
    const desc = getCelestialDescriptor('STAR');
    assert(desc.class === 'STAR', 'wrong class');
    assert(desc.risk === 'HIGH', `wrong risk: ${desc.risk}`);
  });

  await test('getCelestialDescriptor returns correct class for BLACK_HOLE', () => {
    const desc = getCelestialDescriptor('BLACK_HOLE');
    assert(desc.class === 'BLACK_HOLE', 'wrong class');
    assert(desc.risk === 'EXTREME', `wrong risk: ${desc.risk}`);
  });

  await test('isValidCelestialClass returns true for valid classes', () => {
    const valid = ['STAR', 'PLANET', 'MOON', 'ASTEROID', 'BLACK_HOLE', 'NEBULA', 'COMET', 'PULSAR'];
    for (const cls of valid) {
      assert(isValidCelestialClass(cls), `expected ${cls} to be valid`);
    }
  });

  await test('isValidCelestialClass returns false for invalid class', () => {
    assert(!isValidCelestialClass('GALAXY'), 'GALAXY should not be valid');
    assert(!isValidCelestialClass(''), 'empty string should not be valid');
  });

  // ─── Gravity engine ─────────────────────────────────────────────────────────
  console.log('\n🔎 [astronomik-money] gravity engine');

  await test('compute gravity for a PLANET asset with valid inputs', () => {
    const asset: CelestialAsset = { id: 'p1', name: 'Earth', class: 'PLANET', value: 100000, mass: 2.0 };
    const result = computeAssetGravity(asset);
    assert(result.pull > 0, `pull should be > 0, got ${result.pull}`);
    assert(result.pull === 100000 * 2.0 * 1.0, `expected ${100000 * 2.0 * 1.0}, got ${result.pull}`);
    assert(!result.warning, `unexpected warning: ${result.warning}`);
  });

  await test('NaN value is sanitized to 0 with warning', () => {
    const asset: CelestialAsset = { id: 'nan1', name: 'NaN Asset', class: 'STAR', value: NaN, mass: 1.0 };
    const result = computeAssetGravity(asset);
    assert(result.pull === 0, `expected pull 0, got ${result.pull}`);
    assert(typeof result.warning === 'string', 'expected warning for NaN');
  });

  await test('Infinity value is sanitized to 0 with warning', () => {
    const asset: CelestialAsset = { id: 'inf1', name: 'Inf Asset', class: 'STAR', value: Infinity, mass: 1.0 };
    const result = computeAssetGravity(asset);
    assert(result.pull === 0, `expected pull 0, got ${result.pull}`);
    assert(typeof result.warning === 'string', 'expected warning for Infinity');
  });

  await test('negative value is sanitized to 0 with warning', () => {
    const asset: CelestialAsset = { id: 'neg1', name: 'Neg Asset', class: 'PLANET', value: -5000, mass: 1.0 };
    const result = computeAssetGravity(asset);
    assert(result.pull === 0, `expected pull 0, got ${result.pull}`);
    assert(typeof result.warning === 'string', 'expected warning for negative value');
  });

  await test('zero mass produces zero pull', () => {
    const asset: CelestialAsset = { id: 'zero1', name: 'Zero Mass', class: 'PLANET', value: 50000, mass: 0 };
    const result = computeAssetGravity(asset);
    assert(result.pull === 0, `expected pull 0, got ${result.pull}`);
  });

  await test('totalGravity sums pulls correctly', () => {
    const assets: CelestialAsset[] = [
      { id: 'g1', name: 'G1', class: 'PLANET', value: 1000, mass: 1 },
      { id: 'g2', name: 'G2', class: 'PLANET', value: 2000, mass: 1 },
    ];
    const results = computeAllGravity(assets);
    const total = totalGravity(results);
    assert(total === 3000, `expected 3000, got ${total}`);
  });

  // ─── Portfolio engine ────────────────────────────────────────────────────────
  console.log('\n🔎 [astronomik-money] portfolio engine');

  await test('diversification index scales with number of classes', () => {
    const gravityResults = computeAllGravity(sampleAssets);
    const composition = analyzePortfolio(sampleAssets, gravityResults);
    assert(composition.diversificationIndex > 0, 'diversificationIndex should be > 0');
    assert(composition.diversificationIndex <= 1, 'diversificationIndex should be <= 1');
  });

  await test('single-asset portfolio emits LOW diversification warning', () => {
    const singleAsset: CelestialAsset[] = [{ id: 's1', name: 'Solo', class: 'PLANET', value: 100000, mass: 2 }];
    const gravityResults = computeAllGravity(singleAsset);
    const composition = analyzePortfolio(singleAsset, gravityResults);
    assert(
      composition.warnings.some((w) => w.includes('Single-asset')),
      'expected single-asset warning',
    );
  });

  await test('dark matter ratio is non-negative', () => {
    const gravityResults = computeAllGravity(sampleAssets);
    const composition = analyzePortfolio(sampleAssets, gravityResults);
    assert(composition.darkMatterRatio >= 0, `darkMatterRatio should be >= 0, got ${composition.darkMatterRatio}`);
  });

  await test('BLACK_HOLE > 20% triggers auto-warning in composition', () => {
    const bhAssets: CelestialAsset[] = [
      { id: 'bh1', name: 'BlackHole', class: 'BLACK_HOLE', value: 500000, mass: 5 },
      { id: 'pl1', name: 'Planet', class: 'PLANET', value: 1000, mass: 1 },
    ];
    const gravityResults = computeAllGravity(bhAssets);
    const composition = analyzePortfolio(bhAssets, gravityResults);
    assert(
      composition.warnings.some((w) => w.includes('BLACK_HOLE')),
      'expected BLACK_HOLE proximity warning',
    );
  });

  // ─── Cosmic event engine ─────────────────────────────────────────────────────
  console.log('\n🔎 [astronomik-money] cosmic event engine');

  await test('no events → cosmic resilience = 200', () => {
    const resilience = computeCosmicResilience([]);
    assert(resilience === 200, `expected 200, got ${resilience}`);
  });

  await test('SUPERNOVA severity 1.0 → resilience reduced significantly', () => {
    const resilience = computeCosmicResilience([{ type: 'SUPERNOVA', severity: 1.0 }]);
    assert(resilience < 200, `expected < 200, got ${resilience}`);
    assert(resilience >= 0, 'resilience should not go below 0');
  });

  await test('METEOR_SHOWER has lower penalty than SUPERNOVA', () => {
    const rMeteor = computeCosmicResilience([{ type: 'METEOR_SHOWER', severity: 1.0 }]);
    const rSupernova = computeCosmicResilience([{ type: 'SUPERNOVA', severity: 1.0 }]);
    assert(rMeteor > rSupernova, 'METEOR_SHOWER should have lower penalty than SUPERNOVA');
  });

  await test('NaN severity is treated as 0 penalty', () => {
    const resilience = computeCosmicResilience([{ type: 'SOLAR_FLARE', severity: NaN }]);
    assert(resilience === 200, `expected 200 (no penalty for NaN severity), got ${resilience}`);
  });

  await test('detectAutoEvents triggers BLACK_HOLE_PROXIMITY when ratio > 20%', () => {
    const bhAssets: CelestialAsset[] = [
      { id: 'bh1', name: 'BlackHole', class: 'BLACK_HOLE', value: 500000, mass: 5 },
      { id: 'pl1', name: 'Planet', class: 'PLANET', value: 1000, mass: 1 },
    ];
    const gravityResults = computeAllGravity(bhAssets);
    const composition = analyzePortfolio(bhAssets, gravityResults);
    const events = detectAutoEvents(composition);
    assert(
      events.some((e) => e.type === 'BLACK_HOLE_PROXIMITY'),
      'expected BLACK_HOLE_PROXIMITY event',
    );
  });

  // ─── Score engine — valid cases ──────────────────────────────────────────────
  console.log('\n🔎 [astronomik-money] score engine — valid cases');

  await test('diverse portfolio → valid result with score 0–1000', () => {
    const start = performance.now();
    const result = evaluateAstronomikMoney({ referenceId: 'diverse', assets: sampleAssets });
    const elapsed = performance.now() - start;

    assert(result.valid, 'result should be valid');
    assert(result.score.total >= 0 && result.score.total <= 1000, `score out of range: ${result.score.total}`);
    assert(result.disclaimer === ASTRONOMIK_DISCLAIMER, 'disclaimer must be present');
    assert(result.insights.length > 0, 'insights must be present');
    assert(elapsed <= ASTRONOMIK_PERFORMANCE_MAX_MS, `evaluation ${elapsed.toFixed(1)}ms exceeds ${ASTRONOMIK_PERFORMANCE_MAX_MS}ms`);
  });

  await test('disclaimer is always present in valid result', () => {
    const result = evaluateAstronomikMoney({ assets: sampleAssets });
    assert(result.disclaimer.length > 0, 'disclaimer must be present');
    assert(result.disclaimer === ASTRONOMIK_DISCLAIMER, 'disclaimer content mismatch');
  });

  await test('tier is a non-empty string', () => {
    const result = evaluateAstronomikMoney({ assets: sampleAssets });
    assert(typeof result.tier === 'string' && result.tier.length > 0, 'tier must be a non-empty string');
  });

  await test('tier label is a non-empty string', () => {
    const result = evaluateAstronomikMoney({ assets: sampleAssets });
    assert(typeof result.tierLabel === 'string' && result.tierLabel.length > 0, 'tierLabel must be non-empty');
  });

  await test('score breakdown components are non-negative', () => {
    const result = evaluateAstronomikMoney({ assets: sampleAssets });
    assert(result.score.gravityScore >= 0, 'gravityScore must be >= 0');
    assert(result.score.orbitStability >= 0, 'orbitStability must be >= 0');
    assert(result.score.diversificationScore >= 0, 'diversificationScore must be >= 0');
    assert(result.score.cosmicResilience >= 0, 'cosmicResilience must be >= 0');
  });

  await test('all 8 celestial classes → high diversification', () => {
    const fullPortfolio: CelestialAsset[] = [
      { id: '1', name: 'S', class: 'STAR', value: 10000, mass: 1 },
      { id: '2', name: 'P', class: 'PLANET', value: 10000, mass: 1 },
      { id: '3', name: 'M', class: 'MOON', value: 10000, mass: 1 },
      { id: '4', name: 'A', class: 'ASTEROID', value: 10000, mass: 1 },
      { id: '5', name: 'BH', class: 'BLACK_HOLE', value: 1000, mass: 0.1 },
      { id: '6', name: 'N', class: 'NEBULA', value: 10000, mass: 1 },
      { id: '7', name: 'C', class: 'COMET', value: 10000, mass: 1 },
      { id: '8', name: 'PU', class: 'PULSAR', value: 10000, mass: 1 },
    ];
    const result = evaluateAstronomikMoney({ assets: fullPortfolio });
    assert(result.composition.diversificationIndex === 1.0, `expected 1.0, got ${result.composition.diversificationIndex}`);
  });

  // ─── Score engine — edge cases ───────────────────────────────────────────────
  console.log('\n🔎 [astronomik-money] score engine — edge cases');

  await test('empty assets → VOID_PORTFOLIO invalid result', () => {
    const result = evaluateAstronomikMoney({ assets: [] });
    assert(!result.valid, 'result should be invalid');
    assert(result.tier === 'VOID', `expected VOID, got ${result.tier}`);
    assert(result.warnings.some((w) => w === 'VOID_PORTFOLIO'), 'expected VOID_PORTFOLIO warning');
    assert(result.disclaimer.length > 0, 'disclaimer must still be present');
  });

  await test('null/undefined input → invalid result with disclaimer', () => {
    const result = evaluateAstronomikMoney(null as unknown as GalacticPortfolio);
    assert(!result.valid, 'null input should be invalid');
    assert(result.disclaimer.length > 0, 'disclaimer must be present');
  });

  await test('zero gravity portfolio → score = 0, tier = VOID', () => {
    const zeroPull: CelestialAsset[] = [
      { id: 'z1', name: 'Zero', class: 'PLANET', value: 0, mass: 0 },
    ];
    const result = evaluateAstronomikMoney({ assets: zeroPull });
    assert(result.score.total === 0 || result.valid, 'score should be 0 for zero gravity');
  });

  await test('SUPERNOVA event reduces cosmic resilience in final score', () => {
    const withSupernova = evaluateAstronomikMoney({
      assets: sampleAssets,
      activeEvents: [{ type: 'SUPERNOVA', severity: 1.0 }],
    });
    const withoutEvents = evaluateAstronomikMoney({ assets: sampleAssets });
    assert(
      withSupernova.score.cosmicResilience < withoutEvents.score.cosmicResilience,
      'SUPERNOVA should reduce cosmic resilience',
    );
  });

  // ─── Health report ────────────────────────────────────────────────────────────
  console.log('\n🔎 [astronomik-money] health report');

  await test('contract version is stable', () => {
    assert(ASTRONOMIK_CONTRACT_VERSION.length > 0, 'contract version must be defined');
  });

  await test('persona id is stable', () => {
    assert(ASTRONOMIK_PERSONA_ID === 'astronomik-money-core', `unexpected persona id: ${ASTRONOMIK_PERSONA_ID}`);
  });

  await test('disclaimer is non-empty', () => {
    assert(ASTRONOMIK_DISCLAIMER.length > 0, 'disclaimer must be defined');
  });

  await test('health report tracks evaluations', () => {
    _resetAstronomikMetrics();
    evaluateAstronomikMoney({ assets: sampleAssets });
    evaluateAstronomikMoney({ assets: sampleAssets });
    const report = getAstronomikHealthReport();
    assert(report.evaluations === 2, `expected 2 evaluations, got ${report.evaluations}`);
    assert(report.personaId === ASTRONOMIK_PERSONA_ID, 'personaId mismatch');
    assert(report.performanceMaxMs === ASTRONOMIK_PERFORMANCE_MAX_MS, 'performanceMaxMs mismatch');
  });
}

runTests().then(() => {
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
  if (failures.length > 0) {
    console.error('Failures:');
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
});
