'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { getKompjuterStatistika, KOMPJUTER_GPU_JEZGRA, KOMPJUTER_RAM_GB, KOMPJUTER_VRAM_GB } from '@/lib/spaja-digitalni-kompjuter';

// ─── Dimenzije ───────────────────────────────────────────────────────

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

// ─── URL validacija ───────────────────────────────────────────────────

/**
 * SPAJA-vlastiti hostovi učitavaju se bez upozorenja (allow-same-origin sandbox).
 * Svi ostali https:// hostovi učitavaju se sa žutim upozorenjem.
 * Nezaštićeni (http://) i nevalidni URL-ovi se blokiraju.
 */
const DOZVOLJENI_HOSTOVI_SPAJA = new Set([
  'io-openui-ao.vercel.app',
  'ai-iq-super-platforma.vercel.app',
  'kompanija-spaja.com',
  'openai-platform.vercel.app',
  'ai-iq-world-bank-git-copilot-n-697903-nikolas-projects-b8a8458f.vercel.app',
  'ai-iq-menja-nica-6cnf-git-copi-0e2b0a-nikolas-projects-b8a8458f.vercel.app',
  'svetska-organizacija-git-copil-0ce22a-nikolas-projects-b8a8458f.vercel.app',
]);

type UrlStatus = 'spaja' | 'eksternihttps' | 'nedozvoljen';

function getUrlStatus(raw: string): UrlStatus {
  if (!raw) return 'nedozvoljen';
  try {
    const { protocol, hostname } = new URL(raw);
    if (protocol !== 'https:') return 'nedozvoljen';
    if (DOZVOLJENI_HOSTOVI_SPAJA.has(hostname)) return 'spaja';
    return 'eksternihttps';
  } catch {
    return 'nedozvoljen';
  }
}

// ─── Multi-tab tipovi ─────────────────────────────────────────────────

interface Tab {
  id: string;
  url: string;
  igra: string;
  dimenzija: Dimenzija | null;
  reloadKey: number;
  loading: boolean;
}

// ─── Bookmark + History tipovi i localStorage ─────────────────────────

interface Bookmark {
  url: string;
  naziv: string;
  vreme: string;
}

interface HistoryEntry {
  url: string;
  naziv: string;
  vreme: string;
}

const BOOKMARKS_KEY = 'spaja-brouvzer-bookmarks';
const HISTORY_KEY = 'spaja-brouvzer-history';
const MAX_HISTORY = 50;

let tabCounter = 0;
function newTabId(): string {
  tabCounter += 1;
  return `tab-${tabCounter}`;
}

// ─── Props ────────────────────────────────────────────────────────────

interface Props {
  url: string;
  igra: string;
}

// ─── Komponenta ───────────────────────────────────────────────────────

