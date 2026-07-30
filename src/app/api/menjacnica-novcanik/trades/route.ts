// SpajaUltraOmegaCore -∞Ω+∞ — Profesionalni Novčanik — Recent Trades Feed
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/menjacnica-novcanik/trades?pairId=BTC_USDT&limit=20&offset=0
// Zahteva autentikaciju.
// Vraća realni ili simulovani feed trade-ova za dati par.

import { type NextRequest } from 'next/server';
import { apiSuccess, apiError, apiInternalError } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { verifyUserFromToken, getSupabaseServerClientSafe } from '@/lib/supabase/server';
import { isExchangeFlagEnabled } from '@/lib/menjacnica/feature-flags';
import { getMarketPair } from '@/lib/menjacnica/pairs';
import { buildSimulatedTrades, buildTradeFeedFromRecords } from '@/lib/menjacnica/pro-novcanik';

export async function GET(request: NextRequest) {
  try {
    if (!isExchangeFlagEnabled('pro-novcanik-trades')) {
      return apiError('SERVICE_UNAVAILABLE', 'Trade feed je trenutno nedostupan.');
    }

    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) return apiError('UNAUTHORIZED', 'Niste prijavljeni.');

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/menjacnica-novcanik/trades'),
      60,
      60,
    );
    if (!allowed) {
      return apiError('TOO_MANY_REQUESTS', 'Previše zahteva. Pokušajte za 60 sekundi.');
    }

    const url = new URL(request.url);
    const pairId = url.searchParams.get('pairId')?.toUpperCase();
    const countParam = url.searchParams.get('count') ?? url.searchParams.get('limit');
    const limit = countParam ? Math.min(Math.max(parseInt(countParam, 10), 1), 100) : 20;
    const offset = Math.max(parseInt(url.searchParams.get('offset') ?? '0', 10), 0);
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');

    if (!pairId) {
      return apiError('BAD_REQUEST', 'Parametar pairId je obavezan (npr. ?pairId=BTC_USDT).');
    }

    const pair = getMarketPair(pairId);
    if (!pair || !pair.enabled) {
      return apiError('NOT_FOUND', `Par '${pairId}' nije aktivan.`);
    }

    const supabase = getSupabaseServerClientSafe();
    if (!supabase) {
      const trades = buildSimulatedTrades(pairId, limit);
      return apiSuccess({
        pairId,
        trades,
        count: trades.length,
        total: trades.length,
        limit,
        offset,
        simulationMode: true,
      });
    }

    let query = supabase
      .from('exchange_trades')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .eq('pair_id', pairId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (from) query = query.gte('created_at', from);
    if (to) query = query.lte('created_at', to);

    const { data, error, count } = await query;
    if (error) return apiInternalError('menjacnica-novcanik-trades-query', error);

    const trades = buildTradeFeedFromRecords(data ?? []);

    return apiSuccess({
      pairId,
      trades,
      count: trades.length,
      total: count ?? trades.length,
      limit,
      offset,
      filters: { from, to },
      simulationMode: false,
    });
  } catch (error) {
    return apiInternalError('menjacnica-novcanik-trades', error);
  }
}
