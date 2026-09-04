// SpajaUltraOmegaCore -∞Ω+∞ — Discount Telecom API: /api/discount-telecom/health
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/discount-telecom/health — persona health and coverage stats

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  getDiscountTelecomHealthReport,
  DISCOUNT_TELECOM_CONTRACT_VERSION,
  DISCOUNT_TELECOM_MODULE_VERSION,
} from '@/lib/discount-telecom';

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
 * GET /api/discount-telecom/health
 *
 * Returns DiscountTelecomHealthReport: operator/discount counts, region/network coverage.
 */
export async function GET() {
  try {
    const report = getDiscountTelecomHealthReport();
    return withHeaders(apiSuccess(report, 200));
  } catch (error) {
    return withHeaders(apiInternalError('discount-telecom/health', error));
  }
}
