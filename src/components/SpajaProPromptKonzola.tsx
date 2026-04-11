'use client';

import { useState, useCallback } from 'react';

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

// ─── Props ──────────────────────────────────────────────────────────────────

interface Props {
  promptovi: PromptItem[];
  verzije: SpajaProVerzija[];
  kategorije: string[];
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function SpajaProPromptKonzola({ promptovi, verzije, kategorije }: Props) {
  // State
  const [izabranaVerzija, setIzabranaVerzija] = useState<number>(10);
  const [izabranaKategorija, setIzabranaKategorija] = useState<string>('sve');
  const [izabraniPrompt, setIzabraniPrompt] = useState<PromptItem | null>(null);
  const [korisnikUnos, setKorisnikUnos] = useState<string>('');
  const [parametriVrednosti, setParametriVrednosti] = useState<Record<string, string>>({});
  const [odgovor, setOdgovor] = useState<string>('');
  const [ucitavanje, setUcitavanje] = useState(false);
  const [istorija, setIstorija] = useState<Array<{ prompt: string; odgovor: string; verzija: number; vreme: string }>>([]);

  // Filter prompts
  const filtrirani = promptovi.filter((p) => {
    if (izabranaKategorija !== 'sve' && p.kategorija !== izabranaKategorija) return false;
    if (p.spajaProVerzija > izabranaVerzija) return false;
    return true;
  });

  // Select prompt
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
  }, []);

  // Execute prompt
  const izvrsiPrompt = useCallback(async () => {
    if (!korisnikUnos.trim()) return;

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
      const rezultat = data.rezultat ?? data.error ?? 'Greška pri izvršavanju';
      setOdgovor(rezultat);

      setIstorija((prev) => [
        {
          prompt: korisnikUnos.slice(0, 100),
          odgovor: rezultat.slice(0, 200),
          verzija: izabranaVerzija,
          vreme: new Date().toLocaleTimeString('sr-RS'),
        },
        ...prev.slice(0, 19),
      ]);
    } catch {
      setOdgovor('⚠️ Greška pri komunikaciji sa SpajaPro engine-om.');
    } finally {
      setUcitavanje(false);
    }
  }, [korisnikUnos, izabranaVerzija, parametriVrednosti, izabraniPrompt]);

  // Version info
  const aktivnaVerzija = verzije.find((v) => v.verzija === izabranaVerzija);

  return (
    <div className="bg-gray-950 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-3xl font-bold text-white">
            🌟 SpajaPro Prompt Konzola
          </h2>
          <p className="text-gray-400">
            Aktivni Prompt UI — SpajaPro {izabranaVerzija} engine {aktivnaVerzija ? `(${aktivnaVerzija.kodnoIme})` : ''} — Programirajte sa promptovima
          </p>
        </div>

        {/* Top bar: Version + Category selectors */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          {/* SpajaPro Version Selector */}
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-gray-400">SpajaPro Verzija</label>
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

          {/* Category Filter */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-400">Kategorija</label>
            <select
              value={izabranaKategorija}
              onChange={(e) => setIzabranaKategorija(e.target.value)}
              className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="sve">Sve kategorije</option>
              {kategorije.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Main layout: 2 columns */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left: Prompt Library (quick launch) */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-gray-700/50 bg-gray-900/50 p-4">
              <h3 className="mb-3 text-sm font-semibold text-gray-300">
                📚 Prompt Biblioteka ({filtrirani.length})
              </h3>
              <div className="max-h-[600px] space-y-2 overflow-y-auto pr-1">
                {filtrirani.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => izaberiPrompt(p)}
                    className={`w-full rounded-xl border p-3 text-left transition ${
                      izabraniPrompt?.id === p.id
                        ? 'border-blue-500/50 bg-blue-900/20 shadow-lg shadow-blue-500/5'
                        : 'border-gray-700/30 bg-gray-800/30 hover:border-gray-600 hover:bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-lg">{p.ikona}</span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-white">
                          {p.naziv}
                        </div>
                        <div className="mt-0.5 flex flex-wrap gap-1">
                          <span className="rounded bg-gray-700/50 px-1.5 py-0.5 text-[10px] text-gray-400">
                            v{p.spajaProVerzija}
                          </span>
                          <span className={`rounded px-1.5 py-0.5 text-[10px] ${
                            p.prioritet === 'kritican' ? 'bg-red-900/50 text-red-400' :
                            p.prioritet === 'visok' ? 'bg-orange-900/50 text-orange-400' :
                            p.prioritet === 'srednji' ? 'bg-yellow-900/50 text-yellow-400' :
                            'bg-gray-700/50 text-gray-400'
                          }`}>
                            {p.prioritet}
                          </span>
                          {p.ciljnaPersona && (
                            <span className="rounded bg-purple-900/50 px-1.5 py-0.5 text-[10px] text-purple-400">
                              {p.ciljnaPersona}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Prompt Editor + Output */}
          <div className="space-y-4 lg:col-span-2">
            {/* Prompt Info */}
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
                    <span key={t} className="rounded-full bg-blue-900/30 px-2 py-0.5 text-xs text-blue-300">
                      #{t}
                    </span>
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

            {/* Prompt Input */}
            <div className="rounded-2xl border border-gray-700/50 bg-gray-900/50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-300">
                  📝 Prompt — SpajaPro v{izabranaVerzija} {aktivnaVerzija ? `(${aktivnaVerzija.kodnoIme})` : ''}
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
                rows={5}
                className="w-full resize-y rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 font-mono text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              />
              <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  {korisnikUnos.length} karaktera
                </div>
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
                        SpajaPro obrađuje...
                      </span>
                    ) : (
                      `🚀 Izvrši — SpajaPro v${izabranaVerzija}`
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Output */}
            {odgovor && (
              <div className="rounded-2xl border border-green-500/20 bg-green-900/10 p-4">
                <h3 className="mb-2 text-sm font-semibold text-green-400">
                  ✅ Rezultat — SpajaPro v{izabranaVerzija}
                </h3>
                <div className="whitespace-pre-wrap rounded-xl bg-gray-900 p-4 font-mono text-sm text-gray-200">
                  {odgovor}
                </div>
              </div>
            )}

            {/* History */}
            {istorija.length > 0 && (
              <div className="rounded-2xl border border-gray-700/50 bg-gray-900/50 p-4">
                <h3 className="mb-3 text-sm font-semibold text-gray-300">
                  📜 Istorija ({istorija.length})
                </h3>
                <div className="max-h-48 space-y-2 overflow-y-auto">
                  {istorija.map((item, i) => (
                    <div key={i} className="rounded-lg border border-gray-700/30 bg-gray-800/30 p-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-blue-400">SpajaPro v{item.verzija}</span>
                        <span className="text-gray-500">{item.vreme}</span>
                      </div>
                      <div className="mt-1 truncate text-gray-400">📝 {item.prompt}</div>
                      <div className="mt-0.5 truncate text-green-400/70">✅ {item.odgovor}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
