// Autofinish #862 — Unit Testovi /api/autofinish-changelog Handler
// Autofinish #866 — Integracioni Testovi /api/autofinish-ekosistem-snapshot
// Kompanija SPAJA — Digitalna Industrija
//
// Testovi pokrivaju:
//   1. changelog handler — n param parsing, schema, max/min n, Cache-Control
//   2. ekosistem-snapshot schema — sve metrike, tipovi, vrednosti
//
// Pokretanje: npx tsx src/tests/autofinish/changelog-handler.test.ts

import { getLastNIterations, getAutofinishEkosistemSnapshot } from '../../lib/autofinish-petlja';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  TOTAL_ROUTES,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
  TOTAL_IGRICA,
  TOTAL_PAGES,
  OMEGA_AI_PERSONA_COUNT,
  OMEGA_AI_OKTAVA_COUNT,
} from '../../lib/constants';

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

// ─── Changelog handler simulation ────────────────────────────────────────────

function simulateChangelogGET(nParam: string | null) {
  const DEFAULT_N = 10;
  const MAX_N = 100;
  const n = Math.min(
    Math.max(parseInt(nParam ?? String(DEFAULT_N), 10) || DEFAULT_N, 1),
    MAX_N,
  );
  const stavke = getLastNIterations(n);
  return {
    status: 200,
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      'X-App-Version': APP_VERSION,
      'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
    },
    body: {
      verzija: APP_VERSION,
      autofinishIteracija: AUTOFINISH_COUNT,
      ukupno: stavke.length,
      n,
      stavke,
      timestamp: new Date().toISOString(),
    },
  };
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

