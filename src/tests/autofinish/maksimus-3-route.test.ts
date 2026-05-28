// Autofinish #1401 — Maksimus 3 Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/maksimus-3-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import {
  GET,
  MAKSIMUS_3_RATE_LIMIT,
} from '../../app/api/maksimus-3/route';
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
  console.log('\n🚀 Maksimus 3 — Route Coverage Test Suite (#1401)\n');

  const routePath = path.resolve(process.cwd(), 'src/app/api/maksimus-3/route.ts');
  const libPath = path.resolve(process.cwd(), 'src/lib/maksimus-3.ts');
  const pagePath = path.resolve(process.cwd(), 'src/app/maksimus-3/page.tsx');
  const sekvencePath = path.resolve(process.cwd(), 'src/lib/sekvence/maksimus-3-page.ts');
  const navPath = path.resolve(process.cwd(), 'src/lib/navigation.ts');
  const sitemapPath = path.resolve(process.cwd(), 'src/app/sitemap.ts');
  const predeployPath = path.resolve(process.cwd(), 'scripts/predeploy-check.mjs');
  const autofinishLibPath = path.resolve(process.cwd(), 'src/lib/autofinish-svega.ts');

  await test('Ključni fajlovi postoje', () => {
    assert(fs.existsSync(routePath), `${routePath} ne postoji`);
    assert(fs.existsSync(libPath), `${libPath} ne postoji`);
    assert(fs.existsSync(pagePath), `${pagePath} ne postoji`);
    assert(fs.existsSync(sekvencePath), `${sekvencePath} ne postoji`);
  });

  await test('API ruta koristi očekivane gradivne blokove', () => {
    const src = fs.readFileSync(routePath, 'utf8');
    assert(src.includes('buildMaksimus3'), 'Nedostaje buildMaksimus3');
    assert(src.includes('checkRateLimitGlobal'), 'Nedostaje checkRateLimitGlobal');
    assert(src.includes('apiRateLimited'), 'Nedostaje apiRateLimited');
    assert(src.includes('apiSuccess'), 'Nedostaje apiSuccess');
    assert(src.includes('apiInternalError'), 'Nedostaje apiInternalError');
    assert(src.includes('X-Maksimus3-Contract-Version'), 'Nedostaje contract header');
    assert(src.includes('X-Maksimus3-Model-Version'), 'Nedostaje model header');
  });

  await test('GET vraća 200 i payload sa 8 domena, v3 meta i history poljem', async () => {
    const request = new Request('http://localhost/api/maksimus-3', {
      headers: { 'x-forwarded-for': '127.0.0.73' },
    });
    const response = await GET(request as NextRequest);
    assertEqual(response.status, 200, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    assert(typeof body['data'] === 'object' && body['data'] !== null, 'data objekat');
    assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
    assert(typeof body['timestamp'] === 'string', 'timestamp');

    const data = body['data'] as Record<string, unknown>;
    assert(typeof data['ukupanScore'] === 'number', 'ukupanScore number');
    assert(typeof data['konacnaOcena'] === 'string', 'konacnaOcena string');
    assert(typeof data['domeni'] === 'object' && data['domeni'] !== null, 'domeni objekat');
    assert(typeof data['trend'] === 'object' && data['trend'] !== null, 'trend objekat');
    assert(typeof data['meta'] === 'object' && data['meta'] !== null, 'meta objekat');
    assert(Array.isArray(data['history']), 'history niz');

    const meta = data['meta'] as Record<string, unknown>;
    assertEqual(meta['contractVersion'] as string, 'v3', 'meta.contractVersion');

    const domeni = data['domeni'] as Record<string, unknown>;
    const expectedDomeni = [
      'analiza', 'potencijal', 'procesuiranje', 'orkestracija',
      'ekstremnoProcesuiranje', 'operativnaSpremnost', 'spajaPro', 'gejmingIndustrija',
    ];
    for (const key of expectedDomeni) {
      assert(key in domeni, `domeni sadrži ${key}`);
    }
    assertEqual(Object.keys(domeni).length, 8, 'domeni length');
  });

  await test('Rate limit vraća 429 nakon prekoračenja limita', async () => {
    const ip = `maksimus-3-rate-test-${process.pid}-${Date.now()}`;
    const statusi: number[] = [];
    for (let i = 0; i < MAKSIMUS_3_RATE_LIMIT + 1; i++) {
      const req = new Request('http://localhost/api/maksimus-3', {
        headers: { 'x-forwarded-for': ip },
      });
      const res = await GET(req as NextRequest);
      statusi.push(res.status);
    }
    assertEqual(statusi[MAKSIMUS_3_RATE_LIMIT], 429, 'rate limit status');
  });

  await test('Wiring: navigacija, sitemap, autofinish i predeploy uključuju MAKSIMUS 3', () => {
    const navSrc = fs.readFileSync(navPath, 'utf8');
    const sitemapSrc = fs.readFileSync(sitemapPath, 'utf8');
    const predeploySrc = fs.readFileSync(predeployPath, 'utf8');
    const autofinishLibSrc = fs.readFileSync(autofinishLibPath, 'utf8');

    assert(navSrc.includes('/maksimus-3'), 'Navigacija ne sadrži /maksimus-3');
    assert(sitemapSrc.includes('/maksimus-3'), 'Sitemap ne sadrži /maksimus-3');
    assert(sitemapSrc.includes('/api/maksimus-3'), 'Sitemap ne sadrži /api/maksimus-3');
    assert(predeploySrc.includes('maksimus3ContractReady'), 'predeploy check nije proširen za MAKSIMUS 3');
    assert(autofinishLibSrc.includes("'maksimus-3'"), 'autofinish lib ne sadrži maksimus-3 stage');
  });

  await test('Konstante su validne', () => {
    assert(typeof APP_VERSION === 'string' && APP_VERSION.length > 0, 'APP_VERSION string');
    assert(AUTOFINISH_COUNT > 0, 'AUTOFINISH_COUNT > 0');
  });

  console.log(`\n🚀 Rezultat: ${passed} prošlo, ${failed} palo`);
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
