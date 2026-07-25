'use client';

import type { GameScore, DimenzionalnParametri } from '@/lib/gaming-endzin';
import DimenzijaBadge from './DimenzijaBadge';
import Button from '@/components/Button';

interface Props {
  score: GameScore;
  parametri: DimenzionalnParametri;
  igricaNaziv: string;
  igricaIkona: string;
  onPauza: () => void;
  /** Trenutni elementalni mod (samo za COLD AND FIRE) */
  elemMod?: 'cold' | 'fire';
  /** Fusion metar 0–100 (samo za COLD AND FIRE, ≥720D) */
  fusionGauge?: number;
}

export default function GamingHUD({ score, parametri, igricaNaziv, igricaIkona, onPauza, elemMod, fusionGauge }: Props) {
  const minuti = Math.floor(score.vreme / 60);
  const sekunde = score.vreme % 60;
  const vremeStr = `${String(minuti).padStart(2, '0')}:${String(sekunde).padStart(2, '0')}`;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-col gap-1 px-3 py-2">
      <div className="flex items-start justify-between gap-2">
        {/* Levo — igrica info */}
        <div className="flex items-center gap-2 rounded-lg bg-black/60 px-3 py-1.5 backdrop-blur-sm">
          <span className="text-lg">{igricaIkona}</span>
          <div>
            <p className="text-xs font-bold text-white">{igricaNaziv}</p>
            <p className="text-xs text-gray-400">Nivo {score.nivo}</p>
          </div>
        </div>

        {/* Centar — score + mod badge */}
        <div className="flex flex-col items-center gap-1 rounded-lg bg-black/60 px-4 py-1.5 backdrop-blur-sm">
          <span className="text-lg font-bold text-white">{score.bodovi.toLocaleString('sr-RS')}</span>
          <span className="text-xs text-gray-400">bodova</span>
          {elemMod !== undefined && (
            <span
              className={`mt-0.5 rounded-full px-2 py-0.5 text-xs font-bold ${
                elemMod === 'cold'
                  ? 'bg-cyan-700/80 text-cyan-200'
                  : 'bg-orange-700/80 text-orange-200'
              }`}
            >
              {elemMod === 'cold' ? '❄️ COLD' : '🔥 FIRE'}
            </span>
          )}
        </div>

        {/* Desno — dimenzija + vreme + pauza */}
        <div className="pointer-events-auto flex items-center gap-2 rounded-lg bg-black/60 px-3 py-1.5 backdrop-blur-sm">
          <DimenzijaBadge dimenzija={parametri.nivo} mali />
          <span className="text-xs font-mono text-gray-300">{vremeStr}</span>
          <Button
            onClick={onPauza}
            className="rounded-md bg-gray-700/80 px-2 py-1 text-xs text-gray-200 transition hover:bg-gray-600"
            aria-label="Pauza"
          >
            ⏸
          </Button>
        </div>
      </div>

      {/* Fusion gauge — prikazan samo kada je dostupan */}
      {fusionGauge !== undefined && fusionGauge > 0 && (
        <div className="mx-auto w-48 rounded-full bg-gray-800/70 p-0.5 backdrop-blur-sm">
          <div
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: `${fusionGauge}%`,
              background: fusionGauge >= 100
                ? 'linear-gradient(90deg, #67e8f9, #a855f7, #f97316)'
                : 'linear-gradient(90deg, #67e8f9, #a855f7)',
            }}
          />
          <p className="mt-0.5 text-center text-[9px] font-medium text-purple-300">
            {fusionGauge >= 100 ? '✨ FUSION!' : `FUSION ${Math.round(fusionGauge)}%`}
          </p>
        </div>
      )}
    </div>
  );
}

