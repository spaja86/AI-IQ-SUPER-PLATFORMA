// SpajaUltraOmegaCore -∞Ω+∞ — DELET API: /api/delet/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { getDeletHealthReport, setDeletHeaders } from '@/lib/delet';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getDeletHealthReport();
    const response = apiSuccess(report, 200);
    setDeletHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('delet/health', error);
  }
}
