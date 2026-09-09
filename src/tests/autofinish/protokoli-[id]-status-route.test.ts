// Autofinish — protokoli/[id]/status Route Coverage Test

import fs from 'node:fs';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import { POST } from '../../app/api/protokoli/[id]/status/route';

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

function makeRequest(body: unknown, authorization?: string): NextRequest {
  return new Request('http://localhost/api/protokoli/spaja-pmt/status', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': '127.0.0.1',
      ...(authorization ? { authorization } : {}),
    },
    body: JSON.stringify(body),
  }) as NextRequest;
}

async function runTests(): Promise<void> {
  console.log('\n🏁 protokoli/[id]/status — Route Coverage Test Suite\n');

  const routePath = path.resolve(process.cwd(), 'src/app/api/protokoli/[id]/status/route.ts');
  const src = fs.readFileSync(routePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(routePath), `${routePath} ne postoji`);
  });

  await test('Ruta eksportuje POST i podržava lifecycle akcije', () => {
    assert(src.includes('export async function POST'), 'Nedostaje POST handler');
    assert(src.includes('predlozi') && src.includes('rollback') && src.includes('incident'), 'Nedostaju lifecycle akcije');
  });

  await test('Predlog statusa bez auth prolazi za postojeći protokol', async () => {
    const response = await POST(makeRequest({ action: 'predlozi', status: 'u-testu', reason: 'ui-check' }), {
      params: Promise.resolve({ id: 'spaja-pmt' }),
    });
    assertEqual(response.status, 200, 'status');
  });

  await test('Incident akcija bez auth vraća 403', async () => {
    const response = await POST(makeRequest({ action: 'incident', reason: 'manual-check' }), {
      params: Promise.resolve({ id: 'spaja-pmt' }),
    });
    assertEqual(response.status, 403, 'status');
  });

  await test('Predlog statusa sa nepoznatim statusom vraća 400', async () => {
    const response = await POST(makeRequest({ action: 'predlozi', status: 'unknown', reason: 'bad' }), {
      params: Promise.resolve({ id: 'spaja-pmt' }),
    });
    assertEqual(response.status, 400, 'status');
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
