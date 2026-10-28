// Stripe delivery is acknowledged only after the billing transaction commits.
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createHash } from 'crypto';
import { getStripe, getPlanById, getPlanByPriceId, UNLIMITED_CHAT } from '@/lib/stripe/config';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { withRetry, stripeWebhookCircuit, enqueueDeadLetter, maskSensitiveMetadata } from '@/lib/stripe/billing-guard';
import { isAllowedEventType, validateCheckoutSession, validateSubscription, validateInvoice,
  isValidStatusTransition, isValidPlanTransition, shouldSoftLock, graceExpiresAt,
  isSuspiciousWebhookEvent } from '@/lib/stripe/billing-validators';
import { createTraceContext, traceStart, traceEnd, traceStripeUserCorrelation, traceWebhookError } from '@/lib/stripe/billing-tracing';
import { isBillingFlagEnabled } from '@/lib/stripe/billing-feature-flags';
import { buildAuditChainHash } from '@/lib/stripe/billing-audit-chain';
import { createSupabaseNotificationRepository, dispatchNotification } from '@/lib/notifications';

function objectId(value: unknown): string | null {
  if (typeof value === 'string' && value.length > 0) return value;
  if (value && typeof value === 'object' && 'id' in value && typeof value.id === 'string') return value.id;
  return null;
}
const PROFILE_FIELDS = 'id, plan, subscription_status, stripe_customer_id, stripe_subscription_id, failed_payment_count, billing_revision, billing_locked, chat_messages_limit';

