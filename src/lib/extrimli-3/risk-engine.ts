// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI 3
// Kompanija SPAJA — Digitalna Industrija

import {
  EXTRIMLI_API_RESPONSE_MAX_MS,
  EXTRIMLI_PERFORMANCE_MAX_MS,
  adaptWeather,
  getPerformanceReport,
  getSportById,
} from '../extrimli';
import type { AthleteSession, RiskLevel } from '../extrimli';
import { clamp, round } from '../extrimli';
import { getSportRiskProfile, listSportRiskProfiles } from './profiles';
import type {
  AthleteProgressSnapshot,
  Extrimli3HealthReport,
  Extrimli3RiskInput,
  Extrimli3RiskResult,
} from './types';
import {
  EXTRIMLI3_CONTRACT_VERSION,
  EXTRIMLI3_MODULE_VERSION,
  EXTRIMLI3_PERSONA_ID,
} from './types';

let riskEvaluations = 0;
let lastRiskScore = 0;
let lastRiskLevel: RiskLevel = 'LOW';
let lastReadinessScore = 0;

const RISK_LEVEL_THRESHOLDS: { level: RiskLevel; min: number }[] = [
  { level: 'EXTREME', min: 75 },
  { level: 'HIGH', min: 50 },
  { level: 'MEDIUM', min: 25 },
  { level: 'LOW', min: 0 },
];

const RECOMMENDATIONS: Record<RiskLevel, string> = {
  LOW: 'Conditions are favorable. Maintain standard protections and proceed with awareness.',
  MEDIUM: 'Moderate exposure detected. Confirm weather, terrain, and gear before starting.',
  HIGH: 'High exposure detected. Expert oversight and contingency planning are strongly recommended.',
  EXTREME: 'Extreme exposure detected. Postpone the activity until readiness and conditions materially improve.',
};

function resolveRiskLevel(score: number): RiskLevel {
  const normalizedScore = clamp(score, 0, 100);
  for (const { level, min } of RISK_LEVEL_THRESHOLDS) {
    if (normalizedScore >= min) return level;
  }
  return 'LOW';
}

function getSportSpecificSessions(sessions: AthleteSession[], sportId: string): AthleteSession[] {
  return sessions.filter((session) => session.sportId === sportId);
}

function calculateConsistencyScore(sessions: AthleteSession[]): number {
  if (sessions.length === 0) return 0;

  const sorted = [...sessions].sort((a, b) => a.timestamp - b.timestamp);
  const metricKeys: Array<keyof AthleteSession> = ['speedKph', 'altitudeM', 'distanceKm', 'gForce', 'heartRateBpm'];
  const perMetricScores: number[] = [];

  for (const metric of metricKeys) {
    const values = sorted
      .map((session) => session[metric])
      .filter((value): value is number => typeof value === 'number' && Number.isFinite(value));

    if (values.length < 2) continue;

    const min = Math.min(...values);
    const max = Math.max(...values);
    const spread = max - min;
    const baseline = Math.max(Math.abs(values.reduce((sum, value) => sum + value, 0) / values.length), 1);
    const stability = clamp(100 - (spread / baseline) * 30, 0, 100);
    perMetricScores.push(stability);
  }

  if (perMetricScores.length === 0) {
    return clamp(sessions.length * 15, 0, 100);
  }

  const average = perMetricScores.reduce((sum, value) => sum + value, 0) / perMetricScores.length;
  return round(average, 2);
}

function buildAthleteProgressSnapshot(athleteId: string | undefined, sportId: string): AthleteProgressSnapshot | null {
  if (!athleteId) return null;

  const report = getPerformanceReport(athleteId);
  const warnings = [...report.warnings];

  if (!report.valid) {
    return {
      athleteId,
      sportId,
      sessionCount: 0,
      recentSessionCount: 0,
      improvementRate: 0,
      consistencyScore: 0,
      readinessScore: 0,
      warnings,
    };
  }

  const sportSessions = getSportSpecificSessions(report.sessions, sportId);
  const recentSessionCount = sportSessions.filter((session) => Date.now() - session.timestamp <= 30 * 86_400_000).length;
  const consistencyScore = calculateConsistencyScore(sportSessions);
  const improvementScore = clamp(50 + report.improvementRate, 0, 100);
  const readinessScore = round(
    clamp(
      sportSessions.length * 10 + recentSessionCount * 8 + consistencyScore * 0.35 + improvementScore * 0.25,
      0,
      100
    ),
    2
  );

  if (sportSessions.length === 0) {
    warnings.push(`no ${sportId} sessions found for athlete`);
  }

  return {
    athleteId,
    sportId,
    sessionCount: sportSessions.length,
    recentSessionCount,
    improvementRate: report.improvementRate,
    consistencyScore,
    readinessScore,
    warnings,
  };
}

function invalidRisk(input: Extrimli3RiskInput, warning: string, start: number): Extrimli3RiskResult {
  const fallbackProfile = getSportRiskProfile(input.sportId) ?? listSportRiskProfiles()[0];
  return {
    referenceId: input.referenceId ?? 'n/a',
    sportId: input.sportId,
    riskScore: 0,
    riskLevel: 'LOW',
    recommendation: RECOMMENDATIONS.LOW,
    valid: false,
    warnings: [warning],
    blockers: [warning],
    durationMs: Date.now() - start,
    readinessScore: 0,
    breakdown: {
      experienceRisk: 0,
      weatherRisk: 0,
      terrainRisk: 0,
      gearRisk: 0,
      weightedBaseScore: 0,
      profileAdjustedScore: 0,
    },
    athleteProgress: null,
    weatherRiskFactors: {
      windRiskModifier: 0,
      terrainRiskModifier: 0,
      overallWeatherScore: 0,
      gearRecommendation: 'Standard gear required.',
      valid: false,
      warnings: [warning],
    },
    sportProfile: fallbackProfile,
  };
}

