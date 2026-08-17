// SpajaUltraOmegaCore -∞Ω+∞ — ZLATNI RAČUNI API: /api/zlatni-racuni/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { getZlatniHealthReport, setZlatniHeaders } from '@/lib/zlatni-racuni';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getZlatniHealthReport();
    const response = apiSuccess(report, 200);
    setZlatniHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('zlatni-racuni/health', error);
  }
}
