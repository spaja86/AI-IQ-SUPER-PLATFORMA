import type { Sekvenca } from '@/lib/types';
import Link from 'next/link';

export default function CTASekvenca({ sekvenca }: { sekvenca: Sekvenca }) {
  const opis = sekvenca.podaci.opis as string | undefined;
  const stavke = (sekvenca.podaci.stavke ?? []) as Array<{ naziv: string; vrednost: string | number; ikona: string }>;
  const dugmad = (sekvenca.podaci.dugmad ?? []) as Array<{ tekst: string; href: string; stil?: string }>;

  return (
    <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 py-16">
      <div className="spaja-container max-w-4xl text-center">
        {sekvenca.naslov && (
          <h2 className="mb-4 text-3xl font-bold text-white">{sekvenca.naslov}</h2>
        )}
        {opis && <p className="mb-8 text-blue-100/90">{opis}</p>}
        {stavke.length > 0 && (
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {stavke.map((s) => (
              <div key={s.naziv} className="rounded-xl border border-white/15 bg-white/10 p-4">
                <div className="text-2xl" role="img" aria-label={s.naziv}>{s.ikona}</div>
                <div className="text-xl font-bold text-white">{s.vrednost}</div>
                <div className="text-xs text-gray-300">{s.naziv}</div>
              </div>
            ))}
          </div>
        )}
        {dugmad.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4">
            {dugmad.map((d) => (
              <Link
                key={d.href}
                href={d.href}
                className={
                  d.stil === 'sekundarno'
                    ? 'spaja-btn-secondary spaja-focus-ring border-white/25 bg-white/10 px-6 py-3 text-sm text-white hover:bg-white/20'
                    : 'spaja-btn-primary spaja-focus-ring px-6 py-3 text-sm'
                }
              >
                {d.tekst}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
