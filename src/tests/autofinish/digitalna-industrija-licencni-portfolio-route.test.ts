// Autofinish #1378 — Digitalna Industrija Licencni Portfolio Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/digitalna-industrija-licencni-portfolio-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/digitalna-industrija-licencni-portfolio/route';
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
  console.log('\n🏁 Digitalna Industrija Licencni Portfolio — Route Coverage Test Suite (#1378)\n');

  const routePath = path.resolve(process.cwd(), 'src/app/api/digitalna-industrija-licencni-portfolio/route.ts');
  const routeSource = fs.readFileSync(routePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(routePath), `${routePath} ne postoji`);
  });

  await test('Ruta koristi očekivane gradivne blokove', () => {
    assert(routeSource.includes('buildDigitalnaIndustrijaLicencniPortfolio'), 'Nedostaje buildDigitalnaIndustrijaLicencniPortfolio');
    assert(routeSource.includes('apiSuccess'), 'Nedostaje apiSuccess');
    assert(routeSource.includes('apiInternalError'), 'Nedostaje apiInternalError');
    assert(routeSource.includes('checkRateLimitGlobal'), 'Nedostaje checkRateLimitGlobal');
  });

  await test('Konstante su ažurirane', () => {
    assertEqual(APP_VERSION, '59.48.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1380, 'AUTOFINISH_COUNT');
  });

  await test('GET vraća 200 i očekivanu strukturu', async () => {
    const req = new Request('http://localhost/api/digitalna-industrija-licencni-portfolio') as NextRequest;
    const response = await GET(req);
    assertEqual(response.status, 200, 'status');

    const body = (await response.json()) as { data: Record<string, unknown> };
    const d = body.data;
    assertEqual(d['status'] as string, 'aktivan', 'data.status');
    assert(typeof d['naziv'] === 'string', 'data.naziv string');
    assertEqual(d['verzija'] as string, APP_VERSION, 'data.verzija');
    assertEqual(d['jurisdikcija'] as string, 'Srbija', 'data.jurisdikcija');
    assertEqual(d['rezimNabavke'] as string, 'kupujemo_sve_licence', 'data.rezimNabavke');
    assert(Array.isArray(d['stavke']), 'data.stavke niz');
    assert(Array.isArray(d['entiteti']), 'data.entiteti niz');
    assert(typeof d['summary'] === 'object' && d['summary'] !== null, 'data.summary objekat');
    assert(typeof d['timestamp'] === 'string', 'data.timestamp string');
  });

  await test('GET stavke imaju ispravnu strukturu', async () => {
    const req = new Request('http://localhost/api/digitalna-industrija-licencni-portfolio') as NextRequest;
    const response = await GET(req);
    const body = (await response.json()) as { data: { stavke: Array<Record<string, unknown>> } };
    const stavke = body.data.stavke;

    assert(stavke.length > 0, 'mora biti bar jedna stavka');
    const s = stavke[0];
    assert(typeof s['id'] === 'string', 'stavka ima id');
    assert(typeof s['entitet'] === 'string', 'stavka ima entitet');
    assert(typeof s['nivo'] === 'string', 'stavka ima nivo');
    assert(typeof s['tip'] === 'string', 'stavka ima tip');
    assert(typeof s['naziv'] === 'string', 'stavka ima naziv');
    assert(typeof s['status'] === 'string', 'stavka ima status');
    assert(typeof s['blokator'] === 'string', 'stavka ima blokator');
    assert(typeof s['obaveznost'] === 'string', 'stavka ima obaveznost');
    assert(typeof s['budzetRSD'] === 'number', 'stavka ima budzetRSD');
    assert(Array.isArray(s['zavisnosti']), 'stavka ima zavisnosti niz');
  });

  await test('GET pokriva sva 4 nivoa portfolija', async () => {
    const req = new Request('http://localhost/api/digitalna-industrija-licencni-portfolio') as NextRequest;
    const response = await GET(req);
    const body = (await response.json()) as { data: { stavke: Array<Record<string, unknown>> } };
    const stavke = body.data.stavke;

    const nivoi = new Set(stavke.map((s) => s['nivo'] as string));
    assert(nivoi.has('maticni-subjekt'), 'mora biti nivo maticni-subjekt');
    assert(nivoi.has('povezani-entitet'), 'mora biti nivo povezani-entitet');
    assert(nivoi.has('platforma-asset'), 'mora biti nivo platforma-asset');
    assert(nivoi.has('vendor-enterprise'), 'mora biti nivo vendor-enterprise');
  });

  await test('GET summary je usklađen sa stavkama', async () => {
    const req = new Request('http://localhost/api/digitalna-industrija-licencni-portfolio') as NextRequest;
    const response = await GET(req);
    const body = (await response.json()) as {
      data: {
        stavke: Array<Record<string, unknown>>;
        summary: Record<string, unknown>;
      };
    };

    const { stavke, summary } = body.data;
    assertEqual(summary['ukupno'] as number, stavke.length, 'summary.ukupno');
    assert(typeof summary['verifikovano'] === 'number', 'summary.verifikovano');
    assert(typeof summary['procenatZavrsenih'] === 'number', 'summary.procenatZavrsenih');
    assert(typeof summary['ukupniBudzetRSD'] === 'number', 'summary.ukupniBudzetRSD');
    assert(typeof summary['blokirajucihLegalanRad'] === 'number', 'summary.blokirajucihLegalanRad');
    assert(typeof summary['blokirajucihPlatforme'] === 'number', 'summary.blokirajucihPlatforme');
    assert(typeof summary['poNivou'] === 'object', 'summary.poNivou objekat');
    assert(typeof summary['poStatusu'] === 'object', 'summary.poStatusu objekat');
    assert(typeof summary['poTipu'] === 'object', 'summary.poTipu objekat');
  });

  await test('GET vendorEnterpriseIntegrisan je niz', async () => {
    const req = new Request('http://localhost/api/digitalna-industrija-licencni-portfolio') as NextRequest;
    const response = await GET(req);
    const body = (await response.json()) as {
      data: { vendorEnterpriseIntegrisan: Array<Record<string, unknown>> };
    };
    const vendor = body.data.vendorEnterpriseIntegrisan;

    assert(Array.isArray(vendor), 'vendorEnterpriseIntegrisan mora biti niz');
    assert(vendor.length > 0, 'mora biti bar jedan vendor entry');
    const v = vendor[0];
    assert(typeof v['vendor'] === 'string', 'vendor entry ima vendor');
    assert(typeof v['portfolioStatus'] === 'string', 'vendor entry ima portfolioStatus');
    assert(typeof v['enterpriseZahtevStatus'] === 'string', 'vendor entry ima enterpriseZahtevStatus');
    assert(typeof v['uskladen'] === 'boolean', 'vendor entry ima uskladen bool');
  });

  console.log(`\n🏁 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) {
    console.error('\n❌ Neuspešni testovi:');
    failures.forEach((f) => console.error(`  • ${f}`));
    process.exit(1);
  }
  console.log('\n✅ Svi testovi prošli.\n');
}

runTests().catch((err) => {
  console.error('Fatalna greška u testu:', err);
  process.exit(1);
});
