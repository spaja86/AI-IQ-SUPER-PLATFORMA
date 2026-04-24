// Autofinish #830 — Integracioni Test za /api/autofinish-petlja rutu
// Kompanija SPAJA — Digitalna Industrija
//
// Testovi pokrivaju:
//   1. Validan JSON oblik
//   2. status === 'zavrsena'
//   3. Prisustvo 9 podsistema
//   4. ekosistem polja
//   5. verzija i autofinish polja
//   6. napomena polje
//
// Ovi testovi koriste lib funkcije direktno (bez HTTP poziva) jer je
// aplikacija statički kompajlirana i nem odgovor od servera bez `next start`.
//
// Pokretanje: npx tsx src/tests/autofinish/autofinish-petlja-integration.test.ts

import { pokreniAutofinishPetlju } from '../../lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT, TOTAL_ROUTES, TOTAL_API_ROUTES, TOTAL_DIAGNOSTIKA } from '../../lib/constants';

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

function assertDefined<T>(value: T | null | undefined, label?: string): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(`${label ?? 'assertDefined'}: vrednost je ${String(value)}`);
  }
}

// ─── Simulacija /api/autofinish-petlja odgovora ───────────────────────────────

function buildRouteResponse() {
  const izvestaj = pokreniAutofinishPetlju();
  return {
    ...izvestaj,
    napomena: izvestaj.status === 'zavrsena'
      ? 'Svi podsistemi OMEGA PROJEKTA su na 100%. Autofinish petlja zavrsena.'
      : 'Autofinish petlja ce nastaviti ponavljanje dok svi podsistemi ne budu na 100%.',
  };
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

async function runTests(): Promise<void> {
  console.log('\n🔗 /api/autofinish-petlja — Integracioni Test Suite\n');

  const response = buildRouteResponse();

  // ── 1. Validan JSON oblik ──────────────────────────────────────────────────
  console.log('📋 JSON struktura odgovora');

  await test('odgovor je objekat', () => {
    assert(typeof response === 'object' && response !== null, 'odgovor mora biti objekat');
  });

  await test('JSON.stringify/parse roundtrip je bezgubitni', () => {
    const roundtrip = JSON.parse(JSON.stringify(response));
    assertEqual(roundtrip.status, response.status, 'status posle roundtrip');
    assertEqual(roundtrip.verzija, response.verzija, 'verzija posle roundtrip');
  });

  // ── 2. status === 'zavrsena' ───────────────────────────────────────────────
  console.log('\n📋 Status odgovora');

  await test('status je \'zavrsena\'', () => {
    assertEqual(response.status, 'zavrsena', 'status');
  });

  await test('napomena postoji i nije prazna', () => {
    assert(typeof response.napomena === 'string' && response.napomena.length > 0, 'napomena mora biti neprazan string');
  });

  await test('napomena sadrži \'zavrsena\' kad je status zavrsena', () => {
    assert(
      response.napomena.toLowerCase().includes('zavrsena') || response.napomena.toLowerCase().includes('100%'),
      'napomena mora pomenuti završenost'
    );
  });

  // ── 3. Podsistemi ─────────────────────────────────────────────────────────
  console.log('\n📋 Podsistemi');

  await test('podsistemi niz postoji', () => {
    assert(Array.isArray(response.podsistemi), 'podsistemi mora biti niz');
  });

  await test('ima tačno 9 podsistema', () => {
    assertEqual(response.podsistemi.length, 9, 'broj podsistema');
  });

  await test('ukupnoPodsistema = 9', () => {
    assertEqual(response.ukupnoPodsistema, 9, 'ukupnoPodsistema');
  });

  await test('podsistemiNa100 = 9', () => {
    assertEqual(response.podsistemiNa100, 9, 'podsistemiNa100');
  });

  const ocekivaniPodsistemi = [
    'plasiranje', 'zvanicno-otvaranje', 'operativni-centar',
    'omega-ai-sistem', 'oktavni-monolog', 'spajapro-endžin',
    'ekosistem', 'dijagnostika', 'autofinish-motor',
  ];

  await test('svih 9 podsistema ima progres=100', () => {
    for (const p of response.podsistemi) {
      assertEqual(p.progres, 100, `${p.id}.progres`);
    }
  });

  await test('svih 9 podsistema ima status=ok', () => {
    for (const p of response.podsistemi) {
      assertEqual(p.status, 'ok', `${p.id}.status`);
    }
  });

  await test('svaki podsistem ima id, naziv, ikona, poruka', () => {
    for (const p of response.podsistemi) {
      assertDefined(p.id, `podsistem.id`);
      assertDefined(p.naziv, `podsistem.naziv`);
      assertDefined(p.ikona, `podsistem.ikona`);
      assertDefined(p.poruka, `podsistem.poruka`);
    }
  });

  // ── 4. Ekosistem polja ────────────────────────────────────────────────────
  console.log('\n📋 Ekosistem polja');

  await test('ekosistem postoji', () => {
    assertDefined(response.ekosistem, 'ekosistem');
  });

  await test('ekosistem.rute odgovara TOTAL_ROUTES', () => {
    assertEqual(response.ekosistem.rute, TOTAL_ROUTES, 'ekosistem.rute');
  });

  await test('ekosistem.apiRute odgovara TOTAL_API_ROUTES', () => {
    assertEqual(response.ekosistem.apiRute, TOTAL_API_ROUTES, 'ekosistem.apiRute');
  });

  await test('ekosistem.dijagnostike odgovara TOTAL_DIAGNOSTIKA', () => {
    assertEqual(response.ekosistem.dijagnostike, TOTAL_DIAGNOSTIKA, 'ekosistem.dijagnostike');
  });

  // ── 5. Verzija i autofinish polja ─────────────────────────────────────────
  console.log('\n📋 Verzija i autofinish polja');

  await test('verzija odgovara APP_VERSION', () => {
    assertEqual(response.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinish.iteracija odgovara AUTOFINISH_COUNT', () => {
    assertEqual(response.autofinish.iteracija, AUTOFINISH_COUNT, 'autofinish.iteracija');
  });

  await test('autofinish.ciljFormatiran je string', () => {
    assert(typeof response.autofinish.ciljFormatiran === 'string', 'autofinish.ciljFormatiran mora biti string');
  });

  await test('timestamp je ISO 8601 format', () => {
    assert(typeof response.timestamp === 'string' && response.timestamp.includes('T'), 'timestamp mora biti ISO 8601');
  });

  await test('ukupniProgres je 100', () => {
    assertEqual(response.ukupniProgres, 100, 'ukupniProgres');
  });

  await test('ciljProgres je 100', () => {
    assertEqual(response.ciljProgres, 100, 'ciljProgres');
  });

  // ── 6. Iteracije ──────────────────────────────────────────────────────────
  console.log('\n📋 Iteracije');

  await test('iteracije niz postoji i nije prazan', () => {
    assert(Array.isArray(response.iteracije) && response.iteracije.length > 0, 'iteracije mora biti neprazan niz');
  });

  await test('poslednja iteracija ima ukupniProgres=100', () => {
    const zadnja = response.iteracije[response.iteracije.length - 1];
    assertDefined(zadnja, 'zadnja iteracija mora postojati');
    assertEqual(zadnja.ukupniProgres, 100, 'zadnja.ukupniProgres');
  });
}

// ─── Pokretanje testova ────────────────────────────────────────────────────────

runTests().then(() => {
  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo\n`);
  if (failures.length > 0) {
    console.error('Neuspeli testovi:');
    failures.forEach((f) => console.error(`  - ${f}`));
  }
  if (failed > 0) process.exit(1);
}).catch((e) => {
  console.error('Kritična greška u test suiteu:', e);
  process.exit(1);
});
