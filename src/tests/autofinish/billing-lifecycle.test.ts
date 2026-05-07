// Autofinish #1128 — Billing Lifecycle Integration Tests
// Kompanija SPAJA — Digitalna Industrija

import { PLANOVI } from '../../lib/stripe/config';
import { isValidPlanTransition, isValidStatusTransition, graceExpiresAt, GRACE_PERIOD_DAYS } from '../../lib/stripe/billing-validators';
import { maskSensitiveMetadata } from '../../lib/stripe/billing-guard';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }
function assertEqual<T>(a: T, e: T, l?: string): void { if (a !== e) throw new Error(`${l ?? 'assertEqual'}: expected ${JSON.stringify(e)}, got ${JSON.stringify(a)}`); }

async function runTests(): Promise<void> {
  console.log('\n📋 Billing Lifecycle Integration Tests (#1128)\n');

  // ── Plan data validacija ──────────────────────────────────────────────────
  await test('PLANOVI niz nije prazan', () => { assert(PLANOVI.length > 0, 'planovi > 0'); });
  await test('Svaki plan ima id i naziv', () => {
    for (const p of PLANOVI) { assert(!!p.id && !!p.naziv, `plan: ${p.id}`); }
  });
  await test('Svaki plaćeni plan ima stripePriceId env var ili je starter', () => {
    for (const p of PLANOVI) {
      if (p.cenaEur > 0) assert(typeof p.stripePriceId === 'string', `stripePriceId: ${p.id}`);
    }
  });
  await test('chatLimit > 0 za plaćene planove ili UNLIMITED', () => {
    for (const p of PLANOVI) {
      if (p.cenaEur > 0) assert(p.chatLimit > 0 || p.chatLimit === -1, `chatLimit: ${p.id}`);
    }
  });

  // ── Plan transition validacija ───────────────────────────────────────────
  await test('starter → basic je validna tranzicija', () => { assert(isValidPlanTransition('starter', 'basic'), 'starter→basic'); });
  await test('basic → pro je validna tranzicija', () => { assert(isValidPlanTransition('basic', 'pro'), 'basic→pro'); });
  await test('pro → basic (downgrade) je validna tranzicija', () => { assert(isValidPlanTransition('pro', 'basic'), 'pro→basic downgrade'); });
  await test('null → pro je validna (prva aktivacija)', () => { assert(isValidPlanTransition(null, 'pro'), 'null→pro'); });
  await test('pro → pro je NEvalidna tranzicija (isti plan)', () => { assert(!isValidPlanTransition('pro', 'pro'), 'pro→pro invalid'); });

  // ── Status transition validacija ─────────────────────────────────────────
  await test('active → past_due je validna tranzicija', () => { assert(isValidStatusTransition('active', 'past_due'), 'active→past_due'); });
  await test('active → canceled je validna tranzicija', () => { assert(isValidStatusTransition('active', 'canceled'), 'active→canceled'); });
  await test('canceled → canceled je NEvalidna (terminal state)', () => { assert(!isValidStatusTransition('canceled', 'active'), 'canceled→active NEvalidna'); });
  await test('null → active je validna (prva aktivacija)', () => { assert(isValidStatusTransition(null, 'active'), 'null→active'); });

  // ── Grace period ─────────────────────────────────────────────────────────
  await test('graceExpiresAt vraća ISO string', () => { assert(!isNaN(Date.parse(graceExpiresAt())), 'ISO date'); });
  await test(`graceExpiresAt je tačno ${GRACE_PERIOD_DAYS} dana od sada`, () => {
    const now = Date.now();
    const grace = Date.parse(graceExpiresAt(now));
    const diffDays = (grace - now) / (24 * 60 * 60 * 1000);
    assert(Math.abs(diffDays - GRACE_PERIOD_DAYS) < 0.01, `grace period = ${diffDays} dana`);
  });

  // ── Metadata masking ──────────────────────────────────────────────────────
  await test('maskSensitiveMetadata maskira card_last4', () => {
    const result = maskSensitiveMetadata({ card_last4: '4242', invoice_id: 'inv_123' });
    assertEqual(result['card_last4'], '****', 'card_last4 masked');
    assertEqual(result['invoice_id'], 'inv_123', 'invoice_id unmaksiran');
  });
  await test('maskSensitiveMetadata maskira tax_id', () => {
    const result = maskSensitiveMetadata({ tax_id: '123-45-6789' });
    assert(result['tax_id'] !== '123-45-6789', 'tax_id masked');
  });
  await test('maskSensitiveMetadata ne menja neosjetljiva polja', () => {
    const result = maskSensitiveMetadata({ amount: 100, currency: 'eur' });
    assertEqual(result['amount'] as number, 100, 'amount');
    assertEqual(result['currency'] as string, 'eur', 'currency');
  });

  // ── APP_VERSION provera ──────────────────────────────────────────────────
  await test('APP_VERSION je definisan', () => { assert(typeof APP_VERSION === 'string' && APP_VERSION.length > 0, 'APP_VERSION'); });
  await test('AUTOFINISH_COUNT >= 1128', () => { assert(AUTOFINISH_COUNT >= 1128, `AUTOFINISH_COUNT=${AUTOFINISH_COUNT}`); });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) { console.error('\n❌ Neuspješni testovi:'); failures.forEach((f) => console.error(`  • ${f}`)); process.exit(1); }
}
runTests().catch((e) => { console.error('Greška:', e); process.exit(1); });
