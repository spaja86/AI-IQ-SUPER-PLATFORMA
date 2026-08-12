// SpajaUltraOmegaCore -∞Ω+∞ — MADAGASKAR 2 API: /api/madagaskar-2/auction
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/madagaskar-2/auction — list auction lots

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  listLots,
  MADAGASKAR2_CONTRACT_VERSION,
  MADAGASKAR2_MODULE_VERSION,
} from '@/lib/madagaskar-2';
import type { AuctionStatus } from '@/lib/madagaskar-2';

export const dynamic = 'force-dynamic';

const VALID_STATUSES: AuctionStatus[] = ['open', 'closed', 'cancelled'];

function setHeaders(res: Response): void {
  res.headers.set('X-Madagaskar2-Contract-Version', MADAGASKAR2_CONTRACT_VERSION);
  res.headers.set('X-Madagaskar2-Module-Version', MADAGASKAR2_MODULE_VERSION);
}

/**
 * GET /api/madagaskar-2/auction
 *
 * Query params:
 *   - status: 'open' | 'closed' | 'cancelled' (optional, returns all if omitted)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const statusRaw = searchParams.get('status') as AuctionStatus | null;

    if (statusRaw && !VALID_STATUSES.includes(statusRaw)) {
      return apiError('BAD_REQUEST', `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`, 400);
    }

    const lots = listLots(statusRaw ?? undefined);
    const response = apiSuccess({ lots, count: lots.length }, 200);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('madagaskar-2/auction', error);
  }
}
