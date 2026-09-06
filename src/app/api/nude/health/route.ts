// SpajaUltraOmegaCore -∞Ω+∞ — NUDE API: /api/nude/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { getNudeHealthReport, setNudeHeaders } from '@/lib/nude';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getNudeHealthReport();
    const response = apiSuccess(report, 200);
    setNudeHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('nude/health', error);
  }
}
