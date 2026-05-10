import type { Sekvenca } from '@/lib/types';

interface ListaStavka {
  naslov: string;
  opis: string;
  ikona: string;
}

export default function ListaSekvenca({ sekvenca }: { sekvenca: Sekvenca }) {
  const stavke = (sekvenca.podaci.stavke ?? []) as ListaStavka[];

  return (
    <div className="py-12">
      <div className="spaja-container max-w-4xl">
        {sekvenca.naslov && (
          <h2 className="mb-8 text-2xl font-bold text-white">{sekvenca.naslov}</h2>
        )}
        <div className="space-y-4">
          {stavke.map((s) => (
            <div key={s.naslov} className="spaja-card flex items-start gap-4 p-5">
              <div className="text-2xl" role="img" aria-label={s.naslov}>{s.ikona}</div>
              <div>
                <h3 className="font-semibold text-white">{s.naslov}</h3>
                <p className="text-sm text-[var(--text-muted)]">{s.opis}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
