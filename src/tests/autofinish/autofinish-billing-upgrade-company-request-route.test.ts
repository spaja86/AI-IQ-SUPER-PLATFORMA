// Autofinish #1331 — Autofinish Billing Upgrade Company Request Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/autofinish-billing-upgrade-company-request-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import { POST } from '../../app/api/billing-upgrade-company-request/route';
import {
  BILLING_UPGRADE_DISCLOSURE,
  DEFAULT_UPGRADE_COMPANY_REQUEST_CONTEXT,
  UPGRADE_ACCEPTANCE_TEXT,
} from '../../lib/billing/upgrade-disclosure';
import { APP_VERSION, AUTOFINISH_COUNT, TOTAL_API_ROUTES, TOTAL_DIAGNOSTIKA, TOTAL_ROUTES } from '../../lib/constants';

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
  console.log('\n🏁 Autofinish Billing Upgrade Company Request — Route Coverage Test Suite (#1331)\n');

  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/billing-upgrade-company-request/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('API ruta koristi očekivane gradivne blokove', () => {
    assert(apiRouteSource.includes('validateUpgradeCompanyRequestPayload'), 'Nedostaje validateUpgradeCompanyRequestPayload');
    assert(apiRouteSource.includes('buildUpgradeCompanyRequestRecord'), 'Nedostaje buildUpgradeCompanyRequestRecord');
    assert(apiRouteSource.includes('company-billing-transfer-and-best-subscription-request'), 'Nedostaje dispatch intent');
  });

  await test('POST sa neispravnim JSON payload-om vraća 400', async () => {
    const request = new Request('http://localhost/api/billing-upgrade-company-request', {
      method: 'POST',
      headers: { 'x-forwarded-for': '127.0.0.1', 'content-type': 'application/json' },
      body: '{',
    });

    const response = await POST(request as NextRequest);
    assertEqual(response.status, 400, 'status');
    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['code'] as string, 'INVALID_JSON', 'code');
  });

  await test('POST sa neispravnim payload-om vraća 422', async () => {
    const request = new Request('http://localhost/api/billing-upgrade-company-request', {
      method: 'POST',
      headers: { 'x-forwarded-for': '127.0.0.1', 'content-type': 'application/json' },
      body: JSON.stringify({
        expectedTotalUsd: 999,
        version: 'invalid-version',
        acceptanceText: 'invalid',
        autoSendToCompanyBilling: false,
        sendMode: 'bad_mode',
      }),
    });

    const response = await POST(request as NextRequest);
    assertEqual(response.status, 422, 'status');
    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['code'] as string, 'INVALID_PAYLOAD', 'code');
    assert(Array.isArray(body['details']), 'details niz');
    assert((body['details'] as unknown[]).length >= 1, 'details nije prazan');
  });

  await test('POST sa validnim payload-om vraća 200 i dispatch context', async () => {
    const request = new Request('http://localhost/api/billing-upgrade-company-request', {
      method: 'POST',
      headers: { 'x-forwarded-for': '127.0.0.1', 'content-type': 'application/json' },
      body: JSON.stringify({
        expectedTotalUsd: BILLING_UPGRADE_DISCLOSURE.totalUsd,
        version: BILLING_UPGRADE_DISCLOSURE.version,
        acceptanceText: UPGRADE_ACCEPTANCE_TEXT,
        autoSendToCompanyBilling: true,
        sendMode: 'dispatch_internal',
      }),
    });

    const response = await POST(request as NextRequest);
    assertEqual(response.status, 200, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['status'] as string, 'ok', 'status');
    assertEqual(body['route'] as string, '/api/billing-upgrade-company-request', 'route');

    const disclosure = body['disclosure'] as Record<string, unknown>;
    assertEqual(disclosure['version'] as string, BILLING_UPGRADE_DISCLOSURE.version, 'disclosure.version');
    assertEqual(disclosure['totalUsd'] as number, BILLING_UPGRADE_DISCLOSURE.totalUsd, 'disclosure.totalUsd');

    const companyContext = body['companyContext'] as Record<string, unknown>;
    assertEqual(
      companyContext['accountEmail'] as string,
      DEFAULT_UPGRADE_COMPANY_REQUEST_CONTEXT.accountEmail,
      'companyContext.accountEmail',
    );
    assertEqual(
      companyContext['ownerName'] as string,
      DEFAULT_UPGRADE_COMPANY_REQUEST_CONTEXT.ownerName,
      'companyContext.ownerName',
    );

    const requestRecord = body['requestRecord'] as Record<string, unknown>;
    assert(typeof requestRecord['requestId'] === 'string' && (requestRecord['requestId'] as string).startsWith('UPG-'), 'requestId');
    assert(typeof requestRecord['auditHash'] === 'string' && (requestRecord['auditHash'] as string).length === 64, 'auditHash');
    assertEqual(requestRecord['status'] as string, 'queued_for_billing_dispatch', 'requestRecord.status');
    assertEqual(requestRecord['sendMode'] as string, 'dispatch_internal', 'requestRecord.sendMode');

    const dispatch = body['dispatch'] as Record<string, unknown>;
    assertEqual(dispatch['kanal'] as string, 'billing@spaja.rs', 'dispatch.kanal');
    assert(Array.isArray(dispatch['cc']), 'dispatch.cc niz');
    assert((dispatch['cc'] as string[]).includes('sales@spaja.rs'), 'dispatch.cc uključuje sales@spaja.rs');
    assertEqual(
      dispatch['intent'] as string,
      'company-billing-transfer-and-best-subscription-request',
      'dispatch.intent',
    );

    const githubEnterpriseContext = body['githubEnterpriseContext'] as Record<string, unknown>;
    assert(typeof githubEnterpriseContext['naslov'] === 'string', 'githubEnterpriseContext.naslov string');
    assert(Array.isArray(githubEnterpriseContext['trazeniPlanovi']), 'githubEnterpriseContext.trazeniPlanovi niz');
    assert(Array.isArray(githubEnterpriseContext['trazeneOpcije']), 'githubEnterpriseContext.trazeneOpcije niz');
    assert(typeof githubEnterpriseContext['kanalPodnosenja'] === 'object', 'githubEnterpriseContext.kanalPodnosenja objekt');

    const eksplicitniKontekst = githubEnterpriseContext['eksplicitniKontekst'] as Record<string, unknown>;
    assertEqual(eksplicitniKontekst['accountEmail'] as string, 'spajicn@yahoo.com', 'eksplicitniKontekst.accountEmail');
    assertEqual(eksplicitniKontekst['ownerName'] as string, 'Nikola Spajić', 'eksplicitniKontekst.ownerName');
  });

  await test('Konstante su ažurirane', () => {
    assertEqual(APP_VERSION, '59.15.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1336, 'AUTOFINISH_COUNT');
    assertEqual(TOTAL_API_ROUTES, 1159, 'TOTAL_API_ROUTES');
    assertEqual(TOTAL_ROUTES, 1260, 'TOTAL_ROUTES');
    assertEqual(TOTAL_DIAGNOSTIKA, 2364, 'TOTAL_DIAGNOSTIKA');
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
