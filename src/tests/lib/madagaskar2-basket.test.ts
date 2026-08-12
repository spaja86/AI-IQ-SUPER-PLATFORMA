// SpajaUltraOmegaCore -∞Ω+∞ — MADAGASKAR 2 Basket Tests
// Kompanija SPAJA — Digitalna Industrija

import { calculateBasket, getBasketDiscountPercent } from '../../lib/madagaskar-2/basket';
import { _resetFxRates } from '../../lib/madagaskar-2/fx';
import { _resetCatalogV2 } from '../../lib/madagaskar-2/registry';
import { _resetCatalog } from '../../lib/madagaskar/registry';
import {
  MADAGASKAR2_BASKET_DISCOUNT_TIER1_ITEMS,
  MADAGASKAR2_BASKET_DISCOUNT_TIER1_PERCENT,
  MADAGASKAR2_BASKET_DISCOUNT_TIER2_ITEMS,
  MADAGASKAR2_BASKET_DISCOUNT_TIER2_PERCENT,
} from '../../lib/madagaskar-2/types';
import type { BasketItem } from '../../lib/madagaskar-2/types';

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

const ITEM_EUR: BasketItem = { goodId: 'mdg-vanilla-001', quantityUnits: 5, buyerSegment: 'business', currency: 'EUR' };
const ITEM_USD: BasketItem = { goodId: 'idn-clove-001', quantityUnits: 3, buyerSegment: 'business', currency: 'USD' };
const ITEM_INVALID: BasketItem = { goodId: 'unknown-good-xyz', quantityUnits: 1, buyerSegment: 'consumer', currency: 'EUR' };

