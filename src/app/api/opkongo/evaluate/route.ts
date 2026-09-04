// SpajaUltraOmegaCore -∞Ω+∞ — OPKONGO API: /api/opkongo/evaluate
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { evaluateOpkongo, setOpkongoHeaders } from '@/lib/opkongo';
import type { OpkongoInput } from '@/lib/opkongo';

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
      channel,
      relationshipTemperature,
      clarityScore,
      leverageScore,
      trustScore,
      urgencyLevel,
      followUpCount,
      timeWindowHours,
    } = candidate;

    if (typeof objective !== 'string') {
      return apiError('BAD_REQUEST', 'objective is required (string)');
    }
    if (typeof channel !== 'string') {
      return apiError('BAD_REQUEST', 'channel is required (string)');
    }
    if (typeof relationshipTemperature !== 'string') {
      return apiError('BAD_REQUEST', 'relationshipTemperature is required (string)');
    }
    if (typeof clarityScore !== 'number') {
      return apiError('BAD_REQUEST', 'clarityScore is required (number)');
    }
    if (typeof leverageScore !== 'number') {
      return apiError('BAD_REQUEST', 'leverageScore is required (number)');
    }
    if (typeof trustScore !== 'number') {
      return apiError('BAD_REQUEST', 'trustScore is required (number)');
    }
    if (typeof urgencyLevel !== 'number') {
      return apiError('BAD_REQUEST', 'urgencyLevel is required (number)');
    }
    if (typeof followUpCount !== 'number') {
      return apiError('BAD_REQUEST', 'followUpCount is required (number)');
    }
    if (typeof timeWindowHours !== 'number') {
      return apiError('BAD_REQUEST', 'timeWindowHours is required (number)');
    }

    const input: OpkongoInput = {
      referenceId: typeof referenceId === 'string' ? referenceId : undefined,
      objective: objective as OpkongoInput['objective'],
      channel: channel as OpkongoInput['channel'],
      relationshipTemperature: relationshipTemperature as OpkongoInput['relationshipTemperature'],
      clarityScore,
      leverageScore,
      trustScore,
      urgencyLevel,
      followUpCount,
      timeWindowHours,
    };

    const result = evaluateOpkongo(input);
    const response = apiSuccess(result, result.valid ? 200 : 422);
    setOpkongoHeaders(response, result);
    return response;
  } catch (error) {
    return apiInternalError('opkongo/evaluate', error);
  }
}
