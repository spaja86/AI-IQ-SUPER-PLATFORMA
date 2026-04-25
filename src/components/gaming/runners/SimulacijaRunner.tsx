'use client';

/**
 * SimulacijaRunner — Simulacione i strateške igrice
 *
 * Resource management grid: igrač klika/bira ćelije da gradi resurse,
 * upravlja mrežom i odbrani od talasa. Dimenzija određuje veličinu
 * grida, broj resursa i brzinu talasa.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import type { GamingEndzinKonfiguracija, GameScore } from '@/lib/gaming-endzin';
import { noviScore } from '@/lib/gaming-endzin';
import DimenzijaBadge from '../DimenzijaBadge';

interface Props {
  konfiguracija: GamingEndzinKonfiguracija;
  isPauziran: boolean;
  onScoreUpdate: (score: GameScore) => void;
  onKraj: (score: GameScore) => void;
}

type CelijaTip = 'prazna' | 'baza' | 'generator' | 'kula' | 'neprijatelj';

interface Celija {
  tip: CelijaTip;
  hp: number;
  maxHp: number;
  nivo: number;
}

const GRID_VELIICINA = 8;

function noviGrid(dimSlojevi: number): Celija[][] {
  const grid: Celija[][] = Array.from({ length: GRID_VELIICINA }, (_, r) =>
    Array.from({ length: GRID_VELIICINA }, (_, c) => {
      // Baza u centru
      if (r === Math.floor(GRID_VELIICINA / 2) && c === Math.floor(GRID_VELIICINA / 2)) {
        return { tip: 'baza', hp: 50 + dimSlojevi * 20, maxHp: 50 + dimSlojevi * 20, nivo: 1 };
      }
      return { tip: 'prazna', hp: 0, maxHp: 0, nivo: 0 };
    }),
  );
  return grid;
}

const CENA: Record<CelijaTip, number> = {
  prazna: 0,
  baza: 0,
  generator: 30,
  kula: 50,
  neprijatelj: 0,
};

const IKONE: Record<CelijaTip, string> = {
  prazna: '',
  baza: '🏛️',
  generator: '⚡',
  kula: '🔫',
  neprijatelj: '👾',
};

const BOJE: Record<CelijaTip, string> = {
  prazna: 'bg-gray-800/40 hover:bg-gray-700/60',
  baza: 'bg-blue-900/60 border-blue-500/60',
  generator: 'bg-green-900/60 border-green-500/60',
  kula: 'bg-yellow-900/60 border-yellow-500/60',
  neprijatelj: 'bg-red-900/60 border-red-500/60',
};

type IzabranaGradnja = 'generator' | 'kula';

export default function SimulacijaRunner({ konfiguracija, isPauziran, onScoreUpdate, onKraj }: Props) {
  const { parametri } = konfiguracija;
  const [grid, setGrid] = useState<Celija[][]>(() => noviGrid(parametri.slojevi));
  const [resursi, setResursi] = useState(100);
  const [izabrano, setIzabrano] = useState<IzabranaGradnja>('generator');
  const [score, setScore] = useState<GameScore>(() => noviScore(parametri.nivo));
  const [gameOver, setGameOver] = useState(false);
  const [talas, setTalas] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const genTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const talasPauza = useRef(false);

  // ── Generatori resursa ──

  useEffect(() => {
    if (isPauziran || gameOver) return;
    genTimerRef.current = setInterval(() => {
      setGrid((prev) => {
        let prihod = 0;
        for (const red of prev) {
          for (const cel of red) {
            if (cel.tip === 'generator') prihod += 5 + cel.nivo * 2;
          }
        }
        if (prihod > 0) setResursi((r) => r + prihod);
        return prev;
      });
    }, Math.max(500, 2000 / parametri.brzinaMultiplikator));
    return () => { if (genTimerRef.current) clearInterval(genTimerRef.current); };
  }, [isPauziran, gameOver, parametri.brzinaMultiplikator]);

  // ── Talasi neprijatelja ──

  const spawnTalas = useCallback((brTalasa: number) => {
    if (talasPauza.current) return;
    talasPauza.current = true;
    const neprijateljaPoTalasu = 2 + brTalasa + Math.floor(parametri.slojevi / 2);
    setGrid((prev) => {
      const noviG = prev.map((r) => r.map((c) => ({ ...c })));
      let postavljeno = 0;
      // Postavi neprijatelje po ivicama
      const ivice: [number, number][] = [];
      for (let i = 0; i < GRID_VELIICINA; i++) {
        ivice.push([0, i], [GRID_VELIICINA - 1, i], [i, 0], [i, GRID_VELIICINA - 1]);
      }
      const izmiksane = ivice.sort(() => Math.random() - 0.5);
      for (const [r, c] of izmiksane) {
        if (postavljeno >= neprijateljaPoTalasu) break;
        if (noviG[r][c].tip === 'prazna') {
          const hpNepr = 10 + brTalasa * 5;
          noviG[r][c] = { tip: 'neprijatelj', hp: hpNepr, maxHp: hpNepr, nivo: brTalasa };
          postavljeno++;
        }
      }
      return noviG;
    });
    setTimeout(() => { talasPauza.current = false; }, 3000);
  }, [parametri.slojevi]);

  // ── Tik simulacije (kule napadaju, neprijatelji se kreću) ──

  useEffect(() => {
    if (isPauziran || gameOver) return;
    timerRef.current = setInterval(() => {
      setGrid((prev) => {
        const noviG = prev.map((r) => r.map((c) => ({ ...c })));
        let boduziDodati = 0;

        // Kule napadaju okolne neprijatelje
        for (let r = 0; r < GRID_VELIICINA; r++) {
          for (let c = 0; c < GRID_VELIICINA; c++) {
            if (noviG[r][c].tip !== 'kula') continue;
            const dometi = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];
            for (const [dr, dc] of dometi) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr < 0 || nr >= GRID_VELIICINA || nc < 0 || nc >= GRID_VELIICINA) continue;
              if (noviG[nr][nc].tip === 'neprijatelj') {
                noviG[nr][nc].hp -= 5 + noviG[r][c].nivo * 3;
                if (noviG[nr][nc].hp <= 0) {
                  boduziDodati += 20 + noviG[nr][nc].nivo * 10;
                  noviG[nr][nc] = { tip: 'prazna', hp: 0, maxHp: 0, nivo: 0 };
                }
                break;
              }
            }
          }
        }

        // Neprijatelji se pomeraju prema centru
        const centerR = Math.floor(GRID_VELIICINA / 2);
        const centerC = Math.floor(GRID_VELIICINA / 2);
        const neprijateljiPos: [number, number][] = [];
        for (let r = 0; r < GRID_VELIICINA; r++) {
          for (let c = 0; c < GRID_VELIICINA; c++) {
            if (noviG[r][c].tip === 'neprijatelj') neprijateljiPos.push([r, c]);
          }
        }
        for (const [r, c] of neprijateljiPos) {
          if (noviG[r][c].tip !== 'neprijatelj') continue;
          const dr = Math.sign(centerR - r);
          const dc = Math.sign(centerC - c);
          const mogucPomaci: [number, number][] = [];
          if (dr !== 0) mogucPomaci.push([r + dr, c]);
          if (dc !== 0) mogucPomaci.push([r, c + dc]);

          for (const [nr, nc] of mogucPomaci) {
            if (nr < 0 || nr >= GRID_VELIICINA || nc < 0 || nc >= GRID_VELIICINA) continue;
            const meta = noviG[nr][nc];
            if (meta.tip === 'prazna' || meta.tip === 'generator' || meta.tip === 'kula') {
              // Uništava generatore i kule
              if (meta.tip !== 'prazna') boduziDodati -= 5;
              noviG[nr][nc] = { ...noviG[r][c] };
              noviG[r][c] = { tip: 'prazna', hp: 0, maxHp: 0, nivo: 0 };
              break;
            } else if (meta.tip === 'baza') {
              // Napada bazu
              noviG[nr][nc].hp -= 10;
              noviG[r][c] = { tip: 'prazna', hp: 0, maxHp: 0, nivo: 0 };
              if (noviG[nr][nc].hp <= 0) {
                // Game over
                setGameOver(true);
                return noviG;
              }
              break;
            }
          }
        }

        if (boduziDodati !== 0) {
          setScore((prev) => {
            const noviScore = { ...prev, bodovi: Math.max(0, prev.bodovi + Math.round(boduziDodati * parametri.brzinaMultiplikator)) };
            return noviScore;
          });
        }

        // Provjeri da li su svi neprijatelji poraženi
        const preostalo = noviG.flat().filter((c) => c.tip === 'neprijatelj').length;
        if (preostalo === 0 && !talasPauza.current) {
          setTalas((t) => {
            spawnTalas(t + 1);
            return t + 1;
          });
        }

        return noviG;
      });
    }, Math.max(200, 1000 / parametri.brzinaMultiplikator));

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPauziran, gameOver, parametri, spawnTalas]);

  // ── Score sync ──

  useEffect(() => {
    onScoreUpdate(score);
  }, [score, onScoreUpdate]);

  useEffect(() => {
    if (gameOver) onKraj(score);
  }, [gameOver, score, onKraj]);

  // ── Talas inicijalizacija ──

  useEffect(() => {
    const t = setTimeout(() => spawnTalas(1), 2000);
    return () => clearTimeout(t);
  }, [spawnTalas]);

  // ── Klik na ćeliju ──

  const handleKlik = useCallback((r: number, c: number) => {
    if (isPauziran || gameOver) return;
    setGrid((prev) => {
      const celija = prev[r][c];
      if (celija.tip !== 'prazna') return prev;
      const cena = CENA[izabrano];
      if (resursi < cena) return prev;
      setResursi((res) => res - cena);
      const noviG = prev.map((row) => row.map((cell) => ({ ...cell })));
      const hp = izabrano === 'kula' ? 30 : 20;
      noviG[r][c] = { tip: izabrano, hp, maxHp: hp, nivo: 1 };
      return noviG;
    });
  }, [isPauziran, gameOver, izabrano, resursi]);

  const bazaHp = grid.flat().find((c) => c.tip === 'baza')?.hp ?? 0;
  const bazaMaxHp = grid.flat().find((c) => c.tip === 'baza')?.maxHp ?? 1;

  if (gameOver) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-gray-950">
        <div className="text-5xl">🏚️</div>
        <h2 className="text-2xl font-bold text-white">Baza uništena!</h2>
        <p className="text-4xl font-bold text-yellow-400">{score.bodovi.toLocaleString('sr-RS')}</p>
        <p className="text-sm text-gray-400">bodova · Talas {talas}</p>
        <p className="text-xs text-gray-600">Dimenzija: {parametri.nivo}</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-gray-950 text-white">
      {/* Status bar */}
      <div className="flex shrink-0 items-center gap-4 border-b border-gray-800 px-4 py-2">
        <DimenzijaBadge dimenzija={parametri.nivo} mali />
        <span className="text-sm">💰 {resursi}</span>
        <span className="text-sm">🌊 Talas {talas}</span>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-400">Baza:</span>
          <div className="h-2 w-24 rounded-full bg-gray-700">
            <div
              className="h-2 rounded-full bg-blue-500 transition-all"
              style={{ width: `${(bazaHp / bazaMaxHp) * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-400">{bazaHp}</span>
        </div>
        <span className="ml-auto text-sm font-bold text-yellow-400">{score.bodovi.toLocaleString('sr-RS')} bod.</span>
      </div>

      {/* Grid */}
      <div className="flex flex-1 items-center justify-center p-4">
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${GRID_VELIICINA}, minmax(0, 1fr))` }}
        >
          {grid.map((red, r) =>
            red.map((celija, c) => (
              <button
                key={`${r}-${c}`}
                onClick={() => handleKlik(r, c)}
                className={`flex h-12 w-12 items-center justify-center rounded-lg border text-xl transition ${BOJE[celija.tip]}`}
                title={celija.tip === 'prazna' ? `Gradi ${izabrano} (${CENA[izabrano]} 💰)` : celija.tip}
              >
                <span>{IKONE[celija.tip]}</span>
                {celija.tip !== 'prazna' && (
                  <div
                    className="absolute bottom-0.5 left-0.5 right-0.5 h-0.5 rounded-full bg-green-400/60"
                    style={{ width: `${(celija.hp / celija.maxHp) * 100}%` }}
                  />
                )}
              </button>
            )),
          )}
        </div>
      </div>

      {/* Kontrole */}
      <div className="flex shrink-0 items-center justify-center gap-3 border-t border-gray-800 px-4 py-2">
        <button
          onClick={() => setIzabrano('generator')}
          className={`rounded-lg px-3 py-2 text-sm font-bold transition ${izabrano === 'generator' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          ⚡ Generator ({CENA.generator} 💰)
        </button>
        <button
          onClick={() => setIzabrano('kula')}
          className={`rounded-lg px-3 py-2 text-sm font-bold transition ${izabrano === 'kula' ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          🔫 Kula ({CENA.kula} 💰)
        </button>
        <span className="text-xs text-gray-500">Klikni praznu ćeliju da gradiš</span>
      </div>
    </div>
  );
}
