// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI 3 API: /api/extrimli-3/sports
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { getSportById } from '@/lib/extrimli';
import {
  EXTRIMLI3_CONTRACT_VERSION,
  EXTRIMLI3_MODULE_VERSION,
  listSportRiskProfiles,
} from '@/lib/extrimli-3';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  res.headers.set('X-Extrimli3-Contract-Version', EXTRIMLI3_CONTRACT_VERSION);
  res.headers.set('X-Extrimli3-Module-Version', EXTRIMLI3_MODULE_VERSION);
}

export async function GET() {
  try {
    const profiles = listSportRiskProfiles().map((profile) => ({
      ...profile,
      sport: getSportById(profile.sportId) ?? null,
    }));
    const response = apiSuccess({ profiles, count: profiles.length }, 200);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('extrimli-3/sports', error);
  }
}
