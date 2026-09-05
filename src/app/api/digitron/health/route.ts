// SpajaUltraOmegaCore -∞Ω+∞ — DIGITRON API: /api/digitron/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { getDigitronHealthReport, setDigitronHeaders } from '@/lib/digitron';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getDigitronHealthReport();
    const response = apiSuccess(report, 200);
    setDigitronHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('digitron/health', error);
  }
}
