// Autofinish #1358 — Autofinish Digitalna Industrija Pregled Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/autofinish-digitalna-industrija-pregled-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import { GET } from '../../app/api/autofinish-digitalna-industrija-pregled/route';
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
  console.log('\n🏁 Autofinish Digitalna Industrija Pregled — Route Coverage Test Suite (#1358)\n');

  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/autofinish-digitalna-industrija-pregled/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('API ruta koristi očekivane gradivne blokove', () => {
    assert(apiRouteSource.includes('DI_BLOKOVI'), 'Nedostaje DI_BLOKOVI');
    assert(apiRouteSource.includes('DIJAGNOSTIKE'), 'Nedostaje DIJAGNOSTIKE');
    assert(apiRouteSource.includes('digitalnaIndustrija'), 'Nedostaje digitalnaIndustrija');
    assert(apiRouteSource.includes('autofinishProgres'), 'Nedostaje autofinishProgres');
    assert(apiRouteSource.includes('TOTAL_API_ROUTES'), 'Nedostaje TOTAL_API_ROUTES');
    assert(apiRouteSource.includes('toExponential(2)'), 'Nedostaje formatiranje procenta');
  });

  await test('Konstante su ažurirane', () => {
    assertEqual(APP_VERSION, '59.30.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1359, 'AUTOFINISH_COUNT');
  });

  await test('GET vraća 200 i očekivanu strukturu', async () => {
    const response = await GET();
    assertEqual(response.status, 200, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['status'] as string, 'AKTIVAN', 'status');
    assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
    assert((body['naziv'] as string).includes('Digitalna Industrija Pregled'), 'naziv');

    const digitalnaIndustrija = body['digitalnaIndustrija'] as Record<string, unknown>;
    assert(typeof digitalnaIndustrija === 'object' && digitalnaIndustrija !== null, 'digitalnaIndustrija objekat');
    assert(Array.isArray(digitalnaIndustrija['blokovi']), 'blokovi niz');
    assert((digitalnaIndustrija['blokovi'] as unknown[]).length > 0, 'blokovi nisu prazni');
    assertEqual(
      digitalnaIndustrija['ukupnoBlokova'] as number,
      (digitalnaIndustrija['blokovi'] as unknown[]).length,
      'ukupnoBlokova',
    );
    assertEqual(digitalnaIndustrija['sviBlokoviAktivni'] as boolean, true, 'sviBlokoviAktivni');

    const dijagnostike = body['dijagnostike'] as Record<string, unknown>;
    assert(typeof dijagnostike === 'object' && dijagnostike !== null, 'dijagnostike objekat');
    assert(Array.isArray(dijagnostike['provere']), 'dijagnostike.provere niz');
    assertEqual(
      dijagnostike['ukupno'] as number,
      (dijagnostike['provere'] as unknown[]).length,
      'dijagnostike.ukupno',
    );

    const autofinishProgres = body['autofinishProgres'] as Record<string, unknown>;
    assertEqual(autofinishProgres['iteracija'] as number, AUTOFINISH_COUNT, 'autofinishProgres.iteracija');
    assertEqual(autofinishProgres['cilj'] as number, AUTOFINISH_TARGET, 'autofinishProgres.cilj');
    assertEqual(autofinishProgres['ciljFormatiran'] as string, '3×10¹⁷', 'autofinishProgres.ciljFormatiran');
    assert(typeof autofinishProgres['procenat'] === 'string', 'autofinishProgres.procenat string');

    const ekosistem = body['ekosistem'] as Record<string, unknown>;
    assertEqual(ekosistem['apiEndpointi'] as number, TOTAL_API_ROUTES, 'ekosistem.apiEndpointi');
    assertEqual(ekosistem['ukupnoRuta'] as number, TOTAL_ROUTES, 'ekosistem.ukupnoRuta');
    assertEqual(ekosistem['dijagnostike'] as number, TOTAL_DIAGNOSTIKA, 'ekosistem.dijagnostike');

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
