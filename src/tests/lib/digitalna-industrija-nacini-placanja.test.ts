// Testovi za kanonski izvor načina plaćanja — Digitalna Industrija
// Pokretanje: npx tsx src/tests/lib/digitalna-industrija-nacini-placanja.test.ts

import {
  getDigitalnaIndustrijaMatrix,
  getDigitalnaIndustrijaNacinPlacanjaPregled,
  validirajNacinPlacanja,
} from '../../lib/digitalna-industrija-nacini-placanja';
import { getWalletCoverageMatrix, routePayment } from '../../lib/wallet/payment-orchestration';

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    console.error(`  ❌ ${name}`);
    console.error(`     ${e instanceof Error ? e.message : String(e)}`);
    failed++;
  }
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function run() {
  console.log('\n🏭 Digitalna Industrija — Načini Plaćanja Test Suite\n');

  // ── getDigitalnaIndustrijaMatrix ────────────────────────────────────────────

  await test('getDigitalnaIndustrijaMatrix vraća neprazan niz', () => {
    const matrix = getDigitalnaIndustrijaMatrix();
    assert(matrix.length > 0, 'Matrica mora imati bar jednu stavku');
  });

  await test('getDigitalnaIndustrijaMatrix sadrži RS region', () => {
    const matrix = getDigitalnaIndustrijaMatrix();
    const rs = matrix.find((e) => e.region === 'RS');
    assert(rs !== undefined, 'RS region mora biti prisutan');
    assert(rs.currencies.includes('RSD'), 'RS mora podržavati RSD');
    assert(rs.currencies.includes('EUR'), 'RS mora podržavati EUR');
  });

  await test('getDigitalnaIndustrijaMatrix sadrži EU, US i GLOBAL region', () => {
    const matrix = getDigitalnaIndustrijaMatrix();
    const regioni = matrix.map((e) => e.region);
    assert(regioni.includes('EU'), 'EU region mora biti prisutan');
    assert(regioni.includes('US'), 'US region mora biti prisutan');
    assert(regioni.includes('GLOBAL'), 'GLOBAL region mora biti prisutan');
  });

  await test('getDigitalnaIndustrijaMatrix — svaka stavka ima procesore i fallback', () => {
    const matrix = getDigitalnaIndustrijaMatrix();
    for (const entry of matrix) {
      assert(entry.processors.length > 0, `Region ${entry.region}: mora imati bar jedan procesor`);
      assert(entry.fallbackProcessors.length > 0, `Region ${entry.region}: mora imati bar jedan fallback procesor`);
    }
  });

  // ── validirajNacinPlacanja ─────────────────────────────────────────────────

  await test('validirajNacinPlacanja vraća prazan niz za validnu stavku', () => {
    const greske = validirajNacinPlacanja({
      region: 'RS',
      currencies: ['RSD', 'EUR'],
      cardNetworks: ['visa', 'mastercard'],
      processors: ['stripe'],
      fallbackProcessors: ['paypal'],
    });
    assert(greske.length === 0, 'Validna stavka ne sme imati greške');
  });

  await test('validirajNacinPlacanja prijavljuje grešku za prazne currencies', () => {
    const greske = validirajNacinPlacanja({
      region: 'RS',
      currencies: [],
      cardNetworks: ['visa'],
      processors: ['stripe'],
      fallbackProcessors: ['paypal'],
    });
    assert(greske.length > 0, 'Mora biti prijavljena greška za prazne currencies');
  });

  await test('validirajNacinPlacanja prijavljuje grešku za prazne processors', () => {
    const greske = validirajNacinPlacanja({
      region: 'EU',
      currencies: ['EUR'],
      cardNetworks: ['visa'],
      processors: [],
      fallbackProcessors: ['paypal'],
    });
    assert(greske.length > 0, 'Mora biti prijavljena greška za prazne processors');
  });

  await test('validirajNacinPlacanja prijavljuje grešku za prazne fallbackProcessors', () => {
    const greske = validirajNacinPlacanja({
      region: 'US',
      currencies: ['USD'],
      cardNetworks: ['visa'],
      processors: ['stripe'],
      fallbackProcessors: [],
    });
    assert(greske.length > 0, 'Mora biti prijavljena greška za prazne fallbackProcessors');
  });

  // ── getDigitalnaIndustrijaNacinPlacanjaPregled ──────────────────────────────

  await test('getDigitalnaIndustrijaNacinPlacanjaPregled ima ispravan izvor', () => {
    const pregled = getDigitalnaIndustrijaNacinPlacanjaPregled();
    assert(pregled.meta.izvor === 'digitalna-industrija', 'Izvor mora biti "digitalna-industrija"');
    assert(pregled.meta.entitet === 'Digitalna Industrija — Kompanija SPAJA', 'Entitet mora biti tačan');
  });

  await test('getDigitalnaIndustrijaNacinPlacanjaPregled ima pozitivne ukupne brojeve', () => {
    const pregled = getDigitalnaIndustrijaNacinPlacanjaPregled();
    assert(pregled.ukupnoRegiona > 0, 'ukupnoRegiona mora biti > 0');
    assert(pregled.ukupnoValuta > 0, 'ukupnoValuta mora biti > 0');
    assert(pregled.ukupnoKarticihnSema > 0, 'ukupnoKarticihnSema mora biti > 0');
  });

  await test('getDigitalnaIndustrijaNacinPlacanjaPregled — aktivniProcesori nije prazan', () => {
    const pregled = getDigitalnaIndustrijaNacinPlacanjaPregled();
    assert(pregled.meta.aktivniProcesori.length > 0, 'aktivniProcesori mora biti neprazan');
    assert(pregled.meta.aktivniProcesori.includes('stripe'), 'stripe mora biti u aktivnim procesorima');
  });

  // ── getWalletCoverageMatrix — izvor je DI ───────────────────────────────────

  await test('getWalletCoverageMatrix vraća isti sadržaj kao getDigitalnaIndustrijaMatrix', () => {
    const di = getDigitalnaIndustrijaMatrix();
    const wallet = getWalletCoverageMatrix();
    assert(wallet.length === di.length, 'Broj stavki mora biti jednak');
    for (let i = 0; i < di.length; i++) {
      assert(wallet[i]!.region === di[i]!.region, `Region na poziciji ${i} mora biti isti`);
    }
  });

  // ── routePayment — konzistentnost sa DI matricom ────────────────────────────

  await test('routePayment RS/RSD/visa vraća stripe kao primarni procesor', () => {
    const decision = routePayment({ region: 'RS', currency: 'RSD', cardNetwork: 'visa', amountMinor: 1_000 });
    assert(decision.primaryProcessor === 'stripe', `Očekivan stripe, dobijeno: ${decision.primaryProcessor}`);
  });

  await test('routePayment vraća fallback za nepodržanu valutu (RS/JPY)', () => {
    const decision = routePayment({ region: 'RS', currency: 'JPY', cardNetwork: 'visa', amountMinor: 1_000 });
    assert(decision.primaryProcessor === 'paypal', `Očekivan paypal fallback, dobijeno: ${decision.primaryProcessor}`);
  });

  await test('routePayment dodaje manual-review za visoke iznose', () => {
    const decision = routePayment({ region: 'EU', currency: 'EUR', cardNetwork: 'mastercard', amountMinor: 2_000_000 });
    assert(
      decision.fallbackProcessors.includes('manual-review'),
      'manual-review mora biti u fallback procesorima za visok iznos',
    );
  });

  await test('routePayment GLOBAL region je uvek prisutan kao fallback', () => {
    const decision = routePayment({ region: 'GLOBAL', currency: 'EUR', cardNetwork: 'visa', amountMinor: 100 });
    assert(decision.primaryProcessor === 'stripe', 'GLOBAL region mora koristiti stripe');
  });

  console.log(`\n✅ Passed: ${passed}  ❌ Failed: ${failed}`);
  if (failed > 0) process.exit(1);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
