// Autofinish #1383 — Digitalna Industrija Licencni Portfolio — Konzistentnost i Invarijanti Test
// Pokretanje: npx tsx src/tests/autofinish/digitalna-industrija-licencni-portfolio-konzistentnost.test.ts

import {
  buildDigitalnaIndustrijaLicencniPortfolio,
  getLicencniPortfolioBlokatori,
  getLicencniPortfolioProcurementQueue,
  getLicencniPortfolioVendorStatus,
  type LicencniPortfolioStavka,
} from '../../lib/digitalna-industrija-licencni-portfolio';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

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
  console.log('\n🔍 Digitalna Industrija Licencni Portfolio — Konzistentnost i Invarijanti (#1383)\n');

  const portfolio = buildDigitalnaIndustrijaLicencniPortfolio();

  await test('Sve stavke u portfoliju imaju jedinstvene ID-ove', () => {
    const ids = portfolio.stavke.map((s) => s.id);
    const uniqueIds = new Set(ids);
    assertEqual(uniqueIds.size, ids.length, 'svi ID-ovi moraju biti jedinstveni');
  });

  await test('Summary.blokirajucihLegalanRad tačno broji blokira_legalan_rad stavke', () => {
    const stvarno = portfolio.stavke.filter(
      (s) => s.blokator === 'blokira_legalan_rad',
    ).length;
    assertEqual(portfolio.summary.blokirajucihLegalanRad, stvarno, 'blokirajucihLegalanRad');
  });

  await test('Summary.blokirajucihPlatforme tačno broji blokira_platforme stavke', () => {
    const stvarno = portfolio.stavke.filter(
      (s) => s.blokator === 'blokira_platforme',
    ).length;
    assertEqual(portfolio.summary.blokirajucihPlatforme, stvarno, 'blokirajucihPlatforme');
  });

  await test('Summary.verifikovano tačno broji verifikovane stavke', () => {
    const stvarno = portfolio.stavke.filter((s) => s.status === 'verifikovano').length;
    assertEqual(portfolio.summary.verifikovano, stvarno, 'verifikovano');
  });

  await test('Summary.poStatusu suma odgovara ukupnom broju stavki', () => {
    const suma = Object.values(portfolio.summary.poStatusu).reduce((a, b) => a + b, 0);
    assertEqual(suma, portfolio.stavke.length, 'suma poStatusu = ukupno stavki');
  });

  await test('Summary.poTipu suma odgovara ukupnom broju stavki', () => {
    const suma = Object.values(portfolio.summary.poTipu).reduce((a, b) => a + b, 0);
    assertEqual(suma, portfolio.stavke.length, 'suma poTipu = ukupno stavki');
  });

  await test('Procurement queue je podskup stavki iz portfolija', () => {
    const portfolioIds = new Set(portfolio.stavke.map((s) => s.id));
    const queue = getLicencniPortfolioProcurementQueue();
    for (const q of queue) {
      assert(portfolioIds.has(q.id), `Procurement queue stavka '${q.id}' nije u portfoliju`);
    }
  });

  await test('Blokatori su podskup stavki iz portfolija', () => {
    const portfolioIds = new Set(portfolio.stavke.map((s) => s.id));
    const blokatori = getLicencniPortfolioBlokatori();
    for (const b of blokatori) {
      assert(portfolioIds.has(b.id), `Blokator stavka '${b.id}' nije u portfoliju`);
    }
  });

  await test('Zavisnosti u stavkama referišu samo na postojeće ID-ove', () => {
    const portfolioIds = new Set(portfolio.stavke.map((s) => s.id));
    const problematicne: string[] = [];
    for (const s of portfolio.stavke) {
      for (const depId of s.zavisnosti) {
        if (!portfolioIds.has(depId)) {
          problematicne.push(`Stavka '${s.id}' ima zavisnost '${depId}' koja ne postoji`);
        }
      }
    }
    assert(
      problematicne.length === 0,
      `Nevalidne zavisnosti:\n  ${problematicne.join('\n  ')}`,
    );
  });

  await test('Vendor enterprise integrisan sadrži Vercel, GitHub i OpenAI unose', () => {
    const vendorStatus = getLicencniPortfolioVendorStatus();
    // vendor field je stavka.naziv (puni naziv), ali portfolioStavkaId sadrži vendor ključ
    const portfolioIds = vendorStatus.map((v) => v.portfolioStavkaId.toLowerCase());
    assert(
      portfolioIds.some((id) => id.includes('vercel')),
      'mora biti vendor entry za vercel',
    );
    assert(
      portfolioIds.some((id) => id.includes('github')),
      'mora biti vendor entry za github',
    );
    assert(
      portfolioIds.some((id) => id.includes('openai')),
      'mora biti vendor entry za openai',
    );
  });

  await test('VendorStatus.portfolioStavkaId referišu na postojeće stavke', () => {
    const portfolioIds = new Set(portfolio.stavke.map((s) => s.id));
    const vendorStatus = getLicencniPortfolioVendorStatus();
    for (const v of vendorStatus) {
      assert(
        portfolioIds.has(v.portfolioStavkaId),
        `VendorStatus '${v.vendor}' ima portfolioStavkaId '${v.portfolioStavkaId}' koji ne postoji u portfoliju`,
      );
    }
  });

  await test('Regulatorne licence za Srbiju imaju vlasnik email', () => {
    const regulatorne = portfolio.stavke.filter(
      (s: LicencniPortfolioStavka) => s.tip === 'regulatorna',
    );
    assert(regulatorne.length > 0, 'mora biti bar jedna regulatorna licenca');
    for (const r of regulatorne) {
      assert(
        r.vlasnik.includes('@'),
        `Regulatorna licenca '${r.id}' nema validan email vlasnik: '${r.vlasnik}'`,
      );
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
