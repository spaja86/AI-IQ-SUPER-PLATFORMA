import type { Sekvenca } from '@/lib/types';
import Link from 'next/link';

export default function HeroSekvenca({ sekvenca }: { sekvenca: Sekvenca }) {
  const opis = sekvenca.podaci.opis as string | undefined;
  const dugmad = (sekvenca.podaci.dugmad ?? []) as Array<{ tekst: string; href: string; stil?: string }>;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 py-20 text-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent" />
      <div className="spaja-container relative max-w-4xl">
        {sekvenca.ikona && (
          <div className="mb-6 text-6xl" role="img" aria-label={sekvenca.naslov ?? 'Ikona'}>{sekvenca.ikona}</div>
        )}
        {sekvenca.naslov && (
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            {sekvenca.naslov}
          </h1>
        )}
        {sekvenca.podnaslov && (
          <p className="mb-6 text-lg text-blue-200 md:text-xl">{sekvenca.podnaslov}</p>
        )}
        {opis && (
          <p className="mx-auto mb-8 max-w-2xl text-gray-300">{opis}</p>
        )}
        {dugmad.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4">
            {dugmad.map((d) => (
              <Link
                key={d.href}
                href={d.href}
                className={
                  d.stil === 'sekundarno'
                    ? 'spaja-btn-secondary spaja-focus-ring px-6 py-3 text-sm'
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
