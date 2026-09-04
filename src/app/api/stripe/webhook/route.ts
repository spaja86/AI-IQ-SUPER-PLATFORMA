// SpajaUltraOmegaCore -∞Ω+∞ — Stripe Webhook
// Kompanija SPAJA — Digitalna Industrija
// POST /api/stripe/webhook — Stripe webhook handler
//
// Uključuje:
//   • Idempotency guard (#36 webhook route)
//   • Financial audit log (#3)
//   • Allowed event types whitelist (#18)
//   • Schema validacija payload-a (#19)
//   • Event ordering zaštita (#17)
//   • Dead-letter queue (#7)
//   • Retry/backoff za DB greške (#8)
//   • Circuit breaker za DB (#9)
//   • Billing tracing / request-ID (#31, #32)
//   • Grace period pre downgrade-a (#16)
//   • Soft-lock za neuspela plaćanja (#15)
//   • Validacija billing tranzicija (#43)
//   • Metadata masking (#39)
//   • Automatske korisničke notifikacije (#49, feature-flag)

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe, getPlanById, getPlanByPriceId, UNLIMITED_CHAT } from '@/lib/stripe/config';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { withRetry, stripeWebhookCircuit, enqueueDeadLetter, maskSensitiveMetadata } from '@/lib/stripe/billing-guard';
import {
  isAllowedEventType,
  validateCheckoutSession,
  validateSubscription,
  validateInvoice,
  isEventNewerThan,
  isValidStatusTransition,
  isValidPlanTransition,
  shouldSoftLock,
  graceExpiresAt,
  isSuspiciousWebhookEvent,
} from '@/lib/stripe/billing-validators';
import { createTraceContext, traceStart, traceEnd, traceStripeUserCorrelation, traceWebhookError } from '@/lib/stripe/billing-tracing';
import { isBillingFlagEnabled } from '@/lib/stripe/billing-feature-flags';
import { buildAuditChainHash } from '@/lib/stripe/billing-audit-chain';
import { createSupabaseNotificationRepository, dispatchNotification } from '@/lib/notifications';

