// SpajaUltraOmegaCore -∞Ω+∞ — Univerzalni Loading Komponent
// Kompanija SPAJA — Digitalna Industrija
//
// Generički skeleton loader koji se koristi kao loading.tsx na svim stranicama.
// Odgovara SekvencaSkeleton vizuelnom jeziku platforme.

interface UniverzalniLoadingProps {
  /** Naziv stranice za prikazivanje u podnaslovu */
  naziv?: string;
}

export default function UniverzalniLoading({ naziv }: UniverzalniLoadingProps = {}) {
  return (
    <div
      className="min-h-screen bg-slate-950 px-4 py-8"
      role="status"
      aria-label={naziv ? `Učitavanje — ${naziv}` : 'Učitavanje...'}
    >
      <div className="mx-auto max-w-6xl animate-pulse space-y-8">
        {/* Hero skeleton */}
        <div className="rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-6 py-16 text-center">
          <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-gray-700/60" />
          <div className="mx-auto mb-3 h-9 w-72 rounded-lg bg-gray-700/60" />
          <div className="mx-auto mb-2 h-5 w-96 rounded bg-gray-700/40" />
          <div className="mx-auto h-4 w-80 rounded bg-gray-700/30" />
          <div className="mt-6 flex justify-center gap-4">
            <div className="h-11 w-32 rounded-lg bg-gray-700/50" />
            <div className="h-11 w-32 rounded-lg bg-gray-700/40" />
          </div>
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-700/50 bg-gray-800/50 p-5 text-center">
              <div className="mx-auto mb-2 h-8 w-8 rounded-full bg-gray-700/60" />
              <div className="mx-auto mb-1 h-7 w-14 rounded bg-gray-700/60" />
              <div className="mx-auto h-3 w-20 rounded bg-gray-700/40" />
            </div>
          ))}
        </div>

        {/* Cards skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-700/50 bg-gray-800/30 p-5">
              <div className="mb-3 flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gray-700/60" />
                <div className="h-5 w-32 rounded bg-gray-700/60" />
              </div>
              <div className="mb-2 h-3 w-full rounded bg-gray-700/40" />
              <div className="mb-2 h-3 w-5/6 rounded bg-gray-700/30" />
              <div className="h-3 w-2/3 rounded bg-gray-700/20" />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom subtitle */}
      <p className="mt-8 text-center text-xs text-gray-600">
        {naziv ? `${naziv} • ` : ''}AI IQ SUPER PLATFORMA
      </p>
    </div>
  );
}
