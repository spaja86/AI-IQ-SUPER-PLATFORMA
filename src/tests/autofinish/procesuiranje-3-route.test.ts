// Autofinish #1415 — Procesuiranje 3 Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/procesuiranje-3-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import {
  GET,
  PROCESUIRANJE_3_RATE_LIMIT,
} from '../../app/api/procesuiranje-3/route';
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
  console.log('\n⚙️ Procesuiranje 3 — Route Coverage Test Suite (#1415)\n');

  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/procesuiranje-3/route.ts');
  const libPath = path.resolve(process.cwd(), 'src/lib/procesuiranje-3.ts');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('Lib modul fajl postoji', () => {
    assert(fs.existsSync(libPath), `${libPath} ne postoji`);
  });

  await test('API ruta koristi očekivane gradivne blokove', () => {
    const src = fs.readFileSync(apiRoutePath, 'utf8');
    assert(src.includes('buildProcesuiranje3'), 'Nedostaje buildProcesuiranje3');
    assert(src.includes('checkRateLimitGlobal'), 'Nedostaje checkRateLimitGlobal');
    assert(src.includes('apiRateLimited'), 'Nedostaje apiRateLimited');
    assert(src.includes('apiSuccess'), 'Nedostaje apiSuccess');
    assert(src.includes('apiInternalError'), 'Nedostaje apiInternalError');
    assert(src.includes('force-dynamic'), 'Nedostaje force-dynamic');
    assert(src.includes('X-Procesuiranje3-Contract-Version'), 'Nedostaje contract header');
    assert(src.includes('X-Procesuiranje3-Model-Version'), 'Nedostaje model header');
  });

  await test('GET vraća 200 i ispravnu strukturu', async () => {
    const request = new Request('http://localhost/api/procesuiranje-3', {
      headers: { 'x-forwarded-for': '127.0.0.70' },
    });
    const response = await GET(request as NextRequest);
    assertEqual(response.status, 200, 'HTTP status');
    assert(typeof response.headers.get('X-Procesuiranje3-Contract-Version') === 'string', 'contract header');
    assert(typeof response.headers.get('X-Procesuiranje3-Model-Version') === 'string', 'model header');

    const body = (await response.json()) as Record<string, unknown>;
    assert(typeof body['data'] === 'object' && body['data'] !== null, 'data objekat');
    assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
    assert(typeof body['timestamp'] === 'string', 'timestamp string');
    assert(!Number.isNaN(Date.parse(body['timestamp'] as string)), 'timestamp ISO');
  });

  await test('Rezultat ima v3 polja i dual-run kompatibilnost', async () => {
    const request = new Request('http://localhost/api/procesuiranje-3', {
      headers: { 'x-forwarded-for': '127.0.0.71' },
    });
    const response = await GET(request as NextRequest);
    const body = (await response.json()) as Record<string, unknown>;
    const data = body['data'] as Record<string, unknown>;

    assert(typeof data['sistem'] === 'string', 'sistem string');
    assertEqual(data['verzija'] as string, APP_VERSION, 'data.verzija');
    assertEqual(data['autofinishBroj'] as number, AUTOFINISH_COUNT, 'autofinishBroj');
    assert(typeof data['ukupanScore'] === 'number', 'ukupanScore number');
    assert(typeof data['trend'] === 'object' && data['trend'] !== null, 'trend objekat');
    assert(Array.isArray(data['history']), 'history niz');
    assert(typeof data['priorityBuckets'] === 'object' && data['priorityBuckets'] !== null, 'priorityBuckets objekat');
    assert(typeof data['sla'] === 'object' && data['sla'] !== null, 'sla objekat');
    assert(typeof data['domeni'] === 'object' && data['domeni'] !== null, 'domeni objekat');

    const meta = data['meta'] as Record<string, unknown>;
    assertEqual(meta['contractVersion'] as string, 'v3', 'meta.contractVersion');
    assertEqual(meta['compatibilityMode'] as string, 'dual-run-v2-v3', 'meta.compatibilityMode');
    assertEqual(meta['v2SourceOfTruth'] as string, '/api/procesuiranje-svega', 'meta.v2SourceOfTruth');
  });

  await test('Domeni sadrže i platformski domen', async () => {
    const request = new Request('http://localhost/api/procesuiranje-3', {
      headers: { 'x-forwarded-for': '127.0.0.72' },
    });
    const response = await GET(request as NextRequest);
    const body = (await response.json()) as Record<string, unknown>;
    const data = body['data'] as Record<string, unknown>;
    const domeni = data['domeni'] as Record<string, unknown>;

    assert('platformski' in domeni, 'Nedostaje platformski domen');
    assert(Object.keys(domeni).length >= 9, 'Očekivano najmanje 9 domena u v3 modelu');
  });

  await test('Rate limit vraća 429 nakon prekoračenja limita', async () => {
    const ip = `procesuiranje-3-rate-test-${process.pid}-${Date.now()}`;
    const statusi: number[] = [];
    for (let i = 0; i < PROCESUIRANJE_3_RATE_LIMIT + 1; i++) {
      const req = new Request('http://localhost/api/procesuiranje-3', {
        headers: { 'x-forwarded-for': ip },
      });
      const res = await GET(req as NextRequest);
      statusi.push(res.status);
    }
    assertEqual(statusi[PROCESUIRANJE_3_RATE_LIMIT], 429, 'rate limit status');
  });

  await test('Wiring: navigacija, sitemap i predeploy uključuju PROCESIRANJE 3', () => {
    const navPath = path.resolve(process.cwd(), 'src/lib/navigation.ts');
    const sitemapPath = path.resolve(process.cwd(), 'src/app/sitemap.ts');
    const predeployPath = path.resolve(process.cwd(), 'scripts/predeploy-check.mjs');

    const navSrc = fs.readFileSync(navPath, 'utf8');
    const sitemapSrc = fs.readFileSync(sitemapPath, 'utf8');
    const predeploySrc = fs.readFileSync(predeployPath, 'utf8');

    assert(navSrc.includes('/procesuiranje-3'), 'Navigacija ne sadrži /procesuiranje-3');
    assert(sitemapSrc.includes('/procesuiranje-3'), 'Sitemap ne sadrži /procesuiranje-3');
    assert(sitemapSrc.includes('/api/procesuiranje-3'), 'Sitemap ne sadrži /api/procesuiranje-3');
    assert(predeploySrc.includes('procesuiranje3ContractReady'), 'predeploy check nije proširen za PROCESIRANJE 3');
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
