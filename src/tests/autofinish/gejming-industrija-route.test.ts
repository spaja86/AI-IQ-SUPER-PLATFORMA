import fs from 'node:fs';
import path from 'node:path';
import sitemap from '../../app/sitemap';
import { metadata } from '../../app/gejming-industrija/page';
import { navigation } from '../../lib/navigation';
import { buildGejmingIndustrija } from '../../lib/gejming-industrija';
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
  console.log('\n🎮 Gejming Industrija route coverage — Unit Test Suite\n');

  const entries = sitemap();
  const routeUrl = `${BASE_URL}/gejming-industrija`;
  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/gejming-industrija/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');
  const rezultat = buildGejmingIndustrija('test-user-id');

  await test('Sitemap sadrži /gejming-industrija', () => {
    assert(entries.some((entry) => entry.url === routeUrl), '/gejming-industrija nije u sitemap-u');
  });

  await test('metadata.title sadrži Gejming Industrija', () => {
    assert(
      typeof metadata.title === 'string' && metadata.title.includes('Gejming Industrija'),
      `metadata.title: ${String(metadata.title)}`,
    );
  });

  await test('Navigation sadrži /gejming-industrija', () => {
    assert(
      navigation.some((item) => item.href === '/gejming-industrija' && item.label === 'Gejming Industrija'),
      'navigation nema Gejming Industrija link',
    );
  });

  await test('API ruta koristi buildGejmingIndustrija()', () => {
    assert(apiRouteSource.includes('buildGejmingIndustrija'), 'API route ne koristi buildGejmingIndustrija');
  });

  await test('API ruta vraća apiSuccess payload', () => {
    assert(apiRouteSource.includes('apiSuccess'), 'API route ne koristi apiSuccess');
    assert(apiRouteSource.includes('rezultat'), 'API route ne vraća rezultat');
  });

  await test('Model rezultata ima očekivana ključna polja', () => {
    assertEqual(rezultat.status, 'aktivan', 'status');
    assert(typeof rezultat.pregled.ukupnoIgrica === 'number', 'pregled.ukupnoIgrica');
    assert(Array.isArray(rezultat.domeni.katalogIgara.kategorije), 'kategorije niz');
    assert(Array.isArray(rezultat.domeni.lifecycleIgara.tokovi), 'tokovi niz');
    assert(Array.isArray(rezultat.domeni.gameCreationPipeline.faze), 'faze niz');
    assert(!Number.isNaN(Date.parse(rezultat.timestamp)), 'timestamp ISO');
  });

  await test('Konstante su ažurirane', () => {
    assertEqual(APP_VERSION, '56.2.0', 'APP_VERSION');
    assertEqual(TOTAL_API_ROUTES, 1158, 'TOTAL_API_ROUTES');
    assertEqual(TOTAL_ROUTES, 1258, 'TOTAL_ROUTES');
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
