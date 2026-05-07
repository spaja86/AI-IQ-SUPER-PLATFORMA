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

function isAdminUser(user: { user_metadata?: Record<string, unknown> } | null): boolean {
  if (!user) return false;
  const roles = user.user_metadata?.['roles'];
  if (Array.isArray(roles)) return roles.includes('admin') || roles.includes('superadmin');
  return false;
}

export async function POST(request: NextRequest) {
  const user = await verifyUserFromToken(request.headers.get('authorization'));
  if (!isAdminUser(user as Parameters<typeof isAdminUser>[0])) {
    return NextResponse.json({ error: 'Forbidden — samo admini mogu replay-ovati webhook evente.' }, { status: 403 });
  }

  const body = (await request.json()) as { dlqId?: string };
  const { dlqId } = body;

  if (!dlqId) {
    return NextResponse.json({ error: 'dlqId je obavezan.' }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();

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
  const timestamp = Math.floor(Date.now() / 1000);
  const payloadToSign = `${timestamp}.${entry.payload}`;
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
      .update({ replayed: true, replayed_at: new Date().toISOString() })
      .eq('id', dlqId);

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
      .update({ retry_count: (entry.retry_count ?? 0) + 1 })
      .eq('id', dlqId);

    return NextResponse.json({ error: `Replay neuspešan: ${msg}` }, { status: 500 });
  }
}
