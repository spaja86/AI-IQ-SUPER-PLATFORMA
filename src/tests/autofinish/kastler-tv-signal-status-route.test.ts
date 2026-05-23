// Autofinish #1339 — Kastler TV Signal Status Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/kastler-tv-signal-status-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import { GET } from '../../app/api/kastler-tv-signal-status/route';
import { APP_VERSION } from '../../lib/constants';

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
  console.log('\n🏁 Autofinish Kastler TV Signal Status — Route Coverage Test Suite (#1339)\n');

  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/kastler-tv-signal-status/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('API ruta koristi očekivane gradivne blokove', () => {
    assert(apiRouteSource.includes('getKastlerSignalReadinessSummary'), 'Nedostaje getKastlerSignalReadinessSummary');
    assert(apiRouteSource.includes('getTVSignalReadiness'), 'Nedostaje getTVSignalReadiness');
    assert(apiRouteSource.includes('getKastlerTVMonetizationSummary'), 'Nedostaje getKastlerTVMonetizationSummary');
  });

  await test('GET vraća 200 i očekivan payload', async () => {
    const response = await GET();
    assertEqual(response.status, 200, 'status');
    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['route'] as string, '/api/kastler-tv-signal-status', 'route');
    assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
    const kastler = body['kastler'] as Record<string, unknown>;
    assert(typeof kastler['requestStatus'] === 'string', 'kastler.requestStatus');
    assert(typeof kastler['signalLifecycle'] === 'string', 'kastler.signalLifecycle');
    const tv = body['tv'] as Record<string, unknown>;
    assert(typeof tv['monetizacijaStatus'] === 'string', 'tv.monetizacijaStatus');
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
