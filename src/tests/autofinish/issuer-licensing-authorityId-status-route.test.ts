// Autofinish #1392 — Issuer Licensing Authority Status Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/issuer-licensing-authorityId-status-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import { PATCH } from '../../app/api/issuer-licensing/[authorityId]/status/route';
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

function makeRequest(body: unknown, authorization?: string): NextRequest {
  return new Request('http://localhost/api/issuer-licensing/nbs/status', {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      ...(authorization ? { authorization } : {}),
      'x-forwarded-for': '127.0.0.1',
    },
    body: JSON.stringify(body),
  }) as NextRequest;
}

async function runTests(): Promise<void> {
  console.log('\n🏁 Issuer Licensing Authority Status — Route Coverage Test Suite (#1392)\n');

  const routePath = path.resolve(
    process.cwd(),
    'src/app/api/issuer-licensing/[authorityId]/status/route.ts',
  );
  const routeSource = fs.readFileSync(routePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(routePath), `${routePath} ne postoji`);
  });

  await test('Ruta eksportuje PATCH', () => {
    assert(routeSource.includes('export async function PATCH'), 'Nedostaje PATCH handler');
  });

  await test('Ruta koristi auth, rate limit i status tranziciju', () => {
    assert(routeSource.includes('requireIssuerIdentity'), 'Nedostaje requireIssuerIdentity');
    assert(routeSource.includes('checkRateLimitGlobal'), 'Nedostaje checkRateLimitGlobal');
    assert(routeSource.includes('transitionIssuerAuthorityStatus'), 'Nedostaje transitionIssuerAuthorityStatus');
  });

  await test('Ruta validira authorityId i noviStatus', () => {
    assert(routeSource.includes('authorityId je obavezan'), 'Nedostaje authorityId validacija');
    assert(routeSource.includes('Polje noviStatus je obavezno'), 'Nedostaje noviStatus validacija');
  });

  await test('Konstante su ažurirane', () => {
    assert(/^\d+\.\d+\.\d+$/.test(APP_VERSION), 'APP_VERSION semver format');
    assert(AUTOFINISH_COUNT >= 1392, 'AUTOFINISH_COUNT baseline');
  });

  await test('PATCH bez tokena vraća 401', async () => {
    const req = makeRequest({ noviStatus: 'aktivan' });
    const response = await PATCH(req, { params: Promise.resolve({ authorityId: 'nbs' }) });
    assertEqual(response.status, 401, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    assert(typeof body['error'] === 'string', 'error string');
  });

  await test('PATCH sa nevažećim tokenom vraća 401', async () => {
    const req = makeRequest({ noviStatus: 'aktivan' }, 'Bearer invalid-token');
    const response = await PATCH(req, { params: Promise.resolve({ authorityId: 'nbs' }) });
    assertEqual(response.status, 401, 'status');
  });

  await test('PATCH nikad ne vraća 500 za auth greške', async () => {
    const req = makeRequest({ noviStatus: 'suspendovan' }, 'Bearer invalid-token');
    const response = await PATCH(req, { params: Promise.resolve({ authorityId: 'nbs' }) });
    assert(response.status !== 500, 'Ne očekuje se 500 za auth grešku');
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
