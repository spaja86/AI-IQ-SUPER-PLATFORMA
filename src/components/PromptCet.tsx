'use client';

/**
 * PromptČet — Čet sa povratnim informacijama i gradnjama za programiranje
 *
 * Svaki Prompt ima svoj Čet interfejs koji pruža:
 * - 💬 Čet za razgovor u kontekstu konkretnog Prompt-a
 * - 📋 Povratne informacije (feedback) — ocena, komentari, sugestije
 * - 🔨 Gradnje za programiranje — šta se može napraviti sa ovim Prompt-om
 * - ✅ Zadovoljstvo klijenata — sve što pomaže klijentima
 *
 * Kompanija SPAJA — AI IQ SUPER PLATFORMA
 */

import { useState, useRef, useEffect, useCallback } from 'react';

// ─── Types ──────────────────────────────────────────────────────────────────

interface PromptCetPoruka {
  uloga: 'korisnik' | 'asistent';
  sadrzaj: string;
  vreme: string;
}

interface PovratnaInformacija {
  ocena: number | null;
  komentar: string;
  tipovi: string[];
}

interface GradnjaInfo {
  naziv: string;
  opis: string;
  ikona: string;
  tip: 'programiranje' | 'dizajn' | 'analitika' | 'integracija' | 'bezbednost' | 'ostalo';
}

interface PromptPodaci {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  kategorija: string;
  sadrzaj: string;
  spajaProVerzija: number;
  ciljnaPersona?: string;
  ciljnaPlatforma?: string;
  tagovi: string[];
  prioritet: string;
}

