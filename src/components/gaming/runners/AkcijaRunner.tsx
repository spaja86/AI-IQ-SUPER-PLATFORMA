'use client';

/**
 * AkcijaRunner — Akcione, borbene i trkačke igrice
 *
 * Canvas-based runner za kategorije: akcija, borbena, trka, horor, sportska, retro
 *
 * Gameplay mehanika:
 *   - Igrač (elipsoid) se kreće levo/desno/gore/dole
 *   - Neprijatelji (dimenzionalni entiteti) padaju sa vrha
 *   - Igrač puca projektilima (spiralni oblici)
 *   - Dimenzija određuje brzinu, broj neprijatelja i vizuelne efekte
 */

import { useRef, useEffect, useCallback, useState } from 'react';
import type { GamingEndzinKonfiguracija, GameScore } from '@/lib/gaming-endzin';
import { noviScore, crtajElipsoid, crtajSpiralu, crtajRezonancu, dimenzijaNaParametre } from '@/lib/gaming-endzin';

interface Props {
  konfiguracija: GamingEndzinKonfiguracija;
  isPauziran: boolean;
  onScoreUpdate: (score: GameScore) => void;
  onKraj: (score: GameScore) => void;
}

interface Entitet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hp: number;
  tip: 'neprijatelj' | 'projektil' | 'particle';
  vreme: number;
}

const IGRAC_R = 22;
const PROJEKTIL_R = 6;
const NEPRIJATELJ_R_MIN = 14;
const NEPRIJATELJ_R_MAX = 26;

