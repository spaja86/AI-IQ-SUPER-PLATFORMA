// Autofinish #1371 — Autofinish Endpoint Inventar Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/autofinish-endpoint-inventar-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import { GET } from '../../app/api/autofinish-endpoint-inventar/route';
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
  console.log('\n🏁 Autofinish Endpoint Inventar — Route Coverage Test Suite (#1371)\n');

  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/autofinish-endpoint-inventar/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('API ruta koristi očekivane gradivne blokove', () => {
    assert(
      apiRouteSource.includes('AUTOFINISH-ENDPOINT-INVENTAR v1.0'),
      'Nedostaje inventar model',
    );
    assert(apiRouteSource.includes('procenat.toExponential(2)'), 'Nedostaje procenat formula');
    assert(apiRouteSource.includes('inventarKategorije'), 'Nedostaje inventarKategorije niz');
  });

  await test('GET vraća 200, payload i ključne sekcije', async () => {
    const response = await GET();
    assertEqual(response.status, 200, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['status'] as string, 'aktivan', 'status');
    assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
    assert(typeof body['naziv'] === 'string', 'naziv string');

    const inventar = body['inventar'] as Record<string, unknown>;
    assertEqual(inventar['sveAktivne'] as boolean, true, 'inventar.sveAktivne');
    assertEqual(
      inventar['model'] as string,
      'AUTOFINISH-ENDPOINT-INVENTAR v1.0',
      'inventar.model',
    );
    assertEqual(inventar['ukupnoKategorija'] as number, 5, 'inventar.ukupnoKategorija');
    const kategorije = inventar['kategorije'] as Array<Record<string, unknown>>;
    assert(Array.isArray(kategorije), 'kategorije niz');
    assertEqual(kategorije.length, 5, 'kategorije.length');
    for (const kategorija of kategorije) {
      assert(typeof kategorija['naziv'] === 'string', 'kategorija.naziv string');
      assert(typeof kategorija['tip'] === 'string', 'kategorija.tip string');
      assertEqual(kategorija['status'] as string, 'aktivan', 'kategorija.status');
      assert(typeof kategorija['opis'] === 'string', 'kategorija.opis string');
    }

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
    assertEqual(autofinish['ciljFormatiran'] as string, '3x10^17', 'autofinish.ciljFormatiran');

    assert(typeof body['timestamp'] === 'string', 'timestamp string');
    assert(!Number.isNaN(Date.parse(body['timestamp'] as string)), 'timestamp ISO');
  });

  await test('Konstante su ažurirane', () => {
    assert(/^\d+\.\d+\.\d+$/.test(APP_VERSION), 'APP_VERSION semver format');
    assert(AUTOFINISH_COUNT >= 1372, 'AUTOFINISH_COUNT baseline');
    assert(TOTAL_API_ROUTES >= 1166, 'TOTAL_API_ROUTES baseline');
    assert(TOTAL_ROUTES >= 1270, 'TOTAL_ROUTES baseline');
    assert(TOTAL_DIAGNOSTIKA >= 2368, 'TOTAL_DIAGNOSTIKA baseline');
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
