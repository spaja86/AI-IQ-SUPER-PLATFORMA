// Autofinish #1335 — Autofinish Changelog Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/autofinish-changelog-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/autofinish-changelog/route';
import { APP_VERSION, AUTOFINISH_COUNT, TOTAL_API_ROUTES, TOTAL_DIAGNOSTIKA, TOTAL_ROUTES } from '../../lib/constants';

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
  console.log('\n🏁 Autofinish Changelog — Route Coverage Test Suite (#1335)\n');

  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/autofinish-changelog/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('API ruta koristi očekivane gradivne blokove', () => {
    assert(apiRouteSource.includes('getLastNIterations'), 'Nedostaje getLastNIterations');
    assert(apiRouteSource.includes('DEFAULT_N = 10'), 'Nedostaje DEFAULT_N');
    assert(apiRouteSource.includes('MAX_N = 100'), 'Nedostaje MAX_N');
    assert(apiRouteSource.includes('checkRateLimitGlobal'), 'Nedostaje checkRateLimitGlobal');
    assert(apiRouteSource.includes('X-Autofinish-Iteracija'), 'Nedostaje X-Autofinish-Iteracija header');
  });

  await test('GET vraća 200, payload i heder-e za default query', async () => {
    const request = new Request('http://localhost/api/autofinish-changelog', {
      headers: { 'x-forwarded-for': '127.0.0.1' },
    });
    const response = await GET(request as NextRequest);
    assertEqual(response.status, 200, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
    assertEqual(body['autofinishIteracija'] as number, AUTOFINISH_COUNT, 'autofinishIteracija');
    assertEqual(body['n'] as number, 10, 'n');
    assert(typeof body['ukupno'] === 'number', 'ukupno number');
    assert(Array.isArray(body['stavke']), 'stavke niz');
    assert(typeof body['timestamp'] === 'string', 'timestamp string');
    assert(!Number.isNaN(Date.parse(body['timestamp'] as string)), 'timestamp ISO');

    const stavke = body['stavke'] as Array<Record<string, unknown>>;
    assertEqual(body['ukupno'] as number, stavke.length, 'ukupno=stavke.length');
    assert(stavke.length > 0, 'stavke nije prazan');
    assert(stavke.length <= 10, 'stavke.length <= 10');

    for (const stavka of stavke) {
      assert(typeof stavka['broj'] === 'number', 'stavka.broj number');
      assert(typeof stavka['opis'] === 'string', 'stavka.opis string');
    }

    assertEqual(
      response.headers.get('Cache-Control'),
      'public, s-maxage=60, stale-while-revalidate=300',
      'Cache-Control',
    );
    assertEqual(response.headers.get('X-App-Version'), APP_VERSION, 'X-App-Version');
    assertEqual(response.headers.get('X-Autofinish-Iteracija'), String(AUTOFINISH_COUNT), 'X-Autofinish-Iteracija');
  });

  await test('GET primenjuje max limit na query n', async () => {
    const request = new Request('http://localhost/api/autofinish-changelog?n=999', {
      headers: { 'x-forwarded-for': '127.0.0.2' },
    });
    const response = await GET(request as NextRequest);
    assertEqual(response.status, 200, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['n'] as number, 100, 'n max');
    assert(typeof body['ukupno'] === 'number', 'ukupno number');
    assert((body['ukupno'] as number) <= 100, 'ukupno <= 100');
  });

  await test('Konstante su ažurirane', () => {
    assertEqual(APP_VERSION, '59.16.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1337, 'AUTOFINISH_COUNT');
    assertEqual(TOTAL_API_ROUTES, 1159, 'TOTAL_API_ROUTES');
    assertEqual(TOTAL_ROUTES, 1260, 'TOTAL_ROUTES');
    assertEqual(TOTAL_DIAGNOSTIKA, 2364, 'TOTAL_DIAGNOSTIKA');
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
