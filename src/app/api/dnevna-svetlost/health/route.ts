// SpajaUltraOmegaCore -∞Ω+∞ — DNEVNA SVETLOST API: /api/dnevna-svetlost/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { getDnevnaSvetlostHealthReport, setDnevnaSvetlostHeaders } from '@/lib/dnevna-svetlost';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getDnevnaSvetlostHealthReport();
    const response = apiSuccess(report, 200);
    setDnevnaSvetlostHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('dnevna-svetlost/health', error);
  }
}
