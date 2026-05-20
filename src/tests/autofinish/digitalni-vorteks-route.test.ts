import fs from 'node:fs';
import path from 'node:path';
import sitemap from '../../app/sitemap';
import { metadata } from '../../app/digitalni-vorteks/page';
import { navigation } from '../../lib/navigation';
import { buildDigitalniVorteks } from '../../lib/digitalni-vorteks';
import {
  APP_VERSION,
  BASE_URL,
  TOTAL_API_ROUTES,
  TOTAL_ROUTES,
  AUTOFINISH_COUNT,
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
  console.log('\n🌀 DIGITALNI VORTEKS route coverage — Unit Test Suite\n');

  const entries = sitemap();
  const routeUrl = `${BASE_URL}/digitalni-vorteks`;
  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/digitalni-vorteks/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');
  const rezultat = buildDigitalniVorteks('test-user-id');

  await test('Sitemap sadrži /digitalni-vorteks', () => {
    assert(entries.some((entry) => entry.url === routeUrl), '/digitalni-vorteks nije u sitemap-u');
  });

  await test('metadata.title sadrži DIGITALNI VORTEKS', () => {
    assert(
      typeof metadata.title === 'string' && metadata.title.includes('DIGITALNI VORTEKS'),
      `metadata.title: ${String(metadata.title)}`,
    );
  });

  await test('Navigation sadrži /digitalni-vorteks', () => {
    assert(
      navigation.some((item) => item.href === '/digitalni-vorteks' && item.label === 'DIGITALNI VORTEKS'),
      'navigation nema DIGITALNI VORTEKS link',
    );
  });

  await test('API ruta koristi buildDigitalniVorteks()', () => {
    assert(apiRouteSource.includes('buildDigitalniVorteks'), 'API route ne koristi buildDigitalniVorteks');
  });

  await test('API ruta ima auth, rate limiting i apiSuccess', () => {
    assert(apiRouteSource.includes('verifyUserFromToken'), 'API route nema auth proveru');
    assert(apiRouteSource.includes('checkRateLimitGlobal'), 'API route nema rate limiting');
    assert(apiRouteSource.includes('apiSuccess'), 'API route ne koristi apiSuccess');
  });

  await test('Model rezultata ima očekivana polja', () => {
    assertEqual(rezultat.status, 'aktivan', 'status');
    assert(typeof rezultat.userId === 'string' && rezultat.userId.length > 0, 'userId string');
    assert(typeof rezultat.vorteksniKoeficijent === 'number', 'vorteksniKoeficijent broj');
    assert(Array.isArray(rezultat.vorteksniCentar.oktave), 'vorteksniCentar.oktave niz');
    assert(!Number.isNaN(Date.parse(rezultat.timestamp)), 'timestamp ISO');
  });

  await test('Konstante su ažurirane', () => {
    assertEqual(APP_VERSION, '57.0.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1301, 'AUTOFINISH_COUNT');
    assertEqual(TOTAL_API_ROUTES, 1158, 'TOTAL_API_ROUTES');
    assertEqual(TOTAL_ROUTES, 1258, 'TOTAL_ROUTES');
  });

  console.log(`\n🌀 Rezultat: ${passed} prošlo, ${failed} palo`);
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
