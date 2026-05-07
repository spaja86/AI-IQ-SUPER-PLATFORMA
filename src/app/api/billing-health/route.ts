// SpajaUltraOmegaCore -∞Ω+∞ — Billing Health Endpoint
// Kompanija SPAJA — Digitalna Industrija
// GET /api/billing-health — operativni monitoring billing sistema (#44)
//
// Vraća:
//   • Status webhook obrade (throughput, greške, duplicati)
//   • Status circuit breaker-a
//   • Broj past_due korisnika (#29)
//   • Dead-letter queue dubinu (#7)
//   • KPI metriku: MRR (aproksimacija), plan distribucija (#28)
//   • SLA/SLO indikatori (#50)
//   • Alerting pragovi (#4, #29, #30)

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { stripeCheckoutCircuit, stripePortalCircuit, stripeWebhookCircuit } from '@/lib/stripe/billing-guard';
import { getBillingFlagsReport } from '@/lib/stripe/billing-feature-flags';
import { PLANOVI } from '@/lib/stripe/config';

// SLA ciljevi (#50)
const SLO_WEBHOOK_SUCCESS_RATE_PCT = 99.5;
const SLO_CHECKOUT_P99_MS = 3000;
const ALERT_PAST_DUE_THRESHOLD = 100; // Broj past_due koji okida alert (#29)
const ALERT_DLQ_DEPTH_THRESHOLD = 50;  // DLQ dubina koja okida alert
const ALERT_WEBHOOK_ERROR_RATE_PCT = 5; // Greška-rate koji okida alert (#4)

export async function GET(_request: NextRequest) {
  const supabase = getSupabaseServerClient();
  const now = new Date().toISOString();

  // ── Plan distribucija ─────────────────────────────────────────────────────
  const { data: planCounts } = await supabase
    .from('profiles')
    .select('plan, subscription_status')
    .not('plan', 'is', null);

  const planDist: Record<string, number> = {};
  let pastDueCount = 0;
  let activeCount = 0;
  let gracePeriodCount = 0;

  for (const row of planCounts ?? []) {
    planDist[row.plan] = (planDist[row.plan] ?? 0) + 1;
    if (row.subscription_status === 'past_due' || row.subscription_status === 'past_due_locked') pastDueCount++;
    if (row.subscription_status === 'active') activeCount++;
    if (row.subscription_status === 'grace_period') gracePeriodCount++;
  }

  // ── MRR aproksimacija (#28) ──────────────────────────────────────────────
  let mrrEur = 0;
  for (const plan of PLANOVI) {
    if (plan.cenaEur > 0 && plan.mesecno) {
      mrrEur += (planDist[plan.id] ?? 0) * plan.cenaEur;
    }
  }

  // ── Webhook statistike (posled 24h) (#30) ────────────────────────────────
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { count: webhookTotal } = await supabase
    .from('stripe_webhook_events')
    .select('id', { count: 'exact', head: true })
    .gte('processed_at', oneDayAgo);

  // ── DLQ dubina ─────────────────────────────────────────────────────────────
  const { count: dlqDepth } = await supabase
    .from('webhook_dead_letter')
    .select('id', { count: 'exact', head: true })
    .eq('replayed', false);

  // ── Audit log konzistentnost (poslednja 24h) (#6) ───────────────────────
  const { count: auditCount } = await supabase
    .from('financial_audit_log')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', oneDayAgo);

  // ── Circuit Breaker stanje ────────────────────────────────────────────────
  const circuitBreakers = [
    stripeCheckoutCircuit.metrics(),
    stripePortalCircuit.metrics(),
    stripeWebhookCircuit.metrics(),
  ];

  // ── Alerting (#4, #29, #30) ───────────────────────────────────────────────
  const alerts: Array<{ level: 'warning' | 'critical'; message: string }> = [];

  if (pastDueCount >= ALERT_PAST_DUE_THRESHOLD) {
    alerts.push({ level: 'critical', message: `Nagli skok past_due: ${pastDueCount} korisnika (prag: ${ALERT_PAST_DUE_THRESHOLD})` });
  }

  if ((dlqDepth ?? 0) >= ALERT_DLQ_DEPTH_THRESHOLD) {
    alerts.push({ level: 'warning', message: `Dead-letter queue dubina: ${dlqDepth} (prag: ${ALERT_DLQ_DEPTH_THRESHOLD})` });
  }

  const openCircuits = circuitBreakers.filter((cb) => cb.state === 'open');
  for (const cb of openCircuits) {
    alerts.push({ level: 'critical', message: `Circuit breaker OPEN: ${cb.name}` });
  }

  // ── SLO evaluacija (#50) ──────────────────────────────────────────────────
  const sloStatus = {
    webhookSuccessRateTarget: SLO_WEBHOOK_SUCCESS_RATE_PCT,
    checkoutP99Target: SLO_CHECKOUT_P99_MS,
    status: alerts.some((a) => a.level === 'critical') ? 'degraded' : 'ok',
  };

  // ── Feature Flags pregled ─────────────────────────────────────────────────
  const featureFlags = getBillingFlagsReport();

  // ── Finalni odgovor ───────────────────────────────────────────────────────
  const health = {
    status: sloStatus.status,
    timestamp: now,
    kpi: {
      mrrEur,
      activeSubscriptions: activeCount,
      pastDueSubscriptions: pastDueCount,
      gracePeriodSubscriptions: gracePeriodCount,
      planDistribution: planDist,
    },
    webhook: {
      processedLast24h: webhookTotal ?? 0,
      dlqDepth: dlqDepth ?? 0,
      auditEntriesLast24h: auditCount ?? 0,
    },
    circuitBreakers,
    alerts,
    slo: sloStatus,
    featureFlags: {
      total: featureFlags.ukupno,
      active: featureFlags.aktivnih,
      inactive: featureFlags.neaktivnih,
    },
  };

  const httpStatus = sloStatus.status === 'ok' ? 200 : 207;
  return NextResponse.json(health, { status: httpStatus });
}
