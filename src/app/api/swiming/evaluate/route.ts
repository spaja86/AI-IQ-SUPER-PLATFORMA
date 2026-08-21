// SpajaUltraOmegaCore -∞Ω+∞ — SWIMING API: /api/swiming/evaluate
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { evaluateSwiming, setSwimingHeaders } from '@/lib/swiming';
import type { SwimingInput } from '@/lib/swiming';
import { VALID_STROKES, VALID_FITNESS_LEVELS } from '@/lib/swiming/registry';

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

    const c = body as Record<string, unknown>;
    const { referenceId, strokeType, sessionDurationMin, poolLengthM, restingHeartRate, waterTempC, fitnessLevel } = c;

    if (typeof strokeType !== 'string' || !VALID_STROKES.includes(strokeType as SwimingInput['strokeType'])) {
      return apiError('BAD_REQUEST', `strokeType must be one of: ${VALID_STROKES.join(', ')}`);
    }
    if (typeof sessionDurationMin !== 'number') {
      return apiError('BAD_REQUEST', 'sessionDurationMin must be a number');
    }
    if (typeof poolLengthM !== 'number') {
      return apiError('BAD_REQUEST', 'poolLengthM must be a number');
    }
    if (typeof restingHeartRate !== 'number') {
      return apiError('BAD_REQUEST', 'restingHeartRate must be a number');
    }
    if (typeof waterTempC !== 'number') {
      return apiError('BAD_REQUEST', 'waterTempC must be a number');
    }
    if (typeof fitnessLevel !== 'string' || !VALID_FITNESS_LEVELS.includes(fitnessLevel as SwimingInput['fitnessLevel'])) {
      return apiError('BAD_REQUEST', `fitnessLevel must be one of: ${VALID_FITNESS_LEVELS.join(', ')}`);
    }

    const input: SwimingInput = {
      referenceId: typeof referenceId === 'string' ? referenceId : undefined,
      strokeType: strokeType as SwimingInput['strokeType'],
      sessionDurationMin,
      poolLengthM,
      restingHeartRate,
      waterTempC,
      fitnessLevel: fitnessLevel as SwimingInput['fitnessLevel'],
    };

    const result = evaluateSwiming(input);
    const response = apiSuccess(result, result.valid ? 200 : 422);
    setSwimingHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('swiming/evaluate', error);
  }
}
