"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="text-6xl mb-6" role="img" aria-label="Greška">
          ⚠️
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">
          Došlo je do greške
        </h1>
        <p className="text-gray-400 mb-8">
          Nešto nije u redu. Molimo pokušajte ponovo ili se vratite na početnu
          stranicu.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#0a0a1a]"
          >
            Pokušaj ponovo
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-gray-600 hover:border-gray-400 text-gray-300 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#0a0a1a]"
          >
            Početna stranica
          </Link>
        </div>
      </div>
    </div>
  );
}
