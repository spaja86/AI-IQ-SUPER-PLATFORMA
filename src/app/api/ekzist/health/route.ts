// SpajaUltraOmegaCore -∞Ω+∞ — EKZIST API: /api/ekzist/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { getEkzistHealthReport, setEkzistHeaders } from '@/lib/ekzist';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getEkzistHealthReport();
    const response = apiSuccess(report, 200);
    setEkzistHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('ekzist/health', error);
  }
}
