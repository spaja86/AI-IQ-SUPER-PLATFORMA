// SpajaUltraOmegaCore -∞Ω+∞ — TRIKOT API: /api/trikot/evaluate
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess, apiUnprocessableEntity } from '@/lib/api/response';
import { evaluateTrikot, setTrikotHeaders } from '@/lib/trikot';
import type { TrikotInput } from '@/lib/trikot';

export const dynamic = 'force-dynamic';

function validateRequestShape(candidate: Record<string, unknown>): string | null {
  const requiredStringFields = ['objective', 'season', 'dressCode'] as const;
  for (const field of requiredStringFields) {
    const value = candidate[field];
    if (value === undefined) return `${field} is required (string)`;
    if (typeof value !== 'string') return `${field} must be a string`;
  }

  const requiredNumberFields = [
    'comfortScore',
    'weatherFitScore',
    'budgetFitScore',
    'mobilityScore',
    'maintenanceRisk',
    'prepTimeHours',
    'accessoryComplexity',
  ] as const;
  for (const field of requiredNumberFields) {
    const value = candidate[field];
    if (value === undefined) return `${field} is required (number)`;
    if (typeof value !== 'number') return `${field} must be a number`;
    if (!Number.isFinite(value)) return `${field} must be a finite number`;
  }

  return null;
}

function toTrikotInput(candidate: Record<string, unknown>): TrikotInput {
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

  return {
    referenceId: typeof referenceId === 'string' ? referenceId : undefined,
    objective: objective as TrikotInput['objective'],
    season: season as TrikotInput['season'],
    dressCode: dressCode as TrikotInput['dressCode'],
    comfortScore: comfortScore as number,
    weatherFitScore: weatherFitScore as number,
    budgetFitScore: budgetFitScore as number,
    mobilityScore: mobilityScore as number,
    maintenanceRisk: maintenanceRisk as number,
    prepTimeHours: prepTimeHours as number,
    accessoryComplexity: accessoryComplexity as number,
  };
}

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
    const shapeError = validateRequestShape(candidate);
    if (shapeError) return apiError('BAD_REQUEST', shapeError);

    const input = toTrikotInput(candidate);
    const result = evaluateTrikot(input);
    const response = result.valid
      ? apiSuccess(result, 200)
      : apiUnprocessableEntity('TRIKOT evaluation input failed domain validation', {
        data: result,
        validation: {
          valid: result.valid,
          objective: result.rawObjective ?? result.objective,
          season: result.rawSeason ?? result.season,
          dressCode: result.rawDressCode ?? result.dressCode,
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
