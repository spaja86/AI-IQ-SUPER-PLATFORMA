// SpajaUltraOmegaCore -∞Ω+∞ — ADUTIV API: /api/adutiv/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { getAdutivHealthReport, setAdutivHeaders } from '@/lib/adutiv';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getAdutivHealthReport();
    const response = apiSuccess(report, 200);
    setAdutivHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('adutiv/health', error);
  }
}
