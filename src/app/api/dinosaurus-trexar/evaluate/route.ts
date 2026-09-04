// SpajaUltraOmegaCore -∞Ω+∞ — DINOSAURUS-Trexar API: /api/dinosaurus-trexar/evaluate
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  evaluateDinosaurusTrexar,
  setDinosaurusTrexarHeaders,
  type TrexarInput,
  VALID_AGE_CATEGORIES,
} from '@/lib/dinosaurus-trexar';

export const dynamic = 'force-dynamic';

function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

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
    const { referenceId, profile, signals } = candidate;

    if (!profile || typeof profile !== 'object' || Array.isArray(profile)) {
      return apiError('BAD_REQUEST', 'profile is required (object)');
    }

    if (!signals || typeof signals !== 'object' || Array.isArray(signals)) {
      return apiError('BAD_REQUEST', 'signals is required (object)');
    }

    const profileCandidate = profile as Record<string, unknown>;
    const signalsCandidate = signals as Record<string, unknown>;

    if (typeof profileCandidate.ageCategory !== 'string' || !VALID_AGE_CATEGORIES.includes(profileCandidate.ageCategory as TrexarInput['profile']['ageCategory'])) {
      return apiError('BAD_REQUEST', `ageCategory must be one of: ${VALID_AGE_CATEGORIES.join(', ')}`);
    }

    if (!isNumber(profileCandidate.massKg)) {
      return apiError('BAD_REQUEST', 'profile.massKg must be a number');
    }

    const signalFields = ['stamina', 'aggression', 'focus', 'threatLevel', 'terrainFriction', 'packSupport', 'reactionMs'] as const;
    for (const field of signalFields) {
      if (!isNumber(signalsCandidate[field])) {
        return apiError('BAD_REQUEST', `signals.${field} must be a number`);
      }
    }

    const input: TrexarInput = {
      referenceId: typeof referenceId === 'string' ? referenceId : undefined,
      profile: {
        specimenId: typeof profileCandidate.specimenId === 'string' ? profileCandidate.specimenId : undefined,
        ageCategory: profileCandidate.ageCategory as TrexarInput['profile']['ageCategory'],
        massKg: profileCandidate.massKg,
      },
      signals: {
        stamina: signalsCandidate.stamina,
        aggression: signalsCandidate.aggression,
        focus: signalsCandidate.focus,
        threatLevel: signalsCandidate.threatLevel,
        terrainFriction: signalsCandidate.terrainFriction,
        packSupport: signalsCandidate.packSupport,
        reactionMs: signalsCandidate.reactionMs,
      },
    };

    const result = evaluateDinosaurusTrexar(input);
    const response = apiSuccess(result, result.valid ? 200 : 422);
    setDinosaurusTrexarHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('dinosaurus-trexar/evaluate', error);
  }
}
