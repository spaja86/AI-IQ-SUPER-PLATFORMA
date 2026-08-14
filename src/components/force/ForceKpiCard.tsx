'use client';

// SpajaUltraOmegaCore -∞Ω+∞ — FORCE KPI Card Component
// Kompanija SPAJA — Digitalna Industrija
// FORCE — Fokusirana Orkestracija Reakcionih i Ciljnih Energija

import { useCallback, useEffect, useState } from 'react';

interface ForceDomenScore {
  fokus: number;
  operativa: number;
  reakcija: number;
  cilj: number;
  energija: number;
  snaga: number;
}

interface ForceResult {
  ukupanScore: number;
  ocena: string;
  domeni: ForceDomenScore;
  durationMs: number;
}

interface ForceKpiCardProps {
  className?: string;
}

const DOMAIN_LABELS: Record<keyof ForceDomenScore, string> = {
  fokus: 'Fokus',
  operativa: 'Operativa',
  reakcija: 'Reakcija',
  cilj: 'Cilj',
  energija: 'Energija',
  snaga: 'Snaga',
};

export function ForceKpiCard({ className = '' }: ForceKpiCardProps) {
  const [result, setResult] = useState<ForceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResult = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch('/api/force');
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const json = await r.json() as { data?: ForceResult } | ForceResult;
      setResult(('data' in json ? json.data : json) ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Greška');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchResult(); }, [fetchResult]);

  const scoreColor =
    result && result.ukupanScore >= 80
      ? '#22c55e'
      : result && result.ukupanScore >= 60
        ? '#f59e0b'
        : '#ef4444';

  return (
    <section className={`rounded-xl border border-orange-700 bg-slate-900/40 p-4 text-slate-100 ${className}`}>
      <h3 className="text-sm font-semibold tracking-wide uppercase text-orange-300">FORCE Engine</h3>
      {loading && <p className="mt-2 text-xs text-slate-400">Procesiranje...</p>}
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      {result && (
        <div className="mt-2 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold font-mono" style={{ color: scoreColor }}>
              {result.ukupanScore.toFixed(1)}
            </span>
            <div>
              <div className="text-xs text-slate-400">Ocena</div>
              <div className="text-sm font-semibold">{result.ocena}</div>
            </div>
          </div>

          {/* Domain bars */}
          {result.domeni && (
            <div className="space-y-1">
              {(Object.keys(DOMAIN_LABELS) as (keyof ForceDomenScore)[]).map(key => (
                <div key={key} className="flex items-center gap-2">
                  <span className="w-20 text-xs text-slate-400">{DOMAIN_LABELS[key]}</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-700">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, result.domeni[key])}%`,
                        backgroundColor: scoreColor,
                      }}
                    />
                  </div>
                  <span className="w-8 text-right text-xs font-mono">{result.domeni[key].toFixed(0)}</span>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-slate-400">Trajanje: {result.durationMs}ms</p>
        </div>
      )}
    </section>
  );
}
