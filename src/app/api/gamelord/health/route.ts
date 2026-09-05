// SpajaUltraOmegaCore -∞Ω+∞ — GAMELORD API: /api/gamelord/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { getGamelordHealthReport, setGamelordHeaders } from '@/lib/gamelord';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = apiSuccess(getGamelordHealthReport(), 200);
    setGamelordHeaders(response);
    return response;
  } catch (error) {
    const response = apiInternalError('gamelord/health', error);
    setGamelordHeaders(response);
    return response;
  }
}
