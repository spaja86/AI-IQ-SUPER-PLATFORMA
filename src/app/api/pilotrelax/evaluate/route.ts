// SpajaUltraOmegaCore -∞Ω+∞ — PILOTRELAX API: /api/pilotrelax/evaluate
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { evaluatePilotrelax, setPilotrelaxHeaders } from '@/lib/pilotrelax';
import type { PilotrelaxInput } from '@/lib/pilotrelax';

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
      environment,
      phaseOfDay,
      stressLoad,
      availableMinutes,
      breathingCycles,
      noiseLevelDb,
      screenMinutesBeforeBreak,
    } = candidate;

    if (typeof objective !== 'string') {
      return apiError('BAD_REQUEST', 'objective is required (string)');
    }
    if (typeof environment !== 'string') {
      return apiError('BAD_REQUEST', 'environment is required (string)');
    }
    if (typeof phaseOfDay !== 'string') {
      return apiError('BAD_REQUEST', 'phaseOfDay is required (string)');
    }
    if (typeof stressLoad !== 'number') {
      return apiError('BAD_REQUEST', 'stressLoad is required (number)');
    }
    if (typeof availableMinutes !== 'number') {
      return apiError('BAD_REQUEST', 'availableMinutes is required (number)');
    }
    if (typeof breathingCycles !== 'number') {
      return apiError('BAD_REQUEST', 'breathingCycles is required (number)');
    }
    if (typeof noiseLevelDb !== 'number') {
      return apiError('BAD_REQUEST', 'noiseLevelDb is required (number)');
    }
    if (typeof screenMinutesBeforeBreak !== 'number') {
      return apiError('BAD_REQUEST', 'screenMinutesBeforeBreak is required (number)');
    }

    const input: PilotrelaxInput = {
      referenceId: typeof referenceId === 'string' ? referenceId : undefined,
      objective: objective as PilotrelaxInput['objective'],
      environment: environment as PilotrelaxInput['environment'],
      phaseOfDay: phaseOfDay as PilotrelaxInput['phaseOfDay'],
      stressLoad,
      availableMinutes,
      breathingCycles,
      noiseLevelDb,
      screenMinutesBeforeBreak,
    };

    const result = evaluatePilotrelax(input);
    const response = apiSuccess(result, result.valid ? 200 : 422);
    setPilotrelaxHeaders(response, result);
    return response;
  } catch (error) {
    return apiInternalError('pilotrelax/evaluate', error);
  }
}
