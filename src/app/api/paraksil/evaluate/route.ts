// SpajaUltraOmegaCore -∞Ω+∞ — PARAKSIL API: /api/paraksil/evaluate
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  evaluateParaksil,
  setParaksilHeaders,
} from '@/lib/paraksil';
import type { ParaksilInput } from '@/lib/paraksil';

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
    const { referenceId, target, metrics } = candidate;

    if (!target || typeof target !== 'object' || Array.isArray(target)) {
      return apiError('BAD_REQUEST', 'target is required (object)');
    }
    if (!metrics || typeof metrics !== 'object' || Array.isArray(metrics)) {
      return apiError('BAD_REQUEST', 'metrics is required (object)');
    }

    const targetCandidate = target as Record<string, unknown>;
    const metricsCandidate = metrics as Record<string, unknown>;

    const shallowTargetValid =
      typeof targetCandidate.moduleId === 'string' &&
      typeof targetCandidate.suite === 'string' &&
      (targetCandidate.moduleVersion === undefined || typeof targetCandidate.moduleVersion === 'string');
    if (!shallowTargetValid) {
      return apiError(
        'BAD_REQUEST',
        'target must include: moduleId (string), suite (string), moduleVersion? (string)',
      );
    }

    const metricFields = ['totalChecks', 'passedChecks', 'failedChecks', 'avgLatencyMs', 'errorRatePct', 'coveragePct'] as const;
    const shallowMetricsValid = metricFields.every((field) => typeof metricsCandidate[field] === 'number');
    if (!shallowMetricsValid) {
      return apiError(
        'BAD_REQUEST',
        'metrics must include numeric totalChecks, passedChecks, failedChecks, avgLatencyMs, errorRatePct, and coveragePct',
      );
    }

    const input: ParaksilInput = {
      referenceId: typeof referenceId === 'string' ? referenceId : undefined,
      target: {
        moduleId: targetCandidate.moduleId as string,
        suite: targetCandidate.suite as ParaksilInput['target']['suite'],
        moduleVersion: typeof targetCandidate.moduleVersion === 'string' ? targetCandidate.moduleVersion : undefined,
      },
      metrics: {
        totalChecks: metricsCandidate.totalChecks as number,
        passedChecks: metricsCandidate.passedChecks as number,
        failedChecks: metricsCandidate.failedChecks as number,
        avgLatencyMs: metricsCandidate.avgLatencyMs as number,
        errorRatePct: metricsCandidate.errorRatePct as number,
        coveragePct: metricsCandidate.coveragePct as number,
      },
    };

    const result = evaluateParaksil(input);
    const response = apiSuccess(result, result.valid ? 200 : 422);
    setParaksilHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('paraksil/evaluate', error);
  }
}
