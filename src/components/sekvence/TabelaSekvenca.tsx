import type { Sekvenca } from '@/lib/types';

export default function TabelaSekvenca({ sekvenca }: { sekvenca: Sekvenca }) {
  const zaglavlje = (sekvenca.podaci.zaglavlje ?? []) as string[];
  const redovi = (sekvenca.podaci.redovi ?? []) as string[][];

  return (
    <div className="bg-gray-900 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        {sekvenca.naslov && (
          <h2 className="mb-6 text-2xl font-bold text-white">{sekvenca.naslov}</h2>
        )}
        <div className="overflow-x-auto rounded-2xl border border-gray-700/50">
          <table className="w-full text-left text-sm">
            {zaglavlje.length > 0 && (
              <thead className="bg-gray-800/80 text-xs uppercase text-gray-400">
                <tr>
                  {zaglavlje.map((z) => (
                    <th key={z} className="px-6 py-4">{z}</th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {redovi.map((red, i) => (
                <tr key={i} className="border-t border-gray-700/50 bg-gray-800/30 transition hover:bg-gray-800/60">
                  {red.map((celija, j) => (
                    <td key={j} className="px-6 py-4 text-gray-300">{celija}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
