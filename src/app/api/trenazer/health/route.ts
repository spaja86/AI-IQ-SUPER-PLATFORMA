// SpajaUltraOmegaCore -∞Ω+∞ — TRENAZER API: /api/trenazer/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  getTrenazerHealthReport,
  setTrenazerHeaders,
} from '@/lib/trenazer';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getTrenazerHealthReport();
    const response = apiSuccess(report, 200);
    setTrenazerHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('trenazer/health', error);
  }
}
