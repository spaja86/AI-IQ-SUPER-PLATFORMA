// SpajaUltraOmegaCore -∞Ω+∞ — PayPal Webhook
// Kompanija SPAJA — Digitalna Industrija
// POST /api/paypal/webhook — PayPal webhook handler
//
// Obrađuje:
//   • BILLING.SUBSCRIPTION.ACTIVATED → aktivira pretplatu
//   • BILLING.SUBSCRIPTION.CANCELLED → otkazuje pretplatu
//   • BILLING.SUBSCRIPTION.SUSPENDED → suspenduje pretplatu
//   • PAYMENT.SALE.COMPLETED → potvrđuje uplatu
//   • PAYMENT.SALE.DENIED → neuspešna uplata

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getPayPalPlanByPayPalId, getPayPalAccessToken, PAYPAL_API_BASE } from '@/lib/paypal/config';
import { processBillingEvent } from '@/lib/billing/orchestration';
import type { BillingEvent } from '@/lib/billing/events';
import { randomUUID } from 'crypto';

const ALLOWED_PAYPAL_EVENT_TYPES = new Set([
  'BILLING.SUBSCRIPTION.ACTIVATED',
  'BILLING.SUBSCRIPTION.CANCELLED',
  'BILLING.SUBSCRIPTION.SUSPENDED',
  'BILLING.SUBSCRIPTION.UPDATED',
  'PAYMENT.SALE.COMPLETED',
  'PAYMENT.SALE.DENIED',
  'PAYMENT.SALE.REFUNDED',
]);

async function verifyPayPalWebhook(
  headers: Headers,
  body: string,
): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) {
    // U dev modu prihvati bez verifikacije
    if (process.env.NODE_ENV !== 'production') return true;
    console.error('[paypal-webhook] PAYPAL_WEBHOOK_ID nije postavljen');
    return false;
  }

  try {
    const accessToken = await getPayPalAccessToken();
    const verificationBody = {
      auth_algo: headers.get('paypal-auth-algo') ?? '',
      cert_id: headers.get('paypal-cert-url') ?? '',
      transmission_id: headers.get('paypal-transmission-id') ?? '',
      transmission_sig: headers.get('paypal-transmission-sig') ?? '',
      transmission_time: headers.get('paypal-transmission-time') ?? '',
      webhook_id: webhookId,
      webhook_event: JSON.parse(body) as unknown,
    };

    const response = await fetch(`${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(verificationBody),
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) return false;
    const result = await response.json() as { verification_status: string };
    return result.verification_status === 'SUCCESS';
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text();

  // Verifikuj webhook potpis
  const isValid = await verifyPayPalWebhook(request.headers, body);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid webhook signature.' }, { status: 400 });
  }

  let event: { id: string; event_type: string; resource: Record<string, unknown> };
  try {
    event = JSON.parse(body) as typeof event;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  if (!ALLOWED_PAYPAL_EVENT_TYPES.has(event.event_type)) {
    return NextResponse.json({ received: true, ignored: true });
  }

  const supabase = getSupabaseServerClient();

  // Idempotency check
  const { data: existing } = await supabase
    .from('paypal_webhook_events')
    .select('id')
    .eq('event_id', event.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  // Zabilježi event
  await supabase.from('paypal_webhook_events').insert({
    event_id: event.id,
    event_type: event.event_type,
    processed_at: new Date().toISOString(),
  }).throwOnError().then(() => {}).catch(() => {});

  const resource = event.resource;

  try {
    if (event.event_type === 'BILLING.SUBSCRIPTION.ACTIVATED') {
      const subscriptionId = resource.id as string;
      const planId = resource.plan_id as string;
      const customId = (resource.custom_id as string | undefined) ?? '';
      const [userId] = customId.split(':');

      const plan = getPayPalPlanByPayPalId(planId);
      const planTip = plan?.id ?? 'starter';

      if (userId) {
        await (supabase.from('profiles').update({
          plan: planTip,
          subscription_status: 'active',
          paypal_subscription_id: subscriptionId,
          chat_messages_limit: plan?.cenaEur === 0 ? 10 : plan?.cenaEur === 9 ? 100 : plan?.cenaEur === 29 ? 1000 : plan?.cenaEur === 99 ? 10000 : 999999,
        } as unknown as Record<string, unknown>).eq('id', userId));

        const billingEvent: BillingEvent = {
          id: randomUUID(),
          type: 'subscription_activated',
          provider: 'paypal',
          userId,
          planId: planTip,
          providerEventId: event.id,
          providerCustomerId: userId,
          providerSubscriptionId: subscriptionId,
          timestamp: new Date().toISOString(),
        };
        processBillingEvent(billingEvent);
      }
    } else if (event.event_type === 'BILLING.SUBSCRIPTION.CANCELLED') {
      const subscriptionId = resource.id as string;
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id')
        .eq('paypal_subscription_id' as unknown as string, subscriptionId);

      for (const profile of profiles ?? []) {
        await supabase.from('profiles').update({
          plan: 'starter',
          subscription_status: 'canceled',
        }).eq('id', profile.id);

        const billingEvent: BillingEvent = {
          id: randomUUID(),
          type: 'subscription_canceled',
          provider: 'paypal',
          userId: profile.id,
          planId: 'starter',
          providerEventId: event.id,
          providerCustomerId: profile.id,
          providerSubscriptionId: subscriptionId,
          timestamp: new Date().toISOString(),
        };
        processBillingEvent(billingEvent);
      }
    } else if (event.event_type === 'PAYMENT.SALE.DENIED') {
      const billingAgreementId = (resource.billing_agreement_id as string | undefined) ?? '';
      if (billingAgreementId) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id')
          .eq('paypal_subscription_id' as unknown as string, billingAgreementId);

        for (const profile of profiles ?? []) {
          const billingEvent: BillingEvent = {
            id: randomUUID(),
            type: 'payment_failed',
            provider: 'paypal',
            userId: profile.id,
            planId: 'unknown',
            providerEventId: event.id,
            providerCustomerId: profile.id,
            timestamp: new Date().toISOString(),
          };
          processBillingEvent(billingEvent);
        }
      }
    }
  } catch (error) {
    console.error('[paypal-webhook] Processing error:', error);
    // Ne vraćamo 500 da PayPal ne ponovi event beskonačno
  }

  return NextResponse.json({ received: true });
}