interface Props {
  prompt: PromptPodaci;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function getVreme(): string {
  return new Date().toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function getGradnjeZaPrompt(prompt: PromptPodaci): GradnjaInfo[] {
  const gradnje: GradnjaInfo[] = [];

  const katGradnje: Record<string, GradnjaInfo[]> = {
    sistemski: [
      { naziv: 'Sistemska Inicijalizacija', opis: 'Automatska konfiguracija i pokretanje sistema', ikona: '⚡', tip: 'programiranje' },
      { naziv: 'Health Check Pipeline', opis: 'CI/CD pipeline za monitoring zdravlja sistema', ikona: '💚', tip: 'integracija' },
    ],
    persona: [
      { naziv: 'AI Agent Modul', opis: 'Izgradnja specijalizovanog AI agenta za personu', ikona: '🤖', tip: 'programiranje' },
      { naziv: 'Persona Dashboard', opis: 'Kontrolna tabla sa metrikama za personu', ikona: '📊', tip: 'dizajn' },
    ],
    platforma: [
      { naziv: 'API Integracija', opis: 'REST/GraphQL API za platformsku komunikaciju', ikona: '🔗', tip: 'integracija' },
      { naziv: 'Platforma Deploy', opis: 'Automatski deploy sa Vercel/GitHub Actions', ikona: '🚀', tip: 'programiranje' },
    ],
    analitika: [
      { naziv: 'Analitički Izveštaj', opis: 'Generisanje izveštaja sa vizualizacijom podataka', ikona: '📈', tip: 'analitika' },
      { naziv: 'Prediktivni Model', opis: 'ML model za predviđanje trendova', ikona: '🔮', tip: 'analitika' },
    ],
    bezbednost: [
      { naziv: 'Bezbednosni Audit', opis: 'Skeniranje ranjivosti i generisanje izveštaja', ikona: '🛡️', tip: 'bezbednost' },
      { naziv: 'Auth Modul', opis: 'Implementacija autentifikacije i autorizacije', ikona: '🔐', tip: 'programiranje' },
    ],
    kreativni: [
      { naziv: 'UI Komponenta', opis: 'React komponenta sa Tailwind stilovima', ikona: '🎨', tip: 'dizajn' },
      { naziv: 'Sadržaj Generator', opis: 'Automatsko generisanje sadržaja za platformu', ikona: '✨', tip: 'programiranje' },
    ],
    orkestracioni: [
      { naziv: 'Workflow Engine', opis: 'Orkestracioni engine za koordinaciju servisa', ikona: '🔄', tip: 'programiranje' },
      { naziv: 'Event Bus', opis: 'Sistem za distribuciju događaja između modula', ikona: '📡', tip: 'integracija' },
    ],
    evolucioni: [
      { naziv: 'Evolucioni Ciklus', opis: 'Automatski ciklus dijagnostike i unapređenja', ikona: '🧬', tip: 'programiranje' },
      { naziv: 'Auto-Upgrade', opis: 'Sistem za automatsko nadograđivanje komponenti', ikona: '⬆️', tip: 'integracija' },
    ],
    dijagnosticki: [
      { naziv: 'Dijagnostički Alat', opis: 'Alat za dijagnostiku i otkrivanje problema', ikona: '🩺', tip: 'programiranje' },
      { naziv: 'Monitoring Dashboard', opis: 'Real-time monitoring sa alertingom', ikona: '👁️', tip: 'dizajn' },
    ],
    univerzalni: [
      { naziv: 'Univerzalni Modul', opis: 'Modul koji radi sa svim sistemima u ekosistemu', ikona: '🌟', tip: 'programiranje' },
      { naziv: 'Cross-Platform Bridge', opis: 'Most između svih platformi u ekosistemu', ikona: '🌉', tip: 'integracija' },
    ],
  };

  const specificne = katGradnje[prompt.kategorija];
  if (specificne) {
    gradnje.push(...specificne);
  }

  gradnje.push({
    naziv: 'SpajaPro Prompt Integracija',
    opis: `Integracija sa SpajaPro v${prompt.spajaProVerzija} engine-om`,
    ikona: '🌟',
    tip: 'integracija',
  });

  if (prompt.ciljnaPersona) {
    gradnje.push({
      naziv: `${prompt.ciljnaPersona} Agent Build`,
      opis: `Specijalizovana gradnja za ${prompt.ciljnaPersona} personu`,
      ikona: '🤖',
      tip: 'programiranje',
    });
  }

  if (prompt.ciljnaPlatforma) {
    gradnje.push({
      naziv: `${prompt.ciljnaPlatforma} Deploy`,
      opis: `Deploy pipeline za ${prompt.ciljnaPlatforma} platformu`,
      ikona: '🚀',
      tip: 'programiranje',
    });
  }

  return gradnje;
}

// ─── Active Tab Type ────────────────────────────────────────────────────────

type CetTab = 'cet' | 'povratne' | 'gradnje';

// ─── Component ──────────────────────────────────────────────────────────────

export default function PromptCet({ prompt }: Props) {
  const [aktivniTab, setAktivniTab] = useState<CetTab>('cet');
  const [poruke, setPoruke] = useState<PromptCetPoruka[]>([]);
  const [unos, setUnos] = useState('');
  const [ucitavanje, setUcitavanje] = useState(false);
  const [greska, setGreska] = useState('');
  const [povratna, setPovratna] = useState<PovratnaInformacija>({
    ocena: null,
    komentar: '',
    tipovi: [],
  });
  const [povratnaPoslata, setPovratnaPoslata] = useState(false);
  const porukeRef = useRef<HTMLDivElement>(null);

  const gradnje = getGradnjeZaPrompt(prompt);

  useEffect(() => {
    porukeRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [poruke]);

  // Kontekstualna poruka za ovaj specifični prompt
  useEffect(() => {
    setPoruke([{
      uloga: 'asistent',
      sadrzaj: `Dobrodošli u Čet za "${prompt.naziv}"! 💬\n\nOvaj Prompt koristi SpajaPro v${prompt.spajaProVerzija} engine.\nKategorija: ${prompt.kategorija}\n${prompt.ciljnaPersona ? `Persona: ${prompt.ciljnaPersona}\n` : ''}${prompt.ciljnaPlatforma ? `Platforma: ${prompt.ciljnaPlatforma}\n` : ''}\nPitajte me bilo šta o ovom Prompt-u — kako ga koristiti, šta može da gradi, i kako da budete zadovoljni rezultatima. 🚀`,
      vreme: getVreme(),
    }]);
    setPovratna({ ocena: null, komentar: '', tipovi: [] });
    setPovratnaPoslata(false);
  }, [prompt]);

  const posaljiPoruku = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unos.trim() || ucitavanje) return;

    const korisnikPoruka = unos.trim();
    setUnos('');
    setGreska('');
    setPoruke((prev) => [...prev, { uloga: 'korisnik', sadrzaj: korisnikPoruka, vreme: getVreme() }]);
    setUcitavanje(true);

    try {
      const kontekst = `Kontekst Prompt-a: "${prompt.naziv}" (${prompt.kategorija}) — ${prompt.opis}. Sadržaj: ${prompt.sadrzaj}. SpajaPro v${prompt.spajaProVerzija}.`;
      const res = await fetch('/api/spaja-pro-prompt-execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `${kontekst}\n\nKorisnikovo pitanje: ${korisnikPoruka}`,
          verzija: prompt.spajaProVerzija,
          parametri: {},
          promptId: prompt.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setGreska(data.error ?? 'Greška pri slanju poruke.');
        setUcitavanje(false);
        return;
      }

      const odgovor = data.rezultat ?? data.odgovor?.sadrzaj ?? 'Nema odgovora.';
      setPoruke((prev) => [...prev, { uloga: 'asistent', sadrzaj: odgovor, vreme: getVreme() }]);
    } catch (err) {
      console.error('PromptCet: greška pri slanju poruke', err);
      setGreska('Greška u mreži. Pokušajte ponovo.');
    } finally {
      setUcitavanje(false);
    }
  }, [unos, ucitavanje, prompt]);

