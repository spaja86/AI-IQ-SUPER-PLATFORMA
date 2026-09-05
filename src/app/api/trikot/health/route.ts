// SpajaUltraOmegaCore -∞Ω+∞ — TRIKOT API: /api/trikot/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { getTrikotHealthReport, setTrikotHeaders } from '@/lib/trikot';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getTrikotHealthReport();
    const response = apiSuccess(report, 200);
    setTrikotHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('trikot/health', error);
  }
}
