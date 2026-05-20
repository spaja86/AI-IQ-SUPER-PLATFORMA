// Autofinish #1300 — Laucentricni Spektar Route Coverage Test

import fs from 'node:fs';
import path from 'node:path';
import { GET } from '../../app/api/laucentricni-spektar/route';
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
  console.log('\n🌈 Laucentricni Spektar — Route Coverage Test (#1300)\n');

  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/laucentricni-spektar/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('API ruta koristi buildLaucentricniSpektar', () => {
    assert(apiRouteSource.includes('buildLaucentricniSpektar'), 'API route ne koristi buildLaucentricniSpektar');
  });

  await test('API ruta ima auth, rate limit i standardne API odgovore', () => {
    assert(apiRouteSource.includes('verifyUserFromToken'), 'API route nema auth proveru');
    assert(apiRouteSource.includes('checkRateLimitGlobal'), 'API route nema rate limiting');
    assert(apiRouteSource.includes('apiSuccess'), 'API route nema apiSuccess');
    assert(apiRouteSource.includes('apiError'), 'API route nema apiError');
    assert(apiRouteSource.includes('apiInternalError'), 'API route nema apiInternalError');
  });

  await test('GET bez auth vraća 401 Unauthorized', async () => {
    const request = new Request('http://localhost/api/laucentricni-spektar');
    const response = await GET(request as never);
    assertEqual(response.status, 401, 'status');
    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['code'] as string, 'UNAUTHORIZED', 'code');
    assert(typeof body['error'] === 'string' && (body['error'] as string).length > 0, 'error');
  });

  await test('Konstante su ažurirane', () => {
    assertEqual(APP_VERSION, '56.9.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1300, 'AUTOFINISH_COUNT');
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
