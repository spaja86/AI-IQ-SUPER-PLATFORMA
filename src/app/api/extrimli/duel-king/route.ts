import type { NextRequest } from 'next/server';
import { apiError, apiSuccess } from '@/lib/api/response';
import {
  EXTRIMLI_DUEL_KING_CONTRACT_VERSION,
  EXTRIMLI_DUEL_KING_MODULE_VERSION,
  evaluateDuelKing,
  getDuelKingHealthReport,
} from '@/lib/extrimli-duel-king';
import type { DuelKingInput } from '@/lib/extrimli/types';
import { apiExtrimliDegradedResponse, setExtrimliSurfaceHeaders } from '@/app/api/extrimli/_shared';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getDuelKingHealthReport();
    const response = apiSuccess(report, 200);
    setExtrimliSurfaceHeaders(response, {
      surface: 'extrimli-duel-king',
      contractVersion: EXTRIMLI_DUEL_KING_CONTRACT_VERSION,
      moduleVersion: EXTRIMLI_DUEL_KING_MODULE_VERSION,
    });
    return response;
  } catch (error) {
    return apiExtrimliDegradedResponse('extrimli/duel-king', {
      surface: 'extrimli-duel-king',
      contractVersion: EXTRIMLI_DUEL_KING_CONTRACT_VERSION,
      moduleVersion: EXTRIMLI_DUEL_KING_MODULE_VERSION,
      degradedSources: ['duel-king-health'],
      error,
    });
  }
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
    const requiredFields = [
      'sportId',
      'duelMode',
      'fighterExperience',
      'opponentTier',
      'arenaHazard',
      'staminaReserve',
      'gearQualityIndex',
      'reactionTimeMs',
    ] as const;

    for (const field of requiredFields) {
      if (candidate[field] === undefined) {
        return apiError('BAD_REQUEST', `${field} is required`);
      }
    }

    const input: DuelKingInput = {
      sportId: String(candidate.sportId) as DuelKingInput['sportId'],
      duelMode: String(candidate.duelMode) as DuelKingInput['duelMode'],
      fighterExperience: Number(candidate.fighterExperience),
      opponentTier: Number(candidate.opponentTier),
      arenaHazard: Number(candidate.arenaHazard),
      staminaReserve: Number(candidate.staminaReserve),
      gearQualityIndex: Number(candidate.gearQualityIndex),
      reactionTimeMs: Number(candidate.reactionTimeMs),
      activeGearCategories: Array.isArray(candidate.activeGearCategories)
        ? candidate.activeGearCategories as DuelKingInput['activeGearCategories']
        : undefined,
      recentSessions: candidate.recentSessions === undefined ? undefined : Number(candidate.recentSessions),
      fighterId: typeof candidate.fighterId === 'string' ? candidate.fighterId : undefined,
      tournamentState: typeof candidate.tournamentState === 'string'
        ? candidate.tournamentState as DuelKingInput['tournamentState']
        : undefined,
      referenceId: typeof candidate.referenceId === 'string' ? candidate.referenceId : undefined,
    };

    const result = evaluateDuelKing(input);
    const response = apiSuccess(result, result.valid ? 200 : 422);
    setExtrimliSurfaceHeaders(response, {
      surface: 'extrimli-duel-king',
      contractVersion: EXTRIMLI_DUEL_KING_CONTRACT_VERSION,
      moduleVersion: EXTRIMLI_DUEL_KING_MODULE_VERSION,
      degraded: result.degraded,
      degradedSources: result.degraded ? result.warnings : [],
    });
    return response;
  } catch (error) {
    return apiExtrimliDegradedResponse('extrimli/duel-king', {
      surface: 'extrimli-duel-king',
      contractVersion: EXTRIMLI_DUEL_KING_CONTRACT_VERSION,
      moduleVersion: EXTRIMLI_DUEL_KING_MODULE_VERSION,
      degradedSources: ['duel-king-evaluation'],
      error,
    });
  }
}
