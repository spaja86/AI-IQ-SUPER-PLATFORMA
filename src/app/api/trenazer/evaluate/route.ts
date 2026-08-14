// SpajaUltraOmegaCore -∞Ω+∞ — TRENAZER API: /api/trenazer/evaluate
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  evaluateTrenazer,
  TRENAZER_CONTRACT_VERSION,
  TRENAZER_MODULE_VERSION,
} from '@/lib/trenazer';
import type { TrenazerInput } from '@/lib/trenazer';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  res.headers.set('X-Trenazer-Contract-Version', TRENAZER_CONTRACT_VERSION);
  res.headers.set('X-Trenazer-Module-Version', TRENAZER_MODULE_VERSION);
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
    const { referenceId, profile, metrics } = candidate;

    if (!profile || typeof profile !== 'object' || Array.isArray(profile)) {
      return apiError('BAD_REQUEST', 'profile is required (object)');
    }
    if (!metrics || typeof metrics !== 'object' || Array.isArray(metrics)) {
      return apiError('BAD_REQUEST', 'metrics is required (object)');
    }

    const profileCandidate = profile as Record<string, unknown>;
    const metricsCandidate = metrics as Record<string, unknown>;

    const shallowProfileValid =
      typeof profileCandidate.goal === 'string' &&
      typeof profileCandidate.experienceLevel === 'string' &&
      (profileCandidate.traineeId === undefined || typeof profileCandidate.traineeId === 'string');
    if (!shallowProfileValid) {
      return apiError(
        'BAD_REQUEST',
        'profile must include: goal (string), experienceLevel (string), traineeId? (string)',
      );
    }

    const metricFields = ['energy', 'focus', 'soreness', 'stress', 'sleepHours', 'availableMinutes'] as const;
    const shallowMetricsValid = metricFields.every((field) => typeof metricsCandidate[field] === 'number');
    if (!shallowMetricsValid) {
      return apiError(
        'BAD_REQUEST',
        'metrics must include numeric energy, focus, soreness, stress, sleepHours, and availableMinutes',
      );
    }

    const input: TrenazerInput = {
      referenceId: typeof referenceId === 'string' ? referenceId : undefined,
      profile: {
        goal: profileCandidate.goal as TrenazerInput['profile']['goal'],
        experienceLevel: profileCandidate.experienceLevel as TrenazerInput['profile']['experienceLevel'],
        traineeId: typeof profileCandidate.traineeId === 'string' ? profileCandidate.traineeId : undefined,
      },
      metrics: {
        energy: metricsCandidate.energy as number,
        focus: metricsCandidate.focus as number,
        soreness: metricsCandidate.soreness as number,
        stress: metricsCandidate.stress as number,
        sleepHours: metricsCandidate.sleepHours as number,
        availableMinutes: metricsCandidate.availableMinutes as number,
      },
    };

    const result = evaluateTrenazer(input);
    const response = apiSuccess(result, result.valid ? 200 : 422);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('trenazer/evaluate', error);
  }
}
