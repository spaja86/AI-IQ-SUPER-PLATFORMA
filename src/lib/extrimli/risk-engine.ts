// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI
// Kompanija SPAJA — Digitalna Industrija

import type { RiskInput, RiskLevel, RiskResult } from './types';
import { clamp, round } from './utils';

let riskEvaluations = 0;
let lastRiskScore = 0;
let lastRiskLevel: RiskLevel = 'LOW';

const RISK_LEVEL_THRESHOLDS: { level: RiskLevel; min: number }[] = [
  { level: 'EXTREME', min: 75 },
  { level: 'HIGH',    min: 50 },
  { level: 'MEDIUM',  min: 25 },
  { level: 'LOW',     min: 0  },
];

const RECOMMENDATIONS: Record<RiskLevel, string> = {
  LOW:     'Conditions are safe. Standard gear and caution apply.',
  MEDIUM:  'Moderate risk. Ensure all protective gear is worn and check weather.',
  HIGH:    'High risk. Expert supervision recommended. Double-check gear integrity.',
  EXTREME: 'Extreme risk. Activity strongly discouraged under current conditions.',
};

function resolveRiskLevel(score: number): RiskLevel {
  for (const { level, min } of RISK_LEVEL_THRESHOLDS) {
    if (score >= min) return level;
  }
  return 'LOW';
}

function invalidRisk(input: RiskInput, warning: string, start: number): RiskResult {
  return {
    referenceId: input.referenceId ?? 'n/a',
    sportId: input.sportId,
    riskScore: 0,
    riskLevel: 'LOW',
    recommendation: RECOMMENDATIONS['LOW'],
    valid: false,
    warnings: [warning],
    durationMs: Date.now() - start,
  };
}

/**
 * Calculates a composite risk score (0–100) based on:
 *  - athleteExperience   (inverse: higher experience → lower risk)
 *  - weatherScore        (direct: higher score → higher risk)
 *  - terrainDifficulty   (direct)
 *  - gearQualityIndex    (inverse: better gear → lower risk)
 *
 * Formula:
 *   raw = ( (10 - athleteExperience) * 0.25
 *         + weatherScore             * 0.30
 *         + terrainDifficulty        * 0.25
 *         + (10 - gearQualityIndex)  * 0.20 ) * 10
 */
export function calculateRisk(input: RiskInput): RiskResult {
  const start = Date.now();

  if (!input.sportId || typeof input.sportId !== 'string' || input.sportId.length === 0) {
    return invalidRisk(input, 'sportId must be a non-empty string', start);
  }

  const fields: Array<[string, number | undefined]> = [
    ['athleteExperience', input.athleteExperience],
    ['weatherScore',      input.weatherScore],
    ['terrainDifficulty', input.terrainDifficulty],
    ['gearQualityIndex',  input.gearQualityIndex],
  ];

  for (const [name, val] of fields) {
    if (!Number.isFinite(val) || (val as number) < 0 || (val as number) > 10) {
      return invalidRisk(input, `${name} must be a finite number in [0, 10]`, start);
    }
  }

  const exp      = clamp(input.athleteExperience, 0, 10);
  const weather  = clamp(input.weatherScore, 0, 10);
  const terrain  = clamp(input.terrainDifficulty, 0, 10);
  const gear     = clamp(input.gearQualityIndex, 0, 10);

  const raw = (
    (10 - exp)   * 0.25 +
    weather      * 0.30 +
    terrain      * 0.25 +
    (10 - gear)  * 0.20
  ) * 10;

  const riskScore = round(clamp(raw, 0, 100), 2);
  const riskLevel = resolveRiskLevel(riskScore);

  riskEvaluations += 1;
  lastRiskScore = riskScore;
  lastRiskLevel = riskLevel;

  return {
    referenceId: input.referenceId ?? 'n/a',
    sportId:     input.sportId,
    riskScore,
    riskLevel,
    recommendation: RECOMMENDATIONS[riskLevel],
    valid: true,
    warnings: [],
    durationMs: Date.now() - start,
  };
}

export function getRiskMetrics() {
  return { riskEvaluations, lastRiskScore, lastRiskLevel };
}

export function _resetRiskMetrics(): void {
  riskEvaluations = 0;
  lastRiskScore   = 0;
  lastRiskLevel   = 'LOW';
}
