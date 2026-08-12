// SpajaUltraOmegaCore -∞Ω+∞ — MADAGASKAR 2 API: /api/madagaskar-2/health
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/madagaskar-2/health — v2 catalog and system health report

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  getMadagaskar2HealthReport,
  MADAGASKAR2_CONTRACT_VERSION,
  MADAGASKAR2_MODULE_VERSION,
} from '@/lib/madagaskar-2';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  res.headers.set('X-Madagaskar2-Contract-Version', MADAGASKAR2_CONTRACT_VERSION);
  res.headers.set('X-Madagaskar2-Module-Version', MADAGASKAR2_MODULE_VERSION);
}

/**
 * GET /api/madagaskar-2/health
 *
 * Returns: Madagaskar2HealthReport — good counts, auction stats, FX rate count, traceability count.
 */
export async function GET() {
  try {
    const report = getMadagaskar2HealthReport();
    const response = apiSuccess(report, 200);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('madagaskar-2/health', error);
  }
}
