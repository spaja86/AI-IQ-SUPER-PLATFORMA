// SpajaUltraOmegaCore -∞Ω+∞ — Billing: Churn Analysis (#98, #99)
// Kompanija SPAJA — Digitalna Industrija
// GET /api/billing-churn
//
// Implementira:
//   #98 churn reason klasifikaciju i trend analitiku
//   #99 predikcija involuntary churn rizika (early warning)

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient, verifyUserFromToken } from '@/lib/supabase/server';

// ─── Churn reason kategorije (#98) ────────────────────────────────────────────

type ChurnReason =
  | 'payment_failed'
  | 'downgraded_to_free'
  | 'explicit_cancellation'
  | 'trial_expired'
  | 'dispute_lost'
  | 'incomplete_expired'
  | 'unknown';

function classifyChurnReason(action: string, metadata: Record<string, unknown>): ChurnReason {
  if (action.includes('dispute')) return 'dispute_lost';
  if (action.includes('trial') && action.includes('cancel')) return 'trial_expired';
  if (action === 'subscription.canceled' || action.includes('cancel')) {
    if (metadata['source'] === 'customer_portal') return 'explicit_cancellation';
    if (metadata['reason'] === 'payment_failed') return 'payment_failed';
    return 'explicit_cancellation';
  }
  if (action.includes('payment_failed') || action.includes('invoice.payment_failed')) return 'payment_failed';
  if (action.includes('downgrade') && String(metadata['new_plan']) === 'starter') return 'downgraded_to_free';
  if (action.includes('incomplete_expired')) return 'incomplete_expired';
  return 'unknown';
}

// ─── Involuntary churn risk score (#99) ───────────────────────────────────────
// Faktori rizika:
//   - subscription_status === past_due  → visok rizik
//   - failed_payment_count >= 2         → visok rizik
//   - grace_period_expires_at uskoro    → srednji rizik
//   - trial koji uskoro ističe          → srednji rizik
//   - dugo nije plaćeno (invoice open)  → visok rizik

interface ChurnRiskProfile {
  userId: string;
  riskScore: number;           // 0 – 100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskFactors: string[];
}

function computeChurnRisk(profile: {
  subscription_status: string | null;
  grace_period_expires_at: string | null;
  failed_payment_count?: number | null;
  trial_end?: string | null;
}): Omit<ChurnRiskProfile, 'userId'> {
  let score = 0;
  const factors: string[] = [];
  const nowMs = Date.now();

  if (profile.subscription_status === 'past_due') {
    score += 40;
    factors.push('subscription past_due');
  }
  if (profile.subscription_status === 'past_due_locked') {
    score += 60;
    factors.push('subscription past_due_locked (blocked)');
  }
  if (profile.subscription_status === 'unpaid') {
    score += 55;
    factors.push('subscription unpaid');
  }
  if ((profile.failed_payment_count ?? 0) >= 3) {
    score += 30;
    factors.push(`${profile.failed_payment_count} failed payments`);
  } else if ((profile.failed_payment_count ?? 0) >= 1) {
    score += 15;
    factors.push(`${profile.failed_payment_count} failed payment(s)`);
  }
  if (profile.grace_period_expires_at) {
    const expiresMs = Date.parse(profile.grace_period_expires_at);
    const hoursLeft = (expiresMs - nowMs) / 3600_000;
    if (hoursLeft < 24) {
      score += 25;
      factors.push('grace period < 24h');
    } else if (hoursLeft < 72) {
      score += 10;
      factors.push('grace period < 72h');
    }
  }
  if (profile.trial_end) {
    const trialEndMs = Date.parse(profile.trial_end);
    const daysLeft = (trialEndMs - nowMs) / 86_400_000;
    if (daysLeft > 0 && daysLeft < 3) {
      score += 15;
      factors.push(`trial ending in ${daysLeft.toFixed(1)} days`);
    }
  }

  score = Math.min(score, 100);
  const riskLevel: ChurnRiskProfile['riskLevel'] =
    score >= 75 ? 'critical' : score >= 50 ? 'high' : score >= 25 ? 'medium' : 'low';

  return { riskScore: score, riskLevel, riskFactors: factors };
}

