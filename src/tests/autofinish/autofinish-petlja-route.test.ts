import fs from 'node:fs';
import path from 'node:path';
import { metadata } from '../../app/autofinish/page';
import { pokreniAutofinishPetlju } from '../../lib/autofinish-petlja';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  TOTAL_API_ROUTES,
  TOTAL_ROUTES,
  TOTAL_DIAGNOSTIKA,
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
  console.log('\n⚡ Autofinish Petlja route coverage — Unit Test Suite\n');

  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/autofinish-petlja/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');
  const izvestaj = pokreniAutofinishPetlju();
  const routePayload = {
    ...izvestaj,
    napomena:
      izvestaj.status === 'zavrsena'
        ? 'Svi podsistemi OMEGA PROJEKTA su na 100%. Autofinish petlja zavrsena.'
        : 'Autofinish petlja ce nastaviti ponavljanje dok svi podsistemi ne budu na 100%.',
  };

  await test('metadata.title sadrži Autofinish Dashboard', () => {
    assert(
      typeof metadata.title === 'string' && metadata.title.includes('Autofinish Dashboard'),
      `metadata.title: ${String(metadata.title)}`,
    );
  });

  await test('metadata koristi x-autofinish-count', () => {
    assertEqual(
      metadata.other?.['x-autofinish-count'],
      String(AUTOFINISH_COUNT),
      'metadata.other[x-autofinish-count]',
    );
  });

  await test('API ruta koristi pokreniAutofinishPetlju()', () => {
    assert(apiRouteSource.includes('pokreniAutofinishPetlju'), 'API route ne koristi pokreniAutofinishPetlju');
  });

  await test('API ruta ima rate limiting', () => {
    assert(apiRouteSource.includes('checkRateLimitGlobal'), 'API route nema checkRateLimitGlobal');
    assert(apiRouteSource.includes('rateLimitKey'), 'API route nema rateLimitKey');
  });

  await test('Route payload ima očekivanu strukturu', () => {
    assertEqual(routePayload.status, 'zavrsena', 'status');
    assert(Array.isArray(routePayload.podsistemi), 'podsistemi niz');
    assertEqual(routePayload.podsistemi.length, 9, 'broj podsistema');
    assert(typeof routePayload.napomena === 'string' && routePayload.napomena.length > 0, 'napomena postoji');
  });

  await test('Ekosistem vrednosti odgovaraju konstantama', () => {
    assertEqual(routePayload.ekosistem.rute, TOTAL_ROUTES, 'ekosistem.rute');
    assertEqual(routePayload.ekosistem.apiRute, TOTAL_API_ROUTES, 'ekosistem.apiRute');
    assertEqual(routePayload.ekosistem.dijagnostike, TOTAL_DIAGNOSTIKA, 'ekosistem.dijagnostike');
  });

  await test('Konstante su ažurirane', () => {
    assertEqual(APP_VERSION, '57.3.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1304, 'AUTOFINISH_COUNT');
    assertEqual(TOTAL_API_ROUTES, 1158, 'TOTAL_API_ROUTES');
    assertEqual(TOTAL_ROUTES, 1258, 'TOTAL_ROUTES');
  });

  console.log(`\n⚡ Rezultat: ${passed} prošlo, ${failed} palo`);
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
