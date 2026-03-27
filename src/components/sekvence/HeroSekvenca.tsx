import type { Sekvenca } from '@/lib/types';
import Link from 'next/link';

export default function HeroSekvenca({ sekvenca }: { sekvenca: Sekvenca }) {
  const opis = sekvenca.podaci.opis as string | undefined;
  const dugmad = (sekvenca.podaci.dugmad ?? []) as Array<{ tekst: string; href: string; stil?: string }>;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 px-6 py-20 text-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent" />
      <div className="relative mx-auto max-w-4xl">
        {sekvenca.ikona && (
          <div className="mb-6 text-6xl">{sekvenca.ikona}</div>
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
                    ? 'rounded-lg border border-gray-600 px-6 py-3 text-sm font-medium text-gray-200 transition hover:border-gray-400 hover:text-white'
                    : 'rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-500'
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
