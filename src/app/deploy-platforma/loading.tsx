export default function Loading() {
  return (
    <div className="mx-auto min-h-[60vh] w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="space-y-4" aria-live="polite" aria-busy="true">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 motion-safe:animate-pulse">
          <div className="h-4 w-40 rounded bg-zinc-700" />
          <div className="mt-3 h-7 w-3/5 rounded bg-zinc-800" />
          <div className="mt-2 h-4 w-4/5 rounded bg-zinc-800" />
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 motion-safe:animate-pulse">
              <div className="h-3 w-14 rounded bg-zinc-700" />
              <div className="mt-2 h-6 w-12 rounded bg-zinc-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
