// Autofinish #1399 — Maksimus Svega Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/maksimus-svega-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import {
  GET,
  MAKSIMUS_SVEGA_RATE_LIMIT,
} from '../../app/api/maksimus-svega/route';
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
  console.log('\n🚀 Maksimus Svega — Route Coverage Test Suite (#1399)\n');

  const routePath = path.resolve(process.cwd(), 'src/app/api/maksimus-svega/route.ts');
  const libPath = path.resolve(process.cwd(), 'src/lib/maksimus-svega.ts');
  const pagePath = path.resolve(process.cwd(), 'src/app/maksimus-svega/page.tsx');
  const sekvencePath = path.resolve(process.cwd(), 'src/lib/sekvence/maksimus-svega-page.ts');
  const navPath = path.resolve(process.cwd(), 'src/lib/navigation.ts');
  const sitemapPath = path.resolve(process.cwd(), 'src/app/sitemap.ts');
  const predeployPath = path.resolve(process.cwd(), 'scripts/predeploy-check.mjs');
  const autofinishLibPath = path.resolve(process.cwd(), 'src/lib/autofinish-svega.ts');
  const autofinishRoutePath = path.resolve(process.cwd(), 'src/app/api/autofinish-svega/route.ts');

  await test('Ključni fajlovi postoje', () => {
    assert(fs.existsSync(routePath), `${routePath} ne postoji`);
    assert(fs.existsSync(libPath), `${libPath} ne postoji`);
    assert(fs.existsSync(pagePath), `${pagePath} ne postoji`);
    assert(fs.existsSync(sekvencePath), `${sekvencePath} ne postoji`);
  });

  await test('API ruta koristi očekivane gradivne blokove', () => {
    const src = fs.readFileSync(routePath, 'utf8');
    assert(src.includes('buildMaksimusSvega'), 'Nedostaje buildMaksimusSvega');
    assert(src.includes('checkRateLimitGlobal'), 'Nedostaje checkRateLimitGlobal');
    assert(src.includes('apiRateLimited'), 'Nedostaje apiRateLimited');
    assert(src.includes('apiSuccess'), 'Nedostaje apiSuccess');
    assert(src.includes('apiInternalError'), 'Nedostaje apiInternalError');
    assert(src.includes('X-Maksimus-Contract-Version'), 'Nedostaje contract header');
    assert(src.includes('X-Maksimus-Model-Version'), 'Nedostaje model header');
  });

  await test('GET vraća 200 i payload sa meta poljima', async () => {
    const request = new Request('http://localhost/api/maksimus-svega', {
      headers: { 'x-forwarded-for': '127.0.0.70' },
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
    assert(typeof data['meta'] === 'object' && data['meta'] !== null, 'meta objekat');
  });

  await test('Rate limit vraća 429 nakon prekoračenja limita', async () => {
    const ip = `maksimus-rate-test-${process.pid}-${Date.now()}`;
    const statusi: number[] = [];
    for (let i = 0; i < MAKSIMUS_SVEGA_RATE_LIMIT + 1; i++) {
      const req = new Request('http://localhost/api/maksimus-svega', {
        headers: { 'x-forwarded-for': ip },
      });
      const res = await GET(req as NextRequest);
      statusi.push(res.status);
    }
    assertEqual(statusi[MAKSIMUS_SVEGA_RATE_LIMIT], 429, 'rate limit status');
  });

  await test('Wiring: navigacija, sitemap i autofinish uključuju maksimus-svega', () => {
    const navSrc = fs.readFileSync(navPath, 'utf8');
    const sitemapSrc = fs.readFileSync(sitemapPath, 'utf8');
    const predeploySrc = fs.readFileSync(predeployPath, 'utf8');
    const autofinishLibSrc = fs.readFileSync(autofinishLibPath, 'utf8');
    const autofinishRouteSrc = fs.readFileSync(autofinishRoutePath, 'utf8');

    assert(navSrc.includes('/maksimus-svega'), 'Navigacija ne sadrži /maksimus-svega');
    assert(sitemapSrc.includes('/maksimus-svega'), 'Sitemap ne sadrži /maksimus-svega');
    assert(sitemapSrc.includes('/api/maksimus-svega'), 'Sitemap ne sadrži /api/maksimus-svega');
    assert(predeploySrc.includes('maksimusContractReady'), 'predeploy check nije proširen za MAKSIMUS');
    assert(autofinishLibSrc.includes("'maksimus-svega'"), 'autofinish lib ne sadrži maksimus stage');
    assert(autofinishRouteSrc.includes("'maksimus-svega'"), 'autofinish route ne podržava maksimus stage');
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
