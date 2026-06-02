// Autofinish #1419 — Autentifikacija Pregled Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/autentifikacija-pregled-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import { GET } from '../../app/api/autentifikacija-pregled/route';
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

function asObject(value: unknown, label: string): Record<string, unknown> {
  assert(typeof value === 'object' && value !== null, `${label} mora biti objekat`);
  return value as Record<string, unknown>;
}

async function runTests(): Promise<void> {
  console.log('\n🏁 Autentifikacija Pregled — Route Coverage Test Suite (#1419)\n');

  const routePath = path.resolve(process.cwd(), 'src/app/api/autentifikacija-pregled/route.ts');
  const routeSource = fs.readFileSync(routePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(routePath), `${routePath} ne postoji`);
  });

  await test('API ruta koristi ključne gradivne blokove', () => {
    assert(routeSource.includes('getAuthPregled'), 'Nedostaje getAuthPregled');
    assert(routeSource.includes('APP_VERSION'), 'Nedostaje APP_VERSION');
    assert(routeSource.includes('NextResponse.json'), 'Nedostaje NextResponse.json');
  });

  const response = await GET();
  const body = (await response.json()) as Record<string, unknown>;
  const pregled = asObject(body['pregled'], 'pregled');

  await test('GET vraća 200 i osnovna polja', () => {
    assertEqual(response.status, 200, 'status');
    assertEqual(body['sistem'] as string, 'Autentifikacija — Pregled', 'sistem');
    assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
    assert(typeof body['timestamp'] === 'string', 'timestamp string');
  });

  await test('pregled ima naziv i verziju', () => {
    assert(typeof pregled['naziv'] === 'string' && (pregled['naziv'] as string).length > 0, 'pregled.naziv');
    assert(typeof pregled['verzija'] === 'string' && (pregled['verzija'] as string).length > 0, 'pregled.verzija');
  });

  await test('pregled.status je aktivan string', () => {
    assert(typeof pregled['status'] === 'string' && (pregled['status'] as string).length > 0, 'pregled.status');
  });

  await test('pregled sadrži brojeve dozvola i mogućnosti', () => {
    assert(typeof pregled['ukupnoDozvola'] === 'number' && (pregled['ukupnoDozvola'] as number) > 0, 'ukupnoDozvola > 0');
    assert(typeof pregled['ukupnoMogucnosti'] === 'number' && (pregled['ukupnoMogucnosti'] as number) > 0, 'ukupnoMogucnosti > 0');
    assert(typeof pregled['maxSesija'] === 'number' && (pregled['maxSesija'] as number) > 0, 'maxSesija > 0');
  });

  await test('pregled sadrži OAuth provajdere', () => {
    assert(Array.isArray(pregled['oauthProvajderi']), 'oauthProvajderi niz');
    const provajderi = pregled['oauthProvajderi'] as unknown[];
    assert(provajderi.length > 0, 'oauthProvajderi nije prazan');
  });

  await test('pregled sadrži uloge sa tačno 5 vrednosti', () => {
    assert(Array.isArray(pregled['uloge']), 'uloge niz');
    const uloge = pregled['uloge'] as string[];
    assert(uloge.includes('korisnik'), 'uloge sadrže korisnik');
    assert(uloge.includes('admin'), 'uloge sadrže admin');
    assert(uloge.includes('vlasnik'), 'uloge sadrže vlasnik');
    assertEqual(uloge.length, 5, 'broj uloga');
  });

  await test('pregled.dozvolePoUlozi je objekat sa svim ulogama', () => {
    const dozvolePoUlozi = asObject(pregled['dozvolePoUlozi'], 'dozvolePoUlozi');
    for (const uloga of ['korisnik', 'moderator', 'admin', 'super-admin', 'vlasnik']) {
      assert(typeof dozvolePoUlozi[uloga] === 'number', `dozvolePoUlozi.${uloga} broj`);
    }
  });

  await test('pregled.dvofaktorObavezan je boolean', () => {
    assert(typeof pregled['dvofaktorObavezan'] === 'boolean', 'dvofaktorObavezan boolean');
  });

  await test('Konstante su ažurirane za Autofinish #1419', () => {
    assert(/^\d+\.\d+\.\d+$/.test(APP_VERSION), 'APP_VERSION semver format');
    assert(AUTOFINISH_COUNT >= 1419, 'AUTOFINISH_COUNT baseline');
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
