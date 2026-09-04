// SpajaUltraOmegaCore -∞Ω+∞ — OPKONGO API: /api/opkongo/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { getOpkongoHealthReport, setOpkongoHeaders } from '@/lib/opkongo';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getOpkongoHealthReport();
    const response = apiSuccess(report, 200);
    setOpkongoHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('opkongo/health', error);
  }
}
