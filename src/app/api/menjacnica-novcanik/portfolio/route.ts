// SpajaUltraOmegaCore -∞Ω+∞ — Profesionalni Novčanik — Portfolio + P&L
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/menjacnica-novcanik/portfolio
// Zahteva autentikaciju.
// Vraća portfolio ekspoziciju i P&L za autentikovanog korisnika.

import { type NextRequest } from 'next/server';
import { apiSuccess, apiError, apiInternalError } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { verifyUserFromToken, getSupabaseServerClientSafe } from '@/lib/supabase/server';
import { isExchangeFlagEnabled } from '@/lib/menjacnica/feature-flags';
import {
  buildSimulatedPortfolioSummary,
  buildPortfolioSummaryFromRecords,
} from '@/lib/menjacnica/pro-novcanik';

export async function GET(request: NextRequest) {
  try {
    if (!isExchangeFlagEnabled('pro-novcanik-portfolio')) {
      return apiError('SERVICE_UNAVAILABLE', 'Portfolio modul je trenutno nedostupan.');
    }

    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) return apiError('UNAUTHORIZED', 'Niste prijavljeni.');

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/menjacnica-novcanik/portfolio'),
      30,
      60,
    );
    if (!allowed) {
      return apiError('TOO_MANY_REQUESTS', 'Previše zahteva. Pokušajte za 60 sekundi.');
    }

    const supabase = getSupabaseServerClientSafe();
    if (!supabase) {
      const portfolio = buildSimulatedPortfolioSummary(user.id);
      return apiSuccess({ portfolio, simulationFallback: true });
    }

    const [{ data: accounts, error: accountsError }, { data: trades, error: tradesError }] = await Promise.all([
      supabase
        .from('novcanik_accounts')
        .select('*')
        .eq('user_id', user.id)
        .eq('enabled', true)
        .order('asset_id'),
      supabase
        .from('exchange_trades')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(5000),
    ]);

    if (accountsError) return apiInternalError('menjacnica-novcanik-portfolio-accounts', accountsError);
    if (tradesError) return apiInternalError('menjacnica-novcanik-portfolio-trades', tradesError);

    const portfolio = buildPortfolioSummaryFromRecords(user.id, accounts ?? [], trades ?? []);

    return apiSuccess({
      portfolio,
      filters: {
        assets: portfolio.positions.map((position) => position.assetId),
      },
    });
  } catch (error) {
    return apiInternalError('menjacnica-novcanik-portfolio', error);
  }
}
