// SpajaUltraOmegaCore -∞Ω+∞ — DRESING API: /api/dresing/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { getDresingHealthReport, setDresingHeaders } from '@/lib/dresing';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getDresingHealthReport();
    const response = apiSuccess(report, 200);
    setDresingHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('dresing/health', error);
  }
}
