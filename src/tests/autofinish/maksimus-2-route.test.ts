// Autofinish #1400 — Maksimus 2 Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/maksimus-2-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import {
  GET,
  MAKSIMUS_2_RATE_LIMIT,
} from '../../app/api/maksimus-2/route';
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
  console.log('\n🚀 Maksimus 2 — Route Coverage Test Suite (#1400)\n');

  const routePath = path.resolve(process.cwd(), 'src/app/api/maksimus-2/route.ts');
  const libPath = path.resolve(process.cwd(), 'src/lib/maksimus-2.ts');
  const pagePath = path.resolve(process.cwd(), 'src/app/maksimus-2/page.tsx');
  const sekvencePath = path.resolve(process.cwd(), 'src/lib/sekvence/maksimus-2-page.ts');
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
    assert(src.includes('buildMaksimus2'), 'Nedostaje buildMaksimus2');
    assert(src.includes('checkRateLimitGlobal'), 'Nedostaje checkRateLimitGlobal');
    assert(src.includes('apiRateLimited'), 'Nedostaje apiRateLimited');
    assert(src.includes('apiSuccess'), 'Nedostaje apiSuccess');
    assert(src.includes('apiInternalError'), 'Nedostaje apiInternalError');
    assert(src.includes('X-Maksimus2-Contract-Version'), 'Nedostaje contract header');
    assert(src.includes('X-Maksimus2-Model-Version'), 'Nedostaje model header');
  });

  await test('GET vraća 200 i payload sa trend i v2 meta poljima', async () => {
    const request = new Request('http://localhost/api/maksimus-2', {
      headers: { 'x-forwarded-for': '127.0.0.71' },
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

    const meta = data['meta'] as Record<string, unknown>;
    assertEqual(meta['contractVersion'] as string, 'v2', 'meta.contractVersion');

    const domeni = data['domeni'] as Record<string, unknown>;
    const expectedDomeni = ['analiza', 'potencijal', 'procesuiranje', 'orkestracija', 'ekstremnoProcesuiranje', 'operativnaSpremnost'];
    for (const key of expectedDomeni) {
      assert(key in domeni, `domeni sadrži ${key}`);
    }
    assertEqual(Object.keys(domeni).length, 6, 'domeni length');
  });

  await test('Rate limit vraća 429 nakon prekoračenja limita', async () => {
    const ip = `maksimus-2-rate-test-${process.pid}-${Date.now()}`;
    const statusi: number[] = [];
    for (let i = 0; i < MAKSIMUS_2_RATE_LIMIT + 1; i++) {
      const req = new Request('http://localhost/api/maksimus-2', {
        headers: { 'x-forwarded-for': ip },
      });
      const res = await GET(req as NextRequest);
      statusi.push(res.status);
    }
    assertEqual(statusi[MAKSIMUS_2_RATE_LIMIT], 429, 'rate limit status');
  });

  await test('Wiring: navigacija, sitemap, autofinish i predeploy uključuju MAKSIMUS 2', () => {
    const navSrc = fs.readFileSync(navPath, 'utf8');
    const sitemapSrc = fs.readFileSync(sitemapPath, 'utf8');
    const predeploySrc = fs.readFileSync(predeployPath, 'utf8');
    const autofinishLibSrc = fs.readFileSync(autofinishLibPath, 'utf8');

    assert(navSrc.includes('/maksimus-2'), 'Navigacija ne sadrži /maksimus-2');
    assert(sitemapSrc.includes('/maksimus-2'), 'Sitemap ne sadrži /maksimus-2');
    assert(sitemapSrc.includes('/api/maksimus-2'), 'Sitemap ne sadrži /api/maksimus-2');
    assert(predeploySrc.includes('maksimus2ContractReady'), 'predeploy check nije proširen za MAKSIMUS 2');
    assert(autofinishLibSrc.includes("'maksimus-2'"), 'autofinish lib ne sadrži maksimus-2 stage');
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
