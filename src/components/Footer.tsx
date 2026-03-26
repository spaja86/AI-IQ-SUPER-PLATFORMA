export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧠</span>
            <span className="text-sm font-semibold">Kompanija SPAJA</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">— Digitalna Industrija</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
            <span>AI-IQ SUPER PLATFORMA v3.0.0</span>
            <span>•</span>
            <span>© {new Date().getFullYear()} SPAJA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
