// SpajaUltraOmegaCore -∞Ω+∞ — NUDE API: /api/nude/evaluate
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { evaluateNude, setNudeHeaders } from '@/lib/nude';
import type { NudeInput } from '@/lib/nude';

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
    const { referenceId, mode, environment, priority, stressLevel, contextLoad, sessionMinutes, breaksTaken } = candidate;

    if (typeof mode !== 'string') {
      return apiError('BAD_REQUEST', 'mode is required (string)');
    }
    if (typeof environment !== 'string') {
      return apiError('BAD_REQUEST', 'environment is required (string)');
    }
    if (typeof priority !== 'string') {
      return apiError('BAD_REQUEST', 'priority is required (string)');
    }
    if (typeof stressLevel !== 'number') {
      return apiError('BAD_REQUEST', 'stressLevel is required (number)');
    }
    if (typeof contextLoad !== 'number') {
      return apiError('BAD_REQUEST', 'contextLoad is required (number)');
    }
    if (typeof sessionMinutes !== 'number') {
      return apiError('BAD_REQUEST', 'sessionMinutes is required (number)');
    }
    if (breaksTaken !== undefined && typeof breaksTaken !== 'number') {
      return apiError('BAD_REQUEST', 'breaksTaken must be a number when provided');
    }

    const input: NudeInput = {
      referenceId: typeof referenceId === 'string' ? referenceId : undefined,
      mode: mode as NudeInput['mode'],
      environment: environment as NudeInput['environment'],
      priority: priority as NudeInput['priority'],
      stressLevel,
      contextLoad,
      sessionMinutes,
      breaksTaken: typeof breaksTaken === 'number' ? breaksTaken : undefined,
    };

    const result = evaluateNude(input);
    const response = apiSuccess(result, result.valid ? 200 : 422);
    setNudeHeaders(response, result);
    return response;
  } catch (error) {
    return apiInternalError('nude/evaluate', error);
  }
}
