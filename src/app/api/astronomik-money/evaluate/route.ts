// SpajaUltraOmegaCore -∞Ω+∞ — ASTRONOMIK MONEY API: /api/astronomik-money/evaluate
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { evaluateAstronomikMoney, setAstronomikHeaders } from '@/lib/astronomik-money';
import type { CelestialAsset, CosmicEvent, GalacticPortfolio } from '@/lib/astronomik-money';

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
    const { referenceId, assets, activeEvents } = candidate;

    if (!Array.isArray(assets) || assets.length === 0) {
      return apiError('BAD_REQUEST', 'assets is required (non-empty array)');
    }

    const portfolio: GalacticPortfolio = {
      referenceId: typeof referenceId === 'string' ? referenceId : undefined,
      assets: assets as CelestialAsset[],
      activeEvents: Array.isArray(activeEvents) ? (activeEvents as CosmicEvent[]) : undefined,
    };

    const result = evaluateAstronomikMoney(portfolio);
    const response = apiSuccess(result, result.valid ? 200 : 422);
    setAstronomikHeaders(response, result);
    return response;
  } catch (error) {
    return apiInternalError('astronomik-money/evaluate', error);
  }
}
