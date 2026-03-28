'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="text-center">
        <div className="mb-4 text-6xl">⚠️</div>
        <h1 className="mb-2 text-2xl font-bold text-white">Greška</h1>
        <p className="mb-6 text-gray-400">{error.message || 'Došlo je do neočekivane greške.'}</p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => unstable_retry()}
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm text-white hover:bg-blue-500"
          >
            Pokušaj ponovo
          </button>
          <Link href="/" className="rounded-lg border border-gray-700 px-6 py-3 text-sm text-gray-300 hover:bg-gray-800">
            Nazad na početnu
          </Link>
        </div>
      </div>
    </div>
  );
}
