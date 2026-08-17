// SpajaUltraOmegaCore -∞Ω+∞ — KONVENKCIONALNI ODNOSI API: GET /api/konvenkcionalni-odnosi/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { getKoHealthReport, setKoHeaders } from '@/lib/konvenkcionalni-odnosi';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getKoHealthReport();
    const response = apiSuccess(report, 200);
    setKoHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('konvenkcionalni-odnosi/health', error);
  }
}
