// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI API: /api/extrimli/risk
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiSuccess } from '@/lib/api/response';
import { calculateRisk, EXTRIMLI_CONTRACT_VERSION, EXTRIMLI_MODULE_VERSION } from '@/lib/extrimli';
import type { RiskInput } from '@/lib/extrimli';
import { apiExtrimliDegradedResponse, setExtrimliSurfaceHeaders } from '@/app/api/extrimli/_shared';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  setExtrimliSurfaceHeaders(res, {
    surface: 'extrimli',
    contractVersion: EXTRIMLI_CONTRACT_VERSION,
    moduleVersion: EXTRIMLI_MODULE_VERSION,
  });
}

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return apiError('BAD_REQUEST', 'Invalid JSON body', 400);
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return apiError('BAD_REQUEST', 'Body must be a JSON object', 400);
    }

    const b = body as Record<string, unknown>;
    const required = ['sportId', 'athleteExperience', 'weatherScore', 'terrainDifficulty', 'gearQualityIndex'];
    for (const field of required) {
      if (b[field] === undefined) {
        return apiError('BAD_REQUEST', `${field} is required`, 400);
      }
    }

    const input: RiskInput = {
      sportId:            String(b.sportId),
      athleteExperience:  Number(b.athleteExperience),
      weatherScore:       Number(b.weatherScore),
      terrainDifficulty:  Number(b.terrainDifficulty),
      gearQualityIndex:   Number(b.gearQualityIndex),
      referenceId:        typeof b.referenceId === 'string' ? b.referenceId : undefined,
    };

    const result = calculateRisk(input);
    const response = apiSuccess(result, result.valid ? 200 : 422);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiExtrimliDegradedResponse('extrimli/risk', {
      surface: 'extrimli',
      contractVersion: EXTRIMLI_CONTRACT_VERSION,
      moduleVersion: EXTRIMLI_MODULE_VERSION,
      degradedSources: ['risk-evaluation'],
      error,
    });
  }
}
