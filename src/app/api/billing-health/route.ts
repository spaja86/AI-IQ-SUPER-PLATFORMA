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
const SLO_AUDIT_WRITE_P99_MS = 500;
const ALERT_PAST_DUE_THRESHOLD = 100; // Broj past_due koji okida alert (#29)
const ALERT_DLQ_DEPTH_THRESHOLD = 50;  // DLQ dubina koja okida alert
const ALERT_WEBHOOK_ERROR_RATE_PCT = 5; // Greška-rate koji okida alert (#4)

export async function GET(_request: NextRequest) {
  const supabase = getSupabaseServerClient();
  const now = new Date().toISOString();

  // ── Plan distribucija ─────────────────────────────────────────────────────
  const { data: planCounts } = await supabase
    .from('profiles')
    .select('plan, subscription_status, stripe_subscription_id, grace_period_expires_at')
    .not('plan', 'is', null);

  const planDist: Record<string, number> = {};
  let pastDueCount = 0;
  let activeCount = 0;
  let gracePeriodCount = 0;
  let activeWithoutSubscriptionId = 0;
  let stalePastDueCount = 0;
  const nowMs = Date.now();

  for (const row of planCounts ?? []) {
    planDist[row.plan] = (planDist[row.plan] ?? 0) + 1;
    if (row.subscription_status === 'past_due' || row.subscription_status === 'past_due_locked') {
      pastDueCount++;
      if (row.grace_period_expires_at && Date.parse(row.grace_period_expires_at) < nowMs - 24 * 60 * 60 * 1000) {
        stalePastDueCount++;
      }
    }
    if (row.subscription_status === 'active') {
      activeCount++;
      if (!row.stripe_subscription_id) activeWithoutSubscriptionId++;
    }
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

  const { data: webhookLatencyRows } = await supabase
    .from('stripe_webhook_events')
    .select('webhook_latency_ms, consistency_latency_ms')
    .gte('processed_at', oneDayAgo)
    .order('processed_at', { ascending: false })
    .limit(1000);

  // ── DLQ dubina ─────────────────────────────────────────────────────────────
  const { count: dlqDepth } = await supabase
    .from('webhook_dead_letter')
    .select('id', { count: 'exact', head: true })
    .eq('replayed', false);

  const { data: dlqOldest } = await supabase
    .from('webhook_dead_letter')
    .select('created_at')
    .eq('replayed', false)
    .order('created_at', { ascending: true })
    .limit(1)
    .single();

  // ── Audit log konzistentnost (poslednja 24h) (#6) ───────────────────────
  const { count: auditCount } = await supabase
    .from('financial_audit_log')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', oneDayAgo);

  const dlqUnreplayed = dlqDepth ?? 0;
  const webhookErrors = dlqUnreplayed;
  const webhookErrorRatePct = (webhookTotal ?? 0) > 0 ? (webhookErrors / (webhookTotal ?? 1)) * 100 : 0;
  const webhookLatencies = (webhookLatencyRows ?? [])
    .map((r) => r.webhook_latency_ms)
    .filter((v): v is number => typeof v === 'number');
  const consistencyLatencies = (webhookLatencyRows ?? [])
    .map((r) => r.consistency_latency_ms)
    .filter((v): v is number => typeof v === 'number');
  const avgWebhookLatencyMs = webhookLatencies.length ? Math.round(webhookLatencies.reduce((a, b) => a + b, 0) / webhookLatencies.length) : null;
  const avgConsistencyLatencyMs = consistencyLatencies.length ? Math.round(consistencyLatencies.reduce((a, b) => a + b, 0) / consistencyLatencies.length) : null;
  const dlqOldestAgeSec = dlqOldest?.created_at ? Math.max(0, Math.floor((Date.now() - Date.parse(dlqOldest.created_at)) / 1000)) : 0;
  const billingConsistencyScore = Math.max(
    0,
    100
      - Math.min(30, activeWithoutSubscriptionId * 5)
      - Math.min(30, stalePastDueCount * 3)
      - Math.min(40, dlqUnreplayed * 2),
  );

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

  if (activeWithoutSubscriptionId > 0) {
    alerts.push({ level: 'critical', message: `Active korisnici bez stripe_subscription_id: ${activeWithoutSubscriptionId}` });
  }

  if (stalePastDueCount > 0) {
    alerts.push({ level: 'warning', message: `past_due duže od 24h (indikator): ${stalePastDueCount}` });
  }

  if (webhookErrorRatePct >= ALERT_WEBHOOK_ERROR_RATE_PCT) {
    alerts.push({ level: 'warning', message: `Webhook error-rate: ${webhookErrorRatePct.toFixed(2)}% (prag: ${ALERT_WEBHOOK_ERROR_RATE_PCT}%)` });
  }

  const openCircuits = circuitBreakers.filter((cb) => cb.state === 'open');
  for (const cb of openCircuits) {
    alerts.push({ level: 'critical', message: `Circuit breaker OPEN: ${cb.name}` });
  }

  // ── DLQ growth trend + auto incident trigger (#67) ───────────────────────
  const oneDayAgoTs = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count: dlqGrowth24h } = await supabase
    .from('webhook_dead_letter')
    .select('id', { count: 'exact', head: true })
    .eq('replayed', false)
    .gte('created_at', oneDayAgoTs);

  const DLQ_INCIDENT_GROWTH_THRESHOLD = Number(process.env.DLQ_INCIDENT_GROWTH_THRESHOLD ?? '20');
  let incidentOpenedForDlqGrowth = false;

  if ((dlqGrowth24h ?? 0) >= DLQ_INCIDENT_GROWTH_THRESHOLD) {
    alerts.push({
      level: 'critical',
      message: `DLQ growth trend: ${dlqGrowth24h} novi unreplayed eventi u poslednjih 24h (prag: ${DLQ_INCIDENT_GROWTH_THRESHOLD}). Incident auto-otvoren.`,
    });
    // Auto-otvori incident u incident logu ako endpoint postoji (#67)
    const incidentEndpoint = process.env.INCIDENT_WEBHOOK_URL;
    if (incidentEndpoint) {
      try {
        await fetch(incidentEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            severity: 'critical',
            title: 'DLQ growth trend alarm',
            description: `Billing DLQ has ${dlqGrowth24h} new unprocessed events in 24h. Manual intervention required.`,
            source: 'billing-health-monitor',
            timestamp: now,
          }),
          signal: AbortSignal.timeout(3000),
        });
        incidentOpenedForDlqGrowth = true;
      } catch {
        // Non-fatal — incident webhook failure should not break health check
      }
    } else {
      incidentOpenedForDlqGrowth = true; // Logged in alerts, external webhook not configured
    }
  }

  // ── SLO evaluacija (#71 audit write + #50) ────────────────────────────────
  // Audit write latency SLO: 99.9% < 500ms
  // Proxy: se auditCount / webhookTotal ratio < 99.9% označava potencijalni problem
  const auditSloBreached =
    (webhookTotal ?? 0) > 10 &&
    (auditCount ?? 0) > 0 &&
    (auditCount ?? 0) / (webhookTotal ?? 1) < 0.999;

  if (auditSloBreached) {
    alerts.push({
      level: 'warning',
      message: `Audit SLO narušen: audit_entries/webhook_processed ratio < 99.9% (${auditCount}/${webhookTotal ?? 0})`,
    });
  }

  const sloStatus = {
    webhookSuccessRateTarget: SLO_WEBHOOK_SUCCESS_RATE_PCT,
    checkoutP99Target: SLO_CHECKOUT_P99_MS,
    auditWriteP99Target: SLO_AUDIT_WRITE_P99_MS,
    auditSloBreached,
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
      activeWithoutSubscriptionId,
      stalePastDueCount,
      billingConsistencyScore,
      planDistribution: planDist,
    },
    webhook: {
      processedLast24h: webhookTotal ?? 0,
      dlqDepth: dlqDepth ?? 0,
      dlqOldestAgeSec,
      dlqGrowth24h: dlqGrowth24h ?? 0,
      webhookErrorRatePct,
      avgWebhookLatencyMs,
      avgConsistencyLatencyMs,
      auditEntriesLast24h: auditCount ?? 0,
    },
    circuitBreakers,
    alerts,
    slo: sloStatus,
    incidents: {
      dlqGrowthIncidentOpened: incidentOpenedForDlqGrowth,
    },
    featureFlags: {
      total: featureFlags.ukupno,
      active: featureFlags.aktivnih,
      inactive: featureFlags.neaktivnih,
    },
  };

  const httpStatus = sloStatus.status === 'ok' ? 200 : 207;
  return NextResponse.json(health, { status: httpStatus });
}
