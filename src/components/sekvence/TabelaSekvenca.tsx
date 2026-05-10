import type { Sekvenca } from '@/lib/types';

export default function TabelaSekvenca({ sekvenca }: { sekvenca: Sekvenca }) {
  const zaglavlje = (sekvenca.podaci.zaglavlje ?? []) as string[];
  const redovi = (sekvenca.podaci.redovi ?? []) as string[][];

  return (
    <div className="py-12">
      <div className="spaja-container max-w-6xl">
        {sekvenca.naslov && (
          <h2 className="mb-6 text-2xl font-bold text-white">{sekvenca.naslov}</h2>
        )}
        <div className="spaja-card overflow-x-auto">
          <table className="w-full text-left text-sm">
            {zaglavlje.length > 0 && (
              <thead className="bg-slate-900/70 text-xs uppercase text-slate-300">
                <tr>
                  {zaglavlje.map((z) => (
                    <th key={z} className="px-6 py-4">{z}</th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {redovi.map((red, i) => (
                <tr key={i} className="border-t border-slate-700/50 bg-slate-900/40 transition hover:bg-slate-800/65">
                  {red.map((celija, j) => (
                    <td key={j} className="px-6 py-4 text-slate-200">{celija}</td>
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
