// SpajaUltraOmegaCore -∞Ω+∞ — TRIKOT Route Utils
// Kompanija SPAJA — Digitalna Industrija

import { TRIKOT_CONTRACT_VERSION, TRIKOT_MODULE_VERSION } from './types';
import type { TrikotResult } from './types';
import type { TrikotInput } from './types';
import { validateRequestShape } from '@/lib/api/request-shape';

export function setTrikotHeaders(res: Response, result?: TrikotResult): void {
  res.headers.set('X-Trikot-Contract-Version', TRIKOT_CONTRACT_VERSION);
  res.headers.set('X-Trikot-Module-Version', TRIKOT_MODULE_VERSION);

  if (result) {
    res.headers.set('X-Trikot-Valid', String(result.valid));
    if (!result.valid) return;
    if (result.objective) res.headers.set('X-Trikot-Objective', result.objective);
    if (result.season) res.headers.set('X-Trikot-Season', result.season);
    if (result.dressCode) res.headers.set('X-Trikot-Dress-Code', result.dressCode);
    if (result.status) res.headers.set('X-Trikot-Status', result.status);
    if (result.recommendedAction) res.headers.set('X-Trikot-Action', result.recommendedAction);
  }
}

export function validateTrikotRequestShape(candidate: Record<string, unknown>): string | null {
  return validateRequestShape(candidate, {
    requiredStringFields: ['objective', 'season', 'dressCode'],
    requiredFiniteNumberFields: [
      'comfortScore',
      'weatherFitScore',
      'budgetFitScore',
      'mobilityScore',
      'maintenanceRisk',
      'prepTimeHours',
      'accessoryComplexity',
    ],
  });
}

export function mapTrikotInput(candidate: Record<string, unknown>): TrikotInput {
  const {
    referenceId,
    objective,
    season,
    dressCode,
    comfortScore,
    weatherFitScore,
    budgetFitScore,
    mobilityScore,
    maintenanceRisk,
    prepTimeHours,
    accessoryComplexity,
  } = candidate;

  return {
    referenceId: typeof referenceId === 'string' ? referenceId : undefined,
    objective: objective as TrikotInput['objective'],
    season: season as TrikotInput['season'],
    dressCode: dressCode as TrikotInput['dressCode'],
    comfortScore: comfortScore as number,
    weatherFitScore: weatherFitScore as number,
    budgetFitScore: budgetFitScore as number,
    mobilityScore: mobilityScore as number,
    maintenanceRisk: maintenanceRisk as number,
    prepTimeHours: prepTimeHours as number,
    accessoryComplexity: accessoryComplexity as number,
  };
}
