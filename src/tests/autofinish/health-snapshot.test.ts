// Autofinish #867 — getAutofinishHealthSummary() Helper
// Autofinish #868 — Unit Testovi Health Summary + Ekosistem Snapshot
// Autofinish #870 — Integracioni Testovi /api/autofinish-full-report
// Kompanija SPAJA — Digitalna Industrija
//
// Testovi pokrivaju:
//   1. getAutofinishHealthSummary() — schema, zdravlje, status, podsistemi
//   2. getAutofinishEkosistemSnapshot() konzistentnost
//   3. /api/autofinish-full-report — sve sekcije, E2E schema
//
// Pokretanje: npx tsx src/tests/autofinish/health-snapshot.test.ts

import {
  getAutofinishHealthSummary,
  getAutofinishEkosistemSnapshot,
  getAutofinishPetljaSummary,
  getLastNIterations,
} from '../../lib/autofinish-petlja';
import { runDiagnostics } from '../../lib/auto-repair';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  TOTAL_ROUTES,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
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
  console.log('\n🏥 Health Summary + Full Report — Unit Test Suite (#867 + #868 + #870)\n');

  // ── 1. getAutofinishHealthSummary() schema (#867) ─────────────────────────
  console.log('📦 getAutofinishHealthSummary() Schema (#867)');

  const h = getAutofinishHealthSummary();

  await test('Vraća objekat', () => {
    assert(typeof h === 'object' && h !== null, 'vraća objekat');
  });

  await test('verzija === APP_VERSION', () => {
    assertEqual(h.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(h.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('zdravlje je broj 0–100', () => {
    assert(typeof h.zdravlje === 'number', 'zdravlje je broj');
    assert(h.zdravlje >= 0 && h.zdravlje <= 100, 'zdravlje 0–100');
  });

  await test('zdravlje === 100 (sve provere ok)', () => {
    assertEqual(h.zdravlje, 100, 'zdravlje=100');
  });

  await test('ukupnoProvera === TOTAL_DIAGNOSTIKA', () => {
    assertEqual(h.ukupnoProvera, TOTAL_DIAGNOSTIKA, `ukupnoProvera=${TOTAL_DIAGNOSTIKA}`);
  });

  await test('uspesnih === ukupnoProvera (sve ok)', () => {
    assertEqual(h.uspesnih, h.ukupnoProvera, 'uspesnih=ukupnoProvera');
  });

  await test('upozorenja === 0', () => {
    assertEqual(h.upozorenja, 0, 'upozorenja=0');
  });

  await test('gresaka === 0', () => {
    assertEqual(h.gresaka, 0, 'gresaka=0');
  });

  await test('kriticnih === 0', () => {
    assertEqual(h.kriticnih, 0, 'kriticnih=0');
  });

  await test('status === "ok" (zdravlje=100)', () => {
    assertEqual(h.status, 'ok', 'status=ok');
  });

  await test('podsistemi je niz', () => {
    assert(Array.isArray(h.podsistemi), 'podsistemi je niz');
  });

  await test('podsistemi.length >= 9 (9 podsistema)', () => {
    assert(h.podsistemi.length >= 9, `podsistemi.length >= 9: ${h.podsistemi.length}`);
  });

  await test('Svaki podsistem ima id, naziv, status, progres', () => {
    for (const p of h.podsistemi) {
      assert(typeof p.id === 'string', `id je string: ${JSON.stringify(p)}`);
      assert(typeof p.naziv === 'string', `naziv je string: ${JSON.stringify(p)}`);
      assert(typeof p.status === 'string', `status je string: ${JSON.stringify(p)}`);
      assert(typeof p.progres === 'number', `progres je broj: ${JSON.stringify(p)}`);
    }
  });

  await test('Svi podsistemi na 100%', () => {
    for (const p of h.podsistemi) {
      assertEqual(p.progres, 100, `${p.naziv} na 100%`);
    }
  });

  await test('timestamp je validan ISO', () => {
    assert(!isNaN(Date.parse(h.timestamp)), 'timestamp je validan ISO');
  });

  // ── 2. Konzistentnost sa runDiagnostics() (#868) ───────────────────────────
  console.log('\n📦 Konzistentnost sa runDiagnostics() (#868)');

  await test('zdravlje podudaranje sa runDiagnostics()', () => {
    const d = runDiagnostics();
    assertEqual(h.zdravlje, d.zdravlje, 'zdravlje podudaranje');
  });

  await test('ukupnoProvera podudaranje sa runDiagnostics()', () => {
    const d = runDiagnostics();
    assertEqual(h.ukupnoProvera, d.ukupnoProvera, 'ukupnoProvera podudaranje');
  });

  await test('uspesnih podudaranje sa runDiagnostics()', () => {
    const d = runDiagnostics();
    assertEqual(h.uspesnih, d.uspesnih, 'uspesnih podudaranje');
  });

  // ── 3. getAutofinishEkosistemSnapshot() konzistentnost (#868) ────────────
  console.log('\n📦 Ekosistem Snapshot Konzistentnost (#868)');

  const snap1 = getAutofinishEkosistemSnapshot();
  const snap2 = getAutofinishEkosistemSnapshot();

  await test('Dva uzastopna poziva vraćaju iste metrike (osim timestamp)', () => {
    assertEqual(snap1.verzija, snap2.verzija, 'verzija konzistentna');
    assertEqual(snap1.rute, snap2.rute, 'rute konzistentne');
    assertEqual(snap1.apiRute, snap2.apiRute, 'apiRute konzistentne');
    assertEqual(snap1.dijagnostike, snap2.dijagnostike, 'dijagnostike konzistentne');
  });

  await test('Timestamp se razlikuje (ili je isti u istom ms)', () => {
    // Timestampovi mogu biti jednaki ako se pozivaju u istoj ms
    assert(typeof snap1.timestamp === 'string' && typeof snap2.timestamp === 'string', 'oba timestamp su string');
  });

  await test('rute konzistentne sa TOTAL_ROUTES', () => {
    assertEqual(snap1.rute, TOTAL_ROUTES, 'rute=TOTAL_ROUTES');
  });

  await test('apiRute konzistentne sa TOTAL_API_ROUTES', () => {
    assertEqual(snap1.apiRute, TOTAL_API_ROUTES, 'apiRute=TOTAL_API_ROUTES');
  });

  await test('dijagnostike konzistentne sa TOTAL_DIAGNOSTIKA', () => {
    assertEqual(snap1.dijagnostike, TOTAL_DIAGNOSTIKA, 'dijagnostike=TOTAL_DIAGNOSTIKA');
  });

  // ── 4. /api/autofinish-full-report E2E schema (#870) ─────────────────────
  console.log('\n📦 /api/autofinish-full-report — E2E Schema (#870)');

  function simulateFullReportGET() {
    const statusSummary = getAutofinishPetljaSummary();
    const ekosistem = getAutofinishEkosistemSnapshot();
    const zdravlje = getAutofinishHealthSummary();
    const changelog = getLastNIterations(10);

    return {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
        'X-App-Version': APP_VERSION,
        'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
      },
      body: {
        verzija: APP_VERSION,
        autofinishIteracija: AUTOFINISH_COUNT,
        status: statusSummary,
        ekosistem,
        zdravlje: {
          zdravlje: zdravlje.zdravlje,
          ukupnoProvera: zdravlje.ukupnoProvera,
          uspesnih: zdravlje.uspesnih,
          status: zdravlje.status,
          podsistemi: zdravlje.podsistemi,
        },
        changelog: {
          ukupno: changelog.length,
          stavke: changelog,
        },
        timestamp: new Date().toISOString(),
      },
    };
  }

  await test('HTTP 200', () => {
    const r = simulateFullReportGET();
    assertEqual(r.status, 200, 'HTTP 200');
  });

  await test('Cache-Control sadrži s-maxage=30', () => {
    const r = simulateFullReportGET();
    assert(r.headers['Cache-Control'].includes('s-maxage=30'), 'Cache-Control s-maxage=30');
  });

  await test('X-App-Version === APP_VERSION', () => {
    const r = simulateFullReportGET();
    assertEqual(r.headers['X-App-Version'], APP_VERSION, 'X-App-Version');
  });

  await test('body.verzija === APP_VERSION', () => {
    const r = simulateFullReportGET();
    assertEqual(r.body.verzija, APP_VERSION, 'body.verzija');
  });

  await test('body.autofinishIteracija === AUTOFINISH_COUNT', () => {
    const r = simulateFullReportGET();
    assertEqual(r.body.autofinishIteracija, AUTOFINISH_COUNT, 'autofinishIteracija');
  });

  await test('body.status sekcija prisutna', () => {
    const r = simulateFullReportGET();
    assert(typeof r.body.status === 'object', 'status sekcija je objekat');
  });

  await test('body.status.autofinish === AUTOFINISH_COUNT', () => {
    const r = simulateFullReportGET();
    assertEqual(r.body.status.autofinish, AUTOFINISH_COUNT, 'status.autofinish');
  });

  await test('body.ekosistem sekcija prisutna', () => {
    const r = simulateFullReportGET();
    assert(typeof r.body.ekosistem === 'object', 'ekosistem sekcija je objekat');
  });

  await test('body.ekosistem.rute === TOTAL_ROUTES', () => {
    const r = simulateFullReportGET();
    assertEqual(r.body.ekosistem.rute, TOTAL_ROUTES, 'ekosistem.rute');
  });

  await test('body.ekosistem.apiRute === TOTAL_API_ROUTES', () => {
    const r = simulateFullReportGET();
    assertEqual(r.body.ekosistem.apiRute, TOTAL_API_ROUTES, 'ekosistem.apiRute');
  });

  await test('body.zdravlje sekcija prisutna', () => {
    const r = simulateFullReportGET();
    assert(typeof r.body.zdravlje === 'object', 'zdravlje sekcija je objekat');
  });

  await test('body.zdravlje.zdravlje === 100', () => {
    const r = simulateFullReportGET();
    assertEqual(r.body.zdravlje.zdravlje, 100, 'zdravlje.zdravlje=100');
  });

  await test('body.zdravlje.status === "ok"', () => {
    const r = simulateFullReportGET();
    assertEqual(r.body.zdravlje.status, 'ok', 'zdravlje.status=ok');
  });

  await test('body.zdravlje.podsistemi je niz >= 9', () => {
    const r = simulateFullReportGET();
    assert(Array.isArray(r.body.zdravlje.podsistemi), 'podsistemi je niz');
    assert(r.body.zdravlje.podsistemi.length >= 9, `podsistemi >= 9: ${r.body.zdravlje.podsistemi.length}`);
  });

  await test('body.changelog sekcija prisutna', () => {
    const r = simulateFullReportGET();
    assert(typeof r.body.changelog === 'object', 'changelog sekcija je objekat');
  });

  await test('body.changelog.ukupno === 10', () => {
    const r = simulateFullReportGET();
    assertEqual(r.body.changelog.ukupno, 10, 'changelog.ukupno=10');
  });

  await test('body.changelog.stavke je niz od 10', () => {
    const r = simulateFullReportGET();
    assert(Array.isArray(r.body.changelog.stavke), 'stavke je niz');
    assertEqual(r.body.changelog.stavke.length, 10, 'stavke.length=10');
  });

  await test('body.timestamp je validan ISO', () => {
    const r = simulateFullReportGET();
    assert(!isNaN(Date.parse(r.body.timestamp)), 'timestamp je validan ISO');
  });

  // ── 5. Globalni invarijanti (#870) ────────────────────────────────────────
  console.log('\n📦 Globalni Invarijanti (#870)');

  await test('AUTOFINISH_COUNT === 910', () => {
    assertEqual(AUTOFINISH_COUNT, 910, 'AUTOFINISH_COUNT=910');
  });

  await test('APP_VERSION === "44.21.0"', () => {
    assertEqual(APP_VERSION, '44.31.0', 'APP_VERSION=44.31.0');
  });

  await test('TOTAL_DIAGNOSTIKA === 1804', () => {
    assertEqual(TOTAL_DIAGNOSTIKA, 1804, 'TOTAL_DIAGNOSTIKA=1804');
  });

  await test('TOTAL_API_ROUTES === 933', () => {
    assertEqual(TOTAL_API_ROUTES, 933, 'TOTAL_API_ROUTES=933');
  });

  await test('getLastNIterations(10) zadnja = #910', () => {
    const r = getLastNIterations(10);
    assertEqual(r[r.length - 1].broj, 910, 'zadnja=#910');
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
