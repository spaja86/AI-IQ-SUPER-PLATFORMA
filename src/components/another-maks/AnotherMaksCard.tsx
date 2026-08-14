'use client';

// SpajaUltraOmegaCore -∞Ω+∞ — ANOTHER MAKS Card Component
// Kompanija SPAJA — Digitalna Industrija

import { useCallback, useEffect, useState } from 'react';

interface AnotherMaksResult {
  ukupanScore: number;
  ocena: string;
  meta: { specijalizacija: string };
  durationMs: number;
}

interface AnotherMaksCardProps {
  className?: string;
}

export function AnotherMaksCard({ className = '' }: AnotherMaksCardProps) {
  const [result, setResult] = useState<AnotherMaksResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResult = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch('/api/another-maks');
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const json = await r.json() as { data?: AnotherMaksResult } | AnotherMaksResult;
      setResult(('data' in json ? json.data : json) ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Greška');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchResult(); }, [fetchResult]);

  return (
    <section className={`rounded-xl border border-purple-700 bg-slate-900/40 p-4 text-slate-100 ${className}`}>
      <h3 className="text-sm font-semibold tracking-wide uppercase text-purple-300">ANOTHER MAKS — Kreativni Agent</h3>
      {loading && <p className="mt-2 text-xs text-slate-400">Generisanje...</p>}
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      {result && (
        <div className="mt-2 space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold font-mono text-purple-400">
              {result.ukupanScore.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p>Ocena: <strong>{result.ocena}</strong></p>
            <p>Trajanje: <strong>{result.durationMs}ms</strong></p>
            <p className="col-span-2 text-xs text-slate-400">Spec: {result.meta?.specijalizacija}</p>
          </div>
        </div>
      )}
    </section>
  );
}
