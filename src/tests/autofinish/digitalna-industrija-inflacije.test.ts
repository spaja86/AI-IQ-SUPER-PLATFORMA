import { buildDigitalnaIndustrijaInflacije } from '../../lib/digitalna-industrija-inflacije';
import {
  APP_VERSION,
  TOTAL_API_ROUTES,
  TOTAL_ROUTES,
  AUTOFINISH_COUNT,
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
  console.log('\n📈 Digitalna Industrija Inflacije — Unit Test Suite\n');

  const r = buildDigitalnaIndustrijaInflacije('test-user-id');

  await test('Vraća objekat i status=aktivan', () => {
    assert(typeof r === 'object' && r !== null, 'rezultat je objekat');
    assertEqual(r.status, 'aktivan', 'status');
  });

  await test('Timestamp je validan ISO string', () => {
    assert(!Number.isNaN(Date.parse(r.timestamp)), 'timestamp ISO');
  });

  await test('Jurisdikcija i izvor su popunjeni', () => {
    assertEqual(r.jurisdikcija, 'Republika Srbija', 'jurisdikcija');
    assert(r.izvor.length > 0, 'izvor nije prazan');
  });

  await test('KPI je konzistentan sa inflacijama', () => {
    assertEqual(r.kpi.ukupnoPerioda, r.inflacije.length, 'ukupnoPerioda');
    assertEqual(
      r.kpi.objavljeno,
      r.inflacije.filter((stavka) => stavka.status === 'objavljeno').length,
      'objavljeno',
    );
    assertEqual(
      r.kpi.naProveri,
      r.inflacije.filter((stavka) => stavka.status === 'na-proveri').length,
      'naProveri',
    );
  });

  await test('Stavke imaju obavezna polja i validne stope', () => {
    for (const stavka of r.inflacije) {
      assert(stavka.period.length > 0, 'period nije prazan');
      assert(stavka.cpi > 0, 'cpi > 0');
      assert(stavka.mesecnaStopa >= 0, 'mesecnaStopa >= 0');
      assert(stavka.godisnjaStopa >= 0, 'godisnjaStopa >= 0');
      assert(stavka.baznaInflacija >= 0, 'baznaInflacija >= 0');
      assert(stavka.projekcijaSledeciKvartal >= 0, 'projekcijaSledeciKvartal >= 0');
    }
  });

  await test('Verzije i brojači su ažurirani', () => {
    assert(/^\d+\.\d+\.\d+$/.test(APP_VERSION), 'APP_VERSION semver format');
    assert(AUTOFINISH_COUNT >= 1337, 'AUTOFINISH_COUNT baseline');
    assert(TOTAL_API_ROUTES >= 1159, 'TOTAL_API_ROUTES baseline');
    assert(TOTAL_ROUTES >= 1260, 'TOTAL_ROUTES baseline');
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
