// SpajaUltraOmegaCore -∞Ω+∞ — Novčanik Ledger API
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/novcanik/ledger            — sve stavke korisnika
// GET /api/novcanik/ledger?assetId=BTC
// GET /api/novcanik/ledger?entryType=deposit

import { type NextRequest } from 'next/server';
import { apiSuccess, apiError, apiInternalError } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { verifyUserFromToken, getSupabaseServerClient } from '@/lib/supabase/server';
import { isExchangeFlagEnabled } from '@/lib/menjacnica/feature-flags';

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
      rateLimitKey(ip, '/api/novcanik/ledger'),
      60,
      60,
    );
    if (!allowed) {
      return apiError('TOO_MANY_REQUESTS', 'Previše zahteva. Pokušajte za 60 sekundi.');
    }

    const url = new URL(request.url);
    const assetId = url.searchParams.get('assetId')?.toUpperCase();
    const entryType = url.searchParams.get('entryType');
    const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '100'), 200);
    const offset = parseInt(url.searchParams.get('offset') ?? '0');

    const supabase = getSupabaseServerClient();
    let query = supabase
      .from('novcanik_ledger')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (assetId) query = query.eq('asset_id', assetId);
    if (entryType) query = query.eq('entry_type', entryType as 'deposit' | 'withdrawal' | 'trade_debit' | 'trade_credit' | 'fee' | 'transfer_out' | 'transfer_in' | 'adjustment');

    const { data, error, count } = await query;
    if (error) return apiInternalError('novcanik-ledger', error);

    return apiSuccess({
      stavke: data ?? [],
      ukupno: count ?? 0,
      limit,
      offset,
    });
  } catch (error) {
    return apiInternalError('novcanik-ledger', error);
  }
}
