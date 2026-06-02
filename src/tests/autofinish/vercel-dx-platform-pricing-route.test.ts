// Autofinish #1406 — Vercel DX Platform Pricing Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/vercel-dx-platform-pricing-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import { GET } from '../../app/api/vercel-dx-platform-pricing/route';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

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
  console.log('\n🏁 Vercel DX Platform Pricing — Route Coverage Test Suite (#1406)\n');

  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/vercel-dx-platform-pricing/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('API ruta koristi očekivane gradivne blokove', () => {
    assert(apiRouteSource.includes('VERCEL_DX_PLATFORM_PRICING'), 'Nedostaje VERCEL_DX_PLATFORM_PRICING');
    assert(apiRouteSource.includes('APP_VERSION'), 'Nedostaje APP_VERSION');
    assert(apiRouteSource.includes('NextResponse.json'), 'Nedostaje NextResponse.json');
  });

  await test('Konstante su ažurirane', () => {
    assert(/^\d+\.\d+\.\d+$/.test(APP_VERSION), 'APP_VERSION semver format');
    assert(AUTOFINISH_COUNT >= 1406, 'AUTOFINISH_COUNT baseline');
  });

  await test('GET vraća 200 i očekivanu strukturu', async () => {
    const response = await GET();
    assertEqual(response.status, 200, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['status'] as string, 'ok', 'status');
    assertEqual(body['route'] as string, '/api/vercel-dx-platform-pricing', 'route');
    assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
    assert(typeof body['pricing'] === 'object' && body['pricing'] !== null, 'pricing objekat');
    assert(typeof body['timestamp'] === 'string', 'timestamp string');
    assert(!Number.isNaN(Date.parse(body['timestamp'] as string)), 'timestamp ISO');
  });

  await test('GET vraća ispravan pricing sadržaj', async () => {
    const response = await GET();
    const body = (await response.json()) as Record<string, unknown>;
    const pricing = body['pricing'] as Record<string, unknown>;

    assert(typeof pricing['version'] === 'string', 'pricing.version string');
    assert(typeof pricing['enterprisePricingNote'] === 'string', 'pricing.enterprisePricingNote string');
    assert(Array.isArray(pricing['billableResources']), 'pricing.billableResources niz');
    assert((pricing['billableResources'] as unknown[]).length > 0, 'pricing.billableResources nije prazan');
    assert(typeof pricing['salesCta'] === 'object' && pricing['salesCta'] !== null, 'pricing.salesCta objekat');
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
