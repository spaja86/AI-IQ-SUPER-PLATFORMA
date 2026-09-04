// DEPON-13–18 App Marketplace Tests
// AI IQ SUPER PLATFORMA — 180M App Marketplace — DeponValue Engine
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/depon/depon-app-marketplace.test.ts

import {
  DEPON_MODULES,
  getDepon,
  getDeponSummary,
  getDeponsByTag,
  type DeponId,
} from '../../depon/depon-registry';

import {
  computeDeponValue,
  normalizeDeponValue,
  resolveAppShard,
  buildAppEntry,
  applyBreachPenalty,
  applyDeposit,
  buildValueUpdateEvent,
  APP_REGISTRY_CONFIG,
  DEPON_VALUE_WEIGHTS,
  type DeponValueFactors,
  type AppEntry,
} from '../../depon/depon-13-app-value-registry';

import {
  computeRanks,
  applyDeltaRanks,
  buildLeaderboard,
  getTopN,
  buildRankingSnapshot,
  detectSignificantRankChanges,
  buildElasticsearchQuery,
  RANKING_CONFIG,
} from '../../depon/depon-14-value-ranking-engine';

import {
  buildMarketplaceListItem,
  buildMarketplacePage,
  buildComplianceBadges,
  applyFilter,
  sortEntries,
  getFeaturedApps,
  buildSpajaProRecommendations,
  buildDeponValueGauge,
  MARKETPLACE_CONFIG,
} from '../../depon/depon-15-app-marketplace-portal';

import {
  buildPipelineRun,
  advancePipelineStage,
  buildSecurityScanResult,
  buildDeployKafkaEvent,
  getPipelineDurationMs,
  isRuntimeSupported,
  isTargetSupported,
  PIPELINE_CONFIG,
} from '../../depon/depon-16-app-deployment-pipeline';

import {
  resolveMonetizationTier,
  computeRevenueSplit,
  buildRoyaltyRecord,
  buildDeponFundAllocation,
  buildBillingStatement,
  getAllTierBenefits,
  getTierBenefits,
  MONETIZATION_CONFIG,
} from '../../depon/depon-17-value-monetization';

import {
  aggregateByCategory,
  aggregateByState,
  pearsonCorrelation,
  computeCorrelations,
  buildCohortAnalysis,
  buildPlatformHealthMetrics,
  buildValueForecast,
  buildValueHistoryPoint,
  CROSS_ANALYTICS_CONFIG,
} from '../../depon/depon-18-cross-app-analytics';

// ─── Test Runner ──────────────────────────────────────────────────────────────

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

function assertClose(actual: number, expected: number, tolerance = 0.01, label?: string): void {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(
      `${label ?? 'assertClose'}: expected ~${expected} ± ${tolerance}, got ${actual}`,
    );
  }
}

// ─── Helper: build a sample app ──────────────────────────────────────────────

function makeApp(overrides: Partial<DeponValueFactors> = {}): AppEntry {
  return buildAppEntry({
    name: 'Test App',
    description: 'A test application',
    ownerUserId: 'user_001',
    ownerState: 'CA',
    category: 'fintech',
    monetizationModel: 'subscription',
    linkedDepons: ['DEPON-01', 'DEPON-04'] as DeponId[],
    certifications: ['HIPAA', 'PCI-DSS'],
    valueFactors: {
      financialDeposit: 10_000,
      monthlyActiveUsers: 50_000,
      transactionVolumeUsd: 1_000_000,
      uptimeRatio: 0.999,
      spajaProVersion: 10,
      statesCovered: 5,
      certifications: ['HIPAA', 'PCI-DSS'],
      daysSinceLastDeploy: 0,
      linkedDeponCount: 2,
      ...overrides,
    },
  });
}

// ─── Registry: new modules ────────────────────────────────────────────────────

