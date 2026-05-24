// Autofinish #1373 — Potencijal Svega Ovoga Do Sada Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/potencijal-svega-ovoga-do-sada-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import {
  GET,
  POTENCIJAL_SVEGA_RATE_LIMIT,
} from '../../app/api/potencijal-svega-ovoga-do-sada/route';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  TOTAL_API_ROUTES,
  TOTAL_PAGES,
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
  console.log('\n🧭 Potencijal Svega Ovoga Do Sada — Route Coverage Test Suite (#1373)\n');

  const routePath = path.resolve(process.cwd(), 'src/app/api/potencijal-svega-ovoga-do-sada/route.ts');
  const routeSource = fs.readFileSync(routePath, 'utf8');
  const libPath = path.resolve(process.cwd(), 'src/lib/potencijal-svega-ovoga-do-sada.ts');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(routePath), `${routePath} ne postoji`);
  });

  await test('Lib modul fajl postoji', () => {
    assert(fs.existsSync(libPath), `${libPath} ne postoji`);
  });

  await test('API ruta koristi očekivane gradivne blokove', () => {
    assert(routeSource.includes('buildPotencijalSvegaOvogaDoSada'), 'Nedostaje buildPotencijalSvegaOvogaDoSada');
    assert(routeSource.includes('checkRateLimitGlobal'), 'Nedostaje checkRateLimitGlobal');
    assert(routeSource.includes('apiRateLimited'), 'Nedostaje apiRateLimited');
    assert(routeSource.includes('apiSuccess'), 'Nedostaje apiSuccess');
    assert(routeSource.includes('apiInternalError'), 'Nedostaje apiInternalError');
    assert(routeSource.includes('force-dynamic'), 'Nedostaje force-dynamic');
  });

  await test('GET vraća 200 i ispravnu strukturu', async () => {
    const request = new Request('http://localhost/api/potencijal-svega-ovoga-do-sada', {
      headers: { 'x-forwarded-for': '127.0.0.70' },
    });

    const response = await GET(request as NextRequest);
    assertEqual(response.status, 200, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    assert(typeof body['data'] === 'object' && body['data'] !== null, 'data objekat');
    assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
    assert(typeof body['timestamp'] === 'string', 'timestamp string');

    const data = body['data'] as Record<string, unknown>;
    assert(typeof data['sistem'] === 'string', 'sistem string');
    assert(typeof data['kompanija'] === 'string', 'kompanija string');
    assertEqual(data['verzija'] as string, APP_VERSION, 'data.verzija');
    assertEqual(data['autofinishBroj'] as number, AUTOFINISH_COUNT, 'data.autofinishBroj');
    assert(typeof data['ukupniPotencijal'] === 'number', 'ukupniPotencijal number');
    assert(typeof data['ostvarenoDoSada'] === 'number', 'ostvarenoDoSada number');
    assert(typeof data['najbliziRast'] === 'number', 'najbliziRast number');
    assert(Array.isArray(data['blokeri']), 'blokeri niz');
    assert(Array.isArray(data['unlockFaktori']), 'unlockFaktori niz');
    assert(Array.isArray(data['preporukeDetaljno']), 'preporukeDetaljno niz');

    const meta = data['meta'] as Record<string, unknown>;
    assertEqual(meta['contractVersion'] as string, 'v1', 'meta.contractVersion');
    assertEqual(meta['sourceOfTruth'] as string, '/api/potencijal-svega-ovoga-do-sada', 'meta.sourceOfTruth');
  });

  await test('Domeni su svi prisutni i validni', async () => {
    const request = new Request('http://localhost/api/potencijal-svega-ovoga-do-sada', {
      headers: { 'x-forwarded-for': '127.0.0.71' },
    });
    const response = await GET(request as NextRequest);
    const body = (await response.json()) as Record<string, unknown>;
    const data = body['data'] as Record<string, unknown>;
    const domeni = data['domeni'] as Record<string, unknown>;

    const ocekivaniDomeni = ['ekosistem', 'infrastruktura', 'finansije', 'bezbednost', 'operativa', 'autofinish', 'aiProizvod'];
    for (const naziv of ocekivaniDomeni) {
      const domen = domeni[naziv] as Record<string, unknown>;
      assert(domen !== undefined, `domen '${naziv}' nedostaje`);
      assert(typeof domen['ostvareniScore'] === 'number', `${naziv}.ostvareniScore number`);
      assert(typeof domen['potencijalScore'] === 'number', `${naziv}.potencijalScore number`);
      assert(typeof domen['uplift'] === 'number', `${naziv}.uplift number`);
      assert((domen['ostvareniScore'] as number) >= 0 && (domen['ostvareniScore'] as number) <= 100, `${naziv}.ostvareniScore 0-100`);
      assert((domen['potencijalScore'] as number) >= 0 && (domen['potencijalScore'] as number) <= 100, `${naziv}.potencijalScore 0-100`);
      assert(Array.isArray(domen['izvori']), `${naziv}.izvori niz`);
    }
  });

  await test('Rate limit vraća 429 nakon prekoračenja limita', async () => {
    const ip = '127.0.0.99';
    const statusi: number[] = [];
    for (let i = 0; i < POTENCIJAL_SVEGA_RATE_LIMIT + 1; i++) {
      const req = new Request('http://localhost/api/potencijal-svega-ovoga-do-sada', {
        headers: { 'x-forwarded-for': ip },
      });
      const res = await GET(req as NextRequest);
      statusi.push(res.status);
    }
    for (let i = 0; i < POTENCIJAL_SVEGA_RATE_LIMIT; i++) {
      assertEqual(statusi[i], 200, `status zahtev #${i + 1}`);
    }
    assertEqual(statusi[POTENCIJAL_SVEGA_RATE_LIMIT], 429, `status zahtev #${POTENCIJAL_SVEGA_RATE_LIMIT + 1}`);
  });

  await test('Stranica potencijal-svega-ovoga-do-sada postoji', () => {
    const pagePath = path.resolve(process.cwd(), 'src/app/potencijal-svega-ovoga-do-sada/page.tsx');
    assert(fs.existsSync(pagePath), `${pagePath} ne postoji`);
    const src = fs.readFileSync(pagePath, 'utf8');
    assert(src.includes('potencijalSvegaOvogaDoSadaSekvence'), 'Nedostaje potencijalSvegaOvogaDoSadaSekvence');
    assert(src.includes('StranicaRenderer'), 'Nedostaje StranicaRenderer');
  });

  await test('Sekvence fajl postoji', () => {
    const sekvencePath = path.resolve(process.cwd(), 'src/lib/sekvence/potencijal-svega-ovoga-do-sada-page.ts');
    assert(fs.existsSync(sekvencePath), `${sekvencePath} ne postoji`);
    const src = fs.readFileSync(sekvencePath, 'utf8');
    assert(src.includes('potencijalSvegaOvogaDoSadaSekvence'), 'Nedostaje potencijalSvegaOvogaDoSadaSekvence export');
  });

  await test('Navigacija sadrži potencijal-svega-ovoga-do-sada link', () => {
    const navPath = path.resolve(process.cwd(), 'src/lib/navigation.ts');
    const navSrc = fs.readFileSync(navPath, 'utf8');
    assert(navSrc.includes('/potencijal-svega-ovoga-do-sada'), 'Navigacija ne sadrži /potencijal-svega-ovoga-do-sada');
  });

  await test('Sitemap sadrži potencijal-svega-ovoga-do-sada i API rutu', () => {
    const sitemapPath = path.resolve(process.cwd(), 'src/app/sitemap.ts');
    const sitemapSrc = fs.readFileSync(sitemapPath, 'utf8');
    assert(sitemapSrc.includes('/potencijal-svega-ovoga-do-sada'), 'Sitemap ne sadrži /potencijal-svega-ovoga-do-sada');
    assert(sitemapSrc.includes('/api/potencijal-svega-ovoga-do-sada'), 'Sitemap ne sadrži /api/potencijal-svega-ovoga-do-sada');
  });

  await test('Konstante imaju validne granice', () => {
    assert(typeof APP_VERSION === 'string' && APP_VERSION.length > 0, 'APP_VERSION string');
    assert(TOTAL_API_ROUTES > 0, 'TOTAL_API_ROUTES > 0');
    assert(TOTAL_ROUTES >= TOTAL_API_ROUTES, 'TOTAL_ROUTES >= TOTAL_API_ROUTES');
    assert(TOTAL_PAGES > 0, 'TOTAL_PAGES > 0');
  });

  console.log(`\n🧭 Rezultat: ${passed} prošlo, ${failed} palo`);
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
