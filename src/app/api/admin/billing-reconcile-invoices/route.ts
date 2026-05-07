// SpajaUltraOmegaCore -∞Ω+∞ — Admin: Reconcile Stripe Invoices ↔ Local Status (#55)
// Kompanija SPAJA — Digitalna Industrija
// POST /api/admin/billing-reconcile-invoices
//
// Dnevni reconcile: dohvata Stripe invoice-e (poslednih 48h) i poređuje sa
// lokalnim subscription_status u profiles tabeli. Mismatch-eve loguje u
// financial_audit_log i vraća izveštaj.

import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe/config';
import { getSupabaseServerClient, verifyUserFromToken } from '@/lib/supabase/server';
import { buildAuditChainHash } from '@/lib/stripe/billing-audit-chain';

const STRIPE_INVOICE_STATUS_TO_LOCAL: Record<string, string> = {
  paid: 'active',
  open: 'past_due',
  void: 'canceled',
  uncollectible: 'past_due_locked',
  draft: 'incomplete',
};

function isAdminUser(user: { user_metadata?: Record<string, unknown> } | null): boolean {
  if (!user) return false;
  const roles = user.user_metadata?.['roles'];
  if (Array.isArray(roles)) return roles.includes('admin') || roles.includes('superadmin');
  return false;
}

export async function POST(request: NextRequest) {
  const user = await verifyUserFromToken(request.headers.get('authorization'));
  if (!isAdminUser(user as Parameters<typeof isAdminUser>[0])) {
    return NextResponse.json({ error: 'Forbidden — admin pristup obavezan.' }, { status: 403 });
  }

  const stripe = getStripe();
  const supabase = getSupabaseServerClient();
  const since = Math.floor((Date.now() - 48 * 60 * 60 * 1000) / 1000);

  const mismatches: Array<{
    stripeCustomerId: string;
    invoiceId: string;
    invoiceStatus: string;
    localStatus: string | null;
    expected: string;
  }> = [];
  const fixed: string[] = [];

  let hasMore = true;
  let startingAfter: string | undefined;

  while (hasMore) {
    const invoicesPage = await stripe.invoices.list({
      limit: 100,
      starting_after: startingAfter,
      created: { gte: since },
    });

    for (const invoice of invoicesPage.data) {
      const stripeCustomerId =
        typeof invoice.customer === 'string' ? invoice.customer : (invoice.customer as { id?: string } | null)?.id;
      if (!stripeCustomerId) continue;
      const expectedLocal = STRIPE_INVOICE_STATUS_TO_LOCAL[invoice.status ?? ''] ?? null;
      if (!expectedLocal) continue;

      const { data: profile } = await supabase
        .from('profiles')
        .select('id, subscription_status')
        .eq('stripe_customer_id', stripeCustomerId)
        .single();

      if (!profile) continue;

      if (profile.subscription_status !== expectedLocal) {
        mismatches.push({
          stripeCustomerId,
          invoiceId: invoice.id,
          invoiceStatus: invoice.status ?? 'unknown',
          localStatus: profile.subscription_status,
          expected: expectedLocal,
        });

        await supabase
          .from('profiles')
          .update({ subscription_status: expectedLocal, updated_at: new Date().toISOString() })
          .eq('id', profile.id);

        const now = new Date().toISOString();
        const { data: prevAudit } = await supabase
          .from('financial_audit_log')
          .select('chain_hash')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        const { payloadHash, chainHash } = buildAuditChainHash({
          payload: { invoiceId: invoice.id, stripeCustomerId, from: profile.subscription_status, to: expectedLocal },
          prevHash: prevAudit?.chain_hash ?? null,
          timestampIso: now,
        });
        await supabase.from('financial_audit_log').insert({
          user_id: profile.id,
          action: 'reconcile.invoice.status_fixed',
          old_status: profile.subscription_status,
          new_status: expectedLocal,
          stripe_event_id: invoice.id,
          stripe_customer_id: stripeCustomerId,
          metadata: { invoiceId: invoice.id, invoiceStatus: invoice.status, source: 'reconcile' },
          request_id: `reconcile-invoice-${invoice.id}`,
          payload_hash: payloadHash,
          prev_hash: prevAudit?.chain_hash ?? null,
          chain_hash: chainHash,
        });

        fixed.push(invoice.id);
      }
    }

    hasMore = invoicesPage.has_more;
    if (invoicesPage.data.length > 0) {
      startingAfter = invoicesPage.data[invoicesPage.data.length - 1]?.id;
    } else {
      hasMore = false;
    }
  }

  return NextResponse.json({
    reconciled: true,
    mismatchCount: mismatches.length,
    fixedCount: fixed.length,
    mismatches,
    timestamp: new Date().toISOString(),
  });
}
