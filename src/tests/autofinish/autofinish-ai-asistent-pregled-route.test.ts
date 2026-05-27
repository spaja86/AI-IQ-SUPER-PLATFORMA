// Autofinish #1326 — Autofinish AI Asistent Pregled Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/autofinish-ai-asistent-pregled-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import { GET } from '../../app/api/autofinish-ai-asistent-pregled/route';
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
  console.log('\n🏁 Autofinish AI Asistent Pregled — Route Coverage Test Suite (#1326)\n');

  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/autofinish-ai-asistent-pregled/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('API ruta koristi očekivane gradivne blokove', () => {
    assert(apiRouteSource.includes('getUkupnoAiPagePrompts'), 'Nedostaje getUkupnoAiPagePrompts');
    assert(apiRouteSource.includes('getUkupnoStranica'), 'Nedostaje getUkupnoStranica');
    assert(apiRouteSource.includes('aiAsistentStatistika'), 'Nedostaje aiAsistentStatistika');
  });

  await test('GET vraća 200, payload i ključne sekcije', async () => {
    const response = await GET();
    assertEqual(response.status, 200, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['status'] as string, 'aktivan', 'status');
    assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
    assert(typeof body['naziv'] === 'string', 'naziv string');
    assert(typeof body['opis'] === 'string', 'opis string');

    const iteracija = body['iteracija'] as Record<string, unknown>;
    assertEqual(iteracija['broj'] as number, AUTOFINISH_COUNT, 'iteracija.broj');
    assert(typeof iteracija['cilj'] === 'number', 'iteracija.cilj number');
    assert(typeof iteracija['procenat'] === 'string', 'iteracija.procenat string');

    const aiAsistentStatistika = body['aiAsistentStatistika'] as Record<string, unknown>;
    assert(typeof aiAsistentStatistika['ukupnoStranica'] === 'number', 'ukupnoStranica number');
    assert(typeof aiAsistentStatistika['ukupnoPromptova'] === 'number', 'ukupnoPromptova number');
    assert(typeof aiAsistentStatistika['prosecnoPoStranici'] === 'number', 'prosecnoPoStranici number');
    assert(Array.isArray(aiAsistentStatistika['kategorije']), 'kategorije niz');
    assert(Array.isArray(aiAsistentStatistika['modovi']), 'modovi niz');
    assert(typeof aiAsistentStatistika['widgetTip'] === 'string', 'widgetTip string');

    const funkcionalnosti = body['funkcionalnosti'] as unknown[];
    assert(Array.isArray(funkcionalnosti), 'funkcionalnosti niz');
    assert(funkcionalnosti.length > 0, 'funkcionalnosti nije prazan');

    const ekosistem = body['ekosistem'] as Record<string, unknown>;
    assertEqual(ekosistem['apiRute'] as number, TOTAL_API_ROUTES, 'ekosistem.apiRute');
    assertEqual(ekosistem['rute'] as number, TOTAL_ROUTES, 'ekosistem.rute');
    assert(typeof ekosistem['dijagnostike'] === 'number', 'ekosistem.dijagnostike number');

    assert(typeof body['timestamp'] === 'string', 'timestamp string');
  });

  await test('Konstante su ažurirane', () => {
    assert(/^\d+\.\d+\.\d+$/.test(APP_VERSION), 'APP_VERSION semver format');
    assert(AUTOFINISH_COUNT >= 1326, 'AUTOFINISH_COUNT baseline');
    assert(TOTAL_API_ROUTES >= 1158, 'TOTAL_API_ROUTES baseline');
    assert(TOTAL_ROUTES >= 1258, 'TOTAL_ROUTES baseline');
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
