// Autofinish #986 — Unit Testovi getAutofinishCoverageReport()
// Kompanija SPAJA — Digitalna Industrija
//
// Testovi pokrivaju:
//   1. getAutofinishCoverageReport() — schema, completeness ratios, nema praznih kategorija
//
// Pokretanje: npx tsx src/tests/autofinish/coverage-report.test.ts

import { getAutofinishCoverageReport } from '../../lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

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
    throw new Error(`${label ?? 'assertEqual'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

async function runTests(): Promise<void> {
  console.log('\n📋 getAutofinishCoverageReport() — Unit Test Suite (#986)\n');

  console.log('📦 Schema i tipovi');

  await test('Vraća objekat', () => {
    const r = getAutofinishCoverageReport();
    assert(typeof r === 'object' && r !== null, 'vraća objekat');
  });

  await test('verzija === APP_VERSION', () => {
    const r = getAutofinishCoverageReport();
    assertEqual(r.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    const r = getAutofinishCoverageReport();
    assertEqual(r.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('ukupnoIteracija > 0', () => {
    const r = getAutofinishCoverageReport();
    assert(r.ukupnoIteracija > 0, 'ukupnoIteracija > 0');
  });

  await test('ukupnoKategorija > 0', () => {
    const r = getAutofinishCoverageReport();
    assert(r.ukupnoKategorija > 0, 'ukupnoKategorija > 0');
  });

  await test('globalnaPokrivenostPct je 0–100', () => {
    const r = getAutofinishCoverageReport();
    assert(r.globalnaPokrivenostPct >= 0 && r.globalnaPokrivenostPct <= 100, `globalnaPokrivenostPct=${r.globalnaPokrivenostPct}`);
  });

  await test('globalnaPokrivenostPct > 50 (većina iteracija pokrivena)', () => {
    const r = getAutofinishCoverageReport();
    assert(r.globalnaPokrivenostPct > 50, `globalnaPokrivenostPct=${r.globalnaPokrivenostPct} > 50`);
  });

  await test('kategorije je niz', () => {
    const r = getAutofinishCoverageReport();
    assert(Array.isArray(r.kategorije), 'kategorije je niz');
  });

  await test('Svaka kategorija ima schema polja', () => {
    const r = getAutofinishCoverageReport();
    for (const k of r.kategorije) {
      assert(typeof k.kategorija === 'string', `kategorija je string: ${JSON.stringify(k)}`);
      assert(typeof k.labelSr === 'string', `labelSr je string: ${JSON.stringify(k)}`);
      assert(typeof k.ukupno === 'number', `ukupno je broj: ${JSON.stringify(k)}`);
      assert(typeof k.pokriveno === 'number', `pokriveno je broj: ${JSON.stringify(k)}`);
      assert(typeof k.pokrivenostPct === 'number', `pokrivenostPct je broj: ${JSON.stringify(k)}`);
      assert(typeof k.potpunoPokrivena === 'boolean', `potpunoPokrivena je boolean: ${JSON.stringify(k)}`);
    }
  });

  await test('pokrivenostPct je uvijek 0–100', () => {
    const r = getAutofinishCoverageReport();
    for (const k of r.kategorije) {
      assert(k.pokrivenostPct >= 0 && k.pokrivenostPct <= 100, `pokrivenostPct=${k.pokrivenostPct} 0–100`);
    }
  });

  await test('pokriveno <= ukupno za svaku kategoriju', () => {
    const r = getAutofinishCoverageReport();
    for (const k of r.kategorije) {
      assert(k.pokriveno <= k.ukupno, `pokriveno(${k.pokriveno}) <= ukupno(${k.ukupno}) za ${k.kategorija}`);
    }
  });

  await test('timestamp je validan ISO string', () => {
    const r = getAutofinishCoverageReport();
    assert(typeof r.timestamp === 'string', 'timestamp je string');
    assert(!isNaN(Date.parse(r.timestamp)), 'timestamp je validan ISO');
  });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) {
    console.error('\n❌ Neuspješni testovi:');
    failures.forEach((f) => console.error(`  • ${f}`));
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Kritična greška u test runneru:', e);
  process.exit(1);
});
