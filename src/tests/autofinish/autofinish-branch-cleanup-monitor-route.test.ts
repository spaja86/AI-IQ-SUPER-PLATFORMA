// Autofinish #1327 — Autofinish Branch Cleanup Monitor Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/autofinish-branch-cleanup-monitor-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import { GET } from '../../app/api/autofinish-branch-cleanup-monitor/route';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  AUTOFINISH_TARGET,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
  TOTAL_ROUTES,
} from '../../lib/constants';

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
  console.log('\n🏁 Autofinish Branch Cleanup Monitor — Route Coverage Test Suite (#1327)\n');

  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/autofinish-branch-cleanup-monitor/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('API ruta koristi očekivane gradivne blokove', () => {
    assert(apiRouteSource.includes('Branch Zastita'), 'Nedostaje Branch Zastita pravilo');
    assert(apiRouteSource.includes('AUTOFINISH-BRANCH-CLEANUP-MONITOR v1.0'), 'Nedostaje monitor model');
    assert(apiRouteSource.includes('procenat.toExponential(2)'), 'Nedostaje procenat formula');
  });

  await test('GET vraća 200, payload i ključne sekcije', async () => {
    const response = await GET();
    assertEqual(response.status, 200, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['status'] as string, 'aktivan', 'status');
    assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
    assert(typeof body['naziv'] === 'string', 'naziv string');

    const branchCleanupMonitor = body['branchCleanupMonitor'] as Record<string, unknown>;
    assertEqual(branchCleanupMonitor['sveUspesne'] as boolean, true, 'branchCleanupMonitor.sveUspesne');
    assertEqual(
      branchCleanupMonitor['model'] as string,
      'AUTOFINISH-BRANCH-CLEANUP-MONITOR v1.0',
      'branchCleanupMonitor.model',
    );
    assertEqual(branchCleanupMonitor['ukupnoProvera'] as number, 5, 'branchCleanupMonitor.ukupnoProvera');
    const provere = branchCleanupMonitor['provere'] as Array<Record<string, unknown>>;
    assert(Array.isArray(provere), 'provere niz');
    assertEqual(provere.length, 5, 'provere.length');
    for (const provera of provere) {
      assert(typeof provera['naziv'] === 'string', 'provera.naziv string');
      assert(typeof provera['tip'] === 'string', 'provera.tip string');
      assertEqual(provera['status'] as string, 'aktivan', 'provera.status');
      assert(typeof provera['opis'] === 'string', 'provera.opis string');
    }

    const progres = body['progres'] as Record<string, unknown>;
    assertEqual(progres['iteracija'] as number, AUTOFINISH_COUNT, 'progres.iteracija');
    assertEqual(progres['cilj'] as number, AUTOFINISH_TARGET, 'progres.cilj');
    assertEqual(progres['ciljFormatiran'] as string, '3x10^17', 'progres.ciljFormatiran');
    assert(typeof progres['procenat'] === 'string', 'progres.procenat string');

    const ekosistem = body['ekosistem'] as Record<string, unknown>;
    assertEqual(ekosistem['apiEndpointi'] as number, TOTAL_API_ROUTES, 'ekosistem.apiEndpointi');
    assertEqual(ekosistem['ukupnoRuta'] as number, TOTAL_ROUTES, 'ekosistem.ukupnoRuta');
    assertEqual(ekosistem['dijagnostike'] as number, TOTAL_DIAGNOSTIKA, 'ekosistem.dijagnostike');

    const autofinish = body['autofinish'] as Record<string, unknown>;
    assertEqual(autofinish['iteracija'] as number, AUTOFINISH_COUNT, 'autofinish.iteracija');
    assertEqual(autofinish['cilj'] as number, AUTOFINISH_TARGET, 'autofinish.cilj');
    assertEqual(autofinish['ciljFormatiran'] as string, '3x10^17', 'autofinish.ciljFormatiran');

    assert(typeof body['timestamp'] === 'string', 'timestamp string');
  });

  await test('Konstante su ažurirane', () => {
    assertEqual(APP_VERSION, '59.8.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1329, 'AUTOFINISH_COUNT');
    assertEqual(TOTAL_API_ROUTES, 1158, 'TOTAL_API_ROUTES');
    assertEqual(TOTAL_ROUTES, 1258, 'TOTAL_ROUTES');
    assertEqual(TOTAL_DIAGNOSTIKA, 2364, 'TOTAL_DIAGNOSTIKA');
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