async function runRegistryExtensionTests(): Promise<void> {
  console.log('\n🏛️  Registry Extension Tests (DEPON-13–18)\n');

  await test('DEPON_MODULES should now have 18 entries', () => {
    assertEqual(DEPON_MODULES.length, 18, 'total module count');
  });

  await test('getDeponSummary total should equal 18', () => {
    const s = getDeponSummary();
    assertEqual(s.total, 18, 'summary.total');
  });

  await test('all 18 modules have unique ports', () => {
    const ports = new Set(DEPON_MODULES.map((m) => m.port));
    assertEqual(ports.size, 18, 'unique ports');
  });

  await test('DEPON-13 exists in registry', () => {
    const d = getDepon('DEPON-13');
    assert(d !== undefined, 'DEPON-13 should exist');
    assertEqual(d!.name, 'App Value Registry', 'DEPON-13 name');
  });

  await test('DEPON-14 exists in registry', () => {
    const d = getDepon('DEPON-14');
    assert(d !== undefined, 'DEPON-14 should exist');
    assertEqual(d!.name, 'Value Ranking Engine', 'DEPON-14 name');
  });

  await test('DEPON-15 has marketplace tag', () => {
    const tagged = getDeponsByTag('marketplace');
    assert(tagged.length >= 1, 'at least 1 marketplace-tagged module');
  });

  await test('DEPON-16 has ci-cd tag', () => {
    const tagged = getDeponsByTag('ci-cd');
    assert(tagged.length >= 1, 'at least 1 ci-cd-tagged module');
  });

  await test('DEPON-17 has monetization tag', () => {
    const tagged = getDeponsByTag('monetization');
    assert(tagged.length >= 1, 'at least 1 monetization-tagged module');
  });

  await test('DEPON-18 exists with correct port 3018', () => {
    const d = getDepon('DEPON-18');
    assert(d !== undefined, 'DEPON-18 should exist');
    assertEqual(d!.port, 3018, 'port');
  });
}

// ─── DEPON-13: App Value Registry ────────────────────────────────────────────

