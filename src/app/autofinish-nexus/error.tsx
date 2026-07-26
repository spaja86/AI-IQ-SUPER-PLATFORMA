'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Button, { buttonClassName } from '@/components/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="mx-auto max-w-lg text-center">
        <div className="mb-4 text-5xl">⚠️</div>
        <h1 className="mb-2 text-xl font-bold text-white">Autofinish Nexus — Greška</h1>
        <p className="mb-4 text-sm text-gray-400">
          {error.message || 'Došlo je do greške pri učitavanju stranice Autofinish Nexus.'}
        </p>
        {error.digest && (
          <p className="mb-4 rounded bg-gray-800/50 px-3 py-1 text-xs text-gray-500">
            ID: {error.digest}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button onClick={() => reset()} variant="primary">
            🔄 Pokušaj ponovo
          </Button>
          <Link href="/auto-popravka" className={buttonClassName({ variant: 'secondary' })}>
            🔧 Auto-Popravka
          </Link>
          <Link href="/" className={buttonClassName({ variant: 'secondary' })}>
            🏠 Početna
          </Link>
        </div>
      </div>
    </div>
  );
}
