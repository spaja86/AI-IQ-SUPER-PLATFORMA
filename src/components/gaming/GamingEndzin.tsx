'use client';

/**
 * GamingEndzin — Centralni gaming engine
 *
 * Prima `igrica` i `dimenzija` i renderuje odgovarajući runner.
 * Upravljа HUD-om, pauze menijem i game over ekranom.
 * Poziva se direktno u BrouvzerViewer kada je tab `isIgra = true`.
 */

import { useState, useCallback, useEffect } from 'react';
import type { Igrica } from '@/lib/igrice';
import type { Dimenzija } from '@/lib/dimenzije';
import type { GameScore } from '@/lib/gaming-endzin';
import { kreirajEndzinKonfiguraciju, noviScore } from '@/lib/gaming-endzin';

import GamingHUD from './GamingHUD';
import GamingPauzeMenu from './GamingPauzeMenu';
import DimenzijaBadge from './DimenzijaBadge';

import dynamic from 'next/dynamic';

const AkcijaRunner = dynamic(() => import('./runners/AkcijaRunner'), { ssr: false });
const LogickaRunner = dynamic(() => import('./runners/LogickaRunner'), { ssr: false });
const SimulacijaRunner = dynamic(() => import('./runners/SimulacijaRunner'), { ssr: false });
const EduRunner = dynamic(() => import('./runners/EduRunner'), { ssr: false });
const KreativnaRunner = dynamic(() => import('./runners/KreativnaRunner'), { ssr: false });

interface Props {
  igrica: Igrica;
  dimenzija: Dimenzija;
  onPromeniDimenziju: () => void;
  onIzlaz: () => void;
}

type GameFaza = 'uvod' | 'igra' | 'pauza' | 'kraj';

