'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl">⚠️</div>
      <h1 className="mt-6 text-3xl font-extrabold text-white">
        Došlo je do greške
      </h1>
      <p className="mt-2 text-zinc-400">
        Nešto nije u redu. Molimo pokušajte ponovo.
      </p>
      <button
        onClick={reset}
        className="mt-8 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#2563eb] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        Pokušaj Ponovo
      </button>
    </div>
  );
}
