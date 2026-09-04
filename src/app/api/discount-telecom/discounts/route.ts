// SpajaUltraOmegaCore -∞Ω+∞ — Discount Telecom API: /api/discount-telecom/discounts
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/discount-telecom/discounts?operator=&region= — query available discounts

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  listDiscounts,
  isValidTelecomRegion,
  DISCOUNT_TELECOM_CONTRACT_VERSION,
  DISCOUNT_TELECOM_MODULE_VERSION,
  DISCOUNT_TELECOM_REGIONS,
} from '@/lib/discount-telecom';
import type { TelecomRegion } from '@/lib/discount-telecom';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  res.headers.set('X-DiscountTelecom-Contract-Version', DISCOUNT_TELECOM_CONTRACT_VERSION);
  res.headers.set('X-DiscountTelecom-Module-Version', DISCOUNT_TELECOM_MODULE_VERSION);
}

function withHeaders(res: Response): Response {
  setHeaders(res);
  return res;
}

/**
 * GET /api/discount-telecom/discounts
 *
 * Query params:
 *   - operator: operatorId (optional)
 *   - region: TelecomRegion (optional) — filter by operator region
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const operatorId = searchParams.get('operator') ?? undefined;
    const regionParam = searchParams.get('region');
    const region = regionParam ? (regionParam as TelecomRegion) : undefined;

    if (regionParam && !isValidTelecomRegion(regionParam)) {
      return withHeaders(apiError(
        'BAD_REQUEST',
        `Invalid region. Must be one of: ${DISCOUNT_TELECOM_REGIONS.join(', ')}`,
        400
      ));
    }

    const discounts = listDiscounts(operatorId, region);
    return withHeaders(apiSuccess({ discounts, count: discounts.length }, 200));
  } catch (error) {
    return withHeaders(apiInternalError('discount-telecom/discounts', error));
  }
}
