// Autofinish #1340 — Kastler TV Signal Request Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/kastler-tv-signal-request-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import { GET, POST } from '../../app/api/kastler-tv-signal-request/route';
import {
  KASTLER_TV_ACCEPTANCE_TEXT,
  KASTLER_TV_REQUEST_VERSION,
  getKastlerTVSignalRequestPackage,
} from '../../lib/kastler-tv-signal-request';

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
  console.log('\n🏁 Autofinish Kastler TV Signal Request — Route Coverage Test Suite (#1340)\n');

  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/kastler-tv-signal-request/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('API ruta koristi očekivane gradivne blokove', () => {
    assert(apiRouteSource.includes('validateKastlerRequestPayload'), 'Nedostaje validateKastlerRequestPayload');
    assert(apiRouteSource.includes('buildKastlerRequestRecord'), 'Nedostaje buildKastlerRequestRecord');
    assert(apiRouteSource.includes('tv-signal-release-and-monetization-request'), 'Nedostaje dispatch intent');
  });

  await test('GET vraća 200 i Kastler paket', async () => {
    const response = await GET();
    assertEqual(response.status, 200, 'status');
    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['route'] as string, '/api/kastler-tv-signal-request', 'route');
    assertEqual(body['packageVersion'] as string, KASTLER_TV_REQUEST_VERSION, 'packageVersion');
    const paket = body['paket'] as Record<string, unknown>;
    assert(typeof paket['statusRikvesta'] === 'string', 'paket.statusRikvesta');
  });

  await test('POST sa neispravnim payload-om vraća 422', async () => {
    const request = new Request('http://localhost/api/kastler-tv-signal-request', {
      method: 'POST',
      headers: { 'x-forwarded-for': '127.0.0.1', 'content-type': 'application/json' },
      body: JSON.stringify({
        expectedPartner: 'kastler',
        expectedVersion: 'bad',
        requestedChannelIds: ['bad-channel'],
        monetizationModel: 'hibrid',
        acceptanceText: 'bad',
        autoSendToPartner: false,
      }),
    });
    const response = await POST(request as NextRequest);
    assertEqual(response.status, 422, 'status');
    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['code'] as string, 'INVALID_PAYLOAD', 'code');
  });

  await test('POST sa validnim payload-om vraća 200 i request record', async () => {
    const paket = getKastlerTVSignalRequestPackage();
    const request = new Request('http://localhost/api/kastler-tv-signal-request', {
      method: 'POST',
      headers: { 'x-forwarded-for': '127.0.0.1', 'content-type': 'application/json' },
      body: JSON.stringify({
        expectedPartner: 'kastler',
        expectedVersion: KASTLER_TV_REQUEST_VERSION,
        requestedChannelIds: paket.trazeniKanali.map((k) => k.kanalId),
        monetizationModel: 'hibrid',
        acceptanceText: KASTLER_TV_ACCEPTANCE_TEXT,
        autoSendToPartner: true,
      }),
    });
    const response = await POST(request as NextRequest);
    assertEqual(response.status, 200, 'status');
    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['status'] as string, 'ok', 'status');
    const requestRecord = body['requestRecord'] as Record<string, unknown>;
    assert(typeof requestRecord['requestId'] === 'string', 'requestRecord.requestId');
    assert(typeof requestRecord['auditHash'] === 'string', 'requestRecord.auditHash');
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
