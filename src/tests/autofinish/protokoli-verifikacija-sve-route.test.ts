// Autofinish #1361 — Protokoli Verifikacija Sve Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/protokoli-verifikacija-sve-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import { POST } from '../../app/api/protokoli/verifikacija-sve/route';

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

async function runTests(): Promise<void> {
  console.log('\n🏁 Protokoli Verifikacija Sve — Route Coverage Test Suite (#1361)\n');

  const routePath = path.resolve(process.cwd(), 'src/app/api/protokoli/verifikacija-sve/route.ts');
  const routeSource = fs.readFileSync(routePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(routePath), `${routePath} ne postoji`);
  });

  await test('API ruta koristi očekivane gradivne blokove', () => {
    assert(routeSource.includes('verifyUserFromToken'), 'Nedostaje verifyUserFromToken');
    assert(routeSource.includes('checkRateLimitGlobal'), 'Nedostaje checkRateLimitGlobal');
    assert(routeSource.includes('protokolManager.verifikujSveAktivne'), 'Nedostaje batch verifikacija');
    assert(routeSource.includes('logApiCall'), 'Nedostaje logApiCall');
  });

  await test('POST bez tokena vraća 401', async () => {
    const request = new Request('http://localhost/api/protokoli/verifikacija-sve', {
      method: 'POST',
      headers: { 'x-forwarded-for': '127.0.0.1' },
    });
    const response = await POST(request as NextRequest);
    assertEqual(response.status, 401, 'status');
    const body = (await response.json()) as Record<string, unknown>;
    assert(typeof body['error'] === 'string', 'error mora biti string');
    assert(body['code'] === 'UNAUTHORIZED', 'code mora biti UNAUTHORIZED');
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
