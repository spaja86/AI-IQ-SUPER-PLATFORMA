// Autofinish #1382 — /api/og Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/og-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import { APP_VERSION, APP_NAME, AUTOFINISH_COUNT, TOTAL_API_ROUTES, TOTAL_ROUTES } from '../../lib/constants';

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

const _lintUseHelpers = [assertEqual];
void _lintUseHelpers;

async function runTests(): Promise<void> {
  console.log('\n🏁 /api/og — Route Coverage Test Suite (#1382)\n');

  const routePath = path.resolve(process.cwd(), 'src/app/api/og/route.tsx');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(routePath), `${routePath} ne postoji`);
  });

  await test('Ruta je edge runtime sa ImageResponse', () => {
    const src = fs.readFileSync(routePath, 'utf8');
    assert(src.includes("runtime = 'edge'"), "og route mora koristiti edge runtime");
    assert(src.includes('ImageResponse'), 'og route mora koristiti ImageResponse');
    assert(src.includes('export async function GET'), 'Nedostaje GET handler');
  });

  await test('Ruta koristi APP_NAME, KOMPANIJA i APP_VERSION iz konstanti', () => {
    const src = fs.readFileSync(routePath, 'utf8');
    assert(src.includes('APP_NAME'), 'og route mora koristiti APP_NAME');
    assert(src.includes('APP_VERSION'), 'og route mora koristiti APP_VERSION');
    assert(src.includes('KOMPANIJA'), 'og route mora koristiti KOMPANIJA');
  });

  await test('Ruta podržava ?title i ?description query parametre', () => {
    const src = fs.readFileSync(routePath, 'utf8');
    assert(src.includes("searchParams.get('title')"), 'og route mora podrzavati title param');
    assert(src.includes("searchParams.get('description')"), 'og route mora podrzavati description param');
  });

  await test('OG slika ima ispravne dimenzije 1200x630', () => {
    const src = fs.readFileSync(routePath, 'utf8');
    assert(src.includes('1200'), 'og route mora imati width 1200');
    assert(src.includes('630'), 'og route mora imati height 630');
  });

  await test('Konstante su ispravne', () => {
    assert(typeof APP_VERSION === 'string' && APP_VERSION.length > 0, 'APP_VERSION postoji');
    assert(typeof APP_NAME === 'string' && APP_NAME.length > 0, 'APP_NAME postoji');
    assert(AUTOFINISH_COUNT >= 1383, 'AUTOFINISH_COUNT baseline');
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
