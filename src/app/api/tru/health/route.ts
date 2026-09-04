// SpajaUltraOmegaCore -∞Ω+∞ — TRU API: /api/tru/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { getTruHealthReport, setTruHeaders } from '@/lib/tru';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getTruHealthReport();
    const response = apiSuccess(report, 200);
    setTruHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('tru/health', error);
  }
}
