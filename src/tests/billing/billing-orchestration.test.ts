// Autofinish #1176 — Billing Orchestration, Entitlement, PayPal Tests
// Kompanija SPAJA — Digitalna Industrija

import assert from 'assert';
import { getEntitlement, hasEngineAccess, getEntitlementSummary, ENTITLEMENT_MAP } from '../../lib/billing/entitlement';
import { getEngineMatrix, ENGINE_EVENT_MATRIX } from '../../lib/billing/events';
import { processBillingEvent, isProviderEnabled, getOrchestrationStatus } from '../../lib/billing/orchestration';
import type { BillingEvent } from '../../lib/billing/events';

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    console.error(`  ❌ ${name}: ${e instanceof Error ? e.message : String(e)}`);
    failed++;
  }
}

function ok(condition: boolean, msg: string): void {
  if (!condition) throw new Error(`Assert failed: ${msg}`);
}

async function runTests(): Promise<void> {
  console.log('\n📋 Billing Orchestration Tests (#1176)\n');

  // ── Entitlement model ────────────────────────────────────────────────────
  await test('Starter plan ima chatLimit=10', () => {
    ok(getEntitlement('starter').chatLimit === 10, 'starter.chatLimit');
  });

  await test('Unlimited plan ima chatLimit=-1 (unlimited)', () => {
    ok(getEntitlement('unlimited').chatLimit === -1, 'unlimited.chatLimit');
  });

  await test('Starter nema API pristup', () => {
    ok(!getEntitlement('starter').apiPristup, 'starter.apiPristup=false');
  });

  await test('Basic ima API pristup', () => {
    ok(getEntitlement('basic').apiPristup, 'basic.apiPristup=true');
  });

  await test('Enterprise ima SLA garanciju', () => {
    ok(getEntitlement('enterprise').slaGarancija, 'enterprise.slaGarancija=true');
  });

  await test('Unlimited ima white-label opciju', () => {
    ok(getEntitlement('unlimited').whiteLabelOpcija, 'unlimited.whiteLabelOpcija=true');
  });

  await test('Starter ima pristup SpajaPro engineu', () => {
    ok(hasEngineAccess('starter', 'spaja-pro'), 'starter → spaja-pro');
  });

  await test('Starter nema pristup banci', () => {
    ok(!hasEngineAccess('starter', 'banka'), 'starter → banka = false');
  });

  await test('Pro ima pristup banci', () => {
    ok(hasEngineAccess('pro', 'banka'), 'pro → banka = true');
  });

  await test('Unlimited ima pristup svim endžinima', () => {
    const ent = getEntitlement('unlimited');
    ok(ent.endzini.every((e) => e.dostupno), 'unlimited → svi endzini');
  });

  await test('ENTITLEMENT_MAP ima 5 planova', () => {
    ok(Object.keys(ENTITLEMENT_MAP).length === 5, 'ENTITLEMENT_MAP.length === 5');
  });

  await test('getEntitlementSummary vraća konzistentne podatke', () => {
    const s = getEntitlementSummary('pro');
    ok(s.plan === 'pro', 'summary.plan');
    ok(s.chatLimit === 1000, 'summary.chatLimit');
    ok(s.dostupnihEndzina > 0, 'summary.dostupnihEndzina > 0');
  });

  // ── Engine matrix ────────────────────────────────────────────────────────
  await test('Engine matrix ima barem 5 endžina', () => {
    ok(getEngineMatrix().length >= 5, 'matrix.length >= 5');
  });

  await test('Glavni endžin je u matrici', () => {
    ok('glavni-endzin' in ENGINE_EVENT_MATRIX, 'glavni-endzin u matrici');
  });

  await test('SpajaPro sluša subscription_activated event', () => {
    ok(ENGINE_EVENT_MATRIX['spaja-pro'].includes('subscription_activated'), 'spaja-pro → subscription_activated');
  });

  await test('OMEGA auth sluša account_locked event', () => {
    ok(ENGINE_EVENT_MATRIX['omega-auth'].includes('account_locked'), 'omega-auth → account_locked');
  });

  // ── Orchestration ────────────────────────────────────────────────────────
  await test('processBillingEvent obrađuje subscription_activated uspešno', () => {
    const event: BillingEvent = {
      id: 'test-evt-001',
      type: 'subscription_activated',
      provider: 'stripe',
      userId: 'user-001',
      planId: 'pro',
      providerEventId: 'evt_test',
      providerCustomerId: 'cus_test',
      timestamp: new Date().toISOString(),
    };
    const result = processBillingEvent(event);
    ok(result.success, 'result.success');
    ok(result.action === 'plan-activated', `action=${result.action}`);
  });

  await test('processBillingEvent obrađuje payment_failed uspešno', () => {
    const event: BillingEvent = {
      id: 'test-evt-002',
      type: 'payment_failed',
      provider: 'paypal',
      userId: 'user-002',
      planId: 'basic',
      providerEventId: 'paypal_evt_test',
      providerCustomerId: 'paypal_cus_test',
      timestamp: new Date().toISOString(),
    };
    const result = processBillingEvent(event);
    ok(result.success, 'payment_failed result.success');
  });

  await test('Stripe provajder je uvek aktivan', () => {
    ok(isProviderEnabled('stripe'), 'stripe enabled');
  });

  await test('getOrchestrationStatus vraća konzistentne podatke', () => {
    const s = getOrchestrationStatus();
    ok(s.id === 'billing-orchestration', 'status.id');
    ok(s.provajderi.length === 2, 'status.provajderi.length === 2');
    ok(s.provajderi[0].id === 'stripe', 'provajder[0] = stripe');
    ok(s.provajderi[1].id === 'paypal', 'provajder[1] = paypal');
  });

  // ── PayPal config ────────────────────────────────────────────────────────
  await test('PAYPAL_API_BASE je validan URL', async () => {
    const { PAYPAL_API_BASE } = await import('../../lib/paypal/config');
    ok(PAYPAL_API_BASE.startsWith('https://'), `PAYPAL_API_BASE=${PAYPAL_API_BASE}`);
  });

  await test('getPayPalPlanById vraća plan za basic', async () => {
    const { getPayPalPlanById } = await import('../../lib/paypal/config');
    const plan = getPayPalPlanById('basic');
    ok(plan !== undefined, 'basic plan exists');
    ok(plan?.cenaEur === 9, 'basic.cenaEur === 9');
  });

  await test('getPayPalPlanById vraća undefined za nepostojeći plan', async () => {
    const { getPayPalPlanById } = await import('../../lib/paypal/config');
    const plan = getPayPalPlanById('nonexistent');
    ok(plan === undefined, 'nonexistent plan is undefined');
  });

  // suppress unused import warning
  void assert;

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failed > 0) process.exit(1);
}

runTests().catch((e) => { console.error('Test greška:', e); process.exit(1); });