async function runAppValueRegistryTests(): Promise<void> {
  console.log('\n🗂️  DEPON-13 App Value Registry Tests\n');

  await test('computeDeponValue returns non-negative number', () => {
    const factors: DeponValueFactors = {
      financialDeposit: 1000,
      monthlyActiveUsers: 10_000,
      transactionVolumeUsd: 500_000,
      uptimeRatio: 0.999,
      spajaProVersion: 10,
      statesCovered: 5,
      certifications: ['SOC2'],
      daysSinceLastDeploy: 0,
      linkedDeponCount: 3,
    };
    const score = computeDeponValue(factors);
    assert(score >= 0, 'score >= 0');
    assert(score <= 300, 'score within realistic upper bound');
  });

  await test('computeDeponValue increases with higher financial deposit', () => {
    const base: DeponValueFactors = {
      financialDeposit: 0,
      monthlyActiveUsers: 0,
      transactionVolumeUsd: 0,
      uptimeRatio: 1.0,
      spajaProVersion: 6,
      statesCovered: 1,
      certifications: [],
      daysSinceLastDeploy: 0,
      linkedDeponCount: 0,
    };
    const low  = computeDeponValue({ ...base, financialDeposit: 0 });
    const high = computeDeponValue({ ...base, financialDeposit: 100_000 });
    assert(high > low, 'higher deposit → higher score');
  });

  await test('computeDeponValue applies compliance multiplier', () => {
    const base: DeponValueFactors = {
      financialDeposit: 5000,
      monthlyActiveUsers: 20_000,
      transactionVolumeUsd: 200_000,
      uptimeRatio: 0.99,
      spajaProVersion: 8,
      statesCovered: 3,
      certifications: [],
      daysSinceLastDeploy: 0,
      linkedDeponCount: 2,
    };
    const noCert = computeDeponValue(base);
    const withCert = computeDeponValue({ ...base, certifications: ['HIPAA', 'GDPR', 'SOC2'] });
    assert(withCert > noCert, 'compliance certs boost score');
  });

  await test('computeDeponValue applies inactivity decay', () => {
    const base: DeponValueFactors = {
      financialDeposit: 10_000,
      monthlyActiveUsers: 50_000,
      transactionVolumeUsd: 1_000_000,
      uptimeRatio: 0.999,
      spajaProVersion: 10,
      statesCovered: 5,
      certifications: ['SOC2'],
      daysSinceLastDeploy: 0,
      linkedDeponCount: 3,
    };
    const active  = computeDeponValue({ ...base, daysSinceLastDeploy: 0 });
    const dormant = computeDeponValue({ ...base, daysSinceLastDeploy: 90 });
    assert(dormant < active, 'dormant app has lower score');
  });

  await test('normalizeDeponValue returns value between 0 and 100', () => {
    for (const raw of [0, 10, 50, 100, 200, 500]) {
      const n = normalizeDeponValue(raw);
      assert(n >= 0 && n <= 100, `normalized ${raw} → ${n} out of range`);
    }
  });

  await test('normalizeDeponValue(0) === 0', () => {
    assertEqual(normalizeDeponValue(0), 0, 'zero raw');
  });

  await test('resolveAppShard returns valid shard', () => {
    const shards = ['premium', 'standard', 'longtail'] as const;
    for (const v of [0, 50, 100, 150, 200]) {
      const shard = resolveAppShard(v);
      assert(shards.includes(shard), `shard for value ${v} is valid`);
    }
  });

  await test('buildAppEntry creates valid app with computed deponValue', () => {
    const app = makeApp();
    assert(app.appId.startsWith('app_'), 'appId prefix');
    assert(app.deponValue > 0, 'deponValue > 0');
    assert(app.deponValueNormalized >= 0 && app.deponValueNormalized <= 100, 'normalized in range');
    assertEqual(app.category, 'fintech', 'category');
    assertEqual(app.ownerState, 'CA', 'ownerState');
    assertEqual(app.status, 'active', 'status');
  });

  await test('applyBreachPenalty reduces deponValue by 25%', () => {
    const app = makeApp();
    const penalized = applyBreachPenalty(app);
    assertClose(
      penalized.deponValue,
      app.deponValue * (1 - APP_REGISTRY_CONFIG.breachPenaltyRate),
      0.001,
      'breach penalty',
    );
  });

  await test('applyDeposit increases deponValue and returns event', () => {
    const app = makeApp();
    const { updatedEntry, event } = applyDeposit(app, 50_000);
    assert(updatedEntry.deponValue >= app.deponValue, 'deposit increases value');
    assertEqual(event.appId, app.appId, 'event appId');
    assertEqual(event.amountUsd, 50_000, 'event amount');
    assert(event.previousDeponValue === app.deponValue, 'previous value recorded');
  });

  await test('buildValueUpdateEvent creates valid event', () => {
    const ev = buildValueUpdateEvent({
      appId: 'app_test_001',
      reason: 'deposit',
      previousValue: 50,
      newValue: 65,
    });
    assertEqual(ev.delta, 15, 'delta');
    assertEqual(ev.reason, 'deposit', 'reason');
    assert(ev.eventId.startsWith('vup_'), 'eventId prefix');
  });

  await test('DEPON_VALUE_WEIGHTS sum to 1.0', () => {
    const sum = Object.values(DEPON_VALUE_WEIGHTS).reduce((s, v) => s + v, 0);
    assertClose(sum, 1.0, 0.001, 'weights sum');
  });
}

// ─── DEPON-14: Value Ranking Engine ──────────────────────────────────────────

