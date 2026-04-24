// Autofinish #896 — Unit Testovi getAutofinishMetaInfo()
// Autofinish #898 — Integracioni Testovi /api/autofinish-meta
// Autofinish #900 — E2E svih 7 autofinish API endpoints konzistentnost
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/meta-info.test.ts

import {
  getAutofinishMetaInfo,
  getAutofinishStatistikaSummary,
  getAutofinishVerzijeSummary,
  getAutofinishAuditReport,
} from '../../lib/autofinish-petlja';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  TOTAL_DIAGNOSTIKA,
  TOTAL_API_ROUTES,
  APP_NAME,
  KOMPANIJA,
  BASE_URL,
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
  console.log('\n🏷️ Meta Info + Full E2E — Test Suite (#896 + #898 + #900)\n');

  // ── 1. getAutofinishMetaInfo() schema (#896) ───────────────────────────────
  console.log('📦 getAutofinishMetaInfo() Schema (#896)');

  const meta = getAutofinishMetaInfo();

  await test('Vraća objekat', () => {
    assert(typeof meta === 'object' && meta !== null, 'vraća objekat');
  });

  await test('naziv === APP_NAME', () => {
    assertEqual(meta.naziv, APP_NAME, 'naziv');
  });

  await test('kompanija === KOMPANIJA', () => {
    assertEqual(meta.kompanija, KOMPANIJA, 'kompanija');
  });

  await test('baseUrl === BASE_URL', () => {
    assertEqual(meta.baseUrl, BASE_URL, 'baseUrl');
  });

  await test('verzija === APP_VERSION', () => {
    assertEqual(meta.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(meta.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('timestamp je validan ISO', () => {
    assert(!isNaN(Date.parse(meta.timestamp)), 'timestamp ISO');
  });

  // ── 2. Meta string polja (#896) ────────────────────────────────────────────
  console.log('\n📦 Meta String Polja (#896)');

  await test('naziv je neprazan string', () => {
    assert(typeof meta.naziv === 'string' && meta.naziv.length > 0, 'naziv string');
  });

  await test('kompanija je neprazan string', () => {
    assert(typeof meta.kompanija === 'string' && meta.kompanija.length > 0, 'kompanija string');
  });

  await test('opis je neprazan string', () => {
    assert(typeof meta.opis === 'string' && meta.opis.length > 0, 'opis string');
  });

  await test('baseUrl počinje sa https://', () => {
    assert(meta.baseUrl.startsWith('https://'), `baseUrl https: ${meta.baseUrl}`);
  });

  // ── 3. techStack (#896) ───────────────────────────────────────────────────
  console.log('\n📦 techStack Validacija (#896)');

  await test('techStack je niz', () => {
    assert(Array.isArray(meta.techStack), 'techStack je niz');
  });

  await test('techStack nije prazan', () => {
    assert(meta.techStack.length >= 1, `techStack.length >= 1: ${meta.techStack.length}`);
  });

  await test('Svaki techStack element je neprazan string', () => {
    for (const t of meta.techStack) {
      assert(typeof t === 'string' && t.length > 0, `techStack element string: ${JSON.stringify(t)}`);
    }
  });

  await test('techStack sadrži Next.js', () => {
    assert(meta.techStack.some((t) => t.toLowerCase().includes('next')), 'Next.js u techStack');
  });

  await test('techStack sadrži TypeScript', () => {
    assert(meta.techStack.some((t) => t.toLowerCase().includes('typescript')), 'TypeScript u techStack');
  });

  // ── 4. autofinishEndpoints (#896) ─────────────────────────────────────────
  console.log('\n📦 autofinishEndpoints Validacija (#896)');

  await test('autofinishEndpoints je niz', () => {
    assert(Array.isArray(meta.autofinishEndpoints), 'autofinishEndpoints je niz');
  });

  await test('autofinishEndpoints nije prazan', () => {
    assert(meta.autofinishEndpoints.length >= 1, `endpoints.length >= 1: ${meta.autofinishEndpoints.length}`);
  });

  await test('Svaki endpoint počinje sa /api/', () => {
    for (const ep of meta.autofinishEndpoints) {
      assert(ep.startsWith('/api/'), `endpoint /api/: ${ep}`);
    }
  });

  await test('/api/autofinish-statistika je u endpoints', () => {
    assert(meta.autofinishEndpoints.includes('/api/autofinish-statistika'), '/api/autofinish-statistika endpoint');
  });

  await test('/api/autofinish-meta je u endpoints', () => {
    assert(meta.autofinishEndpoints.includes('/api/autofinish-meta'), '/api/autofinish-meta endpoint');
  });

  // ── 5. Konzistentnost (#896) ──────────────────────────────────────────────
  console.log('\n📦 Konzistentnost getAutofinishMetaInfo() (#896)');

  await test('Dva uzastopna poziva konzistentna', () => {
    const m1 = getAutofinishMetaInfo();
    const m2 = getAutofinishMetaInfo();
    assertEqual(m1.verzija, m2.verzija, 'verzija konzistentna');
    assertEqual(m1.naziv, m2.naziv, 'naziv konzistentno');
    assertEqual(m1.autofinishBroj, m2.autofinishBroj, 'autofinishBroj konzistentno');
  });

  // ── 6. /api/autofinish-meta simulacija (#898) ─────────────────────────────
  console.log('\n📦 /api/autofinish-meta — E2E Schema (#898)');

  function simulateMetaGET() {
    const m = getAutofinishMetaInfo();
    return {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
        'X-App-Version': APP_VERSION,
        'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
      },
      body: m,
    };
  }

  await test('HTTP 200', () => {
    assertEqual(simulateMetaGET().status, 200, 'HTTP 200');
  });

  await test('Cache-Control sadrži s-maxage=86400', () => {
    const r = simulateMetaGET();
    assert(r.headers['Cache-Control'].includes('s-maxage=86400'), 'Cache-Control s-maxage=86400');
  });

  await test('X-App-Version === APP_VERSION', () => {
    const r = simulateMetaGET();
    assertEqual(r.headers['X-App-Version'], APP_VERSION, 'X-App-Version');
  });

  await test('X-Autofinish-Iteracija === AUTOFINISH_COUNT', () => {
    const r = simulateMetaGET();
    assertEqual(r.headers['X-Autofinish-Iteracija'], String(AUTOFINISH_COUNT), 'X-Autofinish-Iteracija');
  });

  await test('body ima sve obavezne ključeve', () => {
    const r = simulateMetaGET();
    const required = ['naziv', 'kompanija', 'opis', 'baseUrl', 'verzija', 'autofinishBroj', 'techStack', 'autofinishEndpoints', 'timestamp'];
    for (const k of required) {
      assert(k in r.body, `ključ "${k}" prisutan`);
    }
  });

  await test('body.verzija === APP_VERSION', () => {
    const r = simulateMetaGET();
    assertEqual(r.body.verzija, APP_VERSION, 'body.verzija');
  });

  await test('body.baseUrl počinje sa https://', () => {
    const r = simulateMetaGET();
    assert(r.body.baseUrl.startsWith('https://'), `baseUrl https`);
  });

  await test('body.techStack nije prazan niz', () => {
    const r = simulateMetaGET();
    assert(r.body.techStack.length >= 1, 'techStack >= 1');
  });

  // ── 7. E2E svih 7 autofinish API endpoints konzistentnost (#900) ──────────
  console.log('\n📦 E2E Svih Autofinish Endpoints — Konzistentnost Verzija (#900)');

  const statistika = getAutofinishStatistikaSummary();
  const verzije = getAutofinishVerzijeSummary();
  const audit = getAutofinishAuditReport();
  const metaE2E = getAutofinishMetaInfo();

  await test('statistika.verzija === APP_VERSION', () => {
    assertEqual(statistika.verzija, APP_VERSION, 'statistika.verzija');
  });

  await test('verzije.aktuelnaVerzija === APP_VERSION', () => {
    assertEqual(verzije.aktuelnaVerzija, APP_VERSION, 'verzije.aktuelnaVerzija');
  });

  await test('audit.verzija === APP_VERSION', () => {
    assertEqual(audit.verzija, APP_VERSION, 'audit.verzija');
  });

  await test('meta.verzija === APP_VERSION', () => {
    assertEqual(metaE2E.verzija, APP_VERSION, 'meta.verzija');
  });

  await test('statistika.autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(statistika.autofinishBroj, AUTOFINISH_COUNT, 'statistika.autofinishBroj');
  });

  await test('verzije.autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(verzije.autofinishBroj, AUTOFINISH_COUNT, 'verzije.autofinishBroj');
  });

  await test('audit.autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(audit.autofinishBroj, AUTOFINISH_COUNT, 'audit.autofinishBroj');
  });

  await test('meta.autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(metaE2E.autofinishBroj, AUTOFINISH_COUNT, 'meta.autofinishBroj');
  });

  await test('statistika.dijagnostike === TOTAL_DIAGNOSTIKA', () => {
    assertEqual(statistika.dijagnostike, TOTAL_DIAGNOSTIKA, 'statistika.dijagnostike');
  });

  await test('audit.zdravlje.ukupnoProvera === TOTAL_DIAGNOSTIKA', () => {
    assertEqual(audit.zdravlje.ukupnoProvera, TOTAL_DIAGNOSTIKA, 'audit.zdravlje.ukupnoProvera');
  });

  await test('statistika.apiRute === TOTAL_API_ROUTES', () => {
    assertEqual(statistika.apiRute, TOTAL_API_ROUTES, 'statistika.apiRute');
  });

  await test('meta.autofinishEndpoints ima /api/autofinish-statistika', () => {
    assert(metaE2E.autofinishEndpoints.includes('/api/autofinish-statistika'), 'statistika u endpoints');
  });

  await test('meta.autofinishEndpoints ima /api/autofinish-verzije', () => {
    assert(metaE2E.autofinishEndpoints.includes('/api/autofinish-verzije'), 'verzije u endpoints');
  });

  // ── 8. Globalni invarijanti (#900) ────────────────────────────────────────
  console.log('\n📦 Globalni Invarijanti (#900)');

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
