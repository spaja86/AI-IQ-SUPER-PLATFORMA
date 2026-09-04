// SpajaUltraOmegaCore -∞Ω+∞ — MADAGASKAR API: /api/madagaskar/catalog
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/madagaskar/catalog — list exotic goods with optional filters

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  listGoods,
  MADAGASKAR_CONTRACT_VERSION,
  MADAGASKAR_MODULE_VERSION,
} from '@/lib/madagaskar';
import type { ExoticGoodCategory, GoodFilter, OriginRegion } from '@/lib/madagaskar';

export const dynamic = 'force-dynamic';

const VALID_CATEGORIES: ExoticGoodCategory[] = [
  'spice', 'mineral', 'botanical', 'textile', 'artisan', 'tech-material', 'fauna-derivative',
];

const VALID_REGIONS: OriginRegion[] = [
  'Madagascar', 'Indonesia', 'Amazon', 'Sahel', 'Patagonia', 'Siberia', 'Oceania',
];

function setHeaders(res: Response): void {
  res.headers.set('X-Madagaskar-Contract-Version', MADAGASKAR_CONTRACT_VERSION);
  res.headers.set('X-Madagaskar-Module-Version', MADAGASKAR_MODULE_VERSION);
}

/**
 * GET /api/madagaskar/catalog
 *
 * Query params:
 *   - category: ExoticGoodCategory (optional)
 *   - region: OriginRegion (optional)
 *   - rarity_min: number 1–10 (optional)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const category = searchParams.get('category') as ExoticGoodCategory | null;
    const region = searchParams.get('region') as OriginRegion | null;
    const rarityMinRaw = searchParams.get('rarity_min');

    if (category && !VALID_CATEGORIES.includes(category)) {
      return apiError('BAD_REQUEST', `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`, 400);
    }

    if (region && !VALID_REGIONS.includes(region)) {
      return apiError('BAD_REQUEST', `Invalid region. Must be one of: ${VALID_REGIONS.join(', ')}`, 400);
    }

    let rarityMin: number | undefined;
    if (rarityMinRaw !== null) {
      rarityMin = Number(rarityMinRaw);
      if (!Number.isFinite(rarityMin) || rarityMin < 1 || rarityMin > 10) {
        return apiError('BAD_REQUEST', 'rarity_min must be a number between 1 and 10.', 400);
      }
    }

    const filter: GoodFilter = {
      category: category ?? undefined,
      region: region ?? undefined,
      rarityMin,
      activeOnly: true,
    };

    const goods = listGoods(filter);
    const response = apiSuccess({ goods, count: goods.length }, 200);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('madagaskar/catalog', error);
  }
}
