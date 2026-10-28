// SpajaUltraOmegaCore -∞Ω+∞ — Stripe Checkout API
// Kompanija SPAJA — Digitalna Industrija
// POST /api/stripe/checkout — kreira Stripe Checkout sesiju
//
// Uključuje:
//   • Rate limiting po korisniku i IP adresi (#13)
//   • Idempotency ključ za Checkout sesiju (#10)
//   • Ograničenje aktivnih checkout sesija po korisniku (#11)
//   • Cooldown za prečeste promene plana (#14)
//   • Anti-fraud provera (#12)
//   • Circuit breaker za Stripe API (#9)
//   • Billing tracing (#31)

import { NextRequest, NextResponse } from 'next/server';
import { getStripe, getPlanById } from '@/lib/stripe/config';
import { verifyUserFromToken } from '@/lib/supabase/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { BASE_URL } from '@/lib/constants';
import { stripeCheckoutCircuit, withRetry } from '@/lib/stripe/billing-guard';
import {
  MAX_ACTIVE_CHECKOUT_SESSIONS,
  isPlanChangeCooldownPassed,
} from '@/lib/stripe/billing-validators';
import { createTraceContext, traceStart, traceEnd } from '@/lib/stripe/billing-tracing';
import { isBillingFlagEnabled } from '@/lib/stripe/billing-feature-flags';
import { createHash, randomUUID } from 'crypto';
import { CheckoutAdmissionError, readCheckoutBody, verifyCheckoutSource, recordCheckoutAdmission } from '@/lib/stripe/checkout-fraud';
import {
  extractIdempotencyKey,
  generateIdempotencyKey,
  validateIdempotencyKey,
} from '@/lib/idempotency';