async function runValueRankingEngineTests(): Promise<void> {
  console.log('\n🏆 DEPON-14 Value Ranking Engine Tests\n');

  const apps = [
    makeApp({ financialDeposit: 100_000 }),
    makeApp({ financialDeposit: 5_000 }),
    makeApp({ financialDeposit: 50_000 }),
  ];
  // Give distinct names for traceability
  const namedApps = apps.map((a, i) => ({ ...a, name: `App-${i + 1}` }));

  await test('computeRanks assigns rank 1 to highest deponValue', () => {
    const ranked = computeRanks(namedApps);
    assertEqual(ranked.length, 3, 'ranked count');
    assert(ranked[0]!.rank === 1, 'rank 1 assigned');
    assert(ranked[0]!.deponValue >= ranked[1]!.deponValue, 'rank 1 has highest value');
  });

  await test('computeRanks produces sequential ranks', () => {
    const ranked = computeRanks(namedApps);
    for (let i = 0; i < ranked.length; i++) {
      assertEqual(ranked[i]!.rank, i + 1, `rank at index ${i}`);
    }
  });

  await test('applyDeltaRanks computes position movement', () => {
    const ranked = computeRanks(namedApps);
    // Swap first two positions to simulate change
    const oldRanks = [...ranked];
    const swapped = [{ ...oldRanks[1]!, rank: 1 }, { ...oldRanks[0]!, rank: 2 }, oldRanks[2]!];
    const withDelta = applyDeltaRanks(ranked, swapped);
    // App at new rank 1 was previously rank 2 → delta = +1
    const moved = withDelta.find((r) => r.appId === oldRanks[0]!.appId);
    assert(moved !== undefined, 'app found after delta');
    assertEqual(moved!.deltaRank, 1, 'positive delta when moved up');
  });

  await test('buildLeaderboard slices to topN', () => {
    const ranked = computeRanks(namedApps);
    const lb = buildLeaderboard(ranked, 2);
    assertEqual(lb.entries.length, 2, 'leaderboard capped at topN');
    assertEqual(lb.topN, 2, 'topN field');
  });

  await test('getTopN filters by ownerState', () => {
    const mixed = [
      { ...makeApp(), ownerState: 'CA', name: 'CA App 1' },
      { ...makeApp(), ownerState: 'TX', name: 'TX App' },
      { ...makeApp(), ownerState: 'CA', name: 'CA App 2' },
    ];
    const top = getTopN(mixed, { n: 10, ownerState: 'CA' });
    assert(top.every((r) => r.ownerState === 'CA'), 'only CA apps');
    assertEqual(top.length, 2, 'two CA apps');
  });

  await test('buildRankingSnapshot computes correct statistics', () => {
    const ranked = computeRanks(namedApps);
    const snap = buildRankingSnapshot(ranked);
    assertEqual(snap.totalApps, 3, 'totalApps');
    assert(snap.topEntry !== null, 'topEntry present');
    assert(snap.averageDeponValue > 0, 'average > 0');
    assert(snap.medianDeponValue > 0, 'median > 0');
  });

  await test('detectSignificantRankChanges returns events for large moves', () => {
    const ranked = computeRanks(namedApps);
    // Give first entry a large delta
    const bigMove = [{ ...ranked[0]!, deltaRank: 200 }, ...ranked.slice(1)];
    const events = detectSignificantRankChanges(bigMove, 100);
    assert(events.length >= 1, 'at least one significant change detected');
    assertEqual(events[0]!.topic, RANKING_CONFIG.kafkaTopics.rankingChanged, 'correct kafka topic');
  });

  await test('buildElasticsearchQuery returns correct structure', () => {
    const q = buildElasticsearchQuery({ from: 0, size: 50, filters: { ownerState: 'NY' } });
    assertEqual(q.index, RANKING_CONFIG.elasticsearchIndex, 'index');
    assertEqual(q.sort.field, 'deponValue', 'sort field');
    assertEqual(q.sort.order, 'desc', 'sort order');
    assertEqual(q.filters.ownerState, 'NY', 'filter state');
    assertEqual(q.size, 50, 'size');
  });
}

// ─── DEPON-15: App Marketplace Portal ────────────────────────────────────────

