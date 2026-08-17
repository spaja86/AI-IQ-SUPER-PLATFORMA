// SpajaUltraOmegaCore -∞Ω+∞ — REKLAMITIN API: /api/reklamitin/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { getReklamitiнHealthReport, setReklamitiнHeaders } from '@/lib/reklamitin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getReklamitiнHealthReport();
    const response = apiSuccess(report, 200);
    setReklamitiнHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('reklamitin/health', error);
  }
}
