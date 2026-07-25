import type { NextRequest } from 'next/server';
import { GET, MIKROFILE_SISTEM_NAZIV } from '../../app/api/mikrofile/route';

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

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

async function runTests(): Promise<void> {
  console.log('\n🏁 mikrofile — Route Coverage Test Suite\n');

  await test('GET route vraća validan status', async () => {
    const request = new Request('http://localhost/api/mikrofile', {
      headers: { 'x-forwarded-for': '127.0.2.20' },
    });

    const response = await GET(request as unknown as NextRequest);
    assert(response.status === 200, `neočekivan status: ${response.status}`);
  });

  await test('GET route vraća očekivano sistem polje', async () => {
    const request = new Request('http://localhost/api/mikrofile', {
      headers: { 'x-forwarded-for': '127.0.2.21' },
    });
    const response = await GET(request as unknown as NextRequest);
    const body = (await response.json()) as unknown;

    assert(isObject(body), 'body je objekat');
    assert(isObject(body.data), 'data je objekat');
    assert(body.data.sistem === MIKROFILE_SISTEM_NAZIV, 'sistem polje je ispravno');
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
