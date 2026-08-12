// SpajaUltraOmegaCore -∞Ω+∞ — Digit Intelligence Engine Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  DIGIT_REGISTRY,
  getDigitDescriptor,
  getDigitByNode,
  listAllDigits,
  DIGIT_ENGINE_CONTRACT_VERSION,
  DIGIT_ENGINE_MODULE_VERSION,
  DIGIT_ENGINE_PERSONA_ID,
  DIGIT_ENGINE_PERFORMANCE_MAX_MS,
  DIGIT_ENGINE_API_RESPONSE_MAX_MS,
} from '../../lib/digit-engine';

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

  // ─── Constants ─────────────────────────────────────────────────────────────
  console.log('\n🔎 [digit-engine] constants');

  await test('contract version is non-empty', () => {
    assert(DIGIT_ENGINE_CONTRACT_VERSION.length > 0, 'contract version must be defined');
  });

  await test('module version is non-empty', () => {
    assert(DIGIT_ENGINE_MODULE_VERSION.length > 0, 'module version must be defined');
  });

  await test('persona id is stable', () => {
    assert(DIGIT_ENGINE_PERSONA_ID === 'digit-engine-core', `unexpected: ${DIGIT_ENGINE_PERSONA_ID}`);
  });

  await test('performance max ≤ 50ms', () => {
    assert(DIGIT_ENGINE_PERFORMANCE_MAX_MS <= 50, `expected ≤ 50, got ${DIGIT_ENGINE_PERFORMANCE_MAX_MS}`);
  });

  await test('API response max ≤ 200ms', () => {
    assert(DIGIT_ENGINE_API_RESPONSE_MAX_MS <= 200, `expected ≤ 200, got ${DIGIT_ENGINE_API_RESPONSE_MAX_MS}`);
  });

  // ─── Registry completeness ─────────────────────────────────────────────────
  console.log('\n🔎 [digit-engine] registry completeness');

  await test('all 10 digits are registered (0–9)', () => {
    for (let d = 0; d <= 9; d++) {
      const desc = DIGIT_REGISTRY[d as 0];
      assert(desc !== undefined, `digit ${d} is missing from DIGIT_REGISTRY`);
    }
  });

  await test('each descriptor has required fields', () => {
    for (const desc of Object.values(DIGIT_REGISTRY)) {
      assert(typeof desc.id === 'number', `id must be number, got ${typeof desc.id}`);
      assert(desc.name.length > 0, `digit ${desc.id}: name is empty`);
      assert(desc.role.length > 0, `digit ${desc.id}: role is empty`);
      assert(typeof desc.octave === 'number', `digit ${desc.id}: octave must be a number`);
      assert(typeof desc.hipermrezaNode === 'number', `digit ${desc.id}: hipermrezaNode must be a number`);
      assert(Array.isArray(desc.linkedAgents), `digit ${desc.id}: linkedAgents must be an array`);
    }
  });

  await test('digit id matches registry key', () => {
    for (let d = 0; d <= 9; d++) {
      const desc = DIGIT_REGISTRY[d as 0];
      assert(desc.id === d, `digit ${d}: id field is ${desc.id}`);
    }
  });

  await test('no duplicate hipermreza nodes across digits 6–9', () => {
    // digits 0–5 share low nodes intentionally; 6–9 have distinct high nodes
    const highDigits = [6, 7, 8, 9];
    const seen = new Map<number, number>();
    for (const d of highDigits) {
      const node = DIGIT_REGISTRY[d as 6].hipermrezaNode;
      if (seen.has(node)) {
        throw new Error(`duplicate hipermrezaNode ${node} on digits ${seen.get(node)} and ${d}`);
      }
      seen.set(node, d);
    }
  });

  // ─── getDigitDescriptor ────────────────────────────────────────────────────
  console.log('\n🔎 [digit-engine] getDigitDescriptor');

  await test('returns descriptor for digit 0', () => {
    const d = getDigitDescriptor(0);
    assert(d !== undefined, 'expected descriptor for 0');
    assert(d!.name === 'zero-state', `unexpected name: ${d!.name}`);
  });

  await test('returns descriptor for digit 9', () => {
    const d = getDigitDescriptor(9);
    assert(d !== undefined, 'expected descriptor for 9');
    assert(d!.name === 'nona-sumbion', `unexpected name: ${d!.name}`);
  });

  await test('returns undefined for digit -1 (edge case)', () => {
    const d = getDigitDescriptor(-1);
    assert(d === undefined, 'expected undefined for -1');
  });

  await test('returns undefined for digit 10 (edge case)', () => {
    const d = getDigitDescriptor(10);
    assert(d === undefined, 'expected undefined for 10');
  });

  await test('returns undefined for NaN', () => {
    const d = getDigitDescriptor(NaN);
    assert(d === undefined, 'expected undefined for NaN');
  });

  await test('returns undefined for Infinity', () => {
    const d = getDigitDescriptor(Infinity);
    assert(d === undefined, 'expected undefined for Infinity');
  });

  // ─── getDigitByNode ────────────────────────────────────────────────────────
  console.log('\n🔎 [digit-engine] getDigitByNode');

  await test('finds digit 8 by node 64', () => {
    const d = getDigitByNode(64);
    assert(d !== undefined, 'expected descriptor for node 64');
    assert(d!.id === 8, `expected id 8, got ${d!.id}`);
  });

  await test('finds digit 9 by node 72', () => {
    const d = getDigitByNode(72);
    assert(d !== undefined, 'expected descriptor for node 72');
    assert(d!.id === 9, `expected id 9, got ${d!.id}`);
  });

  await test('returns undefined for unknown node 999', () => {
    const d = getDigitByNode(999);
    assert(d === undefined, 'expected undefined for node 999');
  });

  // ─── listAllDigits ─────────────────────────────────────────────────────────
  console.log('\n🔎 [digit-engine] listAllDigits');

  await test('returns exactly 10 entries', () => {
    const all = listAllDigits();
    assert(all.length === 10, `expected 10, got ${all.length}`);
  });

  await test('entries are sorted 0–9', () => {
    const all = listAllDigits();
    for (let i = 0; i < all.length; i++) {
      assert(all[i].id === i, `expected id ${i}, got ${all[i].id}`);
    }
  });

  // ─── Performance ───────────────────────────────────────────────────────────
  console.log('\n🔎 [digit-engine] performance');

  await test('single digit lookup ≤ 10ms', () => {
    const start = Date.now();
    for (let i = 0; i < 100; i++) getDigitDescriptor(5);
    const ms = (Date.now() - start) / 100;
    assert(ms <= 10, `lookup took ${ms.toFixed(2)}ms (expected ≤ 10ms)`);
  });

  await test('bulk list ≤ 50ms', () => {
    const start = Date.now();
    for (let i = 0; i < 100; i++) listAllDigits();
    const ms = (Date.now() - start) / 100;
    assert(ms <= 50, `listAllDigits took ${ms.toFixed(2)}ms (expected ≤ 50ms)`);
  });

  // ─── Specific descriptor values ────────────────────────────────────────────
  console.log('\n🔎 [digit-engine] specific descriptor values');

  await test('digit 2 is dual-sync with multi-repo-sync-agent', () => {
    const d = getDigitDescriptor(2)!;
    assert(d.name === 'dual-sync', `unexpected name: ${d.name}`);
    assert(d.linkedAgents.includes('multi-repo-sync-agent'), 'missing multi-repo-sync-agent');
  });

  await test('digit 6 hexa-validator has 6 linked agents', () => {
    const d = getDigitDescriptor(6)!;
    assert(d.name === 'hexa-validator', `unexpected name: ${d.name}`);
    assert(d.linkedAgents.length === 6, `expected 6 linked agents, got ${d.linkedAgents.length}`);
  });

  await test('digit 7 septa-octave is octave 7', () => {
    const d = getDigitDescriptor(7)!;
    assert(d.octave === 7, `expected octave 7, got ${d.octave}`);
    assert(d.hipermrezaNode === 56, `expected node 56, got ${d.hipermrezaNode}`);
  });
}

runTests().then(() => {
  console.log(`\n${'─'.repeat(50)}`);
  console.log(`✅ Passed: ${passed}  ❌ Failed: ${failed}`);
  if (failures.length > 0) {
    console.error('\nFailures:');
    failures.forEach((f) => console.error(`  • ${f}`));
    process.exit(1);
  }
  console.log('🚀 All digit-engine tests passed.');
});
