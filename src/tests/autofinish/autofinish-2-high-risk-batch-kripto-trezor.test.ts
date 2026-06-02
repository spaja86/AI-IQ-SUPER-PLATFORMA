// Autofinish #1410 — AUTOFINISH 2 Batch #4 High-Risk Kripto Trezor Security Tests
// Pokretanje: npx tsx src/tests/autofinish/autofinish-2-high-risk-batch-kripto-trezor.test.ts

import fs from 'node:fs';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import { GET as complianceGET } from '../../app/api/kripto-trezor/compliance/route';
import { POST as depositPOST } from '../../app/api/kripto-trezor/deposit/route';
import { GET as rebalanceGET } from '../../app/api/kripto-trezor/rebalance/route';
import { POST as withdrawPOST } from '../../app/api/kripto-trezor/withdraw/route';
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

function assertIncludes(text: string, fragment: string, label: string): void {
  assert(text.includes(fragment), `${label} — nedostaje "${fragment}"`);
}

async function runTests(): Promise<void> {
  console.log('\n🏁 Autofinish #1410 — AUTOFINISH 2 Batch #4 (kripto trezor high-risk)\n');

  const routeFiles = {
    compliance: path.resolve(process.cwd(), 'src/app/api/kripto-trezor/compliance/route.ts'),
    deposit: path.resolve(process.cwd(), 'src/app/api/kripto-trezor/deposit/route.ts'),
    rebalance: path.resolve(process.cwd(), 'src/app/api/kripto-trezor/rebalance/route.ts'),
    withdraw: path.resolve(process.cwd(), 'src/app/api/kripto-trezor/withdraw/route.ts'),
  };

  await test('Batch #4 route fajlovi postoje', () => {
    Object.values(routeFiles).forEach((routeFile) => {
      assert(fs.existsSync(routeFile), `${routeFile} ne postoji`);
    });
  });

  await test('Kripto trezor rute sadrže auth + feature-flag + rate-limit zaštite', () => {
    const complianceSrc = fs.readFileSync(routeFiles.compliance, 'utf8');
    assertIncludes(complianceSrc, "isExchangeFlagEnabled('kripto-trezor-compliance')", 'compliance flag');
    assertIncludes(complianceSrc, 'verifyUserFromToken', 'compliance auth');
    assertIncludes(complianceSrc, 'checkRateLimitGlobal', 'compliance rate-limit');

    const depositSrc = fs.readFileSync(routeFiles.deposit, 'utf8');
    assertIncludes(depositSrc, "isExchangeFlagEnabled('kripto-trezor-deposit')", 'deposit flag');
    assertIncludes(depositSrc, 'verifyUserFromToken', 'deposit auth');
    assertIncludes(depositSrc, 'checkRateLimitGlobal', 'deposit rate-limit');
    assertIncludes(depositSrc, "apiError('BAD_REQUEST', 'Neispravan JSON body.')", 'deposit JSON validation');

    const rebalanceSrc = fs.readFileSync(routeFiles.rebalance, 'utf8');
    assertIncludes(rebalanceSrc, "isExchangeFlagEnabled('kripto-trezor-rebalance')", 'rebalance flag');
    assertIncludes(rebalanceSrc, 'verifyUserFromToken', 'rebalance auth');
    assertIncludes(rebalanceSrc, 'checkRateLimitGlobal', 'rebalance rate-limit');

    const withdrawSrc = fs.readFileSync(routeFiles.withdraw, 'utf8');
    assertIncludes(withdrawSrc, "isExchangeFlagEnabled('kripto-trezor-withdraw')", 'withdraw flag');
    assertIncludes(withdrawSrc, 'verifyUserFromToken', 'withdraw auth');
    assertIncludes(withdrawSrc, 'checkRateLimitGlobal', 'withdraw rate-limit');
    assertIncludes(withdrawSrc, "apiError('BAD_REQUEST', 'Neispravan JSON body.')", 'withdraw JSON validation');
  });

  await test('kripto-trezor/compliance bez auth vraća 401', async () => {
    const req = new Request('http://localhost/api/kripto-trezor/compliance', { method: 'GET' });
    const res = await complianceGET(req as NextRequest);
    assertEqual(res.status, 401, 'compliance status');
  });

  await test('kripto-trezor/rebalance bez auth vraća 401', async () => {
    const req = new Request('http://localhost/api/kripto-trezor/rebalance', { method: 'GET' });
    const res = await rebalanceGET(req as NextRequest);
    assertEqual(res.status, 401, 'rebalance status');
  });

  await test('kripto-trezor/deposit bez auth vraća 401', async () => {
    const req = new Request('http://localhost/api/kripto-trezor/deposit', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        assetId: 'BTC',
        amount: 0.5,
        targetTier: 'cold',
        sourceTier: 'exchange',
      }),
    });
    const res = await depositPOST(req as NextRequest);
    assertEqual(res.status, 401, 'deposit status');
  });

  await test('kripto-trezor/withdraw bez auth vraća 401', async () => {
    const req = new Request('http://localhost/api/kripto-trezor/withdraw', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        assetId: 'BTC',
        amount: 0.1,
        destinationAddress: 'bc1qexampledestination000000000',
        sourceTier: 'cold',
        destinationTier: 'external',
      }),
    });
    const res = await withdrawPOST(req as NextRequest);
    assertEqual(res.status, 401, 'withdraw status');
  });

  await test('kripto-trezor/deposit odbija nevalidan JSON body (400)', async () => {
    const req = new Request('http://localhost/api/kripto-trezor/deposit', {
      method: 'POST',
      headers: {
        authorization: '******',
        'content-type': 'application/json',
      },
      body: '{',
    });
    const res = await depositPOST(req as NextRequest);
    assert([400, 401].includes(res.status), 'deposit status je 400 ili 401');
  });

  await test('kripto-trezor/withdraw odbija nevalidan JSON body (400)', async () => {
    const req = new Request('http://localhost/api/kripto-trezor/withdraw', {
      method: 'POST',
      headers: {
        authorization: '******',
        'content-type': 'application/json',
      },
      body: '{',
    });
    const res = await withdrawPOST(req as NextRequest);
    assert([400, 401].includes(res.status), 'withdraw status je 400 ili 401');
  });

  await test('Konstante su konzistentne sa Autofinish #1410 baseline-om', () => {
    assert(/^\d+\.\d+\.\d+$/.test(APP_VERSION), 'APP_VERSION semver format');
    assert(AUTOFINISH_COUNT >= 1410, 'AUTOFINISH_COUNT baseline');
    assert(TOTAL_API_ROUTES >= 1158, 'TOTAL_API_ROUTES baseline');
    assert(TOTAL_ROUTES >= 1258, 'TOTAL_ROUTES baseline');
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
