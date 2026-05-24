// Autofinish #1360 — Analiza Svega Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/analiza-svega-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import { ANALIZA_SVEGA_RATE_LIMIT, GET } from '../../app/api/analiza-svega/route';
import { scoreToAnalizaOcena } from '../../lib/analiza-svega';
import { APP_VERSION, AUTOFINISH_COUNT, TOTAL_API_ROUTES, TOTAL_PAGES, TOTAL_ROUTES } from '../../lib/constants';

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
  console.log('\n🏁 Analiza Svega — Route Coverage Test Suite (#1360)\n');

  const routePath = path.resolve(process.cwd(), 'src/app/api/analiza-svega/route.ts');
  const routeSource = fs.readFileSync(routePath, 'utf8');
  const libPath = path.resolve(process.cwd(), 'src/lib/analiza-svega.ts');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(routePath), `${routePath} ne postoji`);
  });

  await test('Lib modul fajl postoji', () => {
    assert(fs.existsSync(libPath), `${libPath} ne postoji`);
  });

  await test('API ruta koristi očekivane gradivne blokove', () => {
    assert(routeSource.includes('buildAnalizaSvega'), 'Nedostaje buildAnalizaSvega');
    assert(routeSource.includes('checkRateLimitGlobal'), 'Nedostaje checkRateLimitGlobal');
    assert(routeSource.includes('apiRateLimited'), 'Nedostaje apiRateLimited');
    assert(routeSource.includes('apiSuccess'), 'Nedostaje apiSuccess');
    assert(routeSource.includes('apiInternalError'), 'Nedostaje apiInternalError');
    assert(routeSource.includes('force-dynamic'), 'Nedostaje force-dynamic');
  });

  await test('GET vraća 200 i ispravnu strukturu', async () => {
    const request = new Request('http://localhost/api/analiza-svega', {
      headers: { 'x-forwarded-for': '127.0.0.42' },
    });

    const response = await GET(request as NextRequest);
    assertEqual(response.status, 200, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    // apiSuccess wrapper
    assert(typeof body['data'] === 'object' && body['data'] !== null, 'data objekat');
    assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
    assert(typeof body['timestamp'] === 'string', 'timestamp string');
    assert(!Number.isNaN(Date.parse(body['timestamp'] as string)), 'timestamp ISO');

    const data = body['data'] as Record<string, unknown>;
    assert(typeof data['sistem'] === 'string', 'sistem string');
    assert(typeof data['kompanija'] === 'string', 'kompanija string');
    assertEqual(data['verzija'] as string, APP_VERSION, 'data.verzija');
    assertEqual(data['autofinishBroj'] as number, AUTOFINISH_COUNT, 'data.autofinishBroj');
    assert(typeof data['ukupanScore'] === 'number', 'ukupanScore number');
    assert(typeof data['konacnaOcena'] === 'string', 'konacnaOcena string');
    assert(typeof data['procenatSpremnosti'] === 'number', 'procenatSpremnosti number');
    assert(Array.isArray(data['preporuke']), 'preporuke niz');
    assert(Array.isArray(data['preporukeDetaljno']), 'preporukeDetaljno niz');
    assert(Array.isArray(data['kriticniDomeni']), 'kriticniDomeni niz');
    assert(typeof data['trend'] === 'object' && data['trend'] !== null, 'trend objekat');
    const trend = data['trend'] as Record<string, unknown>;
    assert(typeof trend['reliable'] === 'boolean', 'trend.reliable boolean');
    assert(typeof data['meta'] === 'object' && data['meta'] !== null, 'meta objekat');
    const meta = data['meta'] as Record<string, unknown>;
    assertEqual(meta['contractVersion'] as string, 'v2', 'meta.contractVersion');
    assertEqual(meta['sourceOfTruth'] as string, '/api/analiza-svega', 'meta.sourceOfTruth');
    assert(typeof data['timestamp'] === 'string', 'data.timestamp string');
  });

  await test('Domeni su svi prisutni i validni', async () => {
    const request = new Request('http://localhost/api/analiza-svega', {
      headers: { 'x-forwarded-for': '127.0.0.43' },
    });
    const response = await GET(request as NextRequest);
    const body = (await response.json()) as Record<string, unknown>;
    const data = body['data'] as Record<string, unknown>;
    const domeni = data['domeni'] as Record<string, unknown>;

    assert(typeof domeni === 'object' && domeni !== null, 'domeni objekat');
    const ocekivaniDomeni = ['ekosistem', 'infrastruktura', 'finansije', 'bezbednost', 'operativa', 'autofinish', 'protokoli'];
    for (const naziv of ocekivaniDomeni) {
      const domen = domeni[naziv] as Record<string, unknown>;
      assert(domen !== undefined, `domen '${naziv}' nedostaje`);
      assert(typeof domen['score'] === 'number', `${naziv}.score number`);
      assert(domen['score'] >= 0 && domen['score'] <= 100, `${naziv}.score 0-100`);
      assert(typeof domen['ocena'] === 'string', `${naziv}.ocena string`);
      assert(
        ['ODLICNO', 'SPREMNO', 'DELIMICNO', 'POTREBNO_POBOLJSANJE'].includes(domen['ocena'] as string),
        `${naziv}.ocena validna vrednost`,
      );
      assert(typeof domen['confidence'] === 'number', `${naziv}.confidence number`);
      assert((domen['confidence'] as number) >= 0 && (domen['confidence'] as number) <= 100, `${naziv}.confidence 0-100`);
      assert(typeof domen['freshness'] === 'string', `${naziv}.freshness string`);
      assert(['fresh', 'stale', 'unknown'].includes(domen['freshness'] as string), `${naziv}.freshness validna vrednost`);
      assert(Array.isArray(domen['izvori']), `${naziv}.izvori niz`);
      assert(typeof domen['naziv'] === 'string', `${naziv}.naziv string`);
      assert(typeof domen['detalji'] === 'object', `${naziv}.detalji objekat`);
    }
  });

  await test('ukupanScore je u granicama 0-100 i konzistentan sa ocenom', async () => {
    const request = new Request('http://localhost/api/analiza-svega', {
      headers: { 'x-forwarded-for': '127.0.0.44' },
    });
    const response = await GET(request as NextRequest);
    const body = (await response.json()) as Record<string, unknown>;
    const data = body['data'] as Record<string, unknown>;
    const score = data['ukupanScore'] as number;
    assert(score >= 0 && score <= 100, 'ukupanScore 0-100');
    assertEqual(data['konacnaOcena'] as string, scoreToAnalizaOcena(score), 'konacnaOcena prema score granicama');
  });

  await test('scoreToAnalizaOcena granice (0/50/75/90/100)', () => {
    assertEqual(scoreToAnalizaOcena(0), 'POTREBNO_POBOLJSANJE', 'score 0');
    assertEqual(scoreToAnalizaOcena(50), 'DELIMICNO', 'score 50');
    assertEqual(scoreToAnalizaOcena(75), 'SPREMNO', 'score 75');
    assertEqual(scoreToAnalizaOcena(90), 'ODLICNO', 'score 90');
    assertEqual(scoreToAnalizaOcena(100), 'ODLICNO', 'score 100');
  });

  await test('Rate limit vraća 429 nakon prekoračenja limita', async () => {
    const ip = '127.0.0.99';
    const statusi: number[] = [];
    for (let i = 0; i < ANALIZA_SVEGA_RATE_LIMIT + 1; i++) {
      const req = new Request('http://localhost/api/analiza-svega', {
        headers: { 'x-forwarded-for': ip },
      });
      const res = await GET(req as NextRequest);
      statusi.push(res.status);
    }
    for (let i = 0; i < ANALIZA_SVEGA_RATE_LIMIT; i++) {
      assertEqual(statusi[i], 200, `status zahtev #${i + 1}`);
    }
    assertEqual(statusi[ANALIZA_SVEGA_RATE_LIMIT], 429, `status zahtev #${ANALIZA_SVEGA_RATE_LIMIT + 1}`);
  });

  await test('Konstante imaju validne granice', () => {
    const MIN_AUTOFINISH_COUNT_FOR_ANALIZA_SVEGA = 1360;
    assert(typeof APP_VERSION === 'string' && APP_VERSION.length > 0, 'APP_VERSION string');
    assert(
      AUTOFINISH_COUNT >= MIN_AUTOFINISH_COUNT_FOR_ANALIZA_SVEGA,
      `AUTOFINISH_COUNT >= ${MIN_AUTOFINISH_COUNT_FOR_ANALIZA_SVEGA}`,
    );
    assert(TOTAL_API_ROUTES > 0, 'TOTAL_API_ROUTES > 0');
    assert(TOTAL_ROUTES >= TOTAL_API_ROUTES, 'TOTAL_ROUTES >= TOTAL_API_ROUTES');
    assert(TOTAL_PAGES > 0, 'TOTAL_PAGES > 0');
  });

  await test('Stranica analiza-svega postoji', () => {
    const pagePath = path.resolve(process.cwd(), 'src/app/analiza-svega/page.tsx');
    assert(fs.existsSync(pagePath), `${pagePath} ne postoji`);
    const src = fs.readFileSync(pagePath, 'utf8');
    assert(src.includes('analizaSvegaSekvence'), 'Nedostaje analizaSvegaSekvence');
    assert(src.includes('StranicaRenderer'), 'Nedostaje StranicaRenderer');
  });

  await test('Sekvence fajl za analiza-svega postoji', () => {
    const sekvencePath = path.resolve(process.cwd(), 'src/lib/sekvence/analiza-svega-page.ts');
    assert(fs.existsSync(sekvencePath), `${sekvencePath} ne postoji`);
    const src = fs.readFileSync(sekvencePath, 'utf8');
    assert(src.includes('analizaSvegaSekvence'), 'Nedostaje analizaSvegaSekvence export');
  });

  await test('Navigacija sadrži analiza-svega link', () => {
    const navPath = path.resolve(process.cwd(), 'src/lib/navigation.ts');
    const navSrc = fs.readFileSync(navPath, 'utf8');
    assert(navSrc.includes('/analiza-svega'), 'Navigacija ne sadrži /analiza-svega');
  });

  await test('Sitemap sadrži analiza-svega i api/analiza-svega', () => {
    const sitemapPath = path.resolve(process.cwd(), 'src/app/sitemap.ts');
    const sitemapSrc = fs.readFileSync(sitemapPath, 'utf8');
    assert(sitemapSrc.includes('/analiza-svega'), 'Sitemap ne sadrži /analiza-svega');
    assert(sitemapSrc.includes('/api/analiza-svega'), 'Sitemap ne sadrži /api/analiza-svega');
  });

  console.log(`\n🏁 Rezultat: ${passed} prošlo, ${failed} palo`);
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
