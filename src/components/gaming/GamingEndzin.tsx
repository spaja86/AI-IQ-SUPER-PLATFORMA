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
import { isFeatureEnabled } from '@/lib/feature-flags';

import GamingHUD from './GamingHUD';
import GamingPauzeMenu from './GamingPauzeMenu';
import DimenzijaBadge from './DimenzijaBadge';

import dynamic from 'next/dynamic';
import Button from '@/components/Button';

const AkcijaRunner = dynamic(() => import('./runners/AkcijaRunner'), { ssr: false });
const LogickaRunner = dynamic(() => import('./runners/LogickaRunner'), { ssr: false });
const SimulacijaRunner = dynamic(() => import('./runners/SimulacijaRunner'), { ssr: false });
const EduRunner = dynamic(() => import('./runners/EduRunner'), { ssr: false });
const KreativnaRunner = dynamic(() => import('./runners/KreativnaRunner'), { ssr: false });
const BorbenaRunner = dynamic(() => import('./runners/BorbenaRunner'), { ssr: false });
const PokerRunner = dynamic(() => import('./runners/PokerRunner'), { ssr: false });
const EglanRunner = dynamic(() => import('./runners/EglanRunner'), { ssr: false });
const ReaktRunner = dynamic(() => import('./runners/ReaktRunner'), { ssr: false });

// ─── COLD AND FIRE karakteri ─────────────────────────────────────────

interface ColdFireKarakter {
  id: 'cold' | 'fire';
  naziv: string;
  ikona: string;
  opis: string;
  atributi: { naziv: string; vrednost: number }[];
}

const COLD_FIRE_KARAKTERI: ColdFireKarakter[] = [
  {
    id: 'cold',
    naziv: 'Cold Ratnik',
    ikona: '❄️',
    opis: 'Majstor ledenih moći. Kristalni oklop od dimenzionalnog leda koji menja providnost prema dimenziji.',
    atributi: [
      { naziv: 'Hladnoća', vrednost: 95 },
      { naziv: 'Odbrana', vrednost: 88 },
      { naziv: 'Brzina', vrednost: 72 },
      { naziv: 'Elementalna moć', vrednost: 90 },
    ],
  },
  {
    id: 'fire',
    naziv: 'Fire Feniks',
    ikona: '🔥',
    opis: 'Komandant vatrenih moći. Ognjeni oklop koji tinja i eksplodira prema snazi dimenzije.',
    atributi: [
      { naziv: 'Vatra', vrednost: 98 },
      { naziv: 'Napad', vrednost: 95 },
      { naziv: 'Brzina', vrednost: 85 },
      { naziv: 'Elementalna moć', vrednost: 93 },
    ],
  },
];

// ─── EGLAN HEROJI ─────────────────────────────────────────────────────

interface EglanHeroj {
  id: 'ratnik' | 'senka';
  naziv: string;
  ikona: string;
  opis: string;
  atributi: { naziv: string; vrednost: number }[];
}

const EGLAN_HEROJI: EglanHeroj[] = [
  {
    id: 'ratnik',
    naziv: 'Ratnik Svetlosti',
    ikona: '⚔️',
    opis: 'Uravnoteženi borac sa štitom i mačem. Q taster reflektuje Eglanove projektile.',
    atributi: [
      { naziv: 'Napad', vrednost: 75 },
      { naziv: 'Odbrana', vrednost: 95 },
      { naziv: 'Brzina', vrednost: 70 },
      { naziv: 'Izdržljivost', vrednost: 90 },
    ],
  },
  {
    id: 'senka',
    naziv: 'Senka Ubojica',
    ikona: '🗡️',
    opis: 'Brza atentatorkinja, stakleni top. Q taster daje privremenu nevidljivost.',
    atributi: [
      { naziv: 'Napad', vrednost: 95 },
      { naziv: 'Odbrana', vrednost: 55 },
      { naziv: 'Brzina', vrednost: 98 },
      { naziv: 'Izdržljivost', vrednost: 60 },
    ],
  },
];