async function runMarketplacePortalTests(): Promise<void> {
  console.log('\n🛍️  DEPON-15 App Marketplace Portal Tests\n');

  const app = makeApp();

  await test('buildMarketplaceListItem creates correct item', () => {
    const item = buildMarketplaceListItem(app, 42);
    assertEqual(item.appId, app.appId, 'appId');
    assertEqual(item.rank, 42, 'rank');
    assertEqual(item.category, 'fintech', 'category');
    assert(item.certificationCount === 2, 'cert count');
  });

  await test('buildMarketplacePage sets totalPages correctly', () => {
    const item = buildMarketplaceListItem(app, 1);
    const page = buildMarketplacePage({
      items: [item],
      totalCount: 200,
      page: 1,
      pageSize: 50,
      filter: {},
      sortBy: 'deponValue',
    });
    assertEqual(page.totalPages, 4, 'totalPages = ceil(200/50)');
    assertEqual(page.totalCount, 200, 'totalCount');
  });

  await test('buildComplianceBadges returns one badge per cert', () => {
    const badges = buildComplianceBadges(['HIPAA', 'SOC2']);
    assertEqual(badges.length, 2, 'badge count');
    assert(badges[0]!.label.includes('HIPAA'), 'HIPAA badge label');
  });

  await test('applyFilter filters by category', () => {
    const apps = [
      { ...makeApp(), category: 'fintech' as const },
      { ...makeApp(), category: 'gaming' as const },
    ];
    const filtered = applyFilter(apps, { category: 'fintech' });
    assertEqual(filtered.length, 1, 'only fintech apps');
  });

  await test('applyFilter filters by search query', () => {
    const apps = [
      { ...makeApp(), name: 'Alpha Finance', description: 'desc' },
      { ...makeApp(), name: 'Beta Gaming',   description: 'desc' },
    ];
    const filtered = applyFilter(apps, { searchQuery: 'alpha' });
    assertEqual(filtered.length, 1, 'only matching app');
    assertEqual(filtered[0]!.name, 'Alpha Finance', 'correct app returned');
  });

  await test('sortEntries by deponValue descending', () => {
    const apps = [
      { ...makeApp({ financialDeposit: 1_000 }),  name: 'Low' },
      { ...makeApp({ financialDeposit: 100_000 }), name: 'High' },
    ];
    const sorted = sortEntries(apps, 'deponValue');
    assertEqual(sorted[0]!.name, 'High', 'highest value first');
  });

  await test('sortEntries by name alphabetically', () => {
    const apps = [
      { ...makeApp(), name: 'Zebra' },
      { ...makeApp(), name: 'Apple' },
    ];
    const sorted = sortEntries(apps, 'name');
    assertEqual(sorted[0]!.name, 'Apple', 'alphabetical first');
  });

  await test('getFeaturedApps returns up to featuredAppsCount entries', () => {
    const ranked = computeRanks(Array.from({ length: 20 }, () => makeApp()));
    const lb = buildLeaderboard(ranked, 20);
    const featured = getFeaturedApps(lb);
    assertEqual(featured.length, MARKETPLACE_CONFIG.featuredAppsCount, 'featured count');
  });

  await test('buildSpajaProRecommendations returns at most 3 recs', () => {
    const app = buildAppEntry({
      name: 'Bare App',
      description: 'Needs everything',
      ownerUserId: 'u_bare',
      ownerState: 'TX',
      category: 'other',
      monetizationModel: 'freemium',
      certifications: [],
      valueFactors: {
        financialDeposit: 0,
        monthlyActiveUsers: 100,
        transactionVolumeUsd: 0,
        uptimeRatio: 0.95,
        spajaProVersion: 6,
        statesCovered: 1,
        certifications: [],
        daysSinceLastDeploy: 5,
        linkedDeponCount: 0,
      },
    });
    const recs = buildSpajaProRecommendations(app);
    assert(recs.length <= MARKETPLACE_CONFIG.spajaProRecommendations, 'max 3 recs');
    assert(recs.length >= 1, 'at least 1 recommendation');
  });

  await test('buildDeponValueGauge tier classification', () => {
    const excellent = buildDeponValueGauge(150, 85);
    assertEqual(excellent.tier, 'excellent', 'score 85 → excellent');
    const low = buildDeponValueGauge(5, 15);
    assertEqual(low.tier, 'low', 'score 15 → low');
  });
}

// ─── DEPON-16: App Deployment Pipeline ───────────────────────────────────────

