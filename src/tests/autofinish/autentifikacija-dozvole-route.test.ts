// Autofinish #1351 — Autentifikacija Dozvole Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/autentifikacija-dozvole-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import { GET } from '../../app/api/autentifikacija-dozvole/route';
import { dozvole } from '../../lib/autentifikacija';
import { APP_VERSION, AUTOFINISH_COUNT, TOTAL_API_ROUTES, TOTAL_ROUTES, TOTAL_DIAGNOSTIKA } from '../../lib/constants';

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
  console.log('\n🏁 Autentifikacija Dozvole — Route Coverage Test Suite (#1351)\n');

  const apiRoutePath = path.resolve(
    process.cwd(),
    'src/app/api/autentifikacija-dozvole/route.ts',
  );
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('Ruta exportuje GET handler', () => {
    assert(apiRouteSource.includes('export async function GET'), 'Nedostaje export async function GET');
  });

  await test('Ruta koristi dozvole i ukupnoDozvola', () => {
    assert(apiRouteSource.includes('dozvole'), 'Nedostaje dozvole');
    assert(apiRouteSource.includes('ukupnoDozvola'), 'Nedostaje ukupnoDozvola');
  });

  await test('Ruta vraća sistem, verzija i timestamp polja', () => {
    assert(apiRouteSource.includes("'Autentifikacija — Dozvole'"), 'Nedostaje sistem naziv');
    assert(apiRouteSource.includes('APP_VERSION'), 'Nedostaje APP_VERSION');
    assert(apiRouteSource.includes('timestamp'), 'Nedostaje timestamp');
  });

  await test('GET vraća 200 sa korektnim payload-om', async () => {
    const response = await GET();
    assertEqual(response.status, 200, 'HTTP status');
    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['sistem'] as string, 'Autentifikacija — Dozvole', 'sistem');
    assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
    assert(Array.isArray(body['dozvole']), 'dozvole mora biti niz');
    assert(typeof body['ukupnoDozvola'] === 'number', 'ukupnoDozvola mora biti broj');
    assert(typeof body['timestamp'] === 'string', 'timestamp mora biti string');
  });

  await test('ukupnoDozvola odgovara dužini dozvole niza', async () => {
    const response = await GET();
    const body = (await response.json()) as Record<string, unknown>;
    const list = body['dozvole'] as unknown[];
    const total = body['ukupnoDozvola'] as number;
    assertEqual(total, list.length, 'ukupnoDozvola mora pratiti dobijeni niz');
  });

  await test('dozvole iz API-ja odgovaraju lib/autentifikacija eksportu', async () => {
    const response = await GET();
    const body = (await response.json()) as Record<string, unknown>;
    const list = body['dozvole'] as unknown[];
    assertEqual(list.length, dozvole.length, 'dužina dozvola');
    assertEqual(body['ukupnoDozvola'] as number, dozvole.length, 'ukupnoDozvola');
  });

  await test('APP_VERSION je 59.23.0', () => {
    assertEqual(APP_VERSION, '59.23.0', 'APP_VERSION');
  });

  await test('AUTOFINISH_COUNT je 1352', () => {
    assertEqual(AUTOFINISH_COUNT, 1352, 'AUTOFINISH_COUNT');
  });

  await test('Konstante su konzistentne', () => {
    assert(TOTAL_API_ROUTES > 0, 'TOTAL_API_ROUTES mora biti pozitivan');
    assert(TOTAL_ROUTES > 0, 'TOTAL_ROUTES mora biti pozitivan');
    assert(TOTAL_DIAGNOSTIKA > 0, 'TOTAL_DIAGNOSTIKA mora biti pozitivan');
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