async function runTests(): Promise<void> {
  _resetCatalog();
  _resetCatalogV2();
  _resetFxRates();

  // ─── Empty basket ──────────────────────────────────────────────────────────

  console.log('\n🔎 [madagaskar2/basket] Empty basket');

  await test('calculateBasket empty array returns invalid result', () => {
    const result = calculateBasket([]);
    assert(!result.valid, 'Empty basket should be invalid');
    assert(result.warnings.length > 0, 'Should have a warning');
    assert(result.items.length === 0, 'Items should be empty');
  });

  // ─── Single item ───────────────────────────────────────────────────────────

  console.log('\n🔎 [madagaskar2/basket] Single item');

  await test('calculateBasket single valid item returns valid result', () => {
    const result = calculateBasket([ITEM_EUR], 'EUR');
    assert(result.valid, `Expected valid: ${result.warnings.join('; ')}`);
    assert(result.items.length === 1, 'Should have 1 item result');
    assert(result.totalNetPriceMajor > 0, 'Total should be > 0');
    assert(result.currency === 'EUR', 'Currency should be EUR');
  });

  await test('calculateBasket single item has no basket discount', () => {
    const result = calculateBasket([ITEM_EUR], 'EUR');
    assert(result.basketDiscountPercent === 0, `Expected 0 discount, got ${result.basketDiscountPercent}`);
  });

  // ─── All invalid items ─────────────────────────────────────────────────────

  console.log('\n🔎 [madagaskar2/basket] All invalid items');

  await test('calculateBasket all invalid items returns invalid result with warnings', () => {
    const result = calculateBasket([ITEM_INVALID], 'EUR');
    assert(!result.valid, 'All-invalid basket should be invalid');
    assert(result.warnings.length > 0, 'Should have warnings');
  });

  // ─── Mixed items ───────────────────────────────────────────────────────────

  console.log('\n🔎 [madagaskar2/basket] Mixed items');

  await test('calculateBasket mixed valid and invalid warns about invalid', () => {
    const result = calculateBasket([ITEM_EUR, ITEM_INVALID], 'EUR');
    assert(result.valid, 'Should be valid because at least one item is valid');
    assert(result.warnings.some((w) => w.includes('invalid')), 'Should warn about invalid items');
  });

  // ─── Multi-currency ────────────────────────────────────────────────────────

  console.log('\n🔎 [madagaskar2/basket] Multi-currency');

  await test('calculateBasket converts USD item to EUR output', () => {
    const result = calculateBasket([ITEM_EUR, ITEM_USD], 'EUR');
    assert(result.valid, `Should be valid: ${result.warnings.join('; ')}`);
    assert(result.currency === 'EUR', 'Output currency should be EUR');
    assert(result.totalNetPriceMajor > 0, 'Total should be positive');
    assert(result.durationMs >= 0, 'Duration must be non-negative');
  });

  // ─── Basket discount ───────────────────────────────────────────────────────

  console.log('\n🔎 [madagaskar2/basket] Basket discount');

  await test('getBasketDiscountPercent 0 for <= TIER1_ITEMS', () => {
    assert(getBasketDiscountPercent(MADAGASKAR2_BASKET_DISCOUNT_TIER1_ITEMS) === 0, 'At threshold, no discount');
    assert(getBasketDiscountPercent(1) === 0, 'Single item, no discount');
  });

  await test('getBasketDiscountPercent TIER1 for > TIER1_ITEMS', () => {
    const discount = getBasketDiscountPercent(MADAGASKAR2_BASKET_DISCOUNT_TIER1_ITEMS + 1);
    assert(discount === MADAGASKAR2_BASKET_DISCOUNT_TIER1_PERCENT, `Expected ${MADAGASKAR2_BASKET_DISCOUNT_TIER1_PERCENT}%, got ${discount}`);
  });

  await test('getBasketDiscountPercent TIER2 for > TIER2_ITEMS', () => {
    const discount = getBasketDiscountPercent(MADAGASKAR2_BASKET_DISCOUNT_TIER2_ITEMS + 1);
    assert(discount === MADAGASKAR2_BASKET_DISCOUNT_TIER2_PERCENT, `Expected ${MADAGASKAR2_BASKET_DISCOUNT_TIER2_PERCENT}%, got ${discount}`);
  });

  await test('calculateBasket applies tier1 discount for 6 items', () => {
    const items: BasketItem[] = Array.from({ length: 6 }, () => ({ ...ITEM_EUR }));
    const result = calculateBasket(items, 'EUR');
    assert(result.basketDiscountPercent === MADAGASKAR2_BASKET_DISCOUNT_TIER1_PERCENT, `Expected ${MADAGASKAR2_BASKET_DISCOUNT_TIER1_PERCENT}%, got ${result.basketDiscountPercent}`);
    assert(result.warnings.some((w) => w.includes('discount')), 'Should include discount warning');
  });

  await test('calculateBasket applies tier2 discount for 11 items', () => {
    const items: BasketItem[] = Array.from({ length: 11 }, () => ({ ...ITEM_EUR }));
    const result = calculateBasket(items, 'EUR');
    assert(result.basketDiscountPercent === MADAGASKAR2_BASKET_DISCOUNT_TIER2_PERCENT, `Expected ${MADAGASKAR2_BASKET_DISCOUNT_TIER2_PERCENT}%, got ${result.basketDiscountPercent}`);
  });

  // ─── Performance ───────────────────────────────────────────────────────────

  console.log('\n🔎 [madagaskar2/basket] Performance');

  await test('calculateBasket completes within 50ms', () => {
    const items: BasketItem[] = [ITEM_EUR, ITEM_USD];
    const result = calculateBasket(items, 'EUR');
    assert(result.durationMs < 50, `Expected < 50ms, got ${result.durationMs}ms`);
  });
}

runTests().then(() => {
  console.log(`\n${'─'.repeat(50)}`);
  console.log(`Total: ${passed + failed} | ✅ Passed: ${passed} | ❌ Failed: ${failed}`);
  if (failures.length > 0) {
    console.error('\nFailed tests:');
    failures.forEach((f) => console.error(`  - ${f}`));
    process.exit(1);
  }
});
