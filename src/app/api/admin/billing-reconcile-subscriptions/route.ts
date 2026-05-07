// SpajaUltraOmegaCore -∞Ω+∞ — Admin: Reconcile Stripe Subscriptions ↔ profiles.plan (#56)
// Kompanija SPAJA — Digitalna Industrija
// POST /api/admin/billing-reconcile-subscriptions
//
// Dnevni reconcile: provjerava usklađenost Stripe subscription statusa
// i price ID-a sa lokalnim subscription_status i plan poljem u profiles.

import { NextRequest, NextResponse } from 'next/server';
import { getStripe, PLANOVI } from '@/lib/stripe/config';
import { getSupabaseServerClient, verifyUserFromToken } from '@/lib/supabase/server';
import { buildAuditChainHash } from '@/lib/stripe/billing-audit-chain';

function isAdminUser(user: { user_metadata?: Record<string, unknown> } | null): boolean {
  if (!user) return false;
  const roles = user.user_metadata?.['roles'];
  if (Array.isArray(roles)) return roles.includes('admin') || roles.includes('superadmin');
  return false;
}

function stripePriceIdToPlan(priceId: string): string | null {
  const match = PLANOVI.find((p) => p.stripePriceId === priceId);
  return match?.id ?? null;
}

const STRIPE_STATUS_TO_LOCAL: Record<string, string> = {
  active: 'active',
  trialing: 'trialing',
  past_due: 'past_due',
  canceled: 'canceled',
  incomplete: 'incomplete',
  incomplete_expired: 'canceled',
  unpaid: 'past_due_locked',
  paused: 'paused',
};

export async function POST(request: NextRequest) {
  const user = await verifyUserFromToken(request.headers.get('authorization'));
  if (!isAdminUser(user as Parameters<typeof isAdminUser>[0])) {
    return NextResponse.json({ error: 'Forbidden — admin pristup obavezan.' }, { status: 403 });
  }

  const stripe = getStripe();
  const supabase = getSupabaseServerClient();

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, stripe_subscription_id, stripe_customer_id, subscription_status, plan')
    .not('stripe_subscription_id', 'is', null);

  const mismatches: Array<{
    profileId: string;
    stripeSubscriptionId: string;
    field: string;
    local: string | null;
    remote: string | null;
  }> = [];
  const fixed: string[] = [];

  for (const profile of profiles ?? []) {
    if (!profile.stripe_subscription_id) continue;

    let sub;
    try {
      sub = await stripe.subscriptions.retrieve(profile.stripe_subscription_id, {
        expand: ['items.data.price'],
      });
    } catch {
      continue;
    }

    const remoteStatus = STRIPE_STATUS_TO_LOCAL[sub.status] ?? null;
    const remotePriceId = (sub.items.data[0]?.price as { id?: string } | undefined)?.id ?? null;
    const remotePlan = remotePriceId ? stripePriceIdToPlan(remotePriceId) : null;

    const updates: Record<string, string> = {};

    if (remoteStatus && profile.subscription_status !== remoteStatus) {
      mismatches.push({
        profileId: profile.id,
        stripeSubscriptionId: profile.stripe_subscription_id,
        field: 'subscription_status',
        local: profile.subscription_status,
        remote: remoteStatus,
      });
      updates['subscription_status'] = remoteStatus;
    }

    if (remotePlan && profile.plan !== remotePlan) {
      mismatches.push({
        profileId: profile.id,
        stripeSubscriptionId: profile.stripe_subscription_id,
        field: 'plan',
        local: profile.plan,
        remote: remotePlan,
      });
      updates['plan'] = remotePlan;
    }

    if (Object.keys(updates).length > 0) {
      await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', profile.id);

      const now = new Date().toISOString();
      const { data: prevAudit } = await supabase
        .from('financial_audit_log')
        .select('chain_hash')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      const { payloadHash, chainHash } = buildAuditChainHash({
        payload: { profileId: profile.id, updates, stripeSubscriptionId: profile.stripe_subscription_id },
        prevHash: prevAudit?.chain_hash ?? null,
        timestampIso: now,
      });
      await supabase.from('financial_audit_log').insert({
        user_id: profile.id,
        action: 'reconcile.subscription.fixed',
        old_status: profile.subscription_status,
        new_status: updates['subscription_status'] ?? profile.subscription_status,
        old_plan: profile.plan,
        new_plan: updates['plan'] ?? profile.plan,
        stripe_event_id: null,
        stripe_customer_id: profile.stripe_customer_id,
        metadata: { updates, stripeSubscriptionId: profile.stripe_subscription_id, source: 'reconcile' },
        request_id: `reconcile-sub-${profile.stripe_subscription_id}`,
        payload_hash: payloadHash,
        prev_hash: prevAudit?.chain_hash ?? null,
        chain_hash: chainHash,
      });

      fixed.push(profile.stripe_subscription_id);
    }
  }

  return NextResponse.json({
    reconciled: true,
    profilesChecked: (profiles ?? []).length,
    mismatchCount: mismatches.length,
    fixedCount: fixed.length,
    mismatches,
    timestamp: new Date().toISOString(),
  });
}
