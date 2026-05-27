// Autofinish #1355 — Autofinish Validacija Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/autofinish-validacija-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import { GET } from '../../app/api/autofinish-validacija/route';
import { APP_VERSION, AUTOFINISH_COUNT, AUTOFINISH_TARGET, TOTAL_API_ROUTES, TOTAL_DIAGNOSTIKA, TOTAL_ROUTES } from '../../lib/constants';

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
  console.log('\n🏁 Autofinish Validacija — Route Coverage Test Suite (#1355)\n');

  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/autofinish-validacija/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('API ruta koristi očekivane gradivne blokove', () => {
    assert(apiRouteSource.includes('AUTOFINISH_COUNT'), 'Nedostaje AUTOFINISH_COUNT');
    assert(apiRouteSource.includes('AUTOFINISH_TARGET'), 'Nedostaje AUTOFINISH_TARGET');
    assert(apiRouteSource.includes('validacijeProvere'), 'Nedostaje validacijeProvere');
    assert(apiRouteSource.includes('sveUspesne: true'), 'Nedostaje sveUspesne');
    assert(apiRouteSource.includes('toExponential(2)'), 'Nedostaje formatiranje procenta');
  });

  await test('Konstante su ažurirane', () => {
    assert(/^\d+\.\d+\.\d+$/.test(APP_VERSION), 'APP_VERSION semver format');
    assert(AUTOFINISH_COUNT >= 1359, 'AUTOFINISH_COUNT baseline');
  });

  await test('GET vraća 200 i očekivanu strukturu', async () => {
    const response = await GET();
    assertEqual(response.status, 200, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['status'] as string, 'aktivan', 'status');
    assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');

    const validacija = body['validacija'] as Record<string, unknown>;
    assert(typeof validacija === 'object' && validacija !== null, 'validacija objekat');
    assertEqual(validacija['sveUspesne'] as boolean, true, 'sveUspesne');
    assert(Array.isArray(validacija['provere']), 'provere niz');
    assertEqual(validacija['ukupnoValidacija'] as number, (validacija['provere'] as unknown[]).length, 'ukupnoValidacija');

    const progres = body['progres'] as Record<string, unknown>;
    assertEqual(progres['iteracija'] as number, AUTOFINISH_COUNT, 'progres.iteracija');
    assertEqual(progres['cilj'] as number, AUTOFINISH_TARGET, 'progres.cilj');
    assertEqual(progres['ciljFormatiran'] as string, '3x10^17', 'progres.ciljFormatiran');
    assert(typeof progres['procenat'] === 'string', 'progres.procenat string');

    const infrastruktura = body['infrastruktura'] as Record<string, unknown>;
    assertEqual(infrastruktura['rute'] as number, TOTAL_ROUTES, 'infrastruktura.rute');
    assertEqual(infrastruktura['api'] as number, TOTAL_API_ROUTES, 'infrastruktura.api');
    assertEqual(infrastruktura['dijagnostike'] as number, TOTAL_DIAGNOSTIKA, 'infrastruktura.dijagnostike');

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
