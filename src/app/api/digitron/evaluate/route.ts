// SpajaUltraOmegaCore -∞Ω+∞ — DIGITRON API: /api/digitron/evaluate
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { evaluateDigitron, setDigitronHeaders } from '@/lib/digitron';
import type { DigitronInput } from '@/lib/digitron';

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
    const { referenceId, digit, mode, signalStrength, syncScore, resilienceScore, latencyMs } = candidate;

    if (typeof digit !== 'number') {
      return apiError('BAD_REQUEST', 'digit is required (number)');
    }
    if (typeof mode !== 'string') {
      return apiError('BAD_REQUEST', 'mode is required (string)');
    }
    if (typeof signalStrength !== 'number') {
      return apiError('BAD_REQUEST', 'signalStrength is required (number)');
    }
    if (typeof syncScore !== 'number') {
      return apiError('BAD_REQUEST', 'syncScore is required (number)');
    }
    if (typeof resilienceScore !== 'number') {
      return apiError('BAD_REQUEST', 'resilienceScore is required (number)');
    }
    if (typeof latencyMs !== 'number') {
      return apiError('BAD_REQUEST', 'latencyMs is required (number)');
    }

    const input: DigitronInput = {
      referenceId: typeof referenceId === 'string' ? referenceId : undefined,
      digit,
      mode: mode as DigitronInput['mode'],
      signalStrength,
      syncScore,
      resilienceScore,
      latencyMs,
    };

    const result = evaluateDigitron(input);
    const response = apiSuccess(result, result.valid ? 200 : 422);
    setDigitronHeaders(response, result);
    return response;
  } catch (error) {
    return apiInternalError('digitron/evaluate', error);
  }
}
