// SpajaUltraOmegaCore -∞Ω+∞ — PARAKSIL API: /api/paraksil/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  getParaksilHealthReport,
  setParaksilHeaders,
} from '@/lib/paraksil';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getParaksilHealthReport();
    const response = apiSuccess(report, 200);
    setParaksilHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('paraksil/health', error);
  }
}
