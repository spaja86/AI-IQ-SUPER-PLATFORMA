import type { Sekvenca } from '@/lib/types';

export default function TekstSekvenca({ sekvenca }: { sekvenca: Sekvenca }) {
  const sadrzaj = sekvenca.podaci.sadrzaj as string | undefined;
  const istaknuteStavke = (sekvenca.podaci.istaknuteStavke ?? []) as string[];

  return (
    <div className="bg-gray-900 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        {sekvenca.naslov && (
          <h2 className="mb-4 text-2xl font-bold text-white">{sekvenca.naslov}</h2>
        )}
        {sadrzaj && (
          <div className="mb-6 text-gray-300 leading-relaxed whitespace-pre-line">{sadrzaj}</div>
        )}
        {istaknuteStavke.length > 0 && (
          <ul className="space-y-2">
            {istaknuteStavke.map((s) => (
              <li key={s} className="flex items-start gap-2 text-gray-300">
                <span className="text-blue-400">●</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
