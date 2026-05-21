// Autofinish #1336 — Verzija Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/verzija-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import { GET } from '../../app/api/verzija/route';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  AUTOFINISH_TARGET,
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

async function runTests(): Promise<void> {
  console.log('\n🏁 Autofinish Verzija — Route Coverage Test Suite (#1336)\n');

  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/verzija/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('API ruta koristi očekivane gradivne blokove', () => {
    assert(apiRouteSource.includes('APP_VERSION'), 'Nedostaje APP_VERSION');
    assert(apiRouteSource.includes('AUTOFINISH_COUNT'), 'Nedostaje AUTOFINISH_COUNT');
    assert(apiRouteSource.includes('TOTAL_API_ROUTES'), 'Nedostaje TOTAL_API_ROUTES');
    assert(apiRouteSource.includes('TOTAL_ROUTES'), 'Nedostaje TOTAL_ROUTES');
    assert(apiRouteSource.includes('TOTAL_DIAGNOSTIKA'), 'Nedostaje TOTAL_DIAGNOSTIKA');
    assert(apiRouteSource.includes('NextResponse.json'), 'Nedostaje NextResponse.json');
  });

  await test('GET vraća 200 i ispravan payload', async () => {
    const response = await GET();
    assertEqual(response.status, 200, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
    assertEqual(body['status'] as string, 'operational', 'status');
    assert(typeof body['naziv'] === 'string', 'naziv string');
    assert(typeof body['kompanija'] === 'string', 'kompanija string');
    assert(typeof body['timestamp'] === 'string', 'timestamp string');
    assert(!Number.isNaN(Date.parse(body['timestamp'] as string)), 'timestamp ISO');
  });

  await test('GET vraća ispravan blok brojevi', async () => {
    const response = await GET();
    const body = (await response.json()) as Record<string, unknown>;
    const brojevi = body['brojevi'] as Record<string, unknown>;

    assert(typeof brojevi === 'object' && brojevi !== null, 'brojevi objekat');
    assertEqual(brojevi['stranice'] as number, TOTAL_PAGES, 'brojevi.stranice');
    assertEqual(brojevi['apiRute'] as number, TOTAL_API_ROUTES, 'brojevi.apiRute');
    assertEqual(brojevi['ukupnoRuta'] as number, TOTAL_ROUTES, 'brojevi.ukupnoRuta');
    assertEqual(brojevi['dijagnostike'] as number, TOTAL_DIAGNOSTIKA, 'brojevi.dijagnostike');
    assertEqual(brojevi['igrice'] as number, TOTAL_IGRICA, 'brojevi.igrice');
    assert(typeof brojevi['omegaAIPersone'] === 'number', 'brojevi.omegaAIPersone number');
    assert(typeof brojevi['spajaProVerzije'] === 'number', 'brojevi.spajaProVerzije number');
  });

  await test('GET vraća ispravan blok autofinish', async () => {
    const response = await GET();
    const body = (await response.json()) as Record<string, unknown>;
    const autofinish = body['autofinish'] as Record<string, unknown>;

    assert(typeof autofinish === 'object' && autofinish !== null, 'autofinish objekat');
    assertEqual(autofinish['iteracija'] as number, AUTOFINISH_COUNT, 'autofinish.iteracija');
    assertEqual(autofinish['cilj'] as number, AUTOFINISH_TARGET, 'autofinish.cilj');
    assert(typeof autofinish['ciljFormatiran'] === 'string', 'autofinish.ciljFormatiran string');
  });

  await test('GET vraća listu tehnologija', async () => {
    const response = await GET();
    const body = (await response.json()) as Record<string, unknown>;
    const tehnologije = body['tehnologije'] as string[];

    assert(Array.isArray(tehnologije), 'tehnologije niz');
    assert(tehnologije.length > 0, 'tehnologije nije prazan');
    assert(tehnologije.some((t) => t.includes('Next.js')), 'tehnologije sadrži Next.js');
    assert(tehnologije.some((t) => t.includes('TypeScript')), 'tehnologije sadrži TypeScript');
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
