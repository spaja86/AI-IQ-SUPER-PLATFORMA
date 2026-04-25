'use client';

/**
 * EduRunner — Edukativne, RPG, avantura i detektivske igrice
 *
 * Quiz/dijalog forma: pitanja o dimenzijama, geometrijskim formama i
 * SPAJA ekosistemu. Igrač bira odgovor. Dimenzija određuje težinu,
 * broj pitanja i vremenski limit.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { GamingEndzinKonfiguracija, GameScore } from '@/lib/gaming-endzin';
import { noviScore } from '@/lib/gaming-endzin';
import DimenzijaBadge from '../DimenzijaBadge';

interface Props {
  konfiguracija: GamingEndzinKonfiguracija;
  isPauziran: boolean;
  onScoreUpdate: (score: GameScore) => void;
  onKraj: (score: GameScore) => void;
}

interface Pitanje {
  tekst: string;
  odgovori: string[];
  tacanIndex: number;
  pojasnjenje: string;
  tezina: 1 | 2 | 3;
}

const SVA_PITANJA: Pitanje[] = [
  {
    tekst: 'Koji geometrijski sloj je prvi u dimenzionalnom sistemu?',
    odgovori: ['Spirala', 'Elipsoid', 'Hiperbola', 'Rezonanca'],
    tacanIndex: 1,
    pojasnjenje: 'Elipsoid je osnova — prvi geometrijski sloj u svakoj dimenziji.',
    tezina: 1,
  },
  {
    tekst: 'Koliko geometrijskih slojeva ima dimenzija 360D?',
    odgovori: ['1', '2', '3', '4'],
    tacanIndex: 1,
    pojasnjenje: '360D ima 2 geometrijska sloja: Elipsoid i Rezonanca.',
    tezina: 1,
  },
  {
    tekst: 'Koja dimenzija ima punu reprodukciju i 6 zakona manifestacije?',
    odgovori: ['360D', '1440D', '2880D', '5760D'],
    tacanIndex: 3,
    pojasnjenje: '5760D je maksimalni režim sa svim slojevima, 6 zakona i punom reprodukcijom.',
    tezina: 1,
  },
  {
    tekst: 'Šta je obavezan zahtev za pokretanje igrica?',
    odgovori: ['Samo GPU', 'Digitalni Kompjuter + Digitalni Brauzer', 'Proksi mreža', 'OMEGA AI'],
    tacanIndex: 1,
    pojasnjenje: 'Digitalni Kompjuter i Digitalni Brauzer su obavezni za pokretanje bilo koje igrice.',
    tezina: 1,
  },
  {
    tekst: 'Koji zakon manifestacije je karakterističan za dimenziju 720D?',
    odgovori: ['Autorealizacija', 'Sinhonometrija', 'Hiperbolička funkcija', 'Materijalizacija'],
    tacanIndex: 3,
    pojasnjenje: 'U 720D važe zakoni Manifestacije i Materijalizacije (3 zakona).',
    tezina: 2,
  },
  {
    tekst: 'Koliko OMEGA AI persona postoji u sistemu?',
    odgovori: ['8', '12', '21', '28'],
    tacanIndex: 2,
    pojasnjenje: 'OMEGA AI ima 21 personu u 8 oktavnih nivoa.',
    tezina: 2,
  },
  {
    tekst: 'Šta radi SpajaPro engine u ekosistemu?',
    odgovori: ['Samo analizira', 'Zamenjuje ChatGPT za svu AI komunikaciju', 'Generiše slike', 'Upravlja proksi mrežom'],
    tacanIndex: 1,
    pojasnjenje: 'SpajaPro engine (verzije 6-15) potpuno zamenjuje ChatGPT u celom SPAJA ekosistemu.',
    tezina: 2,
  },
  {
    tekst: 'Kojim redosledom se izvršavaju oktave u OMEGA AI dispatcheru?',
    odgovori: ['8→1', '1→8', 'Slučajno', 'Paralelno'],
    tacanIndex: 1,
    pojasnjenje: 'OMEGA AI koristi sekvencijalni dispatch: oktave se izvršavaju redom 1→8.',
    tezina: 2,
  },
  {
    tekst: 'Šta znači cirkularna formula u dimenzionalnom sistemu?',
    odgovori: [
      'Krug',
      'Oduzimanje sa gornje i donje strane formule daje različite dimenzije',
      'Zakon gravitacije',
      'Algoritam za GPU',
    ],
    tacanIndex: 1,
    pojasnjenje: 'Cirkularne formule: ako oduzmeš sa gornje strane formulu i sa donje isto toliko — dobijaš različite dimenzije.',
    tezina: 3,
  },
  {
    tekst: 'Koji je kapacitet PROKSI mreže po signalu?',
    odgovori: ['1 TB', '10²²⁸ TB', '1 PB', '∞'],
    tacanIndex: 1,
    pojasnjenje: 'PROKSI mreža ima kapacitet 10²²⁸ TB po signalu — ekscentrični simulator hipsoneuričnog signala.',
    tezina: 3,
  },
  {
    tekst: 'Koliko verzija SpajaPro engine-a postoji (po verzijama 6-15)?',
    odgovori: ['5', '8', '10', '15'],
    tacanIndex: 2,
    pojasnjenje: 'SpajaPro ima 10 verzija: od SpajaPro 6 (Temelj) do SpajaPro 15 (Omega).',
    tezina: 1,
  },
  {
    tekst: 'Koja dimenzija koristi 3D prikaz sa naočarima?',
    odgovori: ['360D', '720D', '1440D i više', 'Samo 5760D'],
    tacanIndex: 2,
    pojasnjenje: 'Spoljašnje dimenzije (1440D, 2880D, 5760D) koriste 3D prikaz sa 3D naočarima.',
    tezina: 2,
  },
  {
    tekst: 'Šta je SpajaUltraOmegaCore?',
    odgovori: ['Baza podataka', 'Programski jezik sistema', 'Gaming hardware', 'API servis'],
    tacanIndex: 1,
    pojasnjenje: 'SpajaUltraOmegaCore -∞Ω+∞ je programski jezik na kome je baziran dimenzionalni gaming sistem.',
    tezina: 3,
  },
  {
    tekst: 'Koji geometrijski sloj je karakterističan za najviše dimenzije (2880D, 5760D)?',
    odgovori: ['Samo Elipsoid', 'Svi slojevi: Elipsoid, Rezonanca, Hiperbola, Spirala', 'Samo Spirala', 'Samo Hiperbola'],
    tacanIndex: 1,
    pojasnjenje: 'U najvišim dimenzijama sva 4 geometrijska sloja su aktivna: Elipsoid, Rezonanca, Hiperbola, Spirala.',
    tezina: 2,
  },
  {
    tekst: 'Koliko mobilnih centrala ima SPAJA Mobilna Mreža?',
    odgovori: ['2', '3', '4', '5'],
    tacanIndex: 2,
    pojasnjenje: 'SPAJA Mobilna Mreža ima 4 centrale: Primarna, Sekundarna, Redundantna i Globalna.',
    tezina: 2,
  },
];

function getSortedPitanja(tezinaNivo: number): Pitanje[] {
  const maxTezina = Math.min(3, Math.max(1, tezinaNivo)) as 1 | 2 | 3;
  return SVA_PITANJA
    .filter((p) => p.tezina <= maxTezina)
    .sort(() => Math.random() - 0.5);
}

export default function EduRunner({ konfiguracija, isPauziran, onScoreUpdate, onKraj }: Props) {
  const { parametri } = konfiguracija;
  const tezinaNivo = parametri.slojevi;
  const vremenLimit = Math.max(8, 20 - parametri.slojevi * 2);

  const pitanjaRef = useRef(getSortedPitanja(tezinaNivo));
  const [indeksPitanja, setIndeksPitanja] = useState(0);
  const [izabraniOdgovor, setIzabraniOdgovor] = useState<number | null>(null);
  const [pokaziPojas, setPokaziPojas] = useState(false);
  const [score, setScore] = useState<GameScore>(() => noviScore(parametri.nivo));
  const [vremeOstalo, setVremeOstalo] = useState(vremenLimit);
  const [gameOver, setGameOver] = useState(false);
  const [gresaka, setGresaka] = useState(0);

  const MAX_GRESAKA = 3;
  const pitanje = pitanjaRef.current[indeksPitanja % pitanjaRef.current.length];

  // ── Timer ──

  useEffect(() => {
    if (isPauziran || pokaziPojas || gameOver) return;
    if (vremeOstalo <= 0) {
      setIzabraniOdgovor(-1);
      setPokaziPojas(true);
      setGresaka((g) => g + 1);
      return;
    }
    const t = setInterval(() => setVremeOstalo((v) => v - 1), 1000);
    return () => clearInterval(t);
  }, [isPauziran, pokaziPojas, gameOver, vremeOstalo]);

  useEffect(() => {
    onScoreUpdate(score);
  }, [score, onScoreUpdate]);

  useEffect(() => {
    if (gresaka >= MAX_GRESAKA) {
      setGameOver(true);
      onKraj(score);
    }
  }, [gresaka, score, onKraj]);

  const handleOdgovor = useCallback((idx: number) => {
    if (izabraniOdgovor !== null || isPauziran || gameOver) return;
    setIzabraniOdgovor(idx);
    setPokaziPojas(true);

    if (idx === pitanje.tacanIndex) {
      const bonusBrzine = Math.max(1, vremeOstalo / vremenLimit);
      const dodati = Math.round(50 * pitanje.tezina * bonusBrzine * parametri.brzinaMultiplikator);
      setScore((prev) => ({
        ...prev,
        bodovi: prev.bodovi + dodati,
        nivo: prev.nivo + (prev.bodovi + dodati > prev.nivo * 500 ? 1 : 0),
      }));
    } else {
      setGresaka((g) => g + 1);
    }
  }, [izabraniOdgovor, isPauziran, gameOver, pitanje, vremeOstalo, vremenLimit, parametri.brzinaMultiplikator]);

  const sledecePitanje = useCallback(() => {
    setIndeksPitanja((i) => i + 1);
    setIzabraniOdgovor(null);
    setPokaziPojas(false);
    setVremeOstalo(vremenLimit);
  }, [vremenLimit]);

  if (gameOver) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-gray-950">
        <div className="text-5xl">🧠</div>
        <h2 className="text-2xl font-bold text-white">Game Over!</h2>
        <p className="text-sm text-gray-400">Previše grešaka ({MAX_GRESAKA})</p>
        <p className="text-4xl font-bold text-yellow-400">{score.bodovi.toLocaleString('sr-RS')}</p>
        <p className="text-sm text-gray-400">bodova · Nivo {score.nivo}</p>
        <p className="text-xs text-gray-600">Dimenzija: {parametri.nivo}</p>
      </div>
    );
  }

  const tacanOdg = pitanje.tacanIndex;
  const korisnikTacan = izabraniOdgovor === tacanOdg;

  return (
    <div className="flex h-full flex-col items-center justify-center bg-gray-950 px-4 py-6">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <DimenzijaBadge dimenzija={parametri.nivo} mali />
          <span className="text-sm font-bold text-yellow-400">{score.bodovi.toLocaleString('sr-RS')} bod.</span>
          <div className="flex gap-1">
            {Array.from({ length: MAX_GRESAKA }).map((_, i) => (
              <span key={i} className={i < gresaka ? 'text-red-500' : 'text-gray-600'}>❤️</span>
            ))}
          </div>
        </div>

        {/* Timer */}
        <div className="mb-4">
          <div className="mb-1 flex justify-between text-xs text-gray-500">
            <span>Pitanje {(indeksPitanja % pitanjaRef.current.length) + 1} / {pitanjaRef.current.length}</span>
            <span className={vremeOstalo <= 5 ? 'text-red-400 font-bold' : ''}>{vremeOstalo}s</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-gray-700">
            <div
              className={`h-1.5 rounded-full transition-all ${vremeOstalo <= 5 ? 'bg-red-500' : 'bg-blue-500'}`}
              style={{ width: `${(vremeOstalo / vremenLimit) * 100}%` }}
            />
          </div>
        </div>

        {/* Pitanje */}
        <div className="mb-6 rounded-2xl border border-gray-700 bg-gray-900 p-5">
          <p className="text-base font-semibold text-white leading-relaxed">{pitanje.tekst}</p>
          {pitanje.tezina === 3 && (
            <span className="mt-2 inline-block rounded-full bg-red-900/40 px-2 py-0.5 text-xs text-red-400">⚡ Teško</span>
          )}
          {pitanje.tezina === 2 && (
            <span className="mt-2 inline-block rounded-full bg-yellow-900/40 px-2 py-0.5 text-xs text-yellow-400">🔶 Srednje</span>
          )}
        </div>

        {/* Odgovori */}
        <div className="flex flex-col gap-2 mb-4">
          {pitanje.odgovori.map((odg, idx) => {
            let klasa = 'bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700';
            if (pokaziPojas) {
              if (idx === tacanOdg) klasa = 'bg-green-900/60 border-green-500 text-green-200';
              else if (idx === izabraniOdgovor) klasa = 'bg-red-900/60 border-red-500 text-red-200';
              else klasa = 'bg-gray-800 border-gray-700 text-gray-500';
            }
            return (
              <button
                key={idx}
                onClick={() => handleOdgovor(idx)}
                disabled={pokaziPojas}
                className={`rounded-xl border px-4 py-3 text-left text-sm transition ${klasa}`}
              >
                <span className="mr-2 font-bold">{String.fromCharCode(65 + idx)}.</span>
                {odg}
              </button>
            );
          })}
        </div>

        {/* Pojašnjenje */}
        {pokaziPojas && (
          <div className={`rounded-xl p-4 mb-4 ${korisnikTacan ? 'bg-green-900/30 border border-green-700/50' : 'bg-red-900/30 border border-red-700/50'}`}>
            <p className={`text-sm font-bold mb-1 ${korisnikTacan ? 'text-green-400' : 'text-red-400'}`}>
              {korisnikTacan ? '✅ Tačno!' : '❌ Netačno!'}
            </p>
            <p className="text-sm text-gray-300">{pitanje.pojasnjenje}</p>
          </div>
        )}

        {pokaziPojas && (
          <button
            onClick={sledecePitanje}
            className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white transition hover:bg-blue-500"
          >
            Sledeće pitanje →
          </button>
        )}
      </div>
    </div>
  );
}
