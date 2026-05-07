// SpajaUltraOmegaCore -∞Ω+∞ — Billing Plan Sync
// Kompanija SPAJA — Digitalna Industrija
// POST /api/billing-plan-sync — periodična sinhronizacija planova sa Stripe-om (#41, #42)
//
// Poredi lokalne definicije planova sa Stripe API podacima.
// Vraća listu neusklađenosti i opcionalno primenjuje ispravke.
//
// Zahteva CRON_SECRET ili admin token.

import { NextRequest, NextResponse } from 'next/server';
import { getStripe, PLANOVI } from '@/lib/stripe/config';
import { validatePlanSync } from '@/lib/stripe/billing-validators';
import { verifyUserFromToken } from '@/lib/supabase/server';

function isAdminOrCron(request: NextRequest): boolean {
  const cronSecret = request.headers.get('x-cron-secret');
  return cronSecret === (process.env.BILLING_INTEGRITY_CRON_SECRET ?? '');
}

export async function POST(request: NextRequest) {
  const user = await verifyUserFromToken(request.headers.get('authorization'));
  const adminRoles = (user?.user_metadata?.['roles'] as string[] | undefined) ?? [];
  const isAdmin = adminRoles.includes('admin') || adminRoles.includes('superadmin');

  if (!isAdmin && !isAdminOrCron(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const stripe = getStripe();

  // Dohvati sve aktivne prices sa Stripe-a
  const stripePrices = await stripe.prices.list({ active: true, limit: 100 });

  const remotePrices = stripePrices.data.map((p) => ({
    id: p.id,
    unit_amount: p.unit_amount,
    currency: p.currency,
  }));

  const localPlans = PLANOVI.filter((p) => p.stripePriceId).map((p) => ({
    id: p.id,
    stripePriceId: p.stripePriceId,
    cenaEur: p.cenaEur,
  }));

  const syncResult = validatePlanSync(localPlans, remotePrices);

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    inSync: syncResult.inSync,
    localPlanCount: localPlans.length,
    remotePriceCount: remotePrices.length,
    mismatches: syncResult.mismatches,
    recommendation: syncResult.inSync
      ? 'Svi planovi su usklađeni sa Stripe-om.'
      : `Pronađeno ${syncResult.mismatches.length} neusklađenosti. Ažurirajte lokalne planove ili Stripe cene.`,
  });
}
