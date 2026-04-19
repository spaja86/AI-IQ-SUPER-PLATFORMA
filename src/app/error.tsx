'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';

function getErrorKategorija(error: Error): { ikona: string; kategorija: string; boja: string } {
  const msg = error.message?.toLowerCase() ?? '';
  if (msg.includes('network') || msg.includes('fetch') || msg.includes('timeout'))
    return { ikona: '🌐', kategorija: 'Mrežna greška', boja: 'text-yellow-400' };
  if (msg.includes('auth') || msg.includes('forbidden') || msg.includes('unauthorized'))
    return { ikona: '🔒', kategorija: 'Autorizacija', boja: 'text-red-400' };
  if (msg.includes('not found') || msg.includes('404'))
    return { ikona: '🔍', kategorija: 'Nije pronađeno', boja: 'text-orange-400' };
  if (msg.includes('type') || msg.includes('undefined') || msg.includes('null'))
    return { ikona: '🐛', kategorija: 'Sistemska greška', boja: 'text-purple-400' };
  return { ikona: '⚠️', kategorija: 'Neočekivana greška', boja: 'text-gray-400' };
}

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error(error);
    }
  }, [error]);

  const { ikona, kategorija, boja } = getErrorKategorija(error);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="mx-auto max-w-lg text-center">
        <div className="mb-4 text-6xl">{ikona}</div>
        <h1 className="mb-1 text-2xl font-bold text-white">Greška</h1>
        <p className={`mb-2 text-sm font-medium ${boja}`}>{kategorija}</p>
        <p className="mb-4 text-gray-400">{error.message || 'Došlo je do neočekivane greške.'}</p>
        {error.digest && (
          <p className="mb-4 rounded bg-gray-800/50 px-3 py-1 text-xs text-gray-500">
            ID: {error.digest}
          </p>
        )}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => unstable_retry()}
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-500"
          >
            🔄 Pokušaj ponovo
          </button>
          <Link href="/auto-popravka" className="rounded-lg border border-gray-700 px-6 py-3 text-sm text-gray-300 transition hover:bg-gray-800">
            🔧 Auto-Popravka
          </Link>
          <Link href="/dashboard" className="rounded-lg border border-gray-700 px-6 py-3 text-sm text-gray-300 transition hover:bg-gray-800">
            📊 Dashboard
          </Link>
          <Link href="/" className="rounded-lg border border-gray-700 px-6 py-3 text-sm text-gray-300 transition hover:bg-gray-800">
            🏠 Početna
          </Link>
        </div>
        <p className="mt-6 text-xs text-gray-600">{APP_NAME} — Autonomna dijagnostika i auto-popravka</p>
      </div>
    </div>
  );
}