export default function BrouvzerViewer({ url, igra }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRefs = useRef<Record<string, HTMLIFrameElement | null>>({});

  // ── Tabs state ──
  const [tabs, setTabs] = useState<Tab[]>(() => {
    const id = newTabId();
    return [{ id, url, igra, dimenzija: null, reloadKey: 0, loading: true }];
  });
  const [activeTabId, setActiveTabId] = useState<string>(() => tabs[0].id);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // ── Bookmark + History state ──
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Učitaj sa localStorage pri mountu
  useEffect(() => {
    try {
      const saved = localStorage.getItem(BOOKMARKS_KEY);
      if (saved) setBookmarks(JSON.parse(saved) as Bookmark[]);
    } catch { /* ignoriši */ }
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) setHistory(JSON.parse(saved) as HistoryEntry[]);
    } catch { /* ignoriši */ }
  }, []);

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];

  // ── Tab operacije ──

  const addTab = useCallback(() => {
    const id = newTabId();
    const noviTab: Tab = { id, url: '', igra: 'Novi Tab', dimenzija: null, reloadKey: 0, loading: false };
    setTabs((prev) => [...prev, noviTab]);
    setActiveTabId(id);
  }, []);

  const closeTab = useCallback((idToClose: string) => {
    setTabs((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((t) => t.id !== idToClose);
    });
    setActiveTabId((prev) => {
      if (prev !== idToClose) return prev;
      const idx = tabs.findIndex((t) => t.id === idToClose);
      const remaining = tabs.filter((t) => t.id !== idToClose);
      return remaining[Math.min(idx, remaining.length - 1)].id;
    });
  }, [tabs]);

  const updateTab = useCallback((id: string, patch: Partial<Tab>) => {
    setTabs((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }, []);

  const handleReload = useCallback(() => {
    updateTab(activeTab.id, { loading: true, reloadKey: activeTab.reloadKey + 1 });
  }, [activeTab, updateTab]);

  const handleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {
        iframeRefs.current[activeTab.id]?.requestFullscreen?.().catch(() => undefined);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => undefined);
      setIsFullscreen(false);
    }
  }, [activeTab.id]);

  const handleIzaberiDimenziju = useCallback((tabId: string, d: Dimenzija) => {
    updateTab(tabId, { dimenzija: d, loading: true, reloadKey: (tabs.find((t) => t.id === tabId)?.reloadKey ?? 0) + 1 });
  }, [tabs, updateTab]);

  // ── Bookmark operacije ──

  const saveBookmarks = useCallback((updated: Bookmark[]) => {
    setBookmarks(updated);
    try { localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated)); } catch { /* ignoriši */ }
  }, []);

  const isBookmarked = useCallback(
    (tabUrl: string) => bookmarks.some((b) => b.url === tabUrl),
    [bookmarks],
  );

  const toggleBookmark = useCallback((tabUrl: string, naziv: string) => {
    if (!tabUrl) return;
    const exists = bookmarks.some((b) => b.url === tabUrl);
    saveBookmarks(
      exists
        ? bookmarks.filter((b) => b.url !== tabUrl)
        : [{ url: tabUrl, naziv, vreme: new Date().toISOString() }, ...bookmarks],
    );
  }, [bookmarks, saveBookmarks]);

  // ── History operacije ──

  const saveHistory = useCallback((updated: HistoryEntry[]) => {
    setHistory(updated);
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(updated)); } catch { /* ignoriši */ }
  }, []);

  const addToHistory = useCallback((tabUrl: string, naziv: string) => {
    if (!tabUrl) return;
    const entry: HistoryEntry = { url: tabUrl, naziv, vreme: new Date().toISOString() };
    saveHistory([entry, ...history.filter((h) => h.url !== tabUrl)].slice(0, MAX_HISTORY));
  }, [history, saveHistory]);

  const clearHistory = useCallback(() => {
    saveHistory([]);
  }, [saveHistory]);

  // ── iframe onLoad handler ──

  const handleIframeLoad = useCallback((tabId: string, tabUrl: string, tabIgra: string) => {
    updateTab(tabId, { loading: false });
    addToHistory(tabUrl, tabIgra || tabUrl);
  }, [updateTab, addToHistory]);

  // ─── Prazan tab (novi tab home ekran) ─────────────────────────────
  if (!activeTab.url) {
    return (
      <div className="flex h-screen flex-col bg-gray-950">
        {/* Tab bar */}
        <TabBar
          tabs={tabs}
          activeTabId={activeTabId}
          onSelect={setActiveTabId}
          onClose={closeTab}
          onAdd={addTab}
        />
        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
          <div className="text-5xl">🌐</div>
          <h2 className="text-xl font-bold text-white">SPAJA Digitalni Brouvzer</h2>
          <p className="text-sm text-gray-400">Novi tab — izaberi igru ili platformu</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/spaja-digitalni-brouvzer"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
            >
              🎮 Lista Igrica
            </Link>
            <Link
              href="/industrija"
              className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-600"
            >
              🏭 Industrija
            </Link>
            <Link
              href="/platforme"
              className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-600"
            >
              🌐 Platforme
            </Link>
          </div>
          {bookmarks.length > 0 && (
            <div className="w-full max-w-sm">
              <p className="mb-2 text-xs font-semibold text-gray-500">⭐ Bookmarkovi</p>
              <div className="flex flex-col gap-1">
                {bookmarks.slice(0, 5).map((b) => (
                  <a
                    key={b.url}
                    href={`/spaja-digitalni-brouvzer?url=${encodeURIComponent(b.url)}&igra=${encodeURIComponent(b.naziv)}`}
                    className="truncate rounded-lg bg-gray-800 px-3 py-2 text-left text-sm text-blue-400 transition hover:bg-gray-700"
                  >
                    ⭐ {b.naziv}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const urlStatus = getUrlStatus(activeTab.url);

  // ─── Nedozvoljen URL ─────────────────────────────────────────────────
  if (urlStatus === 'nedozvoljen') {
    return (
      <div className="flex h-screen flex-col bg-gray-950">
        <TabBar
          tabs={tabs}
          activeTabId={activeTabId}
          onSelect={setActiveTabId}
          onClose={closeTab}
          onAdd={addTab}
        />
        <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
          <div className="mb-4 text-5xl">⚠️</div>
          <h1 className="mb-2 text-xl font-bold text-white">Nedozvoljen URL</h1>
          <p className="mb-6 text-sm text-gray-400">
            Ovaj URL mora koristiti <code className="text-yellow-400">https://</code> protokol.
          </p>
          <div className="flex gap-3">
            <a
              href={activeTab.url}
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
      </div>
    );
  }

  // ─── Dimenzija picker (po tabu) ──────────────────────────────────────
  if (!activeTab.dimenzija) {
    return (
      <div className="flex h-screen flex-col bg-gray-950">
        <TabBar
          tabs={tabs}
          activeTabId={activeTabId}
          onSelect={setActiveTabId}
          onClose={closeTab}
          onAdd={addTab}
        />
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
          <div className="w-full max-w-lg">
            <div className="mb-8 text-center">
              <div className="mb-3 text-5xl">🎮</div>
              <h1 className="mb-2 text-2xl font-bold text-white">
                {activeTab.igra || 'Igrica'}
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
                  onClick={() => handleIzaberiDimenziju(activeTab.id, d)}
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
      </div>
    );
  }

  // ─── Glavni browser viewer ────────────────────────────────────────────
  return (
    <div ref={containerRef} className="flex h-screen flex-col bg-gray-950">
      {/* ── Tab Bar ── */}
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onSelect={setActiveTabId}
        onClose={closeTab}
        onAdd={addTab}
      />

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
          <span className="truncate text-xs text-gray-300">{activeTab.url}</span>
        </div>

        {/* Bookmark dugme */}
        <div className="relative">
          <button
            onClick={() => toggleBookmark(activeTab.url, activeTab.igra || activeTab.url)}
            className={`rounded-lg p-1.5 transition hover:bg-gray-800 ${isBookmarked(activeTab.url) ? 'text-yellow-400' : 'text-gray-400 hover:text-white'}`}
            title={isBookmarked(activeTab.url) ? 'Ukloni bookmark' : 'Dodaj bookmark'}
            aria-label="Bookmark"
          >
            ⭐
          </button>
        </div>

        {/* Bookmarks panel dugme */}
        <div className="relative">
          <button
            onClick={() => { setShowBookmarks((v) => !v); setShowHistory(false); }}
            className={`rounded-lg p-1.5 transition hover:bg-gray-800 ${showBookmarks ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
            title="Bookmarkovi"
            aria-label="Bookmarkovi"
          >
            📚
          </button>
          {showBookmarks && (
            <BookmarkPanel
              bookmarks={bookmarks}
              onRemove={(bUrl) => saveBookmarks(bookmarks.filter((b) => b.url !== bUrl))}
              onClose={() => setShowBookmarks(false)}
            />
          )}
        </div>

        {/* History panel dugme */}
        <div className="relative">
          <button
            onClick={() => { setShowHistory((v) => !v); setShowBookmarks(false); }}
            className={`rounded-lg p-1.5 transition hover:bg-gray-800 ${showHistory ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
            title="Istorija"
            aria-label="Istorija"
          >
            🕐
          </button>
          {showHistory && (
            <HistoryPanel
              history={history}
              onClear={clearHistory}
              onClose={() => setShowHistory(false)}
            />
          )}
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
          href={activeTab.url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-800 hover:text-white"
          title="Otvori u novom tabu"
          aria-label="Otvori u novom tabu"
        >
          ↗
        </a>
      </div>

      {/* ── Eksterni URL upozorenje ── */}
      {urlStatus === 'eksternihttps' && (
        <div className="flex shrink-0 items-center gap-2 border-b border-yellow-700/40 bg-yellow-900/20 px-4 py-1.5 text-xs text-yellow-400">
          <span>⚠️</span>
          <span>Eksterni sajt — nije SPAJA-vlastiti domen. Sadržaj se učitava sa ograničenom bezbednošću.</span>
          <a
            href={activeTab.url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto underline hover:text-yellow-300"
          >
            Otvori direktno ↗
          </a>
        </div>
      )}

      {/* ── Game context bar ── */}
      <div className="flex shrink-0 items-center gap-3 border-b border-gray-800/60 bg-gray-900/60 px-4 py-1.5">
        <span className="text-sm font-semibold text-white">🎮 {activeTab.igra || 'Igrica'}</span>
        <span className="rounded-full bg-blue-600/30 px-2 py-0.5 text-xs font-bold text-blue-300">
          {activeTab.dimenzija}
        </span>
        <span className="rounded-full bg-green-600/20 px-2 py-0.5 text-xs text-green-400">
          ▶ Igra u Brouvzeru
        </span>
        <button
          onClick={() => updateTab(activeTab.id, { dimenzija: null })}
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

      {/* ── iframe area — svi tabovi su montirani, samo aktivni je vidljiv ── */}
      <div className="relative min-h-0 flex-1">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          if (!tab.url || !tab.dimenzija) return null;
          return (
            <div
              key={tab.id}
              className="absolute inset-0"
              style={{ visibility: isActive ? 'visible' : 'hidden', pointerEvents: isActive ? 'auto' : 'none' }}
            >
              {isActive && tab.loading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-gray-950">
                  <div className="text-4xl">🎮</div>
                  <div
                    className="h-8 w-8 animate-spin rounded-full border-2 border-gray-700 border-t-blue-500"
                    role="status"
                    aria-label="Učitavanje igrice"
                  />
                  <p className="text-sm text-gray-400">Učitavanje igrice u Digitalnom Brouvzeru…</p>
                  <p className="text-xs text-gray-600">{tab.url}</p>
                </div>
              )}
              {/*
               * allow-same-origin: SPAJA-vlastiti domeni koriste localStorage i sopstveni API.
               * Eksterni https:// domeni dobijaju sandbox bez allow-same-origin.
               */}
              <iframe
                ref={(el) => { iframeRefs.current[tab.id] = el; }}
                key={tab.reloadKey}
                src={tab.url}
                className="h-full w-full border-0"
                onLoad={() => handleIframeLoad(tab.id, tab.url, tab.igra)}
                sandbox={
                  getUrlStatus(tab.url) === 'spaja'
                    ? 'allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock allow-orientation-lock'
                    : 'allow-scripts allow-forms allow-popups allow-pointer-lock allow-orientation-lock'
                }
                title={tab.igra || 'Igrica'}
                allow="fullscreen; autoplay; gamepad"
              />
            </div>
          );
        })}
      </div>

      {/* ── Footer ── */}
      <div className="flex shrink-0 items-center justify-between border-t border-gray-800 bg-gray-900 px-4 py-1.5">
        <span className="text-xs text-gray-500">
          🌐 SPAJA Digitalni Brouvzer v2.0.0 — EKSTREMNI · {tabs.length} tab{tabs.length !== 1 ? 'a' : ''}
        </span>
        <div className="flex items-center gap-3">
          <a
            href={activeTab.url}
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

// ─── Tab Bar komponenta ───────────────────────────────────────────────

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
  onAdd: () => void;
}

function TabBar({ tabs, activeTabId, onSelect, onClose, onAdd }: TabBarProps) {
  return (
    <div className="flex shrink-0 items-center gap-1 overflow-x-auto border-b border-gray-800 bg-gray-950 px-2 pt-1.5">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`group flex min-w-0 max-w-[180px] shrink-0 cursor-pointer items-center gap-1.5 rounded-t-lg border px-3 py-1.5 text-xs transition ${
            tab.id === activeTabId
              ? 'border-gray-700 border-b-gray-900 bg-gray-900 text-white'
              : 'border-transparent bg-transparent text-gray-500 hover:bg-gray-800 hover:text-gray-300'
          }`}
          onClick={() => onSelect(tab.id)}
          role="tab"
          aria-selected={tab.id === activeTabId}
        >
          <span className="shrink-0">🎮</span>
          <span className="min-w-0 truncate">{tab.igra || 'Tab'}</span>
          {tab.dimenzija && (
            <span className="shrink-0 rounded-full bg-blue-700/40 px-1 text-blue-300">
              {tab.dimenzija}
            </span>
          )}
          {tabs.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); onClose(tab.id); }}
              className="ml-auto shrink-0 rounded p-0.5 text-gray-600 opacity-0 transition hover:bg-gray-700 hover:text-gray-200 group-hover:opacity-100"
              aria-label={`Zatvori tab ${tab.igra}`}
            >
              ✕
            </button>
          )}
        </div>
      ))}
      <button
        onClick={onAdd}
        className="shrink-0 rounded-t-lg px-2.5 py-1.5 text-gray-500 transition hover:bg-gray-800 hover:text-white"
        title="Novi tab"
        aria-label="Novi tab"
      >
        +
      </button>
    </div>
  );
}

