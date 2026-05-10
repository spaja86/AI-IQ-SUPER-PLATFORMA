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
    <div className="py-12">
      <div className="spaja-container max-w-6xl">
        {sekvenca.naslov && (
          <h2 className="mb-8 text-center text-2xl font-bold text-white">{sekvenca.naslov}</h2>
        )}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stavke.map((s) => (
            <div key={s.naziv} className="spaja-card p-6 text-center">
              <div className="mb-2 text-3xl" role="img" aria-label={s.naziv}>{s.ikona}</div>
              <div className="mb-1 text-2xl font-bold text-white">{s.vrednost}</div>
              <div className="text-sm text-[var(--text-muted)]">{s.naziv}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
