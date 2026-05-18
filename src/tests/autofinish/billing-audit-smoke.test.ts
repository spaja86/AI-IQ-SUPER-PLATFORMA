// Autofinish #1139 — Billing Audit Log Smoke Tests (#26)
// Kompanija SPAJA — Digitalna Industrija

import { AUTOFINISH_COUNT } from '../../lib/constants';
import { maskSensitiveMetadata } from '../../lib/stripe/billing-guard';
import { getBillingFlag, getBillingFlagsReport, BILLING_FLAGS } from '../../lib/stripe/billing-feature-flags';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }
function assertEqual<T>(a: T, e: T, l?: string): void { if (a !== e) throw new Error(`${l ?? 'assertEqual'}: expected ${JSON.stringify(e)}, got ${JSON.stringify(a)}`); }

// Simuliran audit entry validator
function validateAuditEntry(entry: Record<string, unknown>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!entry['action'] || typeof entry['action'] !== 'string') errors.push('action je obavezan string');
  if (!entry['stripe_event_id'] && !entry['user_id']) errors.push('mora imati stripe_event_id ili user_id');
  const validActions = [
    'subscription.activated', 'subscription.updated', 'subscription.canceled',
    'payment.failed', 'plan.changed', 'billing.locked', 'grace_period.started',
  ];
  if (entry['action'] && !validActions.includes(entry['action'] as string)) {
    errors.push(`nepoznata akcija: ${entry['action']}`);
  }
  return { valid: errors.length === 0, errors };
}

async function runTests(): Promise<void> {
  console.log('\n📋 Billing Audit Log Smoke Tests (#1139)\n');

  // ── Audit entry validacija ────────────────────────────────────────────────
  await test('Validan audit entry prolazi validaciju', () => {
    const entry = { action: 'subscription.activated', stripe_event_id: 'evt_test', user_id: 'user-123' };
    const result = validateAuditEntry(entry);
    assert(result.valid, `errors: ${result.errors.join(', ')}`);
  });

  await test('Audit entry bez akcije ne prolazi', () => {
    const result = validateAuditEntry({ stripe_event_id: 'evt_test' });
    assert(!result.valid, 'bez action je nevalidan');
  });

  await test('Audit entry bez stripe_event_id i user_id ne prolazi', () => {
    const result = validateAuditEntry({ action: 'payment.failed' });
    assert(!result.valid, 'bez ID-jeva je nevalidan');
  });

  // ── Metadata masking konzistentnost ──────────────────────────────────────
  await test('maskSensitiveMetadata je idempotentna', () => {
    const original = { amount: 100, card_last4: '4242', currency: 'eur' };
    const once = maskSensitiveMetadata(original);
    const twice = maskSensitiveMetadata(once);
    // Primenjivanje maskiranja dva puta treba da daje isti rezultat za maskirane polјa
    assertEqual(once['card_last4'], twice['card_last4'], 'idempotentno maskiranje');
    assertEqual(once['amount'] as number, twice['amount'] as number, 'amount nepromenjen');
  });

  await test('maskSensitiveMetadata tretira nested objekte', () => {
    const meta = { payment: { card_last4: '1234', amount: 99 } };
    const result = maskSensitiveMetadata(meta);
    const payment = result['payment'] as Record<string, unknown>;
    assert(payment['card_last4'] !== '1234', 'nested card_last4 maskiran');
    assertEqual(payment['amount'] as number, 99, 'nested amount nepromenjen');
  });

  // ── Feature flags konzistentnost ──────────────────────────────────────────
  await test('Svi BILLING_FLAGS imaju id, naziv, enabled', () => {
    for (const f of BILLING_FLAGS) {
      assert(typeof f.id === 'string' && f.id.length > 0, `id: ${f.id}`);
      assert(typeof f.naziv === 'string' && f.naziv.length > 0, `naziv: ${f.id}`);
      assert(typeof f.enabled === 'boolean', `enabled: ${f.id}`);
    }
  });

  await test('getBillingFlag vraća validan flag', () => {
    const flag = getBillingFlag('billing-hardening-v2');
    assert(flag !== undefined, 'flag postoji');
    assertEqual(flag?.id, 'billing-hardening-v2', 'flag id');
  });

  await test('getBillingFlag vraća undefined za nepostojeći flag', () => {
    const flag = getBillingFlag('imaginary-flag-xyz');
    assert(flag === undefined, 'nepostojeći flag = undefined');
  });

  await test('getBillingFlagsReport vraća konzistentan broj', () => {
    const report = getBillingFlagsReport();
    assertEqual(report.ukupno, BILLING_FLAGS.length, 'ukupno = dužina niza');
    assertEqual(report.aktivnih + report.neaktivnih, BILLING_FLAGS.length, 'aktivnih + neaktivnih = ukupno');
  });

  await test('rolloutPct je između 0 i 100 za sve flagove', () => {
    for (const f of BILLING_FLAGS) {
      assert(f.rolloutPct >= 0 && f.rolloutPct <= 100, `rolloutPct=${f.rolloutPct} za ${f.id}`);
    }
  });

  await test('AUTOFINISH_COUNT >= 1139', () => { assert(AUTOFINISH_COUNT >= 1139, `count=${AUTOFINISH_COUNT}`); });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) { console.error('\n❌ Neuspješni testovi:'); failures.forEach((f) => console.error(`  • ${f}`)); process.exit(1); }
}
runTests().catch((e) => { console.error('Greška:', e); process.exit(1); });
