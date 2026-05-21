// Autofinish #1332 — Autofinish Full Report Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/autofinish-full-report-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/autofinish-full-report/route';
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
  console.log('\n🏁 Autofinish Full Report — Route Coverage Test Suite (#1332)\n');

  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/autofinish-full-report/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('API ruta koristi očekivane gradivne blokove', () => {
    assert(apiRouteSource.includes('getAutofinishPetljaSummary'), 'Nedostaje getAutofinishPetljaSummary');
    assert(apiRouteSource.includes('getAutofinishEkosistemSnapshot'), 'Nedostaje getAutofinishEkosistemSnapshot');
    assert(apiRouteSource.includes('getAutofinishHealthSummary'), 'Nedostaje getAutofinishHealthSummary');
    assert(apiRouteSource.includes('getLastNIterations(10)'), 'Nedostaje getLastNIterations(10)');
    assert(apiRouteSource.includes('X-Autofinish-Iteracija'), 'Nedostaje X-Autofinish-Iteracija header');
  });

  await test('GET vraća 200, payload i heder-e', async () => {
    const request = new Request('http://localhost/api/autofinish-full-report', {
      headers: { 'x-forwarded-for': '127.0.0.1' },
    });

    const response = await GET(request as NextRequest);
    assertEqual(response.status, 200, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
    assertEqual(body['autofinishIteracija'] as number, AUTOFINISH_COUNT, 'autofinishIteracija');

    const status = body['status'] as Record<string, unknown>;
    assert(typeof status['status'] === 'string', 'status.status string');
    assert(typeof status['podsistemi'] === 'string', 'status.podsistemi string');
    assert(typeof status['progres'] === 'string', 'status.progres string');
    assert(typeof status['iteracije'] === 'number', 'status.iteracije number');
    assertEqual(status['autofinish'] as number, AUTOFINISH_COUNT, 'status.autofinish');

    const ekosistem = body['ekosistem'] as Record<string, unknown>;
    assertEqual(ekosistem['apiRute'] as number, TOTAL_API_ROUTES, 'ekosistem.apiRute');
    assertEqual(ekosistem['rute'] as number, TOTAL_ROUTES, 'ekosistem.rute');
    assertEqual(ekosistem['dijagnostike'] as number, TOTAL_DIAGNOSTIKA, 'ekosistem.dijagnostike');

    const zdravlje = body['zdravlje'] as Record<string, unknown>;
    assert(typeof zdravlje['zdravlje'] === 'number', 'zdravlje.zdravlje number');
    assert(typeof zdravlje['ukupnoProvera'] === 'number', 'zdravlje.ukupnoProvera number');
    assert(Array.isArray(zdravlje['podsistemi']), 'zdravlje.podsistemi niz');

    const changelog = body['changelog'] as Record<string, unknown>;
    assert(typeof changelog['ukupno'] === 'number', 'changelog.ukupno number');
    assert(Array.isArray(changelog['stavke']), 'changelog.stavke niz');
    assert((changelog['ukupno'] as number) <= 10, 'changelog.ukupno <= 10');
    assert(typeof body['timestamp'] === 'string', 'timestamp string');

    assertEqual(
      response.headers.get('Cache-Control'),
      'public, s-maxage=30, stale-while-revalidate=120',
      'Cache-Control',
    );
    assertEqual(response.headers.get('X-App-Version'), APP_VERSION, 'X-App-Version');
    assertEqual(response.headers.get('X-Autofinish-Iteracija'), String(AUTOFINISH_COUNT), 'X-Autofinish-Iteracija');
  });

  await test('Konstante su ažurirane', () => {
    assertEqual(APP_VERSION, '59.13.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1334, 'AUTOFINISH_COUNT');
    assertEqual(TOTAL_API_ROUTES, 1158, 'TOTAL_API_ROUTES');
    assertEqual(TOTAL_ROUTES, 1258, 'TOTAL_ROUTES');
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