async function runDeploymentPipelineTests(): Promise<void> {
  console.log('\n🚀 DEPON-16 App Deployment Pipeline Tests\n');

  await test('buildPipelineRun creates run with 12 stages', () => {
    const run = buildPipelineRun({
      appId: 'app_test_123',
      ownerState: 'CA',
      trigger: 'git-push',
      runtime: 'node20',
      target: 'vercel',
    });
    assert(run.runId.startsWith('run_'), 'runId prefix');
    assertEqual(run.stages.length, 12, '12 pipeline stages');
    assert(run.stages.every((s) => s.status === 'pending'), 'all stages pending');
    assertEqual(run.status, 'queued', 'initial status queued');
  });

  await test('advancePipelineStage updates stage status', () => {
    const run = buildPipelineRun({
      appId: 'app_x',
      ownerState: 'NY',
      trigger: 'manual',
      runtime: 'python310',
      target: 'lambda',
    });
    const updated = advancePipelineStage(run, 'checkout', 'passed', 1200, 'Checkout OK');
    const stage = updated.stages.find((s) => s.stage === 'checkout');
    assertEqual(stage!.status, 'passed', 'checkout passed');
    assertEqual(stage!.durationMs, 1200, 'duration recorded');
  });

  await test('advancePipelineStage marks pipeline failed on stage failure', () => {
    let run = buildPipelineRun({
      appId: 'app_fail',
      ownerState: 'TX',
      trigger: 'manual',
      runtime: 'go121',
      target: 'kubernetes',
    });
    // Pass all stages except lint which fails
    for (const s of run.stages) {
      run = advancePipelineStage(run, s.stage, s.stage === 'lint' ? 'failed' : 'passed', 100, '');
    }
    assertEqual(run.status, 'failed', 'pipeline failed when lint fails');
  });

  await test('buildSecurityScanResult passes when no critical issues', () => {
    const result = buildSecurityScanResult({ criticalVulnerabilities: 0, highVulnerabilities: 2 });
    assert(result.passed, 'should pass');
    assert(result.summary.startsWith('✅'), 'pass indicator');
  });

  await test('buildSecurityScanResult fails on secrets found', () => {
    const result = buildSecurityScanResult({ secretsFound: 1 });
    assert(!result.passed, 'should fail with secrets');
    assert(result.summary.startsWith('❌'), 'fail indicator');
  });

  await test('buildDeployKafkaEvent emits correct topic', () => {
    const run = buildPipelineRun({
      appId: 'app_kafka',
      ownerState: 'FL',
      trigger: 'scheduled',
      runtime: 'node18',
      target: 'cloudrun',
    });
    const event = buildDeployKafkaEvent({ ...run, status: 'success' });
    assertEqual(event.topic, PIPELINE_CONFIG.kafkaTopic, 'kafka topic');
    assertEqual(event.status, 'success', 'event status');
  });

  await test('getPipelineDurationMs returns null if not started', () => {
    const run = buildPipelineRun({
      appId: 'app_dur',
      ownerState: 'WA',
      trigger: 'manual',
      runtime: 'rust',
      target: 'docker',
    });
    assertEqual(getPipelineDurationMs(run), null, 'duration null');
  });

  await test('isRuntimeSupported validates known runtimes', () => {
    assert(isRuntimeSupported('node20'), 'node20 supported');
    assert(!isRuntimeSupported('node99'), 'node99 not supported');
  });

  await test('isTargetSupported validates known targets', () => {
    assert(isTargetSupported('vercel'), 'vercel supported');
    assert(!isTargetSupported('heroku'), 'heroku not supported');
  });
}

// ─── DEPON-17: Value Monetization ────────────────────────────────────────────

