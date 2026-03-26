import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl">🔍</div>
      <h1 className="mt-6 text-4xl font-extrabold text-white">404</h1>
      <p className="mt-2 text-xl text-zinc-400">Stranica nije pronađena</p>
      <p className="mt-4 max-w-md text-sm text-zinc-500">
        Stranica koju tražite ne postoji ili je premeštena. Proverite URL adresu
        ili se vratite na početnu stranicu.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#2563eb] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        ← Nazad na Početnu
      </Link>
    </div>
  );
}
