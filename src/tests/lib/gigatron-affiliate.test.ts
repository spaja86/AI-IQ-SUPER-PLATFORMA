// GIGATRON Affiliate Tests — AI IQ SUPER PLATFORMA

import {
  trackAffiliateEvent,
  getAffiliateStat,
  getAffiliateEventi,
  registrujPartnera,
  izracunajMesecnuProviziju,
  DEFAULT_PROVIZIJA_PCT,
  MIN_ISPLATA_EUR,
} from '../../lib/gigatron/gigatron-affiliate';

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

function assertClose(a: number, b: number, tolerance: number, message: string): void {
  if (Math.abs(a - b) > tolerance) {
    throw new Error(`${message}: expected ~${b}, got ${a} (tolerance ${tolerance})`);
  }
}

const TEST_PARTNER_ID = 'partner-spaja-001';
const TEST_SKU = 'TEST-SKU-001';
const TEST_PROIZVOD_ID = 'test-proizvod-001';

async function runTests(): Promise<void> {
  console.log('\n🤝 GIGATRON Affiliate Test Suite\n');

  // ── Bazni partner ─────────────────────────────────────────────────────────

  await test('Demo partner postoji i aktivan je', () => {
    const stat = getAffiliateStat(TEST_PARTNER_ID);
    assert(stat !== null, 'Demo partner mora postojati');
    assert(stat!.partnerId === TEST_PARTNER_ID, 'ID mora da se poklapa');
  });

  await test('getAffiliateStat vraća null za nepostojeći partner', () => {
    const stat = getAffiliateStat('ne-postoji-XXX');
    assert(stat === null, 'mora da vrati null za nepostojeći partner');
  });

  // ── Klik tracking ─────────────────────────────────────────────────────────

  await test('Klik tracking se beleži sa nultom provizijom', () => {
    const rezultat = trackAffiliateEvent({
      partnerId: TEST_PARTNER_ID,
      tip: 'klik',
      proizvodId: TEST_PROIZVOD_ID,
      sku: TEST_SKU,
    });
    assert(rezultat.ok === true, 'Klik event mora biti praćen uspešno');
    assert(rezultat.event !== undefined, 'Event mora biti u rezultatu');
    assert(rezultat.event!.provizija === 0, 'Klik nema proviziju');
    assert(rezultat.event!.vrednostEUR === 0, 'Klik nema vrednost EUR');
    assert(rezultat.event!.tip === 'klik', 'Tip mora biti klik');
  });

  // ── Kupovina tracking i provizija ─────────────────────────────────────────

  await test('Kupovina tracking koristi default proviziju', () => {
    const vrednost = 1000;
    const ocekivanaProvizija = Math.round(vrednost * (DEFAULT_PROVIZIJA_PCT / 100) * 100) / 100;
    const rezultat = trackAffiliateEvent({
      partnerId: TEST_PARTNER_ID,
      tip: 'kupovina',
      proizvodId: TEST_PROIZVOD_ID,
      sku: TEST_SKU,
      vrednostEUR: vrednost,
    });
    assert(rezultat.ok === true, 'Kupovina mora biti praćena');
    assertClose(rezultat.event!.provizija, ocekivanaProvizija, 0.01, 'Provizija mora biti tačna');
    assert(rezultat.event!.vrednostEUR === vrednost, 'Vrednost EUR mora biti sačuvana');
  });

  await test('Kupovina tracking prihvata custom proviziju', () => {
    const vrednost = 500;
    const customPct = 5.0;
    const ocekivanaProvizija = Math.round(vrednost * (customPct / 100) * 100) / 100;
    const rezultat = trackAffiliateEvent({
      partnerId: TEST_PARTNER_ID,
      tip: 'kupovina',
      proizvodId: TEST_PROIZVOD_ID,
      sku: TEST_SKU,
      vrednostEUR: vrednost,
      provizijaPct: customPct,
    });
    assert(rezultat.ok === true, 'Kupovina mora biti praćena');
    assertClose(rezultat.event!.provizija, ocekivanaProvizija, 0.01, 'Custom provizija mora biti tačna');
  });

  await test('Kupovina sa nultom vrednosti daje nultu proviziju', () => {
    const rezultat = trackAffiliateEvent({
      partnerId: TEST_PARTNER_ID,
      tip: 'kupovina',
      proizvodId: TEST_PROIZVOD_ID,
      sku: TEST_SKU,
      vrednostEUR: 0,
    });
    assert(rezultat.ok === true, 'Event mora biti praćen');
    assert(rezultat.event!.provizija === 0, 'Nulta vrednost daje nultu proviziju');
  });

  // ── Validacija ────────────────────────────────────────────────────────────

  await test('Tracking odbija nepostojeći partner', () => {
    const rezultat = trackAffiliateEvent({
      partnerId: 'ne-postoji-partner',
      tip: 'klik',
      proizvodId: TEST_PROIZVOD_ID,
      sku: TEST_SKU,
    });
    assert(rezultat.ok === false, 'Mora odbiti nepostojeći partner');
    assert(rezultat.poruka !== undefined, 'Mora imati poruku greške');
  });

  await test('Tracking odbija prazan ID proizvoda', () => {
    const rezultat = trackAffiliateEvent({
      partnerId: TEST_PARTNER_ID,
      tip: 'klik',
      proizvodId: '',
      sku: TEST_SKU,
    });
    assert(rezultat.ok === false, 'Mora odbiti prazan ID proizvoda');
  });

  await test('Tracking odbija prazan SKU', () => {
    const rezultat = trackAffiliateEvent({
      partnerId: TEST_PARTNER_ID,
      tip: 'klik',
      proizvodId: TEST_PROIZVOD_ID,
      sku: '',
    });
    assert(rezultat.ok === false, 'Mora odbiti prazan SKU');
  });

  // ── Statistike ────────────────────────────────────────────────────────────

  await test('getAffiliateStat reflektuje praćene evente', () => {
    const noviPartnerId = 'partner-stat-test-001';
    registrujPartnera({
      id: noviPartnerId,
      naziv: 'Stat Test Partner',
      email: 'stat@test.com',
      baznaProvizijaPct: 4.0,
      aktivan: true,
    });

    trackAffiliateEvent({ partnerId: noviPartnerId, tip: 'klik', proizvodId: TEST_PROIZVOD_ID, sku: TEST_SKU });
    trackAffiliateEvent({ partnerId: noviPartnerId, tip: 'klik', proizvodId: TEST_PROIZVOD_ID, sku: TEST_SKU });
    trackAffiliateEvent({ partnerId: noviPartnerId, tip: 'kupovina', proizvodId: TEST_PROIZVOD_ID, sku: TEST_SKU, vrednostEUR: 200 });

    const stat = getAffiliateStat(noviPartnerId);
    assert(stat !== null, 'Stat mora postojati');
    assert(stat!.ukupnoKlikova === 2, `Mora biti 2 klika, pronađeno: ${stat!.ukupnoKlikova}`);
    assert(stat!.ukupnoKupovina === 1, `Mora biti 1 kupovina, pronađeno: ${stat!.ukupnoKupovina}`);
    assert(stat!.ukupnoVrednostEUR === 200, `Vrednost mora biti 200 EUR`);
    assertClose(stat!.ukupnoProvizija, 200 * 0.04, 0.01, 'Provizija mora biti 4% od 200 EUR');
    assertClose(stat!.konverzijskaStopa, 50, 0.01, 'Konverzijska stopa 1 kupovina / 2 klika = 50%');
  });

  await test('Kumulativna provizija se pravilno sabira', () => {
    const partId = 'partner-kumulativ-001';
    registrujPartnera({
      id: partId,
      naziv: 'Kumulativ Partner',
      email: 'kum@test.com',
      baznaProvizijaPct: 5.0,
      aktivan: true,
    });
    trackAffiliateEvent({ partnerId: partId, tip: 'kupovina', proizvodId: 'p1', sku: 'S1', vrednostEUR: 100 });
    trackAffiliateEvent({ partnerId: partId, tip: 'kupovina', proizvodId: 'p2', sku: 'S2', vrednostEUR: 200 });
    trackAffiliateEvent({ partnerId: partId, tip: 'kupovina', proizvodId: 'p3', sku: 'S3', vrednostEUR: 300 });

    const stat = getAffiliateStat(partId);
    assertClose(stat!.ukupnoVrednostEUR, 600, 0.01, 'Ukupna vrednost mora biti 600 EUR');
    assertClose(stat!.ukupnoProvizija, 30, 0.01, 'Ukupna provizija mora biti 5% od 600 = 30 EUR');
  });

  await test('getAffiliateEventi vraća evente za partnera', () => {
    const eventiSve = getAffiliateEventi(TEST_PARTNER_ID);
    assert(Array.isArray(eventiSve), 'mora da vrati niz');
    assert(eventiSve.every((e) => e.partnerId === TEST_PARTNER_ID), 'Svi eventi moraju biti od istog partnera');
  });

  await test('izracunajMesecnuProviziju funkcioniše za tekući period', () => {
    const partId = 'partner-mesecni-001';
    registrujPartnera({
      id: partId,
      naziv: 'Mesecni Partner',
      email: 'mes@test.com',
      baznaProvizijaPct: 3.0,
      aktivan: true,
    });
    trackAffiliateEvent({ partnerId: partId, tip: 'kupovina', proizvodId: 'pm1', sku: 'SM1', vrednostEUR: 1000 });

    const period = new Date().toISOString().slice(0, 7);
    const provizija = izracunajMesecnuProviziju(partId, period);
    assertClose(provizija, 1000 * 0.03, 0.01, `Mesečna provizija za period ${period}`);
  });

  await test('Minimum isplata konstanta je pozitivan broj', () => {
    assert(MIN_ISPLATA_EUR > 0, 'Minimalna isplata mora biti > 0 EUR');
  });

  console.log(`\nRezultat: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    console.error(failures.join('\n'));
    process.exitCode = 1;
  }
}

void runTests();
