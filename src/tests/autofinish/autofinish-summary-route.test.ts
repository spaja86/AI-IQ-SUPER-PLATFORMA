// Autofinish #1356 — Autofinish Summary Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/autofinish-summary-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import { GET } from '../../app/api/autofinish-summary/route';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  AUTOFINISH_TARGET,
  OMEGA_AI_PERSONA_COUNT,
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
  console.log('\n🏁 Autofinish Summary — Route Coverage Test Suite (#1356)\n');

  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/autofinish-summary/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('API ruta koristi očekivane gradivne blokove', () => {
    assert(apiRouteSource.includes('milestones'), 'Nedostaje milestones');
    assert(apiRouteSource.includes('AUTOFINISH_TARGET'), 'Nedostaje AUTOFINISH_TARGET');
    assert(apiRouteSource.includes('TOTAL_ROUTES'), 'Nedostaje TOTAL_ROUTES');
    assert(apiRouteSource.includes('TOTAL_API_ROUTES'), 'Nedostaje TOTAL_API_ROUTES');
    assert(apiRouteSource.includes('OMEGA_AI_PERSONA_COUNT'), 'Nedostaje OMEGA_AI_PERSONA_COUNT');
    assert(apiRouteSource.includes('NextResponse.json'), 'Nedostaje NextResponse.json');
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
    assertEqual(body['naziv'] as string, 'Autofinish Summary', 'naziv');
    assertEqual(body['trenutnaVerzija'] as string, APP_VERSION, 'trenutnaVerzija');

    const ukupno = body['ukupno'] as Record<string, unknown>;
    assertEqual(ukupno['iteracija'] as number, AUTOFINISH_COUNT, 'ukupno.iteracija');
    assertEqual(ukupno['cilj'] as number, AUTOFINISH_TARGET, 'ukupno.cilj');
    assertEqual(ukupno['stranice'] as number, TOTAL_PAGES, 'ukupno.stranice');
    assertEqual(ukupno['apiRute'] as number, TOTAL_API_ROUTES, 'ukupno.apiRute');
    assertEqual(ukupno['ukupnoRuta'] as number, TOTAL_ROUTES, 'ukupno.ukupnoRuta');
    assertEqual(ukupno['dijagnostike'] as number, TOTAL_DIAGNOSTIKA, 'ukupno.dijagnostike');
    assertEqual(ukupno['igrice'] as number, TOTAL_IGRICA, 'ukupno.igrice');
    assertEqual(ukupno['omegaAI'] as number, OMEGA_AI_PERSONA_COUNT, 'ukupno.omegaAI');

    const milestones = body['milestones'] as Array<Record<string, unknown>>;
    assert(Array.isArray(milestones), 'milestones niz');
    assert(milestones.length > 0, 'milestones nije prazan');

    const rast = body['rast'] as Record<string, unknown>;
    assert(typeof rast === 'object' && rast !== null, 'rast objekat');
    assert(typeof rast['rute'] === 'object' && rast['rute'] !== null, 'rast.rute objekat');
    assert(typeof rast['api'] === 'object' && rast['api'] !== null, 'rast.api objekat');
    assert(typeof rast['dijagnostike'] === 'object' && rast['dijagnostike'] !== null, 'rast.dijagnostike objekat');

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
