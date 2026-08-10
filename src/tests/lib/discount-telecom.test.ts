// SpajaUltraOmegaCore -∞Ω+∞ — Discount Telecom Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  calculateDiscount,
  getDiscountTelecomHealthReport,
  listOperators,
  getOperatorById,
  listDiscounts,
  getDiscountsByOperator,
  DISCOUNT_TELECOM_CONTRACT_VERSION,
  DISCOUNT_TELECOM_MAX_DISCOUNT_CAP_PERCENT,
  DISCOUNT_TELECOM_PERFORMANCE_MAX_MS,
  DISCOUNT_TELECOM_PERSONA_ID,
} from '../../lib/discount-telecom';

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

function assertClose(actual: number, expected: number, tolerance = 1, label = ''): void {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(`${label}: expected ${expected} ± ${tolerance}, got ${actual}`);
  }
}

async function runTests(): Promise<void> {
  console.log('\n🔎 [discount-telecom] Constants');

  await test('DISCOUNT_TELECOM_CONTRACT_VERSION is defined', () => {
    assert(typeof DISCOUNT_TELECOM_CONTRACT_VERSION === 'string' && DISCOUNT_TELECOM_CONTRACT_VERSION.length > 0, 'Contract version must be a non-empty string');
  });

  await test('DISCOUNT_TELECOM_MAX_DISCOUNT_CAP_PERCENT is 60', () => {
    assert(DISCOUNT_TELECOM_MAX_DISCOUNT_CAP_PERCENT === 60, `Expected 60, got ${DISCOUNT_TELECOM_MAX_DISCOUNT_CAP_PERCENT}`);
  });

  await test('DISCOUNT_TELECOM_PERFORMANCE_MAX_MS is 50', () => {
    assert(DISCOUNT_TELECOM_PERFORMANCE_MAX_MS === 50, `Expected 50, got ${DISCOUNT_TELECOM_PERFORMANCE_MAX_MS}`);
  });

  await test('DISCOUNT_TELECOM_PERSONA_ID is discount-telecom-global', () => {
    assert(DISCOUNT_TELECOM_PERSONA_ID === 'discount-telecom-global', `Expected 'discount-telecom-global', got '${DISCOUNT_TELECOM_PERSONA_ID}'`);
  });

  // ─── Operator registry ──────────────────────────────────────────────────────

  console.log('\n🔎 [discount-telecom] Operator registry');

  await test('listOperators returns all active operators', () => {
    const ops = listOperators();
    assert(ops.length > 0, 'Should return at least one operator');
    assert(ops.every((o) => o.active), 'All returned operators should be active');
  });

  await test('listOperators filters by region EU', () => {
    const ops = listOperators('EU');
    assert(ops.length > 0, 'Should return EU operators');
    assert(ops.every((o) => o.region === 'EU'), 'All returned operators must be EU');
  });

  await test('listOperators filters by region APAC', () => {
    const ops = listOperators('APAC');
    assert(ops.every((o) => o.region === 'APAC'), 'All returned operators must be APAC');
  });

  await test('getOperatorById returns correct operator', () => {
    const op = getOperatorById('mts-rs');
    assert(op !== undefined, 'MTS Serbia must be found');
    assert(op!.name === 'MTS Serbia', `Expected 'MTS Serbia', got '${op!.name}'`);
    assert(op!.currency === 'RSD', `Expected RSD currency`);
  });

  await test('getOperatorById returns undefined for unknown id', () => {
    const op = getOperatorById('does-not-exist');
    assert(op === undefined, 'Should return undefined for unknown operator');
  });

  await test('all operators have at least one network type', () => {
    const ops = listOperators();
    for (const op of ops) {
      assert(op.networkTypes.length > 0, `Operator ${op.id} must have at least one network type`);
    }
  });

  // ─── Discount registry ──────────────────────────────────────────────────────

  console.log('\n🔎 [discount-telecom] Discount registry');

  await test('listDiscounts returns all discounts when no filter', () => {
    const discounts = listDiscounts();
    assert(discounts.length > 0, 'Should return at least one discount rule');
  });

  await test('getDiscountsByOperator returns discounts for mts-rs', () => {
    const discounts = getDiscountsByOperator('mts-rs');
    assert(discounts.length > 0, 'MTS Serbia should have discounts');
    assert(discounts.every((d) => d.operatorId === 'mts-rs'), 'All discounts must belong to mts-rs');
  });

  await test('getDiscountsByOperator returns empty for unknown operator', () => {
    const discounts = getDiscountsByOperator('unknown-op');
    assert(discounts.length === 0, 'Unknown operator should return empty array');
  });

  await test('all discount rules have valuePercent > 0', () => {
    const all = listDiscounts();
    for (const d of all) {
      assert(d.valuePercent > 0, `Discount ${d.id} valuePercent must be > 0`);
    }
  });

  // ─── Calculation engine ─────────────────────────────────────────────────────

  console.log('\n🔎 [discount-telecom] Calculation engine');

  await test('basic calculation for vodafone-eu consumer 4G', () => {
    const result = calculateDiscount({
      operatorId: 'vodafone-eu',
      basePriceCents: 2000,
      currency: 'EUR',
      networkType: '4G',
      userSegment: 'consumer',
    });
    assert(result.valid, 'Result should be valid');
    assert(result.appliedDiscounts.length > 0, 'Should apply at least one discount');
    assert(result.netPriceCents < 2000, 'Net price must be less than base price');
    assert(result.totalDiscountPercent > 0, 'Total discount must be > 0');
  });

  await test('5G bundle discount applies for 5G network', () => {
    const result = calculateDiscount({
      operatorId: 'vodafone-eu',
      basePriceCents: 3000,
      currency: 'EUR',
      networkType: '5G',
      userSegment: 'consumer',
    });
    assert(result.valid, 'Should be valid');
    const bundleApplied = result.appliedDiscounts.some((d) => d.type === 'bundle');
    assert(bundleApplied, 'Bundle discount should apply for 5G');
  });

  await test('5G bundle discount does NOT apply for 3G network', () => {
    const result = calculateDiscount({
      operatorId: 'vodafone-eu',
      basePriceCents: 3000,
      currency: 'EUR',
      networkType: '3G',
      userSegment: 'consumer',
    });
    const bundleApplied = result.appliedDiscounts.some((d) => d.discountId === 'vodafone-eu-bundle-5g-15');
    assert(!bundleApplied, '5G bundle should NOT apply for 3G');
  });

  await test('exclusive discount wins over non-exclusive for senior MTS RS', () => {
    const result = calculateDiscount({
      operatorId: 'mts-rs',
      basePriceCents: 4000,
      currency: 'RSD',
      networkType: '4G',
      userSegment: 'senior',
    });
    assert(result.valid, 'Should be valid');
    assert(result.appliedDiscounts.length === 1, 'Only one (exclusive) discount should be applied');
    assert(result.appliedDiscounts[0].discountId === 'mts-rs-senior-25', 'Senior exclusive discount must win');
    assertClose(result.netPriceCents, 3000, 1, 'Net price with 25% off 4000 cents');
  });

  await test('discount cap of 60% is enforced', () => {
    const ops = listOperators();
    for (const op of ops) {
      const result = calculateDiscount({
        operatorId: op.id,
        basePriceCents: 10000,
        currency: op.currency,
        networkType: '5G',
        userSegment: 'all',
      });
      assert(
        result.totalDiscountPercent <= DISCOUNT_TELECOM_MAX_DISCOUNT_CAP_PERCENT,
        `Operator ${op.id} exceeds cap: ${result.totalDiscountPercent}%`
      );
    }
  });

  await test('net price calculation is mathematically correct', () => {
    const result = calculateDiscount({
      operatorId: 'deutsche-telekom',
      basePriceCents: 5000,
      currency: 'EUR',
      networkType: '4G',
      userSegment: 'student',
    });
    assert(result.valid, 'Should be valid');
    const expectedNet = Math.round(5000 * (1 - result.totalDiscountPercent / 100));
    assertClose(result.netPriceCents, expectedNet, 1, 'Net price cents math');
  });

  await test('unknown operator returns invalid result', () => {
    const result = calculateDiscount({
      operatorId: 'ghost-operator',
      basePriceCents: 5000,
      currency: 'USD',
      networkType: '4G',
      userSegment: 'consumer',
    });
    assert(!result.valid, 'Result should be invalid for unknown operator');
    assert(result.warnings.length > 0, 'Should have a warning message');
  });

  await test('zero basePriceCents returns zero net price', () => {
    const result = calculateDiscount({
      operatorId: 'vodafone-eu',
      basePriceCents: 0,
      currency: 'EUR',
      networkType: '4G',
      userSegment: 'consumer',
    });
    assert(result.valid, 'Zero price is valid');
    assert(result.netPriceCents === 0, 'Net price must be 0');
    assert(result.netPriceMajor === 0, 'Net price major must be 0');
  });

  await test('negative basePriceCents returns invalid result', () => {
    const result = calculateDiscount({
      operatorId: 'vodafone-eu',
      basePriceCents: -100,
      currency: 'EUR',
      networkType: '4G',
      userSegment: 'consumer',
    });
    assert(!result.valid, 'Negative base price must be invalid');
  });

  await test('NaN basePriceCents returns invalid result', () => {
    const result = calculateDiscount({
      operatorId: 'vodafone-eu',
      basePriceCents: NaN,
      currency: 'EUR',
      networkType: '4G',
      userSegment: 'consumer',
    });
    assert(!result.valid, 'NaN base price must be invalid');
  });

  await test('Infinity basePriceCents returns invalid result', () => {
    const result = calculateDiscount({
      operatorId: 'vodafone-eu',
      basePriceCents: Infinity,
      currency: 'EUR',
      networkType: '4G',
      userSegment: 'consumer',
    });
    assert(!result.valid, 'Infinity base price must be invalid');
  });

  await test('invalid referenceDate returns invalid result', () => {
    const result = calculateDiscount({
      operatorId: 'vodafone-eu',
      basePriceCents: 2000,
      currency: 'EUR',
      networkType: '4G',
      userSegment: 'consumer',
      referenceDate: 'not-a-date',
    });
    assert(!result.valid, 'Invalid referenceDate must produce invalid result');
  });

  await test('no discounts apply for non-matching segment', () => {
    const result = calculateDiscount({
      operatorId: 'deutsche-telekom',
      basePriceCents: 5000,
      currency: 'EUR',
      networkType: '4G',
      userSegment: 'business',
    });
    const studentDiscount = result.appliedDiscounts.find((d) => d.discountId === 'dt-student-20');
    assert(!studentDiscount, 'Student discount should not apply for business segment');
  });

  // ─── Performance ─────────────────────────────────────────────────────────────

  console.log('\n🔎 [discount-telecom] Performance');

  await test(`calculateDiscount completes within ${DISCOUNT_TELECOM_PERFORMANCE_MAX_MS}ms`, () => {
    const start = Date.now();
    for (let i = 0; i < 100; i++) {
      calculateDiscount({
        operatorId: 'vodafone-eu',
        basePriceCents: 2500,
        currency: 'EUR',
        networkType: '4G',
        userSegment: 'consumer',
      });
    }
    const avg = (Date.now() - start) / 100;
    assert(avg <= DISCOUNT_TELECOM_PERFORMANCE_MAX_MS, `Average: ${avg.toFixed(2)}ms > ${DISCOUNT_TELECOM_PERFORMANCE_MAX_MS}ms`);
  });

  // ─── Health report ────────────────────────────────────────────────────────────

  console.log('\n🔎 [discount-telecom] Health report');

  await test('getDiscountTelecomHealthReport returns valid report', () => {
    const report = getDiscountTelecomHealthReport();
    assert(report.totalOperators > 0, 'totalOperators must be > 0');
    assert(report.activeOperators > 0, 'activeOperators must be > 0');
    assert(report.totalDiscounts > 0, 'totalDiscounts must be > 0');
    assert(report.activeDiscounts > 0, 'activeDiscounts must be > 0');
    assert(report.personaId === DISCOUNT_TELECOM_PERSONA_ID, 'personaId must match');
    assert(report.contractVersion === DISCOUNT_TELECOM_CONTRACT_VERSION, 'contractVersion must match');
  });

  await test('health report byRegion covers all 6 regions', () => {
    const report = getDiscountTelecomHealthReport();
    const regions = ['EU', 'US', 'APAC', 'LATAM', 'Africa', 'ME'] as const;
    for (const r of regions) {
      assert(r in report.byRegion, `Region ${r} missing from byRegion`);
    }
  });

  await test('health report byNetworkType covers 2G/3G/4G/5G', () => {
    const report = getDiscountTelecomHealthReport();
    const nets = ['2G', '3G', '4G', '5G'] as const;
    for (const n of nets) {
      assert(n in report.byNetworkType, `Network ${n} missing from byNetworkType`);
    }
  });

  // ─── Summary ───────────────────────────────────────────────────────────────

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

  if (failed > 0) {
    console.error('Failures:');
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal error in test suite:', err);
  process.exit(1);
});
