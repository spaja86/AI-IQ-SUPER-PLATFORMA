// SpajaUltraOmegaCore -∞Ω+∞ — Billing Reconcile All
// Kompanija SPAJA — Digitalna Industrija
// POST /api/billing-reconcile-all — reconciliacija svih provajdera

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { isProviderEnabled } from '@/lib/billing/orchestration';
import { APP_VERSION } from '@/lib/constants';

function isAuthorized(request: NextRequest): boolean {
  const cronSecret = request.headers.get('x-cron-secret');
  return cronSecret === (process.env.BILLING_INTEGRITY_CRON_SECRET ?? '');
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const supabase = getSupabaseServerClient();
  const issues: Array<{ severity: 'warning' | 'error'; provider: string; code: string; message: string }> = [];
  const checksRun: string[] = [];

  // Check 1: Profili sa active statusom bez subscription ID-a (oba provajdera)
  checksRun.push('active-without-subscription-id');
  const { data: activeProfiles } = await supabase
    .from('profiles')
    .select('id, plan, subscription_status, stripe_subscription_id')
    .eq('subscription_status', 'active');

  for (const p of activeProfiles ?? []) {
    const profileAny = p as unknown as { id: string; plan: string; subscription_status: string; stripe_subscription_id: string | null; paypal_subscription_id?: string | null };
    if (!profileAny.stripe_subscription_id && !profileAny.paypal_subscription_id) {
      issues.push({
        severity: 'warning',
        provider: 'any',
        code: 'ACTIVE_WITHOUT_SUBSCRIPTION_ID',
        message: `Korisnik ${p.id} ima status=active bez stripe_subscription_id ili paypal_subscription_id`,
      });
    }
  }

  // Check 2: Stripe provajder dostupnost
  checksRun.push('stripe-provider-check');
  if (!isProviderEnabled('stripe')) {
    issues.push({
      severity: 'error',
      provider: 'stripe',
      code: 'STRIPE_DISABLED',
      message: 'Stripe provajder nije aktivan',
    });
  }

  // Check 3: PayPal konfiguracija
  checksRun.push('paypal-config-check');
  if (isProviderEnabled('paypal')) {
    const { data: paypalProfiles } = await supabase
      .from('profiles')
      .select('id')
      .eq('subscription_status', 'canceled');

    const paypalCanceled = (paypalProfiles ?? []).filter((p) => {
      const pa = p as unknown as { paypal_subscription_id?: string | null };
      return pa.paypal_subscription_id != null;
    });

    if (paypalCanceled.length > 0) {
      issues.push({
        severity: 'warning',
        provider: 'paypal',
        code: 'PAYPAL_CANCELED_WITH_ID',
        message: `${paypalCanceled.length} korisnika ima canceled status ali zadrzan paypal_subscription_id`,
      });
    }
  }

  // Check 4: Plan distribucija konzistentnost
  checksRun.push('plan-distribution');
  const { data: planCounts } = await supabase
    .from('profiles')
    .select('plan, subscription_status');

  const paidWithoutActive = (planCounts ?? []).filter(
    (p) => p.plan !== 'starter' && p.subscription_status !== 'active' && p.subscription_status !== 'trialing' && p.subscription_status !== 'grace_period',
  );

  if (paidWithoutActive.length > 0) {
    issues.push({
      severity: 'warning',
      provider: 'any',
      code: 'PAID_PLAN_WITHOUT_ACTIVE_STATUS',
      message: `${paidWithoutActive.length} korisnika ima plaćeni plan ali nije active/trialing/grace_period`,
    });
  }

  const result = {
    timestamp: new Date().toISOString(),
    verzija: APP_VERSION,
    checksRun,
    totalIssues: issues.length,
    errors: issues.filter((i) => i.severity === 'error').length,
    warnings: issues.filter((i) => i.severity === 'warning').length,
    status: issues.some((i) => i.severity === 'error') ? 'fail' : issues.length > 0 ? 'warn' : 'ok',
    issues,
    provajderi: {
      stripe: isProviderEnabled('stripe') ? 'aktivan' : 'neaktivan',
      paypal: isProviderEnabled('paypal') ? 'aktivan' : 'simulacija',
    },
  };

  return NextResponse.json(result, { status: result.status === 'fail' ? 500 : 200 });
}
