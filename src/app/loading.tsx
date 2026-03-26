export default function Loading() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <div className="animate-spin text-4xl">⚙️</div>
      <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">Učitavanje...</p>
    </main>
  );
}
