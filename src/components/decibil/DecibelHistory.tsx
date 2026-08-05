'use client';

// SpajaUltraOmegaCore -∞Ω+∞ — DECIBIL DecibelHistory Component
// Kompanija SPAJA — Digitalna Industrija

import { useEffect, useState, useCallback } from 'react';
import type { DecibelHistoryEntry, DecibelHealthReport } from '@/lib/decibil';

interface HistoryResponse {
  history: DecibelHistoryEntry[];
  healthReport: DecibelHealthReport;
}

interface DecibelHistoryProps {
  limit?: number;
  pollingIntervalMs?: number;
  className?: string;
}

const STATUS_COLORS: Record<string, string> = {
  silence: '#6b7280',
  normal: '#22c55e',
  warning: '#f59e0b',
  clipping: '#ef4444',
};

export function DecibelHistory({
  limit = 20,
  pollingIntervalMs = 5000,
  className = '',
}: DecibelHistoryProps) {
  const [data, setData] = useState<HistoryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/decibil/history?limit=${limit}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json.data ?? json);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Greška pri učitavanju istorije.');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, pollingIntervalMs);
    return () => clearInterval(interval);
  }, [fetchHistory, pollingIntervalMs]);

  const history = data?.history ?? [];
  const report = data?.healthReport;

  return (
    <div className={`flex flex-col gap-3 p-4 rounded-xl border border-gray-700 ${className}`}>
      <div className="text-xs font-mono text-gray-400 uppercase tracking-widest">DECIBIL Istorija</div>

      {/* Health summary */}
      {report && (
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="rounded bg-gray-800 p-2">
            <div className="font-bold text-green-400">{report.normalCount}</div>
            <div className="text-gray-500">Normalno</div>
          </div>
          <div className="rounded bg-gray-800 p-2">
            <div className="font-bold text-yellow-400">{report.warningCount}</div>
            <div className="text-gray-500">Upozorenje</div>
          </div>
          <div className="rounded bg-gray-800 p-2">
            <div className="font-bold text-red-400">{report.clippingCount}</div>
            <div className="text-gray-500">Clipping</div>
          </div>
          <div className="rounded bg-gray-800 p-2">
            <div className="font-bold text-gray-400">{report.silenceCount}</div>
            <div className="text-gray-500">Tišina</div>
          </div>
        </div>
      )}

      {/* Mini chart — bar per entry */}
      <div className="flex items-end gap-0.5 h-16 w-full">
        {history.map((entry) => {
          const dbfs = entry.measurement.dbfs;
          const pct = Math.max(2, Math.min(100, ((dbfs - (-60)) / 60) * 100));
          const color = STATUS_COLORS[entry.measurement.status] ?? '#6b7280';
          return (
            <div
              key={entry.id}
              title={`${dbfs.toFixed(1)} dBFS — ${entry.measurement.status}`}
              className="flex-1 rounded-sm"
              style={{ height: `${pct}%`, backgroundColor: color, opacity: 0.8 }}
            />
          );
        })}
        {history.length === 0 && (
          <div className="text-xs text-gray-500 m-auto">Nema podataka.</div>
        )}
      </div>

      {loading && <div className="text-xs text-gray-500">Učitavanje...</div>}
      {error && <div className="text-xs text-red-400">{error}</div>}
    </div>
  );
}