async function runTests(): Promise<void> {
  console.log('\n📋 Changelog Handler & Ekosistem Snapshot — Unit Test Suite (#862 + #866)\n');

  // ── 1. Changelog Handler — n param parsing (#862) ────────────────────────
  console.log('📦 Changelog Handler — n Param Parsing (#862)');

  await test('HTTP 200 za default poziv', () => {
    const r = simulateChangelogGET(null);
    assertEqual(r.status, 200, 'HTTP 200');
  });

  await test('Default n=10 — ukupno=10', () => {
    const r = simulateChangelogGET(null);
    assertEqual(r.body.ukupno, 10, 'ukupno=10');
  });

  await test('Default n=10 — n polje=10', () => {
    const r = simulateChangelogGET(null);
    assertEqual(r.body.n, 10, 'n=10');
  });

  await test('stavke je niz od 10 elemenata', () => {
    const r = simulateChangelogGET(null);
    assert(Array.isArray(r.body.stavke), 'stavke je niz');
    assertEqual(r.body.stavke.length, 10, 'stavke.length=10');
  });

  await test('?n=5 — ukupno=5, n=5', () => {
    const r = simulateChangelogGET('5');
    assertEqual(r.body.ukupno, 5, 'ukupno=5');
    assertEqual(r.body.n, 5, 'n=5');
  });

  await test('?n=1 — vraća 1 stavku', () => {
    const r = simulateChangelogGET('1');
    assertEqual(r.body.ukupno, 1, 'ukupno=1');
  });

  await test('?n=50 — vraća 50 stavki', () => {
    const r = simulateChangelogGET('50');
    assertEqual(r.body.ukupno, 50, 'ukupno=50');
  });

  await test('?n=999 — max 100 stavki', () => {
    const r = simulateChangelogGET('999');
    assert(r.body.ukupno <= 100, `ukupno <= 100: ${r.body.ukupno}`);
  });

  await test('?n=0 — min 1 stavka', () => {
    const r = simulateChangelogGET('0');
    assert(r.body.ukupno >= 1, 'min 1 stavka za n=0');
  });

  await test('?n=abc — fallback default=10', () => {
    const r = simulateChangelogGET('abc');
    assertEqual(r.body.n, 10, 'fallback default=10 za n=abc');
  });

  await test('stavke su rastuće sortirane', () => {
    const r = simulateChangelogGET('20');
    for (let i = 1; i < r.body.stavke.length; i++) {
      assert(r.body.stavke[i].broj > r.body.stavke[i-1].broj, 'rastuće sortiranje');
    }
  });

  await test('Svaka stavka ima broj i opis', () => {
    const r = simulateChangelogGET(null);
    for (const s of r.body.stavke) {
      assert(typeof s.broj === 'number', 'broj je broj');
      assert(typeof s.opis === 'string', 'opis je string');
      assert(s.opis.length > 0, 'opis nije prazan');
    }
  });

  await test('verzija === APP_VERSION', () => {
    const r = simulateChangelogGET(null);
    assertEqual(r.body.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinishIteracija === AUTOFINISH_COUNT', () => {
    const r = simulateChangelogGET(null);
    assertEqual(r.body.autofinishIteracija, AUTOFINISH_COUNT, 'autofinishIteracija');
  });

  await test('Timestamp je validan ISO', () => {
    const r = simulateChangelogGET(null);
    assert(!isNaN(Date.parse(r.body.timestamp)), 'timestamp je validan ISO');
  });

  // ── 2. Cache-Control i Headers (#862) ─────────────────────────────────────
  console.log('\n📦 Changelog Handler — Headers (#862)');

  await test('Cache-Control header prisutan', () => {
    const r = simulateChangelogGET(null);
    assert(typeof r.headers['Cache-Control'] === 'string', 'Cache-Control je string');
    assert(r.headers['Cache-Control'].includes('s-maxage'), 'Cache-Control sadrži s-maxage');
  });

  await test('X-App-Version === APP_VERSION', () => {
    const r = simulateChangelogGET(null);
    assertEqual(r.headers['X-App-Version'], APP_VERSION, 'X-App-Version');
  });

  await test('X-Autofinish-Iteracija === AUTOFINISH_COUNT', () => {
    const r = simulateChangelogGET(null);
    assertEqual(r.headers['X-Autofinish-Iteracija'], String(AUTOFINISH_COUNT), 'X-Autofinish-Iteracija');
  });

  // ── 3. getAutofinishEkosistemSnapshot() schema (#866) ────────────────────
  console.log('\n📦 getAutofinishEkosistemSnapshot() Schema (#866)');

  const snap = getAutofinishEkosistemSnapshot();

  await test('Vraća objekat', () => {
    assert(typeof snap === 'object' && snap !== null, 'vraća objekat');
  });

  await test('verzija === APP_VERSION', () => {
    assertEqual(snap.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(snap.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('rute === TOTAL_ROUTES', () => {
    assertEqual(snap.rute, TOTAL_ROUTES, 'rute');
  });

  await test('apiRute === TOTAL_API_ROUTES', () => {
    assertEqual(snap.apiRute, TOTAL_API_ROUTES, 'apiRute');
  });

  await test('stranice === TOTAL_PAGES', () => {
    assertEqual(snap.stranice, TOTAL_PAGES, 'stranice');
  });

  await test('dijagnostike === TOTAL_DIAGNOSTIKA', () => {
    assertEqual(snap.dijagnostike, TOTAL_DIAGNOSTIKA, 'dijagnostike');
  });

  await test('igrice === TOTAL_IGRICA', () => {
    assertEqual(snap.igrice, TOTAL_IGRICA, 'igrice');
  });

  await test('omegaAiPersone === OMEGA_AI_PERSONA_COUNT', () => {
    assertEqual(snap.omegaAiPersone, OMEGA_AI_PERSONA_COUNT, 'omegaAiPersone');
  });

  await test('omegaAiOktave === OMEGA_AI_OKTAVA_COUNT', () => {
    assertEqual(snap.omegaAiOktave, OMEGA_AI_OKTAVA_COUNT, 'omegaAiOktave');
  });

  await test('omegaAiUkupno je broj > 0', () => {
    assert(typeof snap.omegaAiUkupno === 'number', 'omegaAiUkupno je broj');
    assert(snap.omegaAiUkupno > 0, 'omegaAiUkupno > 0');
  });

  await test('timestamp je validan ISO', () => {
    assert(!isNaN(Date.parse(snap.timestamp)), 'timestamp je validan ISO');
  });

  await test('rute >= apiRute', () => {
    assert(snap.rute >= snap.apiRute, 'rute >= apiRute');
  });

  // ── 4. /api/autofinish-ekosistem-snapshot handler schema (#866) ───────────
  console.log('\n📦 /api/autofinish-ekosistem-snapshot Handler Response (#866)');

  function simulateEkosistemSnapshotGET() {
    const snapshot = getAutofinishEkosistemSnapshot();
    return {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        'X-App-Version': APP_VERSION,
        'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
      },
      body: snapshot,
    };
  }

  await test('HTTP 200', () => {
    const r = simulateEkosistemSnapshotGET();
    assertEqual(r.status, 200, 'HTTP 200');
  });

  await test('Cache-Control sadrži s-maxage=60', () => {
    const r = simulateEkosistemSnapshotGET();
    assert(r.headers['Cache-Control'].includes('s-maxage=60'), 'Cache-Control s-maxage=60');
  });

  await test('X-App-Version === APP_VERSION', () => {
    const r = simulateEkosistemSnapshotGET();
    assertEqual(r.headers['X-App-Version'], APP_VERSION, 'X-App-Version');
  });

  await test('body ima sve obavezne ključeve', () => {
    const r = simulateEkosistemSnapshotGET();
    const required = ['verzija', 'autofinishBroj', 'rute', 'apiRute', 'stranice', 'dijagnostike', 'igrice', 'timestamp'];
    for (const k of required) {
      assert(k in r.body, `ključ "${k}" prisutan u body`);
    }
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
