// SpajaUltraOmegaCore -∞Ω+∞ — Novčanik Balance API
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/novcanik/balance
// GET /api/novcanik/balance?assetId=BTC

import { type NextRequest } from 'next/server';
import { apiSuccess, apiError, apiInternalError } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { verifyUserFromToken, getSupabaseServerClient } from '@/lib/supabase/server';
import { isExchangeFlagEnabled } from '@/lib/menjacnica/feature-flags';
import { getAsset } from '@/lib/menjacnica/assets';

export async function GET(request: NextRequest) {
  try {
    if (!isExchangeFlagEnabled('novcanik-accounts')) {
      return apiError('SERVICE_UNAVAILABLE', 'Novčanik modul je trenutno nedostupan.');
    }

    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) return apiError('UNAUTHORIZED', 'Niste prijavljeni.');

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/novcanik/balance'),
      60,
      60,
    );
    if (!allowed) {
      return apiError('TOO_MANY_REQUESTS', 'Previše zahteva. Pokušajte za 60 sekundi.');
    }

    const url = new URL(request.url);
    const assetId = url.searchParams.get('assetId')?.toUpperCase();

    const supabase = getSupabaseServerClient();
    let query = supabase
      .from('novcanik_accounts')
      .select('asset_id, available, reserved, total, kyc_tier')
      .eq('user_id', user.id)
      .eq('enabled', true);

    if (assetId) query = query.eq('asset_id', assetId);

    const { data, error } = await query;
    if (error) return apiInternalError('novcanik-balance', error);

    if (assetId && (!data || data.length === 0)) {
      return apiError('NOT_FOUND', `Nema naloga za asset '${assetId}'.`);
    }

    const balances = (data ?? []).map((row) => ({
      assetId: row.asset_id,
      assetNaziv: getAsset(row.asset_id)?.naziv ?? row.asset_id,
      available: row.available,
      reserved: row.reserved,
      total: row.total,
      kycTier: row.kyc_tier,
    }));

    return apiSuccess({
      balances: assetId ? balances[0] : balances,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return apiInternalError('novcanik-balance', error);
  }
}
