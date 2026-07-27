// Autofinish — eksponencionalne-geometrijske-razmere Route Coverage Test

import fs from 'node:fs';
import path from 'node:path';
import { APP_VERSION, AUTOFINISH_COUNT, TOTAL_API_ROUTES, TOTAL_ROUTES } from '../../lib/constants';
import { GET } from '../../app/api/eksponencionalne-geometrijske-razmere/route';

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
    throw new Error(`${label ?? 'assertEqual'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

async function runTests(): Promise<void> {
  console.log('\n🏁 eksponencionalne-geometrijske-razmere — Route Coverage Test Suite\n');

  const routePath = path.resolve(process.cwd(), 'src/app/api/eksponencionalne-geometrijske-razmere/route.ts');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(routePath), `${routePath} ne postoji`);
  });

  await test('Ruta eksportuje GET', () => {
    const src = fs.readFileSync(routePath, 'utf8');
    assert(src.includes('export async function GET'), 'Nedostaje GET handler');
  });

  await test('GET vraća očekivanu strukturu', async () => {
    const response = await GET();
    assert(response.status >= 200 && response.status < 600, `Neočekivan status: ${response.status}`);

    const body = await response.clone().json();
    assert(isObject(body), 'body mora biti objekat');
    assertEqual(body['verzija'], APP_VERSION, 'verzija');

    assert(isObject(body['sazetak']), 'sazetak mora biti objekat');
    assert(isObject(body['detalji']), 'detalji mora biti objekat');

    const detalji = body['detalji'];
    assert(isObject(detalji), 'detalji object check');
    assertEqual(detalji['scope'], 'kombinovano', 'scope');
    assertEqual(detalji['oktavniModel'], '12-oktava', 'oktavniModel');

    const oktavneRazmere = detalji['oktavneRazmere'];
    assert(isObject(oktavneRazmere), 'oktavneRazmere mora biti objekat');
    assert(Array.isArray(oktavneRazmere['ratioMatrica']), 'ratioMatrica mora biti niz');

    const dimRazmere = detalji['dimenzionalneRazmere'];
    assert(isObject(dimRazmere), 'dimenzionalneRazmere mora biti objekat');
    assert(Array.isArray(dimRazmere['prelazi']), 'prelazi moraju biti niz');
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
