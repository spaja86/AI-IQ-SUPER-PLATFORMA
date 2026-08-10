// SpajaUltraOmegaCore -∞Ω+∞ — Discount Telecom API: /api/discount-telecom/discounts
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/discount-telecom/discounts?operator=&region= — query available discounts

import type { NextRequest } from 'next/server';
import { apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  listDiscounts,
  DISCOUNT_TELECOM_CONTRACT_VERSION,
  DISCOUNT_TELECOM_MODULE_VERSION,
} from '@/lib/discount-telecom';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  res.headers.set('X-DiscountTelecom-Contract-Version', DISCOUNT_TELECOM_CONTRACT_VERSION);
  res.headers.set('X-DiscountTelecom-Module-Version', DISCOUNT_TELECOM_MODULE_VERSION);
}

/**
 * GET /api/discount-telecom/discounts
 *
 * Query params:
 *   - operator: operatorId (optional)
 *   - region: TelecomRegion (optional, informational — filtering is by operatorId)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const operatorId = searchParams.get('operator') ?? undefined;
    const region = searchParams.get('region') ?? undefined;

    const discounts = listDiscounts(operatorId, region);
    const response = apiSuccess({ discounts, count: discounts.length }, 200);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('discount-telecom/discounts', error);
  }
}
