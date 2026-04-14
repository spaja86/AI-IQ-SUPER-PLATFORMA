// SpajaUltraOmegaCore -∞Ω+∞ — Stripe Checkout API
// Kompanija SPAJA — Digitalna Industrija
// POST /api/stripe/checkout — kreira Stripe Checkout sesiju

import { NextRequest, NextResponse } from 'next/server';
import { getStripe, getPlanById } from '@/lib/stripe/config';
import { verifyUserFromToken } from '@/lib/supabase/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { BASE_URL } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    const body = (await request.json()) as { planId?: string };
    const { planId } = body;

    if (!planId) {
      return NextResponse.json({ error: 'planId je obavezan.' }, { status: 400 });
    }

    const plan = getPlanById(planId);
    if (!plan) {
      return NextResponse.json({ error: 'Plan ne postoji.' }, { status: 404 });
    }

    if (plan.cenaEur === 0) {
      return NextResponse.json({ error: 'Starter plan je besplatan — nema potrebe za placanjem.' }, { status: 400 });
    }

    if (!plan.stripePriceId) {
      return NextResponse.json({ error: 'Stripe Price ID nije konfigurisan za ovaj plan.' }, { status: 500 });
    }

    const stripe = getStripe();
    const supabase = getSupabaseServerClient();

    // Dohvati ili kreiraj Stripe customer-a
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    // Kreiraj Checkout sesiju
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: plan.stripePriceId, quantity: 1 }],
      success_url: `${BASE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}&status=success`,
      cancel_url: `${BASE_URL}/pricing?status=canceled`,
      metadata: {
        supabase_user_id: user.id,
        plan_id: planId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Greska pri kreiranju checkout sesije.' },
      { status: 500 },
    );
  }
}
