// SpajaUltraOmegaCore -∞Ω+∞ — DINOSAURUS-Trexar API: /api/dinosaurus-trexar/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { getDinosaurusTrexarHealthReport, setDinosaurusTrexarHeaders } from '@/lib/dinosaurus-trexar';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getDinosaurusTrexarHealthReport();
    const response = apiSuccess(report, 200);
    setDinosaurusTrexarHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('dinosaurus-trexar/health', error);
  }
}
