// SpajaUltraOmegaCore -∞Ω+∞ — MRKLI MRAK API: /api/mrkli-mrak/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { getMrkliMrakHealthReport, setMrkliMrakHeaders } from '@/lib/mrkli-mrak';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getMrkliMrakHealthReport();
    const response = apiSuccess(report, 200);
    setMrkliMrakHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('mrkli-mrak/health', error);
  }
}
