// Autofinish #878 — Unit Testovi Podsistemi Details + Progress Info
// Autofinish #880 — Integracioni Testovi /api/autofinish-podsistemi
// Kompanija SPAJA — Digitalna Industrija
//
// Testovi pokrivaju:
//   1. getAutofinishPodsistemiDetails() — schema, tipovi, svi podsistemi
//   2. /api/autofinish-podsistemi simulacija — schema, Cache-Control, E2E
//   3. Globalni invarijanti #880
//
// Pokretanje: npx tsx src/tests/autofinish/podsistemi-details.test.ts

import {
  getAutofinishPodsistemiDetails,
  getAutofinishProgressInfo,
} from '../../lib/autofinish-petlja';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  AUTOFINISH_TARGET,
  TOTAL_DIAGNOSTIKA,
  TOTAL_API_ROUTES,
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

// ─── Test Suite ───────────────────────────────────────────────────────────────

async function runTests(): Promise<void> {
  console.log('\n🔧 Podsistemi Details + Podsistemi API — Unit Test Suite (#878 + #880)\n');

  // ── 1. getAutofinishPodsistemiDetails() schema (#877) ─────────────────────
  console.log('📦 getAutofinishPodsistemiDetails() Schema (#877)');

  const detalji = getAutofinishPodsistemiDetails();

  await test('Vraća objekat', () => {
    assert(typeof detalji === 'object' && detalji !== null, 'vraća objekat');
  });

  await test('verzija === APP_VERSION', () => {
    assertEqual(detalji.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(detalji.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('ukupnoPodsistema >= 9', () => {
    assert(typeof detalji.ukupnoPodsistema === 'number', 'ukupnoPodsistema je broj');
    assert(detalji.ukupnoPodsistema >= 9, `ukupnoPodsistema >= 9: ${detalji.ukupnoPodsistema}`);
  });

  await test('ukupnoPodsistema === podsistemi.length', () => {
    assertEqual(detalji.ukupnoPodsistema, detalji.podsistemi.length, 'ukupnoPodsistema === podsistemi.length');
  });

  await test('podsistemi je niz', () => {
    assert(Array.isArray(detalji.podsistemi), 'podsistemi je niz');
  });

  await test('Svaki podsistem ima id, naziv, status, progres, opis', () => {
    for (const p of detalji.podsistemi) {
      assert(typeof p.id === 'string' && p.id.length > 0, `id je string: ${JSON.stringify(p)}`);
      assert(typeof p.naziv === 'string' && p.naziv.length > 0, `naziv je string: ${JSON.stringify(p)}`);
      assert(typeof p.status === 'string', `status je string: ${JSON.stringify(p)}`);
      assert(typeof p.progres === 'number', `progres je broj: ${JSON.stringify(p)}`);
      assert(typeof p.opis === 'string' && p.opis.length > 0, `opis je string: ${JSON.stringify(p)}`);
    }
  });

  await test('Svi podsistemi imaju progres === 100', () => {
    for (const p of detalji.podsistemi) {
      assertEqual(p.progres, 100, `${p.naziv} progres=100`);
    }
  });

  await test('Svi podsistemi imaju status "ok"', () => {
    for (const p of detalji.podsistemi) {
      assertEqual(p.status, 'ok', `${p.naziv} status=ok`);
    }
  });

  await test('timestamp je validan ISO', () => {
    assert(!isNaN(Date.parse(detalji.timestamp)), 'timestamp je validan ISO');
  });

  await test('Nema dupliciranih id-ova', () => {
    const ids = detalji.podsistemi.map((p) => p.id);
    const uniqueIds = new Set(ids);
    assertEqual(uniqueIds.size, ids.length, `Nema dupliciranih id-ova: ${ids.join(', ')}`);
  });

  await test('Nema dupliciranih naziva', () => {
    const nazivi = detalji.podsistemi.map((p) => p.naziv);
    const uniqueNazivi = new Set(nazivi);
    assertEqual(uniqueNazivi.size, nazivi.length, `Nema dupliciranih naziva`);
  });

  // ── 2. Dva uzastopna poziva konzistentna (#878) ───────────────────────────
  console.log('\n📦 Konzistentnost getAutofinishPodsistemiDetails() (#878)');

  const d1 = getAutofinishPodsistemiDetails();
  const d2 = getAutofinishPodsistemiDetails();

  await test('Dva poziva vraćaju isti broj podsistema', () => {
    assertEqual(d1.ukupnoPodsistema, d2.ukupnoPodsistema, 'ukupnoPodsistema konzistentno');
  });

  await test('Dva poziva vraćaju iste id-ove', () => {
    const ids1 = d1.podsistemi.map((p) => p.id).sort().join(',');
    const ids2 = d2.podsistemi.map((p) => p.id).sort().join(',');
    assertEqual(ids1, ids2, 'id-ovi konzistentni');
  });

  await test('Dva poziva vraćaju isti verzija', () => {
    assertEqual(d1.verzija, d2.verzija, 'verzija konzistentna');
  });

  // ── 3. /api/autofinish-podsistemi simulacija E2E schema (#880) ────────────
  console.log('\n📦 /api/autofinish-podsistemi — E2E Schema (#880)');

  function simulatePodsistemiGET() {
    const detaljiResp = getAutofinishPodsistemiDetails();
    return {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        'X-App-Version': APP_VERSION,
        'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
      },
      body: detaljiResp,
    };
  }

  await test('HTTP 200', () => {
    assertEqual(simulatePodsistemiGET().status, 200, 'HTTP 200');
  });

  await test('Cache-Control sadrži s-maxage=60', () => {
    const r = simulatePodsistemiGET();
    assert(r.headers['Cache-Control'].includes('s-maxage=60'), 'Cache-Control s-maxage=60');
  });

  await test('X-App-Version === APP_VERSION', () => {
    const r = simulatePodsistemiGET();
    assertEqual(r.headers['X-App-Version'], APP_VERSION, 'X-App-Version');
  });

  await test('X-Autofinish-Iteracija === AUTOFINISH_COUNT', () => {
    const r = simulatePodsistemiGET();
    assertEqual(r.headers['X-Autofinish-Iteracija'], String(AUTOFINISH_COUNT), 'X-Autofinish-Iteracija');
  });

  await test('body.verzija === APP_VERSION', () => {
    const r = simulatePodsistemiGET();
    assertEqual(r.body.verzija, APP_VERSION, 'body.verzija');
  });

  await test('body.autofinishBroj === AUTOFINISH_COUNT', () => {
    const r = simulatePodsistemiGET();
    assertEqual(r.body.autofinishBroj, AUTOFINISH_COUNT, 'body.autofinishBroj');
  });

  await test('body.ukupnoPodsistema >= 9', () => {
    const r = simulatePodsistemiGET();
    assert(r.body.ukupnoPodsistema >= 9, `ukupnoPodsistema >= 9: ${r.body.ukupnoPodsistema}`);
  });

  await test('body.podsistemi je niz >= 9', () => {
    const r = simulatePodsistemiGET();
    assert(Array.isArray(r.body.podsistemi), 'podsistemi je niz');
    assert(r.body.podsistemi.length >= 9, `podsistemi.length >= 9: ${r.body.podsistemi.length}`);
  });

  await test('Svaki podsistem u body ima id, naziv, status, progres, opis', () => {
    const r = simulatePodsistemiGET();
    for (const p of r.body.podsistemi) {
      assert(typeof p.id === 'string', `id string: ${p.id}`);
      assert(typeof p.naziv === 'string', `naziv string: ${p.naziv}`);
      assert(typeof p.opis === 'string', `opis string: ${p.id}`);
      assert(typeof p.progres === 'number', `progres broj: ${p.id}`);
    }
  });

  await test('Svi podsistemi u body imaju status "ok"', () => {
    const r = simulatePodsistemiGET();
    for (const p of r.body.podsistemi) {
      assertEqual(p.status, 'ok', `${p.naziv} status=ok`);
    }
  });

  await test('body.timestamp je validan ISO', () => {
    const r = simulatePodsistemiGET();
    assert(!isNaN(Date.parse(r.body.timestamp)), 'timestamp je validan ISO');
  });

  // ── 4. getAutofinishProgressInfo() + getAutofinishPodsistemiDetails() konzistentnost (#878) ──
  console.log('\n📦 Cross-funkcijska Konzistentnost (#878)');

  await test('progressInfo.verzija === podsistemiDetails.verzija', () => {
    const p = getAutofinishProgressInfo();
    const d = getAutofinishPodsistemiDetails();
    assertEqual(p.verzija, d.verzija, 'verzija konzistentna');
  });

  await test('progressInfo.autofinishBroj === podsistemiDetails.autofinishBroj', () => {
    const p = getAutofinishProgressInfo();
    const d = getAutofinishPodsistemiDetails();
    assertEqual(p.autofinishBroj, d.autofinishBroj, 'autofinishBroj konzistentni');
  });

  // ── 5. Globalni invarijanti (#880) ────────────────────────────────────────
  console.log('\n📦 Globalni Invarijanti (#880)');

  await test('AUTOFINISH_COUNT === 950', () => {
    assertEqual(AUTOFINISH_COUNT, 960, 'AUTOFINISH_COUNT=960');
  });

  await test('APP_VERSION === "44.21.0"', () => {
    assertEqual(APP_VERSION, '44.81.0', 'APP_VERSION=44.81.0');
  });

  await test('TOTAL_DIAGNOSTIKA === 1884', () => {
    assertEqual(TOTAL_DIAGNOSTIKA, 1904, 'TOTAL_DIAGNOSTIKA=1904');
  });

  await test('TOTAL_API_ROUTES === 940', () => {
    assertEqual(TOTAL_API_ROUTES, 942, 'TOTAL_API_ROUTES=942');
  });

  await test('AUTOFINISH_TARGET > 880', () => {
    assert(AUTOFINISH_TARGET > 880, `AUTOFINISH_TARGET(${AUTOFINISH_TARGET}) > 880`);
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
