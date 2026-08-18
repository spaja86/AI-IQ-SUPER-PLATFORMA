// SpajaUltraOmegaCore -∞Ω+∞ — DIREKT API: /api/direkt/evaluate
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  evaluateDirekt,
  setDirektHeaders,
} from '@/lib/direkt';
import type { DirektInput } from '@/lib/direkt';

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

    const { signals, referenceId, minimumScore, targetScore } = body as Record<string, unknown>;
    if (!Array.isArray(signals)) {
      return apiError('BAD_REQUEST', 'signals is required (array)');
    }

    const isShallowShapeValid = signals.every((signal) => {
      if (!signal || typeof signal !== 'object' || Array.isArray(signal)) return false;
      const candidate = signal as Record<string, unknown>;

      return (
        typeof candidate.id === 'string' &&
        typeof candidate.label === 'string' &&
        typeof candidate.score === 'number' &&
        typeof candidate.weight === 'number' &&
        (candidate.required === undefined || typeof candidate.required === 'boolean') &&
        (candidate.exampleCount === undefined || typeof candidate.exampleCount === 'number')
      );
    });

    if (!isShallowShapeValid) {
      return apiError(
        'BAD_REQUEST',
        'Each signal must include: id (string), label (string), score (number), weight (number)',
      );
    }

    if (referenceId !== undefined && typeof referenceId !== 'string') {
      return apiError('BAD_REQUEST', 'referenceId must be a string when provided');
    }

    if (minimumScore !== undefined && typeof minimumScore !== 'number') {
      return apiError('BAD_REQUEST', 'minimumScore must be a number when provided');
    }

    if (targetScore !== undefined && typeof targetScore !== 'number') {
      return apiError('BAD_REQUEST', 'targetScore must be a number when provided');
    }

    const input: DirektInput = {
      signals: signals as DirektInput['signals'],
      referenceId: referenceId as string | undefined,
      minimumScore: minimumScore as number | undefined,
      targetScore: targetScore as number | undefined,
    };

    const result = evaluateDirekt(input);
    const response = apiSuccess(result, result.valid ? 200 : 422);
    setDirektHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('direkt/evaluate', error);
  }
}
