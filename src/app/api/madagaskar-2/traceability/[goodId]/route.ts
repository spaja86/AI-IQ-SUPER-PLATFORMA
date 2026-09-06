// SpajaUltraOmegaCore -∞Ω+∞ — MADAGASKAR 2 API: /api/madagaskar-2/traceability/[goodId]
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/madagaskar-2/traceability/[goodId] — get traceability record for a good

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  getTrace,
  MADAGASKAR2_CONTRACT_VERSION,
  MADAGASKAR2_MODULE_VERSION,
} from '@/lib/madagaskar-2';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  res.headers.set('X-Madagaskar2-Contract-Version', MADAGASKAR2_CONTRACT_VERSION);
  res.headers.set('X-Madagaskar2-Module-Version', MADAGASKAR2_MODULE_VERSION);
}

/**
 * GET /api/madagaskar-2/traceability/[goodId]
 *
 * Returns: TraceabilityRecord for the given goodId, or 404 if not found.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ goodId: string }> },
) {
  try {
    const { goodId } = await params;

    if (!goodId || goodId.trim() === '') {
      return apiError('BAD_REQUEST', 'goodId path parameter is required.', 400);
    }

    const record = getTrace(goodId);
    if (!record) {
      return apiError('NOT_FOUND', `No traceability record found for good '${goodId}'.`, 404);
    }

    const response = apiSuccess(record, 200);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('madagaskar-2/traceability', error);
  }
}
