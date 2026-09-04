// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI
// Kompanija SPAJA — Digitalna Industrija

import type { Sport } from './types';

export const SPORT_REGISTRY: Sport[] = [
  {
    id: 'skateboarding',
    name: 'Skateboarding',
    category: 'urban',
    riskClass: 'II',
    requiredGear: ['helmet', 'pads'],
    weatherSensitive: false,
  },
  {
    id: 'snowboarding',
    name: 'Snowboarding',
    category: 'snow',
    riskClass: 'III',
    requiredGear: ['helmet', 'goggles', 'boots'],
    weatherSensitive: true,
  },
  {
    id: 'bmx',
    name: 'BMX',
    category: 'urban',
    riskClass: 'III',
    requiredGear: ['helmet', 'pads'],
    weatherSensitive: false,
  },
  {
    id: 'free-climbing',
    name: 'Free Climbing',
    category: 'mountain',
    riskClass: 'IV',
    requiredGear: ['harness', 'helmet', 'boots'],
    weatherSensitive: true,
  },
  {
    id: 'base-jumping',
    name: 'Base Jumping',
    category: 'air',
    riskClass: 'V',
    requiredGear: ['chute', 'helmet'],
    weatherSensitive: true,
  },
  {
    id: 'paragliding',
    name: 'Paragliding',
    category: 'air',
    riskClass: 'IV',
    requiredGear: ['wing', 'harness', 'helmet'],
    weatherSensitive: true,
  },
  {
    id: 'wingsuit',
    name: 'Wingsuit Flying',
    category: 'air',
    riskClass: 'V',
    requiredGear: ['chute', 'wing', 'helmet'],
    weatherSensitive: true,
  },
  {
    id: 'surfing',
    name: 'Surfing',
    category: 'water',
    riskClass: 'III',
    requiredGear: ['wetsuit'],
    weatherSensitive: true,
  },
  {
    id: 'motocross',
    name: 'Motocross',
    category: 'motor',
    riskClass: 'IV',
    requiredGear: ['helmet', 'pads', 'boots'],
    weatherSensitive: false,
  },
  {
    id: 'mountain-biking',
    name: 'Mountain Biking',
    category: 'mountain',
    riskClass: 'III',
    requiredGear: ['helmet', 'pads', 'bike'],
    weatherSensitive: true,
  },
  {
    id: 'duel-king',
    name: 'DUEL KING',
    category: 'combat',
    riskClass: 'IV',
    requiredGear: ['helmet', 'pads', 'boots'],
    weatherSensitive: false,
  },
];

export function getSportById(id: string): Sport | undefined {
  return SPORT_REGISTRY.find((s) => s.id === id);
}

export function getSportsByCategory(category: Sport['category']): Sport[] {
  return SPORT_REGISTRY.filter((s) => s.category === category);
}

export function getSportsByRiskClass(riskClass: Sport['riskClass']): Sport[] {
  return SPORT_REGISTRY.filter((s) => s.riskClass === riskClass);
}
