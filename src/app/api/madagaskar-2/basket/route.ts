// SpajaUltraOmegaCore -∞Ω+∞ — MADAGASKAR 2 API: /api/madagaskar-2/basket
// Kompanija SPAJA — Digitalna Industrija
//
// POST /api/madagaskar-2/basket — basket procurement

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  calculateBasket,
  MADAGASKAR2_CONTRACT_VERSION,
  MADAGASKAR2_MODULE_VERSION,
} from '@/lib/madagaskar-2';
import type { BasketItem } from '@/lib/madagaskar-2';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  res.headers.set('X-Madagaskar2-Contract-Version', MADAGASKAR2_CONTRACT_VERSION);
  res.headers.set('X-Madagaskar2-Module-Version', MADAGASKAR2_MODULE_VERSION);
}

/**
 * POST /api/madagaskar-2/basket
 *
 * Body: { items: BasketItem[], outputCurrency?: string }
 *
 * Returns: BasketResult
 */
export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return apiError('BAD_REQUEST', 'Request body must be valid JSON.', 400);
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return apiError('BAD_REQUEST', 'Request body must be a JSON object.', 400);
    }

    const { items, outputCurrency } = body as { items?: unknown; outputCurrency?: string };

    if (!Array.isArray(items)) {
      return apiError('BAD_REQUEST', 'items must be an array of BasketItem.', 400);
    }

    const result = calculateBasket(items as BasketItem[], outputCurrency ?? 'EUR');

    const status = result.valid ? 200 : 400;
    const response = result.valid
      ? apiSuccess(result, status)
      : apiError('BAD_REQUEST', result.warnings.join(' '), status);

    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('madagaskar-2/basket', error);
  }
}
