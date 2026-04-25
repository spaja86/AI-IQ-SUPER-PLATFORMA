'use client';

/**
 * KreativnaRunner — Kreativne i muzičke igrice
 *
 * Free-form canvas: igrač crta dimenzionalne geometrijske oblike
 * (Elipsoid, Rezonanca, Hiperbola, Spirala) mišem/prstom.
 * Dimenzija određuje dostupne alate, boje i efekte.
 * Bodovi se akumuliraju za svaki nacrtani oblik.
 */

import { useRef, useEffect, useCallback, useState } from 'react';
import type { GamingEndzinKonfiguracija, GameScore } from '@/lib/gaming-endzin';
import { noviScore, crtajElipsoid, crtajSpiralu, crtajHiperbolu, crtajRezonancu } from '@/lib/gaming-endzin';
import type { DimenzionalnParametri } from '@/lib/gaming-endzin';
import DimenzijaBadge from '../DimenzijaBadge';

interface Props {
  konfiguracija: GamingEndzinKonfiguracija;
  isPauziran: boolean;
  onScoreUpdate: (score: GameScore) => void;
  onKraj: (score: GameScore) => void;
}

type AlatTip = 'elipsoid' | 'rezonanca' | 'hiperbola' | 'spirala';

interface AlatDef {
  id: AlatTip;
  naziv: string;
  ikona: string;
  minSloj: number;
  bodovi: number;
}

const ALATI: AlatDef[] = [
  { id: 'elipsoid', naziv: 'Elipsoid', ikona: '⭕', minSloj: 1, bodovi: 10 },
  { id: 'rezonanca', naziv: 'Rezonanca', ikona: '🌊', minSloj: 2, bodovi: 20 },
  { id: 'hiperbola', naziv: 'Hiperbola', ikona: '📐', minSloj: 3, bodovi: 35 },
  { id: 'spirala', naziv: 'Spirala', ikona: '🌀', minSloj: 4, bodovi: 50 },
];

const BOJE = ['#60a5fa', '#c084fc', '#4ade80', '#facc15', '#f87171', '#fb923c', '#e879f9', '#34d399'];

function crtajAlat(
  ctx: CanvasRenderingContext2D,
  alat: AlatTip,
  x: number,
  y: number,
  velicina: number,
  boja: string,
  vreme: number,
) {
  switch (alat) {
    case 'elipsoid':
      crtajElipsoid(ctx, x, y, velicina, velicina * 0.7, boja);
      break;
    case 'rezonanca':
      crtajRezonancu(ctx, x, y, velicina, velicina * 0.3, 8, vreme / 1000, boja);
      break;
    case 'hiperbola':
      crtajHiperbolu(ctx, x, y, velicina * 0.5, boja);
      break;
    case 'spirala':
      crtajSpiralu(ctx, x, y, velicina, 3, boja);
      break;
  }
}

