// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI 3 API: /api/extrimli-3/risk
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  calculateRiskV3,
  EXTRIMLI3_CONTRACT_VERSION,
  EXTRIMLI3_MODULE_VERSION,
} from '@/lib/extrimli-3';
import type { Extrimli3RiskInput } from '@/lib/extrimli-3';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  res.headers.set('X-Extrimli3-Contract-Version', EXTRIMLI3_CONTRACT_VERSION);
  res.headers.set('X-Extrimli3-Module-Version', EXTRIMLI3_MODULE_VERSION);
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
    const required = ['sportId', 'athleteExperience', 'terrainDifficulty', 'gearQualityIndex'];
    for (const field of required) {
      if (b[field] === undefined) {
        return apiError('BAD_REQUEST', `${field} is required`, 400);
      }
    }

    const input: Extrimli3RiskInput = {
      sportId: String(b.sportId),
      athleteExperience: Number(b.athleteExperience),
      terrainDifficulty: Number(b.terrainDifficulty),
      gearQualityIndex: Number(b.gearQualityIndex),
      athleteId: typeof b.athleteId === 'string' ? b.athleteId : undefined,
      referenceId: typeof b.referenceId === 'string' ? b.referenceId : undefined,
      weatherData: b.weatherData && typeof b.weatherData === 'object' && !Array.isArray(b.weatherData)
        ? {
            windSpeedKph: typeof (b.weatherData as Record<string, unknown>).windSpeedKph === 'number'
              ? (b.weatherData as Record<string, unknown>).windSpeedKph as number
              : undefined,
            precipitationMm: typeof (b.weatherData as Record<string, unknown>).precipitationMm === 'number'
              ? (b.weatherData as Record<string, unknown>).precipitationMm as number
              : undefined,
            temperatureC: typeof (b.weatherData as Record<string, unknown>).temperatureC === 'number'
              ? (b.weatherData as Record<string, unknown>).temperatureC as number
              : undefined,
            visibilityKm: typeof (b.weatherData as Record<string, unknown>).visibilityKm === 'number'
              ? (b.weatherData as Record<string, unknown>).visibilityKm as number
              : undefined,
          }
        : undefined,
    };

    const result = calculateRiskV3(input);
    const response = apiSuccess(result, result.valid ? 200 : 422);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('extrimli-3/risk', error);
  }
}
