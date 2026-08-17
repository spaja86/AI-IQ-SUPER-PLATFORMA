// SpajaUltraOmegaCore -∞Ω+∞ — DIJAGNOZA API: /api/dijagnoza/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { getDijagnozaHealthReport, setDijagnozaHeaders } from '@/lib/dijagnoza';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getDijagnozaHealthReport();
    const response = apiSuccess(report, 200);
    setDijagnozaHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('dijagnoza/health', error);
  }
}
