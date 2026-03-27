import type { Sekvenca } from '@/lib/types';

interface Nivo {
  naziv: string;
  ikona: string;
  deca: string[];
}

export default function HijerarhijaSekvenca({ sekvenca }: { sekvenca: Sekvenca }) {
  const nivoi = (sekvenca.podaci.nivoi ?? []) as Nivo[];

  return (
    <div className="bg-gray-950 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        {sekvenca.naslov && (
          <h2 className="mb-8 text-2xl font-bold text-white">{sekvenca.naslov}</h2>
        )}
        <div className="space-y-6">
          {nivoi.map((nivo) => (
            <div key={nivo.naziv}>
              <div className="flex items-center gap-3 rounded-xl border border-gray-700/50 bg-gray-800/50 p-4">
                <span className="text-2xl">{nivo.ikona}</span>
                <span className="text-lg font-semibold text-white">{nivo.naziv}</span>
              </div>
              {nivo.deca.length > 0 && (
                <div className="ml-8 mt-2 space-y-2 border-l-2 border-gray-700 pl-6">
                  {nivo.deca.map((dete, j) => (
                    <div key={dete} className="rounded-lg bg-gray-800/30 px-4 py-2 text-sm text-gray-300">
                      {j < nivo.deca.length - 1 ? '├── ' : '└── '}{dete}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
