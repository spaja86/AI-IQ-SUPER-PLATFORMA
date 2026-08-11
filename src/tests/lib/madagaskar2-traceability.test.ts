// SpajaUltraOmegaCore -∞Ω+∞ — MADAGASKAR 2 Traceability Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  getTrace,
  listTraces,
  upsertTrace,
  validateTrace,
  getTraceabilityCount,
} from '../../lib/madagaskar-2/traceability';
import { _resetTraces } from '../../lib/madagaskar-2/traceability';
import type { TraceabilityRecord } from '../../lib/madagaskar-2/types';

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

const VALID_RECORD: TraceabilityRecord = {
  goodId: 'test-good-001',
  harvestDate: '2026-04-01',
  harvestLocation: 'Test Region',
  certifications: ['ISO 9001', 'Organic'],
  chainOfCustody: [
    { date: '2026-04-01', actor: 'Farmer', action: 'Harvest', location: 'Test Farm' },
    { date: '2026-04-10', actor: 'Warehouse', action: 'Storage', location: 'Test Warehouse' },
  ],
};

async function runTests(): Promise<void> {
  _resetTraces();

  // ─── getTrace ─────────────────────────────────────────────────────────────

  console.log('\n🔎 [madagaskar2/traceability] getTrace');

  await test('getTrace returns record for known goodId', () => {
    const r = getTrace('mdg-vanilla-001');
    assert(r !== undefined, 'Should return trace for mdg-vanilla-001');
    assert(r!.goodId === 'mdg-vanilla-001', 'goodId mismatch');
    assert(r!.chainOfCustody.length > 0, 'Chain of custody must be non-empty');
  });

  await test('getTrace returns undefined for unknown goodId', () => {
    assert(getTrace('unknown-good') === undefined, 'Should return undefined for unknown');
  });

  // ─── listTraces ───────────────────────────────────────────────────────────

  console.log('\n🔎 [madagaskar2/traceability] listTraces');

  await test('listTraces returns non-empty array', () => {
    const traces = listTraces();
    assert(Array.isArray(traces) && traces.length > 0, 'Should return at least one trace');
  });

  await test('listTraces contains seeded records', () => {
    const traces = listTraces();
    const ids = traces.map((t) => t.goodId);
    assert(ids.includes('mdg-vanilla-001'), 'Should include vanilla');
    assert(ids.includes('sib-mammoth-ivory-001'), 'Should include mammoth ivory');
  });

  // ─── upsertTrace ──────────────────────────────────────────────────────────

  console.log('\n🔎 [madagaskar2/traceability] upsertTrace');

  await test('upsertTrace inserts a new record', () => {
    upsertTrace(VALID_RECORD);
    const r = getTrace('test-good-001');
    assert(r !== undefined, 'Inserted record should be retrievable');
    assert(r!.certifications.includes('ISO 9001'), 'Certification should be stored');
  });

  await test('upsertTrace updates an existing record', () => {
    const updated: TraceabilityRecord = { ...VALID_RECORD, harvestLocation: 'Updated Location' };
    upsertTrace(updated);
    const r = getTrace('test-good-001')!;
    assert(r.harvestLocation === 'Updated Location', 'Location should be updated');
  });

  await test('getTraceabilityCount increases after upsert', () => {
    _resetTraces();
    const before = getTraceabilityCount();
    upsertTrace({ ...VALID_RECORD, goodId: 'new-good-99' });
    assert(getTraceabilityCount() === before + 1, 'Count should increase by 1');
  });

  // ─── validateTrace — valid ────────────────────────────────────────────────

  console.log('\n🔎 [madagaskar2/traceability] validateTrace — valid');

  await test('validateTrace returns empty array for valid record', () => {
    const errors = validateTrace(VALID_RECORD);
    assert(errors.length === 0, `Expected no errors, got: ${errors.join('; ')}`);
  });

  // ─── validateTrace — invalid ──────────────────────────────────────────────

  console.log('\n🔎 [madagaskar2/traceability] validateTrace — invalid');

  await test('validateTrace errors on empty goodId', () => {
    const r: TraceabilityRecord = { ...VALID_RECORD, goodId: '' };
    const errors = validateTrace(r);
    assert(errors.some((e) => e.includes('goodId')), `Expected goodId error, got: ${errors.join('; ')}`);
  });

  await test('validateTrace errors on invalid harvestDate', () => {
    const r: TraceabilityRecord = { ...VALID_RECORD, harvestDate: 'not-a-date' };
    const errors = validateTrace(r);
    assert(errors.some((e) => e.includes('harvestDate')), `Expected harvestDate error`);
  });

  await test('validateTrace errors on empty certifications', () => {
    const r: TraceabilityRecord = { ...VALID_RECORD, certifications: [] };
    const errors = validateTrace(r);
    assert(errors.some((e) => e.includes('certifications')), `Expected certifications error`);
  });

  await test('validateTrace errors on empty chainOfCustody', () => {
    const r: TraceabilityRecord = { ...VALID_RECORD, chainOfCustody: [] };
    const errors = validateTrace(r);
    assert(errors.some((e) => e.includes('chainOfCustody')), `Expected chainOfCustody error`);
  });

  await test('validateTrace errors on step with invalid date', () => {
    const r: TraceabilityRecord = {
      ...VALID_RECORD,
      chainOfCustody: [{ date: 'invalid', actor: 'A', action: 'B', location: 'C' }],
    };
    const errors = validateTrace(r);
    assert(errors.some((e) => e.includes('date')), `Expected chain step date error`);
  });

  await test('validateTrace errors on step with empty actor', () => {
    const r: TraceabilityRecord = {
      ...VALID_RECORD,
      chainOfCustody: [{ date: '2026-01-01', actor: '', action: 'B', location: 'C' }],
    };
    const errors = validateTrace(r);
    assert(errors.some((e) => e.includes('actor')), `Expected actor error`);
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
