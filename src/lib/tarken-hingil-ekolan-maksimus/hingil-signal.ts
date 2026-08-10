// SpajaUltraOmegaCore -∞Ω+∞ — TARKEN HINGIL EKOLAN MAKSIMUS — Hingil Signal
// Kompanija SPAJA — Digitalna Industrija
//
// Adaptive signal processing: input normalization, noise filtering,
// pattern detection, NaN/Infinity/empty edge cases.

export interface HingilSignalResult {
  normalized: number[];
  mean: number;
  peak: number;
  rms: number;
  noiseFiltered: boolean;
  patternDetected: boolean;
  patternLabel: string | null;
  valid: boolean;
  errorReason: string | null;
}

/**
 * Normalizuje ulazni niz signala na opseg [0, 1].
 * Bezbedno rukuje NaN, Infinity i praznim nizovima.
 */
export function normalizeSignal(samples: number[]): HingilSignalResult {
  const empty: HingilSignalResult = {
    normalized: [],
    mean: 0,
    peak: 0,
    rms: 0,
    noiseFiltered: false,
    patternDetected: false,
    patternLabel: null,
    valid: false,
    errorReason: 'Prazni ili nevalidni uzorci.',
  };

  if (!samples || samples.length === 0) return empty;

  // Filter NaN i Infinity
  const clean = samples.filter((s) => Number.isFinite(s));
  if (clean.length === 0) return { ...empty, errorReason: 'Svi uzorci su NaN ili Infinity.' };

  const min = Math.min(...clean);
  const max = Math.max(...clean);
  const range = max - min;

  const normalized = range === 0
    ? clean.map(() => 0.5)
    : clean.map((s) => (s - min) / range);

  const mean = normalized.reduce((a, b) => a + b, 0) / normalized.length;
  const peak = Math.max(...normalized);
  const rms = Math.sqrt(normalized.reduce((a, b) => a + b * b, 0) / normalized.length);

  // Heuristic noise filter: filter if stdDev is very small (flat signal)
  const variance = normalized.reduce((a, b) => a + (b - mean) ** 2, 0) / normalized.length;
  const stdDev = Math.sqrt(variance);
  const noiseFiltered = stdDev < 0.05;

  // Pattern detection heuristic
  const patternDetected = peak > 0.8 && mean > 0.5;
  const patternLabel = patternDetected ? 'visoki-signal-pattern' : null;

  return {
    normalized,
    mean: parseFloat(mean.toFixed(4)),
    peak: parseFloat(peak.toFixed(4)),
    rms: parseFloat(rms.toFixed(4)),
    noiseFiltered,
    patternDetected,
    patternLabel,
    valid: true,
    errorReason: null,
  };
}

/**
 * Generiše adaptive score na osnovu obrađenog signala.
 */
export function computeHingilScore(result: HingilSignalResult): number {
  if (!result.valid) return 40;
  const baseScore = result.rms * 100;
  const peakBonus = result.peak > 0.85 ? 5 : 0;
  return Math.max(0, Math.min(100, Math.round(baseScore + peakBonus)));
}
