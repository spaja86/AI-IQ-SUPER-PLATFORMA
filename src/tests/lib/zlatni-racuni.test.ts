// SpajaUltraOmegaCore -∞Ω+∞ — ZLATNI RAČUNI Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  upsertRacun,
  getRacunByUserId,
  getRacunById,
  evaluateTierResult,
  applyPoints,
  getTransactions,
  getActivePerksForTier,
  isPerkEligible,
  validateTierCatalog,
  getTierForPoints,
  updateRacun,
  _resetRegistry,
  _resetTransactionLedger,
  _resetCounter,
  ZLATNI_CONTRACT_VERSION,
  ZLATNI_PERSONA_ID,
  ZLATNI_PERFORMANCE_LOOKUP_MAX_MS,
  ZLATNI_PERFORMANCE_TIER_MAX_MS,
  ZLATNI_TIER_CATALOG,
} from '../../lib/zlatni-racuni';

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

function resetAll(): void {
  _resetRegistry();
  _resetTransactionLedger();
  _resetCounter();
}

async function runTests(): Promise<void> {
  resetAll();

  // ─── Constants ──────────────────────────────────────────────────────────────

  console.log('\n🔎 [zlatni-racuni] constants');

  await test('contract version is non-empty', () => {
    assert(ZLATNI_CONTRACT_VERSION.length > 0, 'contract version must be defined');
  });

  await test('persona id is stable', () => {
    assert(ZLATNI_PERSONA_ID === 'zlatni-racuni-core', `unexpected persona id: ${ZLATNI_PERSONA_ID}`);
  });

  await test('performance lookup max is 10ms', () => {
    assert(ZLATNI_PERFORMANCE_LOOKUP_MAX_MS === 10, `expected 10, got ${ZLATNI_PERFORMANCE_LOOKUP_MAX_MS}`);
  });

  await test('performance tier max is 50ms', () => {
    assert(ZLATNI_PERFORMANCE_TIER_MAX_MS === 50, `expected 50, got ${ZLATNI_PERFORMANCE_TIER_MAX_MS}`);
  });

  // ─── Tier catalog ────────────────────────────────────────────────────────────

  console.log('\n🔎 [zlatni-racuni] tier catalog');

  await test('tier catalog has 4 tiers', () => {
    assert(ZLATNI_TIER_CATALOG.length === 4, `expected 4 tiers, got ${ZLATNI_TIER_CATALOG.length}`);
  });

  await test('tier catalog is valid (non-overlapping ranges)', () => {
    assert(validateTierCatalog(), 'tier catalog ranges are overlapping or non-exhaustive');
  });

  await test('BRONZE starts at 0', () => {
    const bronze = ZLATNI_TIER_CATALOG.find((t) => t.name === 'BRONZE');
    assert(bronze?.minPoints === 0, 'BRONZE must start at 0');
  });

  await test('PLATINUM has highest priority', () => {
    const platinum = ZLATNI_TIER_CATALOG.find((t) => t.name === 'PLATINUM');
    assert(platinum?.priorityLevel === 4, 'PLATINUM must have priority 4');
  });

  // ─── Tier engine ─────────────────────────────────────────────────────────────

  console.log('\n🔎 [zlatni-racuni] tier engine');

  await test('0 points → BRONZE', () => {
    const tier = getTierForPoints(0);
    assert(tier.name === 'BRONZE', `expected BRONZE, got ${tier.name}`);
  });

  await test('999 points → BRONZE', () => {
    const tier = getTierForPoints(999);
    assert(tier.name === 'BRONZE', `expected BRONZE, got ${tier.name}`);
  });

  await test('1000 points → SILVER', () => {
    const tier = getTierForPoints(1000);
    assert(tier.name === 'SILVER', `expected SILVER, got ${tier.name}`);
  });

  await test('5000 points → GOLD', () => {
    const tier = getTierForPoints(5000);
    assert(tier.name === 'GOLD', `expected GOLD, got ${tier.name}`);
  });

  await test('20000 points → PLATINUM', () => {
    const tier = getTierForPoints(20000);
    assert(tier.name === 'PLATINUM', `expected PLATINUM, got ${tier.name}`);
  });

  await test('NaN points → BRONZE', () => {
    const tier = getTierForPoints(NaN);
    assert(tier.name === 'BRONZE', `expected BRONZE for NaN, got ${tier.name}`);
  });

  await test('Infinity points → PLATINUM', () => {
    const tier = getTierForPoints(Infinity);
    assert(tier.name === 'PLATINUM', `expected PLATINUM for Infinity, got ${tier.name}`);
  });

  await test('negative points → BRONZE', () => {
    const tier = getTierForPoints(-100);
    assert(tier.name === 'BRONZE', `expected BRONZE for -100, got ${tier.name}`);
  });

  await test('evaluateTierResult provides next tier for BRONZE', () => {
    const result = evaluateTierResult(500);
    assert(result.current.name === 'BRONZE', `expected BRONZE, got ${result.current.name}`);
    assert(result.next?.name === 'SILVER', `expected next=SILVER, got ${result.next?.name}`);
    assert(result.pointsToNextTier === 500, `expected 500 pts to next, got ${result.pointsToNextTier}`);
    assert(result.progressPercent >= 0 && result.progressPercent <= 100, 'progress must be 0-100');
  });

  await test('evaluateTierResult for PLATINUM has no next tier', () => {
    const result = evaluateTierResult(25000);
    assert(result.current.name === 'PLATINUM', `expected PLATINUM`);
    assert(result.next === null, 'PLATINUM has no next tier');
    assert(result.pointsToNextTier === null, 'PLATINUM pointsToNextTier must be null');
    assert(result.progressPercent === 100, 'PLATINUM progress must be 100');
  });

  // ─── Registry ────────────────────────────────────────────────────────────────

  console.log('\n🔎 [zlatni-racuni] registry');

  resetAll();

  await test('upsertRacun creates account', () => {
    const racun = upsertRacun({ userId: 'u-001', idempotencyKey: 'ik-create-001' });
    assert(racun.userId === 'u-001', 'userId mismatch');
    assert(racun.tier === 'BRONZE', 'new account must start at BRONZE');
    assert(racun.balance === 0, 'new account must have 0 balance');
    assert(racun.status === 'active', 'new account must be active');
  });

  await test('upsertRacun returns existing account for same userId', () => {
    const a = upsertRacun({ userId: 'u-002', idempotencyKey: 'ik-a' });
    const b = upsertRacun({ userId: 'u-002', idempotencyKey: 'ik-b' });
    assert(a.id === b.id, 'same userId must return same account');
  });

  await test('upsertRacun is idempotent for same key', () => {
    const a = upsertRacun({ userId: 'u-003', idempotencyKey: 'ik-idem-001' });
    const b = upsertRacun({ userId: 'u-003', idempotencyKey: 'ik-idem-001' });
    assert(a.id === b.id, 'idempotency must return same account');
  });

  await test('getRacunByUserId returns account', () => {
    upsertRacun({ userId: 'u-004', idempotencyKey: 'ik-lookup-001' });
    const racun = getRacunByUserId('u-004');
    assert(racun?.userId === 'u-004', 'lookup by userId failed');
  });

  await test('getRacunById returns account', () => {
    const created = upsertRacun({ userId: 'u-005', idempotencyKey: 'ik-lookup-002' });
    const racun = getRacunById(created.id);
    assert(racun?.id === created.id, 'lookup by id failed');
  });

  await test('getRacunByUserId returns undefined for unknown userId', () => {
    const racun = getRacunByUserId('unknown-user');
    assert(racun === undefined, 'expected undefined for unknown userId');
  });

  // ─── Points engine ───────────────────────────────────────────────────────────

  console.log('\n🔎 [zlatni-racuni] points engine');

  resetAll();

  await test('credit adds balance and pointsAccrued', () => {
    upsertRacun({ userId: 'pu-001', idempotencyKey: 'ik-pu-create' });
    const racun = getRacunByUserId('pu-001')!;
    const result = applyPoints({
      racunId: racun.id,
      type: 'credit',
      amount: 100,
      source: 'gigatron',
      idempotencyKey: 'ik-credit-001',
    });
    assert(result.racun.balance === 100, `expected 100, got ${result.racun.balance}`);
    assert(result.racun.pointsAccrued === 100, `expected 100 accrued, got ${result.racun.pointsAccrued}`);
  });

  await test('debit reduces balance but not below 0', () => {
    upsertRacun({ userId: 'pu-002', idempotencyKey: 'ik-pu-002-create' });
    const racun = getRacunByUserId('pu-002')!;
    applyPoints({ racunId: racun.id, type: 'credit', amount: 50, source: 'manual', idempotencyKey: 'ik-pu-002-a' });
    const result = applyPoints({ racunId: racun.id, type: 'debit', amount: 200, source: 'manual', idempotencyKey: 'ik-pu-002-b' });
    assert(result.racun.balance === 0, `balance must floor at 0, got ${result.racun.balance}`);
  });

  await test('bonus applies earn rate multiplier', () => {
    upsertRacun({ userId: 'pu-003', idempotencyKey: 'ik-pu-003-create' });
    const racun = getRacunByUserId('pu-003')!;
    const result = applyPoints({
      racunId: racun.id,
      type: 'bonus',
      amount: 100,
      source: 'madagaskar',
      idempotencyKey: 'ik-pu-003-bonus',
    });
    assert(result.racun.balance === 200, `madagaskar earn rate 2.0 → expected 200, got ${result.racun.balance}`);
  });

  await test('points accrual triggers tier upgrade', () => {
    upsertRacun({ userId: 'pu-004', idempotencyKey: 'ik-pu-004-create' });
    const racun = getRacunByUserId('pu-004')!;
    applyPoints({ racunId: racun.id, type: 'credit', amount: 1500, source: 'gigatron', idempotencyKey: 'ik-pu-004-credit' });
    const updated = getRacunByUserId('pu-004')!;
    assert(updated.tier === 'SILVER', `expected SILVER after 1500 pts, got ${updated.tier}`);
  });

  await test('archived account throws on points apply', () => {
    upsertRacun({ userId: 'pu-005', idempotencyKey: 'ik-pu-005-create' });
    const racun = getRacunByUserId('pu-005')!;
    updateRacun({ ...racun, status: 'archived' });
    try {
      applyPoints({ racunId: racun.id, type: 'credit', amount: 100, source: 'manual', idempotencyKey: 'ik-pu-005-archived' });
      assert(false, 'expected error for archived account');
    } catch (e) {
      assert(e instanceof Error && e.message.includes('archived'), 'wrong error message');
    }
  });

  await test('NaN amount throws', () => {
    upsertRacun({ userId: 'pu-006', idempotencyKey: 'ik-pu-006-create' });
    const racun = getRacunByUserId('pu-006')!;
    try {
      applyPoints({ racunId: racun.id, type: 'credit', amount: NaN, source: 'manual', idempotencyKey: 'ik-pu-006-nan' });
      assert(false, 'expected error for NaN amount');
    } catch (e) {
      assert(e instanceof Error, 'expected Error');
    }
  });

  await test('negative amount throws', () => {
    upsertRacun({ userId: 'pu-007', idempotencyKey: 'ik-pu-007-create' });
    const racun = getRacunByUserId('pu-007')!;
    try {
      applyPoints({ racunId: racun.id, type: 'credit', amount: -50, source: 'manual', idempotencyKey: 'ik-pu-007-neg' });
      assert(false, 'expected error for negative amount');
    } catch (e) {
      assert(e instanceof Error, 'expected Error');
    }
  });

  // ─── Transaction engine ──────────────────────────────────────────────────────

  console.log('\n🔎 [zlatni-racuni] transaction engine');

  resetAll();

  await test('transactions are recorded', () => {
    upsertRacun({ userId: 'tx-001', idempotencyKey: 'ik-tx-001-create' });
    const racun = getRacunByUserId('tx-001')!;
    applyPoints({ racunId: racun.id, type: 'credit', amount: 100, source: 'gigatron', idempotencyKey: 'ik-tx-001-a' });
    applyPoints({ racunId: racun.id, type: 'debit', amount: 10, source: 'manual', idempotencyKey: 'ik-tx-001-b' });
    const result = getTransactions(racun.id, 1, 20);
    assert(result.total === 2, `expected 2 transactions, got ${result.total}`);
  });

  await test('transaction pagination works', () => {
    upsertRacun({ userId: 'tx-002', idempotencyKey: 'ik-tx-002-create' });
    const racun = getRacunByUserId('tx-002')!;
    for (let i = 0; i < 5; i++) {
      applyPoints({ racunId: racun.id, type: 'credit', amount: 10, source: 'manual', idempotencyKey: `ik-tx-002-${i}` });
    }
    const page1 = getTransactions(racun.id, 1, 3);
    const page2 = getTransactions(racun.id, 2, 3);
    assert(page1.items.length === 3, `expected 3 items on page 1, got ${page1.items.length}`);
    assert(page2.items.length === 2, `expected 2 items on page 2, got ${page2.items.length}`);
    assert(page1.total === 5, `total must be 5, got ${page1.total}`);
  });

  // ─── Perk engine ─────────────────────────────────────────────────────────────

  console.log('\n🔎 [zlatni-racuni] perk engine');

  await test('BRONZE has at least bronze-welcome perk', () => {
    const perks = getActivePerksForTier('BRONZE');
    assert(perks.some((p) => p.id === 'bronze-welcome'), 'BRONZE must have bronze-welcome perk');
  });

  await test('SILVER does not have platinum-vip perk', () => {
    const perks = getActivePerksForTier('SILVER');
    assert(!perks.some((p) => p.id === 'platinum-vip'), 'SILVER must not have platinum-vip perk');
  });

  await test('PLATINUM has all perks', () => {
    const perks = getActivePerksForTier('PLATINUM');
    assert(perks.length >= 4, `PLATINUM must have >=4 perks, got ${perks.length}`);
  });

  await test('isPerkEligible returns false for wrong tier', () => {
    assert(!isPerkEligible('platinum-vip', 'BRONZE'), 'BRONZE must not access platinum-vip');
  });

  await test('isPerkEligible returns true for eligible tier', () => {
    assert(isPerkEligible('bronze-welcome', 'GOLD'), 'GOLD must access bronze-welcome');
  });

  // ─── Performance ─────────────────────────────────────────────────────────────

  console.log('\n🔎 [zlatni-racuni] performance');

  resetAll();

  await test(`registry lookup ≤ ${ZLATNI_PERFORMANCE_LOOKUP_MAX_MS}ms`, () => {
    upsertRacun({ userId: 'perf-001', idempotencyKey: 'ik-perf-001' });
    const start = Date.now();
    getRacunByUserId('perf-001');
    const elapsed = Date.now() - start;
    assert(elapsed <= ZLATNI_PERFORMANCE_LOOKUP_MAX_MS, `lookup took ${elapsed}ms, expected ≤${ZLATNI_PERFORMANCE_LOOKUP_MAX_MS}ms`);
  });

  await test(`tier evaluation ≤ ${ZLATNI_PERFORMANCE_TIER_MAX_MS}ms`, () => {
    const start = Date.now();
    evaluateTierResult(4999);
    const elapsed = Date.now() - start;
    assert(elapsed <= ZLATNI_PERFORMANCE_TIER_MAX_MS, `tier eval took ${elapsed}ms, expected ≤${ZLATNI_PERFORMANCE_TIER_MAX_MS}ms`);
  });

  // ─── Summary ─────────────────────────────────────────────────────────────────

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

  if (failures.length > 0) {
    console.error('Failures:');
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
