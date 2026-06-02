// Autofinish #1418 — Verzija Roadmap Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/verzija-roadmap-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import { GET } from '../../app/api/verzija-roadmap/route';
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

function asObject(value: unknown, label: string): Record<string, unknown> {
  assert(typeof value === 'object' && value !== null, `${label} mora biti objekat`);
  return value as Record<string, unknown>;
}

async function runTests(): Promise<void> {
  console.log('\n🏁 Verzija Roadmap — Route Coverage Test Suite (#1418)\n');

  const routePath = path.resolve(process.cwd(), 'src/app/api/verzija-roadmap/route.ts');
  const routeSource = fs.readFileSync(routePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(routePath), `${routePath} ne postoji`);
  });

  await test('API ruta koristi ključne konstante i JSON response', () => {
    assert(routeSource.includes('AUTOFINISH_COUNT'), 'Nedostaje AUTOFINISH_COUNT');
    assert(routeSource.includes('AUTOFINISH_TARGET'), 'Nedostaje AUTOFINISH_TARGET');
    assert(routeSource.includes('TOTAL_ROUTES'), 'Nedostaje TOTAL_ROUTES');
    assert(routeSource.includes('TOTAL_API_ROUTES'), 'Nedostaje TOTAL_API_ROUTES');
    assert(routeSource.includes('TOTAL_DIAGNOSTIKA'), 'Nedostaje TOTAL_DIAGNOSTIKA');
    assert(routeSource.includes('NextResponse.json'), 'Nedostaje NextResponse.json');
  });

  const response = await GET();
  const body = (await response.json()) as Record<string, unknown>;
  const trenutno = asObject(body['trenutno'], 'trenutno');

  await test('GET vraća 200 i osnovna polja', () => {
    assertEqual(response.status, 200, 'status');
    assertEqual(body['status'] as string, 'aktivan', 'status');
    assertEqual(body['naziv'] as string, 'Verzija Roadmap — Plan Razvoja Platforme', 'naziv');
    assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
    assert(typeof body['timestamp'] === 'string', 'timestamp string');
  });

  await test('trenutno sekcija odgovara konstantama', () => {
    assertEqual(trenutno['verzija'] as string, APP_VERSION, 'trenutno.verzija');
    assertEqual(trenutno['iteracija'] as number, AUTOFINISH_COUNT, 'trenutno.iteracija');
    assertEqual(trenutno['cilj'] as number, AUTOFINISH_TARGET, 'trenutno.cilj');
    assert(
      typeof trenutno['ciljFormatiran'] === 'string' &&
        /^\d+×10[⁰¹²³⁴⁵⁶⁷⁸⁹]+$/u.test(trenutno['ciljFormatiran'] as string),
      'trenutno.ciljFormatiran format',
    );
    assertEqual(trenutno['rute'] as number, TOTAL_ROUTES, 'trenutno.rute');
    assertEqual(trenutno['api'] as number, TOTAL_API_ROUTES, 'trenutno.api');
    assertEqual(trenutno['dijagnostike'] as number, TOTAL_DIAGNOSTIKA, 'trenutno.dijagnostike');
  });

  await test('roadmap sadrži trenutnu i planirane faze', () => {
    const roadmap = body['roadmap'];
    assert(Array.isArray(roadmap), 'roadmap mora biti niz');
    assert(roadmap.length >= 6, 'roadmap ima minimum 6 stavki');

    const trenutna = roadmap.find((stavka) => asObject(stavka, 'roadmap stavka')['status'] === 'trenutna');
    assert(trenutna !== undefined, 'postoji trenutna roadmap stavka');

    const trenutnaObj = asObject(trenutna, 'trenutna stavka');
    assert(typeof trenutnaObj['verzija'] === 'string', 'trenutna.verzija string');
    assert(typeof trenutnaObj['iteracije'] === 'string', 'trenutna.iteracije string');
    assertEqual(trenutnaObj['rute'] as number, TOTAL_ROUTES, 'trenutna.rute');
    assertEqual(trenutnaObj['api'] as number, TOTAL_API_ROUTES, 'trenutna.api');
  });

  await test('principi lista postoji i pokriva kvalitet', () => {
    const principi = body['principi'];
    assert(Array.isArray(principi), 'principi mora biti niz');
    assert(principi.includes('Zero TypeScript errors'), 'principi sadrže kvalitetnu smernicu');
  });

  await test('Konstante su ažurirane za Autofinish #1418', () => {
    assert(/^\d+\.\d+\.\d+$/.test(APP_VERSION), 'APP_VERSION semver format');
    assert(AUTOFINISH_COUNT >= 1418, 'AUTOFINISH_COUNT baseline');
    assert(TOTAL_API_ROUTES >= 1233, 'TOTAL_API_ROUTES baseline');
    assert(TOTAL_ROUTES >= 1362, 'TOTAL_ROUTES baseline');
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
