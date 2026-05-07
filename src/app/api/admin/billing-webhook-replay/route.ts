// SpajaUltraOmegaCore -∞Ω+∞ — Admin: Billing Webhook Replay
// Kompanija SPAJA — Digitalna Industrija
// POST /api/admin/billing-webhook-replay — ručni replay webhook eventa iz DLQ (#36)
//
// Zahteva admin autorizaciju (Authorization: Bearer <admin-token>).
// Uzima event iz webhook_dead_letter i ponovo ga obrađuje.

import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe/config';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { verifyUserFromToken } from '@/lib/supabase/server';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { buildAuditChainHash } from '@/lib/stripe/billing-audit-chain';

function isAdminUser(user: { user_metadata?: Record<string, unknown> } | null): boolean {
  if (!user) return false;
  const roles = user.user_metadata?.['roles'];
  if (Array.isArray(roles)) return roles.includes('admin') || roles.includes('superadmin');
  return false;
}

function hasBillingReplayScope(user: { user_metadata?: Record<string, unknown>; id?: string } | null): boolean {
  if (!user) return false;
  const scopes = user.user_metadata?.['scopes'];
  if (Array.isArray(scopes) && scopes.includes('billing:replay')) return true;
  return isAdminUser(user);
}

export async function POST(request: NextRequest) {
  const user = await verifyUserFromToken(request.headers.get('authorization'));
  if (!hasBillingReplayScope(user as Parameters<typeof hasBillingReplayScope>[0])) {
    return NextResponse.json({ error: 'Forbidden — nedostaje billing:replay scope.' }, { status: 403 });
  }

  const body = (await request.json()) as { dlqId?: string; approvedBy?: string };
  const { dlqId, approvedBy } = body;

  if (!dlqId) {
    return NextResponse.json({ error: 'dlqId je obavezan.' }, { status: 400 });
  }

  if (!approvedBy || approvedBy === user?.id) {
    return NextResponse.json({ error: 'Replay zahteva 4-eyes approval (approvedBy mora postojati i razlikovati se od izvršioca).' }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  const requesterId = user?.id ?? null;
  const replayRateLimitAllowed = await checkRateLimitGlobal(rateLimitKey(requesterId ?? 'unknown', '/api/admin/billing-webhook-replay'), 20, 3600);
  if (!replayRateLimitAllowed) {
    return NextResponse.json({ error: 'Rate limit: previše replay pokušaja u poslednjih sat vremena.' }, { status: 429 });
  }

  const MAX_REPLAY_ATTEMPTS = Number(process.env.BILLING_REPLAY_MAX_ATTEMPTS ?? 5);

  const { data: prevAudit } = await supabase
    .from('financial_audit_log')
    .select('chain_hash')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  async function auditAdminAction(action: string, metadata: Record<string, unknown>) {
    const now = new Date().toISOString();
    const { payloadHash, chainHash } = buildAuditChainHash({
      payload: metadata,
      prevHash: prevAudit?.chain_hash ?? null,
      timestampIso: now,
    });
    await supabase
      .from('financial_audit_log')
      .insert({
        user_id: requesterId,
        action,
        old_plan: null,
        new_plan: null,
        old_status: null,
        new_status: null,
        stripe_event_id: null,
        stripe_customer_id: null,
        metadata,
        request_id: `admin-replay-${dlqId}`,
        payload_hash: payloadHash,
        prev_hash: prevAudit?.chain_hash ?? null,
        chain_hash: chainHash,
      });
  }

  // Dohvati DLQ entry
  const { data: entry, error: fetchError } = await supabase
    .from('webhook_dead_letter')
    .select('*')
    .eq('id', dlqId)
    .single();

  if (fetchError || !entry) {
    return NextResponse.json({ error: 'DLQ entry nije pronađen.' }, { status: 404 });
  }

  if (entry.replayed) {
    return NextResponse.json({ error: 'Event je već replay-ovan.', replayedAt: entry.replayed_at }, { status: 409 });
  }

  if (entry.poison) {
    return NextResponse.json({ error: 'Event je označen kao poison message i ne može se replay-ovati bez ručne intervencije.' }, { status: 409 });
  }

  if ((entry.replay_attempts ?? 0) >= MAX_REPLAY_ATTEMPTS) {
    await supabase
      .from('webhook_dead_letter')
      .update({
        poison: true,
        poison_reason: `max replay attempts reached (${MAX_REPLAY_ATTEMPTS})`,
      })
      .eq('id', dlqId);
    return NextResponse.json({ error: 'Maksimalan broj replay pokušaja je prekoračen; event je označen kao poison.' }, { status: 409 });
  }

  await auditAdminAction('admin.replay.requested', {
    dlqId,
    eventId: entry.event_id,
    approvedBy,
  });

  // Ukloni stari idempotency zapis da omogućimo ponovnu obradu
  await supabase
    .from('stripe_webhook_events')
    .delete()
    .eq('event_id', entry.event_id);

  // Forwarduj event na webhook handler interno
  const webhookUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/api/stripe/webhook`;

  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? '';

  // Re-generišemo potpis za interni poziv
  const signature = stripe.webhooks.generateTestHeaderString({
    payload: entry.payload,
    secret: webhookSecret,
  });

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': signature,
        'x-request-id': `admin-replay-${dlqId}`,
      },
      body: entry.payload,
    });

    const result = (await response.json()) as Record<string, unknown>;

    // Označi kao replay-ovan
    await supabase
      .from('webhook_dead_letter')
      .update({
        replayed: true,
        replayed_at: new Date().toISOString(),
        replay_attempts: (entry.replay_attempts ?? 0) + 1,
        approved_by: approvedBy,
        approved_at: new Date().toISOString(),
        last_replayed_by: requesterId,
      })
      .eq('id', dlqId);

    await auditAdminAction('admin.replay.succeeded', {
      dlqId,
      eventId: entry.event_id,
      eventType: entry.event_type,
      approvedBy,
    });

    return NextResponse.json({
      success: true,
      dlqId,
      eventId: entry.event_id,
      eventType: entry.event_type,
      webhookResponse: result,
      replayedAt: new Date().toISOString(),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    // Inkrementiraj retry count
    await supabase
      .from('webhook_dead_letter')
      .update({
        retry_count: (entry.retry_count ?? 0) + 1,
        replay_attempts: (entry.replay_attempts ?? 0) + 1,
        poison: (entry.replay_attempts ?? 0) + 1 >= MAX_REPLAY_ATTEMPTS,
        poison_reason: (entry.replay_attempts ?? 0) + 1 >= MAX_REPLAY_ATTEMPTS
          ? `max replay attempts reached (${MAX_REPLAY_ATTEMPTS})`
          : null,
      })
      .eq('id', dlqId);

    await auditAdminAction('admin.replay.failed', {
      dlqId,
      eventId: entry.event_id,
      error: msg,
      approvedBy,
    });

    return NextResponse.json({ error: `Replay neuspešan: ${msg}` }, { status: 500 });
  }
}
