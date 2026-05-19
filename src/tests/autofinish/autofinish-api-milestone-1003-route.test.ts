// Autofinish #1296 — API Milestone 1003 Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/autofinish-api-milestone-1003-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import { GET } from '../../app/api/autofinish-api-milestone-1003/route';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  TOTAL_API_ROUTES,
  TOTAL_ROUTES,
  TOTAL_DIAGNOSTIKA,
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
  console.log('\n🏁 Autofinish API Milestone 1003 — Route Coverage Test Suite (#1296)\n');

  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/autofinish-api-milestone-1003/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');
  const response = await GET();
  const body = (await response.json()) as Record<string, unknown>;
  const milestone = body['milestone'] as Record<string, unknown>;
  const ekosistem = body['ekosistem'] as Record<string, unknown>;

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('API ruta koristi TOTAL_API_ROUTES', () => {
    assert(apiRouteSource.includes('TOTAL_API_ROUTES'), 'API route ne koristi TOTAL_API_ROUTES');
  });

  await test('GET vraća 200', () => {
    assertEqual(response.status, 200, 'status');
  });

  await test('Payload ima osnovna polja', () => {
    assertEqual(body['naziv'] as string, 'Autofinish API Milestone 1003', 'naziv');
    assertEqual(body['status'] as string, 'aktivan', 'status');
    assertEqual(body['appVerzija'] as string, APP_VERSION, 'appVerzija');
    assertEqual(body['autofinishIteracija'] as number, AUTOFINISH_COUNT, 'autofinishIteracija');
    assert(typeof body['timestamp'] === 'string', 'timestamp string');
  });

  await test('milestone objekat ima ispravne vrednosti', () => {
    assert(typeof milestone === 'object' && milestone !== null, 'milestone je objekat');
    assertEqual(milestone['ciljBroj'] as number, 1003, 'ciljBroj');
    assertEqual(milestone['trenutniBroj'] as number, TOTAL_API_ROUTES, 'trenutniBroj');
    assert(typeof milestone['postignut'] === 'boolean', 'postignut boolean');
    assert(Number(milestone['procenat']) >= 0, 'procenat >= 0');
  });

  await test('ekosistem objekat odgovara konstantama', () => {
    assert(typeof ekosistem === 'object' && ekosistem !== null, 'ekosistem je objekat');
    assertEqual(ekosistem['ukupnoApiRuta'] as number, TOTAL_API_ROUTES, 'ukupnoApiRuta');
    assertEqual(ekosistem['ukupnoRuta'] as number, TOTAL_ROUTES, 'ukupnoRuta');
    assertEqual(ekosistem['ukupnoDijagnostika'] as number, TOTAL_DIAGNOSTIKA, 'ukupnoDijagnostika');
  });

  await test('poruka je string i pominje 1003', () => {
    const poruka = body['poruka'] as string;
    assert(typeof poruka === 'string' && poruka.length > 0, 'poruka neprazna');
    assert(poruka.includes('1003'), 'poruka sadrzi 1003');
  });

  await test('Konstante su ažurirane', () => {
    assertEqual(APP_VERSION, '56.7.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1298, 'AUTOFINISH_COUNT');
    assertEqual(TOTAL_API_ROUTES, 1158, 'TOTAL_API_ROUTES');
    assertEqual(TOTAL_ROUTES, 1258, 'TOTAL_ROUTES');
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
