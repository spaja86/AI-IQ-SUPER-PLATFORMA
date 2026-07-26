// SpajaUltraOmegaCore -∞Ω+∞ — SPAJA BTC Metadata API
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/menjacnica/spaja-btc
// Javno dostupno (read-only market info).

import { type NextRequest } from 'next/server';
import { apiSuccess, apiError, apiInternalError } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { getSpajaAsset } from '@/lib/menjacnica/assets';
import { getSpajaPairs } from '@/lib/menjacnica/pairs';
import { getAllTickers } from '@/lib/menjacnica/simulator';
import { isExchangeFlagEnabled } from '@/lib/menjacnica/feature-flags';
import { RISK_LIMITS } from '@/lib/menjacnica/risk';

export async function GET(request: NextRequest) {
  try {
    if (!isExchangeFlagEnabled('spaja-btc')) {
      return apiError('SERVICE_UNAVAILABLE', 'SPAJA BTC modul je trenutno nedostupan.');
    }

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/menjacnica/spaja-btc'),
      60,
      60,
    );
    if (!allowed) {
      return apiError('TOO_MANY_REQUESTS', 'Previše zahteva. Pokušajte za 60 sekundi.');
    }

    const asset = getSpajaAsset();
    const pairs = getSpajaPairs();
    const allTickers = getAllTickers();
    const spajaTickers = allTickers.filter((t) => t.pairId.startsWith('SPAJA'));

    return apiSuccess({
      asset: {
        id: asset.id,
        naziv: asset.naziv,
        tip: asset.tip,
        decimals: asset.decimals,
        mreza: asset.mreza,
        minOrderQty: asset.minOrderQty,
        enabled: asset.enabled,
      },
      parovi: pairs.map((p) => ({
        id: p.id,
        baseAssetId: p.baseAssetId,
        quoteAssetId: p.quoteAssetId,
        minQty: p.minQty,
        maxQty: p.maxQty,
        takerFeePct: p.takerFeePct,
        makerFeePct: p.makerFeePct,
        simulationOnly: p.simulationOnly,
      })),
      tickers: spajaTickers,
      riskInfo: {
        napomena: 'SPAJA BTC je ekskluzivna kripto valuta Kompanije SPAJA. Cijena je 10× iznad BTC-a. Trgujte odgovorno.',
        maxOrderValueUsd: RISK_LIMITS.maxOrderValueUsd,
        reviewThreshold: RISK_LIMITS.reviewThreshold,
        blockThreshold: RISK_LIMITS.blockThreshold,
      },
      specifikacija: {
        opis: 'SPAJA Bitkoin (SPAJA) je ekskluzivna kripto valuta platforme AI IQ SUPER PLATFORMA. Vrednost SPAJA = 10 × vrednost BTC. Pokrenuta na Polygon mreži.',
        mreza: 'Polygon (MATIC)',
        decimals: asset.decimals,
        isSpajaBtc: true,
        simulationMode: true,
        faza: 'M4 — Kontrolisana dostupnost',
      },
    });
  } catch (error) {
    return apiInternalError('menjacnica-spaja-btc', error);
  }
}
