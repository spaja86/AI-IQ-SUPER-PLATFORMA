'use client';

// SpajaUltraOmegaCore -∞Ω+∞ — AI Asistent Widget
// Kompanija SPAJA — Digitalna Industrija
// Plutajuci AI asistent koji se prikazuje na svakoj stranici
// sa kontekstualnim promptovima za AI i SpajaPro AI

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';

interface AiPagePrompt {
  pitanje: string;
  ikona: string;
  kategorija: 'ai' | 'spaja-pro-ai';
}

interface PagePromptConfig {
  putanja: string;
  naslov: string;
  opis: string;
  kontekst: string;
  promptovi: AiPagePrompt[];
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  pagePrompts: PagePromptConfig[];
}

export default function AiAsistentWidget({ pagePrompts }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ai' | 'spaja-pro-ai'>('ai');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  // Get prompts for current page
  const currentPageConfig = pagePrompts.find((p) => p.putanja === pathname) ?? {
    putanja: pathname,
    naslov: 'Stranica',
    opis: 'AI IQ SUPER PLATFORMA',
    kontekst: `Stranica na putanji ${pathname} u AI IQ SUPER PLATFORMA.`,
    promptovi: [
      { pitanje: 'Šta se dešava na ovoj stranici?', ikona: '❓', kategorija: 'ai' as const },
      { pitanje: 'Objasni mi sadržaj ove stranice', ikona: '📖', kategorija: 'spaja-pro-ai' as const },
      { pitanje: 'Koje opcije imam na ovoj stranici?', ikona: '⚙️', kategorija: 'ai' as const },
      { pitanje: 'Kako da koristim ovu funkciju?', ikona: '💡', kategorija: 'spaja-pro-ai' as const },
    ],
  };

  const filteredPrompts = currentPageConfig.promptovi.filter(
    (p) => p.kategorija === activeTab
  );

  // Reset messages when page changes
  useEffect(() => {
    setMessages([]);
    setShowPrompts(true);
  }, [pathname]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !showPrompts) {
      inputRef.current?.focus();
    }
  }, [isOpen, showPrompts]);

  const handleSend = useCallback(
    async (text: string) => {
      const userMessage = text.trim();
      if (!userMessage || loading) return;

      setInput('');
      setShowPrompts(false);
      setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
      setLoading(true);

      try {
        const res = await fetch('/api/ai-asistent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pitanje: userMessage,
            putanja: pathname,
            kontekst: currentPageConfig.kontekst,
            naslovStranice: currentPageConfig.naslov,
            kategorija: activeTab,
          }),
        });

        const data = await res.json();
        const reply = data.odgovor ?? 'Nema odgovora. Pokusajte ponovo.';
        setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: '⚠️ Greska u mrezi. Pokusajte ponovo.' },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading, pathname, currentPageConfig, activeTab]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  const handlePromptClick = (prompt: AiPagePrompt) => {
    handleSend(prompt.pitanje);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-2xl shadow-2xl shadow-blue-600/30 transition-all hover:scale-110 hover:shadow-blue-500/40 active:scale-95"
        aria-label={isOpen ? 'Zatvori AI Asistenta' : 'Otvori AI Asistenta'}
        title="AI & SpajaPro AI Asistent"
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex w-[360px] max-w-[calc(100vw-48px)] flex-col overflow-hidden rounded-2xl border border-gray-700/50 bg-gray-900/95 shadow-2xl backdrop-blur-lg sm:w-[400px]">
          {/* Header */}
          <div className="border-b border-gray-700/50 bg-gradient-to-r from-blue-900/40 to-purple-900/40 px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">
                  🤖 AI Asistent — {currentPageConfig.naslov}
                </h3>
                <p className="text-xs text-gray-400">{currentPageConfig.opis}</p>
              </div>
              <button
                onClick={() => {
                  setMessages([]);
                  setShowPrompts(true);
                }}
                className="rounded-lg p-1.5 text-xs text-gray-400 transition hover:bg-gray-700 hover:text-white"
                title="Resetuj razgovor"
              >
                🔄
              </button>
            </div>

            {/* Tabs: AI vs SpajaPro AI */}
            <div className="mt-2 flex gap-1">
              <button
                onClick={() => setActiveTab('ai')}
                className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  activeTab === 'ai'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'bg-gray-800/60 text-gray-400 hover:text-white'
                }`}
              >
                🧠 AI Preporuke
              </button>
              <button
                onClick={() => setActiveTab('spaja-pro-ai')}
                className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  activeTab === 'spaja-pro-ai'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                    : 'bg-gray-800/60 text-gray-400 hover:text-white'
                }`}
              >
                🚀 SpajaPro AI
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex max-h-[400px] min-h-[280px] flex-col overflow-y-auto p-3">
            {/* Prompt Recommendations */}
            {showPrompts && messages.length === 0 && (
              <div className="space-y-2">
                <p className="mb-2 text-center text-xs text-gray-500">
                  {activeTab === 'ai'
                    ? '🧠 Najbolje AI preporuke za ovu stranicu:'
                    : '🚀 SpajaPro AI preporuke za ovu stranicu:'}
                </p>
                {filteredPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handlePromptClick(prompt)}
                    className="group flex w-full items-center gap-2 rounded-xl border border-gray-700/30 bg-gray-800/40 px-3 py-2.5 text-left text-sm text-gray-300 transition hover:border-blue-500/30 hover:bg-gray-800/70 hover:text-white"
                  >
                    <span className="text-base transition-transform group-hover:scale-110">
                      {prompt.ikona}
                    </span>
                    <span className="flex-1">{prompt.pitanje}</span>
                    <span className="text-xs text-gray-600 transition group-hover:text-blue-400">
                      →
                    </span>
                  </button>
                ))}
                <p className="mt-3 text-center text-[10px] text-gray-600">
                  Ili postavite sopstveno pitanje ispod ↓
                </p>
              </div>
            )}

            {/* Chat Messages */}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-2 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-xs ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-200'
                  }`}
                >
                  <div className="mb-0.5 text-[10px] opacity-60">
                    {msg.role === 'user'
                      ? 'Vi'
                      : activeTab === 'ai'
                        ? '🧠 AI'
                        : '🚀 SpajaPro AI'}
                  </div>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="mb-2 flex justify-start">
                <div className="rounded-xl bg-gray-800 px-3 py-2 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <span className="animate-pulse">●</span>
                    <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>
                      ●
                    </span>
                    <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>
                      ●
                    </span>
                    <span className="ml-1 text-[10px]">
                      {activeTab === 'ai' ? 'AI razmislja...' : 'SpajaPro AI obradjuje...'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-gray-700/50 bg-gray-900/80 px-3 py-2"
          >
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  activeTab === 'ai'
                    ? 'Pitajte AI asistenta...'
                    : 'Pitajte SpajaPro AI...'
                }
                maxLength={2000}
                disabled={loading}
                className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-xs text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60"
              >
                {loading ? '...' : '↑'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
