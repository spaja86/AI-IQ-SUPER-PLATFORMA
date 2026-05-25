// Autofinish #1381 — Digitalna Industrija Licencni Portfolio — Lib Unit Test
// Pokretanje: npx tsx src/tests/autofinish/digitalna-industrija-licencni-portfolio.test.ts

import {
  buildDigitalnaIndustrijaLicencniPortfolio,
  getLicencniPortfolioBlokatori,
  getLicencniPortfolioProcurementQueue,
  getLicencniPortfolioVendorStatus,
} from '../../lib/digitalna-industrija-licencni-portfolio';
import { APP_VERSION, AUTOFINISH_COUNT, KOMPANIJA } from '../../lib/constants';

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
  console.log('\n📑 Digitalna Industrija Licencni Portfolio — Lib Unit Test Suite (#1381)\n');

  const portfolio = buildDigitalnaIndustrijaLicencniPortfolio();

  await test('buildDigitalnaIndustrijaLicencniPortfolio vraca ispravan objekat', () => {
    assertEqual(portfolio.jurisdikcija, 'Srbija', 'jurisdikcija');
    assertEqual(portfolio.rezimNabavke, 'kupujemo_sve_licence', 'rezimNabavke');
    assertEqual(portfolio.kompanija, KOMPANIJA, 'kompanija');
    assertEqual(portfolio.verzija, APP_VERSION, 'verzija');
    assert(typeof portfolio.naziv === 'string' && portfolio.naziv.length > 0, 'naziv postoji');
    assert(typeof portfolio.timestamp === 'string', 'timestamp string');
    assert(!Number.isNaN(Date.parse(portfolio.timestamp)), 'timestamp ISO validan');
  });

  await test('Stavke pokrivaju sva 4 nivoa portfolija', () => {
    const nivoi = new Set(portfolio.stavke.map((s) => s.nivo));
    assert(nivoi.has('maticni-subjekt'), 'mora biti maticni-subjekt nivo');
    assert(nivoi.has('povezani-entitet'), 'mora biti povezani-entitet nivo');
    assert(nivoi.has('platforma-asset'), 'mora biti platforma-asset nivo');
    assert(nivoi.has('vendor-enterprise'), 'mora biti vendor-enterprise nivo');
  });

  await test('Stavke pokrivaju sva 4 tipa licence', () => {
    const tipovi = new Set(portfolio.stavke.map((s) => s.tip));
    assert(tipovi.has('regulatorna'), 'mora biti regulatorna');
    assert(tipovi.has('softverska'), 'mora biti softverska');
    assert(tipovi.has('enterprise-ugovor'), 'mora biti enterprise-ugovor');
  });

  await test('Svaka stavka ima ispravna obavezna polja', () => {
    for (const s of portfolio.stavke) {
      assert(typeof s.id === 'string' && s.id.length > 0, `stavka nema id: ${JSON.stringify(s)}`);
      assert(typeof s.entitet === 'string' && s.entitet.length > 0, `stavka nema entitet: ${s.id}`);
      assert(typeof s.naziv === 'string' && s.naziv.length > 0, `stavka nema naziv: ${s.id}`);
      assert(typeof s.regulatorIliVendor === 'string', `stavka nema regulatorIliVendor: ${s.id}`);
      assert(typeof s.vlasnik === 'string' && s.vlasnik.length > 0, `stavka nema vlasnik: ${s.id}`);
      assert(typeof s.budzetRSD === 'number' && s.budzetRSD >= 0, `stavka ima negativan budzet: ${s.id}`);
      assert(Array.isArray(s.zavisnosti), `stavka nema zavisnosti niz: ${s.id}`);
    }
  });

  await test('Summary.ukupno odgovara broju stavki', () => {
    assertEqual(portfolio.summary.ukupno, portfolio.stavke.length, 'summary.ukupno');
  });

  await test('Summary.ukupniBudzetRSD je suma svih stavki', () => {
    const suma = portfolio.stavke.reduce((acc, s) => acc + s.budzetRSD, 0);
    assertEqual(portfolio.summary.ukupniBudzetRSD, suma, 'ukupniBudzetRSD');
  });

  await test('Summary.procenatZavrsenih je u opsegu 0-100', () => {
    const pct = portfolio.summary.procenatZavrsenih;
    assert(pct >= 0 && pct <= 100, `procenatZavrsenih mora biti 0-100, dobio ${pct}`);
  });

  await test('Summary.poNivou sadrži sve 4 nivoa', () => {
    const poNivou = portfolio.summary.poNivou;
    assert('maticni-subjekt' in poNivou, 'poNivou nema maticni-subjekt');
    assert('povezani-entitet' in poNivou, 'poNivou nema povezani-entitet');
    assert('platforma-asset' in poNivou, 'poNivou nema platforma-asset');
    assert('vendor-enterprise' in poNivou, 'poNivou nema vendor-enterprise');
    const suma = Object.values(poNivou).reduce((a, b) => a + b, 0);
    assertEqual(suma, portfolio.stavke.length, 'suma poNivou = ukupno stavki');
  });

  await test('getLicencniPortfolioBlokatori vraca samo neblokirajuca=false stavke', () => {
    const blokatori = getLicencniPortfolioBlokatori();
    assert(Array.isArray(blokatori), 'blokatori niz');
    for (const b of blokatori) {
      assert(
        b.blokator !== 'neblokirajuca',
        `Blokatori ne smeju da sadrže neblokirajucu stavku: ${b.id}`,
      );
      assert(
        b.status !== 'verifikovano' && b.status !== 'aktivirano',
        `Blokatori ne smeju da budu verifikovani/aktivirani: ${b.id}`,
      );
    }
  });

  await test('getLicencniPortfolioProcurementQueue ne sadrži verifikovane/aktivirane', () => {
    const queue = getLicencniPortfolioProcurementQueue();
    assert(Array.isArray(queue), 'queue niz');
    for (const s of queue) {
      assert(
        s.status !== 'verifikovano' && s.status !== 'aktivirano',
        `Queue ne sme da sadrži status '${s.status}' za stavku '${s.id}'`,
      );
    }
  });

  await test('getLicencniPortfolioVendorStatus sadrži ispravnu strukturu', () => {
    const vendorStatus = getLicencniPortfolioVendorStatus();
    assert(Array.isArray(vendorStatus), 'vendorStatus niz');
    assert(vendorStatus.length > 0, 'mora biti bar jedan vendor');
    for (const v of vendorStatus) {
      assert(typeof v.vendor === 'string' && v.vendor.length > 0, `vendor entry nema vendor: ${JSON.stringify(v)}`);
      assert(typeof v.portfolioStavkaId === 'string', `vendor entry nema portfolioStavkaId: ${v.vendor}`);
      assert(typeof v.uskladen === 'boolean', `vendor entry nema uskladen bool: ${v.vendor}`);
    }
  });

  await test('Konstante su ispravne', () => {
    assertEqual(APP_VERSION, '59.49.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1383, 'AUTOFINISH_COUNT');
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
