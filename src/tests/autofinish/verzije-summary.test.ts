// Autofinish #886 — Unit Testovi getAutofinishVerzijeSummary()
// Autofinish #888 — Integracioni Testovi /api/autofinish-verzije
// Autofinish #890 — E2E Cross-Endpoint Konzistentnost Audit + Verzije
// Kompanija SPAJA — Digitalna Industrija
//
// Testovi pokrivaju:
//   1. getAutofinishVerzijeSummary() — schema, tipovi, aktuelnaVerzija
//   2. /api/autofinish-verzije simulacija — schema, Cache-Control, headers
//   3. E2E cross-endpoint konzistentnost /api/autofinish-audit-report i /api/autofinish-verzije
//
// Pokretanje: npx tsx src/tests/autofinish/verzije-summary.test.ts

import {
  getAutofinishVerzijeSummary,
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
  console.log('\n🏷️ Verzije Summary + Cross-Endpoint E2E — Test Suite (#886 + #888 + #890)\n');

  // ── 1. getAutofinishVerzijeSummary() schema (#885) ─────────────────────────
  console.log('📦 getAutofinishVerzijeSummary() Schema (#886)');

  const summary = getAutofinishVerzijeSummary();

  await test('Vraća objekat', () => {
    assert(typeof summary === 'object' && summary !== null, 'vraća objekat');
  });

  await test('aktuelnaVerzija === APP_VERSION', () => {
    assertEqual(summary.aktuelnaVerzija, APP_VERSION, 'aktuelnaVerzija');
  });

  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(summary.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('ukupnoVerzija >= 1', () => {
    assert(typeof summary.ukupnoVerzija === 'number', 'ukupnoVerzija je broj');
    assert(summary.ukupnoVerzija >= 1, `ukupnoVerzija >= 1: ${summary.ukupnoVerzija}`);
  });

  await test('ukupnoVerzija === verzije.length', () => {
    assertEqual(summary.ukupnoVerzija, summary.verzije.length, 'ukupnoVerzija === verzije.length');
  });

  await test('verzije je niz', () => {
    assert(Array.isArray(summary.verzije), 'verzije je niz');
  });

  await test('timestamp je validan ISO', () => {
    assert(!isNaN(Date.parse(summary.timestamp)), 'timestamp ISO');
  });

  // ── 2. Svaka verzija ima ispravna polja (#886) ────────────────────────────
  console.log('\n📦 Verzije Stavke Validacija (#886)');

  await test('Svaka verzija ima verzija, autofinishBroj, opis', () => {
    for (const v of summary.verzije) {
      assert(typeof v.verzija === 'string' && v.verzija.length > 0, `verzija string: ${JSON.stringify(v)}`);
      assert(typeof v.autofinishBroj === 'number' && v.autofinishBroj > 0, `autofinishBroj > 0: ${JSON.stringify(v)}`);
      assert(typeof v.opis === 'string' && v.opis.length > 0, `opis string: ${JSON.stringify(v)}`);
    }
  });

  await test('Nema duplikata verzija', () => {
    const verzije = summary.verzije.map((v) => v.verzija);
    const unique = new Set(verzije);
    assertEqual(unique.size, verzije.length, 'Nema duplikata');
  });

  await test('APP_VERSION je u listi verzija', () => {
    const ima = summary.verzije.some((v) => v.verzija === APP_VERSION);
    assert(ima, `APP_VERSION "${APP_VERSION}" je u listi`);
  });

  await test('Sve autofinishBroj vrednosti su > 0', () => {
    for (const v of summary.verzije) {
      assert(v.autofinishBroj > 0, `autofinishBroj > 0 za ${v.verzija}`);
    }
  });

  await test('Verzija za APP_VERSION ima autofinishBroj === AUTOFINISH_COUNT', () => {
    const aktuelna = summary.verzije.find((v) => v.verzija === APP_VERSION);
    assert(aktuelna !== undefined, 'Aktuelna verzija pronađena');
    assertEqual(aktuelna!.autofinishBroj, AUTOFINISH_COUNT, 'aktuelna.autofinishBroj === AUTOFINISH_COUNT');
  });

  // ── 3. Konzistentnost (#886) ──────────────────────────────────────────────
  console.log('\n📦 Konzistentnost getAutofinishVerzijeSummary() (#886)');

  const s1 = getAutofinishVerzijeSummary();
  const s2 = getAutofinishVerzijeSummary();

  await test('Dva uzastopna poziva konzistentna', () => {
    assertEqual(s1.aktuelnaVerzija, s2.aktuelnaVerzija, 'aktuelnaVerzija konzistentna');
    assertEqual(s1.ukupnoVerzija, s2.ukupnoVerzija, 'ukupnoVerzija konzistentna');
    assertEqual(s1.autofinishBroj, s2.autofinishBroj, 'autofinishBroj konzistentno');
  });

  // ── 4. /api/autofinish-verzije simulacija (#888) ─────────────────────────
  console.log('\n📦 /api/autofinish-verzije — E2E Schema (#888)');

  function simulateVerzijeGET() {
    const s = getAutofinishVerzijeSummary();
    return {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'X-App-Version': APP_VERSION,
        'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
      },
      body: s,
    };
  }

  await test('HTTP 200', () => {
    assertEqual(simulateVerzijeGET().status, 200, 'HTTP 200');
  });

  await test('Cache-Control sadrži s-maxage=3600', () => {
    const r = simulateVerzijeGET();
    assert(r.headers['Cache-Control'].includes('s-maxage=3600'), 'Cache-Control s-maxage=3600');
  });

  await test('X-App-Version === APP_VERSION', () => {
    const r = simulateVerzijeGET();
    assertEqual(r.headers['X-App-Version'], APP_VERSION, 'X-App-Version');
  });

  await test('X-Autofinish-Iteracija === AUTOFINISH_COUNT', () => {
    const r = simulateVerzijeGET();
    assertEqual(r.headers['X-Autofinish-Iteracija'], String(AUTOFINISH_COUNT), 'X-Autofinish-Iteracija');
  });

  await test('body ima sve obavezne ključeve', () => {
    const r = simulateVerzijeGET();
    const required = ['aktuelnaVerzija', 'autofinishBroj', 'ukupnoVerzija', 'verzije', 'timestamp'];
    for (const k of required) {
      assert(k in r.body, `ključ "${k}" prisutan`);
    }
  });

  await test('body.aktuelnaVerzija === APP_VERSION', () => {
    const r = simulateVerzijeGET();
    assertEqual(r.body.aktuelnaVerzija, APP_VERSION, 'body.aktuelnaVerzija');
  });

  await test('body.verzije nije prazan niz', () => {
    const r = simulateVerzijeGET();
    assert(r.body.verzije.length >= 1, `verzije.length >= 1: ${r.body.verzije.length}`);
  });

  await test('body.timestamp je validan ISO', () => {
    const r = simulateVerzijeGET();
    assert(!isNaN(Date.parse(r.body.timestamp)), 'timestamp ISO');
  });

  // ── 5. E2E Cross-Endpoint Konzistentnost (#890) ───────────────────────────
  console.log('\n📦 E2E Cross-Endpoint Konzistentnost (#890)');

  const auditReport = getAutofinishAuditReport();
  const verzijeSummaryE2E = getAutofinishVerzijeSummary();

  await test('audit-report.verzija === verzije.aktuelnaVerzija', () => {
    assertEqual(auditReport.verzija, verzijeSummaryE2E.aktuelnaVerzija, 'verzija konzistentna');
  });

  await test('audit-report.autofinishBroj === verzije.autofinishBroj', () => {
    assertEqual(auditReport.autofinishBroj, verzijeSummaryE2E.autofinishBroj, 'autofinishBroj konzistentno');
  });

  await test('APP_VERSION konzistentno u audit-report i verzije', () => {
    assertEqual(auditReport.verzija, APP_VERSION, 'audit verzija');
    assertEqual(verzijeSummaryE2E.aktuelnaVerzija, APP_VERSION, 'verzije aktuelna');
  });

  await test('AUTOFINISH_COUNT konzistentno u audit-report i verzije', () => {
    assertEqual(auditReport.autofinishBroj, AUTOFINISH_COUNT, 'audit autofinishBroj');
    assertEqual(verzijeSummaryE2E.autofinishBroj, AUTOFINISH_COUNT, 'verzije autofinishBroj');
  });

  await test('audit-report.zdravlje.verzija konzistentno sa verzije.aktuelnaVerzija', () => {
    assertEqual(auditReport.zdravlje.verzija, verzijeSummaryE2E.aktuelnaVerzija, 'zdravlje.verzija');
  });

  await test('audit-report.progress.verzija konzistentno', () => {
    assertEqual(auditReport.progress.verzija, verzijeSummaryE2E.aktuelnaVerzija, 'progress.verzija');
  });

  // ── 6. Globalni invarijanti (#890) ────────────────────────────────────────
  console.log('\n📦 Globalni Invarijanti (#890)');

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
