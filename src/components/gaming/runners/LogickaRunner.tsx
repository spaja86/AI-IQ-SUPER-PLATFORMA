'use client';

/**
 * LogickaRunner — Logičke i arkadne igrice
 *
 * Puzzle mehanika: blokovi geometrijskih oblika padaju na grid.
 * Igrač ih pomiče i rotira da popuni redove.
 * Dimenzija određuje brzinu pada, broj boja i kompleksnost oblika.
 */

import { useRef, useEffect, useCallback, useState } from 'react';
import type { GamingEndzinKonfiguracija, GameScore } from '@/lib/gaming-endzin';
import { noviScore, crtajElipsoid, crtajRezonancu } from '@/lib/gaming-endzin';

interface Props {
  konfiguracija: GamingEndzinKonfiguracija;
  isPauziran: boolean;
  onScoreUpdate: (score: GameScore) => void;
  onKraj: (score: GameScore) => void;
}

const KOLONE = 10;
const REDOVI = 18;
type GridCelija = null | string;

const BLOK_OBLICI: number[][][] = [
  [[1, 1, 1, 1]],
  [[1, 1], [1, 1]],
  [[1, 1, 1], [0, 1, 0]],
  [[1, 1, 1], [1, 0, 0]],
  [[1, 1, 1], [0, 0, 1]],
  [[1, 1, 0], [0, 1, 1]],
  [[0, 1, 1], [1, 1, 0]],
];

function noviBlok(akcentHex: string): { oblik: number[][]; x: number; y: number; boja: string } {
  const oblik = BLOK_OBLICI[Math.floor(Math.random() * BLOK_OBLICI.length)];
  return { oblik, x: Math.floor(KOLONE / 2) - 1, y: 0, boja: akcentHex };
}

function mozePasti(
  grid: GridCelija[][],
  oblik: number[][],
  bx: number,
  by: number,
): boolean {
  for (let r = 0; r < oblik.length; r++) {
    for (let c = 0; c < oblik[r].length; c++) {
      if (!oblik[r][c]) continue;
      const nr = by + r + 1;
      const nc = bx + c;
      if (nr >= REDOVI) return false;
      if (nc < 0 || nc >= KOLONE) return false;
      if (grid[nr][nc] !== null) return false;
    }
  }
  return true;
}

function mozePomak(grid: GridCelija[][], oblik: number[][], bx: number, by: number, dx: number): boolean {
  for (let r = 0; r < oblik.length; r++) {
    for (let c = 0; c < oblik[r].length; c++) {
      if (!oblik[r][c]) continue;
      const nc = bx + c + dx;
      if (nc < 0 || nc >= KOLONE) return false;
      if (by + r >= 0 && grid[by + r][nc] !== null) return false;
    }
  }
  return true;
}

function rotacijaOblik(oblik: number[][]): number[][] {
  const rows = oblik.length;
  const cols = oblik[0].length;
  const rotated: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rotated[c][rows - 1 - r] = oblik[r][c];
    }
  }
  return rotated;
}

function ugradi(grid: GridCelija[][], oblik: number[][], bx: number, by: number, boja: string): GridCelija[][] {
  const noviGrid = grid.map((r) => [...r]);
  for (let r = 0; r < oblik.length; r++) {
    for (let c = 0; c < oblik[r].length; c++) {
      if (!oblik[r][c]) continue;
      if (by + r >= 0) noviGrid[by + r][bx + c] = boja;
    }
  }
  return noviGrid;
}

function ocistiPuneRedove(grid: GridCelija[][]): { noviGrid: GridCelija[][]; ocisceniRedovi: number } {
  const noviGrid = grid.filter((red) => red.some((c) => c === null));
  const ocisceniRedovi = REDOVI - noviGrid.length;
  while (noviGrid.length < REDOVI) {
    noviGrid.unshift(Array(KOLONE).fill(null));
  }
  return { noviGrid, ocisceniRedovi };
}

