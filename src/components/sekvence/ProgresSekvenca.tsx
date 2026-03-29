import type { Sekvenca } from '@/lib/types';

export default function ProgresSekvenca({ sekvenca }: { sekvenca: Sekvenca }) {
  const progres = (sekvenca.podaci.progres ?? 0) as number;
  const poruka = sekvenca.podaci.poruka as string | undefined;

  const boja = progres >= 90 ? 'from-green-500 to-emerald-500' : progres >= 70 ? 'from-blue-500 to-cyan-500' : progres >= 50 ? 'from-yellow-500 to-orange-500' : 'from-red-500 to-pink-500';

  return (
    <div className="bg-gray-900 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl border border-gray-700/50 bg-gray-800/50 p-8">
          {sekvenca.naslov && (
            <h2 className="mb-2 text-xl font-bold text-white">{sekvenca.naslov}</h2>
          )}
          {sekvenca.podnaslov && (
            <p className="mb-4 text-sm text-gray-400">{sekvenca.podnaslov}</p>
          )}
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-gray-400">Progres</span>
            <span className="text-lg font-bold text-white">{progres}%</span>
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-gray-700" role="progressbar" aria-valuenow={progres} aria-valuemin={0} aria-valuemax={100} aria-label={`Progres: ${progres}%`}>
            <div className={`h-full rounded-full bg-gradient-to-r ${boja} transition-all duration-500`} style={{ width: `${progres}%` }} />
          </div>
          {poruka && (
            <p className="mt-4 text-sm text-gray-400">{poruka}</p>
          )}
        </div>
      </div>
    </div>
  );
}
