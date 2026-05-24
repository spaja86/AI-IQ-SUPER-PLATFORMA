// Autofinish #1364 — Autofinish Top Iteracije Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/autofinish-top-iteracije-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/autofinish-top-iteracije/route';
import { APP_VERSION, AUTOFINISH_COUNT, TOTAL_API_ROUTES, TOTAL_ROUTES } from '../../lib/constants';

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
  console.log('\n🏁 Autofinish Top Iteracije — Route Coverage Test Suite (#1364)\n');

  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/autofinish-top-iteracije/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('API ruta koristi očekivane gradivne blokove', () => {
    assert(apiRouteSource.includes('getAutofinishTopIteracije'), 'Nedostaje getAutofinishTopIteracije');
    assert(apiRouteSource.includes('checkRateLimitGlobal'), 'Nedostaje checkRateLimitGlobal');
    assert(apiRouteSource.includes('X-Autofinish-Iteracija'), 'Nedostaje X-Autofinish-Iteracija header');
  });

  await test('GET vraća 200 i payload za default n', async () => {
    const request = new Request('http://localhost/api/autofinish-top-iteracije', {
      headers: { 'x-forwarded-for': '127.0.0.64' },
    });
    const response = await GET(request as NextRequest);

    assertEqual(response.status, 200, 'status');
    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
    assertEqual(body['autofinishBroj'] as number, AUTOFINISH_COUNT, 'autofinishBroj');
    assertEqual(body['n'] as number, 10, 'n default');
    assert(Array.isArray(body['iteracije']), 'iteracije niz');
    assertEqual(response.headers.get('X-App-Version'), APP_VERSION, 'X-App-Version');
    assertEqual(response.headers.get('X-Autofinish-Iteracija'), String(AUTOFINISH_COUNT), 'X-Autofinish-Iteracija');
  });

  await test('GET vraća 200 i payload za n=5', async () => {
    const request = new Request('http://localhost/api/autofinish-top-iteracije?n=5', {
      headers: { 'x-forwarded-for': '127.0.0.65' },
    });
    const response = await GET(request as NextRequest);

    assertEqual(response.status, 200, 'status');
    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['n'] as number, 5, 'n');
    assertEqual((body['iteracije'] as unknown[]).length, 5, 'iteracije.length');
  });

  await test('GET vraća 400 za n=0', async () => {
    const request = new Request('http://localhost/api/autofinish-top-iteracije?n=0', {
      headers: { 'x-forwarded-for': '127.0.0.66' },
    });
    const response = await GET(request as NextRequest);

    assertEqual(response.status, 400, 'status');
    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['error'] as string, 'INVALID_PARAMS', 'error');
  });

  await test('GET vraća 400 za n=201', async () => {
    const request = new Request('http://localhost/api/autofinish-top-iteracije?n=201', {
      headers: { 'x-forwarded-for': '127.0.0.67' },
    });
    const response = await GET(request as NextRequest);

    assertEqual(response.status, 400, 'status');
    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['error'] as string, 'N_PREVELIK', 'error');
  });

  await test('Konstante su ažurirane', () => {
    assertEqual(APP_VERSION, '59.39.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1369, 'AUTOFINISH_COUNT');
    assertEqual(TOTAL_API_ROUTES, 1166, 'TOTAL_API_ROUTES');
    assertEqual(TOTAL_ROUTES, 1270, 'TOTAL_ROUTES');
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