export default function GamingEndzin({ igrica, dimenzija, onPromeniDimenziju, onIzlaz }: Props) {
  const [faza, setFaza] = useState<GameFaza>('uvod');
  const [score, setScore] = useState<GameScore>(() => noviScore(dimenzija.nivo));
  const [restartKey, setRestartKey] = useState(0);

  const konfiguracija = kreirajEndzinKonfiguraciju(igrica, dimenzija);
  const { parametri, runnerTip } = konfiguracija;

  // ── Keyboard shortcuts ──

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        if (faza === 'igra') setFaza('pauza');
        else if (faza === 'pauza') setFaza('igra');
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [faza]);

  const handlePokreni = useCallback(() => {
    setScore(noviScore(dimenzija.nivo));
    setRestartKey((k) => k + 1);
    setFaza('igra');
  }, [dimenzija.nivo]);

  const handlePauza = useCallback(() => setFaza('pauza'), []);
  const handleNastavi = useCallback(() => setFaza('igra'), []);

  const handleRestart = useCallback(() => {
    setScore(noviScore(dimenzija.nivo));
    setRestartKey((k) => k + 1);
    setFaza('igra');
  }, [dimenzija.nivo]);

  const handleKraj = useCallback((finalScore: GameScore) => {
    setScore(finalScore);
    setFaza('kraj');
  }, []);

  // ── Uvod ekran ──

  if (faza === 'uvod') {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-gray-950 px-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-4 text-6xl">{igrica.ikona}</div>
          <h1 className="mb-2 text-2xl font-bold text-white">{igrica.naziv}</h1>
          <div className="mb-4 flex justify-center">
            <DimenzijaBadge dimenzija={dimenzija.nivo} />
          </div>

          <p className="mb-6 text-sm text-gray-400 leading-relaxed">{igrica.opis}</p>

          {/* Dimenzionalni parametri */}
          <div className="mb-6 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl bg-gray-800/60 p-3">
              <p className="text-gray-500">Geometrijski slojevi</p>
              <p className="mt-0.5 font-bold text-white">{parametri.slojevi} / 4</p>
            </div>
            <div className="rounded-xl bg-gray-800/60 p-3">
              <p className="text-gray-500">Zakoni manifestacije</p>
              <p className="mt-0.5 font-bold text-white">{parametri.zakoni} / 6</p>
            </div>
            <div className="rounded-xl bg-gray-800/60 p-3">
              <p className="text-gray-500">Dimenzionalni bonus</p>
              <p className="mt-0.5 font-bold text-white">×{parametri.brzinaMultiplikator.toFixed(1)}</p>
            </div>
            <div className="rounded-xl bg-gray-800/60 p-3">
              <p className="text-gray-500">Max entiteta</p>
              <p className="mt-0.5 font-bold text-white">{parametri.maxEntiteta}</p>
            </div>
          </div>

          {/* Funkcije */}
          <div className="mb-6 rounded-xl border border-gray-800 bg-gray-900/60 p-4 text-left">
            <p className="mb-2 text-xs font-semibold text-gray-500">🎮 Funkcije igrice</p>
            <ul className="space-y-1">
              {igrica.funkcije.slice(0, 4).map((f, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-gray-400">
                  <span className="mt-0.5 shrink-0 text-gray-600">•</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* 3D upozorenje */}
          {parametri.tredni && (
            <div className="mb-4 rounded-xl border border-purple-700/40 bg-purple-900/20 p-3 text-xs text-purple-300">
              🥽 Ova dimenzija ({dimenzija.nivo}) koristi 3D vizuelni prikaz
            </div>
          )}

          <button
            onClick={handlePokreni}
            className="w-full rounded-2xl bg-green-600 py-4 text-base font-bold text-white shadow-lg transition hover:bg-green-500"
          >
            ▶ Pokreni Igru
          </button>

          <div className="mt-3 flex gap-2">
            <button
              onClick={onPromeniDimenziju}
              className="flex-1 rounded-xl bg-purple-600/80 py-2 text-sm font-medium text-white transition hover:bg-purple-600"
            >
              🌀 Promeni dimenziju
            </button>
            <button
              onClick={onIzlaz}
              className="flex-1 rounded-xl bg-gray-700 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-600"
            >
              ✕ Izlaz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Kraj igre ──

  if (faza === 'kraj') {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-gray-950 px-4">
        <div className="w-full max-w-sm text-center">
          <div className="mb-4 text-5xl">{igrica.ikona}</div>
          <h2 className="mb-1 text-2xl font-bold text-white">Kraj igre!</h2>
          <p className="mb-4 text-sm text-gray-400">{igrica.naziv}</p>
          <DimenzijaBadge dimenzija={dimenzija.nivo} />

          <div className="mt-6 mb-6 rounded-2xl bg-gray-900 p-6">
            <p className="text-4xl font-bold text-yellow-400">{score.bodovi.toLocaleString('sr-RS')}</p>
            <p className="mt-1 text-sm text-gray-400">bodova</p>
            <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
              <div>
                <p className="text-gray-500">Nivo</p>
                <p className="font-bold text-white">{score.nivo}</p>
              </div>
              <div>
                <p className="text-gray-500">Vreme</p>
                <p className="font-bold text-white">{score.vreme}s</p>
              </div>
              <div>
                <p className="text-gray-500">D-bonus</p>
                <p className="font-bold text-white">×{parametri.brzinaMultiplikator.toFixed(1)}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={handleRestart}
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white transition hover:bg-blue-500"
            >
              🔄 Igraj ponovo
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

  // ── Aktivna igra ──

  const isPauziran = faza === 'pauza';
  const runnerProps = {
    key: restartKey,
    konfiguracija,
    isPauziran,
    onScoreUpdate: setScore,
    onKraj: handleKraj,
  };

  return (
    <div className="relative flex h-full flex-col">
      {/* HUD — uvek prikazan tokom igre */}
      <GamingHUD
        score={score}
        parametri={parametri}
        igricaNaziv={igrica.naziv}
        igricaIkona={igrica.ikona}
        onPauza={handlePauza}
      />

      {/* Runner */}
      <div className="flex-1 min-h-0">
        {runnerTip === 'akcija' && <AkcijaRunner {...runnerProps} />}
        {runnerTip === 'logicka' && <LogickaRunner {...runnerProps} />}
        {runnerTip === 'simulacija' && <SimulacijaRunner {...runnerProps} />}
        {runnerTip === 'edu' && <EduRunner {...runnerProps} />}
        {runnerTip === 'kreativna' && <KreativnaRunner {...runnerProps} />}
      </div>

      {/* Pauze meni — overlay */}
      {isPauziran && (
        <GamingPauzeMenu
          score={score}
          parametri={parametri}
          igricaNaziv={igrica.naziv}
          igricaIkona={igrica.ikona}
          onNastavi={handleNastavi}
          onRestart={handleRestart}
          onPromeniDimenziju={onPromeniDimenziju}
          onIzlaz={onIzlaz}
        />
      )}
    </div>
  );
}
