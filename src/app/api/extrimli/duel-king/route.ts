import type { NextRequest } from 'next/server';
import { apiError, apiSuccess } from '@/lib/api/response';
import {
  EXTRIMLI_DUEL_KING_CONTRACT_VERSION,
  EXTRIMLI_DUEL_KING_KUR_CONTRACT_VERSION,
  EXTRIMLI_DUEL_KING_MODULE_VERSION,
  evaluateDuelKing,
  getDuelKingHealthReport,
} from '@/lib/extrimli-duel-king';
import { EXTRIMLI_GEAR_CATEGORIES, type DuelKingInput } from '@/lib/extrimli/types';
import { apiExtrimliDegradedResponse, setExtrimliSurfaceHeaders } from '@/app/api/extrimli/_shared';

export const dynamic = 'force-dynamic';

const GEAR_CATEGORIES = new Set(EXTRIMLI_GEAR_CATEGORIES);
const toFiniteNumberOrNaN = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return NaN;
};

export async function GET() {
  try {
    const report = getDuelKingHealthReport();
    const response = apiSuccess(report, 200);
    setExtrimliSurfaceHeaders(response, {
      surface: 'extrimli-duel-king',
      contractVersion: EXTRIMLI_DUEL_KING_CONTRACT_VERSION,
      moduleVersion: EXTRIMLI_DUEL_KING_MODULE_VERSION,
    });
    response.headers.set('X-Extrimli-Duel-King-Kur-Contract-Version', EXTRIMLI_DUEL_KING_KUR_CONTRACT_VERSION);
    response.headers.set('X-Extrimli-Duel-King-Kur-Signal-Status', report.lastKurSignalStatus);
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

    if (candidate.activeGearCategories !== undefined) {
      if (!Array.isArray(candidate.activeGearCategories) || candidate.activeGearCategories.some((value) => typeof value !== 'string' || !GEAR_CATEGORIES.has(value))) {
        return apiError('BAD_REQUEST', 'activeGearCategories must contain only known gear categories');
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
      kurGameSignal: (() => {
        if (candidate.kurGameSignal === undefined) return undefined;
        if (!candidate.kurGameSignal || typeof candidate.kurGameSignal !== 'object' || Array.isArray(candidate.kurGameSignal)) {
          return {
            start: NaN,
            target: NaN,
            step: 0,
          };
        }
        const signal = candidate.kurGameSignal as Record<string, unknown>;
        return {
          start: toFiniteNumberOrNaN(signal.start),
          target: toFiniteNumberOrNaN(signal.target),
          step: toFiniteNumberOrNaN(signal.step),
          maxIterations: signal.maxIterations === undefined ? undefined : toFiniteNumberOrNaN(signal.maxIterations),
          maxDurationMs: signal.maxDurationMs === undefined ? undefined : toFiniteNumberOrNaN(signal.maxDurationMs),
        };
      })(),
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
    response.headers.set('X-Extrimli-Duel-King-Kur-Contract-Version', EXTRIMLI_DUEL_KING_KUR_CONTRACT_VERSION);
    response.headers.set('X-Extrimli-Duel-King-Kur-Signal-Status', result.kurGameSignal.status);
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
