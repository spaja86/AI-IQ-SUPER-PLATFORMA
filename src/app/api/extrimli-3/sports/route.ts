// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI 3 API: /api/extrimli-3/sports
// Kompanija SPAJA — Digitalna Industrija

import { apiSuccess } from '@/lib/api/response';
import { getSportById } from '@/lib/extrimli';
import {
  EXTRIMLI3_CONTRACT_VERSION,
  EXTRIMLI3_MODULE_VERSION,
  listSportRiskProfiles,
} from '@/lib/extrimli-3';
import { apiExtrimliDegradedResponse, setExtrimliSurfaceHeaders } from '@/app/api/extrimli/_shared';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  setExtrimliSurfaceHeaders(res, {
    surface: 'extrimli-3',
    contractVersion: EXTRIMLI3_CONTRACT_VERSION,
    moduleVersion: EXTRIMLI3_MODULE_VERSION,
  });
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
    return apiExtrimliDegradedResponse('extrimli-3/sports', {
      surface: 'extrimli-3',
      contractVersion: EXTRIMLI3_CONTRACT_VERSION,
      moduleVersion: EXTRIMLI3_MODULE_VERSION,
      degradedSources: ['sports-profiles-v3'],
      error,
    });
  }
}
