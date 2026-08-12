// SpajaUltraOmegaCore -∞Ω+∞ — MADAGASKAR 2 Engine Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  calculateProcurementV2,
  getMadagaskar2HealthReport,
  MADAGASKAR2_CONTRACT_VERSION,
  MADAGASKAR2_MODULE_VERSION,
  MADAGASKAR2_PERSONA_ID,
} from '../../lib/madagaskar-2';
import { _resetCatalog } from '../../lib/madagaskar/registry';
import { _resetCatalogV2 } from '../../lib/madagaskar-2/registry';
import { _resetFxRates } from '../../lib/madagaskar-2/fx';
import { _resetLots } from '../../lib/madagaskar-2/auction';
import { _resetTraces } from '../../lib/madagaskar-2/traceability';

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
  _resetCatalog();
  _resetCatalogV2();
  _resetFxRates();
  _resetLots();
  _resetTraces();

  // ─── Constants ─────────────────────────────────────────────────────────────

  console.log('\n🔎 [madagaskar2/engine] Constants');

  await test('MADAGASKAR2_CONTRACT_VERSION is v2', () => {
    assert(MADAGASKAR2_CONTRACT_VERSION === 'v2', `Expected 'v2', got '${MADAGASKAR2_CONTRACT_VERSION}'`);
  });

  await test('MADAGASKAR2_MODULE_VERSION is 2.0.0', () => {
    assert(MADAGASKAR2_MODULE_VERSION === '2.0.0', `Expected '2.0.0', got '${MADAGASKAR2_MODULE_VERSION}'`);
  });

  await test('MADAGASKAR2_PERSONA_ID is madagaskar-exotic-market', () => {
    assert(MADAGASKAR2_PERSONA_ID === 'madagaskar-exotic-market', `Persona ID mismatch`);
  });

  // ─── calculateProcurementV2 — without FX ──────────────────────────────────

  console.log('\n🔎 [madagaskar2/engine] calculateProcurementV2 without FX');

  await test('calculateProcurementV2 returns valid result for known good', () => {
    const result = calculateProcurementV2({
      goodId: 'mdg-vanilla-001',
      quantityUnits: 10,
      buyerSegment: 'business',
      currency: 'EUR',
    });
    assert(result.valid, `Expected valid: ${result.warnings.join('; ')}`);
    assert(result.goodId === 'mdg-vanilla-001', 'goodId mismatch');
    assert(result.totalNetPriceCents > 0, 'Total should be > 0');
  });

  await test('calculateProcurementV2 without targetCurrency has no convertedTotal', () => {
    const result = calculateProcurementV2({
      goodId: 'mdg-vanilla-001',
      quantityUnits: 1,
      buyerSegment: 'consumer',
      currency: 'EUR',
    });
    assert(result.convertedTotalNetPriceMajor === undefined, 'No conversion when no targetCurrency');
    assert(result.targetCurrency === undefined, 'targetCurrency should be undefined');
  });

  // ─── calculateProcurementV2 — with FX ────────────────────────────────────

  console.log('\n🔎 [madagaskar2/engine] calculateProcurementV2 with FX');

  await test('calculateProcurementV2 converts to targetCurrency', () => {
    const result = calculateProcurementV2(
      { goodId: 'mdg-vanilla-001', quantityUnits: 10, buyerSegment: 'business', currency: 'EUR' },
      'USD',
    );
    assert(result.valid, `Expected valid: ${result.warnings.join('; ')}`);
    assert(result.convertedTotalNetPriceMajor !== undefined, 'convertedTotalNetPriceMajor should be present');
    assert(result.convertedTotalNetPriceMajor! > 0, 'Converted total should be > 0');
    assert(result.targetCurrency === 'USD', 'targetCurrency should be USD');
  });

  await test('calculateProcurementV2 same targetCurrency as good returns no conversion fields', () => {
    const result = calculateProcurementV2(
      { goodId: 'mdg-vanilla-001', quantityUnits: 1, buyerSegment: 'business', currency: 'EUR' },
      'EUR',
    );
    assert(result.convertedTotalNetPriceMajor === undefined, 'Same currency should not add conversion');
  });

  await test('calculateProcurementV2 unknown targetCurrency adds warning', () => {
    const result = calculateProcurementV2(
      { goodId: 'mdg-vanilla-001', quantityUnits: 1, buyerSegment: 'business', currency: 'EUR' },
      'XYZ',
    );
    assert(result.warnings.some((w) => w.includes('FX')), `Expected FX warning, got: ${result.warnings.join('; ')}`);
  });

  await test('calculateProcurementV2 returns invalid for unknown good', () => {
    const result = calculateProcurementV2({
      goodId: 'not-a-good',
      quantityUnits: 1,
      buyerSegment: 'consumer',
      currency: 'EUR',
    });
    assert(!result.valid, 'Unknown good should return invalid');
  });

  // ─── v2 goods (new categories/regions) ────────────────────────────────────

  console.log('\n🔎 [madagaskar2/engine] v2 new goods');

  await test('calculateProcurementV2 handles v2 himalaya saffron', () => {
    const result = calculateProcurementV2({
      goodId: 'him-saffron-001',
      quantityUnits: 1,
      buyerSegment: 'consumer',
      currency: 'USD',
    });
    assert(result.valid, `Expected valid: ${result.warnings.join('; ')}`);
    assert(result.totalNetPriceCents > 0, 'Total should be > 0');
  });

  await test('calculateProcurementV2 handles arctic algae spirulina', () => {
    const result = calculateProcurementV2({
      goodId: 'arc-algae-spirulina-001',
      quantityUnits: 2,
      buyerSegment: 'business',
      currency: 'EUR',
    });
    assert(result.valid, `Expected valid: ${result.warnings.join('; ')}`);
  });

  // ─── Performance ───────────────────────────────────────────────────────────

  console.log('\n🔎 [madagaskar2/engine] Performance');

  await test('calculateProcurementV2 completes within 50ms', () => {
    const result = calculateProcurementV2(
      { goodId: 'mdg-vanilla-001', quantityUnits: 100, buyerSegment: 'industrial', currency: 'EUR' },
      'USD',
    );
    assert(result.durationMs < 50, `Expected < 50ms, got ${result.durationMs}ms`);
  });

  // ─── Health report ─────────────────────────────────────────────────────────

  console.log('\n🔎 [madagaskar2/engine] Health report');

  await test('getMadagaskar2HealthReport returns valid report', () => {
    const report = getMadagaskar2HealthReport();
    assert(report.contractVersion === 'v2', `Expected v2, got ${report.contractVersion}`);
    assert(report.personaId === MADAGASKAR2_PERSONA_ID, 'Persona ID mismatch');
    assert(report.totalGoods > 0, 'totalGoods must be > 0');
    assert(report.activeGoods > 0, 'activeGoods must be > 0');
    assert(report.fxRateCount > 0, 'fxRateCount must be > 0');
    assert(report.traceabilityCount > 0, 'traceabilityCount must be > 0');
    assert(typeof report.auctionStats.total === 'number', 'auctionStats.total must be number');
    assert(report.avgSustainability >= 0 && report.avgSustainability <= 100, 'avgSustainability out of range');
    assert(report.avgRarity >= 0 && report.avgRarity <= 10, 'avgRarity out of range');
  });

  await test('getMadagaskar2HealthReport includes v2 categories', () => {
    const report = getMadagaskar2HealthReport();
    const hasV2Category = Object.keys(report.byCategory).some((cat) =>
      ['fungal', 'crystal', 'algae'].includes(cat),
    );
    assert(hasV2Category, 'Health report should include v2 categories');
  });

  await test('getMadagaskar2HealthReport includes v2 regions', () => {
    const report = getMadagaskar2HealthReport();
    const hasV2Region = Object.keys(report.byRegion).some((r) =>
      ['Central-Africa', 'Himalaya', 'Arctic'].includes(r),
    );
    assert(hasV2Region, 'Health report should include v2 regions');
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
