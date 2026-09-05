// SpajaUltraOmegaCore -∞Ω+∞ — PROSPARITET API: /api/prosparitet/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { getProsparitetHealthReport, setProsparitetHeaders } from '@/lib/prosparitet';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getProsparitetHealthReport();
    const response = apiSuccess(report, 200);
    setProsparitetHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('prosparitet/health', error);
  }
}
