// Autofinish #962 — Unit Testovi getAutofinishKategorijaDetalji()
// Autofinish #964 — Integracioni Testovi /api/autofinish-kategorija-detalji
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/kategorija-detalji.test.ts

import {
  getAutofinishKategorijaDetalji,
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
  console.log('\n🔍 Kategorija Detalji + API Integration — Test Suite (#962 + #964)\n');

  // ── 0. Prep: find valid categories ────────────────────────────────────────
  const sve = getAutofinishKategorijePorHijarhijama();
  const validneKategorije = sve.kategorije.map((k) => k.kategorija);
  assert(validneKategorije.length > 0, 'ima kategorija');

  const testKat = validneKategorije[0];

  // ── 1. Schema (#962) ──────────────────────────────────────────────────────
  console.log('📦 getAutofinishKategorijaDetalji() Schema (#962)');

  const detalji = getAutofinishKategorijaDetalji(testKat);

  await test('Ne vraća null za validnu kategoriju', () => {
    assert(detalji !== null, `null za ${testKat}`);
  });

  await test('verzija === APP_VERSION', () => {
    assertEqual(detalji!.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(detalji!.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('kategorija je string', () => {
    assert(typeof detalji!.kategorija === 'string', 'kategorija string');
  });

  await test('labelSr je string > 0', () => {
    assert(typeof detalji!.labelSr === 'string' && detalji!.labelSr.length > 0, 'labelSr');
  });

  await test('ukupno > 0', () => {
    assert(detalji!.ukupno > 0, 'ukupno > 0');
  });

  await test('udjel >= 0 && udjel <= 100', () => {
    assert(detalji!.udjel >= 0 && detalji!.udjel <= 100, 'udjel [0–100]');
  });

  await test('prvaIteracija <= posljednjaIteracija', () => {
    assert(detalji!.prvaIteracija <= detalji!.posljednjaIteracija, 'prvaIteracija <= posljednjaIteracija');
  });

  await test('iteracije.length === ukupno', () => {
    assertEqual(detalji!.iteracije.length, detalji!.ukupno, 'iteracije.length === ukupno');
  });

  await test('timestamp je validan ISO', () => {
    assert(!isNaN(Date.parse(detalji!.timestamp)), 'timestamp ISO');
  });

  // ── 2. Konzistentnost (#962) ──────────────────────────────────────────────
  console.log('\n📦 Konzistentnost (#962)');

  await test('kategorija === tražena kategorija', () => {
    assertEqual(detalji!.kategorija, testKat, 'kategorija === testKat');
  });

  await test('prvaIteracija === iteracije[0].broj', () => {
    assertEqual(detalji!.prvaIteracija, detalji!.iteracije[0].broj, 'prvaIteracija');
  });

  await test('posljednjaIteracija === iteracije[last].broj', () => {
    const last = detalji!.iteracije[detalji!.iteracije.length - 1].broj;
    assertEqual(detalji!.posljednjaIteracija, last, 'posljednjaIteracija');
  });

  await test('Svaka iteracija.opis je string > 0', () => {
    for (const it of detalji!.iteracije) {
      assert(typeof it.opis === 'string' && it.opis.length > 0, `opis za #${it.broj}`);
    }
  });

  await test('Konzistentnost dva uzastopna poziva', () => {
    const r1 = getAutofinishKategorijaDetalji(testKat);
    const r2 = getAutofinishKategorijaDetalji(testKat);
    assertEqual(r1!.ukupno, r2!.ukupno, 'ukupno konzistentno');
    assertEqual(r1!.verzija, r2!.verzija, 'verzija konzistentno');
  });

  await test('Udjel konzistentan sa ukupnoIteracija', () => {
    const udjel2 = Math.round((detalji!.ukupno / sve.ukupnoIteracija) * 100 * 10) / 10;
    assertEqual(detalji!.udjel, udjel2, 'udjel konzistentan');
  });

  // ── 3. Sve validne kategorije (#962) ──────────────────────────────────────
  console.log('\n📦 Sve validne kategorije (#962)');

  for (const kat of validneKategorije) {
    await test(`Detalji za "${kat}" nisu null`, () => {
      const d = getAutofinishKategorijaDetalji(kat);
      assert(d !== null, `${kat} nije null`);
    });

    await test(`Detalji za "${kat}" imaju točnu kategoriju`, () => {
      const d = getAutofinishKategorijaDetalji(kat)!;
      assertEqual(d.kategorija, kat, `kategorija za ${kat}`);
    });
  }

  // ── 4. Edge cases (#962) ──────────────────────────────────────────────────
  console.log('\n📦 Edge Cases (#962)');

  await test('Vraća null za nepostojeću kategoriju "nepostoji"', () => {
    const r = getAutofinishKategorijaDetalji('nepostoji');
    assert(r === null, 'null za nepostojeću kategoriju');
  });

  await test('Vraća null za prazni string', () => {
    const r = getAutofinishKategorijaDetalji('');
    assert(r === null, 'null za prazni string');
  });

  await test('Vraća null za undefined kao string', () => {
    const r = getAutofinishKategorijaDetalji('undefined');
    assert(r === null, 'null za "undefined"');
  });

  // ── 5. /api/autofinish-kategorija-detalji simulacija (#964) ───────────────
  console.log('\n📦 /api/autofinish-kategorija-detalji — E2E Schema (#964)');

  const VALIDNE_KATEGORIJE = [
    'helper', 'unit-test', 'api-route', 'integration-test',
    'dashboard-widget', 'widget-unit-test', 'e2e', 'ostalo',
  ];

  function simulateDetaljiGET(params: Record<string, string>) {
    const kategorija = params.kategorija ?? '';

    if (!kategorija) {
      return { status: 400, body: { error: 'INVALID_PARAMS' }, headers: { 'X-App-Version': APP_VERSION } };
    }

    if (!VALIDNE_KATEGORIJE.includes(kategorija)) {
      return { status: 400, body: { error: 'INVALID_PARAMS' }, headers: { 'X-App-Version': APP_VERSION } };
    }

    const result = getAutofinishKategorijaDetalji(kategorija);
    if (!result) {
      return { status: 404, body: { error: 'NOT_FOUND' }, headers: { 'X-App-Version': APP_VERSION } };
    }

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

  await test(`HTTP 200 za kategorija=${testKat}`, () => {
    assertEqual(simulateDetaljiGET({ kategorija: testKat }).status, 200, 'HTTP 200');
  });

  await test('Cache-Control sadrži s-maxage=600', () => {
    const resp = simulateDetaljiGET({ kategorija: testKat });
    assert((resp.headers['Cache-Control'] ?? '').includes('s-maxage=600'), 's-maxage=600');
  });

  await test('X-App-Version === APP_VERSION', () => {
    const resp = simulateDetaljiGET({ kategorija: testKat });
    assertEqual(resp.headers['X-App-Version'], APP_VERSION, 'X-App-Version');
  });

  await test('HTTP 400 bez parametara', () => {
    assertEqual(simulateDetaljiGET({}).status, 400, 'HTTP 400 bez params');
  });

  await test('HTTP 400 za nepoznatu kategoriju', () => {
    assertEqual(simulateDetaljiGET({ kategorija: 'nepoznata' }).status, 400, 'HTTP 400 nepoznata');
  });

  await test('Body ima sve obavezne ključeve', () => {
    const resp = simulateDetaljiGET({ kategorija: testKat });
    const required = ['verzija', 'autofinishBroj', 'kategorija', 'labelSr', 'ukupno', 'udjel', 'prvaIteracija', 'posljednjaIteracija', 'iteracije', 'timestamp'];
    for (const k of required) {
      assert(k in resp.body, `ključ "${k}" prisutan`);
    }
  });

  await test('Body verzija === APP_VERSION', () => {
    const resp = simulateDetaljiGET({ kategorija: testKat });
    assertEqual((resp.body as { verzija: string }).verzija, APP_VERSION, 'body.verzija');
  });

  await test('HTTP 200 za sve validne kategorije', () => {
    for (const k of validneKategorije) {
      const s = simulateDetaljiGET({ kategorija: k }).status;
      assert(s === 200, `${k}: HTTP 200 (got ${s})`);
    }
  });

  // ── 6. Globalni invarijanti ────────────────────────────────────────────────
  console.log('\n📦 Globalni Invarijanti');

  await test('AUTOFINISH_COUNT === 970', () => {
    assertEqual(AUTOFINISH_COUNT, 970, 'AUTOFINISH_COUNT=970');
  });

  await test('APP_VERSION === "44.91.0"', () => {
    assertEqual(APP_VERSION, '44.91.0', 'APP_VERSION=44.91.0');
  });

  await test('TOTAL_DIAGNOSTIKA === 1924', () => {
    assertEqual(TOTAL_DIAGNOSTIKA, 1924, 'TOTAL_DIAGNOSTIKA=1924');
  });

  await test('TOTAL_API_ROUTES === 945', () => {
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
