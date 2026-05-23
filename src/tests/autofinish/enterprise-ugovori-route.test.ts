// Autofinish #1354 — Enterprise Ugovori Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/enterprise-ugovori-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import { GET, POST } from '../../app/api/enterprise-ugovori/route';
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
  console.log('\n🏁 Enterprise Ugovori — Route Coverage Test Suite (#1354)\n');

  const routePath = path.resolve(process.cwd(), 'src/app/api/enterprise-ugovori/route.ts');
  const routeSource = fs.readFileSync(routePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(routePath), `${routePath} ne postoji`);
  });

  await test('Ruta koristi očekivane enterprise gradivne blokove', () => {
    assert(routeSource.includes('getEnterpriseUgovorPlan'), 'Nedostaje getEnterpriseUgovorPlan');
    assert(routeSource.includes('ucitajEnterpriseUgovore'), 'Nedostaje ucitajEnterpriseUgovore');
    assert(routeSource.includes('ucitajEnterpriseKomunikacijaIstoriju'), 'Nedostaje istorija loader');
    assert(routeSource.includes('upisiEnterpriseKomunikaciju'), 'Nedostaje upisiEnterpriseKomunikaciju');
    assert(routeSource.includes('VALID_PROVAJDERI'), 'Nedostaje VALID_PROVAJDERI');
    assert(routeSource.includes('NextResponse.json'), 'Nedostaje NextResponse.json');
  });

  await test('Konstante su ažurirane', () => {
    assertEqual(APP_VERSION, '59.25.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1354, 'AUTOFINISH_COUNT');
  });

  await test('GET vraća 200 i očekivanu strukturu', async () => {
    const response = await GET();
    assertEqual(response.status, 200, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['status'] as string, 'aktivan', 'status');
    assertEqual(body['naziv'] as string, 'Enterprise Ugovor Modul', 'naziv');
    assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
    assert(Array.isArray(body['plan']), 'plan niz');
    assert(Array.isArray(body['ugovori']), 'ugovori niz');
    assert(Array.isArray(body['istorija']), 'istorija niz');
    assert(typeof body['summary'] === 'object' && body['summary'] !== null, 'summary objekat');
    assert(typeof body['timestamp'] === 'string', 'timestamp string');
  });

  await test('GET summary je usklađen sa nizom ugovora', async () => {
    const response = await GET();
    const body = (await response.json()) as Record<string, unknown>;
    const ugovori = body['ugovori'] as Array<Record<string, unknown>>;
    const summary = body['summary'] as Record<string, unknown>;

    assertEqual(summary['ukupno'] as number, ugovori.length, 'summary.ukupno');
    assert(typeof summary['pending'] === 'number', 'summary.pending');
    assert(typeof summary['kontaktiran'] === 'number', 'summary.kontaktiran');
    assert(typeof summary['potpisano'] === 'number', 'summary.potpisano');
    assert(typeof summary['istorijaZapisa'] === 'number', 'summary.istorijaZapisa');
  });

  await test('POST odbija nevalidan JSON payload', async () => {
    const req = new Request('http://localhost/api/enterprise-ugovori', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{',
    });
    const response = await POST(req as NextRequest);
    assertEqual(response.status, 400, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['code'] as string, 'BAD_REQUEST', 'code');
  });

  await test('POST odbija nepoznat provider', async () => {
    const req = new Request('http://localhost/api/enterprise-ugovori', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        provider: 'apple',
        status: 'pending',
        kanal: 'email',
      }),
    });
    const response = await POST(req as NextRequest);
    assertEqual(response.status, 422, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['code'] as string, 'UNPROCESSABLE_ENTITY', 'code');
  });

  await test('POST odbija nevalidan status', async () => {
    const req = new Request('http://localhost/api/enterprise-ugovori', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        provider: 'vercel',
        status: 'odobreno',
        kanal: 'email',
      }),
    });
    const response = await POST(req as NextRequest);
    assertEqual(response.status, 422, 'status');
  });

  await test('POST odbija nevalidan kanal', async () => {
    const req = new Request('http://localhost/api/enterprise-ugovori', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        provider: 'github',
        status: 'pending',
        kanal: 'chat',
      }),
    });
    const response = await POST(req as NextRequest);
    assertEqual(response.status, 422, 'status');
  });

  await test('POST validan payload vraća fallback 202 bez Supabase konfiguracije', async () => {
    const req = new Request('http://localhost/api/enterprise-ugovori', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        provider: 'openai',
        status: 'kontaktiran',
        kanal: 'email',
        kontaktOsoba: 'Test Kontakt',
        napomena: 'Autofinish validacija enterprise ugovora',
      }),
    });
    const response = await POST(req as NextRequest);
    assert([201, 202].includes(response.status), 'status 201 ili 202');

    const body = (await response.json()) as Record<string, unknown>;
    assert(typeof body['status'] === 'string', 'status string');
    assert(typeof body['timestamp'] === 'string', 'timestamp string');
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
