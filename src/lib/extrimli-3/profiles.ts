// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI 3
// Kompanija SPAJA — Digitalna Industrija

import { SPORT_REGISTRY } from '../extrimli';
import type { SportRiskProfile } from './types';

export const SPORT_RISK_PROFILES: SportRiskProfile[] = [
  {
    sportId: 'skateboarding',
    category: 'urban',
    sportMultiplier: 0.94,
    minimumExperience: 1,
    riskBias: -2,
    experienceWeight: 0.30,
    weatherWeight: 0.10,
    terrainWeight: 0.35,
    gearWeight: 0.25,
    requiredWeatherData: false,
    focus: 'terrain',
  },
  {
    sportId: 'snowboarding',
    category: 'snow',
    sportMultiplier: 1.08,
    minimumExperience: 2,
    riskBias: 4,
    experienceWeight: 0.28,
    weatherWeight: 0.28,
    terrainWeight: 0.24,
    gearWeight: 0.20,
    requiredWeatherData: true,
    focus: 'weather',
  },
  {
    sportId: 'bmx',
    category: 'urban',
    sportMultiplier: 1.0,
    minimumExperience: 2,
    riskBias: 0,
    experienceWeight: 0.30,
    weatherWeight: 0.08,
    terrainWeight: 0.34,
    gearWeight: 0.28,
    requiredWeatherData: false,
    focus: 'terrain',
  },
  {
    sportId: 'free-climbing',
    category: 'mountain',
    sportMultiplier: 1.18,
    minimumExperience: 4,
    riskBias: 8,
    experienceWeight: 0.30,
    weatherWeight: 0.20,
    terrainWeight: 0.30,
    gearWeight: 0.20,
    requiredWeatherData: true,
    focus: 'experience',
  },
  {
    sportId: 'base-jumping',
    category: 'air',
    sportMultiplier: 1.35,
    minimumExperience: 8,
    riskBias: 16,
    experienceWeight: 0.34,
    weatherWeight: 0.30,
    terrainWeight: 0.18,
    gearWeight: 0.18,
    requiredWeatherData: true,
    focus: 'weather',
  },
  {
    sportId: 'paragliding',
    category: 'air',
    sportMultiplier: 1.22,
    minimumExperience: 5,
    riskBias: 10,
    experienceWeight: 0.28,
    weatherWeight: 0.32,
    terrainWeight: 0.18,
    gearWeight: 0.22,
    requiredWeatherData: true,
    focus: 'weather',
  },
  {
    sportId: 'wingsuit',
    category: 'air',
    sportMultiplier: 1.4,
    minimumExperience: 9,
    riskBias: 18,
    experienceWeight: 0.34,
    weatherWeight: 0.30,
    terrainWeight: 0.16,
    gearWeight: 0.20,
    requiredWeatherData: true,
    focus: 'weather',
  },
  {
    sportId: 'surfing',
    category: 'water',
    sportMultiplier: 1.1,
    minimumExperience: 3,
    riskBias: 5,
    experienceWeight: 0.25,
    weatherWeight: 0.30,
    terrainWeight: 0.20,
    gearWeight: 0.25,
    requiredWeatherData: true,
    focus: 'weather',
  },
  {
    sportId: 'motocross',
    category: 'motor',
    sportMultiplier: 1.2,
    minimumExperience: 4,
    riskBias: 9,
    experienceWeight: 0.30,
    weatherWeight: 0.12,
    terrainWeight: 0.28,
    gearWeight: 0.30,
    requiredWeatherData: false,
    focus: 'gear',
  },
  {
    sportId: 'mountain-biking',
    category: 'mountain',
    sportMultiplier: 1.08,
    minimumExperience: 3,
    riskBias: 4,
    experienceWeight: 0.28,
    weatherWeight: 0.18,
    terrainWeight: 0.30,
    gearWeight: 0.24,
    requiredWeatherData: true,
    focus: 'terrain',
  },
  {
    sportId: 'duel-king',
    category: 'combat',
    sportMultiplier: 1.26,
    minimumExperience: 5,
    riskBias: 11,
    experienceWeight: 0.28,
    weatherWeight: 0.02,
    terrainWeight: 0.32,
    gearWeight: 0.38,
    requiredWeatherData: false,
    focus: 'gear',
  },
];

const PROFILE_MAP = new Map(SPORT_RISK_PROFILES.map((profile) => [profile.sportId, profile]));

export function getSportRiskProfile(sportId: string): SportRiskProfile | undefined {
  return PROFILE_MAP.get(sportId);
}

export function listSportRiskProfiles(): SportRiskProfile[] {
  return SPORT_RISK_PROFILES.map((profile) => ({ ...profile }));
}

export function validateSportRiskProfiles(): string[] {
  const errors: string[] = [];
  const sportIds = new Set(SPORT_REGISTRY.map((sport) => sport.id));

  for (const sport of SPORT_REGISTRY) {
    if (!PROFILE_MAP.has(sport.id)) {
      errors.push(`missing sport risk profile: ${sport.id}`);
    }
  }

  for (const profile of SPORT_RISK_PROFILES) {
    if (!sportIds.has(profile.sportId)) {
      errors.push(`orphaned sport risk profile: ${profile.sportId}`);
    }
  }

  return errors;
}
