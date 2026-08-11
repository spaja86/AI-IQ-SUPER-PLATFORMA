// SpajaUltraOmegaCore -∞Ω+∞ — MADAGASKAR Utils Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  validateProcurementInput,
  applyRarityPremium,
  applySustainabilityModifier,
  applyModifierCap,
  formatPriceMajor,
  generateProcurementId,
  MADAGASKAR_RARITY_PREMIUM_THRESHOLD,
  MADAGASKAR_MAX_MODIFIER_CAP_PERCENT,
  MADAGASKAR_SUSTAINABILITY_BONUS_THRESHOLD,
  MADAGASKAR_SUSTAINABILITY_PENALTY_THRESHOLD,
  MADAGASKAR_SUSTAINABILITY_PENALTY_PERCENT,
} from '../../lib/madagaskar';

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
  // ─── validateProcurementInput ──────────────────────────────────────────────

  console.log('\n🔎 [madagaskar/utils] validateProcurementInput');

  await test('valid input returns empty errors array', () => {
    const errors = validateProcurementInput({ goodId: 'abc', quantityUnits: 10, buyerSegment: 'business', currency: 'EUR' });
    assert(errors.length === 0, `Expected no errors, got: ${errors.join('; ')}`);
  });

  await test('empty goodId returns error', () => {
    const errors = validateProcurementInput({ goodId: '', quantityUnits: 1, buyerSegment: 'consumer', currency: 'EUR' });
    assert(errors.length > 0, 'Expected errors for empty goodId');
  });

  await test('quantityUnits = 0 returns error', () => {
    const errors = validateProcurementInput({ goodId: 'x', quantityUnits: 0, buyerSegment: 'consumer', currency: 'EUR' });
    assert(errors.length > 0, 'Expected errors for 0 quantity');
  });

  await test('negative quantityUnits returns error', () => {
    const errors = validateProcurementInput({ goodId: 'x', quantityUnits: -1, buyerSegment: 'consumer', currency: 'EUR' });
    assert(errors.length > 0, 'Expected errors for negative quantity');
  });

  await test('NaN quantityUnits returns error', () => {
    const errors = validateProcurementInput({ goodId: 'x', quantityUnits: NaN, buyerSegment: 'consumer', currency: 'EUR' });
    assert(errors.length > 0, 'Expected errors for NaN quantity');
  });

  await test('Infinity quantityUnits returns error', () => {
    const errors = validateProcurementInput({ goodId: 'x', quantityUnits: Infinity, buyerSegment: 'consumer', currency: 'EUR' });
    assert(errors.length > 0, 'Expected errors for Infinity quantity');
  });

  await test('empty currency returns error', () => {
    const errors = validateProcurementInput({ goodId: 'x', quantityUnits: 1, buyerSegment: 'consumer', currency: '' });
    assert(errors.length > 0, 'Expected errors for empty currency');
  });

  await test('invalid referenceDate returns error', () => {
    const errors = validateProcurementInput({ goodId: 'x', quantityUnits: 1, buyerSegment: 'consumer', currency: 'EUR', referenceDate: 'not-a-date' });
    assert(errors.length > 0, 'Expected errors for invalid referenceDate');
  });

  await test('valid ISO referenceDate passes validation', () => {
    const errors = validateProcurementInput({ goodId: 'x', quantityUnits: 1, buyerSegment: 'consumer', currency: 'EUR', referenceDate: '2026-01-01' });
    assert(errors.length === 0, `Expected no errors, got: ${errors.join('; ')}`);
  });

  // ─── applyRarityPremium ────────────────────────────────────────────────────

  console.log('\n🔎 [madagaskar/utils] applyRarityPremium');

  await test(`rarity <= ${MADAGASKAR_RARITY_PREMIUM_THRESHOLD} returns null`, () => {
    for (let r = 1; r <= MADAGASKAR_RARITY_PREMIUM_THRESHOLD; r++) {
      const mod = applyRarityPremium(r);
      assert(mod === null, `Expected null for rarity ${r}`);
    }
  });

  await test('rarity 8 returns +5%', () => {
    const mod = applyRarityPremium(8);
    assert(!!mod, 'Expected modifier for rarity 8');
    assert(mod!.valuePercent === 5, `Expected 5%, got ${mod!.valuePercent}`);
    assert(mod!.type === 'rarity-premium', 'Expected type rarity-premium');
  });

  await test('rarity 9 returns +10%', () => {
    const mod = applyRarityPremium(9);
    assert(!!mod, 'Expected modifier for rarity 9');
    assert(mod!.valuePercent === 10, `Expected 10%, got ${mod!.valuePercent}`);
  });

  await test('rarity 10 returns +15%', () => {
    const mod = applyRarityPremium(10);
    assert(!!mod, 'Expected modifier for rarity 10');
    assert(mod!.valuePercent === 15, `Expected 15%, got ${mod!.valuePercent}`);
  });

  await test('NaN rarity returns null', () => {
    const mod = applyRarityPremium(NaN);
    assert(mod === null, 'Expected null for NaN rarity');
  });

  await test('Infinity rarity returns modifier (valid finite handling is caller responsibility)', () => {
    // Infinity > 7, so formula would produce Infinity. Should return null for safety.
    const mod = applyRarityPremium(Infinity);
    assert(mod === null, 'Expected null for Infinity rarity');
  });

  // ─── applySustainabilityModifier ──────────────────────────────────────────

  console.log('\n🔎 [madagaskar/utils] applySustainabilityModifier');

  await test(`score > ${MADAGASKAR_SUSTAINABILITY_BONUS_THRESHOLD} returns sustainability-bonus (negative %)`, () => {
    const mod = applySustainabilityModifier(90);
    assert(!!mod, 'Expected modifier for score 90');
    assert(mod!.type === 'sustainability-bonus', 'Expected sustainability-bonus type');
    assert(mod!.valuePercent < 0, `Expected negative valuePercent, got ${mod!.valuePercent}`);
  });

  await test(`score < ${MADAGASKAR_SUSTAINABILITY_PENALTY_THRESHOLD} returns sustainability-penalty +${MADAGASKAR_SUSTAINABILITY_PENALTY_PERCENT}%`, () => {
    const mod = applySustainabilityModifier(22);
    assert(!!mod, 'Expected modifier for score 22');
    assert(mod!.type === 'sustainability-penalty', 'Expected sustainability-penalty type');
    assert(mod!.valuePercent === MADAGASKAR_SUSTAINABILITY_PENALTY_PERCENT, `Expected +${MADAGASKAR_SUSTAINABILITY_PENALTY_PERCENT}%, got ${mod!.valuePercent}`);
  });

  await test('score in neutral range [30, 80] returns null', () => {
    for (const s of [30, 50, 78, 80]) {
      const mod = applySustainabilityModifier(s);
      assert(mod === null, `Expected null for score ${s}`);
    }
  });

  await test('score 100 returns max sustainability-bonus', () => {
    const mod = applySustainabilityModifier(100);
    assert(!!mod, 'Expected modifier for score 100');
    assert(mod!.type === 'sustainability-bonus', 'Expected sustainability-bonus type');
    assert(mod!.valuePercent <= 0, 'Expected negative or zero valuePercent for score 100');
    assert(mod!.valuePercent >= -5, `Expected >= -5%, got ${mod!.valuePercent}`);
  });

  await test('NaN score returns null', () => {
    const mod = applySustainabilityModifier(NaN);
    assert(mod === null, 'Expected null for NaN score');
  });

  // ─── applyModifierCap ─────────────────────────────────────────────────────

  console.log('\n🔎 [madagaskar/utils] applyModifierCap');

  await test(`total below cap (${MADAGASKAR_MAX_MODIFIER_CAP_PERCENT}%) returns no warning`, () => {
    const { cappedPercent, warning } = applyModifierCap(20);
    assert(cappedPercent === 20, `Expected 20, got ${cappedPercent}`);
    assert(warning === null, 'Expected no warning');
  });

  await test(`total exactly at cap returns no warning`, () => {
    const { cappedPercent, warning } = applyModifierCap(MADAGASKAR_MAX_MODIFIER_CAP_PERCENT);
    assert(cappedPercent === MADAGASKAR_MAX_MODIFIER_CAP_PERCENT, 'Expected capped value');
    assert(warning === null, 'Expected no warning at exactly cap');
  });

  await test('total above cap is capped and warning emitted', () => {
    const { cappedPercent, warning } = applyModifierCap(55);
    assert(cappedPercent === MADAGASKAR_MAX_MODIFIER_CAP_PERCENT, `Expected ${MADAGASKAR_MAX_MODIFIER_CAP_PERCENT}, got ${cappedPercent}`);
    assert(typeof warning === 'string' && warning.length > 0, 'Expected a warning message');
  });

  // ─── formatPriceMajor ─────────────────────────────────────────────────────

  console.log('\n🔎 [madagaskar/utils] formatPriceMajor');

  await test('formatPriceMajor converts cents to major unit', () => {
    assertClose(formatPriceMajor(100), 1.00, 0.001, '100 cents = 1.00');
    assertClose(formatPriceMajor(150), 1.50, 0.001, '150 cents = 1.50');
    assertClose(formatPriceMajor(0), 0, 0.001, '0 cents = 0.00');
    assertClose(formatPriceMajor(99), 0.99, 0.001, '99 cents = 0.99');
  });

  await test('formatPriceMajor returns 0 for NaN', () => {
    assert(formatPriceMajor(NaN) === 0, 'Expected 0 for NaN input');
  });

  await test('formatPriceMajor returns 0 for Infinity', () => {
    assert(formatPriceMajor(Infinity) === 0, 'Expected 0 for Infinity input');
  });

  // ─── generateProcurementId ────────────────────────────────────────────────

  console.log('\n🔎 [madagaskar/utils] generateProcurementId');

  await test('generateProcurementId returns a non-empty string starting with mdg-proc-', () => {
    const id = generateProcurementId();
    assert(typeof id === 'string' && id.length > 0, 'Expected non-empty string');
    assert(id.startsWith('mdg-proc-'), `Expected id to start with 'mdg-proc-', got '${id}'`);
  });

  await test('generateProcurementId returns unique values', () => {
    const ids = new Set(Array.from({ length: 20 }, () => generateProcurementId()));
    assert(ids.size === 20, 'Expected 20 unique IDs');
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
