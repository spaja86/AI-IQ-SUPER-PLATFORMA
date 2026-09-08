// SpajaUltraOmegaCore -∞Ω+∞ — GEOGRAFIJA REALNA API: /api/geografija-realna/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  getGeografijaRealnaHealthReport,
  setGeografijaRealnaHeaders,
} from '@/lib/geografija-realna';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getGeografijaRealnaHealthReport();
    const response = apiSuccess(report, 200);
    setGeografijaRealnaHeaders(response);
    return response;
  } catch (error) {
    const response = apiInternalError('geografija-realna/health', error);
    setGeografijaRealnaHeaders(response);
    return response;
  }
}
