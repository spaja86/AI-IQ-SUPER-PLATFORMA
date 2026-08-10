// SpajaUltraOmegaCore -∞Ω+∞ — Discount Telecom API: /api/discount-telecom/calculate
// Kompanija SPAJA — Digitalna Industrija
//
// POST /api/discount-telecom/calculate — calculate net price for user + operator + plan

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  calculateDiscount,
  DISCOUNT_TELECOM_CONTRACT_VERSION,
  DISCOUNT_TELECOM_MODULE_VERSION,
} from '@/lib/discount-telecom';
import type { DiscountCalculationInput } from '@/lib/discount-telecom';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  res.headers.set('X-DiscountTelecom-Contract-Version', DISCOUNT_TELECOM_CONTRACT_VERSION);
  res.headers.set('X-DiscountTelecom-Module-Version', DISCOUNT_TELECOM_MODULE_VERSION);
}

/**
 * POST /api/discount-telecom/calculate
 *
 * Body: DiscountCalculationInput
 * {
 *   operatorId: string,
 *   basePriceCents: number,
 *   currency: string,
 *   networkType: '2G'|'3G'|'4G'|'5G',
 *   userSegment: 'consumer'|'business'|'student'|'senior'|'all',
 *   referenceDate?: string (ISO 8601)
 * }
 */
export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return apiError('BAD_REQUEST', 'Invalid JSON body', 400);
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return apiError('BAD_REQUEST', 'Body must be a JSON object', 400);
    }

    const {
      operatorId,
      basePriceCents,
      currency,
      networkType,
      userSegment,
      referenceDate,
    } = body as Record<string, unknown>;

    if (typeof operatorId !== 'string' || !operatorId) {
      return apiError('BAD_REQUEST', 'operatorId is required (string)', 400);
    }
    if (typeof basePriceCents !== 'number') {
      return apiError('BAD_REQUEST', 'basePriceCents is required (number)', 400);
    }
    if (typeof currency !== 'string' || !currency) {
      return apiError('BAD_REQUEST', 'currency is required (string)', 400);
    }
    if (typeof networkType !== 'string' || !['2G', '3G', '4G', '5G'].includes(networkType)) {
      return apiError('BAD_REQUEST', 'networkType must be one of: 2G, 3G, 4G, 5G', 400);
    }
    if (
      typeof userSegment !== 'string' ||
      !['consumer', 'business', 'student', 'senior', 'all'].includes(userSegment)
    ) {
      return apiError('BAD_REQUEST', 'userSegment must be one of: consumer, business, student, senior, all', 400);
    }

    const input: DiscountCalculationInput = {
      operatorId,
      basePriceCents,
      currency,
      networkType: networkType as DiscountCalculationInput['networkType'],
      userSegment: userSegment as DiscountCalculationInput['userSegment'],
      referenceDate: typeof referenceDate === 'string' ? referenceDate : undefined,
    };

    const result = calculateDiscount(input);
    const statusCode = result.valid ? 200 : 422;
    const response = apiSuccess(result, statusCode);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('discount-telecom/calculate', error);
  }
}
