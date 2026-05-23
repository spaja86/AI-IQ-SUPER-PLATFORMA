// Autofinish #1359 — Autofinish DORA Metrics Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/autofinish-dora-metrics-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/autofinish-dora-metrics/route';
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
  console.log('\n🏁 Autofinish DORA Metrics — Route Coverage Test Suite (#1359)\n');

  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/autofinish-dora-metrics/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('API ruta koristi očekivane gradivne blokove', () => {
    assert(apiRouteSource.includes('getAutofinishDoraMetrics'), 'Nedostaje getAutofinishDoraMetrics');
    assert(apiRouteSource.includes('checkRateLimitGlobal'), 'Nedostaje checkRateLimitGlobal');
    assert(apiRouteSource.includes('Retry-After'), 'Nedostaje Retry-After header');
    assert(apiRouteSource.includes('X-Autofinish-Iteracija'), 'Nedostaje X-Autofinish-Iteracija header');
  });

  await test('Konstante su ažurirane', () => {
    assertEqual(APP_VERSION, '59.30.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1359, 'AUTOFINISH_COUNT');
  });

  await test('GET vraća 200 i očekivanu DORA strukturu', async () => {
    const request = new Request('http://localhost/api/autofinish-dora-metrics', {
      headers: {
        'x-forwarded-for': '127.0.0.1359',
      },
    });

    const response = await GET(request as NextRequest);
    assertEqual(response.status, 200, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
    assertEqual(body['autofinishBroj'] as number, AUTOFINISH_COUNT, 'autofinishBroj');
    assertEqual(body['period'] as string, 'posljednjih 7 sedmica', 'period');
    assert(typeof body['ukupnoMetrika'] === 'number', 'ukupnoMetrika number');

    const metrike = body['metrike'] as unknown[];
    assert(Array.isArray(metrike), 'metrike niz');
    assertEqual(metrike.length, body['ukupnoMetrika'] as number, 'ukupnoMetrika == metrike.length');
    assert(metrike.length > 0, 'metrike nije prazan niz');

    const eliteCount = body['eliteCount'] as number;
    const highCount = body['highCount'] as number;
    const mediumCount = body['mediumCount'] as number;
    const lowCount = body['lowCount'] as number;
    assertEqual(eliteCount + highCount + mediumCount + lowCount, metrike.length, 'rating zbir');

    const prva = metrike[0] as Record<string, unknown>;
    assert(typeof prva['id'] === 'string', 'metrika.id string');
    assert(typeof prva['naziv'] === 'string', 'metrika.naziv string');
    assert(typeof prva['vrijednost'] === 'number', 'metrika.vrijednost number');
    assert(typeof prva['trend'] === 'string', 'metrika.trend string');
    assert(Array.isArray(prva['sparkline']), 'metrika.sparkline niz');

    assert(typeof body['timestamp'] === 'string', 'timestamp string');
    assert(!Number.isNaN(Date.parse(body['timestamp'] as string)), 'timestamp ISO');

    assertEqual(
      response.headers.get('Cache-Control'),
      'public, s-maxage=300, stale-while-revalidate=1800',
      'Cache-Control',
    );
    assertEqual(response.headers.get('X-App-Version'), APP_VERSION, 'X-App-Version');
    assertEqual(response.headers.get('X-Autofinish-Iteracija'), String(AUTOFINISH_COUNT), 'X-Autofinish-Iteracija');
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
