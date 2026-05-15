// Autofinish #1256 — Unit Testovi buildMozakLogika()
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/mozak-logika.test.ts

import { glavniEndzinDigitalneIndustrije, getGlavniEndzinStatistika } from '../../lib/glavni-endzin-digitalne-industrije';
import { buildMozakLogika } from '../../lib/mozak-logika';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  TOTAL_API_ROUTES,
  TOTAL_ROUTES,
} from '../../lib/constants';

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
    throw new Error(
      `${label ?? 'assertEqual'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
    );
  }
}

async function runTests(): Promise<void> {
  console.log('\n🧠 MOZAK LOGIKA — Unit Test Suite (#1256)\n');

  const rezultat = buildMozakLogika('test-user-id', {
    glavniEndzinId: glavniEndzinDigitalneIndustrije.id,
    glavniEndzinNaziv: glavniEndzinDigitalneIndustrije.naziv,
    glavniEndzinVerzija: glavniEndzinDigitalneIndustrije.verzija,
    statistika: getGlavniEndzinStatistika(),
    spojeniEndzini: glavniEndzinDigitalneIndustrije.spojeniEndzini,
    evolucija: glavniEndzinDigitalneIndustrije.evolucija,
    mogucnosti: glavniEndzinDigitalneIndustrije.mogucnosti,
  });

  await test('status je validan', () => {
    assert(['aktivan', 'sinhronizacija', 'potrebna-potvrda'].includes(rezultat.status), `status: ${rezultat.status}`);
  });

  await test('operativni status radi non-stop', () => {
    assertEqual(rezultat.operativniStatus.radiNonStop, true, 'radi non-stop');
    assert(rezultat.operativniStatus.ciklusZdravlja > 0, 'ciklus zdravlja > 0');
  });

  await test('aktivni ciklusi su prisutni', () => {
    assert(rezultat.aktivniCiklusi.length >= 5, 'min 5 ciklusa');
  });

  await test('povezani sistemi su prisutni', () => {
    assert(rezultat.povezaniSistemi.length >= 5, 'min 5 povezanih sistema');
  });

  await test('generisane ideje su prisutne', () => {
    assert(rezultat.generisaneIdeje.length >= 4, 'min 4 ideje');
  });

  await test('projektni planovi su prisutni', () => {
    assert(rezultat.projektniPlanovi.length >= 3, 'min 3 plana');
  });

  await test('review queue sadrži sve klasifikacije', () => {
    const klasifikacije = new Set(rezultat.reviewQueue.map((stavka) => stavka.klasifikacija));
    assert(klasifikacije.has('auto-executable'), 'ima auto-executable');
    assert(klasifikacije.has('requires-confirmation'), 'ima requires-confirmation');
    assert(klasifikacije.has('blocked-unknown'), 'ima blocked-unknown');
    assert(klasifikacije.has('delegated-to-human'), 'ima delegated-to-human');
  });

  await test('povratni odaziv zbir odgovara review queue dužini', () => {
    const p = rezultat.povratniOdaziv;
    assertEqual(
      p.autoIzvrsivo + p.cekaPotvrdu + p.blokirano + p.delegirano,
      p.ukupnoStavki,
      'zbir povratnog odaziva',
    );
  });

  await test('summary je vezan za Glavni Endžin', () => {
    assertEqual(rezultat.mozakLogikaSummary.engineId, glavniEndzinDigitalneIndustrije.id, 'engineId');
    assert(rezultat.mozakLogikaSummary.objasnjenje.length > 0, 'objasnjenje');
  });

  await test('timestamp je validan ISO', () => {
    assert(!Number.isNaN(Date.parse(rezultat.timestamp)), 'timestamp ISO');
  });

  await test('AUTOFINISH_COUNT === 1258', () => {
    assertEqual(AUTOFINISH_COUNT, 1258, 'AUTOFINISH_COUNT=1258');
  });

  await test('APP_VERSION === "52.7.0"', () => {
    assertEqual(APP_VERSION, '52.7.0', 'APP_VERSION=52.7.0');
  });

  await test('TOTAL_API_ROUTES === 1124', () => {
    assertEqual(TOTAL_API_ROUTES, 1124, 'TOTAL_API_ROUTES=1124');
  });

  await test('TOTAL_ROUTES === 1207', () => {
    assertEqual(TOTAL_ROUTES, 1207, 'TOTAL_ROUTES=1207');
  });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) {
    console.error('\n❌ Neuspešni testovi:');
    failures.forEach((f) => console.error(`  • ${f}`));
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Kritična greška u test runneru:', e);
  process.exit(1);
});
