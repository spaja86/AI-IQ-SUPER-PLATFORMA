// SpajaUltraOmegaCore -∞Ω+∞ — EKVIVALENT NETWORK API: /api/ekvivalent-network/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { getEkvivalentHealthReport, setEkvivalentHeaders } from '@/lib/ekvivalent-network';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getEkvivalentHealthReport();
    const response = apiSuccess(report, 200);
    setEkvivalentHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('ekvivalent-network/health', error);
  }
}
