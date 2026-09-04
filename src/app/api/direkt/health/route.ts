// SpajaUltraOmegaCore -∞Ω+∞ — DIREKT API: /api/direkt/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  getDirektHealthReport,
  setDirektHeaders,
} from '@/lib/direkt';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = apiSuccess(getDirektHealthReport(), 200);
    setDirektHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('direkt/health', error);
  }
}
