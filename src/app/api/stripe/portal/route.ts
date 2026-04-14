// SpajaUltraOmegaCore -∞Ω+∞ — Stripe Customer Portal
// Kompanija SPAJA — Digitalna Industrija
// POST /api/stripe/portal — otvara Stripe billing portal

import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe/config';
import { verifyUserFromToken, getSupabaseServerClient } from '@/lib/supabase/server';
import { BASE_URL } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    const supabase = getSupabaseServerClient();
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (!profile?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'Nemate aktivan Stripe nalog. Prvo odaberite plan.' },
        { status: 400 },
      );
    }

    const stripe = getStripe();
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${BASE_URL}/dashboard`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe portal error:', error);
    return NextResponse.json(
      { error: 'Greska pri otvaranju billing portala.' },
      { status: 500 },
    );
  }
}