export default function LogickaRunner({ konfiguracija, isPauziran, onScoreUpdate, onKraj }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { parametri } = konfiguracija;

  const [gameOver, setGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState<GameScore | null>(null);

  const stateRef = useRef({
    grid: Array.from({ length: REDOVI }, () => Array(KOLONE).fill(null)) as GridCelija[][],
    trenutniBlok: noviBlok(parametri.akcentHex),
    score: noviScore(parametri.nivo),
    poslednjiPad: 0,
    tasteri: new Set<string>(),
    poslednjePomeranjeL: 0,
    poslednjePomeranjeR: 0,
    gameOver: false,
  });

  const rafRef = useRef<number>(0);

  // ── Tastatura ──

  useEffect(() => {
    const state = stateRef.current;
    const onDown = (e: KeyboardEvent) => {
      state.tasteri.add(e.key);
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        // Rotacija
        const rotiran = rotacijaOblik(state.trenutniBlok.oblik);
        const bx = state.trenutniBlok.x;
        const by = state.trenutniBlok.y;
        // Proveri da li se uklapa
        let ok = true;
        for (let r = 0; r < rotiran.length; r++) {
          for (let c = 0; c < rotiran[r].length; c++) {
            if (!rotiran[r][c]) continue;
            const nr = by + r;
            const nc = bx + c;
            if (nc < 0 || nc >= KOLONE || nr >= REDOVI) { ok = false; break; }
            if (nr >= 0 && state.grid[nr][nc] !== null) { ok = false; break; }
          }
          if (!ok) break;
        }
        if (ok) state.trenutniBlok.oblik = rotiran;
      }
    };
    const onUp = (e: KeyboardEvent) => state.tasteri.delete(e.key);
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, []);

  const padInterval = Math.max(100, 800 / parametri.brzinaMultiplikator);
  const pomeranjeInterval = 120;

  const gameLoop = useCallback((timestamp: number) => {
    if (isPauziran) { rafRef.current = requestAnimationFrame(gameLoop); return; }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const state = stateRef.current;
    if (state.gameOver) return;

    const { tasteri, grid, score } = state;
    let { trenutniBlok } = state;

    // ── Pomicanje levo/desno ──
    if (
      (tasteri.has('ArrowLeft') || tasteri.has('a') || tasteri.has('A')) &&
      timestamp - state.poslednjePomeranjeL > pomeranjeInterval
    ) {
      if (mozePomak(grid, trenutniBlok.oblik, trenutniBlok.x, trenutniBlok.y, -1)) {
        trenutniBlok.x -= 1;
      }
      state.poslednjePomeranjeL = timestamp;
    }
    if (
      (tasteri.has('ArrowRight') || tasteri.has('d') || tasteri.has('D')) &&
      timestamp - state.poslednjePomeranjeR > pomeranjeInterval
    ) {
      if (mozePomak(grid, trenutniBlok.oblik, trenutniBlok.x, trenutniBlok.y, 1)) {
        trenutniBlok.x += 1;
      }
      state.poslednjePomeranjeR = timestamp;
    }

    // ── Ubrzano pada sa strelica dole/S ──
    const brzoPadanje = tasteri.has('ArrowDown') || tasteri.has('s') || tasteri.has('S');
    const efektivniInterval = brzoPadanje ? 50 : padInterval;

    // ── Pad bloka ──
    if (timestamp - state.poslednjiPad > efektivniInterval) {
      if (mozePasti(grid, trenutniBlok.oblik, trenutniBlok.x, trenutniBlok.y)) {
        trenutniBlok.y += 1;
      } else {
        // Ugradi blok u grid
        const noviGrid = ugradi(grid, trenutniBlok.oblik, trenutniBlok.x, trenutniBlok.y, trenutniBlok.boja);
        const { noviGrid: ocisceni, ocisceniRedovi } = ocistiPuneRedove(noviGrid);
        state.grid = ocisceni;

        if (ocisceniRedovi > 0) {
          const bodovi = [0, 100, 300, 600, 1000][Math.min(ocisceniRedovi, 4)];
          score.bodovi += Math.round(bodovi * parametri.brzinaMultiplikator);
          score.nivo = 1 + Math.floor(score.bodovi / 1000);
        }

        // Novi blok
        const sledeci = noviBlok(parametri.akcentHex);
        // Game over ako nova figura ne može da se postavi
        if (!mozePasti(state.grid, sledeci.oblik, sledeci.x, -1)) {
          state.gameOver = true;
          setGameOver(true);
          setFinalScore({ ...score });
          onKraj({ ...score });
          return;
        }
        state.trenutniBlok = sledeci;
        trenutniBlok = sledeci;
      }
      state.poslednjiPad = timestamp;
    }

    score.vreme = Math.floor(timestamp / 1000);
    onScoreUpdate({ ...score });

    // ── Crtanje ──
    const celVel = Math.min(Math.floor(canvas.width / KOLONE), Math.floor(canvas.height / REDOVI));
    const offX = Math.floor((canvas.width - celVel * KOLONE) / 2);
    const offY = Math.floor((canvas.height - celVel * REDOVI) / 2);

    ctx.fillStyle = '#050a15';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid pozadina
    ctx.strokeStyle = `${parametri.akcentHex}20`;
    ctx.lineWidth = 1;
    for (let r = 0; r <= REDOVI; r++) {
      ctx.beginPath();
      ctx.moveTo(offX, offY + r * celVel);
      ctx.lineTo(offX + KOLONE * celVel, offY + r * celVel);
      ctx.stroke();
    }
    for (let c = 0; c <= KOLONE; c++) {
      ctx.beginPath();
      ctx.moveTo(offX + c * celVel, offY);
      ctx.lineTo(offX + c * celVel, offY + REDOVI * celVel);
      ctx.stroke();
    }

    // Grid celije
    for (let r = 0; r < REDOVI; r++) {
      for (let c = 0; c < KOLONE; c++) {
        const boja = state.grid[r][c];
        if (!boja) continue;
        const cx = offX + c * celVel + celVel / 2;
        const cy = offY + r * celVel + celVel / 2;
        crtajElipsoid(ctx, cx, cy, celVel * 0.42, celVel * 0.42, boja);
        if (parametri.slojevi >= 3) {
          ctx.strokeStyle = `${boja}80`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.rect(offX + c * celVel + 2, offY + r * celVel + 2, celVel - 4, celVel - 4);
          ctx.stroke();
        }
      }
    }

    // Trenutni blok
    for (let r = 0; r < trenutniBlok.oblik.length; r++) {
      for (let c = 0; c < trenutniBlok.oblik[r].length; c++) {
        if (!trenutniBlok.oblik[r][c]) continue;
        const cy2 = offY + (trenutniBlok.y + r) * celVel + celVel / 2;
        const cx2 = offX + (trenutniBlok.x + c) * celVel + celVel / 2;
        crtajElipsoid(ctx, cx2, cy2, celVel * 0.42, celVel * 0.42, trenutniBlok.boja);
        if (parametri.particleSistem) {
          crtajRezonancu(ctx, cx2, cy2, celVel * 0.45, 3, 6, timestamp / 500, `${parametri.akcentHex}60`);
        }
      }
    }

    // Kontrole hint
    if (timestamp < 3000) {
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = '11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('A/D Strelice = pomak | W/↑ = rotacija | S/↓ = ubrzano', canvas.width / 2, canvas.height - 10);
    }

    rafRef.current = requestAnimationFrame(gameLoop);
  }, [isPauziran, padInterval, pomeranjeInterval, parametri, onScoreUpdate, onKraj]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const roditelj = canvas.parentElement;
    if (roditelj) {
      canvas.width = roditelj.clientWidth;
      canvas.height = roditelj.clientHeight;
    }
    stateRef.current = {
      grid: Array.from({ length: REDOVI }, () => Array(KOLONE).fill(null)) as GridCelija[][],
      trenutniBlok: noviBlok(parametri.akcentHex),
      score: noviScore(parametri.nivo),
      poslednjiPad: 0,
      tasteri: new Set(),
      poslednjePomeranjeL: 0,
      poslednjePomeranjeR: 0,
      gameOver: false,
    };
    setGameOver(false);
    setFinalScore(null);
    rafRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [konfiguracija, parametri, gameLoop]);

  if (gameOver && finalScore) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-gray-950">
        <div className="text-5xl">🧩</div>
        <h2 className="text-2xl font-bold text-white">Game Over!</h2>
        <p className="text-4xl font-bold text-yellow-400">{finalScore.bodovi.toLocaleString('sr-RS')}</p>
        <p className="text-sm text-gray-400">bodova · Nivo {finalScore.nivo}</p>
        <p className="text-xs text-gray-600">Dimenzija: {parametri.nivo} | Bonus: ×{parametri.brzinaMultiplikator.toFixed(1)}</p>
      </div>
    );
  }

  return <canvas ref={canvasRef} className="block h-full w-full touch-none" />;
}
