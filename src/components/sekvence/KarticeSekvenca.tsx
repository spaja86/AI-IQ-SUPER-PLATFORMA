import type { Sekvenca } from '@/lib/types';
import Link from 'next/link';

interface Kartica {
  naslov: string;
  opis: string;
  ikona: string;
  progres?: number;
  oznake?: string[];
  href?: string;
  eksterniLink?: string;
}

export default function KarticeSekvenca({ sekvenca }: { sekvenca: Sekvenca }) {
  const kartice = (sekvenca.podaci.kartice ?? []) as Kartica[];

  return (
    <div className="py-12">
      <div className="spaja-container max-w-6xl">
        {sekvenca.naslov && (
          <h2 className="mb-2 text-2xl font-bold text-white">{sekvenca.naslov}</h2>
        )}
        {sekvenca.podnaslov && (
          <p className="mb-8 text-[var(--text-muted)]">{sekvenca.podnaslov}</p>
        )}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {kartice.map((k) => {
            const content = (
              <div className="spaja-card group p-6">
                <div className="mb-3 text-3xl" role="img" aria-label={k.naslov}>{k.ikona}</div>
                <h3 className="mb-2 text-lg font-semibold text-white">{k.naslov}</h3>
                <p className="mb-4 text-sm text-[var(--text-muted)]">{k.opis}</p>
                {typeof k.progres === 'number' && (
                  <div className="mb-3">
                    <div className="mb-1 flex justify-between text-xs text-slate-400">
                      <span>Progres</span>
                      <span>{k.progres}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-700" role="progressbar" aria-valuenow={k.progres} aria-valuemin={0} aria-valuemax={100} aria-label={`${k.naslov}: ${k.progres}%`}>
                      <div
                        className={`h-full rounded-full ${k.progres >= 90 ? 'bg-green-500' : k.progres >= 70 ? 'bg-blue-500' : k.progres >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${k.progres}%` }}
                      />
                    </div>
                  </div>
                )}
                {k.oznake && k.oznake.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {k.oznake.map((o) => (
                      <span key={o} className="rounded-full border border-slate-700/40 bg-slate-900/70 px-2 py-0.5 text-xs text-slate-300">{o}</span>
                    ))}
                  </div>
                )}
              </div>
            );
            if (k.eksterniLink) {
              return <a key={k.naslov} href={k.eksterniLink} target="_blank" rel="noopener noreferrer">{content}</a>;
            }
            if (k.href) {
              return <Link key={k.naslov} href={k.href}>{content}</Link>;
            }
            return <div key={k.naslov}>{content}</div>;
          })}
        </div>
      </div>
    </div>
  );
}
