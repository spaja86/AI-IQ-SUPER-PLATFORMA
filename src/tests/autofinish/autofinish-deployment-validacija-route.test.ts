// Autofinish #1357 — Autofinish Deployment Validacija Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/autofinish-deployment-validacija-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import { GET } from '../../app/api/autofinish-deployment-validacija/route';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  AUTOFINISH_TARGET,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
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
  console.log('\n🏁 Autofinish Deployment Validacija — Route Coverage Test Suite (#1357)\n');

  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/autofinish-deployment-validacija/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('API ruta koristi očekivane gradivne blokove', () => {
    assert(apiRouteSource.includes('/api/autofinish-deployment-validacija') || apiRoutePath.includes('autofinish-deployment-validacija'), 'Nedostaje referenca na /api/autofinish-deployment-validacija');
    assert(apiRouteSource.includes('validacije'), 'Nedostaje validacije');
    assert(apiRouteSource.includes('sveUspesne: true'), 'Nedostaje sveUspesne');
    assert(apiRouteSource.includes('toExponential(2)'), 'Nedostaje formatiranje procenta');
    assert(apiRouteSource.includes('TOTAL_API_ROUTES'), 'Nedostaje TOTAL_API_ROUTES');
    assert(apiRouteSource.includes('TOTAL_DIAGNOSTIKA'), 'Nedostaje TOTAL_DIAGNOSTIKA');
  });

  await test('Konstante su ažurirane', () => {
    assertEqual(APP_VERSION, '59.30.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1359, 'AUTOFINISH_COUNT');
  });

  await test('GET vraća 200 i očekivanu strukturu', async () => {
    const response = await GET();
    assertEqual(response.status, 200, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['status'] as string, 'aktivan', 'status');
    assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
    assert((body['naziv'] as string).includes('Deployment Validacija'), 'naziv');

    const validacija = body['validacija'] as Record<string, unknown>;
    assert(typeof validacija === 'object' && validacija !== null, 'validacija objekat');
    assertEqual(validacija['sveUspesne'] as boolean, true, 'sveUspesne');
    assert(Array.isArray(validacija['provere']), 'provere niz');
    assertEqual(validacija['ukupnoProvera'] as number, (validacija['provere'] as unknown[]).length, 'ukupnoProvera');

    const progres = body['progres'] as Record<string, unknown>;
    assertEqual(progres['iteracija'] as number, AUTOFINISH_COUNT, 'progres.iteracija');
    assertEqual(progres['cilj'] as number, AUTOFINISH_TARGET, 'progres.cilj');
    assertEqual(progres['ciljFormatiran'] as string, '3x10^17', 'progres.ciljFormatiran');
    assert(typeof progres['procenat'] === 'string', 'progres.procenat string');

    const ekosistem = body['ekosistem'] as Record<string, unknown>;
    assertEqual(ekosistem['apiEndpointi'] as number, TOTAL_API_ROUTES, 'ekosistem.apiEndpointi');
    assertEqual(ekosistem['ukupnoRuta'] as number, TOTAL_ROUTES, 'ekosistem.ukupnoRuta');
    assertEqual(ekosistem['dijagnostike'] as number, TOTAL_DIAGNOSTIKA, 'ekosistem.dijagnostike');

    const autofinish = body['autofinish'] as Record<string, unknown>;
    assertEqual(autofinish['iteracija'] as number, AUTOFINISH_COUNT, 'autofinish.iteracija');
    assertEqual(autofinish['cilj'] as number, AUTOFINISH_TARGET, 'autofinish.cilj');

    assert(typeof body['timestamp'] === 'string', 'timestamp string');
    assert(!Number.isNaN(Date.parse(body['timestamp'] as string)), 'timestamp ISO');
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
