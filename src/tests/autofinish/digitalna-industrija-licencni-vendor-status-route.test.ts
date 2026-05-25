// Autofinish #1380 — Digitalna Industrija Licencni Vendor Status Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/digitalna-industrija-licencni-vendor-status-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/digitalna-industrija-licencni-vendor-status/route';
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
  console.log('\n🏁 Digitalna Industrija Licencni Vendor Status — Route Coverage Test Suite (#1380)\n');

  const routePath = path.resolve(process.cwd(), 'src/app/api/digitalna-industrija-licencni-vendor-status/route.ts');
  const routeSource = fs.readFileSync(routePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(routePath), `${routePath} ne postoji`);
  });

  await test('Ruta koristi očekivane gradivne blokove', () => {
    assert(routeSource.includes('getLicencniPortfolioVendorStatus'), 'Nedostaje getLicencniPortfolioVendorStatus');
    assert(routeSource.includes('getEnterpriseZahtevi'), 'Nedostaje getEnterpriseZahtevi');
    assert(routeSource.includes('apiSuccess'), 'Nedostaje apiSuccess');
    assert(routeSource.includes('checkRateLimitGlobal'), 'Nedostaje checkRateLimitGlobal');
  });

  await test('Konstante su ažurirane', () => {
    assertEqual(APP_VERSION, '59.49.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1383, 'AUTOFINISH_COUNT');
  });

  await test('GET vraća 200 i očekivanu strukturu', async () => {
    const req = new Request('http://localhost/api/digitalna-industrija-licencni-vendor-status') as NextRequest;
    const response = await GET(req);
    assertEqual(response.status, 200, 'status');

    const body = (await response.json()) as { data: Record<string, unknown> };
    const d = body.data;
    assertEqual(d['status'] as string, 'aktivan', 'data.status');
    assert(typeof d['naziv'] === 'string', 'data.naziv string');
    assertEqual(d['verzija'] as string, APP_VERSION, 'data.verzija');
    assert(typeof d['summary'] === 'object' && d['summary'] !== null, 'data.summary objekat');
    assert(Array.isArray(d['vendorStatus']), 'data.vendorStatus niz');
    assert(Array.isArray(d['enterpriseZahtevi']), 'data.enterpriseZahtevi niz');
    assert(typeof d['timestamp'] === 'string', 'data.timestamp string');
  });

  await test('GET summary sadrži ključne metrike', async () => {
    const req = new Request('http://localhost/api/digitalna-industrija-licencni-vendor-status') as NextRequest;
    const response = await GET(req);
    const body = (await response.json()) as { data: { summary: Record<string, unknown> } };
    const summary = body.data.summary;

    assert(typeof summary['ukupnoVendora'] === 'number', 'summary.ukupnoVendora');
    assert(typeof summary['uskladeno'] === 'number', 'summary.uskladeno');
    assert(typeof summary['neuskladeno'] === 'number', 'summary.neuskladeno');
    assert(typeof summary['procenatUskladenosti'] === 'number', 'summary.procenatUskladenosti');
    assert(
      (summary['uskladeno'] as number) + (summary['neuskladeno'] as number) === (summary['ukupnoVendora'] as number),
      'uskladeno + neuskladeno == ukupnoVendora',
    );
  });

  await test('GET vendorStatus sadrži ispravnu strukturu za svaki vendor', async () => {
    const req = new Request('http://localhost/api/digitalna-industrija-licencni-vendor-status') as NextRequest;
    const response = await GET(req);
    const body = (await response.json()) as { data: { vendorStatus: Array<Record<string, unknown>> } };

    for (const v of body.data.vendorStatus) {
      assert(typeof v['vendor'] === 'string', `vendor entry nema vendor string: ${JSON.stringify(v)}`);
      assert(typeof v['portfolioStavkaId'] === 'string', `vendor entry nema portfolioStavkaId: ${JSON.stringify(v)}`);
      assert(typeof v['enterpriseZahtevStatus'] === 'string', `vendor entry nema enterpriseZahtevStatus: ${JSON.stringify(v)}`);
      assert(typeof v['portfolioStatus'] === 'string', `vendor entry nema portfolioStatus: ${JSON.stringify(v)}`);
      assert(typeof v['uskladen'] === 'boolean', `vendor entry nema uskladen bool: ${JSON.stringify(v)}`);
    }
  });

  await test('GET enterpriseZahtevi sadrži Vercel, GitHub i OpenAI', async () => {
    const req = new Request('http://localhost/api/digitalna-industrija-licencni-vendor-status') as NextRequest;
    const response = await GET(req);
    const body = (await response.json()) as { data: { enterpriseZahtevi: Array<Record<string, unknown>> } };
    const zahtevi = body.data.enterpriseZahtevi;

    const ids = new Set(zahtevi.map((z) => z['id'] as string));
    assert(ids.has('vercel'), 'mora biti enterprise zahtev za vercel');
    assert(ids.has('github'), 'mora biti enterprise zahtev za github');
    assert(ids.has('openai'), 'mora biti enterprise zahtev za openai');
  });

  await test('GET procenatUskladenosti je u opsegu 0-100', async () => {
    const req = new Request('http://localhost/api/digitalna-industrija-licencni-vendor-status') as NextRequest;
    const response = await GET(req);
    const body = (await response.json()) as { data: { summary: { procenatUskladenosti: number } } };
    const pct = body.data.summary.procenatUskladenosti;

    assert(pct >= 0 && pct <= 100, `procenatUskladenosti mora biti 0-100, dobio ${pct}`);
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
