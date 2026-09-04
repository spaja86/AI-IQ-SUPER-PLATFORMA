// SpajaUltraOmegaCore -∞Ω+∞ — ÐUMBIR API: /api/dumbir/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { getDumbirHealthReport, setDumbirHeaders } from '@/lib/dumbir';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getDumbirHealthReport();
    const response = apiSuccess(report, 200);
    setDumbirHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('dumbir/health', error);
  }
}
