// SpajaUltraOmegaCore -∞Ω+∞ — DIJAGNOZA API: /api/dijagnoza/evaluate
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { evaluateDijagnoza, setDijagnozaHeaders } from '@/lib/dijagnoza';
import type { DijagnozaInput } from '@/lib/dijagnoza';

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
    const { referenceId, profile, symptoms, vitals, durationDays, additionalNotes } = candidate;

    if (!profile || typeof profile !== 'object' || Array.isArray(profile)) {
      return apiError('BAD_REQUEST', 'profile is required (object)');
    }

    if (!Array.isArray(symptoms) || symptoms.length === 0) {
      return apiError('BAD_REQUEST', 'symptoms is required (non-empty array of strings)');
    }

    if (!symptoms.every((s) => typeof s === 'string')) {
      return apiError('BAD_REQUEST', 'symptoms must be an array of strings');
    }

    if (typeof durationDays !== 'number') {
      return apiError('BAD_REQUEST', 'durationDays is required (number)');
    }

    const input: DijagnozaInput = {
      referenceId: typeof referenceId === 'string' ? referenceId : undefined,
      profile: profile as DijagnozaInput['profile'],
      symptoms: symptoms as string[],
      vitals: vitals && typeof vitals === 'object' && !Array.isArray(vitals)
        ? vitals as DijagnozaInput['vitals']
        : undefined,
      durationDays,
      additionalNotes: typeof additionalNotes === 'string' ? additionalNotes : undefined,
    };

    const result = evaluateDijagnoza(input);
    const response = apiSuccess(result, result.valid ? 200 : 422);
    setDijagnozaHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('dijagnoza/evaluate', error);
  }
}
