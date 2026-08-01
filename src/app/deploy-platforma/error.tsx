'use client';

/**
 * Deploy Platforma — Error Boundary
 *
 * Prikazuje se kada dođe do greške pri učitavanju deploy-platforma stranice,
 * npr. kada Vercel status API nije dostupan ili dođe do runtime greške.
 */

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DeployPlatformaError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[deploy-platforma] greška:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900 border border-red-500/30 rounded-xl p-6 text-center">
        <p className="text-5xl mb-4">🚨</p>
        <h2 className="text-xl font-bold text-white mb-2">Greška pri učitavanju Deploy Platforme</h2>
        <p className="text-zinc-400 text-sm mb-1">
          Deploy status API nije dostupan ili je došlo do neočekivane greške.
        </p>
        {error.message && (
          <p className="text-red-400 text-xs font-mono bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mt-3 mb-4 text-left break-all">
            {error.message}
          </p>
        )}
        {error.digest && (
          <p className="text-zinc-600 text-xs font-mono mb-4">Digest: {error.digest}</p>
        )}
        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={reset}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition-colors"
          >
            🔄 Pokušaj ponovo
          </button>
          <a
            href="/dashboard"
            className="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 text-sm hover:border-zinc-500 transition-colors"
          >
            ← Dashboard
          </a>
        </div>
        <p className="text-zinc-600 text-xs mt-4">
          Status API:{' '}
          <a
            href="/api/deploy-platforma/status"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300"
          >
            /api/deploy-platforma/status
          </a>
        </p>
      </div>
    </div>
  );
}
