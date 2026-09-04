// SpajaUltraOmegaCore -∞Ω+∞ — Discount Telecom API: /api/discount-telecom/operators
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/discount-telecom/operators?region= — list all active operators

import type { NextRequest } from 'next/server';
import { apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  listOperators,
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
 * GET /api/discount-telecom/operators
 *
 * Query params:
 *   - region: TelecomRegion (optional) — filter by region
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const region = searchParams.get('region') as TelecomRegion | null;

    if (region && !isValidTelecomRegion(region)) {
      const { apiError } = await import('@/lib/api/response');
      return withHeaders(apiError(
        'BAD_REQUEST',
        `Invalid region. Must be one of: ${DISCOUNT_TELECOM_REGIONS.join(', ')}`,
        400
      ));
    }

    const operators = listOperators(region ?? undefined);
    return withHeaders(apiSuccess({ operators, count: operators.length }, 200));
  } catch (error) {
    return withHeaders(apiInternalError('discount-telecom/operators', error));
  }
}
