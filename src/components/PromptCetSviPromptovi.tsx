'use client';

/**
 * PromptČet Svi Promptovi — Prikaz svih Prompt-ova sa Čet panelima
 *
 * Klijenti biraju Prompt iz liste i dobijaju:
 * - 💬 Čet — razgovor u kontekstu izabranog Prompt-a
 * - 📋 Povratne informacije — ocena i komentari
 * - 🔨 Gradnje — šta mogu da naprave sa Prompt-om
 *
 * Kompanija SPAJA — AI IQ SUPER PLATFORMA
 */

import { useState } from 'react';
import PromptCet from './PromptCet';

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
  promptovi: PromptPodaci[];
}

export default function PromptCetSviPromptovi({ promptovi }: Props) {
  const [izabraniPrompt, setIzabraniPrompt] = useState<PromptPodaci | null>(promptovi[0] ?? null);
  const [filterKategorija, setFilterKategorija] = useState<string>('sve');

  const kategorije = [...new Set(promptovi.map((p) => p.kategorija))];

  const filtrirani = filterKategorija === 'sve'
    ? promptovi
    : promptovi.filter((p) => p.kategorija === filterKategorija);

  return (
    <div className="bg-gradient-to-b from-gray-950 to-gray-900 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            💬 Čet za sve Prompt-ove
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Svaki Prompt ima svoj Čet sa povratnim informacijama i gradnjama za programiranje — za zadovoljstvo klijenata
          </p>
        </div>

        {/* Filter */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setFilterKategorija('sve')}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              filterKategorija === 'sve'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Sve ({promptovi.length})
          </button>
          {kategorije.map((kat) => (
            <button
              key={kat}
              onClick={() => setFilterKategorija(kat)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                filterKategorija === kat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {kat} ({promptovi.filter((p) => p.kategorija === kat).length})
            </button>
          ))}
        </div>

        {/* Layout: List + Chat */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Prompt List */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-700/50 bg-gray-900/50 p-3">
              <h3 className="mb-3 text-sm font-semibold text-gray-300 px-1">
                📝 Prompt-ovi sa Čet-om ({filtrirani.length})
              </h3>
              <div className="max-h-[600px] space-y-1.5 overflow-y-auto pr-1">
                {filtrirani.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setIzabraniPrompt(p)}
                    className={`w-full rounded-xl border p-2.5 text-left transition ${
                      izabraniPrompt?.id === p.id
                        ? 'border-blue-500/50 bg-blue-900/20 shadow-lg shadow-blue-500/5'
                        : 'border-gray-700/30 bg-gray-800/30 hover:border-gray-600 hover:bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{p.ikona}</span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-medium text-white">{p.naziv}</div>
                        <div className="mt-0.5 flex items-center gap-1">
                          <span className="rounded bg-gray-700/50 px-1 py-0.5 text-[10px] text-gray-400">
                            v{p.spajaProVerzija}
                          </span>
                          <span className="rounded bg-gray-700/50 px-1 py-0.5 text-[10px] text-gray-400">
                            {p.kategorija}
                          </span>
                          <span className="text-[10px] text-blue-400">💬 Čet</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Panel */}
          <div className="lg:col-span-3">
            {izabraniPrompt ? (
              <PromptCet prompt={izabraniPrompt} />
            ) : (
              <div className="rounded-2xl border border-gray-700/50 bg-gray-900/50 p-8 text-center text-gray-500">
                <p className="text-3xl mb-2">💬</p>
                <p className="text-sm">Izaberite Prompt iz liste da otvorite Čet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
