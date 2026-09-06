'use client';

// SpajaUltraOmegaCore -∞Ω+∞ — Nova Generacija Status Card Component
// Kompanija SPAJA — Digitalna Industrija
// SpajaPro 16 Hipermreza — 16×16, 256 čvorova

import { useCallback, useEffect, useMemo, useState } from 'react';

interface NgSession {
  sessionId: string;
  mod: string;
  status: string;
  fairnessStatus: string;
  playersCount: number;
  durationMs: number;
}

interface NovaGeneracijaCardProps {
  className?: string;
}

const STATUS_COLOR: Record<string, string> = {
  'u-toku': '#22c55e',
  'završen': '#3b82f6',
  'čekanje': '#f59e0b',
  'prekinut': '#ef4444',
};

const FAIRNESS_COLOR: Record<string, string> = {
  'prošao': '#22c55e',
  'upozorenje': '#f59e0b',
  'prekršaj': '#f97316',
  'diskvalifikacija': '#ef4444',
};

export function NovaGeneracijaCard({ className = '' }: NovaGeneracijaCardProps) {
  const [session, setSession] = useState<NgSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch('/api/nova-generacija');
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const json = await r.json() as { data?: NgSession } | NgSession;
      const payload = (json as { data?: NgSession }).data ?? (json as NgSession);
      setSession(payload && typeof payload.sessionId === 'string' ? payload : null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Greška');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchSession(); }, [fetchSession]);

  const statusColor = session ? STATUS_COLOR[session.status] ?? '#6b7280' : '#6b7280';
  const fairnessColor = session ? FAIRNESS_COLOR[session.fairnessStatus] ?? '#6b7280' : '#6b7280';

  const gridCells = useMemo(() => {
    const activeCount = (session?.playersCount ?? 0) * 16;
    return Array.from({ length: 256 }, (_, i) => (
      <div
        key={i}
        className="aspect-square rounded-sm"
        style={{ backgroundColor: i < activeCount ? statusColor : '#1e293b' }}
      />
    ));
  }, [session?.playersCount, statusColor]);

  return (
    <section className={`rounded-xl border bg-slate-900/40 p-4 text-slate-100 ${className}`} style={{ borderColor: statusColor }}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-wide uppercase" style={{ color: statusColor }}>
          Nova Generacija Gaming
        </h3>
        <span className="text-xs text-slate-500">SpajaPro 16</span>
      </div>

      {/* Hipermreza grid visualization (mini) */}
      <div className="mt-2 grid gap-px" style={{ gridTemplateColumns: 'repeat(16, 1fr)' }}>
        {gridCells}
      </div>

      {loading && <p className="mt-2 text-xs text-slate-400">Inicijalizacija...</p>}
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      {session && (
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <p>Mod: <strong>{session.mod}</strong></p>
          <p>Igrači: <strong>{session.playersCount}</strong></p>
          <p>Status: <strong style={{ color: statusColor }}>{session.status}</strong></p>
          <p>Fairness: <strong style={{ color: fairnessColor }}>{session.fairnessStatus}</strong></p>
          <p className="col-span-2 text-xs text-slate-400 font-mono truncate">ID: {session.sessionId}</p>
        </div>
      )}
    </section>
  );
}
