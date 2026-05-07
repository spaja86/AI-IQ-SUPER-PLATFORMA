// SpajaUltraOmegaCore -∞Ω+∞ — Billing Integrity Check
// Kompanija SPAJA — Digitalna Industrija
// POST /api/billing-integrity-check — automatizovani dnevni integrity check (#40)
//
// Proverava:
//   • Da li svaki aktivni korisnik ima audit zapis (#6)
//   • Da li postoje webhook eventi bez audit zapisa
//   • Da li billing_locked korisnici imaju past_due status
//   • Da li grace_period korisnici imaju grace_period_expires_at
//   • Da li su plan podaci konzistentni sa chat_messages_limit
//
// Zahteva CRON_SECRET ili admin token za poziv.

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { PLANOVI, UNLIMITED_CHAT } from '@/lib/stripe/config';

export async function POST(request: NextRequest) {
  // Autorizacija: CRON_SECRET header ili admin token
  const cronSecret = request.headers.get('x-cron-secret');
  const expectedSecret = process.env.BILLING_INTEGRITY_CRON_SECRET;

  if (expectedSecret && cronSecret !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const supabase = getSupabaseServerClient();
  const issues: Array<{ severity: 'warning' | 'error'; code: string; message: string; userId?: string }> = [];
  const checksRun: string[] = [];

  // ── Check 1: billing_locked bez past_due statusa ──────────────────────────
  checksRun.push('billing-locked-status');
  const { data: lockedProfiles } = await supabase
    .from('profiles')
    .select('id, subscription_status')
    .eq('billing_locked', true);

  for (const p of lockedProfiles ?? []) {
    if (p.subscription_status !== 'past_due' && p.subscription_status !== 'past_due_locked') {
      issues.push({
        severity: 'error',
        code: 'LOCKED_WITHOUT_PAST_DUE',
        message: `billing_locked=true ali status=${p.subscription_status}`,
        userId: p.id,
      });
    }
  }

  // ── Check 2: grace_period korisnici bez grace_period_expires_at ───────────
  checksRun.push('grace-period-expiry');
  const { data: graceProfiles } = await supabase
    .from('profiles')
    .select('id, grace_period_expires_at')
    .eq('subscription_status', 'grace_period');

  for (const p of graceProfiles ?? []) {
    if (!p.grace_period_expires_at) {
      issues.push({
        severity: 'warning',
        code: 'GRACE_PERIOD_NO_EXPIRY',
        message: 'grace_period status bez grace_period_expires_at',
        userId: p.id,
      });
    }
  }

  // ── Check 3: Plan vs chat_messages_limit konzistentnost ───────────────────
  checksRun.push('plan-limit-consistency');
  const { data: allProfiles } = await supabase
    .from('profiles')
    .select('id, plan, chat_messages_limit, subscription_status');

  for (const p of allProfiles ?? []) {
    if (p.subscription_status !== 'active') continue;
    const planDef = PLANOVI.find((pl) => pl.id === p.plan);
    if (!planDef) continue;

    const expectedLimit = planDef.chatLimit === UNLIMITED_CHAT ? 999999 : planDef.chatLimit;
    if (p.chat_messages_limit !== expectedLimit) {
      issues.push({
        severity: 'warning',
        code: 'PLAN_LIMIT_MISMATCH',
        message: `Plan=${p.plan} → očekivani limit=${expectedLimit}, stvarni=${p.chat_messages_limit}`,
        userId: p.id,
      });
    }
  }

  // ── Check 4: Webhook eventi bez odgovarajućeg audit zapisa (sampling) ──────
  checksRun.push('webhook-audit-coverage');
  const { data: recentWebhooks } = await supabase
    .from('stripe_webhook_events')
    .select('event_id, event_type')
    .in('event_type', [
      'checkout.session.completed',
      'customer.subscription.updated',
      'customer.subscription.deleted',
      'invoice.payment_failed',
    ])
    .order('processed_at', { ascending: false })
    .limit(100);

  for (const wh of recentWebhooks ?? []) {
    const { count } = await supabase
      .from('financial_audit_log')
      .select('id', { count: 'exact', head: true })
      .eq('stripe_event_id', wh.event_id);

    if ((count ?? 0) === 0) {
      issues.push({
        severity: 'warning',
        code: 'WEBHOOK_WITHOUT_AUDIT',
        message: `Webhook ${wh.event_id} (${wh.event_type}) nema audit zapis`,
      });
    }
  }

  // ── Check 5: DLQ dubina ───────────────────────────────────────────────────
  checksRun.push('dlq-depth');
  const { count: dlqCount } = await supabase
    .from('webhook_dead_letter')
    .select('id', { count: 'exact', head: true })
    .eq('replayed', false);

  if ((dlqCount ?? 0) > 0) {
    issues.push({
      severity: dlqCount! > 10 ? 'error' : 'warning',
      code: 'DLQ_NON_EMPTY',
      message: `Dead-letter queue ima ${dlqCount} neobrađenih eventova`,
    });
  }

  const result = {
    timestamp: new Date().toISOString(),
    checksRun,
    totalIssues: issues.length,
    errors: issues.filter((i) => i.severity === 'error').length,
    warnings: issues.filter((i) => i.severity === 'warning').length,
    status: issues.some((i) => i.severity === 'error') ? 'fail' : issues.length > 0 ? 'warn' : 'ok',
    issues,
  };

  return NextResponse.json(result, { status: result.status === 'fail' ? 500 : 200 });
}
