'use client';

// SpajaUltraOmegaCore -∞Ω+∞ — SpajaPro Prompt Aplikacija
// Kompanija SPAJA — Digitalna Industrija
// Centralna Prompt aplikacija sa SpajaPro v6-15 engine-om

import { useState, useCallback, useRef, useEffect } from 'react';
import { dohvatiSesiju } from '@/lib/auth/omega-session-client';

// ─── Types ──────────────────────────────────────────────────────────────────

interface PromptParametar {
  naziv: string;
  tip: 'string' | 'number' | 'boolean' | 'lista';
  opis: string;
  podrazumevano?: string;
}

interface PromptItem {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  kategorija: string;
  sadrzaj: string;
  spajaProVerzija: number;
  ciljnaPersona?: string;
  ciljnaPlatforma?: string;
  parametri: PromptParametar[];
  tagovi: string[];
  prioritet: string;
}

interface SpajaProVerzija {
  verzija: number;
  naziv: string;
  kodnoIme: string;
  ikona: string;
  status: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  vreme: string;
  verzija: number;
}

type AppTab = 'builder' | 'biblioteka' | 'chat' | 'analitika';

// ─── Props ──────────────────────────────────────────────────────────────────

interface Props {
  promptovi: PromptItem[];
  verzije: SpajaProVerzija[];
  kategorije: string[];
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function getVreme(): string {
  return new Date().toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function SpajaProPromptApp({ promptovi, verzije, kategorije }: Props) {
  // ─── State ──────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<AppTab>('builder');
  const [izabranaVerzija, setIzabranaVerzija] = useState<number>(10);
  const [izabranaKategorija, setIzabranaKategorija] = useState<string>('sve');
  const [izabraniPrompt, setIzabraniPrompt] = useState<PromptItem | null>(null);
  const [korisnikUnos, setKorisnikUnos] = useState<string>('');
  const [parametriVrednosti, setParametriVrednosti] = useState<Record<string, string>>({});
  const [odgovor, setOdgovor] = useState<string>('');
  const [ucitavanje, setUcitavanje] = useState(false);
  const [pretraga, setPretraga] = useState('');

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // History state
  const [istorija, setIstorija] = useState<Array<{ prompt: string; odgovor: string; verzija: number; vreme: string; kategorija: string }>>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('spaja-prompt-app-istorija');
      if (saved) return JSON.parse(saved) as Array<{ prompt: string; odgovor: string; verzija: number; vreme: string; kategorija: string }>;
    } catch { /* ignore */ }
    return [];
  });

  // ─── Effects ────────────────────────────────────────────────────────
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // ─── Derived ────────────────────────────────────────────────────────
  const aktivnaVerzija = verzije.find((v) => v.verzija === izabranaVerzija);

  const filtrirani = promptovi.filter((p) => {
    if (izabranaKategorija !== 'sve' && p.kategorija !== izabranaKategorija) return false;
    if (p.spajaProVerzija > izabranaVerzija) return false;
    if (pretraga) {
      const q = pretraga.toLowerCase();
      return (
        p.naziv.toLowerCase().includes(q) ||
        p.opis.toLowerCase().includes(q) ||
        p.tagovi.some((t) => t.toLowerCase().includes(q)) ||
        p.kategorija.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Analytics data
  const statistika = {
    ukupnoPromptova: promptovi.length,
    ukupnoKategorija: kategorije.length,
    ukupnoVerzija: verzije.length,
    aktivnihVerzija: verzije.filter((v) => v.status === 'aktivna').length,
    betaVerzija: verzije.filter((v) => v.status === 'beta').length,
    koriscenihPromptova: istorija.length,
    personaPromptova: promptovi.filter((p) => p.ciljnaPersona).length,
    platformaPromptova: promptovi.filter((p) => p.ciljnaPlatforma).length,
    kriticnihPromptova: promptovi.filter((p) => p.prioritet === 'kritican').length,
  };

  const kategorijaDistribucija = kategorije.map((k) => ({
    naziv: k,
    broj: promptovi.filter((p) => p.kategorija === k).length,
  })).sort((a, b) => b.broj - a.broj);

  const verzijaDistribucija = verzije.map((v) => ({
    verzija: v.verzija,
    naziv: v.naziv,
    ikona: v.ikona,
    status: v.status,
    broj: promptovi.filter((p) => p.spajaProVerzija === v.verzija).length,
  }));

  // ─── Actions ────────────────────────────────────────────────────────

  const izaberiPrompt = useCallback((prompt: PromptItem) => {
    setIzabraniPrompt(prompt);
    setKorisnikUnos(prompt.sadrzaj);
    setIzabranaVerzija(prompt.spajaProVerzija);
    const defaults: Record<string, string> = {};
    for (const p of prompt.parametri) {
      defaults[p.naziv] = p.podrazumevano ?? '';
    }
    setParametriVrednosti(defaults);
    setOdgovor('');
    setActiveTab('builder');
  }, []);

  const izvrsiPrompt = useCallback(async () => {
    if (!korisnikUnos.trim() || ucitavanje) return;
    setUcitavanje(true);
    setOdgovor('');

    try {
      const res = await fetch('/api/spaja-pro-prompt-execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: korisnikUnos,
          verzija: izabranaVerzija,
          parametri: parametriVrednosti,
          promptId: izabraniPrompt?.id,
        }),
      });

      const data = await res.json();
      const rezultat = data.rezultat ?? data.error ?? 'Greska pri izvrsavanju';
      setOdgovor(rezultat);

      setIstorija((prev) => {
        const nova = [
          {
            prompt: korisnikUnos.slice(0, 200),
            odgovor: rezultat.slice(0, 500),
            verzija: izabranaVerzija,
            vreme: getVreme(),
            kategorija: izabraniPrompt?.kategorija ?? 'slobodni',
          },
          ...prev.slice(0, 99),
        ];
        try {
          localStorage.setItem('spaja-prompt-app-istorija', JSON.stringify(nova));
        } catch { /* ignore */ }
        return nova;
      });
    } catch {
      setOdgovor('⚠️ Greška pri komunikaciji sa SpajaPro engine-om. Pokušajte ponovo.');
    } finally {
      setUcitavanje(false);
    }
  }, [korisnikUnos, izabranaVerzija, parametriVrednosti, izabraniPrompt, ucitavanje]);

  const posaljiChat = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setChatError('');
    setChatMessages((prev) => [...prev, { role: 'user', content: userMessage, vreme: getVreme(), verzija: izabranaVerzija }]);
    setChatLoading(true);

    try {
      const sesija = dohvatiSesiju();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (sesija?.token) {
        headers.Authorization = `Bearer ${sesija.token}`;
      }

      const res = await fetch('/api/spaja-pro-prompt-execute', {
        method: 'POST',
        headers,
        body: JSON.stringify({ prompt: userMessage, verzija: izabranaVerzija, parametri: {} }),
      });

      const data = await res.json();
      if (!res.ok) {
        setChatError(data.error ?? 'Greška pri slanju poruke.');
        setChatLoading(false);
        return;
      }

      const reply = data.rezultat ?? data.odgovor?.sadrzaj ?? 'Nema odgovora.';
      setChatMessages((prev) => [...prev, { role: 'assistant', content: reply, vreme: getVreme(), verzija: izabranaVerzija }]);
    } catch {
      setChatError('Greška u mreži. Pokušajte ponovo.');
    } finally {
      setChatLoading(false);
    }
  }, [chatInput, chatLoading, izabranaVerzija]);

  // ─── Tab definitions ───────────────────────────────────────────────

  const tabs: Array<{ id: AppTab; naziv: string; ikona: string; opis: string }> = [
    { id: 'builder', naziv: 'Builder', ikona: '🔧', opis: 'Kreiraj i izvrši Prompt' },
    { id: 'biblioteka', naziv: 'Biblioteka', ikona: '📚', opis: 'Pretraži Prompt-ove' },
    { id: 'chat', naziv: 'Chat', ikona: '💬', opis: 'AI razgovor' },
    { id: 'analitika', naziv: 'Analitika', ikona: '📊', opis: 'Statistike i uvidi' },
  ];

  // ─── Render ────────────────────────────────────────────────────────

  return (
    <div className="bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-7xl">

        {/* ─── App Header ──────────────────────────────────────── */}
        <div className="mb-6 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-900/20 via-purple-900/10 to-blue-900/20 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                📝 SpajaPro Prompt Aplikacija
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                Centralna Prompt aplikacija — SpajaPro v{izabranaVerzija} {aktivnaVerzija ? `(${aktivnaVerzija.kodnoIme})` : ''} engine | {promptovi.length} promptova | {verzije.length} verzija
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                aktivnaVerzija?.status === 'aktivna' ? 'bg-green-900/50 text-green-400' :
                aktivnaVerzija?.status === 'beta' ? 'bg-yellow-900/50 text-yellow-400' :
                'bg-gray-700/50 text-gray-400'
              }`}>
                {aktivnaVerzija?.ikona} v{izabranaVerzija} — {aktivnaVerzija?.status ?? 'nepoznato'}
              </span>
            </div>
          </div>

          {/* Version selector */}
          <div className="mt-4">
            <label className="mb-1 block text-xs font-medium text-gray-500">SpajaPro Engine Verzija</label>
            <div className="flex flex-wrap gap-1">
              {verzije.map((v) => (
                <button
                  key={v.verzija}
                  onClick={() => setIzabranaVerzija(v.verzija)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    izabranaVerzija === v.verzija
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                      : v.status === 'aktivna'
                        ? 'bg-gray-800 text-green-400 hover:bg-gray-700'
                        : v.status === 'beta'
                          ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                          : 'bg-gray-800/50 text-gray-500 hover:bg-gray-700'
                  }`}
                >
                  {v.ikona} v{v.verzija}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Tab Navigation ──────────────────────────────────── */}
        <div className="mb-6 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-white'
              }`}
            >
              <span>{tab.ikona}</span>
              <span>{tab.naziv}</span>
              <span className="hidden text-xs opacity-60 sm:inline">— {tab.opis}</span>
            </button>
          ))}
        </div>

        {/* ─── Tab Content ─────────────────────────────────────── */}

        {/* ═══ BUILDER TAB ═══ */}
        {activeTab === 'builder' && (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Quick prompts sidebar */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl border border-gray-700/50 bg-gray-900/50 p-4">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-300">
                  <span>⚡</span> Brzi Prompt-ovi ({filtrirani.length})
                </h3>
                <div className="mb-3">
                  <select
                    value={izabranaKategorija}
                    onChange={(e) => setIzabranaKategorija(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="sve">Sve kategorije</option>
                    {kategorije.map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>
                <div className="max-h-[500px] space-y-2 overflow-y-auto pr-1">
                  {filtrirani.slice(0, 20).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => izaberiPrompt(p)}
                      className={`w-full rounded-xl border p-2.5 text-left transition ${
                        izabraniPrompt?.id === p.id
                          ? 'border-blue-500/50 bg-blue-900/20 shadow-lg shadow-blue-500/5'
                          : 'border-gray-700/30 bg-gray-800/30 hover:border-gray-600 hover:bg-gray-800/50'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-base">{p.ikona}</span>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-xs font-medium text-white">{p.naziv}</div>
                          <div className="mt-0.5 flex flex-wrap gap-1">
                            <span className="rounded bg-gray-700/50 px-1 py-0.5 text-[10px] text-gray-400">v{p.spajaProVerzija}</span>
                            <span className={`rounded px-1 py-0.5 text-[10px] ${
                              p.prioritet === 'kritican' ? 'bg-red-900/50 text-red-400' :
                              p.prioritet === 'visok' ? 'bg-orange-900/50 text-orange-400' :
                              'bg-gray-700/50 text-gray-400'
                            }`}>{p.prioritet}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Editor area */}
            <div className="space-y-4 lg:col-span-2">
              {/* Selected prompt info */}
              {izabraniPrompt && (
                <div className="rounded-2xl border border-blue-500/20 bg-blue-900/10 p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{izabraniPrompt.ikona}</span>
                    <div>
                      <h3 className="font-semibold text-white">{izabraniPrompt.naziv}</h3>
                      <p className="text-sm text-gray-400">{izabraniPrompt.opis}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {izabraniPrompt.tagovi.map((t) => (
                      <span key={t} className="rounded-full bg-blue-900/30 px-2 py-0.5 text-xs text-blue-300">#{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Parameters */}
              {izabraniPrompt && izabraniPrompt.parametri.length > 0 && (
                <div className="rounded-2xl border border-gray-700/50 bg-gray-900/50 p-4">
                  <h3 className="mb-3 text-sm font-semibold text-gray-300">⚙️ Parametri</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {izabraniPrompt.parametri.map((param) => (
                      <div key={param.naziv}>
                        <label className="mb-1 block text-xs text-gray-400">
                          {param.naziv} <span className="text-gray-600">({param.tip})</span>
                        </label>
                        {param.tip === 'boolean' ? (
                          <select
                            value={parametriVrednosti[param.naziv] ?? param.podrazumevano ?? 'true'}
                            onChange={(e) => setParametriVrednosti((prev) => ({ ...prev, [param.naziv]: e.target.value }))}
                            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                          >
                            <option value="true">Da (true)</option>
                            <option value="false">Ne (false)</option>
                          </select>
                        ) : (
                          <input
                            type={param.tip === 'number' ? 'number' : 'text'}
                            value={parametriVrednosti[param.naziv] ?? param.podrazumevano ?? ''}
                            onChange={(e) => setParametriVrednosti((prev) => ({ ...prev, [param.naziv]: e.target.value }))}
                            placeholder={param.opis}
                            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prompt editor */}
              <div className="rounded-2xl border border-gray-700/50 bg-gray-900/50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-300">
                    📝 Prompt Editor — SpajaPro v{izabranaVerzija}
                  </h3>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${
                    aktivnaVerzija?.status === 'aktivna' ? 'bg-green-900/50 text-green-400' :
                    aktivnaVerzija?.status === 'beta' ? 'bg-yellow-900/50 text-yellow-400' :
                    'bg-gray-700/50 text-gray-400'
                  }`}>
                    {aktivnaVerzija?.status ?? 'nepoznato'}
                  </span>
                </div>
                <textarea
                  value={korisnikUnos}
                  onChange={(e) => setKorisnikUnos(e.target.value)}
                  placeholder="Unesite prompt za SpajaPro engine... Izaberite iz biblioteke ili napišite svoj."
                  rows={6}
                  className="w-full resize-y rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 font-mono text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                />
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs text-gray-500">{korisnikUnos.length} karaktera</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setKorisnikUnos(''); setOdgovor(''); setIzabraniPrompt(null); }}
                      className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-gray-400 transition hover:bg-gray-700"
                    >
                      Očisti
                    </button>
                    <button
                      onClick={izvrsiPrompt}
                      disabled={ucitavanje || !korisnikUnos.trim()}
                      className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {ucitavanje ? (
                        <span className="flex items-center gap-2">
                          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Obrađujem...
                        </span>
                      ) : (
                        `🚀 Izvrši — v${izabranaVerzija}`
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Output */}
              {odgovor && (
                <div className="rounded-2xl border border-green-500/20 bg-green-900/10 p-4">
                  <h3 className="mb-2 text-sm font-semibold text-green-400">✅ Rezultat — SpajaPro v{izabranaVerzija}</h3>
                  <div className="whitespace-pre-wrap rounded-xl bg-gray-900 p-4 font-mono text-sm text-gray-200">{odgovor}</div>
                </div>
              )}

              {/* Recent history */}
              {istorija.length > 0 && (
                <div className="rounded-2xl border border-gray-700/50 bg-gray-900/50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-300">📜 Poslednji Prompt-ovi ({Math.min(istorija.length, 5)})</h3>
                    <button
                      onClick={() => { setIstorija([]); try { localStorage.removeItem('spaja-prompt-app-istorija'); } catch { /* ignore */ } }}
                      className="rounded-lg px-3 py-1 text-xs text-red-400 transition hover:bg-gray-800 hover:text-red-300"
                    >
                      Obriši sve
                    </button>
                  </div>
                  <div className="max-h-48 space-y-2 overflow-y-auto">
                    {istorija.slice(0, 5).map((item, i) => (
                      <button
                        key={i}
                        onClick={() => { setKorisnikUnos(item.prompt); setIzabranaVerzija(item.verzija); setOdgovor(item.odgovor); setIzabraniPrompt(null); }}
                        className="w-full rounded-lg border border-gray-700/30 bg-gray-800/30 p-2 text-left text-xs transition hover:border-gray-600 hover:bg-gray-800/60"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-blue-400">v{item.verzija} • {item.kategorija}</span>
                          <span className="text-gray-500">{item.vreme}</span>
                        </div>
                        <div className="mt-1 truncate text-gray-400">📝 {item.prompt}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══ BIBLIOTEKA TAB ═══ */}
        {activeTab === 'biblioteka' && (
          <div>
            {/* Search + Filters */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <input
                  type="text"
                  value={pretraga}
                  onChange={(e) => setPretraga(e.target.value)}
                  placeholder="🔍 Pretraži prompt-ove po nazivu, opisu, tagu..."
                  className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <select
                value={izabranaKategorija}
                onChange={(e) => setIzabranaKategorija(e.target.value)}
                className="rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="sve">Sve kategorije</option>
                {kategorije.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>

            {/* Results count */}
            <div className="mb-4 text-sm text-gray-400">
              {filtrirani.length} prompt-ova pronađeno {pretraga && `za "${pretraga}"`}
            </div>

            {/* Prompt cards grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtrirani.map((p) => (
                <button
                  key={p.id}
                  onClick={() => izaberiPrompt(p)}
                  className="rounded-2xl border border-gray-700/50 bg-gray-900/50 p-4 text-left transition hover:border-blue-500/30 hover:bg-gray-800/50 hover:shadow-lg hover:shadow-blue-900/10"
                >
                  <div className="mb-2 flex items-start gap-2">
                    <span className="text-2xl">{p.ikona}</span>
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-semibold text-white">{p.naziv}</h4>
                      <p className="mt-0.5 line-clamp-2 text-xs text-gray-400">{p.opis}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    <span className="rounded bg-blue-900/30 px-1.5 py-0.5 text-[10px] text-blue-400">SpajaPro v{p.spajaProVerzija}</span>
                    <span className="rounded bg-gray-700/50 px-1.5 py-0.5 text-[10px] text-gray-400">{p.kategorija}</span>
                    <span className={`rounded px-1.5 py-0.5 text-[10px] ${
                      p.prioritet === 'kritican' ? 'bg-red-900/50 text-red-400' :
                      p.prioritet === 'visok' ? 'bg-orange-900/50 text-orange-400' :
                      p.prioritet === 'srednji' ? 'bg-yellow-900/50 text-yellow-400' :
                      'bg-gray-700/50 text-gray-400'
                    }`}>{p.prioritet}</span>
                    {p.ciljnaPersona && (
                      <span className="rounded bg-purple-900/50 px-1.5 py-0.5 text-[10px] text-purple-400">👤 {p.ciljnaPersona}</span>
                    )}
                    {p.ciljnaPlatforma && (
                      <span className="rounded bg-cyan-900/50 px-1.5 py-0.5 text-[10px] text-cyan-400">🌐 {p.ciljnaPlatforma}</span>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {p.tagovi.slice(0, 3).map((t) => (
                      <span key={t} className="text-[10px] text-gray-500">#{t}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ═══ CHAT TAB ═══ */}
        {activeTab === 'chat' && (
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-gray-700/50 bg-gray-900/50">
              {/* Chat header */}
              <div className="flex items-center justify-between border-b border-gray-700/50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💬</span>
                  <h3 className="font-semibold text-white">SpajaPro AI Chat</h3>
                </div>
                <div className="text-xs text-gray-400">
                  {aktivnaVerzija?.ikona} SpajaPro v{izabranaVerzija} ({aktivnaVerzija?.kodnoIme})
                </div>
              </div>

              {/* Messages area */}
              <div className="h-[450px] overflow-y-auto p-4">
                {chatMessages.length === 0 && (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    <div className="text-center">
                      <p className="mb-2 text-4xl">🤖</p>
                      <p className="text-lg font-medium">Dobrodošli u SpajaPro AI Chat!</p>
                      <p className="mt-1 text-sm">Postavite pitanje da započnete razgovor.</p>
                      <p className="mt-2 text-xs text-gray-600">Engine: SpajaPro v{izabranaVerzija} — {aktivnaVerzija?.kodnoIme}</p>
                    </div>
                  </div>
                )}
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                      msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-100'
                    }`}>
                      <div className="mb-1 flex items-center justify-between gap-3 text-xs opacity-60">
                        <span>{msg.role === 'user' ? 'Vi' : `SpajaPro v${msg.verzija}`}</span>
                        <span>{msg.vreme}</span>
                      </div>
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="mb-4 flex justify-start">
                    <div className="rounded-2xl bg-gray-700 px-4 py-3 text-sm text-gray-300">
                      <div className="mb-1 text-xs opacity-60">SpajaPro AI</div>
                      <div className="flex items-center gap-1">
                        <span className="animate-pulse">●</span>
                        <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>●</span>
                        <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>●</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Error */}
              {chatError && (
                <div className="mx-4 mb-3 rounded-lg bg-red-900/40 px-4 py-2 text-sm text-red-300" role="alert">
                  {chatError}
                </div>
              )}

              {/* Input */}
              <form onSubmit={posaljiChat} className="flex gap-3 border-t border-gray-700/50 p-4">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Unesite poruku..."
                  maxLength={4000}
                  disabled={chatLoading}
                  className="flex-1 rounded-xl border border-gray-600 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={chatLoading || !chatInput.trim()}
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60"
                >
                  {chatLoading ? '...' : 'Pošalji'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ═══ ANALITIKA TAB ═══ */}
        {activeTab === 'analitika' && (
          <div className="space-y-6">
            {/* Stats grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { naziv: 'Ukupno Prompt-ova', vrednost: statistika.ukupnoPromptova, ikona: '📝', boja: 'blue' },
                { naziv: 'Kategorija', vrednost: statistika.ukupnoKategorija, ikona: '📂', boja: 'purple' },
                { naziv: 'SpajaPro verzija', vrednost: statistika.ukupnoVerzija, ikona: '🔢', boja: 'green' },
                { naziv: 'Korišćeni Prompt-ovi', vrednost: statistika.koriscenihPromptova, ikona: '📜', boja: 'yellow' },
                { naziv: 'Aktivnih verzija', vrednost: statistika.aktivnihVerzija, ikona: '✅', boja: 'green' },
                { naziv: 'Persona Prompt-ova', vrednost: statistika.personaPromptova, ikona: '👥', boja: 'purple' },
                { naziv: 'Platforma Prompt-ova', vrednost: statistika.platformaPromptova, ikona: '🌐', boja: 'cyan' },
                { naziv: 'Kritičnih', vrednost: statistika.kriticnihPromptova, ikona: '🔴', boja: 'red' },
              ].map((stat) => (
                <div
                  key={stat.naziv}
                  className={`rounded-2xl border bg-gray-900/50 p-4 ${
                    stat.boja === 'blue' ? 'border-blue-500/20' :
                    stat.boja === 'purple' ? 'border-purple-500/20' :
                    stat.boja === 'green' ? 'border-green-500/20' :
                    stat.boja === 'yellow' ? 'border-yellow-500/20' :
                    stat.boja === 'cyan' ? 'border-cyan-500/20' :
                    stat.boja === 'red' ? 'border-red-500/20' :
                    'border-gray-700/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{stat.ikona}</span>
                    <div>
                      <div className="text-2xl font-bold text-white">{stat.vrednost}</div>
                      <div className="text-xs text-gray-400">{stat.naziv}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Category distribution */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-gray-700/50 bg-gray-900/50 p-4">
                <h3 className="mb-4 text-sm font-semibold text-gray-300">📂 Distribucija po kategorijama</h3>
                <div className="space-y-3">
                  {kategorijaDistribucija.map((k) => {
                    const procenat = Math.round((k.broj / promptovi.length) * 100);
                    return (
                      <div key={k.naziv}>
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="text-gray-300">{k.naziv}</span>
                          <span className="text-gray-400">{k.broj} ({procenat}%)</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400"
                            style={{ width: `${procenat}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Version distribution */}
              <div className="rounded-2xl border border-gray-700/50 bg-gray-900/50 p-4">
                <h3 className="mb-4 text-sm font-semibold text-gray-300">🔢 Prompt-ovi po SpajaPro verziji</h3>
                <div className="space-y-3">
                  {verzijaDistribucija.map((v) => {
                    const procenat = promptovi.length > 0 ? Math.round((v.broj / promptovi.length) * 100) : 0;
                    return (
                      <div key={v.verzija}>
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="text-gray-300">{v.ikona} {v.naziv} ({v.status})</span>
                          <span className="text-gray-400">{v.broj} ({procenat}%)</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                          <div
                            className={`h-full rounded-full ${
                              v.status === 'aktivna' ? 'bg-gradient-to-r from-green-600 to-green-400' :
                              v.status === 'beta' ? 'bg-gradient-to-r from-yellow-600 to-yellow-400' :
                              v.status === 'razvoj' ? 'bg-gradient-to-r from-orange-600 to-orange-400' :
                              'bg-gradient-to-r from-gray-600 to-gray-400'
                            }`}
                            style={{ width: `${procenat}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Priority breakdown */}
            <div className="rounded-2xl border border-gray-700/50 bg-gray-900/50 p-4">
              <h3 className="mb-4 text-sm font-semibold text-gray-300">🎯 Prioriteti Prompt-ova</h3>
              <div className="grid gap-4 sm:grid-cols-4">
                {(['kritican', 'visok', 'srednji', 'nizak'] as const).map((prioritet) => {
                  const broj = promptovi.filter((p) => p.prioritet === prioritet).length;
                  const boja = prioritet === 'kritican' ? 'red' : prioritet === 'visok' ? 'orange' : prioritet === 'srednji' ? 'yellow' : 'gray';
                  return (
                    <div key={prioritet} className={`rounded-xl border p-3 text-center ${
                      boja === 'red' ? 'border-red-500/30 bg-red-900/10' :
                      boja === 'orange' ? 'border-orange-500/30 bg-orange-900/10' :
                      boja === 'yellow' ? 'border-yellow-500/30 bg-yellow-900/10' :
                      'border-gray-700/50 bg-gray-800/30'
                    }`}>
                      <div className={`text-2xl font-bold ${
                        boja === 'red' ? 'text-red-400' :
                        boja === 'orange' ? 'text-orange-400' :
                        boja === 'yellow' ? 'text-yellow-400' :
                        'text-gray-400'
                      }`}>{broj}</div>
                      <div className="text-xs text-gray-400 capitalize">{prioritet}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent usage history */}
            {istorija.length > 0 && (
              <div className="rounded-2xl border border-gray-700/50 bg-gray-900/50 p-4">
                <h3 className="mb-4 text-sm font-semibold text-gray-300">📜 Istorija korišćenja ({istorija.length})</h3>
                <div className="max-h-64 space-y-2 overflow-y-auto">
                  {istorija.map((item, i) => (
                    <div key={i} className="rounded-lg border border-gray-700/30 bg-gray-800/30 p-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-blue-400">SpajaPro v{item.verzija} • {item.kategorija}</span>
                        <span className="text-gray-500">{item.vreme}</span>
                      </div>
                      <div className="mt-1 truncate text-gray-400">{item.prompt}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
