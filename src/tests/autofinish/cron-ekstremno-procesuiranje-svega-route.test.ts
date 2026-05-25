// Autofinish — cron/ekstremno-procesuiranje-svega Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/cron-ekstremno-procesuiranje-svega-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import { GET } from '../../app/api/cron/ekstremno-procesuiranje-svega/route';
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

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

async function runTests(): Promise<void> {
  console.log('\n🏁 cron/ekstremno-procesuiranje-svega — Route Coverage Test Suite\n');

  const routePath = path.resolve(process.cwd(), 'src/app/api/cron/ekstremno-procesuiranje-svega/route.ts');
  const previousCronSecret = process.env.CRON_SECRET;

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(routePath), `${routePath} ne postoji`);
  });

  await test('Ruta koristi cron auth i eksportuje GET handler', () => {
    const src = fs.readFileSync(routePath, 'utf8');
    assert(src.includes('export async function GET'), 'Nedostaje GET handler');
    assert(src.includes('validateCronAuth'), 'Nedostaje cron auth provera');
    assert(src.includes('buildEkstremnoProcesuiranjeSvega'), 'Nedostaje builder poziv');
    assert(src.includes('NextResponse.json'), 'Nedostaje JSON response helper');
  });

  await test('Neautorizovan zahtev vraća 401', async () => {
    process.env.CRON_SECRET = 'cron-ekstremno-secret';
    const request = new Request('http://localhost/api/cron/ekstremno-procesuiranje-svega');
    const response = await GET(request as unknown as Request);

    assertEqual(response.status, 401, 'status');
    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['error'], 'Neautorizovan pristup', 'error');
  });

  await test('Autorizovan zahtev preko x-cron-secret vraća scheduler snapshot', async () => {
    process.env.CRON_SECRET = 'cron-ekstremno-secret';
    const request = new Request('http://localhost/api/cron/ekstremno-procesuiranje-svega', {
      headers: { 'x-cron-secret': 'cron-ekstremno-secret' },
    });
    const response = await GET(request as unknown as Request);

    assertEqual(response.status, 200, 'status');
    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['verzija'], APP_VERSION, 'verzija');
    assert(typeof body['score'] === 'number', 'score broj');
    assert(typeof body['throughputPerMin'] === 'number', 'throughputPerMin broj');
    assert(typeof body['latencyMsP95'] === 'number', 'latencyMsP95 broj');
    assert(typeof body['errorRatePct'] === 'number', 'errorRatePct broj');
    assert(typeof body['generatedAt'] === 'string', 'generatedAt string');
    assert(typeof body['timestamp'] === 'string', 'timestamp string');
    assert(typeof body['degraded'] === 'boolean', 'degraded boolean');
    assert(isObject(body['scheduler']), 'scheduler objekat');

    const scheduler = body['scheduler'] as Record<string, unknown>;
    assert(typeof scheduler['queueDepth'] === 'number', 'queueDepth broj');
    assert(typeof scheduler['saturacijaPct'] === 'number', 'saturacijaPct broj');
    assert(typeof scheduler['fairnessIndex'] === 'number', 'fairnessIndex broj');
    assert(typeof scheduler['starvationRizik'] === 'number', 'starvationRizik broj');
    assert(typeof scheduler['emergencyOverride'] === 'boolean', 'emergencyOverride boolean');
  });

  await test('Autorizovan zahtev prihvata Bearer token', async () => {
    process.env.CRON_SECRET = 'cron-ekstremno-secret';
    const request = new Request('http://localhost/api/cron/ekstremno-procesuiranje-svega', {
      headers: { authorization: 'Bearer cron-ekstremno-secret' },
    });
    const response = await GET(request as unknown as Request);
    assertEqual(response.status, 200, 'status');
  });

  await test('Konstante su dostupne', () => {
    assert(typeof APP_VERSION === 'string' && APP_VERSION.length > 0, 'APP_VERSION');
    assert(typeof AUTOFINISH_COUNT === 'number' && AUTOFINISH_COUNT > 0, 'AUTOFINISH_COUNT');
    assert(typeof TOTAL_API_ROUTES === 'number' && TOTAL_API_ROUTES > 0, 'TOTAL_API_ROUTES');
    assert(typeof TOTAL_ROUTES === 'number' && TOTAL_ROUTES > 0, 'TOTAL_ROUTES');
  });

  process.env.CRON_SECRET = previousCronSecret;

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