export default function AkcijaRunner({ konfiguracija, isPauziran, onScoreUpdate, onKraj }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    igrac: { x: 0, y: 0 },
    entiteti: [] as Entitet[],
    score: noviScore(konfiguracija.parametri.nivo),
    tasteri: new Set<string>(),
    poslednjiSpawn: 0,
    poslednjiPucanj: 0,
    vremeAkumulirano: 0,
    poslednjiTick: 0,
    gameOver: false,
  });
  const rafRef = useRef<number>(0);
  const [gameOver, setGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState<GameScore | null>(null);

  const { parametri } = konfiguracija;
  const brzinaFaktor = parametri.brzinaMultiplikator;
  const maxNeprijatelja = Math.min(parametri.maxEntiteta, 40);

  // ── Tastatura ──

  useEffect(() => {
    const state = stateRef.current;
    const onDown = (e: KeyboardEvent) => state.tasteri.add(e.key);
    const onUp = (e: KeyboardEvent) => state.tasteri.delete(e.key);
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, []);

  // ── Inicijalizacija igrača na centru canvas-a ──

  const initIgrac = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    stateRef.current.igrac = { x: canvas.width / 2, y: canvas.height - 60 };
  }, []);

  // ── Spawn neprijatelja ──

  const spawnNeprijatelj = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const state = stateRef.current;
    const neprijatelja = state.entiteti.filter((e) => e.tip === 'neprijatelj').length;
    if (neprijatelja >= maxNeprijatelja) return;
    const r = NEPRIJATELJ_R_MIN + Math.random() * (NEPRIJATELJ_R_MAX - NEPRIJATELJ_R_MIN);
    state.entiteti.push({
      x: r + Math.random() * (canvas.width - 2 * r),
      y: -r,
      vx: (Math.random() - 0.5) * 2 * brzinaFaktor,
      vy: (0.8 + Math.random() * 1.2) * brzinaFaktor,
      r,
      hp: 1,
      tip: 'neprijatelj',
      vreme: 0,
    });
  }, [brzinaFaktor, maxNeprijatelja]);

  // ── Pucanje ──

  const pucaj = useCallback(() => {
    const state = stateRef.current;
    state.entiteti.push({
      x: state.igrac.x,
      y: state.igrac.y - IGRAC_R,
      vx: 0,
      vy: -12 * brzinaFaktor,
      r: PROJEKTIL_R,
      hp: 1,
      tip: 'projektil',
      vreme: 0,
    });
  }, [brzinaFaktor]);

  // ── Particle efekat ──

  const dodajParticle = useCallback((x: number, y: number) => {
    if (!parametri.particleSistem) return;
    const state = stateRef.current;
    for (let i = 0; i < 6; i++) {
      const ugao = (i / 6) * Math.PI * 2;
      state.entiteti.push({
        x,
        y,
        vx: Math.cos(ugao) * (2 + Math.random() * 3),
        vy: Math.sin(ugao) * (2 + Math.random() * 3),
        r: 4,
        hp: 1,
        tip: 'particle',
        vreme: 0,
      });
    }
  }, [parametri.particleSistem]);

  // ── Game loop ──

  const gameLoop = useCallback((timestamp: number) => {
    if (isPauziran) {
      rafRef.current = requestAnimationFrame(gameLoop);
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const state = stateRef.current;
    if (state.gameOver) return;

    const dt = state.poslednjiTick ? Math.min((timestamp - state.poslednjiTick) / 16.67, 3) : 1;
    state.poslednjiTick = timestamp;
    state.vremeAkumulirano += dt / 60;

    // ── Update igrača ──
    const brzina = 5 * brzinaFaktor;
    const { tasteri, igrac } = state;
    if ((tasteri.has('ArrowLeft') || tasteri.has('a') || tasteri.has('A')) && igrac.x - IGRAC_R > 0) {
      igrac.x -= brzina * dt;
    }
    if ((tasteri.has('ArrowRight') || tasteri.has('d') || tasteri.has('D')) && igrac.x + IGRAC_R < canvas.width) {
      igrac.x += brzina * dt;
    }
    if ((tasteri.has('ArrowUp') || tasteri.has('w') || tasteri.has('W')) && igrac.y - IGRAC_R > 0) {
      igrac.y -= brzina * dt;
    }
    if ((tasteri.has('ArrowDown') || tasteri.has('s') || tasteri.has('S')) && igrac.y + IGRAC_R < canvas.height) {
      igrac.y += brzina * dt;
    }

    // ── Pucanje (Space ili Enter) ──
    const PUCANJ_INTERVAL = Math.max(150, 400 / brzinaFaktor);
    if (
      (tasteri.has(' ') || tasteri.has('Enter')) &&
      timestamp - state.poslednjiPucanj > PUCANJ_INTERVAL
    ) {
      pucaj();
      state.poslednjiPucanj = timestamp;
    }

    // ── Spawn neprijatelja ──
    const spawnInterval = Math.max(400, 1800 / brzinaFaktor);
    if (timestamp - state.poslednjiSpawn > spawnInterval) {
      spawnNeprijatelj();
      state.poslednjiSpawn = timestamp;
    }

    // ── Update entiteta ──
    const prezivelentiteti: Entitet[] = [];
    for (const e of state.entiteti) {
      e.x += e.vx * dt;
      e.y += e.vy * dt;
      e.vreme += dt;

      if (e.tip === 'particle') {
        // Gasimo particle posle ~40 frejmova
        if (e.vreme < 40) prezivelentiteti.push(e);
        continue;
      }

      if (e.tip === 'projektil') {
        if (e.y + e.r < 0) continue;
        prezivelentiteti.push(e);
        continue;
      }

      // Neprijatelji
      if (e.y - e.r > canvas.height) {
        // Neprijatelj je prošao — game over
        state.gameOver = true;
        setGameOver(true);
        setFinalScore({ ...state.score });
        onKraj({ ...state.score });
        return;
      }

      // Kolizija igrac — neprijatelj
      const dxI = igrac.x - e.x;
      const dyI = igrac.y - e.y;
      if (Math.sqrt(dxI * dxI + dyI * dyI) < IGRAC_R + e.r - 4) {
        state.gameOver = true;
        setGameOver(true);
        setFinalScore({ ...state.score });
        onKraj({ ...state.score });
        return;
      }

      prezivelentiteti.push(e);
    }

    // ── Projektil vs neprijatelj kolizija ──
    const projektiletPreostali: Entitet[] = [];
    const neprPreostali: Entitet[] = [];

    for (const e of prezivelentiteti) {
      if (e.tip !== 'neprijatelj') {
        projektiletPreostali.push(e);
        neprPreostali.push(e);
      }
    }

    const projektiletFinal: Entitet[] = [];
    const neprFinal: Entitet[] = [];

    for (const proj of prezivelentiteti.filter((e) => e.tip === 'projektil')) {
      let pogodio = false;
      for (const nepr of prezivelentiteti.filter((e) => e.tip === 'neprijatelj')) {
        const dx = proj.x - nepr.x;
        const dy = proj.y - nepr.y;
        if (Math.sqrt(dx * dx + dy * dy) < proj.r + nepr.r) {
          pogodio = true;
          dodajParticle(nepr.x, nepr.y);
          state.score.bodovi += Math.round(10 * parametri.brzinaMultiplikator);
          nepr.hp = 0;
          break;
        }
      }
      if (!pogodio) projektiletFinal.push(proj);
    }

    state.entiteti = [
      ...prezivelentiteti.filter((e) => e.tip === 'particle'),
      ...projektiletFinal,
      ...prezivelentiteti.filter((e) => e.tip === 'neprijatelj' && e.hp > 0),
    ];

    // Ažuriraj vreme i nivo
    state.score.vreme = Math.floor(state.vremeAkumulirano);
    state.score.nivo = 1 + Math.floor(state.vremeAkumulirano / 30);
    onScoreUpdate({ ...state.score });

    // ── Crtanje ──
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Pozadina sa dimenzionalnim uzorkom
    ctx.fillStyle = '#050a15';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dimenzionalna grid mreža
    ctx.strokeStyle = `${parametri.akcentHex}18`;
    ctx.lineWidth = 1;
    const gridKorak = 40;
    for (let x = 0; x < canvas.width; x += gridKorak) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridKorak) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Geometrijski pozadinski ukras za višlje dimenzije
    if (parametri.tredni) {
      crtajRezonancu(ctx, canvas.width / 2, canvas.height / 2, 80, 8, 6, timestamp / 1000, `${parametri.akcentHex}22`);
      if (parametri.slojevi >= 4) {
        crtajRezonancu(ctx, canvas.width / 2, canvas.height / 2, 140, 12, 8, timestamp / 1200 + 1, `${parametri.akcentHex}18`);
      }
    }

    // Particles
    for (const e of state.entiteti.filter((e) => e.tip === 'particle')) {
      const alfa = 1 - e.vreme / 40;
      ctx.globalAlpha = alfa;
      crtajElipsoid(ctx, e.x, e.y, e.r, e.r, parametri.akcentHex);
      ctx.globalAlpha = 1;
    }

    // Neprijatelji
    for (const e of state.entiteti.filter((e) => e.tip === 'neprijatelj')) {
      crtajRezonancu(ctx, e.x, e.y, e.r, 3, 4, timestamp / 800, '#ef4444');
      crtajElipsoid(ctx, e.x, e.y, e.r * 0.7, e.r * 0.5, '#991b1b');
    }

    // Projektili — spiralni oblici
    for (const e of state.entiteti.filter((e) => e.tip === 'projektil')) {
      crtajElipsoid(ctx, e.x, e.y, e.r, e.r * 1.5, parametri.akcentHex);
      if (parametri.particleSistem) {
        crtajSpiralu(ctx, e.x, e.y, e.r * 2, 1.5, `${parametri.akcentHex}80`);
      }
    }

    // Igrač — elipsoid sa dimenzionalnom bojom
    const igracBoja = parametri.akcentHex;
    crtajElipsoid(ctx, igrac.x, igrac.y, IGRAC_R, IGRAC_R * 0.75, igracBoja);
    crtajRezonancu(ctx, igrac.x, igrac.y, IGRAC_R + 4, 3, 6, timestamp / 600, `${igracBoja}80`);

    // Kontrole hint (samo prvih 3 sekunde)
    if (state.vremeAkumulirano < 3) {
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('WASD / Strelice = kretanje  |  Space / Enter = pucaj', canvas.width / 2, canvas.height - 16);
    }

    rafRef.current = requestAnimationFrame(gameLoop);
  }, [
    isPauziran,
    brzinaFaktor,
    parametri,
    pucaj,
    spawnNeprijatelj,
    dodajParticle,
    onScoreUpdate,
    onKraj,
  ]);

  // ── Mount / restart ──

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const roditelj = canvas.parentElement;
    if (roditelj) {
      canvas.width = roditelj.clientWidth;
      canvas.height = roditelj.clientHeight;
    }
    stateRef.current = {
      igrac: { x: 0, y: 0 },
      entiteti: [],
      score: noviScore(konfiguracija.parametri.nivo),
      tasteri: new Set(),
      poslednjiSpawn: 0,
      poslednjiPucanj: 0,
      vremeAkumulirano: 0,
      poslednjiTick: 0,
      gameOver: false,
    };
    setGameOver(false);
    setFinalScore(null);
    initIgrac();
    rafRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [konfiguracija, initIgrac, gameLoop]);

  // ── Touch kontrole ──

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    stateRef.current.igrac.x = Math.max(IGRAC_R, Math.min(canvas.width - IGRAC_R, touch.clientX - rect.left));
    stateRef.current.igrac.y = Math.max(IGRAC_R, Math.min(canvas.height - IGRAC_R, touch.clientY - rect.top));
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    handleTouchMove(e);
    pucaj();
  }, [handleTouchMove, pucaj]);

  if (gameOver && finalScore) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-gray-950">
        <div className="text-5xl">💥</div>
        <h2 className="text-2xl font-bold text-white">Game Over!</h2>
        <p className="text-4xl font-bold text-yellow-400">{finalScore.bodovi.toLocaleString('sr-RS')}</p>
        <p className="text-sm text-gray-400">bodova · Nivo {finalScore.nivo}</p>
        <p className="text-xs text-gray-600">Dimenzija: {konfiguracija.parametri.nivo} | Bonus: ×{parametri.brzinaMultiplikator.toFixed(1)}</p>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="block h-full w-full cursor-crosshair touch-none"
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchStart}
    />
  );
}
