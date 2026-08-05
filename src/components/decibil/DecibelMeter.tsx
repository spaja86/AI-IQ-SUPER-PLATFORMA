'use client';

// SpajaUltraOmegaCore -∞Ω+∞ — DECIBIL DecibelMeter Component
// Kompanija SPAJA — Digitalna Industrija

import { useEffect, useState, useCallback } from 'react';
import type { DecibelMeasurement, DecibelAnalysisInput } from '@/lib/decibil';
import { DECIBIL_DEFAULT_THRESHOLDS } from '@/lib/decibil';

interface DecibelMeterProps {
  samples?: number[];
  sampleRate?: number;
  source?: DecibelAnalysisInput['source'];
  pollingIntervalMs?: number;
  className?: string;
}

const STATUS_COLORS: Record<string, string> = {
  silence: '#6b7280',
  normal: '#22c55e',
  warning: '#f59e0b',
  clipping: '#ef4444',
};

const STATUS_LABELS: Record<string, string> = {
  silence: 'Tišina',
  normal: 'Normalno',
  warning: 'Upozorenje',
  clipping: 'Clipping',
};

export function DecibelMeter({
  samples,
  sampleRate = 44100,
  source = 'synthetic',
  pollingIntervalMs = 1000,
  className = '',
}: DecibelMeterProps) {
  const [measurement, setMeasurement] = useState<DecibelMeasurement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMeasurement = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let res: Response;
      if (samples && samples.length > 0) {
        res = await fetch('/api/decibil/measure', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ samples, sampleRate, source }),
        });
      } else {
        res = await fetch('/api/decibil/measure');
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setMeasurement(json.data ?? json);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Greška pri merenju.');
    } finally {
      setLoading(false);
    }
  }, [samples, sampleRate, source]);

  useEffect(() => {
    fetchMeasurement();
    const interval = setInterval(fetchMeasurement, pollingIntervalMs);
    return () => clearInterval(interval);
  }, [fetchMeasurement, pollingIntervalMs]);

  const dbfs = measurement?.dbfs ?? DECIBIL_DEFAULT_THRESHOLDS.silenceDbfs;
  const status = measurement?.status ?? 'silence';
  const color = STATUS_COLORS[status] ?? '#6b7280';
  const label = STATUS_LABELS[status] ?? status;

  // Map dBFS [-60, 0] to percentage [0, 100]
  const pct = Math.max(0, Math.min(100, ((dbfs - (-60)) / 60) * 100));

  return (
    <div className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${className}`} style={{ borderColor: color }}>
      <div className="text-xs font-mono text-gray-400 uppercase tracking-widest">DECIBIL Meter</div>

      {/* VU bar */}
      <div className="w-full h-4 rounded-full bg-gray-800 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-200"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>

      {/* dBFS value */}
      <div className="text-2xl font-bold font-mono" style={{ color }}>
        {isFinite(dbfs) ? `${dbfs.toFixed(1)} dBFS` : '−∞ dBFS'}
      </div>

      {/* Status badge */}
      <div className="px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: color, color: '#fff' }}>
        {label}
      </div>

      {loading && <div className="text-xs text-gray-500">Merenje...</div>}
      {error && <div className="text-xs text-red-400">{error}</div>}
    </div>
  );
}