export function calculateRiskV3(input: Extrimli3RiskInput): Extrimli3RiskResult {
  const start = Date.now();

  if (!input.sportId || typeof input.sportId !== 'string') {
    return invalidRisk(input, 'sportId must be a non-empty string', start);
  }

  const sport = getSportById(input.sportId);
  const profile = getSportRiskProfile(input.sportId);
  if (!sport || !profile) {
    return invalidRisk(input, `unsupported sportId: ${input.sportId}`, start);
  }

  const fields: Array<[string, number | undefined]> = [
    ['athleteExperience', input.athleteExperience],
    ['terrainDifficulty', input.terrainDifficulty],
    ['gearQualityIndex', input.gearQualityIndex],
  ];

  for (const [name, value] of fields) {
    if (!Number.isFinite(value) || (value as number) < 0 || (value as number) > 10) {
      return invalidRisk(input, `${name} must be a finite number in [0, 10]`, start);
    }
  }

  const weatherRiskFactors = adaptWeather(input.weatherData ?? {});
  const athleteProgress = buildAthleteProgressSnapshot(input.athleteId, input.sportId);
  const blockers: string[] = [];
  const warnings = [...weatherRiskFactors.warnings];

  if (input.athleteExperience < profile.minimumExperience) {
    blockers.push(`experience level ${input.athleteExperience} below sport minimum ${profile.minimumExperience}`);
  }

  if (profile.requiredWeatherData && (!input.weatherData || !weatherRiskFactors.valid)) {
    blockers.push(`weather data is required for ${sport.name} risk evaluation`);
  }

  if (athleteProgress?.sessionCount === 0) {
    warnings.push(`no prior ${sport.name} sessions recorded for athlete ${athleteProgress.athleteId}`);
  }

  warnings.push(`sport focus: ${profile.focus}`);
  if (athleteProgress?.warnings.length) warnings.push(...athleteProgress.warnings);

  const experienceRisk = round(((10 - input.athleteExperience) / 10) * 100, 2);
  const weatherRisk = round((weatherRiskFactors.overallWeatherScore / 10) * 100, 2);
  const terrainRisk = round(((input.terrainDifficulty + weatherRiskFactors.terrainRiskModifier * 0.3) / 10) * 100, 2);
  const gearRisk = round(((10 - input.gearQualityIndex) / 10) * 100, 2);

  const weightedBaseScore = round(
    experienceRisk * profile.experienceWeight +
      weatherRisk * profile.weatherWeight +
      terrainRisk * profile.terrainWeight +
      gearRisk * profile.gearWeight,
    2
  );

  const readinessModifier = athleteProgress ? clamp((50 - athleteProgress.readinessScore) * 0.2, -10, 10) : 0;
  const blockerPenalty = blockers.length * 6;
  const profileAdjustedScore = round(
    clamp(weightedBaseScore * profile.sportMultiplier + profile.riskBias + readinessModifier + blockerPenalty, 0, 100),
    2
  );
  const riskLevel = resolveRiskLevel(profileAdjustedScore);
  const readinessScore = athleteProgress
    ? athleteProgress.readinessScore
    : round(clamp(input.athleteExperience * 6 + input.gearQualityIndex * 4, 0, 100), 2);

  riskEvaluations += 1;
  lastRiskScore = profileAdjustedScore;
  lastRiskLevel = riskLevel;
  lastReadinessScore = readinessScore;

  return {
    referenceId: input.referenceId ?? 'n/a',
    sportId: input.sportId,
    riskScore: profileAdjustedScore,
    riskLevel,
    recommendation: RECOMMENDATIONS[riskLevel],
    valid: blockers.length === 0,
    warnings,
    blockers,
    durationMs: Date.now() - start,
    readinessScore,
    breakdown: {
      experienceRisk,
      weatherRisk,
      terrainRisk,
      gearRisk,
      weightedBaseScore,
      profileAdjustedScore,
    },
    athleteProgress,
    weatherRiskFactors,
    sportProfile: profile,
  };
}

export function getExtrimli3HealthReport(): Extrimli3HealthReport {
  return {
    personaId: EXTRIMLI3_PERSONA_ID,
    contractVersion: EXTRIMLI3_CONTRACT_VERSION,
    moduleVersion: EXTRIMLI3_MODULE_VERSION,
    profileCount: listSportRiskProfiles().length,
    riskEvaluations,
    lastRiskScore,
    lastRiskLevel,
    lastReadinessScore,
    performanceMaxMs: EXTRIMLI_PERFORMANCE_MAX_MS,
    apiResponseMaxMs: EXTRIMLI_API_RESPONSE_MAX_MS,
  };
}

export function _resetExtrimli3Metrics(): void {
  riskEvaluations = 0;
  lastRiskScore = 0;
  lastRiskLevel = 'LOW';
  lastReadinessScore = 0;
}