export async function POST(request: NextRequest) {
  const trace = createTraceContext(request, '/api/stripe/webhook');
  traceStart(trace);
  const handlerVersion = request.headers.get('x-billing-webhook-version') === 'v1' ? 'v1' : 'v2';

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    traceEnd(trace, 'error', 'missing-signature');
    return NextResponse.json({ error: 'Missing stripe-signature header.' }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set.');
    traceEnd(trace, 'error', 'missing-secret');
    return NextResponse.json({ error: 'Webhook secret not configured.' }, { status: 500 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;
  const configuredToleranceSec = Number.parseInt(process.env.STRIPE_WEBHOOK_TOLERANCE_SEC ?? '300', 10);
  const toleranceSec =
    Number.isFinite(configuredToleranceSec) && configuredToleranceSec >= 60 && configuredToleranceSec <= 900
      ? configuredToleranceSec
      : 300;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret, toleranceSec);
  } catch (err) {
    traceWebhookError({ requestId: trace.requestId, step: 'signature-verification', error: err });
    traceEnd(trace, 'error', 'invalid-signature');
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
  }

  trace.stripeEventId = event.id;

  // ── Allowed event type whitelist (#18) ────────────────────────────────────
  if (!isAllowedEventType(event.type)) {
    console.info(`[billing] Ignored event type: ${event.type} (not in whitelist)`);
    traceEnd(trace, 'ok', `ignored-event-type:${event.type}`);
    return NextResponse.json({ received: true, ignored: true });
  }

  // ── Schema validacija (#19) ────────────────────────────────────────────────
  const obj = event.data.object as unknown as Record<string, unknown>;
  let schemaResult = { valid: true, errors: [] as string[] };

  if (event.type === 'checkout.session.completed') {
    schemaResult = validateCheckoutSession(obj);
  } else if (event.type.startsWith('customer.subscription.')) {
    schemaResult = validateSubscription(obj);
  } else if (event.type.startsWith('invoice.')) {
    schemaResult = validateInvoice(obj);
  }

  if (!schemaResult.valid) {
    traceWebhookError({
      requestId: trace.requestId,
      stripeEventId: event.id,
      stripeEventType: event.type,
      step: 'schema-validation',
      error: schemaResult.errors.join('; '),
    });
    traceEnd(trace, 'error', 'schema-invalid');
    return NextResponse.json({ error: 'Invalid payload schema.', details: schemaResult.errors }, { status: 422 });
  }

  const supabase = getSupabaseServerClient();
  const webhookLatencyMs = Math.max(0, Date.now() - event.created * 1000);
  let consistencyLatencyMs: number | null = null;

  // ── Idempotency guard ──────────────────────────────────────────────────────
  const idempotencyResult = await stripeWebhookCircuit.execute(
    () => withRetry(async () =>
      supabase
        .from('stripe_webhook_events')
        .insert({ event_id: event.id, event_type: event.type, handler_version: handlerVersion })
        .then((r) => r)
    ),
    () => ({ data: null, error: null, count: null, status: 200, statusText: 'OK', success: true as const }),
  );

  const idempotencyError = idempotencyResult?.error;
  if (idempotencyError) {
    if (idempotencyError.code === '23505') {
      traceEnd(trace, 'duplicate', 'already-processed');
      return NextResponse.json({ received: true, duplicate: true });
    }
    console.error('Webhook idempotency insert failed:', idempotencyError);
  }

  // ── Quarantine mode za sumnjive evente (#52) ───────────────────────────────
  if (isBillingFlagEnabled('billing-webhook-quarantine')) {
    const suspicious = isSuspiciousWebhookEvent(event.type, obj);
    if (suspicious.suspicious) {
      await supabase.from('webhook_dead_letter').insert({
        event_id: event.id,
        event_type: event.type,
        payload: body,
        failure_reason: `quarantine: ${suspicious.reason ?? 'suspicious payload'}`,
        retry_count: 0,
        replay_attempts: 0,
        quarantine: true,
        quarantine_reason: suspicious.reason ?? 'suspicious payload',
        occurred_at: new Date().toISOString(),
      });
      await supabase
        .from('stripe_webhook_events')
        .update({
          quarantined: true,
          webhook_latency_ms: webhookLatencyMs,
          consistency_latency_ms: null,
        })
        .eq('event_id', event.id);
      traceEnd(trace, 'blocked', 'quarantined');
      return NextResponse.json({ received: true, quarantined: true, reason: suspicious.reason, handlerVersion });
    }
  }

  // ── Event ordering guard (#17) ─────────────────────────────────────────────
  if (isBillingFlagEnabled('billing-event-ordering')) {
    const { data: lastEvent } = await supabase
      .from('stripe_webhook_events')
      .select('processed_at')
      .eq('event_type', event.type)
      .order('processed_at', { ascending: false })
      .limit(1)
      .single();

    if (lastEvent) {
      const lastCreatedSec = Math.floor(Date.parse(lastEvent.processed_at) / 1000);
      if (!isEventNewerThan(event.created, lastCreatedSec)) {
        console.warn(`[billing] Out-of-order event detected: ${event.id} (${event.type}), created=${event.created}, last=${lastCreatedSec}`);
        traceEnd(trace, 'blocked', 'out-of-order');
        return NextResponse.json({ received: true, out_of_order: true });
      }
    }
  }

  /** Upisuje zapis u finansijski audit log. */
  async function auditLog(params: {
    userId?: string | null;
    action: string;
    oldPlan?: string | null;
    newPlan?: string | null;
    oldStatus?: string | null;
    newStatus?: string | null;
    stripeCustomerId?: string | null;
    metadata?: Record<string, unknown>;
  }) {
    const now = new Date().toISOString();
    const { data: prevAudit } = await supabase
      .from('financial_audit_log')
      .select('chain_hash')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const maskedMeta = maskSensitiveMetadata(params.metadata ?? {});
    const payloadToHash = {
      eventId: event.id,
      eventType: event.type,
      userId: params.userId ?? null,
      action: params.action,
      metadata: maskedMeta,
    };
    const { payloadHash, chainHash } = buildAuditChainHash({
      payload: payloadToHash,
      prevHash: prevAudit?.chain_hash ?? null,
      timestampIso: now,
    });
    const { error } = await withRetry(async () =>
      supabase.from('financial_audit_log').insert({
        user_id: params.userId ?? null,
        action: params.action,
        old_plan: params.oldPlan ?? null,
        new_plan: params.newPlan ?? null,
        old_status: params.oldStatus ?? null,
        new_status: params.newStatus ?? null,
        stripe_event_id: event.id,
        stripe_customer_id: params.stripeCustomerId ?? null,
        metadata: maskedMeta,
        request_id: trace.requestId,
        payload_hash: payloadHash,
        prev_hash: prevAudit?.chain_hash ?? null,
        chain_hash: chainHash,
      })
    );
    if (error) {
      console.error('Financial audit log write failed:', error);
    }

    traceStripeUserCorrelation({
      requestId: trace.requestId,
      stripeEventId: event.id,
      stripeEventType: event.type,
      userId: params.userId,
      action: params.action,
    });
  }

  /** Šalje notifikaciju korisniku (feature-flag kontrolisano). */
  async function notifyUser(userId: string, action: string, meta: Record<string, unknown> = {}) {
    if (!isBillingFlagEnabled('billing-user-notifications', userId)) return;
    try {
      await dispatchNotification(
        {
          userId,
          action,
          category: 'billing',
          templateVars: Object.fromEntries(
            Object.entries(meta).map(([key, value]) => [key, String(value)]),
          ),
          metadata: {
            ...meta,
            stripeEventId: event.id,
            stripeEventType: event.type,
            requestId: trace.requestId,
          },
        },
        { repository: createSupabaseNotificationRepository(supabase) },
      );
    } catch {
      // Notifikacija nije kritična — tišina pri grešci
    }
  }

  // ── Event handlers ────────────────────────────────────────────────────────

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id;
        const planId = session.metadata?.plan_id as 'starter' | 'basic' | 'pro' | 'enterprise' | 'unlimited' | undefined;
        const subscriptionId = typeof session.subscription === 'string'
          ? session.subscription
          : session.subscription?.toString();

        if (userId && planId) {
          trace.userId = userId;
          const plan = getPlanById(planId) ?? { chatLimit: 100 };

          const { data: oldProfile } = await supabase
            .from('profiles')
            .select('plan, subscription_status')
            .eq('id', userId)
            .single();

          // Validacija tranzicije (#43)
          if (isBillingFlagEnabled('billing-hardening-v2')) {
            if (oldProfile?.plan && !isValidPlanTransition(oldProfile.plan, planId)) {
              console.warn(`[billing] Invalid plan transition: ${oldProfile.plan} → ${planId} for user ${userId}`);
            }
          }

          await withRetry(async () =>
            supabase.from('profiles').update({
              plan: planId,
              stripe_subscription_id: subscriptionId ?? null,
              subscription_status: 'active',
              chat_messages_limit: plan.chatLimit === UNLIMITED_CHAT ? 999999 : plan.chatLimit,
              chat_messages_used: 0,
              last_plan_changed_at: new Date().toISOString(),
              failed_payment_count: 0,
              billing_locked: false,
            }).eq('id', userId)
          );

          await auditLog({
            userId,
            action: 'subscription.activated',
            oldPlan: oldProfile?.plan ?? null,
            newPlan: planId,
            oldStatus: oldProfile?.subscription_status ?? null,
            newStatus: 'active',
            stripeCustomerId: typeof session.customer === 'string' ? session.customer : null,
            metadata: { subscription_id: subscriptionId },
          });

          await notifyUser(userId, 'subscription.activated', { planId });
          consistencyLatencyMs = Math.max(0, Date.now() - event.created * 1000);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = typeof subscription.customer === 'string'
          ? subscription.customer
          : subscription.customer?.toString();

        if (customerId) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, plan, subscription_status, failed_payment_count')
            .eq('stripe_customer_id', customerId)
            .single();

          if (profile) {
            trace.userId = profile.id;
            const priceId = subscription.items.data[0]?.price?.id;
            const plan = priceId ? getPlanByPriceId(priceId) : undefined;

            // Validacija status tranzicije (#43)
            if (isBillingFlagEnabled('billing-hardening-v2')) {
              const currentStatus = profile.subscription_status;
              if (!isValidStatusTransition(currentStatus, subscription.status)) {
                console.warn(`[billing] Invalid status transition: ${currentStatus} → ${subscription.status} for user ${profile.id}`);
              }
            }

            // Grace period za canceled/past_due (#16)
            const gracePeriodEnabled = isBillingFlagEnabled('billing-grace-period');
            let graceExpiry: string | null = null;
            if (gracePeriodEnabled && (subscription.status === 'canceled' || subscription.status === 'past_due')) {
              graceExpiry = graceExpiresAt();
            }

            await withRetry(async () =>
              supabase.from('profiles').update({
                subscription_status: subscription.status,
                ...(plan ? {
                  plan: plan.id,
                  chat_messages_limit: plan.chatLimit === UNLIMITED_CHAT ? 999999 : plan.chatLimit,
                  last_plan_changed_at: new Date().toISOString(),
                } : {}),
                ...(graceExpiry ? { grace_period_expires_at: graceExpiry } : {}),
              }).eq('id', profile.id)
            );

            await auditLog({
              userId: profile.id,
              action: 'subscription.updated',
              oldPlan: profile.plan ?? null,
              newPlan: plan?.id ?? null,
              oldStatus: profile.subscription_status ?? null,
              newStatus: subscription.status,
              stripeCustomerId: customerId,
            });

            await notifyUser(profile.id, 'subscription.updated', { newStatus: subscription.status });
            consistencyLatencyMs = Math.max(0, Date.now() - event.created * 1000);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = typeof subscription.customer === 'string'
          ? subscription.customer
          : subscription.customer?.toString();

        if (customerId) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, plan, subscription_status')
            .eq('stripe_customer_id', customerId)
            .single();

          // Grace period pre downgrade-a (#16)
          const graceExpiry = isBillingFlagEnabled('billing-grace-period') ? graceExpiresAt() : null;

          await withRetry(async () =>
            supabase.from('profiles').update({
              plan: 'starter',
              subscription_status: graceExpiry ? 'grace_period' : 'canceled',
              chat_messages_limit: graceExpiry ? (profile?.plan ? undefined : 10) : 10,
              ...(graceExpiry ? { grace_period_expires_at: graceExpiry } : {}),
            }).eq('stripe_customer_id', customerId)
          );

          await auditLog({
            userId: profile?.id ?? null,
            action: 'subscription.canceled',
            oldPlan: profile?.plan ?? null,
            newPlan: 'starter',
            oldStatus: profile?.subscription_status ?? null,
            newStatus: graceExpiry ? 'grace_period' : 'canceled',
            stripeCustomerId: customerId,
          });

          if (profile) await notifyUser(profile.id, 'subscription.canceled');
          consistencyLatencyMs = Math.max(0, Date.now() - event.created * 1000);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = typeof invoice.customer === 'string'
          ? invoice.customer
          : invoice.customer?.toString();

        if (customerId) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, plan, subscription_status, failed_payment_count')
            .eq('stripe_customer_id', customerId)
            .single();

          const newFailureCount = (profile?.failed_payment_count ?? 0) + 1;
          const shouldLock = isBillingFlagEnabled('billing-soft-lock') && shouldSoftLock(newFailureCount);

          await withRetry(async () =>
            supabase.from('profiles').update({
              subscription_status: 'past_due',
              failed_payment_count: newFailureCount,
              ...(shouldLock ? { billing_locked: true } : {}),
            }).eq('stripe_customer_id', customerId)
          );

          await auditLog({
            userId: profile?.id ?? null,
            action: 'payment.failed',
            oldPlan: profile?.plan ?? null,
            newPlan: profile?.plan ?? null,
            oldStatus: profile?.subscription_status ?? null,
            newStatus: shouldLock ? 'past_due_locked' : 'past_due',
            stripeCustomerId: customerId,
            metadata: {
              invoice_id: typeof invoice.id === 'string' ? invoice.id : null,
              amount_due: typeof invoice.amount_due === 'number' ? invoice.amount_due : null,
              failure_count: newFailureCount,
              soft_locked: shouldLock,
            },
          });

          if (profile) await notifyUser(profile.id, 'payment.failed', { failureCount: newFailureCount, softLocked: shouldLock });
          consistencyLatencyMs = Math.max(0, Date.now() - event.created * 1000);
        }
        break;
      }

      default:
        break;
    }
  } catch (handlerErr) {
    traceWebhookError({
      requestId: trace.requestId,
      stripeEventId: event.id,
      stripeEventType: event.type,
      step: 'event-handler',
      error: handlerErr,
    });

    // Enqueue u dead-letter queue (#7)
    await enqueueDeadLetter(supabase, {
      eventId: event.id,
      eventType: event.type,
      payload: body,
      failureReason: handlerErr instanceof Error ? handlerErr.message : String(handlerErr),
      occurredAt: new Date().toISOString(),
      retryCount: 0,
    });

    traceEnd(trace, 'error', 'handler-failed-dead-lettered');
    // Vraćamo 200 Stripe-u da ne ponovi — handler greška je zabeležena u DLQ
    return NextResponse.json({ received: true, queued_for_retry: true });
  }

  await supabase
    .from('stripe_webhook_events')
    .update({
      webhook_latency_ms: webhookLatencyMs,
      consistency_latency_ms: consistencyLatencyMs,
      quarantined: false,
    })
    .eq('event_id', event.id);

  traceEnd(trace, 'ok');
  return NextResponse.json({ received: true, handlerVersion });
}
