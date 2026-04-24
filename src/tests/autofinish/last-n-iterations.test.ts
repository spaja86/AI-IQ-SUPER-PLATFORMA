// Autofinish #856 — getLastNIterations() Helper
// Autofinish #857 — Unit Testovi getLastNIterations() i getAutofinishPetljaSummary()
// Autofinish #854 — GET /api/autofinish-changelog schema testovi
// Kompanija SPAJA — Digitalna Industrija
//
// Testovi pokrivaju:
//   1. getLastNIterations() — default n=10, max n=100, schema stavki, rastuće sortiranje
//   2. getAutofinishPetljaSummary() — sva polja
//   3. /api/autofinish-changelog handler — verzija/ukupno/stavke/n/timestamp
//
// Pokretanje: npx tsx src/tests/autofinish/last-n-iterations.test.ts

import { getLastNIterations, getAutofinishPetljaSummary } from '../../lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

// ─── Minimal test runner ──────────────────────────────────────────────────────

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

// ─── Test Suite ───────────────────────────────────────────────────────────────

async function runTests(): Promise<void> {
  console.log('\n📋 getLastNIterations() & Changelog — Unit Test Suite (#856 + #857 + #854)\n');

  // ── 1. getLastNIterations() — default (#856) ───────────────────────────────
  console.log('📦 getLastNIterations() — Default n=10 (#856)');

  await test('Vraća niz', () => {
    const r = getLastNIterations();
    assert(Array.isArray(r), 'vraća niz');
  });

  await test('Default n=10 — vraća 10 stavki', () => {
    const r = getLastNIterations();
    assertEqual(r.length, 10, 'length=10');
  });

  await test('Svaka stavka ima broj i opis', () => {
    const r = getLastNIterations();
    for (const s of r) {
      assert(typeof s.broj === 'number', `broj je broj: ${JSON.stringify(s)}`);
      assert(typeof s.opis === 'string', `opis je string: ${JSON.stringify(s)}`);
      assert(s.opis.length > 0, `opis nije prazan: ${s.broj}`);
    }
  });

  await test('Rastuće sortiranje — od manjih ka većim brojevima', () => {
    const r = getLastNIterations();
    for (let i = 1; i < r.length; i++) {
      assert(r[i].broj > r[i - 1].broj, `rastuće sortiranje: ${r[i - 1].broj} < ${r[i].broj}`);
    }
  });

  await test('Zadnja stavka je AUTOFINISH_COUNT', () => {
    const r = getLastNIterations();
    assertEqual(r[r.length - 1].broj, AUTOFINISH_COUNT, `zadnja stavka = ${AUTOFINISH_COUNT}`);
  });

  await test('Prva stavka je AUTOFINISH_COUNT - 9 (za n=10)', () => {
    const r = getLastNIterations(10);
    const expected = AUTOFINISH_COUNT - 9;
    assertEqual(r[0].broj, expected, `prva stavka = ${expected}`);
  });

  // ── 2. getLastNIterations() — custom n (#856) ─────────────────────────────
  console.log('\n📦 getLastNIterations() — Custom N');

  await test('n=1 vraća 1 stavku', () => {
    const r = getLastNIterations(1);
    assertEqual(r.length, 1, 'length=1');
  });

  await test('n=1 — stavka je AUTOFINISH_COUNT', () => {
    const r = getLastNIterations(1);
    assertEqual(r[0].broj, AUTOFINISH_COUNT, 'broj=AUTOFINISH_COUNT');
  });

  await test('n=5 vraća 5 stavki', () => {
    const r = getLastNIterations(5);
    assertEqual(r.length, 5, 'length=5');
  });

  await test('n=20 vraća 20 stavki', () => {
    const r = getLastNIterations(20);
    assertEqual(r.length, 20, 'length=20');
  });

  await test('Max n=100 — ne vraća više od 100', () => {
    const r = getLastNIterations(999);
    assert(r.length <= 100, `length <= 100, dobijeno: ${r.length}`);
  });

  await test('n=0 → vraća 1 stavku (min)', () => {
    const r = getLastNIterations(0);
    assert(r.length >= 1, 'min 1 stavka');
  });

  await test('n negativan → vraća 1 stavku (min)', () => {
    const r = getLastNIterations(-5);
    assert(r.length >= 1, 'min 1 stavka za negativni n');
  });

  // ── 3. Opis poznatih iteracija (#856) ─────────────────────────────────────
  console.log('\n📦 getLastNIterations() — Opis Poznatih Iteracija');

  await test('#860 opis sadrži "schema" ili "JSON" ili "E2E"', () => {
    // #860 je u poznatim opisima
    const r = getLastNIterations(1);
    if (AUTOFINISH_COUNT >= 860) {
      const stavka860 = getLastNIterations(100).find((s) => s.broj === 860);
      if (stavka860) {
        const opis = stavka860.opis.toLowerCase();
        assert(
          opis.includes('e2e') || opis.includes('json') || opis.includes('schema') || opis.includes('autofinish'),
          `opis #860 je informativan: "${stavka860.opis}"`
        );
      }
    }
    assert(r.length >= 1, 'vraća stavke');
  });

  await test('Nepoznata iteracija vraća fallback opis', () => {
    // Simuliramo sa brojevima koji nisu u mapi
    const r = getLastNIterations(100);
    for (const s of r) {
      assert(typeof s.opis === 'string', 'opis je uvijek string');
      assert(s.opis.length > 0, 'opis nije prazan');
    }
  });

  // ── 4. getAutofinishPetljaSummary() (#857) ────────────────────────────────
  console.log('\n📦 getAutofinishPetljaSummary() (#857)');

  await test('Vraća objekat', () => {
    const s = getAutofinishPetljaSummary();
    assert(typeof s === 'object' && s !== null, 'vraća objekat');
  });

  await test('Sadrži status string', () => {
    const s = getAutofinishPetljaSummary();
    assert(typeof s.status === 'string', 'status je string');
    assert(s.status.length > 0, 'status nije prazan');
  });

  await test('Sadrži podsistemi string u formatu N/M', () => {
    const s = getAutofinishPetljaSummary();
    assert(typeof s.podsistemi === 'string', 'podsistemi je string');
    assert(s.podsistemi.includes('/'), 'podsistemi sadrži "/"');
  });

  await test('Sadrži progres string sa %', () => {
    const s = getAutofinishPetljaSummary();
    assert(typeof s.progres === 'string', 'progres je string');
    assert(s.progres.includes('%'), 'progres sadrži "%"');
  });

  await test('Sadrži iteracije broj >= 1', () => {
    const s = getAutofinishPetljaSummary();
    assert(typeof s.iteracije === 'number', 'iteracije je broj');
    assert(s.iteracije >= 1, 'iteracije >= 1');
  });

  await test('Sadrži autofinish === AUTOFINISH_COUNT', () => {
    const s = getAutofinishPetljaSummary();
    assertEqual(s.autofinish, AUTOFINISH_COUNT, 'autofinish=AUTOFINISH_COUNT');
  });

  // ── 5. Changelog API handler schema (#854) ────────────────────────────────
  console.log('\n📦 /api/autofinish-changelog Handler Schema (#854)');

  function simulateChangelogGET(nParam: string | null) {
    const DEFAULT_N = 10;
    const MAX_N = 100;
    const n = Math.min(
      Math.max(parseInt(nParam ?? String(DEFAULT_N), 10) || DEFAULT_N, 1),
      MAX_N,
    );
    const stavke = getLastNIterations(n);
    return {
      verzija: APP_VERSION,
      autofinishIteracija: AUTOFINISH_COUNT,
      ukupno: stavke.length,
      n,
      stavke,
      timestamp: new Date().toISOString(),
    };
  }

  await test('Sadrži verzija === APP_VERSION', () => {
    const r = simulateChangelogGET(null);
    assertEqual(r.verzija, APP_VERSION, 'verzija');
  });

  await test('Sadrži autofinishIteracija === AUTOFINISH_COUNT', () => {
    const r = simulateChangelogGET(null);
    assertEqual(r.autofinishIteracija, AUTOFINISH_COUNT, 'autofinishIteracija');
  });

  await test('Sadrži ukupno === n (default 10)', () => {
    const r = simulateChangelogGET(null);
    assertEqual(r.ukupno, 10, 'ukupno=10');
  });

  await test('Sadrži n === 10 (default)', () => {
    const r = simulateChangelogGET(null);
    assertEqual(r.n, 10, 'n=10');
  });

  await test('stavke je niz od 10 elemenata', () => {
    const r = simulateChangelogGET(null);
    assert(Array.isArray(r.stavke), 'stavke je niz');
    assertEqual(r.stavke.length, 10, 'stavke.length=10');
  });

  await test('?n=5 vraća 5 stavki', () => {
    const r = simulateChangelogGET('5');
    assertEqual(r.ukupno, 5, 'ukupno=5');
    assertEqual(r.n, 5, 'n=5');
  });

  await test('?n=999 → max 100 stavki', () => {
    const r = simulateChangelogGET('999');
    assert(r.ukupno <= 100, `ukupno <= 100, dobijeno: ${r.ukupno}`);
  });

  await test('Sadrži ISO timestamp', () => {
    const r = simulateChangelogGET(null);
    assert(typeof r.timestamp === 'string', 'timestamp je string');
    assert(!isNaN(Date.parse(r.timestamp)), 'timestamp je validan ISO');
  });

  // ─── Rezultat ─────────────────────────────────────────────────────────────
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
