// Autofinish #1407 — AUTOFINISH 2 Batch #2 High-Risk Wallet/Payments Tests
// Pokretanje: npx tsx src/tests/autofinish/autofinish-2-high-risk-batch-wallet-payments.test.ts

import fs from 'node:fs';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import { POST as stripeWebhookPOST } from '../../app/api/stripe/webhook/route';
import { POST as paypalWebhookPOST } from '../../app/api/paypal/webhook/route';
import { POST as walletSetupIntentPOST } from '../../app/api/wallet/cards/setup-intent/route';
import { POST as walletTokenizePOST } from '../../app/api/wallet/cards/tokenize/route';
import { POST as stripeCheckoutPOST } from '../../app/api/stripe/checkout/route';
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
  console.log('\n🏁 Autofinish #1407 — AUTOFINISH 2 Batch #2 (wallet/payments)\n');

  const routeFiles = {
    stripeWebhook: path.resolve(process.cwd(), 'src/app/api/stripe/webhook/route.ts'),
    paypalWebhook: path.resolve(process.cwd(), 'src/app/api/paypal/webhook/route.ts'),
    walletSetupIntent: path.resolve(process.cwd(), 'src/app/api/wallet/cards/setup-intent/route.ts'),
    walletTokenize: path.resolve(process.cwd(), 'src/app/api/wallet/cards/tokenize/route.ts'),
    stripeCheckout: path.resolve(process.cwd(), 'src/app/api/stripe/checkout/route.ts'),
  };

  await test('Batch #2 route fajlovi postoje', () => {
    Object.values(routeFiles).forEach((routeFile) => {
      assert(fs.existsSync(routeFile), `${routeFile} ne postoji`);
    });
  });

  await test('Wallet/payments safety gate-ovi su prisutni u source-u', () => {
    const stripeWebhookSrc = fs.readFileSync(routeFiles.stripeWebhook, 'utf8');
    assertIncludes(stripeWebhookSrc, 'stripe-signature', 'stripe/webhook signature guard');
    assertIncludes(stripeWebhookSrc, 'stripeWebhookCircuit', 'stripe/webhook circuit breaker');
    assertIncludes(stripeWebhookSrc, 'webhook_dead_letter', 'stripe/webhook dead-letter queue');

    const paypalWebhookSrc = fs.readFileSync(routeFiles.paypalWebhook, 'utf8');
    assertIncludes(paypalWebhookSrc, 'verifyPayPalWebhook', 'paypal/webhook verification');
    assertIncludes(paypalWebhookSrc, 'ALLOWED_PAYPAL_EVENT_TYPES', 'paypal/webhook whitelist');
    assertIncludes(paypalWebhookSrc, 'paypal_webhook_events', 'paypal/webhook idempotency store');

    const walletSetupSrc = fs.readFileSync(routeFiles.walletSetupIntent, 'utf8');
    assertIncludes(walletSetupSrc, 'verifyUserFromToken', 'wallet setup auth');
    assertIncludes(walletSetupSrc, 'extractIdempotencyKey', 'wallet setup idempotency extraction');
    assertIncludes(walletSetupSrc, 'validateIdempotencyKey', 'wallet setup idempotency validation');

    const walletTokenizeSrc = fs.readFileSync(routeFiles.walletTokenize, 'utf8');
    assertIncludes(walletTokenizeSrc, 'verifyUserFromToken', 'wallet tokenize auth');
    assertIncludes(walletTokenizeSrc, 'routePayment', 'wallet tokenize routing');
    assertIncludes(walletTokenizeSrc, 'paymentMethods.retrieve', 'wallet tokenize stripe fetch');

    const stripeCheckoutSrc = fs.readFileSync(routeFiles.stripeCheckout, 'utf8');
    assertIncludes(stripeCheckoutSrc, 'verifyUserFromToken', 'stripe/checkout auth');
    assertIncludes(stripeCheckoutSrc, 'checkRateLimitGlobal', 'stripe/checkout rate limit');
    assertIncludes(stripeCheckoutSrc, 'validateIdempotencyKey', 'stripe/checkout idempotency validation');
  });

  await test('stripe/webhook bez stripe-signature zaglavlja vraća 400', async () => {
    const req = new Request('http://localhost/api/stripe/webhook', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id: 'evt_missing_sig', type: 'invoice.paid' }),
    });
    const res = await stripeWebhookPOST(req as NextRequest);
    assertEqual(res.status, 400, 'stripe/webhook status');

    const body = (await res.json()) as Record<string, unknown>;
    assert(typeof body['error'] === 'string', 'stripe/webhook error string');
  });

  await test('paypal/webhook sa neispravnim payload-om vraća 400', async () => {
    const req = new Request('http://localhost/api/paypal/webhook', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{',
    });
    const res = await paypalWebhookPOST(req as NextRequest);
    assertEqual(res.status, 400, 'paypal/webhook status');
  });

  await test('wallet/cards/setup-intent bez auth vraća 401', async () => {
    const req = new Request('http://localhost/api/wallet/cards/setup-intent', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    });
    const res = await walletSetupIntentPOST(req as NextRequest);
    assertEqual(res.status, 401, 'wallet/cards/setup-intent status');

    const body = (await res.json()) as Record<string, unknown>;
    assertEqual(body['code'] as string, 'UNAUTHORIZED', 'wallet/cards/setup-intent code');
  });

  await test('wallet/cards/tokenize bez auth vraća 401', async () => {
    const req = new Request('http://localhost/api/wallet/cards/tokenize', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ paymentMethodId: 'pm_test_123' }),
    });
    const res = await walletTokenizePOST(req as NextRequest);
    assertEqual(res.status, 401, 'wallet/cards/tokenize status');

    const body = (await res.json()) as Record<string, unknown>;
    assertEqual(body['code'] as string, 'UNAUTHORIZED', 'wallet/cards/tokenize code');
  });

  await test('stripe/checkout bez auth vraća 401', async () => {
    const req = new Request('http://localhost/api/stripe/checkout', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ planId: 'starter-plus' }),
    });
    const res = await stripeCheckoutPOST(req as NextRequest);
    assertEqual(res.status, 401, 'stripe/checkout status');
  });

  await test('Konstante su konzistentne sa Autofinish #1407 baseline-om', () => {
    assert(/^\d+\.\d+\.\d+$/.test(APP_VERSION), 'APP_VERSION semver format');
    assert(AUTOFINISH_COUNT >= 1407, 'AUTOFINISH_COUNT baseline');
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
