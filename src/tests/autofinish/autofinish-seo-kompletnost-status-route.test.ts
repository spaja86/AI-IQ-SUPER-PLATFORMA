// Autofinish #1318 — Autofinish SEO Kompletnost Status Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/autofinish-seo-kompletnost-status-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import { GET } from '../../app/api/autofinish-seo-kompletnost-status/route';
import { APP_VERSION, AUTOFINISH_COUNT, KOMPANIJA, TOTAL_API_ROUTES, TOTAL_ROUTES } from '../../lib/constants';

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
  console.log('\n🏁 Autofinish SEO Kompletnost Status — Route Coverage Test Suite (#1318)\n');

  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/autofinish-seo-kompletnost-status/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');
  const response = await GET();
  const body = (await response.json()) as Record<string, unknown>;
  const seoStatus = body['seoStatus'] as Record<string, unknown>;

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('API ruta koristi očekivane konstante', () => {
    assert(apiRouteSource.includes('APP_VERSION'), 'Nedostaje APP_VERSION');
    assert(apiRouteSource.includes('AUTOFINISH_COUNT'), 'Nedostaje AUTOFINISH_COUNT');
    assert(apiRouteSource.includes('KOMPANIJA'), 'Nedostaje KOMPANIJA');
  });

  await test('GET vraća 200', () => {
    assertEqual(response.status, 200, 'status');
  });

  await test('Payload ima očekivana osnovna polja', () => {
    assertEqual(body['status'] as string, 'kompletno', 'status');
    assertEqual(body['naziv'] as string, 'Autofinish SEO Kompletnost Status', 'naziv');
    assertEqual(body['opis'] as string, `Status SEO kompletnosti za ${KOMPANIJA}`, 'opis');
    assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
    assertEqual(body['autofinishIteracija'] as number, AUTOFINISH_COUNT, 'autofinishIteracija');
    assertEqual(body['ukupnaKompletnost'] as string, '100%', 'ukupnaKompletnost');
    assert(typeof body['preporuka'] === 'string' && (body['preporuka'] as string).length > 0, 'preporuka string');
    assert(typeof body['timestamp'] === 'string', 'timestamp string');
  });

  await test('seoStatus objekat ima ključne SEO indikatore', () => {
    assert(typeof seoStatus === 'object' && seoStatus !== null, 'seoStatus objekat');
    assertEqual(seoStatus['ogImage'] as string, 'AKTIVAN', 'ogImage');
    assertEqual(seoStatus['twitterCards'] as string, 'AKTIVAN', 'twitterCards');
    assert(typeof seoStatus['jsonLd'] === 'string' && String(seoStatus['jsonLd']).includes('AKTIVAN'), 'jsonLd');
    assert(typeof seoStatus['sitemap'] === 'string' && String(seoStatus['sitemap']).includes('AKTIVAN'), 'sitemap');
    assert(typeof seoStatus['canonicalUrl'] === 'string' && String(seoStatus['canonicalUrl']).includes('AKTIVAN'), 'canonicalUrl');
  });

  await test('Konstante su ažurirane', () => {
    assertEqual(APP_VERSION, '58.7.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1318, 'AUTOFINISH_COUNT');
    assertEqual(TOTAL_API_ROUTES, 1158, 'TOTAL_API_ROUTES');
    assertEqual(TOTAL_ROUTES, 1258, 'TOTAL_ROUTES');
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
