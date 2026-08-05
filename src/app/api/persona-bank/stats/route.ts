import type { NextRequest } from 'next/server';
import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { getPersonaBankStats, PERSONA_BANK_CONTRACT_VERSION } from '@/lib/persona-bank';

export const dynamic = 'force-dynamic';

/**
 * GET /api/persona-bank/stats
 *
 * Returns aggregate statistics about the persona bank:
 * total count, by status, by type, by octave, by agent,
 * stale count, octave coverage.
 */
export async function GET(_req: NextRequest) {
  try {
    const stats = getPersonaBankStats();
    const response = apiSuccess(stats, 200);
    response.headers.set('X-PersonaBank-Contract-Version', PERSONA_BANK_CONTRACT_VERSION);
    return response;
  } catch (error) {
    return apiInternalError('persona-bank-stats', error);
  }
}