function isAdminUser(user: { user_metadata?: Record<string, unknown> } | null): boolean {
  if (!user) return false;
  const roles = user.user_metadata?.['roles'];
  if (Array.isArray(roles)) return roles.includes('admin') || roles.includes('superadmin');
  return false;
}

export async function GET(request: NextRequest) {
  const user = await verifyUserFromToken(request.headers.get('authorization'));
  if (!isAdminUser(user as Parameters<typeof isAdminUser>[0])) {
    return NextResponse.json({ error: 'Forbidden — admin pristup obavezan.' }, { status: 403 });
  }

  const supabase = getSupabaseServerClient();

  // ── Churn trend: cancelation events u poslednjih 90 dana (#98) ───────────
  const since90d = new Date(Date.now() - 90 * 86_400_000).toISOString();

  const { data: cancelEvents } = await supabase
    .from('financial_audit_log')
    .select('id, action, metadata, created_at, user_id')
    .or('action.ilike.%cancel%,action.ilike.%payment_failed%,action.ilike.%downgrade%,action.ilike.%dispute%')
    .gte('created_at', since90d)
    .order('created_at', { ascending: false })
    .limit(500);

  const reasonCounts: Record<ChurnReason, number> = {
    payment_failed: 0,
    downgraded_to_free: 0,
    explicit_cancellation: 0,
    trial_expired: 0,
    dispute_lost: 0,
    incomplete_expired: 0,
    unknown: 0,
  };

  for (const ev of cancelEvents ?? []) {
    const reason = classifyChurnReason(ev.action, ev.metadata as Record<string, unknown> ?? {});
    reasonCounts[reason]++;
  }

  // Weekly trend (buckets per week)
  const weeksBack = 12;
  const weeklyChurn: Array<{ weekStart: string; count: number }> = [];
  for (let w = weeksBack - 1; w >= 0; w--) {
    const weekStartMs = Date.now() - (w + 1) * 7 * 86_400_000;
    const weekEndMs = Date.now() - w * 7 * 86_400_000;
    const weekStart = new Date(weekStartMs).toISOString().slice(0, 10);
    const count = (cancelEvents ?? []).filter((ev) => {
      const t = Date.parse(ev.created_at);
      return t >= weekStartMs && t < weekEndMs;
    }).length;
    weeklyChurn.push({ weekStart, count });
  }

  // ── Involuntary churn risk scoring (#99) ─────────────────────────────────
  const { data: atRiskProfiles } = await supabase
    .from('profiles')
    .select('id, subscription_status, grace_period_expires_at')
    .in('subscription_status', ['past_due', 'past_due_locked', 'unpaid', 'trialing'])
    .limit(200);

  const riskProfiles: ChurnRiskProfile[] = (atRiskProfiles ?? []).map((p) => ({
    userId: p.id,
    ...computeChurnRisk({
      subscription_status: p.subscription_status,
      grace_period_expires_at: p.grace_period_expires_at,
    }),
  }));

  const criticalCount = riskProfiles.filter((r) => r.riskLevel === 'critical').length;
  const highCount = riskProfiles.filter((r) => r.riskLevel === 'high').length;

  return NextResponse.json({
    churnTrend: {
      periodDays: 90,
      totalChurnEvents: (cancelEvents ?? []).length,
      byReason: reasonCounts,
      weeklyBuckets: weeklyChurn,
    },
    involuntaryChurnRisk: {
      profilesAtRisk: riskProfiles.length,
      criticalCount,
      highCount,
      topRiskProfiles: riskProfiles
        .sort((a, b) => b.riskScore - a.riskScore)
        .slice(0, 20),
    },
    timestamp: new Date().toISOString(),
  });
}
