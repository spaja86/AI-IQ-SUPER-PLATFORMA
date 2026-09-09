// SpajaUltraOmegaCore -∞Ω+∞ — TACSKRIN API: /api/tacskrin/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { getTacskrinHealthReport, setTacskrinHeaders } from '@/lib/tacskrin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getTacskrinHealthReport();
    const response = apiSuccess(report, 200);
    setTacskrinHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('tacskrin/health', error);
  }
}
