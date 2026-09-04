// SpajaUltraOmegaCore -∞Ω+∞ — DURIT EKSER FAR DIR DOR DAR EKSTRIBUŠEN API: /api/durit-ekser-far-dir-dor-dar-ekstribusen/evaluate
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  evaluateDuritEkserFarDirDorDarEkstribusen,
  setDuritEkstribusenHeaders,
} from '@/lib/durit-ekser-far-dir-dor-dar-ekstribusen';
import type { DuritEkserFarDirDorDarEkstribusenInput } from '@/lib/durit-ekser-far-dir-dor-dar-ekstribusen';

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

    const {
      start,
      end,
      step,
      target,
      maxIterations,
      maxDurationMs,
      status,
      referenceId,
      minimumScore,
      targetScore,
    } = body as Record<string, unknown>;

    for (const [name, value] of [
      ['start', start],
      ['end', end],
      ['step', step],
      ['target', target],
      ['maxIterations', maxIterations],
      ['maxDurationMs', maxDurationMs],
      ['minimumScore', minimumScore],
      ['targetScore', targetScore],
    ] as const) {
      if (value === null) {
        return apiError('BAD_REQUEST', `${name} must be omitted or a finite number`);
      }
      if (value !== undefined && typeof value !== 'number') {
        return apiError('BAD_REQUEST', `${name} must be a number when provided`);
      }
      if (typeof value === 'number' && !Number.isFinite(value)) {
        return apiError('BAD_REQUEST', `${name} must be a finite number when provided`);
      }
    }

    if (status !== undefined && typeof status !== 'string') {
      return apiError('BAD_REQUEST', 'status must be a string when provided');
    }

    if (referenceId !== undefined && typeof referenceId !== 'string') {
      return apiError('BAD_REQUEST', 'referenceId must be a string when provided');
    }

    const input: DuritEkserFarDirDorDarEkstribusenInput = {
      start: start as number | undefined,
      end: end as number | undefined,
      step: step as number | undefined,
      target: target as number | undefined,
      maxIterations: maxIterations as number | undefined,
      maxDurationMs: maxDurationMs as number | undefined,
      status: status as DuritEkserFarDirDorDarEkstribusenInput['status'],
      referenceId: referenceId as string | undefined,
      minimumScore: minimumScore as number | undefined,
      targetScore: targetScore as number | undefined,
    };

    const result = evaluateDuritEkserFarDirDorDarEkstribusen(input);
    const statusCode = result.valid
      ? 200
      : result.status === 'BLOCKED'
        ? 409
        : 422;
    const response = apiSuccess(result, statusCode);
    setDuritEkstribusenHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('durit-ekser-far-dir-dor-dar-ekstribusen/evaluate', error);
  }
}
