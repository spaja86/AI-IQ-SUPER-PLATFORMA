// Autofinish #1341 — Dimenzije Route TV Flow Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/dimenzije-route-tv-flow.test.ts

import fs from 'node:fs';
import path from 'node:path';
import { GET } from '../../app/api/dimenzije/route';

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

async function runTests(): Promise<void> {
  console.log('\n🏁 Autofinish Dimenzije TV Flow — Route Coverage Test Suite (#1341)\n');

  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/dimenzije/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('API ruta koristi TV kroz dimenzije helpere', () => {
    assert(apiRouteSource.includes('getTVKanaliKrozDimenzije'), 'Nedostaje getTVKanaliKrozDimenzije');
    assert(apiRouteSource.includes('getTVKrozDimenzijePregled'), 'Nedostaje getTVKrozDimenzijePregled');
  });

  await test('GET vraća TV kroz dimenzije podatke', async () => {
    const response = await GET();
    assert(response.status === 200, 'status mora biti 200');
    const body = (await response.json()) as Record<string, unknown>;
    const tvKrozDimenzije = body['tvKrozDimenzije'] as Record<string, unknown>;
    assert(typeof tvKrozDimenzije === 'object' && tvKrozDimenzije !== null, 'tvKrozDimenzije objekat');
    assert(Array.isArray(tvKrozDimenzije['kanali']), 'tvKrozDimenzije.kanali niz');
    const pregled = tvKrozDimenzije['pregled'] as Record<string, unknown>;
    assert(typeof pregled['ukupnoTVKanala'] === 'number', 'tvKrozDimenzije.pregled.ukupnoTVKanala broj');
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
