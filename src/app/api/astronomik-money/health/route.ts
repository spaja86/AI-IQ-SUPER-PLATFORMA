// SpajaUltraOmegaCore -∞Ω+∞ — ASTRONOMIK MONEY API: /api/astronomik-money/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { getAstronomikHealthReport, setAstronomikHeaders } from '@/lib/astronomik-money';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getAstronomikHealthReport();
    const response = apiSuccess(report, 200);
    setAstronomikHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('astronomik-money/health', error);
  }
}
