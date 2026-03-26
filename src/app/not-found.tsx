import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <span className="text-6xl">🔍</span>
      <h1 className="mt-4 text-3xl font-bold">404</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">Stranica nije pronađena.</p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-zinc-900 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        Vrati se na početnu
      </Link>
    </main>
  );
}
