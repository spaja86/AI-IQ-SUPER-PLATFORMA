// SpajaUltraOmegaCore -∞Ω+∞ — EPEKM-D API: GET /api/epekm-denter/health
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { buildHealthReport, EPEKM_CONTRACT_VERSION } from '@/lib/epekm-denter';

export const dynamic = 'force-dynamic';

/**
 * GET /api/epekm-denter/health
 *
 * Returns the health status of the EPEKM-D module.
 */
export async function GET(_req: NextRequest) {
  try {
    const report = buildHealthReport();
    const response = apiSuccess(report, 200);
    response.headers.set('X-Epekm-Contract-Version', EPEKM_CONTRACT_VERSION);
    return response;
  } catch (error) {
    return apiInternalError('epekm-denter/health', error);
  }
}
