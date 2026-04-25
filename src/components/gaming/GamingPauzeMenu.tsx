'use client';

import type { GameScore, DimenzionalnParametri } from '@/lib/gaming-endzin';
import DimenzijaBadge from './DimenzijaBadge';
import type { DimenzijaNivo } from '@/lib/dimenzije';

interface Props {
  score: GameScore;
  parametri: DimenzionalnParametri;
  igricaNaziv: string;
  igricaIkona: string;
  onNastavi: () => void;
  onRestart: () => void;
  onPromeniDimenziju: () => void;
  onIzlaz: () => void;
}

const SVE_DIMENZIJE: DimenzijaNivo[] = ['360D', '720D', '1440D', '2880D', '5760D'];

export default function GamingPauzeMenu({
  score,
  parametri,
  igricaNaziv,
  igricaIkona,
  onNastavi,
  onRestart,
  onPromeniDimenziju,
  onIzlaz,
}: Props) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-gray-700 bg-gray-900 p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-5 text-center">
          <div className="mb-1 text-4xl">{igricaIkona}</div>
          <h2 className="text-xl font-bold text-white">{igricaNaziv}</h2>
          <p className="mt-1 text-sm text-gray-400">⏸ Pauza</p>
        </div>

        {/* Score */}
        <div className="mb-5 rounded-xl bg-gray-800/80 p-3 text-center">
          <p className="text-2xl font-bold text-white">{score.bodovi.toLocaleString('sr-RS')}</p>
          <p className="text-xs text-gray-400">bodova · Nivo {score.nivo}</p>
          <div className="mt-2 flex justify-center">
            <DimenzijaBadge dimenzija={parametri.nivo} mali />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Dimenzionalni bonus: ×{parametri.brzinaMultiplikator.toFixed(1)}
          </p>
        </div>

        {/* Dimenzija info */}
        <div className="mb-5">
          <p className="mb-2 text-xs font-semibold text-gray-500">🌀 Aktivan dimenzionalni sistem</p>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <div className="rounded-lg bg-gray-800/60 p-2">
              <span className="text-gray-500">Slojevi</span>
              <p className="font-bold text-white">{parametri.slojevi} / 4</p>
            </div>
            <div className="rounded-lg bg-gray-800/60 p-2">
              <span className="text-gray-500">Zakoni</span>
              <p className="font-bold text-white">{parametri.zakoni} / 6</p>
            </div>
            <div className="rounded-lg bg-gray-800/60 p-2">
              <span className="text-gray-500">Max entiteta</span>
              <p className="font-bold text-white">{parametri.maxEntiteta}</p>
            </div>
            <div className="rounded-lg bg-gray-800/60 p-2">
              <span className="text-gray-500">3D prikaz</span>
              <p className="font-bold text-white">{parametri.tredni ? '✅ Da' : '— Ne'}</p>
            </div>
          </div>
        </div>

        {/* Sve dimenzije brzi pregled */}
        <div className="mb-5 flex justify-center gap-1">
          {SVE_DIMENZIJE.map((d) => (
            <span
              key={d}
              className={`rounded-full px-2 py-0.5 text-xs ${
                d === parametri.nivo
                  ? 'bg-white/20 font-bold text-white'
                  : 'text-gray-600'
              }`}
            >
              {d}
            </span>
          ))}
        </div>

        {/* Akcije */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onNastavi}
            className="w-full rounded-xl bg-green-600 py-3 text-sm font-bold text-white transition hover:bg-green-500"
          >
            ▶ Nastavi igru
          </button>
          <button
            onClick={onRestart}
            className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white transition hover:bg-blue-500"
          >
            🔄 Restart
          </button>
          <button
            onClick={onPromeniDimenziju}
            className="w-full rounded-xl bg-purple-600/80 py-3 text-sm font-bold text-white transition hover:bg-purple-600"
          >
            🌀 Promeni dimenziju
          </button>
          <button
            onClick={onIzlaz}
            className="w-full rounded-xl bg-gray-700 py-3 text-sm font-medium text-gray-300 transition hover:bg-gray-600"
          >
            ✕ Izlaz iz igre
          </button>
        </div>
      </div>
    </div>
  );
}