export default function KreativnaRunner({ konfiguracija, isPauziran, onScoreUpdate, onKraj }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { parametri } = konfiguracija;

  const [alat, setAlat] = useState<AlatTip>('elipsoid');
  const [bojaTrenutna, setBojaTrenutna] = useState(BOJE[0]);
  const [velicina, setVelicina] = useState(30);
  const [score, setScore] = useState<GameScore>(() => noviScore(parametri.nivo));
  const [crtanje, setCrtanje] = useState(false);
  const [brOblika, setBrOblika] = useState(0);

  const dostupniAlati = ALATI.filter((a) => a.minSloj <= parametri.slojevi);
  const rafRef = useRef<number>(0);
  const vremeRef = useRef(0);

  // ── Animacioni loop za pozadinu ──

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const roditelj = canvas.parentElement;
    if (roditelj) {
      canvas.width = roditelj.clientWidth;
      canvas.height = roditelj.clientHeight;
    }

    // Nacrtaj početnu pozadinu
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#050a15';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [konfiguracija]);

  // ── Score sync ──

  useEffect(() => {
    onScoreUpdate(score);
  }, [score, onScoreUpdate]);

  // ── Crtanje mišem ──

  const getCrtajPozicija = useCallback((clientX: number, clientY: number, canvas: HTMLCanvasElement): [number, number] => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return [(clientX - rect.left) * scaleX, (clientY - rect.top) * scaleY];
  }, []);

  const nacrtajNaKanvasu = useCallback((x: number, y: number) => {
    if (isPauziran) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const alatDef = ALATI.find((a) => a.id === alat);
    if (!alatDef) return;

    crtajAlat(ctx, alat, x, y, velicina, bojaTrenutna, vremeRef.current);

    // Particle efekat za više dimenzije
    if (parametri.particleSistem) {
      ctx.globalAlpha = 0.3;
      for (let i = 0; i < 3; i++) {
        const offsetX = x + (Math.random() - 0.5) * velicina;
        const offsetY = y + (Math.random() - 0.5) * velicina;
        crtajElipsoid(ctx, offsetX, offsetY, velicina * 0.15, velicina * 0.15, bojaTrenutna);
      }
      ctx.globalAlpha = 1;
    }

    setBrOblika((n) => n + 1);
    const bodovi = Math.round(alatDef.bodovi * parametri.brzinaMultiplikator);
    setScore((prev) => ({
      ...prev,
      bodovi: prev.bodovi + bodovi,
      nivo: 1 + Math.floor((prev.bodovi + bodovi) / 500),
    }));
  }, [isPauziran, alat, velicina, bojaTrenutna, parametri]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setCrtanje(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const [x, y] = getCrtajPozicija(e.clientX, e.clientY, canvas);
    nacrtajNaKanvasu(x, y);
  }, [getCrtajPozicija, nacrtajNaKanvasu]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!crtanje) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const [x, y] = getCrtajPozicija(e.clientX, e.clientY, canvas);
    nacrtajNaKanvasu(x, y);
  }, [crtanje, getCrtajPozicija, nacrtajNaKanvasu]);

  const handleMouseUp = useCallback(() => setCrtanje(false), []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    setCrtanje(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const [x, y] = getCrtajPozicija(e.touches[0].clientX, e.touches[0].clientY, canvas);
    nacrtajNaKanvasu(x, y);
  }, [getCrtajPozicija, nacrtajNaKanvasu]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (!crtanje) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const [x, y] = getCrtajPozicija(e.touches[0].clientX, e.touches[0].clientY, canvas);
    nacrtajNaKanvasu(x, y);
  }, [crtanje, getCrtajPozicija, nacrtajNaKanvasu]);

  const handleTouchEnd = useCallback(() => setCrtanje(false), []);

  const ocistiPlatno = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#050a15';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setBrOblika(0);
  }, []);

  return (
    <div className="relative flex h-full flex-col bg-gray-950">
      {/* Toolbar */}
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-gray-800 px-3 py-2">
        <DimenzijaBadge dimenzija={parametri.nivo} mali />

        {/* Alati */}
        <div className="flex gap-1">
          {dostupniAlati.map((a) => (
            <button
              key={a.id}
              onClick={() => setAlat(a.id)}
              title={`${a.naziv} (+${a.bodovi} bod/klik)`}
              className={`rounded-lg px-2 py-1 text-sm transition ${alat === a.id ? 'bg-white/20 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
            >
              {a.ikona}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-gray-700" />

        {/* Boje */}
        <div className="flex gap-1">
          {BOJE.map((b) => (
            <button
              key={b}
              onClick={() => setBojaTrenutna(b)}
              className={`h-5 w-5 rounded-full transition ${bojaTrenutna === b ? 'ring-2 ring-white ring-offset-1 ring-offset-gray-950' : ''}`}
              style={{ backgroundColor: b }}
            />
          ))}
        </div>

        <div className="h-4 w-px bg-gray-700" />

        {/* Veličina */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Vel:</span>
          <input
            type="range"
            min={10}
            max={80}
            value={velicina}
            onChange={(e) => setVelicina(Number(e.target.value))}
            className="w-20"
          />
          <span className="w-8 text-xs text-gray-400">{velicina}px</span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-gray-500">🎨 {brOblika} oblika</span>
          <span className="text-sm font-bold text-yellow-400">{score.bodovi.toLocaleString('sr-RS')}</span>
          <button
            onClick={ocistiPlatno}
            className="rounded-lg bg-gray-700 px-2 py-1 text-xs text-gray-300 transition hover:bg-gray-600"
          >
            🗑️ Očisti
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative min-h-0 flex-1">
        <canvas
          ref={canvasRef}
          className="block h-full w-full cursor-crosshair touch-none"
          style={{ cursor: crtanje ? 'crosshair' : 'default' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
        {brOblika === 0 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-gray-600">Klikni ili vuci mišem da crtaš dimenzionalne oblike 🎨</p>
          </div>
        )}
      </div>
    </div>
  );
}
