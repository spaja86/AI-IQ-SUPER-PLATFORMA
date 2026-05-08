// SpajaUltraOmegaCore -∞Ω+∞ — PayPal Portal
// Kompanija SPAJA — Digitalna Industrija
// POST /api/paypal/portal — upravljanje PayPal pretplatom

import { NextRequest, NextResponse } from 'next/server';
import { getPayPalAccessToken, PAYPAL_API_BASE } from '@/lib/paypal/config';
import { verifyUserFromToken, getSupabaseServerClient } from '@/lib/supabase/server';
import { isProviderEnabled } from '@/lib/billing/orchestration';

export async function POST(request: NextRequest) {
  try {
    if (!isProviderEnabled('paypal')) {
      return NextResponse.json({ error: 'PayPal nije aktivan.' }, { status: 503 });
    }

    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    const supabase = getSupabaseServerClient();
    const { data: profile } = await supabase
      .from('profiles')
      .select('paypal_subscription_id')
      .eq('id', user.id)
      .single() as unknown as { data: { paypal_subscription_id: string | null } | null };

    if (!profile?.paypal_subscription_id) {
      return NextResponse.json({ error: 'Nemate aktivnu PayPal pretplatu.' }, { status: 400 });
    }

    const accessToken = await getPayPalAccessToken();
    const response = await fetch(
      `${PAYPAL_API_BASE}/v1/billing/subscriptions/${profile.paypal_subscription_id}`,
      {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      },
    );

    if (!response.ok) {
      return NextResponse.json({ error: 'Greška pri dobijanju detalja pretplate.' }, { status: 502 });
    }

    const subscription = await response.json() as { id: string; status: string; plan_id: string; links: Array<{ rel: string; href: string }> };

    return NextResponse.json({
      subscriptionId: subscription.id,
      status: subscription.status,
      planId: subscription.plan_id,
      manageUrl: `https://www.paypal.com/myaccount/autopay/`,
    });
  } catch (error) {
    console.error('[paypal-portal] error:', error);
    return NextResponse.json({ error: 'Greška pri upravljanju PayPal pretplatom.' }, { status: 500 });
  }
}
