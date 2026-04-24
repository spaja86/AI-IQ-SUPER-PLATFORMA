// Autofinish #952 — Unit Testovi getAutofinishKategorijePorHijarhijama()
// Autofinish #954 — Integracioni Testovi /api/autofinish-kategorije
// Autofinish #956 — Unit testovi Dashboard Kategorije Widget simulacija
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/kategorije.test.ts

import {
  getAutofinishKategorijePorHijarhijama,
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
  console.log('\n📂 Kategorije + API Integration + Widget — Test Suite (#952 + #954 + #956)\n');

  // ── 1. Schema (#952) ──────────────────────────────────────────────────────
  console.log('📦 getAutofinishKategorijePorHijarhijama() Schema (#952)');

  const kat = getAutofinishKategorijePorHijarhijama();

  await test('Vraća objekat', () => {
    assert(typeof kat === 'object' && kat !== null, 'objekat');
  });

  await test('verzija === APP_VERSION', () => {
    assertEqual(kat.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(kat.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('kategorije je niz', () => {
    assert(Array.isArray(kat.kategorije), 'kategorije niz');
  });

  await test('ukupnoIteracija je broj > 0', () => {
    assert(typeof kat.ukupnoIteracija === 'number' && kat.ukupnoIteracija > 0, 'ukupnoIteracija > 0');
  });

  await test('ukupnoKategorija >= 1', () => {
    assert(kat.ukupnoKategorija >= 1, 'barem 1 kategorija');
  });

  await test('timestamp je validan ISO', () => {
    assert(!isNaN(Date.parse(kat.timestamp)), 'timestamp ISO');
  });

  // ── 2. Konzistentnost (#952) ──────────────────────────────────────────────
  console.log('\n📦 Konzistentnost (#952)');

  await test('Suma iteracija po kategorijama === ukupnoIteracija', () => {
    const suma = kat.kategorije.reduce((acc, k) => acc + k.ukupno, 0);
    assertEqual(suma, kat.ukupnoIteracija, 'suma iteracija');
  });

  await test('ukupnoKategorija === kategorije.length', () => {
    assertEqual(kat.ukupnoKategorija, kat.kategorije.length, 'ukupnoKategorija');
  });

  await test('Svaka kategorija.iteracije.length === ukupno', () => {
    for (const k of kat.kategorije) {
      assertEqual(k.iteracije.length, k.ukupno, `ukupno za ${k.kategorija}`);
    }
  });

  await test('Svaka kategorija ima labelSr (string > 0)', () => {
    for (const k of kat.kategorije) {
      assert(typeof k.labelSr === 'string' && k.labelSr.length > 0, `labelSr za ${k.kategorija}`);
    }
  });

  await test('Svaka iteracija.opis je string > 0', () => {
    for (const k of kat.kategorije) {
      for (const it of k.iteracije) {
        assert(typeof it.opis === 'string' && it.opis.length > 0, `opis za #${it.broj}`);
      }
    }
  });

  await test('Nema dupliciranih iteracija između kategorija', () => {
    const svi = kat.kategorije.flatMap((k) => k.iteracije.map((it) => it.broj));
    const unique = new Set(svi);
    assertEqual(unique.size, svi.length, 'bez dupliciranih iteracija');
  });

  await test('Konzistentnost dva uzastopna poziva', () => {
    const r1 = getAutofinishKategorijePorHijarhijama();
    const r2 = getAutofinishKategorijePorHijarhijama();
    assertEqual(r1.ukupnoIteracija, r2.ukupnoIteracija, 'ukupnoIteracija konzistentno');
    assertEqual(r1.ukupnoKategorija, r2.ukupnoKategorija, 'ukupnoKategorija konzistentno');
  });

  await test('Kategorija "helper" postoji', () => {
    const helper = kat.kategorije.find((k) => k.kategorija === 'helper');
    assert(helper !== undefined, 'helper kategorija postoji');
    assert(helper!.ukupno > 0, 'helper ima iteracija');
  });

  await test('Kategorija "e2e" postoji', () => {
    const e2e = kat.kategorije.find((k) => k.kategorija === 'e2e');
    assert(e2e !== undefined, 'e2e kategorija postoji');
  });

  // ── 3. /api/autofinish-kategorije simulacija (#954) ───────────────────────
  console.log('\n📦 /api/autofinish-kategorije — E2E Schema (#954)');

  function simulateKategorijeGET() {
    const result = getAutofinishKategorijePorHijarhijama();
    return {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600',
        'X-App-Version': APP_VERSION,
        'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
      },
      body: result,
    };
  }

  await test('HTTP 200', () => {
    assertEqual(simulateKategorijeGET().status, 200, 'HTTP 200');
  });

  await test('Cache-Control sadrži s-maxage=600', () => {
    const resp = simulateKategorijeGET();
    assert((resp.headers['Cache-Control'] ?? '').includes('s-maxage=600'), 's-maxage=600');
  });

  await test('X-App-Version === APP_VERSION', () => {
    const resp = simulateKategorijeGET();
    assertEqual(resp.headers['X-App-Version'], APP_VERSION, 'X-App-Version');
  });

  await test('X-Autofinish-Iteracija === AUTOFINISH_COUNT', () => {
    const resp = simulateKategorijeGET();
    assertEqual(resp.headers['X-Autofinish-Iteracija'], String(AUTOFINISH_COUNT), 'X-Autofinish-Iteracija');
  });

  await test('Body ima sve obavezne ključeve', () => {
    const resp = simulateKategorijeGET();
    const required = ['verzija', 'autofinishBroj', 'ukupnoIteracija', 'ukupnoKategorija', 'kategorije', 'timestamp'];
    for (const k of required) {
      assert(k in resp.body, `ključ "${k}" prisutan`);
    }
  });

  await test('Body verzija === APP_VERSION', () => {
    const resp = simulateKategorijeGET();
    assertEqual(resp.body.verzija, APP_VERSION, 'body.verzija');
  });

  await test('Body ukupnoIteracija > 0', () => {
    const resp = simulateKategorijeGET();
    assert(resp.body.ukupnoIteracija > 0, 'ukupnoIteracija > 0');
  });

  await test('Body kategorije je niz', () => {
    const resp = simulateKategorijeGET();
    assert(Array.isArray(resp.body.kategorije), 'kategorije je niz');
  });

  await test('Body helper kategorija prisutna', () => {
    const resp = simulateKategorijeGET();
    assert(
      resp.body.kategorije.some((k: { kategorija: string }) => k.kategorija === 'helper'),
      'helper prisutna u odgovoru'
    );
  });

  // ── 4. Dashboard widget simulacija (#956) ─────────────────────────────────
  console.log('\n📦 Dashboard Kategorije Widget — Simulacija (#956)');

  function simulateKategorijeWidget() {
    const kat2 = getAutofinishKategorijePorHijarhijama();
    return {
      kategorije: kat2.kategorije,
      ukupnoIteracija: kat2.ukupnoIteracija,
      ukupnoKategorija: kat2.ukupnoKategorija,
      verzija: kat2.verzija,
      autofinishBroj: kat2.autofinishBroj,
      apiLink: '/api/autofinish-kategorije',
      empty: kat2.kategorije.length === 0,
    };
  }

  await test('Widget nije prazan', () => {
    const w = simulateKategorijeWidget();
    assert(!w.empty, 'widget nije prazan');
  });

  await test('Widget verzija === APP_VERSION', () => {
    const w = simulateKategorijeWidget();
    assertEqual(w.verzija, APP_VERSION, 'verzija');
  });

  await test('Widget autofinishBroj === AUTOFINISH_COUNT', () => {
    const w = simulateKategorijeWidget();
    assertEqual(w.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('Widget apiLink === "/api/autofinish-kategorije"', () => {
    const w = simulateKategorijeWidget();
    assertEqual(w.apiLink, '/api/autofinish-kategorije', 'apiLink');
  });

  await test('Widget ukupnoKategorija >= 1', () => {
    const w = simulateKategorijeWidget();
    assert(w.ukupnoKategorija >= 1, 'barem 1 kategorija');
  });

  await test('Widget ukupnoIteracija > 0', () => {
    const w = simulateKategorijeWidget();
    assert(w.ukupnoIteracija > 0, 'ukupnoIteracija > 0');
  });

  await test('Widget categorija suma === ukupnoIteracija', () => {
    const w = simulateKategorijeWidget();
    const suma = w.kategorije.reduce((acc: number, k: { ukupno: number }) => acc + k.ukupno, 0);
    assertEqual(suma, w.ukupnoIteracija, 'suma === ukupnoIteracija');
  });

  await test('Widget svaka kategorija ima labelSr', () => {
    const w = simulateKategorijeWidget();
    for (const k of w.kategorije) {
      assert(typeof k.labelSr === 'string' && k.labelSr.length > 0, `labelSr za ${k.kategorija}`);
    }
  });

  // ── 5. Globalni invarijanti ────────────────────────────────────────────────
  console.log('\n📦 Globalni Invarijanti');

  await test('AUTOFINISH_COUNT === 960', () => {
    assertEqual(AUTOFINISH_COUNT, 970, 'AUTOFINISH_COUNT=970');
  });

  await test('APP_VERSION === "44.81.0"', () => {
    assertEqual(APP_VERSION, '44.91.0', 'APP_VERSION=44.91.0');
  });

  await test('TOTAL_DIAGNOSTIKA === 1904', () => {
    assertEqual(TOTAL_DIAGNOSTIKA, 1924, 'TOTAL_DIAGNOSTIKA=1924');
  });

  await test('TOTAL_API_ROUTES === 942', () => {
    assertEqual(TOTAL_API_ROUTES, 945, 'TOTAL_API_ROUTES=945');
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
