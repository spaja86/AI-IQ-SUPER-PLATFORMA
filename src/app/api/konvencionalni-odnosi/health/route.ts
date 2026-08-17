// SpajaUltraOmegaCore -∞Ω+∞ — KONVENCIONALNI ODNOSI API: /api/konvencionalni-odnosi/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  getKonvencionalniOdnosiHealthReport,
  setKonvencionalniOdnosiHeaders,
} from '@/lib/konvencionalni-odnosi';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getKonvencionalniOdnosiHealthReport();
    const response = apiSuccess(report, 200);
    setKonvencionalniOdnosiHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('konvencionalni-odnosi/health', error);
  }
}
