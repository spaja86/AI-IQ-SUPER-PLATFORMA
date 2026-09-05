// SpajaUltraOmegaCore -∞Ω+∞ — KULKON API: /api/kulkon/evaluate
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { evaluateKulkon, setKulkonHeaders } from '@/lib/kulkon';
import type { KulkonInput } from '@/lib/kulkon';

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
      rhythm,
      clarityScore,
      trustScore,
      accountabilityScore,
      communicationLoad,
      conflictRate,
      participantCount,
      windowDays,
    } = candidate;

    if (typeof objective !== 'string') {
      return apiError('BAD_REQUEST', 'objective is required (string)');
    }
    if (typeof environment !== 'string') {
      return apiError('BAD_REQUEST', 'environment is required (string)');
    }
    if (typeof rhythm !== 'string') {
      return apiError('BAD_REQUEST', 'rhythm is required (string)');
    }
    if (typeof clarityScore !== 'number') {
      return apiError('BAD_REQUEST', 'clarityScore is required (number)');
    }
    if (typeof trustScore !== 'number') {
      return apiError('BAD_REQUEST', 'trustScore is required (number)');
    }
    if (typeof accountabilityScore !== 'number') {
      return apiError('BAD_REQUEST', 'accountabilityScore is required (number)');
    }
    if (typeof communicationLoad !== 'number') {
      return apiError('BAD_REQUEST', 'communicationLoad is required (number)');
    }
    if (typeof conflictRate !== 'number') {
      return apiError('BAD_REQUEST', 'conflictRate is required (number)');
    }
    if (typeof participantCount !== 'number') {
      return apiError('BAD_REQUEST', 'participantCount is required (number)');
    }
    if (typeof windowDays !== 'number') {
      return apiError('BAD_REQUEST', 'windowDays is required (number)');
    }

    const input: KulkonInput = {
      referenceId: typeof referenceId === 'string' ? referenceId : undefined,
      objective: objective as KulkonInput['objective'],
      environment: environment as KulkonInput['environment'],
      rhythm: rhythm as KulkonInput['rhythm'],
      clarityScore,
      trustScore,
      accountabilityScore,
      communicationLoad,
      conflictRate,
      participantCount,
      windowDays,
    };

    const result = evaluateKulkon(input);
    const response = apiSuccess(result, result.valid ? 200 : 422);
    setKulkonHeaders(response, result);
    return response;
  } catch (error) {
    return apiInternalError('kulkon/evaluate', error);
  }
}
