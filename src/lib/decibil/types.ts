// SpajaUltraOmegaCore -∞Ω+∞ — DECIBIL
// Kompanija SPAJA — Digitalna Industrija
//
// TypeScript types za DECIBIL — decibel-based audio/signal measurement system.

export type DecibelStatus = 'silence' | 'normal' | 'warning' | 'clipping';
export type DecibelInputSource = 'microphone' | 'audio-file' | 'stream' | 'synthetic';

export interface DecibelThresholds {
  silenceDbfs: number;   // below this → silence (default: -60)
  warningDbfs: number;   // above this → warning (default: -12)
  clippingDbfs: number;  // above this → clipping (default: -3)
}

export interface DecibelMeasurement {
  dbfs: number;
  rms: number;
  peak: number;
  status: DecibelStatus;
  timestamp: string;
  sourceId: string;
  source: DecibelInputSource;
  windowMs: number;
}

export interface DecibelAnalysisInput {
  samples: number[];
  sampleRate: number;
  windowMs?: number;
  source?: DecibelInputSource;
  sourceId?: string;
  thresholds?: Partial<DecibelThresholds>;
}

export interface DecibelAnalysisResult {
  measurement: DecibelMeasurement;
  average: number;
  peakHold: number;
  thresholds: DecibelThresholds;
  valid: boolean;
  warnings: string[];
  durationMs: number;
}

export interface DecibelHistoryEntry {
  id: string;
  measurement: DecibelMeasurement;
  createdAt: string;
}

export interface DecibelHealthReport {
  totalMeasurements: number;
  silenceCount: number;
  normalCount: number;
  warningCount: number;
  clippingCount: number;
  averageDbfs: number;
  peakDbfs: number;
  lastMeasuredAt: string | null;
}

export const DECIBIL_CONTRACT_VERSION = 'v1';
export const DECIBIL_MODULE_VERSION = '1.0.0';
export const DECIBIL_SOURCE_OF_TRUTH = '/api/decibil/measure';

export const DECIBIL_DEFAULT_THRESHOLDS: DecibelThresholds = {
  silenceDbfs: -60,
  warningDbfs: -12,
  clippingDbfs: -3,
};

export const DECIBIL_MAX_HISTORY = 1000;
export const DECIBIL_PERFORMANCE_MAX_MS = 50;
