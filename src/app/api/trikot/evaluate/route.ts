// SpajaUltraOmegaCore -∞Ω+∞ — TRIKOT API: /api/trikot/evaluate
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess, apiUnprocessableEntity } from '@/lib/api/response';
import { evaluateTrikot, setTrikotHeaders } from '@/lib/trikot';
import type { TrikotInput } from '@/lib/trikot';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return apiError('BAD_REQUEST', 'Invalid JSON body');
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return apiError('BAD_REQUEST', 'Body must be a JSON object');
    }

    const candidate = body as Record<string, unknown>;
    const {
      referenceId,
      objective,
      season,
      dressCode,
      comfortScore,
      weatherFitScore,
      budgetFitScore,
      mobilityScore,
      maintenanceRisk,
      prepTimeHours,
      accessoryComplexity,
    } = candidate;

    if (typeof objective !== 'string') return apiError('BAD_REQUEST', 'objective is required (string)');
    if (typeof season !== 'string') return apiError('BAD_REQUEST', 'season is required (string)');
    if (typeof dressCode !== 'string') return apiError('BAD_REQUEST', 'dressCode is required (string)');
    if (typeof comfortScore !== 'number') return apiError('BAD_REQUEST', 'comfortScore is required (number)');
    if (typeof weatherFitScore !== 'number') return apiError('BAD_REQUEST', 'weatherFitScore is required (number)');
    if (typeof budgetFitScore !== 'number') return apiError('BAD_REQUEST', 'budgetFitScore is required (number)');
    if (typeof mobilityScore !== 'number') return apiError('BAD_REQUEST', 'mobilityScore is required (number)');
    if (typeof maintenanceRisk !== 'number') return apiError('BAD_REQUEST', 'maintenanceRisk is required (number)');
    if (typeof prepTimeHours !== 'number') return apiError('BAD_REQUEST', 'prepTimeHours is required (number)');
    if (typeof accessoryComplexity !== 'number') return apiError('BAD_REQUEST', 'accessoryComplexity is required (number)');

    const input: TrikotInput = {
      referenceId: typeof referenceId === 'string' ? referenceId : undefined,
      objective: objective as TrikotInput['objective'],
      season: season as TrikotInput['season'],
      dressCode: dressCode as TrikotInput['dressCode'],
      comfortScore,
      weatherFitScore,
      budgetFitScore,
      mobilityScore,
      maintenanceRisk,
      prepTimeHours,
      accessoryComplexity,
    };

    const result = evaluateTrikot(input);
    const response = result.valid
      ? apiSuccess(result, 200)
      : apiUnprocessableEntity('TRIKOT evaluation input failed domain validation', {
        validation: {
          valid: result.valid,
          objective: result.objective,
          season: result.season,
          dressCode: result.dressCode,
          status: result.status,
          recommendedAction: result.recommendedAction,
          reason: result.warnings[0] ?? 'DOMAIN_VALIDATION_FAILED',
        },
      });
    setTrikotHeaders(response, result);
    return response;
  } catch (error) {
    return apiInternalError('trikot/evaluate', error);
  }
}
