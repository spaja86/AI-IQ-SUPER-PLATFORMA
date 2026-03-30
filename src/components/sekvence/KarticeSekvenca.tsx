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
    <div className="bg-gray-950 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        {sekvenca.naslov && (
          <h2 className="mb-2 text-2xl font-bold text-white">{sekvenca.naslov}</h2>
        )}
        {sekvenca.podnaslov && (
          <p className="mb-8 text-gray-400">{sekvenca.podnaslov}</p>
        )}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {kartice.map((k) => {
            const content = (
              <div className="group rounded-2xl border border-gray-700/50 bg-gray-800/50 p-6 transition hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10">
                <div className="mb-3 text-3xl">{k.ikona}</div>
                <h3 className="mb-2 text-lg font-semibold text-white">{k.naslov}</h3>
                <p className="mb-4 text-sm text-gray-400">{k.opis}</p>
                {typeof k.progres === 'number' && (
                  <div className="mb-3">
                    <div className="mb-1 flex justify-between text-xs text-gray-500">
                      <span>Progres</span>
                      <span>{k.progres}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-700">
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
                      <span key={o} className="rounded-full bg-gray-700/50 px-2 py-0.5 text-xs text-gray-300">{o}</span>
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
