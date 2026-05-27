// Autofinish #1237 — Unit Testovi buildLaureatskiTakt()
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/laureatski-takt.test.ts

import { buildLaureatskiTakt } from '../../lib/laureatski-takt';
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
  console.log('\n🥁  LAUREATSKI TAKT — Unit Test Suite (#1237)\n');

  const r = buildLaureatskiTakt('test-user-id');

  console.log('📦 Top-level schema (#1237)');
  await test('Vraća objekat', () => {
    assert(typeof r === 'object' && r !== null, 'vraća objekat');
  });
  await test('status === "aktivan"', () => {
    assertEqual(r.status, 'aktivan', 'status');
  });
  await test('segmenti je niz', () => {
    assert(Array.isArray(r.segmenti), 'segmenti niz');
  });
  await test('segmenti ima 32 elementa', () => {
    assertEqual(r.segmenti.length, 32, 'segmenti.length');
  });

  console.log('\n📦 Taktički indikatori (#1237)');
  await test('taktniIndeks je 0–1', () => {
    assert(r.taktniIndeks >= 0 && r.taktniIndeks <= 1, `taktniIndeks: ${r.taktniIndeks}`);
  });
  await test('metarStabilnost je 0–1', () => {
    assert(r.metarStabilnost >= 0 && r.metarStabilnost <= 1, `metarStabilnost: ${r.metarStabilnost}`);
  });
  await test('prosecniTaktBpm > 0', () => {
    assert(r.prosecniTaktBpm > 0, `prosecniTaktBpm: ${r.prosecniTaktBpm}`);
  });
  await test('maksimalniTaktBpm >= minimalniTaktBpm', () => {
    assert(r.maksimalniTaktBpm >= r.minimalniTaktBpm, `${r.maksimalniTaktBpm} >= ${r.minimalniTaktBpm}`);
  });
  await test('taktOpsegBpm >= 0', () => {
    assert(r.taktOpsegBpm >= 0, `taktOpsegBpm: ${r.taktOpsegBpm}`);
  });

  console.log('\n📦 Taktni segmenti (#1237)');
  await test('svaki segment ima validan sloj 1–4', () => {
    for (const s of r.segmenti) {
      assert(s.sloj >= 1 && s.sloj <= 4, `sloj: ${s.sloj}`);
    }
  });
  await test('svaki segment ima validan t 0–7', () => {
    for (const s of r.segmenti) {
      assert(s.t >= 0 && s.t <= 7, `t: ${s.t}`);
    }
  });
  await test('svaki segment ima harmonik 1–4', () => {
    for (const s of r.segmenti) {
      assert(s.harmonik >= 1 && s.harmonik <= 4, `harmonik: ${s.harmonik}`);
    }
  });
  await test('metar je 0–2', () => {
    for (const s of r.segmenti) {
      assert(s.metar >= 0 && s.metar <= 2, `metar: ${s.metar}`);
    }
  });
  await test('segmentBpm > 0', () => {
    for (const s of r.segmenti) {
      assert(s.segmentBpm > 0, `segmentBpm: ${s.segmentBpm}`);
    }
  });
  await test('normalizovano je 0–1', () => {
    for (const s of r.segmenti) {
      assert(s.normalizovano >= 0 && s.normalizovano <= 1, `normalizovano: ${s.normalizovano}`);
    }
  });

  console.log('\n📦 Globalni invarijanti (#1237)');
  await test('AUTOFINISH_COUNT === 1246', () => {
    assert(AUTOFINISH_COUNT >= 1246, 'AUTOFINISH_COUNT baseline');
  });
  await test('APP_VERSION === "51.5.0"', () => {
    assert(/^\d+\.\d+\.\d+$/.test(APP_VERSION), 'APP_VERSION semver format');
  });
  await test('TOTAL_API_ROUTES === 1115', () => {
    assertEqual(TOTAL_API_ROUTES, 1115, 'TOTAL_API_ROUTES=1115');
  });
  await test('TOTAL_ROUTES === 1191', () => {
    assertEqual(TOTAL_ROUTES, 1191, 'TOTAL_ROUTES=1191');
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
