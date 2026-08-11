// SpajaUltraOmegaCore -∞Ω+∞ — MADAGASKAR API: /api/madagaskar/health
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/madagaskar/health — catalog health and coverage stats

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  getMadagaskarHealthReport,
  MADAGASKAR_CONTRACT_VERSION,
  MADAGASKAR_MODULE_VERSION,
} from '@/lib/madagaskar';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  res.headers.set('X-Madagaskar-Contract-Version', MADAGASKAR_CONTRACT_VERSION);
  res.headers.set('X-Madagaskar-Module-Version', MADAGASKAR_MODULE_VERSION);
}

/**
 * GET /api/madagaskar/health
 *
 * Returns MadagaskarHealthReport: good counts, category/region breakdown, averages.
 */
export async function GET() {
  try {
    const report = getMadagaskarHealthReport();
    const response = apiSuccess(report, 200);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('madagaskar/health', error);
  }
}
