// Autofinish #1337 — Changelog Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/changelog-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import { GET } from '../../app/api/changelog/route';
import { APP_VERSION, AUTOFINISH_COUNT, AUTOFINISH_TARGET, TOTAL_API_ROUTES, TOTAL_DIAGNOSTIKA, TOTAL_ROUTES } from '../../lib/constants';

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
  console.log('\n🏁 Changelog — Route Coverage Test Suite (#1337)\n');

  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/changelog/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('API ruta koristi očekivane gradivne blokove', () => {
    assert(apiRouteSource.includes('APP_VERSION'), 'Nedostaje APP_VERSION');
    assert(apiRouteSource.includes('AUTOFINISH_COUNT'), 'Nedostaje AUTOFINISH_COUNT');
    assert(apiRouteSource.includes('AUTOFINISH_TARGET'), 'Nedostaje AUTOFINISH_TARGET');
    assert(apiRouteSource.includes('changelog'), 'Nedostaje changelog');
    assert(apiRouteSource.includes('NextResponse.json'), 'Nedostaje NextResponse.json');
  });

  await test('GET vraća 200 i ispravan payload', async () => {
    const response = await GET();
    assertEqual(response.status, 200, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['platforma'] as string, 'AI IQ SUPER PLATFORMA', 'platforma');
    assertEqual(body['trenutnaVerzija'] as string, APP_VERSION, 'trenutnaVerzija');
    assert(typeof body['timestamp'] === 'string', 'timestamp string');
    assert(!Number.isNaN(Date.parse(body['timestamp'] as string)), 'timestamp ISO');
    assert(Array.isArray(body['changelog']), 'changelog niz');
    assert(typeof body['ukupnoVerzija'] === 'number', 'ukupnoVerzija number');
  });

  await test('GET vraća ispravan autofinish blok', async () => {
    const response = await GET();
    const body = (await response.json()) as Record<string, unknown>;
    const autofinish = body['autofinish'] as Record<string, unknown>;

    assert(typeof autofinish === 'object' && autofinish !== null, 'autofinish objekat');
    assertEqual(autofinish['iteracija'] as number, AUTOFINISH_COUNT, 'autofinish.iteracija');
    assertEqual(autofinish['cilj'] as number, AUTOFINISH_TARGET, 'autofinish.cilj');
    assertEqual(autofinish['ciljFormatiran'] as string, '3×10¹⁷', 'autofinish.ciljFormatiran');
  });

  await test('Changelog stavke imaju očekivanu strukturu', async () => {
    const response = await GET();
    const body = (await response.json()) as Record<string, unknown>;
    const changelog = body['changelog'] as Array<Record<string, unknown>>;

    assert(changelog.length > 0, 'changelog nije prazan');
    assertEqual(body['ukupnoVerzija'] as number, changelog.length, 'ukupnoVerzija');

    const prva = changelog[0]!;
    assert(typeof prva['verzija'] === 'string', 'verzija string');
    assert(typeof prva['datum'] === 'string', 'datum string');
    assert(typeof prva['opis'] === 'string', 'opis string');
    assert(!Number.isNaN(Date.parse(prva['datum'] as string)), 'datum validan');
    assert((prva['opis'] as string).includes('Autofinish'), 'opis sadrži Autofinish');
  });

  await test('Konstante su ažurirane', () => {
    assert(/^\d+\.\d+\.\d+$/.test(APP_VERSION), 'APP_VERSION semver format');
    assert(AUTOFINISH_COUNT >= 1337, 'AUTOFINISH_COUNT baseline');
    assert(TOTAL_API_ROUTES >= 1159, 'TOTAL_API_ROUTES baseline');
    assert(TOTAL_ROUTES >= 1260, 'TOTAL_ROUTES baseline');
    assert(TOTAL_DIAGNOSTIKA >= 2364, 'TOTAL_DIAGNOSTIKA baseline');
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
