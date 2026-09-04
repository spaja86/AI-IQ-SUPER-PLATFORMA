// SpajaUltraOmegaCore -∞Ω+∞ — TAJMING API: /api/tajming/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { getTajmingHealthReport, setTajmingHeaders } from '@/lib/tajming';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getTajmingHealthReport();
    const response = apiSuccess(report, 200);
    setTajmingHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('tajming/health', error);
  }
}
