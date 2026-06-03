// Autofinish #1425 — Spaja Pro Settings Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/spaja-pro-settings-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import { GET, PUT } from '../../app/api/spaja-pro/settings/route';
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
  console.log('\n🏁 Spaja Pro Settings — Route Coverage Test Suite (#1425)\n');

  const routePath = path.resolve(process.cwd(), 'src/app/api/spaja-pro/settings/route.ts');
  const routeSource = fs.readFileSync(routePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(routePath), `${routePath} ne postoji`);
  });

  await test('Ruta koristi očekivane auth i personalizacija v3 gradivne blokove', () => {
    assert(routeSource.includes('export async function GET'), 'Nedostaje GET handler');
    assert(routeSource.includes('export async function PUT'), 'Nedostaje PUT handler');
    assert(routeSource.includes('verifyUserFromToken'), 'Nedostaje verifyUserFromToken');
    assert(routeSource.includes('applyStablePreferenceUpdate'), 'Nedostaje applyStablePreferenceUpdate');
    assert(routeSource.includes('applyAdaptivePreferenceUpdate'), 'Nedostaje applyAdaptivePreferenceUpdate');
    assert(routeSource.includes('buildExplainabilityPayloadV3'), 'Nedostaje buildExplainabilityPayloadV3');
    assert(routeSource.includes('isPersonalizationV3Enabled'), 'Nedostaje isPersonalizationV3Enabled');
    assert(routeSource.includes('personalizacijaV3'), 'Nedostaje personalizacijaV3 u GET response');
    assert(routeSource.includes('resetPersonalizationV3'), 'Nedostaje resetPersonalizationV3');
    assert(routeSource.includes('adaptive_preferences'), 'Nedostaje adaptive_preferences mapping');
    assert(routeSource.includes('personalization_feedback'), 'Nedostaje personalization_feedback mapping');
    assert(routeSource.includes('personalization_v3_score'), 'Nedostaje personalization_v3_score mapping');
    assert(routeSource.includes('NextResponse.json'), 'Nedostaje NextResponse.json');
  });

  await test('GET bez auth vraća 401', async () => {
    const request = new Request('http://localhost/api/spaja-pro/settings', {
      headers: { 'x-forwarded-for': '127.0.1.20' },
    });
    const response = await GET(request as NextRequest);
    assertEqual(response.status, 401, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['error'] as string, 'Niste prijavljeni.', 'error');
  });

  await test('PUT bez auth vraća 401', async () => {
    const request = new Request('http://localhost/api/spaja-pro/settings', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        personalizationVersion: 'v3',
        adaptivePreferences: { sessionTempo: 'deep' },
      }),
    });
    const response = await PUT(request as NextRequest);
    assertEqual(response.status, 401, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['error'] as string, 'Niste prijavljeni.', 'error');
  });

  await test('PUT sa nevažećim tokenom ostaje 401', async () => {
    const request = new Request('http://localhost/api/spaja-pro/settings', {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        authorization: '******',
      },
      body: JSON.stringify({ personalizationVersion: 'v3' }),
    });
    const response = await PUT(request as NextRequest);
    assertEqual(response.status, 401, 'status');
  });

  await test('Konstante su dostupne i ažurirane', () => {
    assert(/^\d+\.\d+\.\d+$/.test(APP_VERSION), 'APP_VERSION semver format');
    assert(AUTOFINISH_COUNT >= 1423, 'AUTOFINISH_COUNT baseline');
    assert(TOTAL_API_ROUTES >= 1239, 'TOTAL_API_ROUTES baseline');
    assert(TOTAL_ROUTES >= 1369, 'TOTAL_ROUTES baseline');
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
