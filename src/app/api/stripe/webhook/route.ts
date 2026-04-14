// SpajaUltraOmegaCore -∞Ω+∞ — Stripe Webhook
// Kompanija SPAJA — Digitalna Industrija
// POST /api/stripe/webhook — Stripe webhook handler

import { NextRequest, NextResponse } from 'next/server';
import { getStripe, getPlanById, getPlanByPriceId, UNLIMITED_CHAT } from '@/lib/stripe/config';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header.' }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set.');
    return NextResponse.json({ error: 'Webhook secret not configured.' }, { status: 500 });
  }

  const stripe = getStripe();
  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.metadata?.supabase_user_id;
      const planId = session.metadata?.plan_id as 'starter' | 'basic' | 'pro' | 'enterprise' | 'unlimited' | undefined;
      const subscriptionId = typeof session.subscription === 'string'
        ? session.subscription
        : session.subscription?.toString();

      if (userId && planId) {
        const plan = getPlanById(planId) ?? { chatLimit: 100 };

        await supabase.from('profiles').update({
          plan: planId,
          stripe_subscription_id: subscriptionId ?? null,
          subscription_status: 'active',
          chat_messages_limit: plan.chatLimit === UNLIMITED_CHAT ? 999999 : plan.chatLimit,
          chat_messages_used: 0,
        }).eq('id', userId);
      }
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object;
      const customerId = typeof subscription.customer === 'string'
        ? subscription.customer
        : subscription.customer?.toString();

      if (customerId) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (profile) {
          const priceId = subscription.items.data[0]?.price?.id;
          const plan = priceId ? getPlanByPriceId(priceId) : undefined;

          await supabase.from('profiles').update({
            subscription_status: subscription.status,
            ...(plan ? {
              plan: plan.id,
              chat_messages_limit: plan.chatLimit === UNLIMITED_CHAT ? 999999 : plan.chatLimit,
            } : {}),
          }).eq('id', profile.id);
        }
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const customerId = typeof subscription.customer === 'string'
        ? subscription.customer
        : subscription.customer?.toString();

      if (customerId) {
        await supabase.from('profiles').update({
          plan: 'starter',
          subscription_status: 'canceled',
          chat_messages_limit: 10,
        }).eq('stripe_customer_id', customerId);
      }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      const customerId = typeof invoice.customer === 'string'
        ? invoice.customer
        : invoice.customer?.toString();

      if (customerId) {
        await supabase.from('profiles').update({
          subscription_status: 'past_due',
        }).eq('stripe_customer_id', customerId);
      }
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
