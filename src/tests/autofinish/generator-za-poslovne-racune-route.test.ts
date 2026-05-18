import fs from 'node:fs';
import path from 'node:path';
import sitemap from '../../app/sitemap';
import { metadata } from '../../app/generator-za-poslovne-racune/page';
import { navigation } from '../../lib/navigation';
import { buildGeneratorZaPoslovneRacune } from '../../lib/generator-za-poslovne-racune';
import {
  APP_VERSION,
  BASE_URL,
  TOTAL_API_ROUTES,
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
  console.log('\n🏦 Generator za Poslovne Račune route coverage — Unit Test Suite\n');

  const entries = sitemap();
  const routeUrl = `${BASE_URL}/generator-za-poslovne-racune`;
  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/generator-za-poslovne-racune/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');
  const rezultat = buildGeneratorZaPoslovneRacune('test-user');

  await test('Sitemap sadrži /generator-za-poslovne-racune', () => {
    assert(entries.some((entry) => entry.url === routeUrl), 'ruta nije u sitemap-u');
  });

  await test('metadata.title sadrži Generator za Poslovne Račune', () => {
    assert(
      typeof metadata.title === 'string' && metadata.title.includes('Generator za Poslovne Račune'),
      `metadata.title: ${String(metadata.title)}`,
    );
  });

  await test('Navigation sadrži /generator-za-poslovne-racune', () => {
    assert(
      navigation.some((item) => item.href === '/generator-za-poslovne-racune' && item.label === 'Generator Poslovnih Računa'),
      'navigation nema Generator Poslovnih Računa link',
    );
  });

  await test('API ruta koristi buildGeneratorZaPoslovneRacune()', () => {
    assert(apiRouteSource.includes('buildGeneratorZaPoslovneRacune'), 'API route ne koristi builder');
  });

  await test('API ruta koristi apiSuccess i rate limit', () => {
    assert(apiRouteSource.includes('apiSuccess'), 'API route ne koristi apiSuccess');
    assert(apiRouteSource.includes('checkRateLimitGlobal'), 'API route nema rate limit');
  });

  await test('Model rezultata ima očekivana ključna polja', () => {
    assertEqual(rezultat.status, 'aktivan', 'status');
    assert(Array.isArray(rezultat.racuni), 'racuni niz');
    assert(Array.isArray(rezultat.audit), 'audit niz');
    assert(Array.isArray(rezultat.preporuke), 'preporuke niz');
    assert(!Number.isNaN(Date.parse(rezultat.timestamp)), 'timestamp ISO');
  });

  await test('Konstante su ažurirane', () => {
    assertEqual(APP_VERSION, '53.9.0', 'APP_VERSION');
    assertEqual(TOTAL_API_ROUTES, 1136, 'TOTAL_API_ROUTES');
    assertEqual(TOTAL_ROUTES, 1226, 'TOTAL_ROUTES');
  });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
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
