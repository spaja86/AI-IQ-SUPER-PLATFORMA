import type { Sekvenca } from '@/lib/types';

interface Stavka {
  naziv: string;
  vrednost: string | number;
  ikona: string;
  boja?: string;
}

export default function StatistikaSekvenca({ sekvenca }: { sekvenca: Sekvenca }) {
  const stavke = (sekvenca.podaci.stavke ?? []) as Stavka[];

  return (
    <div className="bg-gray-900 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        {sekvenca.naslov && (
          <h2 className="mb-8 text-center text-2xl font-bold text-white">{sekvenca.naslov}</h2>
        )}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stavke.map((s) => (
            <div key={s.naziv} className="rounded-2xl border border-gray-700/50 bg-gray-800/50 p-6 text-center transition hover:border-gray-600">
              <div className="mb-2 text-3xl">{s.ikona}</div>
              <div className="mb-1 text-2xl font-bold text-white">{s.vrednost}</div>
              <div className="text-sm text-gray-400">{s.naziv}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
