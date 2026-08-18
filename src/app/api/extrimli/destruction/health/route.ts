// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI API: /api/extrimli/destruction/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { getExtrimliDestructionHealthReport } from '@/lib/extrimli';
import { setDestructionHeaders } from '../_utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = apiSuccess(getExtrimliDestructionHealthReport(), 200);
    setDestructionHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('extrimli/destruction/health', error);
  }
}
