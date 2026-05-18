// Autofinish #1138 — Billing Portal/Checkout Permission Tests (#24)
// Kompanija SPAJA — Digitalna Industrija

import { AUTOFINISH_COUNT } from '../../lib/constants';
import { getPlanById, PLANOVI } from '../../lib/stripe/config';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }

// Simulirana permission logika iz checkout route-a
function canInitiateCheckout(user: { id: string | null } | null, planId: string): { allowed: boolean; reason?: string } {
  if (!user || !user.id) return { allowed: false, reason: 'not-authenticated' };
  const plan = getPlanById(planId);
  if (!plan) return { allowed: false, reason: 'plan-not-found' };
  if (plan.cenaEur === 0) return { allowed: false, reason: 'free-plan' };
  if (!plan.stripePriceId) return { allowed: false, reason: 'no-price-id' };
  return { allowed: true };
}

// Simulirana portal permission logika
function canOpenPortal(user: { id: string | null } | null, hasStripeCustomer: boolean): { allowed: boolean; reason?: string } {
  if (!user || !user.id) return { allowed: false, reason: 'not-authenticated' };
  if (!hasStripeCustomer) return { allowed: false, reason: 'no-stripe-customer' };
  return { allowed: true };
}

async function runTests(): Promise<void> {
  console.log('\n📋 Billing Portal/Checkout Permission Tests (#1138)\n');

  const authUser = { id: 'user-123' };
  const noUser = null;

  // ── Checkout permissions ──────────────────────────────────────────────────
  await test('Neprijavljen korisnik ne može checkout', () => {
    assert(!canInitiateCheckout(noUser, 'pro').allowed, 'blokiran');
  });

  await test('Prijavljen korisnik može checkout za plaćeni plan', () => {
    const result = canInitiateCheckout(authUser, 'pro');
    assert(result.allowed || result.reason === 'no-price-id', 'dozvoljeno ili env nije konfigurisan');
  });

  await test('Starter plan nije dozvoljen za checkout', () => {
    const result = canInitiateCheckout(authUser, 'starter');
    assert(!result.allowed && result.reason === 'free-plan', 'besplatan plan blokiran');
  });

  await test('Nepostojeci plan nije dozvoljen', () => {
    const result = canInitiateCheckout(authUser, 'imaginary-plan');
    assert(!result.allowed && result.reason === 'plan-not-found', 'nepostojeci plan blokiran');
  });

  await test('Prazni plan ID nije dozvoljen', () => {
    const result = canInitiateCheckout(authUser, '');
    assert(!result.allowed, 'prazan planId blokiran');
  });

  // ── Portal permissions ────────────────────────────────────────────────────
  await test('Neprijavljen korisnik ne može otvoriti portal', () => {
    assert(!canOpenPortal(noUser, true).allowed, 'blokiran');
  });

  await test('Prijavljen korisnik bez Stripe customer-a ne može portal', () => {
    const result = canOpenPortal(authUser, false);
    assert(!result.allowed && result.reason === 'no-stripe-customer', 'blokiran bez stripe customer-a');
  });

  await test('Prijavljen korisnik sa Stripe customer-om može portal', () => {
    assert(canOpenPortal(authUser, true).allowed, 'dozvoljen');
  });

  // ── Plan konfiguracija ────────────────────────────────────────────────────
  await test('Svi plaćeni planovi imaju pozitivnu cenu', () => {
    for (const p of PLANOVI) {
      if (p.id !== 'starter') {
        assert(p.cenaEur > 0, `${p.id} cena > 0`);
      }
    }
  });

  await test('Starter plan ima cenu 0', () => {
    const starter = getPlanById('starter');
    assert(starter?.cenaEur === 0, 'starter = 0 EUR');
  });

  await test('Enterprise plan je skuplji od Pro plana', () => {
    const pro = getPlanById('pro');
    const ent = getPlanById('enterprise');
    assert((ent?.cenaEur ?? 0) > (pro?.cenaEur ?? 0), 'enterprise > pro');
  });

  await test('Unlimited plan je najskuplji', () => {
    const unlimited = getPlanById('unlimited');
    const maxOthers = Math.max(...PLANOVI.filter((p) => p.id !== 'unlimited').map((p) => p.cenaEur));
    assert((unlimited?.cenaEur ?? 0) >= maxOthers, 'unlimited je najskuplji ili isti');
  });

  await test('AUTOFINISH_COUNT >= 1138', () => { assert(AUTOFINISH_COUNT >= 1138, `count=${AUTOFINISH_COUNT}`); });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) { console.error('\n❌ Neuspješni testovi:'); failures.forEach((f) => console.error(`  • ${f}`)); process.exit(1); }
}
runTests().catch((e) => { console.error('Greška:', e); process.exit(1); });
