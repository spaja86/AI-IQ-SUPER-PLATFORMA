// SpajaUltraOmegaCore -∞Ω+∞ — Novčanik Accounts API
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/novcanik/accounts  — lista wallet naloga korisnika

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
      rateLimitKey(ip, '/api/novcanik/accounts'),
      60,
      60,
    );
    if (!allowed) {
      return apiError('TOO_MANY_REQUESTS', 'Previše zahteva. Pokušajte za 60 sekundi.');
    }

    const supabase = getSupabaseServerClient();
    const { data: accounts, error } = await supabase
      .from('novcanik_accounts')
      .select('*')
      .eq('user_id', user.id)
      .eq('enabled', true)
      .order('asset_id');

    if (error) return apiInternalError('novcanik-accounts-list', error);

    // Obogati sa asset metadatama
    const enriched = (accounts ?? []).map((acc) => ({
      ...acc,
      assetMeta: getAsset(acc.asset_id) ?? null,
    }));

    return apiSuccess({
      accounts: enriched,
      ukupno: enriched.length,
      userId: user.id,
    });
  } catch (error) {
    return apiInternalError('novcanik-accounts', error);
  }
}
