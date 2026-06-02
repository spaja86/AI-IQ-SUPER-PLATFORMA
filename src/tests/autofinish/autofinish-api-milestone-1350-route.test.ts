// Autofinish #1417 — API Milestone 1350 Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/autofinish-api-milestone-1350-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import { GET } from '../../app/api/autofinish-api-milestone-1350/route';
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
  console.log('\n🏁 Autofinish API Milestone 1350 — Route Coverage Test Suite (#1417)\n');

  const apiRoutePath = path.resolve(
    process.cwd(),
    'src/app/api/autofinish-api-milestone-1350/route.ts',
  );
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
    assertEqual(response.status, 200, 'HTTP status');
  });

  await test('GET vraća naziv milestone 1350', () => {
    assertEqual(body['naziv'] as string, 'Autofinish API Milestone 1350', 'naziv');
  });

  await test('GET vraća status aktivan', () => {
    assertEqual(body['status'] as string, 'aktivan', 'status');
  });

  await test('GET vraća milestone.ciljBroj === 1350', () => {
    assertEqual(milestone['ciljBroj'] as number, 1350, 'milestone.ciljBroj');
  });

  await test('GET vraća milestone.trenutniBroj === TOTAL_API_ROUTES', () => {
    assertEqual(milestone['trenutniBroj'] as number, TOTAL_API_ROUTES, 'milestone.trenutniBroj');
  });

  await test('GET ekosistem.ukupnoApiRuta === TOTAL_API_ROUTES', () => {
    assertEqual(ekosistem['ukupnoApiRuta'] as number, TOTAL_API_ROUTES, 'ekosistem.ukupnoApiRuta');
  });

  await test('GET ekosistem.ukupnoDijagnostika === TOTAL_DIAGNOSTIKA', () => {
    assertEqual(
      ekosistem['ukupnoDijagnostika'] as number,
      TOTAL_DIAGNOSTIKA,
      'ekosistem.ukupnoDijagnostika',
    );
  });

  await test('Konstante su ažurirane', () => {
    assert(/^\d+\.\d+\.\d+$/.test(APP_VERSION), 'APP_VERSION semver format');
    assert(AUTOFINISH_COUNT >= 1417, 'AUTOFINISH_COUNT baseline');
    assert(TOTAL_API_ROUTES >= 1233, 'TOTAL_API_ROUTES baseline');
    assert(TOTAL_ROUTES >= 1362, 'TOTAL_ROUTES baseline');
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
