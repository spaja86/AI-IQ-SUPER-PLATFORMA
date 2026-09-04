// SpajaUltraOmegaCore -∞Ω+∞ — AKTIVITI ALL API: /api/aktiviti-all/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { getAktivitiAllHealthReport, setAktivitiAllHeaders } from '@/lib/aktiviti-all';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getAktivitiAllHealthReport();
    const response = apiSuccess(report, 200);
    setAktivitiAllHeaders(response);
    return response;
  } catch (error) {
    const response = apiInternalError('aktiviti-all/health', error);
    setAktivitiAllHeaders(response);
    return response;
  }
}
