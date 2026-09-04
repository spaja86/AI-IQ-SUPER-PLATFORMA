// SpajaUltraOmegaCore -∞Ω+∞ — MADAGASKAR 2 API: /api/madagaskar-2/catalog
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/madagaskar-2/catalog — list exotic goods (v2 catalog)

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  listGoodsV2,
  MADAGASKAR2_CONTRACT_VERSION,
  MADAGASKAR2_MODULE_VERSION,
} from '@/lib/madagaskar-2';
import type { ExoticGoodCategory, OriginRegion } from '@/lib/madagaskar-2';

export const dynamic = 'force-dynamic';

const VALID_CATEGORIES: ExoticGoodCategory[] = [
  'spice', 'mineral', 'botanical', 'textile', 'artisan', 'tech-material',
  'fauna-derivative', 'fungal', 'crystal', 'algae',
];

const VALID_REGIONS: OriginRegion[] = [
  'Madagascar', 'Indonesia', 'Amazon', 'Sahel', 'Patagonia', 'Siberia',
  'Oceania', 'Central-Africa', 'Himalaya', 'Arctic',
];

function setHeaders(res: Response): void {
  res.headers.set('X-Madagaskar2-Contract-Version', MADAGASKAR2_CONTRACT_VERSION);
  res.headers.set('X-Madagaskar2-Module-Version', MADAGASKAR2_MODULE_VERSION);
}

/**
 * GET /api/madagaskar-2/catalog
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

    const goods = listGoodsV2({
      category: category ?? undefined,
      region: region ?? undefined,
      rarityMin,
      activeOnly: true,
    });

    const response = apiSuccess({ goods, count: goods.length }, 200);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('madagaskar-2/catalog', error);
  }
}