export async function POST(request: NextRequest) {
  const trace = createTraceContext(request, '/api/stripe/webhook');
  traceStart(trace);
  const signature = request.headers.get('stripe-signature');
  if (!signature) return NextResponse.json({ error: 'Missing stripe-signature header.' }, { status: 400 });
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  let stripe: Stripe;
  try {
    if (!secret) throw new Error('Missing webhook secret');
    stripe = getStripe();
  } catch {
    traceEnd(trace, 'error', 'webhook-configuration');
    return NextResponse.json({ error: 'Webhook not configured.' }, { status: 500 });
  }
  let event: Stripe.Event;
  let body: string;
  try {
    body = await request.text();
    const configured = Number.parseInt(process.env.STRIPE_WEBHOOK_TOLERANCE_SEC ?? '300', 10);
    const tolerance = Number.isFinite(configured) && configured >= 60 && configured <= 900 ? configured : 300;
    event = stripe.webhooks.constructEvent(body, signature, secret, tolerance);
  } catch (error) {
    traceWebhookError({ requestId: trace.requestId, step: 'signature-verification', error });
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
  }
  trace.stripeEventId = event.id;
  if (!isAllowedEventType(event.type)) return NextResponse.json({ received: true, ignored: true });
  const obj = event.data.object as unknown as Record<string, unknown>;
  const checkout = event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded';
  const schema = checkout ? validateCheckoutSession(obj)
    : event.type.startsWith('customer.subscription.') ? validateSubscription(obj)
    : event.type.startsWith('invoice.') ? validateInvoice(obj) : { valid: true, errors: [] };
  if (!schema.valid || !event.id || !Number.isSafeInteger(event.created) || event.created < 0) {
    return NextResponse.json({ error: 'Invalid payload schema.', details: schema.errors }, { status: 422 });
  }

  let supabase: ReturnType<typeof getSupabaseServerClient> | undefined;
  try {
    supabase = getSupabaseServerClient();
    const db = supabase;
    const payloadHash = createHash('sha256').update(JSON.stringify(event)).digest('hex');
    const previous = await withRetry(async () => db.from('stripe_billing_commits')
      .select('payload_hash, result').eq('event_id', event.id).maybeSingle());
    if (previous.data) {
      if (previous.data.payload_hash !== payloadHash) throw new Error('Event ID payload conflict');
      return NextResponse.json({ received: true, duplicate: true, ...previous.data.result });
    }

    let userId: string | null = null;
    const customerId = objectId(obj.customer);
    let subscriptionId: string | null = null;
    let effectKey: string | null = null;
    let patch: Record<string, unknown> = {};
    let action = 'event.ignored';
    let profile: Record<string, unknown> | null = null;
    let metadata: Record<string, unknown> = {};
    let quarantineReason: string | null = null;
    const suspicious = isBillingFlagEnabled('billing-webhook-quarantine') && isSuspiciousWebhookEvent(event.type, obj);
    if (suspicious && suspicious.suspicious) quarantineReason = suspicious.reason ?? 'suspicious payload';

    async function readProfile(column: string, value: string) {
      const result = await withRetry(async () => db.from('profiles').select(PROFILE_FIELDS).eq(column, value).single());
      if (!result.data) throw new Error('Billing profile missing');
      return result.data as Record<string, unknown>;
    }
    async function currentSubscription(id: string) {
      const sub = await stripe.subscriptions.retrieve(id, { expand: ['latest_invoice'] });
      if (sub.id !== id || objectId(sub.customer) !== customerId || sub.livemode !== event.livemode) {
        throw new Error('Subscription identity mismatch');
      }
      return sub;
    }
    function paidPlan(sub: Stripe.Subscription) {
      const item = sub.items.data[0];
      const plan = sub.items.data.length === 1 && item.quantity === 1 ? getPlanByPriceId(item.price.id) : undefined;
      const invoice = sub.latest_invoice;
      if (!plan || plan.cenaEur <= 0 || !plan.stripePriceId || sub.status !== 'active' ||
          !invoice || typeof invoice === 'string' || invoice.status !== 'paid' ||
          objectId(invoice.customer) !== customerId || invoice.livemode !== event.livemode) {
        throw new Error('Subscription payment or configured price not confirmed');
      }
      return plan;
    }
    if (quarantineReason) {
      action = 'event.quarantined';
    } else if (checkout) {
      const session = event.data.object as Stripe.Checkout.Session;
      // Unpaid completion is terminal for this event, not for the future async success event.
      if (session.mode !== 'subscription' || session.payment_status !== 'paid') {
        metadata = { reason: 'checkout-not-paid-subscription' };
      } else {
        userId = session.metadata?.supabase_user_id ?? null;
        const plan = getPlanById(session.metadata?.plan_id ?? '');
        subscriptionId = objectId(session.subscription);
        if (!userId || !customerId || !subscriptionId || !plan || plan.cenaEur <= 0 || !plan.stripePriceId) {
          throw new Error('Invalid Checkout subscription binding');
        }
        profile = await readProfile('id', userId);
        if (profile.stripe_customer_id !== customerId) throw new Error('Checkout customer does not own profile');
        const sub = await currentSubscription(subscriptionId);
        if (paidPlan(sub).id !== plan.id) throw new Error('Checkout plan/price mismatch');
        if (profile.stripe_subscription_id && profile.stripe_subscription_id !== subscriptionId) {
          throw new Error('Existing subscription must be reconciled before replacement');
        }
        if (isBillingFlagEnabled('billing-hardening-v2') && profile.plan !== plan.id &&
            !isValidPlanTransition(profile.plan as Parameters<typeof isValidPlanTransition>[0], plan.id)) {
          throw new Error('Invalid plan transition');
        }
        action = 'subscription.activated';
        effectKey = `activation:${subscriptionId}`;
        patch = { plan: plan.id, stripe_subscription_id: subscriptionId, subscription_status: 'active',
          chat_messages_limit: plan.chatLimit === UNLIMITED_CHAT ? 999999 : plan.chatLimit,
          // Re-delivery of a legacy activation must not reset already consumed usage.
          ...(profile.stripe_subscription_id === subscriptionId ? {} : { chat_messages_used: 0 }),
          last_plan_changed_at: new Date().toISOString(), failed_payment_count: 0, billing_locked: false,
          grace_period_expires_at: null };
        metadata = { subscription_id: subscriptionId, checkout_session_id: session.id, planId: plan.id };
      }
    } else if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted' || event.type === 'invoice.payment_failed') {
      if (!customerId) throw new Error('Missing customer identity');
      profile = await readProfile('stripe_customer_id', customerId);
      userId = profile.id as string;
      subscriptionId = event.type === 'invoice.payment_failed'
        ? objectId((obj.parent as Stripe.Invoice.Parent | null)?.subscription_details?.subscription)
        : objectId(obj.id);
      if (!subscriptionId || profile.stripe_subscription_id !== subscriptionId) throw new Error('Unbound subscription event');
      const sub = await currentSubscription(subscriptionId);
      if (event.type === 'invoice.payment_failed') {
        const latest = sub.latest_invoice;
        if (!latest || typeof latest === 'string') throw new Error('Invoice state not confirmed');
        if (objectId(latest) !== obj.id || (typeof latest === 'object' && latest?.status === 'paid')) {
          metadata = { reason: 'obsolete-invoice-failure' };
        } else {
          const failures = Number(profile.failed_payment_count ?? 0) + 1;
          action = 'payment.failed';
          effectKey = `invoice-failure:${obj.id}:${obj.attempt_count ?? 0}`;
          patch = { subscription_status: 'past_due', failed_payment_count: failures,
            ...(isBillingFlagEnabled('billing-soft-lock') && shouldSoftLock(failures) ? { billing_locked: true } : {}) };
          metadata = { invoice_id: obj.id, failure_count: failures };
        }
      } else if (event.type === 'customer.subscription.deleted' && sub.status !== 'canceled') {
        throw new Error('Subscription cancellation not confirmed');
      } else {
        const oldStatus = profile.subscription_status as string | null;
        if (isBillingFlagEnabled('billing-hardening-v2') && oldStatus !== sub.status &&
            oldStatus !== 'grace_period' && !isValidStatusTransition(oldStatus, sub.status)) {
          throw new Error('Invalid subscription status transition');
        }
        const grace = isBillingFlagEnabled('billing-grace-period') && ['past_due', 'canceled'].includes(sub.status) ? graceExpiresAt(event.created * 1000) : null;
        action = sub.status === 'canceled' ? 'subscription.canceled' : 'subscription.updated';
        patch = { subscription_status: sub.status, ...(grace ? { grace_period_expires_at: grace } : {}) };
        if (sub.status === 'active') {
          const plan = paidPlan(sub);
          patch = { ...patch, plan: plan.id, chat_messages_limit: plan.chatLimit === UNLIMITED_CHAT ? 999999 : plan.chatLimit,
            last_plan_changed_at: new Date().toISOString(), grace_period_expires_at: null };
        } else if (sub.status === 'canceled') {
          patch = { ...patch, plan: 'starter', subscription_status: grace ? 'grace_period' : 'canceled',
            ...(grace ? {} : { chat_messages_limit: 10 }) };
        }
      }
    }

    const prevAudit = await withRetry(async () => db.from('financial_audit_log').select('chain_hash, created_at')
      .order('created_at', { ascending: false }).order('id', { ascending: false }).limit(1).maybeSingle());
    const previousAuditMs = Date.parse(prevAudit.data?.created_at ?? '') || 0;
    const now = new Date(Math.max(Date.now(), previousAuditMs + 1)).toISOString();
    const masked = maskSensitiveMetadata(metadata);
    const hashes = buildAuditChainHash({ payload: { eventId: event.id, eventType: event.type, userId, action, metadata: masked },
      prevHash: prevAudit.data?.chain_hash ?? null, timestampIso: now });
    const result = await stripeWebhookCircuit.execute(() => withRetry(async () => db.rpc('commit_stripe_billing_event', {
      p_event: { id: event.id, type: event.type, created: event.created, object_id: objectId(obj.id), payload_hash: payloadHash,
        customer_id: customerId, subscription_id: subscriptionId, effect_key: effectKey,
        quarantine_reason: quarantineReason, payload: quarantineReason ? body : null },
      p_user_id: userId, p_expected_revision: Number(profile?.billing_revision ?? 0), p_patch: patch,
      p_audit: { action, old_plan: profile?.plan ?? null, new_plan: patch.plan ?? profile?.plan ?? null,
        old_status: profile?.subscription_status ?? null, new_status: patch.subscription_status ?? profile?.subscription_status ?? null,
        metadata: masked, request_id: trace.requestId, payload_hash: hashes.payloadHash, chain_hash: hashes.chainHash,
        prev_hash: prevAudit.data?.chain_hash ?? null, created_at: now },
    })), () => { throw new Error('Webhook database circuit open'); });
    if (!result.data || result.data.committed !== true) throw new Error('Billing commit not acknowledged');
    traceStripeUserCorrelation({ requestId: trace.requestId, stripeEventId: event.id, stripeEventType: event.type, userId, action });
    if (userId && result.data.applied && isBillingFlagEnabled('billing-user-notifications', userId)) {
      try {
        await dispatchNotification({ userId, action, category: 'billing', templateVars: Object.fromEntries(Object.entries(masked).map(([key, value]) => [key, String(value)])), metadata: { ...masked, stripeEventId: event.id } },
          { repository: createSupabaseNotificationRepository(db) });
      } catch { /* Non-financial notification failure does not undo a committed transaction. */ }
    }
    traceEnd(trace, 'ok');
    return NextResponse.json({ received: true, ...result.data, handlerVersion: 'v3' });
  } catch (error) {
    traceWebhookError({ requestId: trace.requestId, stripeEventId: event.id, stripeEventType: event.type, step: 'billing-transaction', error });
    if (supabase) await enqueueDeadLetter(supabase, { eventId: event.id, eventType: event.type, payload: body,
      failureReason: 'Billing transaction not confirmed; Stripe redelivery required', occurredAt: new Date().toISOString(), retryCount: 0 });
    traceEnd(trace, 'error', 'billing-uncommitted');
    // DLQ is diagnostic, never a substitute for a successful financial commit.
    return NextResponse.json({ error: 'Billing processing not confirmed. Retry delivery.' }, { status: 503 });
  }
}
