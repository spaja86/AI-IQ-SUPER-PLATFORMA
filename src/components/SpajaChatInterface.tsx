'use client';

// SpajaUltraOmegaCore -∞Ω+∞ — SpajaPro Chat Interface
// Kompanija SPAJA — Digitalna Industrija
// Realni AI chat interfejs koji koristi OpenAI preko API-ja

import { useState, useRef, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function SpajaChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [plan, setPlan] = useState('starter');
  const [messagesRemaining, setMessagesRemaining] = useState<number | string>(10);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const checkAuth = useCallback(async () => {
    try {
      const supabase = getSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    } catch {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setError('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const supabase = getSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setError('Sesija je istekla. Prijavite se ponovo.');
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      const res = await fetch('/api/spaja-pro/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.limitReached) {
          setError(`Dostigli ste limit poruka za ${data.currentPlan} plan. Nadogradite na visi plan.`);
        } else {
          setError(data.error ?? 'Greska pri slanju poruke.');
        }
        setLoading(false);
        return;
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      setPlan(data.plan);
      setMessagesRemaining(data.messagesRemaining);
    } catch {
      setError('Greska u mrezi. Pokusajte ponovo.');
    } finally {
      setLoading(false);
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">🤖 SpajaPro AI Chat</h2>
          <p className="mb-8 text-gray-400">
            Prijavite se da biste pristupili SpajaPro AI asistentu.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/pricing"
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Pogledaj planove i prijavi se
            </a>
            <a
              href="/registracija"
              className="rounded-lg border border-gray-600 px-6 py-3 text-sm font-semibold text-gray-300 transition hover:border-gray-400 hover:text-white"
            >
              Registruj se
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 px-6 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">🤖 SpajaPro AI Chat</h2>
          <div className="text-sm text-gray-400">
            Plan: <span className="font-medium text-blue-400">{plan}</span>
            {' | '}
            Preostalo: <span className="font-medium text-green-400">{messagesRemaining}</span>
          </div>
        </div>

        {/* Chat poruke */}
        <div className="mb-4 h-[500px] overflow-y-auto rounded-2xl border border-gray-700/50 bg-gray-800/40 p-4">
          {messages.length === 0 && (
            <div className="flex h-full items-center justify-center text-gray-500">
              <div className="text-center">
                <p className="mb-2 text-4xl">🤖</p>
                <p className="text-lg font-medium">Dobrodosli u SpajaPro AI!</p>
                <p className="text-sm">Postavite pitanje da zapocnete razgovor.</p>
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-100'
                }`}
              >
                <div className="mb-1 text-xs opacity-60">
                  {msg.role === 'user' ? 'Vi' : 'SpajaPro AI'}
                </div>
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}

          {loading && (
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

          <div ref={messagesEndRef} />
        </div>

        {error && (
          <div role="alert" className="mb-4 rounded-lg bg-red-900/40 px-4 py-3 text-sm text-red-300">
            {error}
            {error.includes('Nadogradite') && (
              <a href="/pricing" className="ml-2 text-blue-400 underline hover:text-blue-300">
                Pogledaj planove
              </a>
            )}
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSend} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Unesite poruku..."
            maxLength={4000}
            disabled={loading}
            className="flex-1 rounded-xl border border-gray-600 bg-gray-900 px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60"
          >
            {loading ? '...' : 'Posalji'}
          </button>
        </form>
      </div>
    </div>
  );
}
