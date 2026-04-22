'use client';

import { useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { getKompjuterStatistika, KOMPJUTER_GPU_JEZGRA, KOMPJUTER_RAM_GB, KOMPJUTER_VRAM_GB } from '@/lib/spaja-digitalni-kompjuter';

const DIMENZIJE = ['360D', '720D', '1440D', '2880D', '5760D'] as const;
type Dimenzija = (typeof DIMENZIJE)[number];

const DIMENZIJA_OPIS: Record<Dimenzija, string> = {
  '360D': 'Bazični režim — 2 geometrijska sloja',
  '720D': 'Dvostruki režim — 3 geometrijska sloja',
  '1440D': 'Kvadra režim (3D) — 4 geometrijska sloja',
  '2880D': 'Okto režim (3D) — 4 sloja, 5 zakona',
  '5760D': 'Maksimalni režim (3D) — 4 sloja, 6 zakona, puna reprodukcija',
};

const DIMENZIJA_BOJA: Record<Dimenzija, string> = {
  '360D': 'border-blue-500/60 bg-blue-900/20 hover:border-blue-400',
  '720D': 'border-purple-500/60 bg-purple-900/20 hover:border-purple-400',
  '1440D': 'border-yellow-500/60 bg-yellow-900/20 hover:border-yellow-400',
  '2880D': 'border-orange-500/60 bg-orange-900/20 hover:border-orange-400',
  '5760D': 'border-red-500/60 bg-red-900/20 hover:border-red-400',
};

/**
 * Dozvoljena lista hostova koji mogu biti učitani u iframe.
 * allow-same-origin je neophodan da bi igre mogle koristiti localStorage,
 * kolačiće i API pozive ka sopstvenom bekend servisu.
 * Pošto smo sami vlasnici io-openui-ao.vercel.app, bezbednosni rizik je prihvatljiv
 * i ograničen na listu ispod.
 */
const DOZVOLJENI_HOSTOVI = new Set([
  'io-openui-ao.vercel.app',
]);

function isUrlDozvoljen(raw: string): boolean {
  try {
    const { protocol, hostname } = new URL(raw);
    return protocol === 'https:' && DOZVOLJENI_HOSTOVI.has(hostname);
  } catch {
    return false;
  }
}

interface Props {
  url: string;
  igra: string;
}

export default function BrouvzerViewer({ url, igra }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [izabranaDimenzija, setIzabranaDimenzija] = useState<Dimenzija | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const urlDozvoljen = isUrlDozvoljen(url);

  const handleLoad = useCallback(() => setLoading(false), []);

  const handleReload = useCallback(() => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  }, []);

  const handleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {
        iframeRef.current?.requestFullscreen?.().catch(() => undefined);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => undefined);
      setIsFullscreen(false);
    }
  }, []);

  const handleIzaberiDimenziju = useCallback((d: Dimenzija) => {
    setIzabranaDimenzija(d);
    setLoading(true);
    setReloadKey((k) => k + 1);
  }, []);

  // ─── URL nije na dozvoljenoj listi ──────────────────────────
  if (!urlDozvoljen) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-4 py-12 text-center">
        <div className="mb-4 text-5xl">⚠️</div>
        <h1 className="mb-2 text-xl font-bold text-white">Nedozvoljen URL</h1>
        <p className="mb-6 text-sm text-gray-400">
          Ovaj URL nije na listi dozvoljenih izvora za Digitalni Brouvzer.
        </p>
        <div className="flex gap-3">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
          >
            Otvori u novom tabu ↗
          </a>
          <Link
            href="/industrija"
            className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-600"
          >
            ← Nazad
          </Link>
        </div>
      </div>
    );
  }

  // ─── Dimenzija picker ────────────────────────────────────────
  if (!izabranaDimenzija) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="mb-8 text-center">
            <div className="mb-3 text-5xl">🎮</div>
            <h1 className="mb-2 text-2xl font-bold text-white">
              {igra || 'Igrica'}
            </h1>
            <p className="text-sm text-gray-400">
              🌐 SPAJA Digitalni Brouvzer — Dimenzionalni Gaming Sistem
            </p>
          </div>

          <div className="mb-6 rounded-xl border border-yellow-500/30 bg-yellow-900/10 p-4 text-center">
            <p className="text-sm font-semibold text-yellow-400">
              🌀 Izaberi dimenziju (D) u kojoj želiš igrati:
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {DIMENZIJE.map((d) => (
              <button
                key={d}
                onClick={() => handleIzaberiDimenziju(d)}
                className={`rounded-xl border p-4 text-left transition ${DIMENZIJA_BOJA[d]}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-white">{d}</span>
                  {(d === '1440D' || d === '2880D' || d === '5760D') && (
                    <span className="rounded-full bg-purple-600/40 px-2 py-0.5 text-xs text-purple-300">
                      🥽 3D
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-400">{DIMENZIJA_OPIS[d]}</p>
              </button>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/industrija"
              className="text-sm text-gray-500 transition hover:text-gray-300"
            >
              ← Nazad na Digitalnu Industriju
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── Browser viewer ──────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className="flex h-screen flex-col bg-gray-950"
    >
      {/* ── Header ── */}
      <div className="flex shrink-0 items-center gap-2 border-b border-gray-800 bg-gray-900 px-3 py-2">
        <Link
          href="/industrija"
          className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-800 hover:text-white"
          title="Nazad na Industriju"
          aria-label="Nazad na Industriju"
        >
          ←
        </Link>

        <button
          onClick={handleReload}
          className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-800 hover:text-white"
          title="Ponovo učitaj"
          aria-label="Reload"
        >
          ↺
        </button>

        {/* Address bar */}
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5">
          <span className="shrink-0 text-xs text-green-400">🔒</span>
          <span className="truncate text-xs text-gray-300">{url}</span>
        </div>

        <button
          onClick={handleFullscreen}
          className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-800 hover:text-white"
          title={isFullscreen ? 'Izlaz iz fullscreen' : 'Fullscreen'}
          aria-label={isFullscreen ? 'Izlaz iz fullscreen' : 'Fullscreen'}
          aria-pressed={isFullscreen}
        >
          {isFullscreen ? '✕' : '⛶'}
        </button>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-800 hover:text-white"
          title="Otvori u novom tabu"
          aria-label="Otvori u novom tabu"
        >
          ↗
        </a>
      </div>

      {/* ── Game context bar ── */}
      <div className="flex shrink-0 items-center gap-3 border-b border-gray-800/60 bg-gray-900/60 px-4 py-1.5">
        <span className="text-sm font-semibold text-white">🎮 {igra || 'Igrica'}</span>
        <span className="rounded-full bg-blue-600/30 px-2 py-0.5 text-xs font-bold text-blue-300">
          {izabranaDimenzija}
        </span>
        <span className="rounded-full bg-green-600/20 px-2 py-0.5 text-xs text-green-400">
          ▶ Igra u Brouvzeru
        </span>
        <button
          onClick={() => setIzabranaDimenzija(null)}
          className="ml-auto text-xs text-gray-500 transition hover:text-gray-300"
        >
          Promeni dimenziju
        </button>
      </div>

      {/* ── Hardware Status Bar ── */}
      <div className="flex shrink-0 items-center gap-3 border-b border-gray-800/40 bg-gray-950/80 px-4 py-1 text-xs">
        <span className="font-semibold text-gray-500">🖥️ HW:</span>
        <span className="text-gray-400" title={`SPAJA RAM ${KOMPJUTER_RAM_GB.toLocaleString('sr-RS')} GB`}>
          🧮 <span className="text-cyan-400 font-bold">{KOMPJUTER_RAM_GB.toLocaleString('sr-RS')} GB</span> RAM
        </span>
        <span className="text-gray-600">|</span>
        <span className="text-gray-400" title={`SPAJA GPU ${KOMPJUTER_GPU_JEZGRA.toLocaleString('sr-RS')} jezgara`}>
          🎮 <span className="text-purple-400 font-bold">{(KOMPJUTER_GPU_JEZGRA / 1_000_000).toFixed(1)}M</span> GPU jezgara
        </span>
        <span className="text-gray-600">|</span>
        <span className="text-gray-400" title={`2× SPAJA Grafička ${KOMPJUTER_VRAM_GB.toLocaleString('sr-RS')} GB VRAM`}>
          🎨 <span className="text-pink-400 font-bold">2×{KOMPJUTER_VRAM_GB.toLocaleString('sr-RS')}</span> VRAM
        </span>
        <span className="text-gray-600">|</span>
        <span className="text-gray-400" title="CPU×2 + CIP×2">
          ⚙️ <span className="text-yellow-400 font-bold">CPU×2 CIP×2</span>
        </span>
        <span className="text-gray-600">|</span>
        <span className="text-gray-400" title={`Kompjuter: ${getKompjuterStatistika().ukupnoKomponenti} komponenti aktivan`}>
          ✅ <span className="text-green-400 font-bold">{getKompjuterStatistika().aktivnihKomponenti}</span>/{getKompjuterStatistika().ukupnoKomponenti} aktivan
        </span>
      </div>

      {/* ── iframe area ── */}
      <div className="relative min-h-0 flex-1">
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-gray-950">
            <div className="text-4xl">🎮</div>
            <div
              className="h-8 w-8 animate-spin rounded-full border-2 border-gray-700 border-t-blue-500"
              role="status"
              aria-label="Učitavanje igrice"
            />
            <p className="text-sm text-gray-400">Učitavanje igrice u Digitalnom Brouvzeru…</p>
            <p className="text-xs text-gray-600">{url}</p>
          </div>
        )}

        {/*
         * allow-same-origin je neophodan kako bi igra mogla da koristi localStorage,
         * kolačiće i API pozive ka io-openui-ao.vercel.app — svom pouzdanom bekend servisu.
         * URL je validan samo za domene na DOZVOLJENI_HOSTOVI listi.
         */}
        <iframe
          ref={iframeRef}
          key={reloadKey}
          src={url}
          className="h-full w-full border-0"
          onLoad={handleLoad}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock allow-orientation-lock"
          title={igra || 'Igrica'}
          allow="fullscreen; autoplay; gamepad"
        />
      </div>

      {/* ── Footer ── */}
      <div className="flex shrink-0 items-center justify-between border-t border-gray-800 bg-gray-900 px-4 py-1.5">
        <span className="text-xs text-gray-500">
          🌐 SPAJA Digitalni Brouvzer v2.0.0 — EKSTREMNI
        </span>
        <div className="flex items-center gap-3">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 transition hover:text-blue-400"
          >
            Igrica ne radi? Otvori u novom tabu →
          </a>
          <Link
            href="/spaja-digitalni-brouvzer"
            className="text-xs text-gray-600 transition hover:text-gray-400"
          >
            O Brouvzeru
          </Link>
        </div>
      </div>
    </div>
  );
}
