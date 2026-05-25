// Autofinish #1379 — Digitalna Industrija Licencni Procurement Queue Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/digitalna-industrija-licencni-procurement-queue-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/digitalna-industrija-licencni-procurement-queue/route';
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
  console.log('\n🏁 Digitalna Industrija Licencni Procurement Queue — Route Coverage Test Suite (#1379)\n');

  const routePath = path.resolve(process.cwd(), 'src/app/api/digitalna-industrija-licencni-procurement-queue/route.ts');
  const routeSource = fs.readFileSync(routePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(routePath), `${routePath} ne postoji`);
  });

  await test('Ruta koristi očekivane gradivne blokove', () => {
    assert(routeSource.includes('getLicencniPortfolioProcurementQueue'), 'Nedostaje getLicencniPortfolioProcurementQueue');
    assert(routeSource.includes('getLicencniPortfolioBlokatori'), 'Nedostaje getLicencniPortfolioBlokatori');
    assert(routeSource.includes('apiSuccess'), 'Nedostaje apiSuccess');
    assert(routeSource.includes('checkRateLimitGlobal'), 'Nedostaje checkRateLimitGlobal');
  });

  await test('Konstante su ažurirane', () => {
    assertEqual(APP_VERSION, '59.49.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1383, 'AUTOFINISH_COUNT');
  });

  await test('GET vraća 200 i očekivanu strukturu', async () => {
    const req = new Request('http://localhost/api/digitalna-industrija-licencni-procurement-queue') as NextRequest;
    const response = await GET(req);
    assertEqual(response.status, 200, 'status');

    const body = (await response.json()) as { data: Record<string, unknown> };
    const d = body.data;
    assertEqual(d['status'] as string, 'aktivan', 'data.status');
    assert(typeof d['naziv'] === 'string', 'data.naziv string');
    assertEqual(d['verzija'] as string, APP_VERSION, 'data.verzija');
    assert(typeof d['summary'] === 'object' && d['summary'] !== null, 'data.summary objekat');
    assert(Array.isArray(d['blokatori']), 'data.blokatori niz');
    assert(Array.isArray(d['queue']), 'data.queue niz');
    assert(typeof d['timestamp'] === 'string', 'data.timestamp string');
  });

  await test('GET summary sadrži pregled blokatora i top5', async () => {
    const req = new Request('http://localhost/api/digitalna-industrija-licencni-procurement-queue') as NextRequest;
    const response = await GET(req);
    const body = (await response.json()) as { data: { summary: Record<string, unknown> } };
    const summary = body.data.summary;

    assert(typeof summary['ukupnoUQueuu'] === 'number', 'summary.ukupnoUQueuu');
    assert(typeof summary['blokirajucihLegalanRad'] === 'number', 'summary.blokirajucihLegalanRad');
    assert(typeof summary['blokirajucihPlatforme'] === 'number', 'summary.blokirajucihPlatforme');
    assert(Array.isArray(summary['top5Prioritetnih']), 'summary.top5Prioritetnih');
  });

  await test('GET procurement queue ne sadrži verifikovane ili aktivirane stavke', async () => {
    const req = new Request('http://localhost/api/digitalna-industrija-licencni-procurement-queue') as NextRequest;
    const response = await GET(req);
    const body = (await response.json()) as { data: { queue: Array<Record<string, unknown>> } };
    const queue = body.data.queue;

    for (const item of queue) {
      const status = item['status'] as string;
      assert(
        status !== 'verifikovano' && status !== 'aktivirano',
        `Queue ne sme da sadrži status '${status}' za stavku '${item['id'] as string}'`,
      );
    }
  });

  await test('GET procurement queue je sortiran — blokatori_legalan_rad su na vrhu', async () => {
    const req = new Request('http://localhost/api/digitalna-industrija-licencni-procurement-queue') as NextRequest;
    const response = await GET(req);
    const body = (await response.json()) as { data: { queue: Array<Record<string, unknown>> } };
    const queue = body.data.queue;

    if (queue.length < 2) return;

    const hasLegalRadBlocker = queue.some((s) => s['blokator'] === 'blokira_legalan_rad');
    if (hasLegalRadBlocker) {
      const firstLegalRad = queue.findIndex((s) => s['blokator'] === 'blokira_legalan_rad');
      const firstNeblokirajuca = queue.findIndex((s) => s['blokator'] === 'neblokirajuca');
      if (firstNeblokirajuca >= 0) {
        assert(
          firstLegalRad < firstNeblokirajuca,
          `blokira_legalan_rad (idx ${firstLegalRad}) treba da je pre neblokirajuca (idx ${firstNeblokirajuca})`,
        );
      }
    }
  });

  await test('GET blokatori sadrže samo neblokirajuce=false stavke', async () => {
    const req = new Request('http://localhost/api/digitalna-industrija-licencni-procurement-queue') as NextRequest;
    const response = await GET(req);
    const body = (await response.json()) as { data: { blokatori: Array<Record<string, unknown>> } };

    for (const b of body.data.blokatori) {
      assert(b['blokator'] !== 'neblokirajuca', `Blokatori ne smeju da sadrže neblokirajucu stavku: ${b['id'] as string}`);
    }
  });

  console.log(`\n🏁 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) {
    console.error('\n❌ Neuspešni testovi:');
    failures.forEach((f) => console.error(`  • ${f}`));
    process.exit(1);
  }
  console.log('\n✅ Svi testovi prošli.\n');
}

runTests().catch((err) => {
  console.error('Fatalna greška u testu:', err);
  process.exit(1);
});
