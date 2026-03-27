import type { Sekvenca } from '@/lib/types';
import Link from 'next/link';

export default function BanerSekvenca({ sekvenca }: { sekvenca: Sekvenca }) {
  const bedz = sekvenca.podaci.bedz as string | undefined;
  const opis = sekvenca.podaci.opis as string | undefined;
  const dugme = sekvenca.podaci.dugme as { tekst: string; href: string } | undefined;

  return (
    <div className="bg-gray-950 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-8 md:p-12">
          {bedz && (
            <span className="mb-4 inline-block rounded-full bg-purple-500/20 px-3 py-1 text-xs font-medium text-purple-300">{bedz}</span>
          )}
          {sekvenca.naslov && (
            <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">{sekvenca.naslov}</h2>
          )}
          {opis && <p className="mb-6 max-w-2xl text-gray-300">{opis}</p>}
          {dugme && (
            <Link href={dugme.href} className="inline-flex rounded-lg bg-purple-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-purple-500">
              {dugme.tekst}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
