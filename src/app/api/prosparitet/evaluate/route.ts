// SpajaUltraOmegaCore -∞Ω+∞ — PROSPARITET API: /api/prosparitet/evaluate
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { evaluateProsparitet, setProsparitetHeaders } from '@/lib/prosparitet';
import type { ProsparitetInput } from '@/lib/prosparitet';
import { PROSPARITET_MAX_HORIZON_MONTHS } from '@/lib/prosparitet';
import {
  VALID_PROSPARITET_HORIZONS,
  VALID_PROSPARITET_OBJECTIVES,
  VALID_PROSPARITET_RISK_APPETITES,
} from '@/lib/prosparitet/registry';

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
      horizon,
      riskAppetite,
      revenueStabilityScore,
      marginScore,
      liquidityScore,
      debtLoadScore,
      disciplineScore,
      horizonMonths,
    } = candidate;

    if (typeof objective !== 'string') {
      return apiError('BAD_REQUEST', 'objective is required (string)');
    }
    if (typeof horizon !== 'string') {
      return apiError('BAD_REQUEST', 'horizon is required (string)');
    }
    if (typeof riskAppetite !== 'string') {
      return apiError('BAD_REQUEST', 'riskAppetite is required (string)');
    }
    if (!VALID_PROSPARITET_OBJECTIVES.includes(objective as ProsparitetInput['objective'])) {
      return apiError('BAD_REQUEST', `objective must be one of: ${VALID_PROSPARITET_OBJECTIVES.join(', ')}`);
    }
    if (!VALID_PROSPARITET_HORIZONS.includes(horizon as ProsparitetInput['horizon'])) {
      return apiError('BAD_REQUEST', `horizon must be one of: ${VALID_PROSPARITET_HORIZONS.join(', ')}`);
    }
    if (!VALID_PROSPARITET_RISK_APPETITES.includes(riskAppetite as ProsparitetInput['riskAppetite'])) {
      return apiError('BAD_REQUEST', `riskAppetite must be one of: ${VALID_PROSPARITET_RISK_APPETITES.join(', ')}`);
    }
    if (typeof revenueStabilityScore !== 'number') {
      return apiError('BAD_REQUEST', 'revenueStabilityScore is required (number)');
    }
    if (typeof marginScore !== 'number') {
      return apiError('BAD_REQUEST', 'marginScore is required (number)');
    }
    if (typeof liquidityScore !== 'number') {
      return apiError('BAD_REQUEST', 'liquidityScore is required (number)');
    }
    if (typeof debtLoadScore !== 'number') {
      return apiError('BAD_REQUEST', 'debtLoadScore is required (number)');
    }
    if (typeof disciplineScore !== 'number') {
      return apiError('BAD_REQUEST', 'disciplineScore is required (number)');
    }
    if (typeof horizonMonths !== 'number') {
      return apiError('BAD_REQUEST', 'horizonMonths is required (number)');
    }
    if (!Number.isFinite(revenueStabilityScore) || revenueStabilityScore < 0 || revenueStabilityScore > 100) {
      return apiError('BAD_REQUEST', 'revenueStabilityScore must be within 0..100');
    }
    if (!Number.isFinite(marginScore) || marginScore < 0 || marginScore > 100) {
      return apiError('BAD_REQUEST', 'marginScore must be within 0..100');
    }
    if (!Number.isFinite(liquidityScore) || liquidityScore < 0 || liquidityScore > 100) {
      return apiError('BAD_REQUEST', 'liquidityScore must be within 0..100');
    }
    if (!Number.isFinite(debtLoadScore) || debtLoadScore < 0 || debtLoadScore > 100) {
      return apiError('BAD_REQUEST', 'debtLoadScore must be within 0..100');
    }
    if (!Number.isFinite(disciplineScore) || disciplineScore < 0 || disciplineScore > 100) {
      return apiError('BAD_REQUEST', 'disciplineScore must be within 0..100');
    }
    if (!Number.isInteger(horizonMonths) || horizonMonths <= 0 || horizonMonths > PROSPARITET_MAX_HORIZON_MONTHS) {
      return apiError('BAD_REQUEST', `horizonMonths must be an integer within 1..${PROSPARITET_MAX_HORIZON_MONTHS}`);
    }

    const input: ProsparitetInput = {
      referenceId: typeof referenceId === 'string' ? referenceId : undefined,
      objective: objective as ProsparitetInput['objective'],
      horizon: horizon as ProsparitetInput['horizon'],
      riskAppetite: riskAppetite as ProsparitetInput['riskAppetite'],
      revenueStabilityScore,
      marginScore,
      liquidityScore,
      debtLoadScore,
      disciplineScore,
      horizonMonths,
    };

    const result = evaluateProsparitet(input);
    if (!result.valid) {
      const response = apiError('BAD_REQUEST', result.warnings[0] ?? 'Invalid prosparitet input', result);
      setProsparitetHeaders(response, result);
      return response;
    }

    const response = apiSuccess(result, 200);
    setProsparitetHeaders(response, result);
    return response;
  } catch (error) {
    return apiInternalError('prosparitet/evaluate', error);
  }
}
