import type { Sekvenca } from '@/lib/types';

interface SlikaData {
  url: string;
  alt: string;
  sirina?: number;
  visina?: number;
  zaobljeno?: boolean;
}

export default function SlikaSekvenca({ sekvenca }: { sekvenca: Sekvenca }) {
  const slike = (sekvenca.podaci.slike ?? []) as SlikaData[];
  const opis = sekvenca.podaci.opis as string | undefined;
  const raspored = (sekvenca.podaci.raspored ?? 'galerija') as 'galerija' | 'red' | 'kolona';

  const gridClass =
    raspored === 'red'
      ? 'flex flex-wrap justify-center gap-6'
      : raspored === 'kolona'
        ? 'flex flex-col items-center gap-6'
        : 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div className="bg-gray-900/50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        {sekvenca.naslov && (
          <h2 className="mb-2 text-center text-2xl font-bold text-white">{sekvenca.naslov}</h2>
        )}
        {sekvenca.podnaslov && (
          <p className="mb-6 text-center text-gray-400">{sekvenca.podnaslov}</p>
        )}
        {opis && (
          <p className="mx-auto mb-8 max-w-3xl text-center text-gray-300">{opis}</p>
        )}
        <div className={gridClass}>
          {slike.map((s) => (
            <figure key={s.url} className="overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.url}
                alt={s.alt}
                width={s.sirina}
                height={s.visina}
                className={`mx-auto max-w-full object-cover shadow-lg shadow-blue-900/20 ${s.zaobljeno ? 'rounded-full' : 'rounded-xl'}`}
                loading="lazy"
              />
              {s.alt && (
                <figcaption className="mt-2 text-center text-sm text-gray-500">{s.alt}</figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
