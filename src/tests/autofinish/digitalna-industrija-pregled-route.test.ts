import fs from 'node:fs';
import path from 'node:path';
import { APP_VERSION } from '../../lib/constants';
import { GET } from '../../app/api/digitalna-industrija-pregled/route';

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

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

async function runTests(): Promise<void> {
  console.log('\n🏁 digitalna-industrija-pregled — Route Coverage Test Suite\n');

  const routePath = path.resolve(process.cwd(), 'src/app/api/digitalna-industrija-pregled/route.ts');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(routePath), `${routePath} ne postoji`);
  });

  await test('GET smoke provera', async () => {
    const response = await GET();
    assertEqual(response.status, 200, 'status');
    const body = await response.json();
    assert(isObject(body), 'body mora biti objekat');
    assertEqual(body['verzija'], APP_VERSION, 'verzija');
    assert(Array.isArray(body['scope']) && body['scope'].length >= 7, 'scope mora imati kanonske oblasti');
    assert(Array.isArray(body['poslovniTokovi']) && body['poslovniTokovi'].length >= 5, 'moraju postojati poslovni tokovi');
    assert(isObject(body['operativniPregled']), 'operativniPregled mora biti objekat');
    assert(Array.isArray(body['prioritetniBlokatori']), 'prioritetniBlokatori mora biti niz');
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
