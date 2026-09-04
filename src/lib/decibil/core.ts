// SpajaUltraOmegaCore -∞Ω+∞ — DECIBIL Core
// Kompanija SPAJA — Digitalna Industrija
//
// Glavni motor za merenje i analizu decibela.
// RMS kalkulacija, peak detection, history store, health report.

import type {
  DecibelAnalysisInput,
  DecibelAnalysisResult,
  DecibelHistoryEntry,
  DecibelMeasurement,
  DecibelHealthReport,
} from './types';
import {
  DECIBIL_DEFAULT_THRESHOLDS,
  DECIBIL_MAX_HISTORY,
} from './types';
import {
  calculateRms,
  calculatePeak,
  rmsToDbfs,
  getDecibelStatus,
  mergeThresholds,
  validateSamples,
  generateMeasurementId,
} from './utils';

// In-memory history store (per process/instance)
let _history: DecibelHistoryEntry[] = [];

/** @internal — reset za testove */
export function _resetDecibelHistory(): void {
  _history = [];
}

/**
 * Analizira niz audio uzoraka i vraća DecibelAnalysisResult.
 * Ograničava trajanje mjerenja na DECIBIL_PERFORMANCE_MAX_MS.
 */
export function analyzeDecibels(input: DecibelAnalysisInput): DecibelAnalysisResult {
  const startMs = Date.now();

  const thresholds = mergeThresholds(input.thresholds);
  const source = input.source ?? 'synthetic';
  const sourceId = input.sourceId ?? generateMeasurementId();
  const windowMs = input.windowMs ?? Math.round((input.samples.length / (input.sampleRate || 44100)) * 1000);

  const sampleWarnings = validateSamples(input.samples);

  const rms = calculateRms(input.samples);
  const peak = calculatePeak(input.samples);
  const dbfs = rmsToDbfs(rms);
  const peakDbfs = rmsToDbfs(peak);
  const status = getDecibelStatus(dbfs, thresholds);

  const measurement: DecibelMeasurement = {
    dbfs: isFinite(dbfs) ? dbfs : thresholds.silenceDbfs,
    rms,
    peak,
    status,
    timestamp: new Date().toISOString(),
    sourceId,
    source,
    windowMs,
  };

  // Compute windowed average from recent history + current
  const recentDbfsValues = _history
    .slice(-9)
    .map((e) => e.measurement.dbfs)
    .concat([measurement.dbfs]);
  const average = recentDbfsValues.reduce((a, b) => a + b, 0) / recentDbfsValues.length;

  const peakHold = isFinite(peakDbfs) ? peakDbfs : measurement.dbfs;

  const warnings = [...sampleWarnings];
  if (status === 'clipping') warnings.push('Clipping detektovan: signal prekoračuje -3 dBFS.');
  if (status === 'warning') warnings.push('Upozorenje: signal iznad -12 dBFS.');

  const durationMs = Date.now() - startMs;

  const result: DecibelAnalysisResult = {
    measurement,
    average: parseFloat(average.toFixed(2)),
    peakHold: parseFloat(peakHold.toFixed(2)),
    thresholds,
    valid: sampleWarnings.length === 0,
    warnings,
    durationMs,
  };

  // Persist to history
  addToHistory(measurement);

  return result;
}

/**
 * Dodaje merenje u istoriju, ograničava na DECIBIL_MAX_HISTORY.
 */
function addToHistory(measurement: DecibelMeasurement): void {
  const entry: DecibelHistoryEntry = {
    id: generateMeasurementId(),
    measurement,
    createdAt: new Date().toISOString(),
  };
  _history.push(entry);
  if (_history.length > DECIBIL_MAX_HISTORY) {
    _history = _history.slice(_history.length - DECIBIL_MAX_HISTORY);
  }
}

/**
 * Vraća kopiju istorije merenja (najnoviji posled).
 */
export function getDecibelHistory(limit?: number): DecibelHistoryEntry[] {
  const all = _history.slice().reverse();
  return limit && limit > 0 ? all.slice(0, limit) : all;
}

/**
 * Vraća health report za celokupnu istoriju.
 */
export function getDecibelHealthReport(): DecibelHealthReport {
  if (_history.length === 0) {
    return {
      totalMeasurements: 0,
      silenceCount: 0,
      normalCount: 0,
      warningCount: 0,
      clippingCount: 0,
      averageDbfs: DECIBIL_DEFAULT_THRESHOLDS.silenceDbfs,
      peakDbfs: DECIBIL_DEFAULT_THRESHOLDS.silenceDbfs,
      lastMeasuredAt: null,
    };
  }

  let silenceCount = 0;
  let normalCount = 0;
  let warningCount = 0;
  let clippingCount = 0;
  let sumDbfs = 0;
  let peakDbfs = -Infinity;

  for (const entry of _history) {
    const { status, dbfs } = entry.measurement;
    if (status === 'silence') silenceCount++;
    else if (status === 'normal') normalCount++;
    else if (status === 'warning') warningCount++;
    else if (status === 'clipping') clippingCount++;
    sumDbfs += dbfs;
    if (dbfs > peakDbfs) peakDbfs = dbfs;
  }

  return {
    totalMeasurements: _history.length,
    silenceCount,
    normalCount,
    warningCount,
    clippingCount,
    averageDbfs: parseFloat((sumDbfs / _history.length).toFixed(2)),
    peakDbfs: parseFloat(peakDbfs.toFixed(2)),
    lastMeasuredAt: _history[_history.length - 1]?.createdAt ?? null,
  };
}

/**
 * Vraća jedno sintetičko merenje sa nultim uzorkom (tišina).
 */
export function getSilenceMeasurement(): DecibelMeasurement {
  return {
    dbfs: DECIBIL_DEFAULT_THRESHOLDS.silenceDbfs,
    rms: 0,
    peak: 0,
    status: 'silence',
    timestamp: new Date().toISOString(),
    sourceId: generateMeasurementId(),
    source: 'synthetic',
    windowMs: 0,
  };
}
