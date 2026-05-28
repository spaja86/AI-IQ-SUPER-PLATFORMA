// Autofinish — distribucija Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/distribucija-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import { GET } from '../../app/api/distribucija/route';
import { APP_VERSION, AUTOFINISH_COUNT, TOTAL_API_ROUTES, TOTAL_ROUTES } from '../../lib/constants';

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
  console.log('\n🏁 distribucija — Route Coverage Test Suite\n');

  const routePath = path.resolve(process.cwd(), 'src/app/api/distribucija/route.ts');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(routePath), `${routePath} ne postoji`);
  });

  await test('Ruta eksportuje GET i koristi APP_VERSION', () => {
    const src = fs.readFileSync(routePath, 'utf8');
    assert(src.includes('export async function GET'), 'Nedostaje GET handler');
    assert(src.includes('APP_VERSION'), 'Nedostaje APP_VERSION');
    assert(src.includes('getDistribucijaModel'), 'Nedostaje getDistribucijaModel');
  });

  await test('GET vraća standardna polja', async () => {
    const response = await GET();
    assertEqual(response.status, 200, 'HTTP status');

    const body = (await response.json()) as Record<string, unknown>;
    assert(typeof body['status'] === 'string', 'status mora biti string');
    assert(typeof body['naziv'] === 'string', 'naziv mora biti string');
    assertEqual(body['verzija'], APP_VERSION, 'verzija');
    assert(typeof body['timestamp'] === 'string', 'timestamp mora biti string');
    assert(typeof body['distribucija'] === 'object' && body['distribucija'] !== null, 'distribucija mora biti objekat');
  });

  await test('Distribucija payload ima cvorove, kanale i kpi', async () => {
    const response = await GET();
    const body = (await response.json()) as {
      distribucija?: {
        cvorovi?: unknown[];
        kanali?: unknown[];
        kpi?: Record<string, unknown>;
        readiness?: Record<string, unknown>;
      };
    };

    assert(Array.isArray(body.distribucija?.cvorovi), 'cvorovi mora biti niz');
    assert(Array.isArray(body.distribucija?.kanali), 'kanali mora biti niz');
    assert((body.distribucija?.cvorovi?.length ?? 0) > 0, 'cvorovi ne smeju biti prazni');
    assert((body.distribucija?.kanali?.length ?? 0) > 0, 'kanali ne smeju biti prazni');
    assert(typeof body.distribucija?.kpi === 'object' && body.distribucija?.kpi !== null, 'kpi mora postojati');
    assert(typeof body.distribucija?.readiness === 'object' && body.distribucija?.readiness !== null, 'readiness mora postojati');
  });

  await test('Konstante su dostupne', () => {
    assert(typeof APP_VERSION === 'string' && APP_VERSION.length > 0, 'APP_VERSION');
    assert(typeof AUTOFINISH_COUNT === 'number' && AUTOFINISH_COUNT > 0, 'AUTOFINISH_COUNT');
    assert(typeof TOTAL_API_ROUTES === 'number' && TOTAL_API_ROUTES > 0, 'TOTAL_API_ROUTES');
    assert(typeof TOTAL_ROUTES === 'number' && TOTAL_ROUTES > 0, 'TOTAL_ROUTES');
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