export async function POST(request: NextRequest) {
  const trace = createTraceContext(request, '/api/stripe/checkout');
  trace.requestId = `billing-${randomUUID()}`; // Never log client-supplied trace/header values.
  traceStart(trace);

  try {
    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) {
      traceEnd(trace, 'error', 'unauthorized');
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    trace.userId = user.id;

    let rawBody: string;
    try { rawBody = await readCheckoutBody(request); }
    catch (error) {
      return NextResponse.json({ error: 'Neispravan ili prevelik payload.' }, { status: error instanceof RangeError ? 413 : 400 });
    }
    const source = verifyCheckoutSource(request, rawBody);
    const supabase = getSupabaseServerClient();
    const admission = await recordCheckoutAdmission(supabase, user.id, source);
    if (admission.decision !== 'allow') {
      traceEnd(trace, 'blocked', admission.decision);
      const status = ['fraud', 'billing_locked'].includes(admission.decision) ? 403 : 429;
      return NextResponse.json({ error: 'Checkout zahtev trenutno nije dozvoljen.' }, { status });
    }

    let body: unknown;
    try {
      body = JSON.parse(rawBody);
    } catch {
      traceEnd(trace, 'error', 'invalid-json');
      return NextResponse.json({ error: 'Neispravan JSON payload.', code: 'INVALID_JSON' }, { status: 400 });
    }

    if (!body || typeof body !== 'object') {
      traceEnd(trace, 'error', 'invalid-body');
      return NextResponse.json({ error: 'Neispravan payload format.', code: 'INVALID_PAYLOAD' }, { status: 400 });
    }

    const { planId } = body as { planId?: unknown };

    if (!planId || typeof planId !== 'string') {
      traceEnd(trace, 'error', 'missing-plan-id');
      return NextResponse.json({ error: 'planId je obavezan.', code: 'MISSING_PLAN_ID' }, { status: 400 });
    }

    const plan = getPlanById(planId);
    if (!plan) {
      traceEnd(trace, 'error', 'unknown-plan');
      return NextResponse.json({ error: 'Plan ne postoji.' }, { status: 404 });
    }

    if (plan.cenaEur === 0) {
      traceEnd(trace, 'error', 'free-plan');
      return NextResponse.json({ error: 'Starter plan je besplatan — nema potrebe za placanjem.' }, { status: 400 });
    }

    if (!plan.stripePriceId) {
      traceEnd(trace, 'error', 'no-price-id');
      return NextResponse.json({ error: 'Stripe Price ID nije konfigurisan za ovaj plan.' }, { status: 500 });
    }

    if (isBillingFlagEnabled('billing-read-only-mode', user.id)) {
      traceEnd(trace, 'blocked', 'billing-read-only-mode');
      return NextResponse.json({ error: 'Billing je privremeno u read-only modu.' }, { status: 503 });
    }

    if (isBillingFlagEnabled('billing-kill-switch-checkout', user.id)) {
      traceEnd(trace, 'blocked', 'checkout-kill-switch');
      return NextResponse.json({ error: 'Checkout je privremeno suspendovan.' }, { status: 503 });
    }

    if (planId === 'enterprise' && isBillingFlagEnabled('billing-kill-switch-enterprise', user.id)) {
      traceEnd(trace, 'blocked', 'enterprise-kill-switch');
      return NextResponse.json({ error: 'Enterprise checkout je privremeno suspendovan.' }, { status: 503 });
    }

    // ── Idempotency ključ (#10) ───────────────────────────────────────────────
    // Sprečava kreiranje duplih sesija ako klijent pošalje isti zahtev dva puta.
    const requestIdempotencyKey = extractIdempotencyKey(request.headers) ?? generateIdempotencyKey();
    const keyValidation = validateIdempotencyKey(requestIdempotencyKey);
    if (!keyValidation.valid) {
      traceEnd(trace, 'error', 'invalid-idempotency-key');
      return NextResponse.json(
        { error: keyValidation.reason ?? 'Neispravan Idempotency-Key.', code: 'INVALID_IDEMPOTENCY_KEY' },
        { status: 400 },
      );
    }
    const scopedKey = `checkout:${user.id}:${planId}:${requestIdempotencyKey}`;
    const operationHash = createHash('sha256').update(scopedKey).digest('hex');
    const idempotencyKey = scopedKey.length <= 255 ? scopedKey : `checkout:${operationHash}`;

    // Dohvati profil za cooldown, fraud, active-session provjere
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id, last_plan_changed_at, failed_payment_count, created_at, billing_locked')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) throw new Error('Billing profile unavailable');
    if (profile.billing_locked) {
      traceEnd(trace, 'blocked', 'billing-locked');
      return NextResponse.json({ error: 'Billing nalog je zaključan.' }, { status: 403 });
    }

    // ── Cooldown za promenu plana (#14) ──────────────────────────────────────
    if (!isPlanChangeCooldownPassed(profile?.last_plan_changed_at ?? null)) {
      traceEnd(trace, 'blocked', 'plan-change-cooldown');
      return NextResponse.json(
        { error: 'Suviše česte promene plana. Sačekajte 5 minuta pre sledeće promene.' },
        { status: 429 },
      );
    }

    // ── Limit aktivnih checkout sesija (#11) ──────────────────────────────────
    if (profile?.stripe_customer_id) {
      const stripe = getStripe();
      const activeSessions = await stripe.checkout.sessions.list({
        customer: profile.stripe_customer_id,
        status: 'open',
        limit: MAX_ACTIVE_CHECKOUT_SESSIONS + 1,
      });
      if (activeSessions.data.length >= MAX_ACTIVE_CHECKOUT_SESSIONS) {
        traceEnd(trace, 'blocked', 'too-many-active-sessions');
        return NextResponse.json(
          { error: `Imate ${activeSessions.data.length} aktivnih checkout sesija. Koristite jednu od njih ili sačekajte da isteknu.` },
          { status: 429 },
        );
      }
    }

    const stripe = getStripe();

    // ── Currency mismatch zaštita (#79) ───────────────────────────────────────
    const stripePrice = await stripe.prices.retrieve(plan.stripePriceId, { expand: ['currency_options'] });
    if (stripePrice.currency !== 'eur') {
      traceEnd(trace, 'error', `currency-mismatch:${stripePrice.currency}`);
      return NextResponse.json(
        { error: `Currency mismatch: očekivan EUR, dobijen ${stripePrice.currency.toUpperCase()}.` },
        { status: 409 },
      );
    }
    if (!stripePrice.active || !stripePrice.recurring || stripePrice.unit_amount !== Math.round(plan.cenaEur * 100)) {
      return NextResponse.json({ error: 'Stripe cena ne odgovara konfigurisanom planu.' }, { status: 409 });
    }
    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      }, { idempotencyKey: `customer:${createHash('sha256').update(user.id).digest('hex')}` });
      customerId = customer.id;

      const linked = await withRetry(async () => supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id).is('stripe_customer_id', null)
        .select('stripe_customer_id').maybeSingle());
      if (!linked.data) {
        const current = await withRetry(async () => supabase.from('profiles')
          .select('stripe_customer_id').eq('id', user.id).single());
        if (current.data?.stripe_customer_id !== customerId) throw new Error('Customer link conflict');
      }
    }

    // ── Circuit breaker za Stripe API (#9) ────────────────────────────────────
    const session = await stripeCheckoutCircuit.execute(
      () => stripe.checkout.sessions.create(
        {
          customer: customerId,
          mode: 'subscription',
          line_items: [{ price: plan.stripePriceId, quantity: 1 }],
          success_url: `${BASE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}&status=success`,
          cancel_url: `${BASE_URL}/pricing?status=canceled`,
          metadata: {
            supabase_user_id: user.id,
            plan_id: planId,
            request_id: operationHash,
          },
          automatic_tax: { enabled: true },
        },
        { idempotencyKey },
      ),
      () => ({ url: null, id: `fallback-${randomUUID()}` } as unknown as import('stripe').Stripe.Checkout.Session),
    );

    if (!session.url) {
      traceEnd(trace, 'error', 'no-session-url');
      return NextResponse.json(
        { error: 'Greška pri kreiranju checkout sesije. Pokušajte opet.' },
        { status: 503 },
      );
    }

    traceEnd(trace, 'ok');
    return NextResponse.json({ url: session.url });
  } catch (error) {
    traceEnd(trace, 'error', error instanceof CheckoutAdmissionError ? 'admission-unavailable' : 'checkout-dependency-failure');
    return NextResponse.json(
      { error: 'Greska pri kreiranju checkout sesije.' },
      { status: error instanceof CheckoutAdmissionError ? 503 : 500 },
    );
  }
}