async function runValueMonetizationTests(): Promise<void> {
  console.log('\n💰 DEPON-17 Value Monetization Tests\n');

  await test('resolveMonetizationTier ultra-premium at 99.95 percentile', () => {
    assertEqual(resolveMonetizationTier(99.95), 'ultra-premium', 'ultra-premium tier');
  });

  await test('resolveMonetizationTier premium at 99.5 percentile', () => {
    assertEqual(resolveMonetizationTier(99.5), 'premium', 'premium tier');
  });

  await test('resolveMonetizationTier standard at 95 percentile', () => {
    assertEqual(resolveMonetizationTier(95), 'standard', 'standard tier');
  });

  await test('resolveMonetizationTier free at 50 percentile', () => {
    assertEqual(resolveMonetizationTier(50), 'free', 'free tier');
  });

  await test('computeRevenueSplit free tier takes 20% platform fee', () => {
    const split = computeRevenueSplit(1000, 'free');
    assertEqual(split.platformFeePercent, 20, 'fee percent');
    assertClose(split.platformFeeUsd, 200, 0.01, 'fee amount');
    assertClose(split.netRevenueToAppUsd, 800, 0.01, 'net to app');
  });

  await test('computeRevenueSplit deponFund is 30% of platform fee', () => {
    const split = computeRevenueSplit(1000, 'premium');
    const expected = split.platformFeeUsd * (MONETIZATION_CONFIG.deponFundSharePercent / 100);
    assertClose(split.deponFundContributionUsd, expected, 0.01, 'depon fund share');
  });

  await test('buildRoyaltyRecord creates pending record', () => {
    const now = new Date();
    const end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const rec = buildRoyaltyRecord({
      appId: 'app_mon_001',
      grossRevenueUsd: 5000,
      tier: 'standard',
      periodStart: now,
      periodEnd: end,
    });
    assertEqual(rec.status, 'pending', 'status pending');
    assert(rec.royaltyId.startsWith('roy_'), 'royaltyId prefix');
    assert(rec.netPayoutUsd > 0, 'positive payout');
  });

  await test('buildDeponFundAllocation sums to totalCollected', () => {
    const now = new Date();
    const end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const alloc = buildDeponFundAllocation({ totalCollectedUsd: 10_000, periodStart: now, periodEnd: end });
    const sum = Object.values(alloc.allocations).reduce((s, v) => s + v, 0);
    assertClose(sum, 10_000, 10, 'allocations sum to total (rounding ok)');
  });

  await test('buildBillingStatement applies adjustments', () => {
    const now = new Date();
    const end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const stmt = buildBillingStatement({
      appId: 'app_billing_001',
      tier: 'premium',
      grossRevenueUsd: 2000,
      billingPeriodStart: now,
      billingPeriodEnd: end,
      adjustments: [{ type: 'uptime-credit', amountUsd: 50, reason: '99.99% uptime' }],
    });
    assert(stmt.netPayoutUsd > 0, 'net payout positive');
    assertEqual(stmt.adjustments.length, 1, 'adjustment recorded');
  });

  await test('getAllTierBenefits returns 4 tiers', () => {
    const tiers = getAllTierBenefits();
    assertEqual(tiers.length, 4, '4 monetization tiers');
  });

  await test('getTierBenefits ultra-premium has 99.99% SLA', () => {
    const benefits = getTierBenefits('ultra-premium');
    assertEqual(benefits.slaGuarantee, '99.99%', 'SLA guarantee');
  });
}

// ─── DEPON-18: Cross-App Analytics ───────────────────────────────────────────

