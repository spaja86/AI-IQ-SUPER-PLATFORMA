'use client';

// SpajaUltraOmegaCore -∞Ω+∞ — DECIBIL DecibelAlerts Component
// Kompanija SPAJA — Digitalna Industrija

import { useEffect, useState, useCallback } from 'react';
import type { DecibelHistoryEntry } from '@/lib/decibil';

interface DecibelAlertsProps {
  limit?: number;
  pollingIntervalMs?: number;
  className?: string;
}

const ALERT_STATUSES = ['warning', 'clipping'] as const;

const STATUS_LABELS: Record<string, string> = {
  warning: '⚠️ Upozorenje',
  clipping: '🔴 Clipping',
};

const STATUS_COLORS: Record<string, string> = {
  warning: '#f59e0b',
  clipping: '#ef4444',
};

export function DecibelAlerts({
  limit = 10,
  pollingIntervalMs = 5000,
  className = '',
}: DecibelAlertsProps) {
  const [alerts, setAlerts] = useState<DecibelHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/decibil/history?limit=100`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const history: DecibelHistoryEntry[] = (json.data ?? json).history ?? [];
      const filtered = history
        .filter((e) => ALERT_STATUSES.includes(e.measurement.status as typeof ALERT_STATUSES[number]))
        .slice(0, limit);
      setAlerts(filtered);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Greška pri učitavanju alerta.');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, pollingIntervalMs);
    return () => clearInterval(interval);
  }, [fetchAlerts, pollingIntervalMs]);

  return (
    <div className={`flex flex-col gap-2 p-4 rounded-xl border border-gray-700 ${className}`}>
      <div className="text-xs font-mono text-gray-400 uppercase tracking-widest">DECIBIL Alarmi</div>

      {alerts.length === 0 && !loading && (
        <div className="text-xs text-gray-500">Nema aktivnih alarma.</div>
      )}

      <div className="flex flex-col gap-1">
        {alerts.map((entry) => {
          const color = STATUS_COLORS[entry.measurement.status] ?? '#6b7280';
          const label = STATUS_LABELS[entry.measurement.status] ?? entry.measurement.status;
          return (
            <div
              key={entry.id}
              className="flex items-center justify-between rounded px-3 py-1.5 text-xs"
              style={{ backgroundColor: `${color}22`, borderLeft: `3px solid ${color}` }}
            >
              <span style={{ color }} className="font-semibold">{label}</span>
              <span className="font-mono text-gray-300">{entry.measurement.dbfs.toFixed(1)} dBFS</span>
              <span className="text-gray-500">{new Date(entry.measurement.timestamp).toLocaleTimeString()}</span>
            </div>
          );
        })}
      </div>

      {loading && <div className="text-xs text-gray-500">Osvežavanje...</div>}
      {error && <div className="text-xs text-red-400">{error}</div>}
    </div>
  );
}
