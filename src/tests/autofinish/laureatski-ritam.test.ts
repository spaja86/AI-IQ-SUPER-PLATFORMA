// Autofinish #1236 — Unit Testovi buildLaureatskiRitam()
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/laureatski-ritam.test.ts

import { buildLaureatskiRitam } from '../../lib/laureatski-ritam';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  TOTAL_API_ROUTES,
  TOTAL_ROUTES,
} from '../../lib/constants';

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

async function runTests(): Promise<void> {
  console.log('\n🥁  LAUREATSKI RITAM — Unit Test Suite (#1236)\n');

  const r = buildLaureatskiRitam('test-user-id');

  console.log('📦 Top-level schema (#1236)');
  await test('Vraća objekat', () => {
    assert(typeof r === 'object' && r !== null, 'vraća objekat');
  });
  await test('status === "aktivan"', () => {
    assertEqual(r.status, 'aktivan', 'status');
  });
  await test('faze je niz', () => {
    assert(Array.isArray(r.faze), 'faze niz');
  });
  await test('faze ima 32 elementa', () => {
    assertEqual(r.faze.length, 32, 'faze.length');
  });

  console.log('\n📦 Ritmički indikatori (#1236)');
  await test('metronomskiIndeks je 0–1', () => {
    assert(r.metronomskiIndeks >= 0 && r.metronomskiIndeks <= 1, `metronomskiIndeks: ${r.metronomskiIndeks}`);
  });
  await test('ritamStabilnost je 0–1', () => {
    assert(r.ritamStabilnost >= 0 && r.ritamStabilnost <= 1, `ritamStabilnost: ${r.ritamStabilnost}`);
  });
  await test('prosecniTempoBpm > 0', () => {
    assert(r.prosecniTempoBpm > 0, `prosecniTempoBpm: ${r.prosecniTempoBpm}`);
  });
  await test('maksimalniTempoBpm >= minimalniTempoBpm', () => {
    assert(r.maksimalniTempoBpm >= r.minimalniTempoBpm, `${r.maksimalniTempoBpm} >= ${r.minimalniTempoBpm}`);
  });
  await test('ritamOpsegBpm >= 0', () => {
    assert(r.ritamOpsegBpm >= 0, `ritamOpsegBpm: ${r.ritamOpsegBpm}`);
  });

  console.log('\n📦 Ritmičke faze (#1236)');
  await test('svaka faza ima validan sloj 1–4', () => {
    for (const f of r.faze) {
      assert(f.sloj >= 1 && f.sloj <= 4, `sloj: ${f.sloj}`);
    }
  });
  await test('svaka faza ima validan t 0–7', () => {
    for (const f of r.faze) {
      assert(f.t >= 0 && f.t <= 7, `t: ${f.t}`);
    }
  });
  await test('svaka faza ima harmonik 1–4', () => {
    for (const f of r.faze) {
      assert(f.harmonik >= 1 && f.harmonik <= 4, `harmonik: ${f.harmonik}`);
    }
  });
  await test('akcenat > 0', () => {
    for (const f of r.faze) {
      assert(f.akcenat > 0, `akcenat: ${f.akcenat}`);
    }
  });
  await test('tempoBpm > 0', () => {
    for (const f of r.faze) {
      assert(f.tempoBpm > 0, `tempoBpm: ${f.tempoBpm}`);
    }
  });
  await test('normalizovano je 0–1', () => {
    for (const f of r.faze) {
      assert(f.normalizovano >= 0 && f.normalizovano <= 1, `normalizovano: ${f.normalizovano}`);
    }
  });

  console.log('\n📦 Globalni invarijanti (#1236)');
  await test('AUTOFINISH_COUNT === 1240', () => {
    assertEqual(AUTOFINISH_COUNT, 1240, 'AUTOFINISH_COUNT=1240');
  });
  await test('APP_VERSION === "50.9.0"', () => {
    assertEqual(APP_VERSION, '50.9.0', 'APP_VERSION=50.9.0');
  });
  await test('TOTAL_API_ROUTES === 1109', () => {
    assertEqual(TOTAL_API_ROUTES, 1109, 'TOTAL_API_ROUTES=1109');
  });
  await test('TOTAL_ROUTES === 1179', () => {
    assertEqual(TOTAL_ROUTES, 1179, 'TOTAL_ROUTES=1179');
  });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) {
    console.error('\n❌ Neuspešni testovi:');
    failures.forEach((f) => console.error(`  • ${f}`));
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Kritična greška u test runneru:', e);
  process.exit(1);
});
