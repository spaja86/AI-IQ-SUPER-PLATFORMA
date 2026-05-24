// Autofinish #1369 — Autofinish Ekosistem Snapshot Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/autofinish-ekosistem-snapshot-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/autofinish-ekosistem-snapshot/route';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  OMEGA_AI_OKTAVA_COUNT,
  OMEGA_AI_PERSONA_COUNT,
  OMEGA_AI_PERSONA_UKUPNO,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
  TOTAL_IGRICA,
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

function buildRequest(ip = '127.0.0.1'): NextRequest {
  return {
    headers: new Headers({ 'x-forwarded-for': ip }),
  } as unknown as NextRequest;
}

async function runTests(): Promise<void> {
  console.log('\n🏁 Autofinish Ekosistem Snapshot — Route Coverage Test Suite (#1369)\n');

  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/autofinish-ekosistem-snapshot/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('API ruta koristi očekivane gradivne blokove', () => {
    assert(apiRouteSource.includes('getAutofinishEkosistemSnapshot'), 'Nedostaje snapshot helper');
    assert(apiRouteSource.includes('checkRateLimitGlobal'), 'Nedostaje rate limit');
    assert(apiRouteSource.includes("'X-App-Version'"), 'Nedostaje X-App-Version header');
  });

  await test('GET vraća 200, payload i response header-e', async () => {
    const response = await GET(buildRequest('10.10.10.10'));
    assertEqual(response.status, 200, 'status');
    assertEqual(response.headers.get('X-App-Version'), APP_VERSION, 'header.X-App-Version');
    assertEqual(
      response.headers.get('X-Autofinish-Iteracija'),
      String(AUTOFINISH_COUNT),
      'header.X-Autofinish-Iteracija',
    );
    assertEqual(
      response.headers.get('Cache-Control'),
      'public, s-maxage=60, stale-while-revalidate=300',
      'header.Cache-Control',
    );

    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
    assertEqual(body['autofinishBroj'] as number, AUTOFINISH_COUNT, 'autofinishBroj');
    assertEqual(body['rute'] as number, TOTAL_ROUTES, 'rute');
    assertEqual(body['apiRute'] as number, TOTAL_API_ROUTES, 'apiRute');
    assertEqual(body['stranice'] as number, TOTAL_PAGES, 'stranice');
    assertEqual(body['dijagnostike'] as number, TOTAL_DIAGNOSTIKA, 'dijagnostike');
    assertEqual(body['igrice'] as number, TOTAL_IGRICA, 'igrice');
    assertEqual(body['omegaAiPersone'] as number, OMEGA_AI_PERSONA_COUNT, 'omegaAiPersone');
    assertEqual(body['omegaAiOktave'] as number, OMEGA_AI_OKTAVA_COUNT, 'omegaAiOktave');
    assertEqual(body['omegaAiUkupno'] as number, OMEGA_AI_PERSONA_UKUPNO, 'omegaAiUkupno');
    assert(typeof body['timestamp'] === 'string', 'timestamp string');
    assert(!Number.isNaN(Date.parse(body['timestamp'] as string)), 'timestamp ISO');
  });

  await test('Konstante su ažurirane', () => {
    assertEqual(APP_VERSION, '59.42.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1372, 'AUTOFINISH_COUNT');
    assertEqual(TOTAL_API_ROUTES, 1166, 'TOTAL_API_ROUTES');
    assertEqual(TOTAL_ROUTES, 1270, 'TOTAL_ROUTES');
    assertEqual(TOTAL_PAGES, 62, 'TOTAL_PAGES');
    assertEqual(TOTAL_DIAGNOSTIKA, 2368, 'TOTAL_DIAGNOSTIKA');
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
