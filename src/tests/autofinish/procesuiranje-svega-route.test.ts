// Autofinish #1362 — Procesuiranje Svega Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/procesuiranje-svega-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/procesuiranje-svega/route';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  TOTAL_API_ROUTES,
  TOTAL_ROUTES,
  TOTAL_PAGES,
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
  console.log('\n⚙️ Procesuiranje Svega — Route Coverage Test Suite (#1362)\n');

  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/procesuiranje-svega/route.ts');
  const libPath = path.resolve(process.cwd(), 'src/lib/procesuiranje-svega.ts');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('Lib modul fajl postoji', () => {
    assert(fs.existsSync(libPath), `${libPath} ne postoji`);
  });

  await test('API ruta koristi očekivane gradivne blokove', () => {
    const src = fs.readFileSync(apiRoutePath, 'utf8');
    assert(src.includes('buildProcesuiranjeSvega'), 'Nedostaje buildProcesuiranjeSvega');
    assert(src.includes('checkRateLimitGlobal'), 'Nedostaje checkRateLimitGlobal');
    assert(src.includes('apiError'), 'Nedostaje apiError');
    assert(src.includes('apiSuccess'), 'Nedostaje apiSuccess');
    assert(src.includes('apiInternalError'), 'Nedostaje apiInternalError');
    assert(src.includes('force-dynamic'), 'Nedostaje force-dynamic');
  });

  await test('GET vraća 200 i ispravnu strukturu', async () => {
    const request = new Request('http://localhost/api/procesuiranje-svega', {
      headers: { 'x-forwarded-for': '127.0.0.60' },
    });
    const response = await GET(request as NextRequest);
    assertEqual(response.status, 200, 'HTTP status');

    const body = (await response.json()) as Record<string, unknown>;
    assert(typeof body['data'] === 'object' && body['data'] !== null, 'data objekat');
    assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
    assert(typeof body['timestamp'] === 'string', 'timestamp string');
    assert(!Number.isNaN(Date.parse(body['timestamp'] as string)), 'timestamp ISO');
  });

  await test('Rezultat ima sva obavezna polja', async () => {
    const request = new Request('http://localhost/api/procesuiranje-svega', {
      headers: { 'x-forwarded-for': '127.0.0.61' },
    });
    const response = await GET(request as NextRequest);
    const body = (await response.json()) as Record<string, unknown>;
    const data = body['data'] as Record<string, unknown>;

    assert(typeof data['sistem'] === 'string', 'sistem string');
    assert(typeof data['kompanija'] === 'string', 'kompanija string');
    assertEqual(data['verzija'] as string, APP_VERSION, 'data.verzija');
    assertEqual(data['autofinishBroj'] as number, AUTOFINISH_COUNT, 'autofinishBroj');
    assert(typeof data['ukupanProcenat'] === 'number', 'ukupanProcenat number');
    assert(typeof data['aktivnihProcesa'] === 'number', 'aktivnihProcesa number');
    assert(typeof data['cekajucihProcesa'] === 'number', 'cekajucihProcesa number');
    assert(typeof data['gresakaUkupno'] === 'number', 'gresakaUkupno number');
    assert(typeof data['zavrsenihProcesa'] === 'number', 'zavrsenihProcesa number');
    assert(typeof data['domeni'] === 'object' && data['domeni'] !== null, 'domeni objekat');
    assert(Array.isArray(data['aktivneStavke']), 'aktivneStavke niz');
    assert(!Number.isNaN(Date.parse(data['timestamp'] as string)), 'data.timestamp ISO');
  });

  await test('ukupanProcenat je između 0 i 100', async () => {
    const request = new Request('http://localhost/api/procesuiranje-svega', {
      headers: { 'x-forwarded-for': '127.0.0.62' },
    });
    const response = await GET(request as NextRequest);
    const body = (await response.json()) as Record<string, unknown>;
    const data = body['data'] as Record<string, unknown>;
    const procenat = data['ukupanProcenat'] as number;

    assert(procenat >= 0 && procenat <= 100, `ukupanProcenat mora biti 0-100, dobijeno: ${procenat}`);
  });

  await test('Svih 8 domena su prisutni i validni', async () => {
    const request = new Request('http://localhost/api/procesuiranje-svega', {
      headers: { 'x-forwarded-for': '127.0.0.63' },
    });
    const response = await GET(request as NextRequest);
    const body = (await response.json()) as Record<string, unknown>;
    const data = body['data'] as Record<string, unknown>;
    const domeni = data['domeni'] as Record<string, unknown>;

    const ocekivaniDomeni = ['bankarski', 'ai', 'finansijski', 'licencni', 'ekosistem', 'autofinish', 'bezbednosni', 'analiticki'];
    assertEqual(Object.keys(domeni).length, 8, 'Tačno 8 domena');

    for (const naziv of ocekivaniDomeni) {
      const domen = domeni[naziv] as Record<string, unknown>;
      assert(domen !== undefined, `domen '${naziv}' nedostaje`);
      assert(typeof domen['naziv'] === 'string', `${naziv}.naziv string`);
      assert(typeof domen['ikona'] === 'string', `${naziv}.ikona string`);
      assert(typeof domen['status'] === 'string', `${naziv}.status string`);
      assert(
        ['aktivno', 'cekanje', 'greska', 'zavrseno'].includes(domen['status'] as string),
        `${naziv}.status validna vrednost, dobijeno: ${String(domen['status'])}`,
      );
      assert(typeof domen['procenat'] === 'number', `${naziv}.procenat number`);
      assert(domen['procenat'] as number >= 0 && domen['procenat'] as number <= 100, `${naziv}.procenat 0-100`);
      assert(Array.isArray(domen['stavke']), `${naziv}.stavke niz`);
      assert((domen['stavke'] as unknown[]).length > 0, `${naziv}.stavke nije prazno`);
    }
  });

  await test('aktivneStavke sadrže samo aktivne procese', async () => {
    const request = new Request('http://localhost/api/procesuiranje-svega', {
      headers: { 'x-forwarded-for': '127.0.0.64' },
    });
    const response = await GET(request as NextRequest);
    const body = (await response.json()) as Record<string, unknown>;
    const data = body['data'] as Record<string, unknown>;
    const stavke = data['aktivneStavke'] as Array<Record<string, unknown>>;

    assert(stavke.length > 0, 'aktivneStavke nije prazno');
    for (const stavka of stavke) {
      assertEqual(stavka['status'] as string, 'aktivno', `stavka ${String(stavka['id'])} mora biti aktivna`);
      assert(typeof stavka['id'] === 'string', 'stavka.id string');
      assert(typeof stavka['opis'] === 'string', 'stavka.opis string');
      assert(typeof stavka['tip'] === 'string', 'stavka.tip string');
    }
  });

  await test('Stranica procesuiranje-svega postoji', () => {
    const pagePath = path.resolve(process.cwd(), 'src/app/procesuiranje-svega/page.tsx');
    assert(fs.existsSync(pagePath), `${pagePath} ne postoji`);
    const src = fs.readFileSync(pagePath, 'utf8');
    assert(src.includes('procesuiranjeSvegaSekvence'), 'Nedostaje procesuiranjeSvegaSekvence');
    assert(src.includes('StranicaRenderer'), 'Nedostaje StranicaRenderer');
  });

  await test('Sekvence fajl procesuiranje-svega postoji', () => {
    const sekvencePath = path.resolve(process.cwd(), 'src/lib/sekvence/procesuiranje-svega-page.ts');
    assert(fs.existsSync(sekvencePath), `${sekvencePath} ne postoji`);
    const src = fs.readFileSync(sekvencePath, 'utf8');
    assert(src.includes('procesuiranjeSvegaSekvence'), 'Nedostaje procesuiranjeSvegaSekvence export');
  });

  await test('Navigacija sadrži procesuiranje-svega link', () => {
    const navPath = path.resolve(process.cwd(), 'src/lib/navigation.ts');
    const navSrc = fs.readFileSync(navPath, 'utf8');
    assert(navSrc.includes('/procesuiranje-svega'), 'Navigacija ne sadrži /procesuiranje-svega');
  });

  await test('Sitemap sadrži procesuiranje-svega i api/procesuiranje-svega', () => {
    const sitemapPath = path.resolve(process.cwd(), 'src/app/sitemap.ts');
    const sitemapSrc = fs.readFileSync(sitemapPath, 'utf8');
    assert(sitemapSrc.includes('/procesuiranje-svega'), 'Sitemap ne sadrži /procesuiranje-svega');
    assert(sitemapSrc.includes('/api/procesuiranje-svega'), 'Sitemap ne sadrži /api/procesuiranje-svega');
  });

  await test('Konstante su ažurirane', () => {
    assertEqual(APP_VERSION, '59.33.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1363, 'AUTOFINISH_COUNT');
    assertEqual(TOTAL_API_ROUTES, 1166, 'TOTAL_API_ROUTES');
    assertEqual(TOTAL_ROUTES, 1270, 'TOTAL_ROUTES');
    assertEqual(TOTAL_PAGES, 62, 'TOTAL_PAGES');
  });

  console.log(`\n⚙️ Rezultat: ${passed} prošlo, ${failed} palo`);
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
