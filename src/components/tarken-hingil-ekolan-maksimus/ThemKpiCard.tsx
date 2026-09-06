'use client';

// SpajaUltraOmegaCore -∞Ω+∞ — THEM (Tarken-Hingil-Ekolan-Maksimus) KPI Card
// Kompanija SPAJA — Digitalna Industrija
// Apex strategic orchestrator — octave 16, node 256

import { useCallback, useEffect, useState } from 'react';

interface ThemResult {
  ukupanScore: number;
  ocena: string;
  konvergencija: number;
  meta: { handoffNeeded: boolean };
  durationMs: number;
}

interface ThemKpiCardProps {
  className?: string;
}

export function ThemKpiCard({ className = '' }: ThemKpiCardProps) {
  const [result, setResult] = useState<ThemResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResult = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch('/api/tarken-hingil-ekolan-maksimus');
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const json = await r.json() as { data?: ThemResult } | ThemResult;
      const payload = (json as { data?: ThemResult }).data ?? (json as ThemResult);
      setResult(payload && typeof payload.ukupanScore === 'number' ? payload : null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Greška');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchResult(); }, [fetchResult]);

  const konvColor = result && result.konvergencija >= 0.95 ? '#22c55e' : '#f59e0b';

  return (
    <section className={`rounded-xl border border-rose-700 bg-slate-900/40 p-4 text-slate-100 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-wide uppercase text-rose-300">THEM — Apex Orchestrator</h3>
        <span className="text-xs text-slate-500">Oct.16 · Node 256</span>
      </div>
      {loading && <p className="mt-2 text-xs text-slate-400">Orkestracija...</p>}
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      {result && (
        <div className="mt-2 space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold font-mono text-rose-400">
              {result.ukupanScore.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p>Ocena: <strong>{result.ocena}</strong></p>
            <p>Trajanje: <strong>{result.durationMs}ms</strong></p>
            <p>
              Konvergencija:{' '}
              <strong style={{ color: konvColor }}>
                {result.konvergencija != null ? (result.konvergencija * 100).toFixed(1) + '%' : 'N/A'}
              </strong>
            </p>
            <p>Handoff: <strong>{result.meta?.handoffNeeded ? 'Da' : 'Ne'}</strong></p>
          </div>
        </div>
      )}
    </section>
  );
}
