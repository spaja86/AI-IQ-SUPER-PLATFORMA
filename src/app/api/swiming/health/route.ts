// SpajaUltraOmegaCore -∞Ω+∞ — SWIMING API: /api/swiming/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { getSwimingHealthReport, setSwimingHeaders } from '@/lib/swiming';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getSwimingHealthReport();
    const response = apiSuccess(report, 200);
    setSwimingHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('swiming/health', error);
  }
}
