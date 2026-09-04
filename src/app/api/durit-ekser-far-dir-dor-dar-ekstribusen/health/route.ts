// SpajaUltraOmegaCore -∞Ω+∞ — DURIT EKSER FAR DIR DOR DAR EKSTRIBUŠEN API: /api/durit-ekser-far-dir-dor-dar-ekstribusen/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  getDuritEkserFarDirDorDarEkstribusenHealthReport,
  setDuritEkstribusenHeaders,
} from '@/lib/durit-ekser-far-dir-dor-dar-ekstribusen';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = apiSuccess(getDuritEkserFarDirDorDarEkstribusenHealthReport(), 200);
    setDuritEkstribusenHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('durit-ekser-far-dir-dor-dar-ekstribusen/health', error);
  }
}
