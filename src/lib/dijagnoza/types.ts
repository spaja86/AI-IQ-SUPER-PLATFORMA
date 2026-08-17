// SpajaUltraOmegaCore -∞Ω+∞ — DIJAGNOZA
// Kompanija SPAJA — Digitalna Industrija

export type DijagnozaUrgency = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type DijagnozaNextStep = 'EMERGENCY' | 'DOCTOR' | 'MONITORING' | 'REST';
export type DijagnozaGender = 'MALE' | 'FEMALE' | 'OTHER';

export interface DijagnozaVitals {
  temperatureC?: number;
  pulseBpm?: number;
  systolicMmHg?: number;
  diastolicMmHg?: number;
  spO2Percent?: number;
}

export interface DijagnozaProfileInput {
  patientId?: string;
  ageYears?: number;
  gender?: DijagnozaGender;
  chronicConditions?: string[];
  currentMedications?: string[];
}

export interface DijagnozaInput {
  referenceId?: string;
  profile: DijagnozaProfileInput;
  symptoms: string[];
  vitals?: DijagnozaVitals;
  durationDays: number;
  additionalNotes?: string;
}

export interface DijagnozaDifferential {
  name: string;
  probability: number;
  icdCode?: string;
}

export interface DijagnozaResult {
  referenceId: string;
  patientId: string;
  primaryDiagnosis: string;
  differentials: DijagnozaDifferential[];
  urgency: DijagnozaUrgency;
  nextStep: DijagnozaNextStep;
  warnings: string[];
  disclaimer: string;
  valid: boolean;
  durationMs: number;
}

export interface DijagnozaHealthReport {
  personaId: string;
  contractVersion: string;
  moduleVersion: string;
  evaluations: number;
  lastUrgency: DijagnozaUrgency;
  performanceMaxMs: number;
  apiResponseMaxMs: number;
}

export const DIJAGNOZA_CONTRACT_VERSION = 'v1';
export const DIJAGNOZA_MODULE_VERSION = '1.0.0';
export const DIJAGNOZA_PERSONA_ID = 'dijagnoza-core';
export const DIJAGNOZA_PERFORMANCE_MAX_MS = 50;
export const DIJAGNOZA_API_RESPONSE_MAX_MS = 200;
export const DIJAGNOZA_MAX_DURATION_DAYS = 730;
export const DIJAGNOZA_DISCLAIMER =
  'Ovo je automatska samo-procena, a NE medicinski savet. Konsultujte lekara za tačnu dijagnozu i lečenje.';
