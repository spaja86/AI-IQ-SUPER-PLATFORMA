// SpajaUltraOmegaCore -∞Ω+∞ — PROSPARITET Registry
// Kompanija SPAJA — Digitalna Industrija

import type {
  ProsparitetAction,
  ProsparitetHorizon,
  ProsparitetObjective,
  ProsparitetRiskAppetite,
} from './types';

export const VALID_PROSPARITET_OBJECTIVES: ProsparitetObjective[] = ['CASHFLOW', 'SAVINGS', 'INVESTMENT', 'EXPANSION'];
export const VALID_PROSPARITET_HORIZONS: ProsparitetHorizon[] = ['SHORT', 'MEDIUM', 'LONG'];
export const VALID_PROSPARITET_RISK_APPETITES: ProsparitetRiskAppetite[] = ['LOW', 'MEDIUM', 'HIGH'];

export const OBJECTIVE_BASE_BOOST: Record<ProsparitetObjective, number> = {
  CASHFLOW: 6,
  SAVINGS: 5,
  INVESTMENT: 8,
  EXPANSION: 10,
};

export const HORIZON_BASE_SCORE: Record<ProsparitetHorizon, number> = {
  SHORT: 64,
  MEDIUM: 76,
  LONG: 82,
};

export const RISK_APPETITE_FACTOR: Record<ProsparitetRiskAppetite, number> = {
  LOW: 0.86,
  MEDIUM: 1,
  HIGH: 1.12,
};

export const ACTION_BASELINE: Record<ProsparitetAction, number> = {
  STABILIZE_BASE: 30,
  BUILD_BUFFER: 45,
  OPTIMIZE_ALLOCATION: 65,
  SCALE_CONFIDENTLY: 82,
};
