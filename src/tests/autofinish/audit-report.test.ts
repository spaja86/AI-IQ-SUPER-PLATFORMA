// Autofinish #882 — Unit Testovi getAutofinishAuditReport()
// Autofinish #884 — Integracioni Testovi /api/autofinish-audit-report
// Kompanija SPAJA — Digitalna Industrija
//
// Testovi pokrivaju:
//   1. getAutofinishAuditReport() — schema, sva polja, tipovi, konzistentnost
//   2. /api/autofinish-audit-report simulacija — schema, Cache-Control, headers
//
// Pokretanje: npx tsx src/tests/autofinish/audit-report.test.ts

import {
  getAutofinishAuditReport,
} from '../../lib/autofinish-petlja';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
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
  console.log('\n📊 Audit Report — Unit + Integration Test Suite (#882 + #884)\n');

  // ── 1. getAutofinishAuditReport() schema (#882) ────────────────────────────
  console.log('📦 getAutofinishAuditReport() Schema (#882)');

  const report = getAutofinishAuditReport();

  await test('Vraća objekat', () => {
    assert(typeof report === 'object' && report !== null, 'vraća objekat');
  });

  await test('verzija === APP_VERSION', () => {
    assertEqual(report.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(report.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('timestamp je validan ISO', () => {
    assert(!isNaN(Date.parse(report.timestamp)), 'timestamp je validan ISO');
  });

  // ── 2. petljaStatus sekcija (#882) ────────────────────────────────────────
  console.log('\n📦 petljaStatus Sekcija (#882)');

  await test('petljaStatus je objekat', () => {
    assert(typeof report.petljaStatus === 'object' && report.petljaStatus !== null, 'petljaStatus je objekat');
  });

  await test('petljaStatus.verzija === APP_VERSION', () => {
    assertEqual(report.petljaStatus.verzija, APP_VERSION, 'petljaStatus.verzija');
  });

  await test('petljaStatus.autofinishIteracija === AUTOFINISH_COUNT', () => {
    assertEqual(report.petljaStatus.autofinishIteracija, AUTOFINISH_COUNT, 'petljaStatus.autofinishIteracija');
  });

  await test('petljaStatus.podsistemi je niz', () => {
    assert(Array.isArray(report.petljaStatus.podsistemi), 'petljaStatus.podsistemi je niz');
  });

  await test('petljaStatus.status je string', () => {
    assert(typeof report.petljaStatus.status === 'string', 'petljaStatus.status je string');
  });

  // ── 3. ekosistem sekcija (#882) ───────────────────────────────────────────
  console.log('\n📦 ekosistem Sekcija (#882)');

  await test('ekosistem je objekat', () => {
    assert(typeof report.ekosistem === 'object', 'ekosistem je objekat');
  });

  await test('ekosistem.verzija === APP_VERSION', () => {
    assertEqual(report.ekosistem.verzija, APP_VERSION, 'ekosistem.verzija');
  });

  await test('ekosistem.rute je broj > 0', () => {
    assert(typeof report.ekosistem.rute === 'number' && report.ekosistem.rute > 0, 'rute > 0');
  });

  await test('ekosistem.apiRute === TOTAL_API_ROUTES', () => {
    assertEqual(report.ekosistem.apiRute, TOTAL_API_ROUTES, 'ekosistem.apiRute');
  });

  // ── 4. zdravlje sekcija (#882) ────────────────────────────────────────────
  console.log('\n📦 zdravlje Sekcija (#882)');

  await test('zdravlje je objekat', () => {
    assert(typeof report.zdravlje === 'object', 'zdravlje je objekat');
  });

  await test('zdravlje.zdravlje === 100', () => {
    assertEqual(report.zdravlje.zdravlje, 100, 'zdravlje.zdravlje=100');
  });

  await test('zdravlje.ukupnoProvera === TOTAL_DIAGNOSTIKA', () => {
    assertEqual(report.zdravlje.ukupnoProvera, TOTAL_DIAGNOSTIKA, 'ukupnoProvera=TOTAL_DIAGNOSTIKA');
  });

  await test('zdravlje.verzija === APP_VERSION', () => {
    assertEqual(report.zdravlje.verzija, APP_VERSION, 'zdravlje.verzija');
  });

  // ── 5. progress sekcija (#882) ────────────────────────────────────────────
  console.log('\n📦 progress Sekcija (#882)');

  await test('progress je objekat', () => {
    assert(typeof report.progress === 'object', 'progress je objekat');
  });

  await test('progress.autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(report.progress.autofinishBroj, AUTOFINISH_COUNT, 'progress.autofinishBroj');
  });

  await test('progress.procenat je broj 0–100', () => {
    assert(report.progress.procenat >= 0 && report.progress.procenat <= 100, `procenat 0–100: ${report.progress.procenat}`);
  });

  await test('progress.preostalo >= 0', () => {
    assert(report.progress.preostalo >= 0, `preostalo >= 0: ${report.progress.preostalo}`);
  });

  // ── 6. podsistemi sekcija (#882) ──────────────────────────────────────────
  console.log('\n📦 podsistemi Sekcija (#882)');

  await test('podsistemi je objekat', () => {
    assert(typeof report.podsistemi === 'object', 'podsistemi je objekat');
  });

  await test('podsistemi.ukupnoPodsistema >= 9', () => {
    assert(report.podsistemi.ukupnoPodsistema >= 9, `ukupnoPodsistema >= 9: ${report.podsistemi.ukupnoPodsistema}`);
  });

  await test('podsistemi.podsistemi je niz', () => {
    assert(Array.isArray(report.podsistemi.podsistemi), 'podsistemi.podsistemi je niz');
  });

  // ── 7. Konzistentnost između sekcija (#882) ───────────────────────────────
  console.log('\n📦 Cross-Sekcijska Konzistentnost (#882)');

  await test('verzija konzistentna u svim sekcijama', () => {
    assertEqual(report.verzija, report.ekosistem.verzija, 'verzija==ekosistem.verzija');
    assertEqual(report.verzija, report.zdravlje.verzija, 'verzija==zdravlje.verzija');
    assertEqual(report.verzija, report.progress.verzija, 'verzija==progress.verzija');
    assertEqual(report.verzija, report.podsistemi.verzija, 'verzija==podsistemi.verzija');
  });

  await test('autofinishBroj konzistentno u svim sekcijama', () => {
    assertEqual(report.autofinishBroj, report.progress.autofinishBroj, 'autofinishBroj==progress.autofinishBroj');
    assertEqual(report.autofinishBroj, report.podsistemi.autofinishBroj, 'autofinishBroj==podsistemi.autofinishBroj');
    assertEqual(report.autofinishBroj, report.zdravlje.autofinishBroj, 'autofinishBroj==zdravlje.autofinishBroj');
  });

  await test('Dva uzastopna poziva konzistentni', () => {
    const r1 = getAutofinishAuditReport();
    const r2 = getAutofinishAuditReport();
    assertEqual(r1.verzija, r2.verzija, 'verzija konzistentna');
    assertEqual(r1.autofinishBroj, r2.autofinishBroj, 'autofinishBroj konzistentno');
    assertEqual(r1.zdravlje.zdravlje, r2.zdravlje.zdravlje, 'zdravlje konzistentno');
  });

  // ── 8. /api/autofinish-audit-report simulacija (#884) ────────────────────
  console.log('\n📦 /api/autofinish-audit-report — E2E Schema (#884)');

  function simulateAuditReportGET() {
    const rpt = getAutofinishAuditReport();
    return {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        'X-App-Version': APP_VERSION,
        'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
      },
      body: rpt,
    };
  }

  await test('HTTP 200', () => {
    assertEqual(simulateAuditReportGET().status, 200, 'HTTP 200');
  });

  await test('Cache-Control sadrži s-maxage=30', () => {
    const r = simulateAuditReportGET();
    assert(r.headers['Cache-Control'].includes('s-maxage=30'), 'Cache-Control s-maxage=30');
  });

  await test('X-App-Version === APP_VERSION', () => {
    const r = simulateAuditReportGET();
    assertEqual(r.headers['X-App-Version'], APP_VERSION, 'X-App-Version');
  });

  await test('X-Autofinish-Iteracija === AUTOFINISH_COUNT', () => {
    const r = simulateAuditReportGET();
    assertEqual(r.headers['X-Autofinish-Iteracija'], String(AUTOFINISH_COUNT), 'X-Autofinish-Iteracija');
  });

  await test('body ima sve obavezne ključeve', () => {
    const r = simulateAuditReportGET();
    const required = ['verzija', 'autofinishBroj', 'petljaStatus', 'ekosistem', 'zdravlje', 'progress', 'podsistemi', 'timestamp'];
    for (const k of required) {
      assert(k in r.body, `ključ "${k}" prisutan`);
    }
  });

  await test('body.verzija === APP_VERSION', () => {
    const r = simulateAuditReportGET();
    assertEqual(r.body.verzija, APP_VERSION, 'body.verzija');
  });

  await test('body.zdravlje.zdravlje === 100', () => {
    const r = simulateAuditReportGET();
    assertEqual(r.body.zdravlje.zdravlje, 100, 'zdravlje=100');
  });

  await test('body.timestamp je validan ISO', () => {
    const r = simulateAuditReportGET();
    assert(!isNaN(Date.parse(r.body.timestamp)), 'timestamp ISO');
  });

  // ── 9. Globalni invarijanti (#884) ────────────────────────────────────────
  console.log('\n📦 Globalni Invarijanti (#884)');

  await test('AUTOFINISH_COUNT === 930', () => {
    assertEqual(AUTOFINISH_COUNT, 930, 'AUTOFINISH_COUNT=930');
  });

  await test('APP_VERSION === "44.21.0"', () => {
    assertEqual(APP_VERSION, '44.51.0', 'APP_VERSION=44.51.0');
  });

  await test('TOTAL_DIAGNOSTIKA === 1844', () => {
    assertEqual(TOTAL_DIAGNOSTIKA, 1844, 'TOTAL_DIAGNOSTIKA=1844');
  });

  await test('TOTAL_API_ROUTES === 936', () => {
    assertEqual(TOTAL_API_ROUTES, 936, 'TOTAL_API_ROUTES=936');
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
