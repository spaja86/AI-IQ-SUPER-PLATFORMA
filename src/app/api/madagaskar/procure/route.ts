// SpajaUltraOmegaCore -∞Ω+∞ — MADAGASKAR API: /api/madagaskar/procure
// Kompanija SPAJA — Digitalna Industrija
//
// POST /api/madagaskar/procure — calculate procurement cost for a given good and quantity

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  calculateProcurement,
  MADAGASKAR_CONTRACT_VERSION,
  MADAGASKAR_MODULE_VERSION,
} from '@/lib/madagaskar';
import type { ProcurementRequest } from '@/lib/madagaskar';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  res.headers.set('X-Madagaskar-Contract-Version', MADAGASKAR_CONTRACT_VERSION);
  res.headers.set('X-Madagaskar-Module-Version', MADAGASKAR_MODULE_VERSION);
}

/**
 * POST /api/madagaskar/procure
 *
 * Body: ProcurementRequest JSON
 *   { goodId, quantityUnits, buyerSegment, currency, referenceDate? }
 *
 * Returns: ProcurementResult
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

    const input = body as ProcurementRequest;
    const result = calculateProcurement(input);

    const status = result.valid ? 200 : 400;
    const response = result.valid
      ? apiSuccess(result, status)
      : apiError('BAD_REQUEST', result.warnings.join(' '), status);

    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('madagaskar/procure', error);
  }
}
