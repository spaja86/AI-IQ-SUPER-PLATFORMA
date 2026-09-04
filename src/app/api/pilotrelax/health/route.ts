// SpajaUltraOmegaCore -∞Ω+∞ — PILOTRELAX API: /api/pilotrelax/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { getPilotrelaxHealthReport, setPilotrelaxHeaders } from '@/lib/pilotrelax';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getPilotrelaxHealthReport();
    const response = apiSuccess(report, 200);
    setPilotrelaxHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('pilotrelax/health', error);
  }
}
