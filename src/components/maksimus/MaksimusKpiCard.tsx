'use client';

// SpajaUltraOmegaCore -∞Ω+∞ — MAKSIMUS KPI Card Component
// Kompanija SPAJA — Digitalna Industrija

import { useCallback, useEffect, useState } from 'react';

interface MaksimusResult {
  ukupanScore: number;
  ocena: string;
  meta: { handoffNeeded: boolean; specijalizacija: string };
  durationMs: number;
}

interface MaksimusKpiCardProps {
  className?: string;
}

export function MaksimusKpiCard({ className = '' }: MaksimusKpiCardProps) {
  const [result, setResult] = useState<MaksimusResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResult = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch('/api/maksimus');
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const json = await r.json() as { data?: MaksimusResult } | MaksimusResult;
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
    <section className={`rounded-xl border border-amber-700 bg-slate-900/40 p-4 text-slate-100 ${className}`}>
      <h3 className="text-sm font-semibold tracking-wide uppercase text-amber-300">MAKSIMUS — Analitički Apex</h3>
      {loading && <p className="mt-2 text-xs text-slate-400">Procesiranje...</p>}
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      {result && (
        <div className="mt-2 space-y-2">
          <div className="flex items-center gap-3">
            <span
              className="text-3xl font-bold font-mono"
              style={{ color: scoreColor }}
            >
              {result.ukupanScore.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p>Ocena: <strong>{result.ocena}</strong></p>
            <p>Trajanje: <strong>{result.durationMs}ms</strong></p>
            <p>Spec: <strong className="text-xs">{result.meta?.specijalizacija}</strong></p>
            <p>Handoff: <strong>{result.meta?.handoffNeeded ? 'Da' : 'Ne'}</strong></p>
          </div>
        </div>
      )}
    </section>
  );
}