interface Props {
  igrica: Igrica;
  dimenzija: Dimenzija;
  onPromeniDimenziju: () => void;
  onIzlaz: () => void;
}

type GameFaza = 'karakter' | 'uvod' | 'igra' | 'pauza' | 'kraj';

export default function GamingEndzin({ igrica, dimenzija, onPromeniDimenziju, onIzlaz }: Props) {
  const isColdAndFire = igrica.id === 'igrica-cold-and-fire';
  const isEglan = igrica.id === 'igrica-ekstreminacija-eglana';

  const [faza, setFaza] = useState<GameFaza>((isColdAndFire || isEglan) ? 'karakter' : 'uvod');
  const [score, setScore] = useState<GameScore>(() => noviScore(dimenzija.nivo));
  const [restartKey, setRestartKey] = useState(0);
  const [odabraniKarakter, setOdabraniKarakter] = useState<'cold' | 'fire'>('cold');
  const [odabraniHeroj, setOdabraniHeroj] = useState<'ratnik' | 'senka'>('ratnik');
  const [elemMod, setElemMod] = useState<'cold' | 'fire'>('cold');
  const [fusionGauge, setFusionGauge] = useState(0);

  const konfiguracija = kreirajEndzinKonfiguraciju(igrica, dimenzija);
  const { parametri, runnerTip } = konfiguracija;
  const pokerRunnerEnabled = isFeatureEnabled('gaming-master-poker-runner-v1');
  const efektivniRunnerTip = runnerTip === 'poker' && !pokerRunnerEnabled ? 'simulacija' : runnerTip;

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
    if (isColdAndFire || isEglan) {
      setFaza('karakter');
    } else {
      setFaza('igra');
    }
  }, [dimenzija.nivo, isColdAndFire, isEglan]);

  const handleKraj = useCallback((finalScore: GameScore) => {
    setScore(finalScore);
    setFaza('kraj');
  }, []);

  const handleModChange = useCallback((mod: 'cold' | 'fire', gauge: number) => {
    setElemMod(mod);
    setFusionGauge(gauge);
  }, []);

  // ── Ekran za izbor karaktera (samo COLD AND FIRE) ──

  if (faza === 'karakter' && isColdAndFire) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-gray-950 px-4">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <div className="mb-2 text-5xl">🔥❄️</div>
            <h1 className="text-2xl font-bold text-white">COLD AND FIRE</h1>
            <p className="mt-1 text-sm text-gray-400">Izaberi svog heroja</p>
            <div className="mt-2 flex justify-center">
              <DimenzijaBadge dimenzija={dimenzija.nivo} />
            </div>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-3">
            {COLD_FIRE_KARAKTERI.map((kar) => (
              <button
                key={kar.id}
                type="button"
                onClick={() => setOdabraniKarakter(kar.id)}
                className={`rounded-2xl border-2 p-4 text-left transition ${
                  odabraniKarakter === kar.id
                    ? kar.id === 'cold'
                      ? 'border-cyan-500 bg-cyan-900/30'
                      : 'border-orange-500 bg-orange-900/30'
                    : 'border-gray-700 bg-gray-900/60 hover:border-gray-500'
                }`}
              >
                <div className="mb-2 text-3xl text-center">{kar.ikona}</div>
                <p className={`mb-1 text-center text-sm font-bold ${
                  kar.id === 'cold' ? 'text-cyan-300' : 'text-orange-300'
                }`}>
                  {kar.naziv}
                </p>
                <p className="mb-3 text-center text-xs text-gray-500 leading-relaxed">{kar.opis}</p>
                {/* Atributi kao bar chart */}
                <div className="space-y-1.5">
                  {kar.atributi.map((attr) => (
                    <div key={attr.naziv}>
                      <div className="mb-0.5 flex justify-between text-[10px]">
                        <span className="text-gray-500">{attr.naziv}</span>
                        <span className="font-bold text-gray-300">{attr.vrednost}</span>
                      </div>
                      <div className="h-1 rounded-full bg-gray-800">
                        <div
                          className={`h-1 rounded-full ${kar.id === 'cold' ? 'bg-cyan-500' : 'bg-orange-500'}`}
                          style={{ width: `${attr.vrednost}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>

          <Button
            onClick={() => {
              setElemMod(odabraniKarakter);
              setFaza('uvod');
            }}
            className={`w-full rounded-2xl py-4 text-base font-bold text-white shadow-lg transition ${
              odabraniKarakter === 'cold'
                ? 'bg-cyan-700 hover:bg-cyan-600'
                : 'bg-orange-700 hover:bg-orange-600'
            }`}
          >
            {odabraniKarakter === 'cold' ? '❄️' : '🔥'} Odaberi{' '}
            {COLD_FIRE_KARAKTERI.find((k) => k.id === odabraniKarakter)?.naziv}
          </Button>

          <div className="mt-3 flex gap-2">
            <Button
              onClick={onPromeniDimenziju}
              className="flex-1 rounded-xl bg-purple-600/80 py-2 text-sm font-medium text-white transition hover:bg-purple-600"
            >
              🌀 Promeni dimenziju
            </Button>
            <Button
              onClick={onIzlaz}
              className="flex-1 rounded-xl bg-gray-700 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-600"
            >
              ✕ Izlaz
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Ekran za izbor heroja (samo EGLAN) ──

  if (faza === 'karakter' && isEglan) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-gray-950 px-4">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <div className="mb-2 text-5xl">👁️</div>
            <h1 className="text-2xl font-bold text-white">EKSTREMINACIJA EGLANA</h1>
            <p className="mt-1 text-sm text-gray-400">Izaberi svog heroja</p>
            <div className="mt-2 flex justify-center">
              <DimenzijaBadge dimenzija={dimenzija.nivo} />
            </div>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-3">
            {EGLAN_HEROJI.map((heroj) => (
              <button
                key={heroj.id}
                type="button"
                onClick={() => setOdabraniHeroj(heroj.id)}
                className={`rounded-2xl border-2 p-4 text-left transition ${
                  odabraniHeroj === heroj.id
                    ? heroj.id === 'ratnik'
                      ? 'border-yellow-500 bg-yellow-900/30'
                      : 'border-purple-500 bg-purple-900/30'
                    : 'border-gray-700 bg-gray-900/60 hover:border-gray-500'
                }`}
              >
                <div className="mb-2 text-3xl text-center">{heroj.ikona}</div>
                <p className={`mb-1 text-center text-sm font-bold ${
                  heroj.id === 'ratnik' ? 'text-yellow-300' : 'text-purple-300'
                }`}>
                  {heroj.naziv}
                </p>
                <p className="mb-3 text-center text-xs text-gray-500 leading-relaxed">{heroj.opis}</p>
                {/* Atributi kao bar chart */}
                <div className="space-y-1.5">
                  {heroj.atributi.map((attr) => (
                    <div key={attr.naziv}>
                      <div className="mb-0.5 flex justify-between text-[10px]">
                        <span className="text-gray-500">{attr.naziv}</span>
                        <span className="font-bold text-gray-300">{attr.vrednost}</span>
                      </div>
                      <div className="h-1 rounded-full bg-gray-800">
                        <div
                          className={`h-1 rounded-full ${heroj.id === 'ratnik' ? 'bg-yellow-500' : 'bg-purple-500'}`}
                          style={{ width: `${attr.vrednost}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>

          <Button
            onClick={() => setFaza('uvod')}
            className={`w-full rounded-2xl py-4 text-base font-bold text-white shadow-lg transition ${
              odabraniHeroj === 'ratnik'
                ? 'bg-yellow-700 hover:bg-yellow-600'
                : 'bg-purple-700 hover:bg-purple-600'
            }`}
          >
            {odabraniHeroj === 'ratnik' ? '⚔️' : '🗡️'} Odaberi{' '}
            {EGLAN_HEROJI.find((h) => h.id === odabraniHeroj)?.naziv}
          </Button>

          <div className="mt-3 flex gap-2">
            <Button
              onClick={onPromeniDimenziju}
              className="flex-1 rounded-xl bg-purple-600/80 py-2 text-sm font-medium text-white transition hover:bg-purple-600"
            >
              🌀 Promeni dimenziju
            </Button>
            <Button
              onClick={onIzlaz}
              className="flex-1 rounded-xl bg-gray-700 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-600"
            >
              ✕ Izlaz
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Uvod ekran ──

  if (faza === 'uvod') {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-gray-950 px-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-4 text-6xl">{igrica.ikona}</div>
          <h1 className="mb-2 text-2xl font-bold text-white">{igrica.naziv}</h1>
          {isColdAndFire && (
            <p className={`mb-2 text-sm font-semibold ${odabraniKarakter === 'cold' ? 'text-cyan-400' : 'text-orange-400'}`}>
              {odabraniKarakter === 'cold' ? '❄️ Cold Ratnik' : '🔥 Fire Feniks'}
            </p>
          )}
          {isEglan && (
            <p className={`mb-2 text-sm font-semibold ${odabraniHeroj === 'ratnik' ? 'text-yellow-400' : 'text-purple-400'}`}>
              {odabraniHeroj === 'ratnik' ? '⚔️ Ratnik Svetlosti' : '🗡️ Senka Ubojica'}
            </p>
          )}
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

          <Button
            onClick={handlePokreni}
            className="w-full rounded-2xl bg-green-600 py-4 text-base font-bold text-white shadow-lg transition hover:bg-green-500"
          >
            ▶ Pokreni Igru
          </Button>

          <div className="mt-3 flex gap-2">
            {(isColdAndFire || isEglan) && (
              <Button
                onClick={() => setFaza('karakter')}
                className="flex-1 rounded-xl bg-gray-700 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-600"
              >
                ← Promeni heroja
              </Button>
            )}
            <Button
              onClick={onPromeniDimenziju}
              className="flex-1 rounded-xl bg-purple-600/80 py-2 text-sm font-medium text-white transition hover:bg-purple-600"
            >
              🌀 Promeni dimenziju
            </Button>
            <Button
              onClick={onIzlaz}
              className="flex-1 rounded-xl bg-gray-700 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-600"
            >
              ✕ Izlaz
            </Button>
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
            <Button
              onClick={handleRestart}
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white transition hover:bg-blue-500"
            >
              🔄 Igraj ponovo
            </Button>
            <Button
              onClick={onPromeniDimenziju}
              className="w-full rounded-xl bg-purple-600/80 py-3 text-sm font-bold text-white transition hover:bg-purple-600"
            >
              🌀 Promeni dimenziju
            </Button>
            <Button
              onClick={onIzlaz}
              className="w-full rounded-xl bg-gray-700 py-3 text-sm font-medium text-gray-300 transition hover:bg-gray-600"
            >
              ✕ Izlaz iz igre
            </Button>
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
        elemMod={isColdAndFire ? elemMod : undefined}
        fusionGauge={isColdAndFire && parametri.slojevi >= 3 ? fusionGauge : undefined}
      />

      {/* Runner */}
      <div className="flex-1 min-h-0">
        {efektivniRunnerTip === 'akcija' && <AkcijaRunner {...runnerProps} />}
        {efektivniRunnerTip === 'logicka' && <LogickaRunner {...runnerProps} />}
        {efektivniRunnerTip === 'simulacija' && <SimulacijaRunner {...runnerProps} />}
        {efektivniRunnerTip === 'edu' && <EduRunner {...runnerProps} />}
        {efektivniRunnerTip === 'kreativna' && <KreativnaRunner {...runnerProps} />}
        {efektivniRunnerTip === 'poker' && <PokerRunner {...runnerProps} />}
        {efektivniRunnerTip === 'borbena' && (
          <BorbenaRunner
            {...runnerProps}
            startingMod={odabraniKarakter}
            onModChange={handleModChange}
          />
        )}
        {efektivniRunnerTip === 'eglan' && (
          <EglanRunner
            {...runnerProps}
            startingHero={odabraniHeroj}
          />
        )}
        {efektivniRunnerTip === 'reakt' && <ReaktRunner {...runnerProps} />}
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
