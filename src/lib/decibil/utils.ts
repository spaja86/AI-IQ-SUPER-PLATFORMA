// SpajaUltraOmegaCore -∞Ω+∞ — DECIBIL Utils
// Kompanija SPAJA — Digitalna Industrija
//
// Helper funkcije: RMS kalkulacija, dBFS konverzija, normalizacija, peak detection.

import type { DecibelStatus, DecibelThresholds } from './types';
import { DECIBIL_DEFAULT_THRESHOLDS } from './types';

/**
 * Izračunava Root Mean Square (RMS) vrednost niza uzoraka.
 * Vraća 0 za prazan ili nevažeći niz.
 */
export function calculateRms(samples: number[]): number {
  if (!samples || samples.length === 0) return 0;
  const validSamples = samples.filter((s) => isFinite(s) && !isNaN(s));
  if (validSamples.length === 0) return 0;
  const sumOfSquares = validSamples.reduce((acc, s) => acc + s * s, 0);
  return Math.sqrt(sumOfSquares / validSamples.length);
}

/**
 * Konvertuje linearnu RMS vrednost u dBFS (Decibels Full Scale).
 * Vraća -Infinity za nulu (tišina), ograničava gornju granicu na 0 dBFS.
 */
export function rmsToDbfs(rms: number): number {
  if (!isFinite(rms) || isNaN(rms) || rms <= 0) return -Infinity;
  const dbfs = 20 * Math.log10(rms);
  return Math.min(0, dbfs);
}

/**
 * Konvertuje dBFS vrednost u linearnu amplitudu (0–1).
 */
export function dbfsToLinear(dbfs: number): number {
  if (!isFinite(dbfs) || isNaN(dbfs)) return 0;
  return Math.pow(10, dbfs / 20);
}

/**
 * Pronalazi peak (maksimalnu apsolutnu) vrednost u nizu uzoraka.
 * Vraća 0 za prazan niz.
 */
export function calculatePeak(samples: number[]): number {
  if (!samples || samples.length === 0) return 0;
  const validSamples = samples.filter((s) => isFinite(s) && !isNaN(s));
  if (validSamples.length === 0) return 0;
  return Math.max(...validSamples.map(Math.abs));
}

/**
 * Određuje status na osnovu dBFS vrednosti i pragova.
 */
export function getDecibelStatus(
  dbfs: number,
  thresholds: DecibelThresholds = DECIBIL_DEFAULT_THRESHOLDS,
): DecibelStatus {
  if (!isFinite(dbfs) || dbfs <= thresholds.silenceDbfs) return 'silence';
  if (dbfs > thresholds.clippingDbfs) return 'clipping';
  if (dbfs > thresholds.warningDbfs) return 'warning';
  return 'normal';
}

/**
 * Normalizuje niz uzoraka na opseg [-1, 1].
 * Vraća originalni niz ako je peak 0.
 */
export function normalizeSamples(samples: number[]): number[] {
  if (!samples || samples.length === 0) return [];
  const peak = calculatePeak(samples);
  if (peak === 0) return samples.slice();
  return samples.map((s) => (isFinite(s) && !isNaN(s) ? s / peak : 0));
}

/**
 * Spaja parcijalne pragove sa podrazumevanim vrednostima.
 */
export function mergeThresholds(
  partial?: Partial<DecibelThresholds>,
): DecibelThresholds {
  return {
    ...DECIBIL_DEFAULT_THRESHOLDS,
    ...(partial ?? {}),
  };
}

/**
 * Validira niz uzoraka i vraća listu upozorenja.
 */
export function validateSamples(samples: number[]): string[] {
  const warnings: string[] = [];
  if (!samples || samples.length === 0) {
    warnings.push('Niz uzoraka je prazan.');
    return warnings;
  }
  const nanCount = samples.filter((s) => isNaN(s)).length;
  const infCount = samples.filter((s) => !isFinite(s) && !isNaN(s)).length;
  if (nanCount > 0) warnings.push(`Pronađeno ${nanCount} NaN vrednosti u uzorcima.`);
  if (infCount > 0) warnings.push(`Pronađeno ${infCount} Infinity vrednosti u uzorcima.`);
  return warnings;
}

/**
 * Generiše unikalni ID za merenje.
 */
export function generateMeasurementId(): string {
  return `decibil-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