// ─── Bookmark Panel komponenta ────────────────────────────────────────

interface BookmarkPanelProps {
  bookmarks: Bookmark[];
  onRemove: (url: string) => void;
  onClose: () => void;
}

function BookmarkPanel({ bookmarks, onRemove, onClose }: BookmarkPanelProps) {
  return (
    <div className="absolute right-0 top-full z-50 mt-1 w-72 rounded-xl border border-gray-700 bg-gray-900 shadow-xl">
      <div className="flex items-center justify-between border-b border-gray-800 px-3 py-2">
        <span className="text-xs font-semibold text-gray-300">⭐ Bookmarkovi ({bookmarks.length})</span>
        <button onClick={onClose} className="text-xs text-gray-500 hover:text-gray-300">✕</button>
      </div>
      <div className="max-h-64 overflow-y-auto">
        {bookmarks.length === 0 ? (
          <p className="px-3 py-4 text-center text-xs text-gray-500">Nema bookmarkova</p>
        ) : (
          bookmarks.map((b) => (
            <div key={b.url} className="flex items-center gap-2 border-b border-gray-800/50 px-3 py-2 hover:bg-gray-800">
              <a
                href={`/spaja-digitalni-brouvzer?url=${encodeURIComponent(b.url)}&igra=${encodeURIComponent(b.naziv)}`}
                className="min-w-0 flex-1"
                onClick={onClose}
              >
                <p className="truncate text-xs font-medium text-blue-400">{b.naziv}</p>
                <p className="truncate text-xs text-gray-600">{b.url}</p>
              </a>
              <button
                onClick={() => onRemove(b.url)}
                className="shrink-0 rounded p-0.5 text-gray-600 hover:bg-gray-700 hover:text-red-400"
                aria-label="Ukloni bookmark"
              >
                🗑
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── History Panel komponenta ─────────────────────────────────────────

interface HistoryPanelProps {
  history: HistoryEntry[];
  onClear: () => void;
  onClose: () => void;
}

function HistoryPanel({ history, onClear, onClose }: HistoryPanelProps) {
  return (
    <div className="absolute right-0 top-full z-50 mt-1 w-72 rounded-xl border border-gray-700 bg-gray-900 shadow-xl">
      <div className="flex items-center justify-between border-b border-gray-800 px-3 py-2">
        <span className="text-xs font-semibold text-gray-300">🕐 Istorija ({history.length})</span>
        <div className="flex gap-2">
          {history.length > 0 && (
            <button onClick={onClear} className="text-xs text-red-500 hover:text-red-400">Obriši sve</button>
          )}
          <button onClick={onClose} className="text-xs text-gray-500 hover:text-gray-300">✕</button>
        </div>
      </div>
      <div className="max-h-64 overflow-y-auto">
        {history.length === 0 ? (
          <p className="px-3 py-4 text-center text-xs text-gray-500">Nema istorije</p>
        ) : (
          history.map((h, i) => (
            <a
              key={`${h.url}-${i}`}
              href={`/spaja-digitalni-brouvzer?url=${encodeURIComponent(h.url)}&igra=${encodeURIComponent(h.naziv)}`}
              className="block border-b border-gray-800/50 px-3 py-2 hover:bg-gray-800"
              onClick={onClose}
            >
              <p className="truncate text-xs font-medium text-gray-300">{h.naziv}</p>
              <p className="truncate text-xs text-gray-600">
                {h.url} · {new Date(h.vreme).toLocaleString('sr-RS')}
              </p>
            </a>
          ))
        )}
      </div>
    </div>
  );
}
