// SpajaUltraOmegaCore -∞Ω+∞ — KULKON API: /api/kulkon/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { getKulkonHealthReport, setKulkonHeaders } from '@/lib/kulkon';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getKulkonHealthReport();
    const response = apiSuccess(report, 200);
    setKulkonHeaders(response);
    return response;
  } catch (error) {
    const response = apiInternalError('kulkon/health', error);
    setKulkonHeaders(response);
    return response;
  }
}
