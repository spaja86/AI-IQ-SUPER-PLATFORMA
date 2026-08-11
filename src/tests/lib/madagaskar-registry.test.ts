// SpajaUltraOmegaCore -∞Ω+∞ — MADAGASKAR Registry Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  getGoodById,
  listGoods,
  upsertGood,
  removeGood,
} from '../../lib/madagaskar';
import { _resetCatalog } from '../../lib/madagaskar/registry';
import type { ExoticGood } from '../../lib/madagaskar';

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

const MOCK_GOOD: ExoticGood = {
  id: 'test-good-001',
  name: 'Test Exotic Good',
  category: 'artisan',
  originRegion: 'Oceania',
  rarity: 5,
  sustainabilityScore: 60,
  pricePerUnitCents: 5000,
  currency: 'USD',
  stock: 100,
  tags: ['test', 'mock'],
  active: true,
};

async function runTests(): Promise<void> {
  // ─── Seed data ─────────────────────────────────────────────────────────────

  console.log('\n🔎 [madagaskar/registry] Seed data');

  await test('listGoods returns seed data (> 0 active goods)', () => {
    _resetCatalog();
    const goods = listGoods();
    assert(goods.length > 0, 'Expected at least one active good');
    assert(goods.every((g) => g.active), 'All returned goods must be active');
  });

  await test('seed data contains goods from multiple regions', () => {
    _resetCatalog();
    const goods = listGoods();
    const regions = new Set(goods.map((g) => g.originRegion));
    assert(regions.has('Madagascar'), 'Expected Madagascar goods in seed');
    assert(regions.has('Indonesia'), 'Expected Indonesia goods in seed');
    assert(regions.has('Amazon'), 'Expected Amazon goods in seed');
  });

  // ─── getGoodById ───────────────────────────────────────────────────────────

  console.log('\n🔎 [madagaskar/registry] getGoodById');

  await test('getGoodById returns correct good for known id', () => {
    _resetCatalog();
    const good = getGoodById('mdg-vanilla-001');
    assert(!!good, 'Expected to find mdg-vanilla-001');
    assert(good!.id === 'mdg-vanilla-001', 'id mismatch');
    assert(good!.name.includes('Vanilla'), 'name should contain Vanilla');
  });

  await test('getGoodById returns undefined for unknown id', () => {
    _resetCatalog();
    const good = getGoodById('nonexistent-xyz');
    assert(good === undefined, 'Expected undefined for unknown id');
  });

  // ─── listGoods filters ─────────────────────────────────────────────────────

  console.log('\n🔎 [madagaskar/registry] listGoods filters');

  await test('listGoods filters by category', () => {
    _resetCatalog();
    const goods = listGoods({ category: 'spice' });
    assert(goods.length > 0, 'Expected at least one spice good');
    assert(goods.every((g) => g.category === 'spice'), 'All returned goods must be spice');
  });

  await test('listGoods filters by region', () => {
    _resetCatalog();
    const goods = listGoods({ region: 'Madagascar' });
    assert(goods.length > 0, 'Expected Madagascar goods');
    assert(goods.every((g) => g.originRegion === 'Madagascar'), 'All returned goods must be from Madagascar');
  });

  await test('listGoods filters by rarityMin', () => {
    _resetCatalog();
    const goods = listGoods({ rarityMin: 8 });
    assert(goods.length > 0, 'Expected at least one good with rarity >= 8');
    assert(goods.every((g) => g.rarity >= 8), 'All returned goods must have rarity >= 8');
  });

  await test('listGoods with no matching filter returns empty array', () => {
    _resetCatalog();
    const goods = listGoods({ rarityMin: 11 }); // impossible rarity
    assert(goods.length === 0, 'Expected empty array for impossibly high rarityMin');
  });

  // ─── upsertGood ────────────────────────────────────────────────────────────

  console.log('\n🔎 [madagaskar/registry] upsertGood');

  await test('upsertGood inserts a new good', () => {
    _resetCatalog();
    upsertGood(MOCK_GOOD);
    const good = getGoodById('test-good-001');
    assert(!!good, 'Expected to find newly inserted good');
    assert(good!.name === 'Test Exotic Good', 'name mismatch');
    _resetCatalog();
  });

  await test('upsertGood updates an existing good', () => {
    _resetCatalog();
    upsertGood(MOCK_GOOD);
    upsertGood({ ...MOCK_GOOD, name: 'Updated Test Good', rarity: 9 });
    const good = getGoodById('test-good-001');
    assert(!!good, 'Expected good to still exist after upsert');
    assert(good!.name === 'Updated Test Good', 'Expected updated name');
    assert(good!.rarity === 9, 'Expected updated rarity');
    _resetCatalog();
  });

  // ─── removeGood ────────────────────────────────────────────────────────────

  console.log('\n🔎 [madagaskar/registry] removeGood');

  await test('removeGood removes an existing good and returns true', () => {
    _resetCatalog();
    upsertGood(MOCK_GOOD);
    const removed = removeGood('test-good-001');
    assert(removed === true, 'Expected removeGood to return true');
    const good = getGoodById('test-good-001');
    assert(good === undefined, 'Expected good to be gone after removal');
    _resetCatalog();
  });

  await test('removeGood returns false for nonexistent id', () => {
    _resetCatalog();
    const removed = removeGood('definitely-not-here');
    assert(removed === false, 'Expected removeGood to return false for unknown id');
  });

  // ─── Empty catalog edge case ───────────────────────────────────────────────

  console.log('\n🔎 [madagaskar/registry] Empty catalog');

  await test('listGoods on empty catalog returns empty array', () => {
    // Clear by removing all seed goods individually, or use _resetCatalog then clear
    _resetCatalog();
    const ids = listGoods({ activeOnly: false }).map((g) => g.id);
    for (const id of ids) removeGood(id);
    const goods = listGoods();
    assert(goods.length === 0, 'Expected empty catalog');
    _resetCatalog(); // restore for subsequent tests
  });

  await test('getGoodById on empty catalog returns undefined', () => {
    _resetCatalog();
    const ids = listGoods({ activeOnly: false }).map((g) => g.id);
    for (const id of ids) removeGood(id);
    const good = getGoodById('mdg-vanilla-001');
    assert(good === undefined, 'Expected undefined on empty catalog');
    _resetCatalog();
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
