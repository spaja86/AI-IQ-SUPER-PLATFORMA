// SpajaUltraOmegaCore -∞Ω+∞ — Discount Telecom API: /api/discount-telecom/operators
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/discount-telecom/operators?region= — list all active operators

import type { NextRequest } from 'next/server';
import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { listOperators, DISCOUNT_TELECOM_CONTRACT_VERSION, DISCOUNT_TELECOM_MODULE_VERSION } from '@/lib/discount-telecom';
import type { TelecomRegion } from '@/lib/discount-telecom';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  res.headers.set('X-DiscountTelecom-Contract-Version', DISCOUNT_TELECOM_CONTRACT_VERSION);
  res.headers.set('X-DiscountTelecom-Module-Version', DISCOUNT_TELECOM_MODULE_VERSION);
}

/**
 * GET /api/discount-telecom/operators
 *
 * Query params:
 *   - region: TelecomRegion (optional) — filter by region
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const region = searchParams.get('region') as TelecomRegion | null;

    const VALID_REGIONS: TelecomRegion[] = ['EU', 'US', 'APAC', 'LATAM', 'Africa', 'ME'];
    if (region && !VALID_REGIONS.includes(region)) {
      const { apiError } = await import('@/lib/api/response');
      return apiError('BAD_REQUEST', `Invalid region. Must be one of: ${VALID_REGIONS.join(', ')}`, 400);
    }

    const operators = listOperators(region ?? undefined);
    const response = apiSuccess({ operators, count: operators.length }, 200);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('discount-telecom/operators', error);
  }
}
