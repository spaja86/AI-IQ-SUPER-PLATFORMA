// SpajaUltraOmegaCore -∞Ω+∞ — DUET API: /api/duet/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { getDuetHealthReport, setDuetHeaders } from '@/lib/duet';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getDuetHealthReport();
    const response = apiSuccess(report, 200);
    setDuetHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('duet/health', error);
  }
}
