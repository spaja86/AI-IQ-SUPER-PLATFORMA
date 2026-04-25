'use client';

import type { GameScore, DimenzionalnParametri } from '@/lib/gaming-endzin';
import DimenzijaBadge from './DimenzijaBadge';

interface Props {
  score: GameScore;
  parametri: DimenzionalnParametri;
  igricaNaziv: string;
  igricaIkona: string;
  onPauza: () => void;
}

export default function GamingHUD({ score, parametri, igricaNaziv, igricaIkona, onPauza }: Props) {
  const minuti = Math.floor(score.vreme / 60);
  const sekunde = score.vreme % 60;
  const vremeStr = `${String(minuti).padStart(2, '0')}:${String(sekunde).padStart(2, '0')}`;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-2 px-3 py-2">
      {/* Levo — igrica info */}
      <div className="flex items-center gap-2 rounded-lg bg-black/60 px-3 py-1.5 backdrop-blur-sm">
        <span className="text-lg">{igricaIkona}</span>
        <div>
          <p className="text-xs font-bold text-white">{igricaNaziv}</p>
          <p className="text-xs text-gray-400">Nivo {score.nivo}</p>
        </div>
      </div>

      {/* Centar — score */}
      <div className="flex flex-col items-center rounded-lg bg-black/60 px-4 py-1.5 backdrop-blur-sm">
        <span className="text-lg font-bold text-white">{score.bodovi.toLocaleString('sr-RS')}</span>
        <span className="text-xs text-gray-400">bodova</span>
      </div>

      {/* Desno — dimenzija + vreme + pauza */}
      <div className="pointer-events-auto flex items-center gap-2 rounded-lg bg-black/60 px-3 py-1.5 backdrop-blur-sm">
        <DimenzijaBadge dimenzija={parametri.nivo} mali />
        <span className="text-xs font-mono text-gray-300">{vremeStr}</span>
        <button
          onClick={onPauza}
          className="rounded-md bg-gray-700/80 px-2 py-1 text-xs text-gray-200 transition hover:bg-gray-600"
          aria-label="Pauza"
        >
          ⏸
        </button>
      </div>
    </div>
  );
}
