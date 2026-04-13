'use client';

import { useState, useCallback } from 'react';

interface DiagnosticResult {
  status: string;
  diagnostic: {
    score: number;
    overallStatus: string;
    summary: {
      total: number;
      passed: number;
      failed: number;
      warnings: number;
      autoFixable: number;
    };
  };
  repair?: {
    summary: {
      total: number;
      completed: number;
      failed: number;
      skipped: number;
    };
    newScore: number;
  };
  scoreBefore?: number;
  scoreAfter?: number;
}

export default function AutoRepairActions() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [action, setAction] = useState<'diagnose' | 'repair' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runDiagnostic = useCallback(async () => {
    setLoading(true);
    setAction('diagnose');
    setResult(null);
    setError(null);
    try {
      const res = await fetch('/api/auto-repair');
      const data = await res.json();
      setResult(data);
    } catch {
      setResult(null);
      setError('Dijagnostika nije uspela. Pokušajte ponovo.');
    } finally {
      setLoading(false);
    }
  }, []);

  const runRepair = useCallback(async () => {
    setLoading(true);
    setAction('repair');
    setResult(null);
    setError(null);
    try {
      const res = await fetch('/api/auto-repair', { method: 'POST' });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult(null);
      setError('Auto-popravka nije uspela. Pokušajte ponovo.');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="mt-10">
      {/* Error display */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-500/20 border border-red-500/40 p-4 text-red-200 text-sm">
          {error}
        </div>
      )}
      {/* Action buttons */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={runDiagnostic}
          disabled={loading}
          className="rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#2563eb] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-[#7c3aed]/25 hover:brightness-110 disabled:opacity-50"
        >
          {loading && action === 'diagnose' ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Dijagnostika u toku...
            </span>
          ) : (
            '🔍 Pokreni Dijagnostiku'
          )}
        </button>

        <button
          onClick={runRepair}
          disabled={loading}
          className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-green-500/25 hover:brightness-110 disabled:opacity-50"
        >
          {loading && action === 'repair' ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Auto-Popravka u toku...
            </span>
          ) : (
            '🔧 Pokreni Auto-Popravku'
          )}
        </button>
      </div>

      {/* Result panel */}
      {result && (
        <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-6">
          <h3 className="mb-4 text-lg font-bold text-white">
            {action === 'diagnose' ? '🔍 Rezultat Dijagnostike' : '🔧 Rezultat Auto-Popravke'}
          </h3>

          {action === 'diagnose' && result.diagnostic && (
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-sm text-zinc-400">Health Score:</span>
                <span className={`text-2xl font-bold ${
                  result.diagnostic.score >= 90 ? 'text-green-400' :
                  result.diagnostic.score >= 70 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {result.diagnostic.score}/100
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-zinc-400">Status:</span>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                  result.diagnostic.overallStatus === 'healthy'
                    ? 'bg-green-500/10 text-green-400'
                    : result.diagnostic.overallStatus === 'degraded'
                      ? 'bg-yellow-500/10 text-yellow-400'
                      : 'bg-red-500/10 text-red-400'
                }`}>
                  {result.diagnostic.overallStatus}
                </span>
              </div>
              <div className="grid gap-2 text-sm text-zinc-400 sm:grid-cols-3">
                <span>✅ Prošle: {result.diagnostic.summary.passed}</span>
                <span>⚠️ Upozorenja: {result.diagnostic.summary.warnings}</span>
                <span>❌ Neuspele: {result.diagnostic.summary.failed}</span>
              </div>
            </div>
          )}

          {action === 'repair' && result.repair && (
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-sm text-zinc-400">Score pre popravke:</span>
                <span className="text-lg font-bold text-yellow-400">{result.scoreBefore}</span>
                <span className="text-zinc-500">→</span>
                <span className="text-sm text-zinc-400">Score posle:</span>
                <span className="text-lg font-bold text-green-400">{result.scoreAfter}</span>
              </div>
              <div className="grid gap-2 text-sm text-zinc-400 sm:grid-cols-3">
                <span>✅ Popravljeno: {result.repair.summary.completed}</span>
                <span>⏭️ Preskočeno: {result.repair.summary.skipped}</span>
                <span>❌ Neuspelo: {result.repair.summary.failed}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
