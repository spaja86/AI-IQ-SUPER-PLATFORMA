'use client';

import Link from 'next/link';

export default function Error({ error }: { error: Error & { digest?: string } }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="text-center">
        <div className="mb-4 text-6xl">⚠️</div>
        <h1 className="mb-2 text-2xl font-bold text-white">Greska</h1>
        <p className="mb-6 text-gray-400">{error.message || 'Doslo je do neocekivane greske.'}</p>
        <Link href="/" className="rounded-lg bg-blue-600 px-6 py-3 text-sm text-white hover:bg-blue-500">
          Nazad na pocetnu
        </Link>
      </div>
    </div>
  );
}
