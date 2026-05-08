// SpajaUltraOmegaCore -∞Ω+∞ — PayPal Checkout API
// Kompanija SPAJA — Digitalna Industrija
// POST /api/paypal/checkout — kreira PayPal subscription sesiju

import { NextRequest, NextResponse } from 'next/server';
import { getPayPalPlanById, getPayPalAccessToken, PAYPAL_API_BASE } from '@/lib/paypal/config';
import { verifyUserFromToken } from '@/lib/supabase/server';
import { BASE_URL } from '@/lib/constants';
import { isProviderEnabled } from '@/lib/billing/orchestration';

export async function POST(request: NextRequest) {
  try {
    if (!isProviderEnabled('paypal')) {
      return NextResponse.json(
        { error: 'PayPal plaćanje trenutno nije aktivirano. Koristite Stripe.' },
        { status: 503 },
      );
    }

    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Neispravan JSON payload.' }, { status: 400 });
    }

    const { planId } = body as { planId?: unknown };
    if (!planId || typeof planId !== 'string') {
      return NextResponse.json({ error: 'planId je obavezan.' }, { status: 400 });
    }

    const plan = getPayPalPlanById(planId);
    if (!plan) {
      return NextResponse.json({ error: 'Plan ne postoji.' }, { status: 404 });
    }

    if (!plan.paypalPlanId) {
      return NextResponse.json({ error: 'PayPal Plan ID nije konfigurisan za ovaj plan.' }, { status: 500 });
    }

    const accessToken = await getPayPalAccessToken();

    const subscriptionBody = {
      plan_id: plan.paypalPlanId,
      subscriber: {
        email_address: user.email,
      },
      application_context: {
        brand_name: 'SPAJA AI Platform',
        locale: 'sr-RS',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'SUBSCRIBE_NOW',
        return_url: `${BASE_URL}/dashboard?provider=paypal&status=success&plan=${planId}`,
        cancel_url: `${BASE_URL}/pricing?provider=paypal&status=canceled`,
      },
      custom_id: `${user.id}:${planId}`,
    };

    const response = await fetch(`${PAYPAL_API_BASE}/v1/billing/subscriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': `spaja-${user.id}-${planId}-${Date.now()}`,
      },
      body: JSON.stringify(subscriptionBody),
    });

    if (!response.ok) {
      const errData = await response.text();
      console.error('[paypal-checkout] API error:', errData);
      return NextResponse.json({ error: 'Greška pri kreiranju PayPal pretplate.' }, { status: 502 });
    }

    const subscription = await response.json() as { id: string; links: Array<{ rel: string; href: string }> };

    const approvalLink = subscription.links.find((l) => l.rel === 'approve');
    if (!approvalLink) {
      return NextResponse.json({ error: 'PayPal approval link nije dobijen.' }, { status: 502 });
    }

    return NextResponse.json({ url: approvalLink.href, subscriptionId: subscription.id });
  } catch (error) {
    console.error('[paypal-checkout] error:', error);
    return NextResponse.json({ error: 'Greška pri kreiranju PayPal pretplate.' }, { status: 500 });
  }
}