async function runCrossAppAnalyticsTests(): Promise<void> {
  console.log('\n📊 DEPON-18 Cross-App Analytics Tests\n');

  const apps: AppEntry[] = [
    { ...makeApp(), category: 'fintech',    ownerState: 'CA', name: 'A' },
    { ...makeApp(), category: 'fintech',    ownerState: 'CA', name: 'B' },
    { ...makeApp(), category: 'gaming',     ownerState: 'TX', name: 'C' },
    { ...makeApp(), category: 'healthtech', ownerState: 'NY', name: 'D' },
    { ...makeApp(), category: 'gaming',     ownerState: 'TX', name: 'E' },
  ];

  await test('aggregateByCategory groups correctly', () => {
    const metrics = aggregateByCategory(apps);
    const fintech = metrics.find((m) => m.category === 'fintech');
    assert(fintech !== undefined, 'fintech group exists');
    assertEqual(fintech!.appCount, 2, 'fintech app count');
  });

  await test('aggregateByCategory sorted by averageDeponValue desc', () => {
    const metrics = aggregateByCategory(apps);
    for (let i = 0; i < metrics.length - 1; i++) {
      assert(
        metrics[i]!.averageDeponValue >= metrics[i + 1]!.averageDeponValue,
        'sorted descending',
      );
    }
  });

  await test('aggregateByState groups correctly', () => {
    const metrics = aggregateByState(apps);
    const ca = metrics.find((m) => m.stateCode === 'CA');
    assert(ca !== undefined, 'CA state exists');
    assertEqual(ca!.appCount, 2, 'CA app count');
  });

  await test('pearsonCorrelation returns 1.0 for identical series', () => {
    const xs = [1, 2, 3, 4, 5];
    const r = pearsonCorrelation(xs, xs);
    assertClose(r, 1.0, 0.001, 'identical series correlation');
  });

  await test('pearsonCorrelation returns -1.0 for perfectly inverse series', () => {
    const xs = [1, 2, 3, 4, 5];
    const ys = [5, 4, 3, 2, 1];
    const r = pearsonCorrelation(xs, ys);
    assertClose(r, -1.0, 0.001, 'inverse series correlation');
  });

  await test('pearsonCorrelation returns 0 for short series', () => {
    const r = pearsonCorrelation([1], [1]);
    assertEqual(r, 0, 'single-element series');
  });

  await test('computeCorrelations requires minimum sample size', () => {
    const few = apps.slice(0, 3);
    const corrs = computeCorrelations(few);
    assertEqual(corrs.length, 0, 'not enough samples');
  });

  await test('computeCorrelations returns results above minimum sample', () => {
    const many = Array.from({ length: 15 }, () => makeApp());
    const corrs = computeCorrelations(many);
    assert(corrs.length > 0, 'correlations computed');
    assert(corrs.every((c) => c.sampleSize === 15), 'sample size recorded');
  });

  await test('buildCohortAnalysis returns 3 shard cohorts', () => {
    const cohorts = buildCohortAnalysis(apps);
    assertEqual(cohorts.length, 3, '3 shard cohorts');
    const shards = cohorts.map((c) => c.cohortLabel);
    assert(shards.some((l) => l.includes('premium')), 'premium cohort');
    assert(shards.some((l) => l.includes('longtail')), 'longtail cohort');
  });

  await test('buildPlatformHealthMetrics computes statistics', () => {
    const health = buildPlatformHealthMetrics(apps, 50_000);
    assertEqual(health.totalApps, 5, 'total apps');
    assert(health.activeApps <= 5, 'activeApps <= total');
    assertEqual(health.totalDeponFundUsd, 50_000, 'depon fund');
    assert(health.averageDeponValue > 0, 'average > 0');
  });

  await test('buildValueForecast returns growing trend for positive growth rate', () => {
    const forecast = buildValueForecast({
      appId: 'app_forecast_001',
      currentDeponValue: 80,
      weeklyGrowthRate: 0.02,
    });
    assertEqual(forecast.trend, 'growing', 'growing trend');
    assert(forecast.forecastedDeponValue > 80, 'forecasted > current');
    assert(
      forecast.confidenceInterval.low < forecast.forecastedDeponValue,
      'CI low < forecasted',
    );
    assert(
      forecast.confidenceInterval.high > forecast.forecastedDeponValue,
      'CI high > forecasted',
    );
  });

  await test('buildValueForecast returns declining trend for negative growth', () => {
    const forecast = buildValueForecast({
      appId: 'app_forecast_002',
      currentDeponValue: 60,
      weeklyGrowthRate: -0.02,
    });
    assertEqual(forecast.trend, 'declining', 'declining trend');
    assert(forecast.forecastedDeponValue < 60, 'forecasted < current');
  });

  await test('buildValueHistoryPoint creates timestamped point', () => {
    const point = buildValueHistoryPoint({
      deponValue: 75,
      deponValueNormalized: 60,
      reason: 'scheduled-refresh',
    });
    assert(point.timestamp instanceof Date, 'timestamp is Date');
    assertEqual(point.deponValue, 75, 'value');
    assertEqual(point.reason, 'scheduled-refresh', 'reason');
  });

  await test('CROSS_ANALYTICS_CONFIG has correct kafka topics', () => {
    assertEqual(CROSS_ANALYTICS_CONFIG.kafkaTopicsConsumed.length, 4, 'consumed topics count');
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  🏗️  AI IQ SUPER PLATFORMA — 180M App Marketplace Tests');
  console.log('  DEPON-13 through DEPON-18 — Kompanija SPAJA');
  console.log('═══════════════════════════════════════════════════════════════');

  await runRegistryExtensionTests();
  await runAppValueRegistryTests();
  await runValueRankingEngineTests();
  await runMarketplacePortalTests();
  await runDeploymentPipelineTests();
  await runValueMonetizationTests();
  await runCrossAppAnalyticsTests();

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log(`  Results: ${passed} passed, ${failed} failed`);
  if (failures.length > 0) {
    console.error('\n  Failures:');
    for (const f of failures) console.error(`    • ${f}`);
  }
  console.log('═══════════════════════════════════════════════════════════════\n');

  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