  const posaljiPovratnu = useCallback(() => {
    if (povratna.ocena === null) return;

    // Čuvanje u localStorage za analitiku
    try {
      const kljuc = `spaja-prompt-feedback-${prompt.id}`;
      const prethodni = JSON.parse(localStorage.getItem(kljuc) ?? '[]') as PovratnaInformacija[];
      prethodni.push(povratna);
      localStorage.setItem(kljuc, JSON.stringify(prethodni.slice(-50)));
    } catch (err) {
      console.error('PromptCet: greška pri čuvanju povratne informacije u localStorage', err);
    }

    setPovratnaPoslata(true);
  }, [povratna, prompt.id]);

  const togglePovratnaTip = (tip: string) => {
    setPovratna((prev) => ({
      ...prev,
      tipovi: prev.tipovi.includes(tip)
        ? prev.tipovi.filter((t) => t !== tip)
        : [...prev.tipovi, tip],
    }));
  };

  const tabovi: Array<{ id: CetTab; naziv: string; ikona: string }> = [
    { id: 'cet', naziv: 'Čet', ikona: '💬' },
    { id: 'povratne', naziv: 'Povratne informacije', ikona: '📋' },
    { id: 'gradnje', naziv: 'Gradnje', ikona: '🔨' },
  ];

  return (
    <div className="rounded-2xl border border-gray-700/50 bg-gray-900/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-700/50 px-4 py-3 bg-gradient-to-r from-blue-900/20 to-purple-900/10">
        <div className="flex items-center gap-2">
          <span className="text-lg">{prompt.ikona}</span>
          <div>
            <h4 className="text-sm font-semibold text-white">Čet — {prompt.naziv}</h4>
            <p className="text-xs text-gray-400">SpajaPro v{prompt.spajaProVerzija} • {prompt.kategorija}</p>
          </div>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-xs ${
          prompt.prioritet === 'kritican' ? 'bg-red-900/50 text-red-400' :
          prompt.prioritet === 'visok' ? 'bg-orange-900/50 text-orange-400' :
          prompt.prioritet === 'srednji' ? 'bg-yellow-900/50 text-yellow-400' :
          'bg-gray-700/50 text-gray-400'
        }`}>
          {prompt.prioritet}
        </span>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700/50">
        {tabovi.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setAktivniTab(tab.id)}
            className={`flex-1 px-3 py-2 text-xs font-medium transition ${
              aktivniTab === tab.id
                ? 'border-b-2 border-blue-500 text-blue-400 bg-blue-900/10'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
            }`}
          >
            <span className="mr-1">{tab.ikona}</span>
            {tab.naziv}
          </button>
        ))}
      </div>

      {/* ═══ ČET TAB ═══ */}
      {aktivniTab === 'cet' && (
        <div>
          {/* Poruke */}
          <div className="h-[280px] overflow-y-auto p-3 space-y-3">
            {poruke.map((msg, i) => (
              <div key={i} className={`flex ${msg.uloga === 'korisnik' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                  msg.uloga === 'korisnik'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-100'
                }`}>
                  <div className="mb-1 flex items-center justify-between gap-2 text-[10px] opacity-60">
                    <span>{msg.uloga === 'korisnik' ? 'Vi' : `SpajaPro v${prompt.spajaProVerzija}`}</span>
                    <span>{msg.vreme}</span>
                  </div>
                  <div className="whitespace-pre-wrap text-xs">{msg.sadrzaj}</div>
                </div>
              </div>
            ))}
            {ucitavanje && (
              <div className="flex justify-start">
                <div className="rounded-xl bg-gray-700 px-3 py-2 text-sm text-gray-300">
                  <div className="flex items-center gap-1 text-xs">
                    <span className="animate-pulse">●</span>
                    <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>●</span>
                    <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>●</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={porukeRef} />
          </div>

          {/* Greška */}
          {greska && (
            <div className="mx-3 mb-2 rounded-lg bg-red-900/40 px-3 py-2 text-xs text-red-300" role="alert">
              {greska}
            </div>
          )}

          {/* Input */}
          <form onSubmit={posaljiPoruku} className="flex gap-2 border-t border-gray-700/50 p-3">
            <input
              type="text"
              value={unos}
              onChange={(e) => setUnos(e.target.value)}
              placeholder={`Pitajte o "${prompt.naziv}"...`}
              maxLength={2000}
              disabled={ucitavanje}
              className="flex-1 rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={ucitavanje || !unos.trim()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60"
            >
              {ucitavanje ? '...' : 'Pošalji'}
            </button>
          </form>
        </div>
      )}

      {/* ═══ POVRATNE INFORMACIJE TAB ═══ */}
      {aktivniTab === 'povratne' && (
        <div className="p-4 space-y-4">
          {povratnaPoslata ? (
            <div className="text-center py-8">
              <p className="text-3xl mb-2">✅</p>
              <p className="text-sm font-medium text-green-400">Hvala na povratnim informacijama!</p>
              <p className="text-xs text-gray-400 mt-1">Vaše mišljenje pomaže da poboljšamo {prompt.naziv}.</p>
              <button
                onClick={() => { setPovratnaPoslata(false); setPovratna({ ocena: null, komentar: '', tipovi: [] }); }}
                className="mt-4 rounded-lg border border-gray-600 px-4 py-2 text-xs text-gray-300 transition hover:bg-gray-800"
              >
                Pošalji novu povratnu informaciju
              </button>
            </div>
          ) : (
            <>
              {/* Ocena */}
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-300">
                  Kako ocenjujete ovaj Prompt?
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((ocena) => (
                    <button
                      key={ocena}
                      onClick={() => setPovratna((prev) => ({ ...prev, ocena }))}
                      className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg transition ${
                        povratna.ocena === ocena
                          ? 'bg-yellow-600 text-white shadow-lg shadow-yellow-600/25'
                          : povratna.ocena !== null && ocena <= povratna.ocena
                            ? 'bg-yellow-800/50 text-yellow-400'
                            : 'bg-gray-800 text-gray-500 hover:bg-gray-700'
                      }`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>

              {/* Tipovi povratnih */}
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-300">
                  Šta biste poboljšali? (opcionalno)
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { naziv: 'Sadržaj', ikona: '📝' },
                    { naziv: 'Jasnoća', ikona: '💡' },
                    { naziv: 'Programiranje', ikona: '💻' },
                    { naziv: 'Gradnje', ikona: '🔨' },
                    { naziv: 'Brzina', ikona: '⚡' },
                    { naziv: 'Tačnost', ikona: '🎯' },
                  ].map((tip) => (
                    <button
                      key={tip.naziv}
                      onClick={() => togglePovratnaTip(tip.naziv)}
                      className={`rounded-full px-3 py-1.5 text-xs transition ${
                        povratna.tipovi.includes(tip.naziv)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {tip.ikona} {tip.naziv}
                    </button>
                  ))}
                </div>
              </div>

              {/* Komentar */}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-300">
                  Vaš komentar (opcionalno)
                </label>
                <textarea
                  value={povratna.komentar}
                  onChange={(e) => setPovratna((prev) => ({ ...prev, komentar: e.target.value }))}
                  placeholder="Napišite šta vam se sviđa ili šta bi trebalo poboljšati..."
                  rows={3}
                  maxLength={1000}
                  className="w-full resize-none rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Dugme za slanje */}
              <button
                onClick={posaljiPovratnu}
                disabled={povratna.ocena === null}
                className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                📋 Pošalji povratnu informaciju
              </button>
            </>
          )}
        </div>
      )}

      {/* ═══ GRADNJE TAB ═══ */}
      {aktivniTab === 'gradnje' && (
        <div className="p-4 space-y-3">
          <p className="text-xs text-gray-400 mb-3">
            Šta možete graditi i programirati sa &quot;{prompt.naziv}&quot; Prompt-om:
          </p>

          {gradnje.map((gradnja, i) => (
            <div
              key={i}
              className={`rounded-xl border p-3 transition ${
                gradnja.tip === 'programiranje' ? 'border-blue-500/20 bg-blue-900/10 hover:bg-blue-900/20' :
                gradnja.tip === 'dizajn' ? 'border-purple-500/20 bg-purple-900/10 hover:bg-purple-900/20' :
                gradnja.tip === 'analitika' ? 'border-green-500/20 bg-green-900/10 hover:bg-green-900/20' :
                gradnja.tip === 'integracija' ? 'border-cyan-500/20 bg-cyan-900/10 hover:bg-cyan-900/20' :
                gradnja.tip === 'bezbednost' ? 'border-red-500/20 bg-red-900/10 hover:bg-red-900/20' :
                'border-gray-700/50 bg-gray-800/30 hover:bg-gray-800/50'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="text-lg">{gradnja.ikona}</span>
                <div className="flex-1 min-w-0">
                  <h5 className="text-sm font-medium text-white">{gradnja.naziv}</h5>
                  <p className="text-xs text-gray-400 mt-0.5">{gradnja.opis}</p>
                  <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] ${
                    gradnja.tip === 'programiranje' ? 'bg-blue-900/50 text-blue-300' :
                    gradnja.tip === 'dizajn' ? 'bg-purple-900/50 text-purple-300' :
                    gradnja.tip === 'analitika' ? 'bg-green-900/50 text-green-300' :
                    gradnja.tip === 'integracija' ? 'bg-cyan-900/50 text-cyan-300' :
                    gradnja.tip === 'bezbednost' ? 'bg-red-900/50 text-red-300' :
                    'bg-gray-700/50 text-gray-400'
                  }`}>
                    {gradnja.tip}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Tagovi */}
          <div className="mt-4 pt-3 border-t border-gray-700/50">
            <p className="text-xs text-gray-500 mb-2">Tagovi za programiranje:</p>
            <div className="flex flex-wrap gap-1">
              {prompt.tagovi.map((t) => (
                <span key={t} className="rounded-full bg-gray-800 px-2 py-0.5 text-[10px] text-gray-400">
                  #{t}
                </span>
              ))}
              <span className="rounded-full bg-blue-900/30 px-2 py-0.5 text-[10px] text-blue-300">
                #SpajaPro-v{prompt.spajaProVerzija}
              </span>
              <span className="rounded-full bg-green-900/30 px-2 py-0.5 text-[10px] text-green-300">
                #gradnja
              </span>
              <span className="rounded-full bg-purple-900/30 px-2 py-0.5 text-[10px] text-purple-300">
                #programiranje
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
