// Autofinish #1405 — AUTOFINISH 2 Batch #1 High-Risk Auth/Billing/Admin Tests
// Pokretanje: npx tsx src/tests/autofinish/autofinish-2-high-risk-batch-auth-billing.test.ts

import fs from 'node:fs';
import path from 'node:path';
import { NextRequest } from 'next/server';
import { POST as loginPOST } from '../../app/api/auth/login/route';
import { POST as registerPOST } from '../../app/api/auth/register/route';
import { POST as refreshPOST } from '../../app/api/auth/refresh/route';
import { POST as billingUpgradePOST } from '../../app/api/billing-upgrade-company-request/route';
import { POST as billingWebhookReplayPOST } from '../../app/api/admin/billing-webhook-replay/route';
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
  console.log('\n🏁 Autofinish #1405 — AUTOFINISH 2 Batch #1 (high-risk routes)\n');

  const routeFiles = {
    login: path.resolve(process.cwd(), 'src/app/api/auth/login/route.ts'),
    register: path.resolve(process.cwd(), 'src/app/api/auth/register/route.ts'),
    refresh: path.resolve(process.cwd(), 'src/app/api/auth/refresh/route.ts'),
    billingUpgrade: path.resolve(
      process.cwd(),
      'src/app/api/billing-upgrade-company-request/route.ts',
    ),
    billingWebhookReplay: path.resolve(
      process.cwd(),
      'src/app/api/admin/billing-webhook-replay/route.ts',
    ),
  };

  await test('Batch #1 route fajlovi postoje', () => {
    Object.values(routeFiles).forEach((routeFile) => {
      assert(fs.existsSync(routeFile), `${routeFile} ne postoji`);
    });
  });

  await test('High-risk route source safety gate-ovi su prisutni', () => {
    const loginSrc = fs.readFileSync(routeFiles.login, 'utf8');
    assertIncludes(loginSrc, 'checkBruteForce', 'auth/login brute-force');
    assertIncludes(loginSrc, 'export async function POST', 'auth/login POST');

    const registerSrc = fs.readFileSync(routeFiles.register, 'utf8');
    assertIncludes(registerSrc, 'checkRegisterBruteForce', 'auth/register brute-force');
    assertIncludes(registerSrc, 'export async function POST', 'auth/register POST');

    const billingUpgradeSrc = fs.readFileSync(routeFiles.billingUpgrade, 'utf8');
    assertIncludes(billingUpgradeSrc, 'checkRateLimitGlobal', 'billing-upgrade rate-limit');
    assertIncludes(billingUpgradeSrc, 'validateUpgradeCompanyRequestPayload', 'billing-upgrade payload validation');

    const webhookReplaySrc = fs.readFileSync(routeFiles.billingWebhookReplay, 'utf8');
    assertIncludes(webhookReplaySrc, 'verifyUserFromToken', 'admin replay auth check');
    assertIncludes(webhookReplaySrc, 'checkRateLimitGlobal', 'admin replay rate-limit');
  });

  await test('auth/login odbija nevalidan JSON (400)', async () => {
    const req = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': '127.0.5.1' },
      body: '{',
    });
    const res = await loginPOST(req as never);
    assertEqual(res.status, 400, 'auth/login status');
  });

  await test('auth/register odbija neispravan email format (400)', async () => {
    const req = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': '127.0.5.2' },
      body: JSON.stringify({ email: 'bad-email', password: '12345678' }),
    });
    const res = await registerPOST(req as never);
    assertEqual(res.status, 400, 'auth/register status');
  });

  await test('auth/refresh bez tokena vraća 401', async () => {
    const req = new NextRequest('http://localhost/api/auth/refresh', { method: 'POST' });
    const res = await refreshPOST(req as never);
    assertEqual(res.status, 401, 'auth/refresh status');
  });

  await test('billing-upgrade odbija neispravan payload (422)', async () => {
    const req = new Request('http://localhost/api/billing-upgrade-company-request', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': '127.0.5.3' },
      body: JSON.stringify({}),
    });
    const res = await billingUpgradePOST(req as never);
    assertEqual(res.status, 422, 'billing-upgrade status');
  });

  await test('admin billing webhook replay bez auth vraća 403', async () => {
    const req = new Request('http://localhost/api/admin/billing-webhook-replay', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ dlqId: 'dlq-1', approvedBy: 'admin-2' }),
    });
    const res = await billingWebhookReplayPOST(req as never);
    assertEqual(res.status, 403, 'admin/billing-webhook-replay status');
  });

  await test('Konstante su konzistentne sa Autofinish #1405 baseline-om', () => {
    assert(/^\d+\.\d+\.\d+$/.test(APP_VERSION), 'APP_VERSION semver format');
    assert(AUTOFINISH_COUNT >= 1405, 'AUTOFINISH_COUNT baseline');
    assert(TOTAL_API_ROUTES >= 1208, 'TOTAL_API_ROUTES baseline');
    assert(TOTAL_ROUTES >= 1337, 'TOTAL_ROUTES baseline');
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
