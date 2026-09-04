// SpajaUltraOmegaCore -∞Ω+∞ — TRU API: /api/tru/evaluate
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess, apiUnprocessableEntity } from '@/lib/api/response';
import { evaluateTru, setTruHeaders } from '@/lib/tru';
import type { TruInput } from '@/lib/tru';

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
      evidenceLevel,
      transparencyScore,
      reliabilityScore,
      reciprocityScore,
      riskLevel,
      responseLatencyHours,
      escalationCount,
    } = candidate;

    if (typeof objective !== 'string') {
      return apiError('BAD_REQUEST', 'objective is required (string)');
    }
    if (typeof channel !== 'string') {
      return apiError('BAD_REQUEST', 'channel is required (string)');
    }
    if (typeof evidenceLevel !== 'string') {
      return apiError('BAD_REQUEST', 'evidenceLevel is required (string)');
    }
    if (typeof transparencyScore !== 'number') {
      return apiError('BAD_REQUEST', 'transparencyScore is required (number)');
    }
    if (typeof reliabilityScore !== 'number') {
      return apiError('BAD_REQUEST', 'reliabilityScore is required (number)');
    }
    if (typeof reciprocityScore !== 'number') {
      return apiError('BAD_REQUEST', 'reciprocityScore is required (number)');
    }
    if (typeof riskLevel !== 'number') {
      return apiError('BAD_REQUEST', 'riskLevel is required (number)');
    }
    if (typeof responseLatencyHours !== 'number') {
      return apiError('BAD_REQUEST', 'responseLatencyHours is required (number)');
    }
    if (typeof escalationCount !== 'number') {
      return apiError('BAD_REQUEST', 'escalationCount is required (number)');
    }

    const input: TruInput = {
      referenceId: typeof referenceId === 'string' ? referenceId : undefined,
      objective: objective as TruInput['objective'],
      channel: channel as TruInput['channel'],
      evidenceLevel: evidenceLevel as TruInput['evidenceLevel'],
      transparencyScore,
      reliabilityScore,
      reciprocityScore,
      riskLevel,
      responseLatencyHours,
      escalationCount,
    };

    const result = evaluateTru(input);
    const { referenceId: _ignoredReferenceId, ...validationDetails } = result;
    const response = result.valid
      ? apiSuccess(result, 200)
      : apiUnprocessableEntity('TRU evaluation input failed domain validation', {
        validation: validationDetails,
      });
    setTruHeaders(response, result);
    return response;
  } catch (error) {
    return apiInternalError('tru/evaluate', error);
  }
}
