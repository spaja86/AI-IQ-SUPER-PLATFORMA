// SpajaUltraOmegaCore -∞Ω+∞ — ZLATNI RAČUNI API: /api/zlatni-racuni/tier
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { getRacunByUserId, evaluateTierResult, setZlatniHeaders } from '@/lib/zlatni-racuni';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) return apiError('BAD_REQUEST', 'userId query param required');

    const racun = getRacunByUserId(userId);
    if (!racun) return apiError('NOT_FOUND', `ZlatniRacun not found for userId: ${userId}`);

    const tierResult = evaluateTierResult(racun.pointsAccrued);
    const response = apiSuccess(tierResult, 200);
    setZlatniHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('zlatni-racuni/tier', error);
  }
}
