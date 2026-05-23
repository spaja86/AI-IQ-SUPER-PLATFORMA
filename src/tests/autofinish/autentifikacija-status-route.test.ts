// Autofinish #1352 — Autentifikacija Status Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/autentifikacija-status-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import { GET } from '../../app/api/autentifikacija-status/route';
import { autentifikacijaSistem, authKonfiguracija } from '../../lib/autentifikacija';
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
  console.log('\n🏁 Autentifikacija Status — Route Coverage Test Suite (#1352)\n');

  const apiRoutePath = path.resolve(
    process.cwd(),
    'src/app/api/autentifikacija-status/route.ts',
  );
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('Ruta exportuje GET handler', () => {
    assert(apiRouteSource.includes('export async function GET'), 'Nedostaje export async function GET');
  });

  await test('Ruta koristi autentifikacijaSistem i authKonfiguracija', () => {
    assert(apiRouteSource.includes('autentifikacijaSistem'), 'Nedostaje autentifikacijaSistem');
    assert(apiRouteSource.includes('authKonfiguracija'), 'Nedostaje authKonfiguracija');
  });

  await test('Ruta vraća status, konfiguracija i zbirna polja', () => {
    assert(apiRouteSource.includes("'Autentifikacija — Status'"), 'Nedostaje sistem naziv');
    assert(apiRouteSource.includes('ukupnoDozvola'), 'Nedostaje ukupnoDozvola');
    assert(apiRouteSource.includes('ukupnoMogucnosti'), 'Nedostaje ukupnoMogucnosti');
  });

  await test('GET vraća 200 sa korektnim payload-om', async () => {
    const response = await GET();
    assertEqual(response.status, 200, 'HTTP status');
    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['sistem'] as string, 'Autentifikacija — Status', 'sistem');
    assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
    assertEqual(body['status'] as string, autentifikacijaSistem.status, 'status');
    assert(typeof body['konfiguracija'] === 'object' && body['konfiguracija'] !== null, 'konfiguracija mora biti objekat');
    assert(typeof body['timestamp'] === 'string', 'timestamp mora biti string');
  });

  await test('Konfiguracija u API-ju prati authKonfiguracija vrednosti', async () => {
    const response = await GET();
    const body = (await response.json()) as Record<string, unknown>;
    const konfiguracija = body['konfiguracija'] as Record<string, unknown>;
    assertEqual(konfiguracija['jwtIsticanje'] as string, authKonfiguracija.jwtIsticanje, 'jwtIsticanje');
    assertEqual(konfiguracija['refreshIsticanje'] as string, authKonfiguracija.refreshIsticanje, 'refreshIsticanje');
    assertEqual(konfiguracija['maxSesija'] as number, authKonfiguracija.maxSesija, 'maxSesija');
    assertEqual(konfiguracija['dvofaktorObavezan'] as boolean, authKonfiguracija.dvofaktorObavezan, 'dvofaktorObavezan');
  });

  await test('Zbirne metrike prate autentifikacijaSistem', async () => {
    const response = await GET();
    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['ukupnoDozvola'] as number, autentifikacijaSistem.dozvole.length, 'ukupnoDozvola');
    assertEqual(body['ukupnoMogucnosti'] as number, autentifikacijaSistem.mogucnosti.length, 'ukupnoMogucnosti');
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
