'use client';

// SpajaUltraOmegaCore -∞Ω+∞ — SpajaPro Chat Interface
// Kompanija SPAJA — Digitalna Industrija
// Profesionalni AI chat sa streamingom, Markdown renderingom,
// organizacijom razgovora, izborom modela i custom instrukcijama

import { useState, useRef, useEffect, useCallback } from 'react';
import { dohvatiSesiju } from '@/lib/auth/omega-session-client';
import MarkdownRenderer from './MarkdownRenderer';

// ─── Types ──────────────────────────────────────────────────────────────────

interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  model?: string;
  tokensUsed?: number;
  createdAt?: string;
}

interface ChatThread {
  id: string;
  title: string;
  model: string;
  is_shared: boolean;
  share_id: string | null;
  created_at: string;
  updated_at: string;
}

interface ModelInfo {
  id: string;
  naziv: string;
  opis: string;
  minPlan: string;
  available: boolean;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function SpajaChatInterface() {
  // Auth state
  const [isLoggedIn] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !!dohvatiSesiju();
  });

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [streamingContent, setStreamingContent] = useState('');

  // Thread state
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [threadsLoaded, setThreadsLoaded] = useState(false);

  // Model state
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [showModelPicker, setShowModelPicker] = useState(false);

  // Settings state
  const [showSettings, setShowSettings] = useState(false);
  const [customInstructions, setCustomInstructions] = useState('');
  const [memory, setMemory] = useState('');
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState('starter');

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // ─── Helpers ────────────────────────────────────────────────────────────

  const getAuthHeaders = useCallback(() => {
    const sesija = dohvatiSesiju();
    if (!sesija) return null;
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sesija.token}`,
    };
  }, []);

  // ─── Load threads ───────────────────────────────────────────────────────

  const loadThreads = useCallback(async () => {
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const res = await fetch('/api/spaja-pro/threads', { headers });
      if (res.ok) {
        const data = await res.json();
        setThreads(data.threads ?? []);
        setThreadsLoaded(true);
      }
    } catch {
      // Silentno ako API ne postoji jos
    }
  }, [getAuthHeaders]);

  // ─── Load models ────────────────────────────────────────────────────────

  const loadModels = useCallback(async () => {
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const res = await fetch('/api/spaja-pro/models', { headers });
      if (res.ok) {
        const data = await res.json();
        setModels(data.models ?? []);
        setCurrentPlan(data.currentPlan ?? 'starter');
      }
    } catch {
      // Silentno
    }
  }, [getAuthHeaders]);

  // ─── Load settings ──────────────────────────────────────────────────────

  const loadSettings = useCallback(async () => {
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const res = await fetch('/api/spaja-pro/settings', { headers });
      if (res.ok) {
        const data = await res.json();
        setCustomInstructions(data.customInstructions ?? '');
        setMemory(data.memory ?? '');
        if (data.preferredModel) setSelectedModel(data.preferredModel);
      }
    } catch {
      // Silentno
    }
  }, [getAuthHeaders]);

  // ─── Load thread messages ───────────────────────────────────────────────

  const loadThreadMessages = useCallback(async (threadId: string) => {
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const res = await fetch(`/api/spaja-pro/threads/messages?threadId=${threadId}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setMessages(
          (data.messages ?? []).map((m: { id: string; role: string; content: string; model: string; tokens_used: number; created_at: string }) => ({
            id: m.id,
            role: m.role as 'user' | 'assistant',
            content: m.content,
            model: m.model,
            tokensUsed: m.tokens_used,
            createdAt: m.created_at,
          })),
        );
      }
    } catch {
      // Silentno
    }
  }, [getAuthHeaders]);

  // ─── Initialize ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (isLoggedIn) {
      loadThreads();
      loadModels();
      loadSettings();
    }
  }, [isLoggedIn, loadThreads, loadModels, loadSettings]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  // ─── Select thread ──────────────────────────────────────────────────────

  const selectThread = useCallback(
    (threadId: string) => {
      setActiveThreadId(threadId);
      setMessages([]);
      setStreamingContent('');
      setError('');
      loadThreadMessages(threadId);
      setSidebarOpen(false);
    },
    [loadThreadMessages],
  );

  // ─── New conversation ───────────────────────────────────────────────────

  const startNewConversation = useCallback(() => {
    setActiveThreadId(null);
    setMessages([]);
    setStreamingContent('');
    setError('');
    setSidebarOpen(false);
    inputRef.current?.focus();
  }, []);

  // ─── Delete thread ──────────────────────────────────────────────────────

  const deleteThread = useCallback(
    async (threadId: string) => {
      const headers = getAuthHeaders();
      if (!headers) return;

      try {
        await fetch(`/api/spaja-pro/threads?id=${threadId}`, {
          method: 'DELETE',
          headers,
        });
        setThreads((prev) => prev.filter((t) => t.id !== threadId));
        if (activeThreadId === threadId) {
          startNewConversation();
        }
      } catch {
        // Silentno
      }
    },
    [getAuthHeaders, activeThreadId, startNewConversation],
  );

  // ─── Share thread ───────────────────────────────────────────────────────

  const shareThread = useCallback(
    async (threadId: string) => {
      const headers = getAuthHeaders();
      if (!headers) return;

      try {
        const res = await fetch('/api/spaja-pro/threads/share', {
          method: 'POST',
          headers,
          body: JSON.stringify({ threadId }),
        });
        if (res.ok) {
          const data = await res.json();
          const shareUrl = `${window.location.origin}/spaja-pro/share/${data.shareId}`;
          await navigator.clipboard.writeText(shareUrl);
          setError(''); // Clear any existing error
          // Temporary success message
          setError('✅ Link za deljenje kopiran u clipboard!');
          setTimeout(() => setError(''), 3000);
          // Refresh threads to update share state
          loadThreads();
        }
      } catch {
        setError('Greska pri deljenju konverzacije.');
      }
    },
    [getAuthHeaders, loadThreads],
  );

  // ─── Save settings ──────────────────────────────────────────────────────

  const saveSettings = useCallback(async () => {
    const headers = getAuthHeaders();
    if (!headers) return;

    setSettingsLoading(true);
    try {
      const res = await fetch('/api/spaja-pro/settings', {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          customInstructions,
          preferredModel: selectedModel,
          memory,
        }),
      });
      if (res.ok) {
        setShowSettings(false);
      }
    } catch {
      setError('Greska pri cuvanju podesavanja.');
    } finally {
      setSettingsLoading(false);
    }
  }, [getAuthHeaders, customInstructions, selectedModel, memory]);

  // ─── Send message (streaming) ───────────────────────────────────────────

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setError('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);
    setStreamingContent('');

    try {
      const sesija = dohvatiSesiju();
      if (!sesija) {
        setError('Sesija je istekla. Prijavite se ponovo na /pricing stranici.');
        setLoading(false);
        return;
      }

      // Abort previous request if any
      if (abortRef.current) {
        abortRef.current.abort();
      }
      abortRef.current = new AbortController();

      const res = await fetch('/api/spaja-pro/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sesija.token}`,
        },
        body: JSON.stringify({
          message: userMessage,
          threadId: activeThreadId,
          model: selectedModel,
          stream: true,
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? 'Greska pri slanju poruke.');
        setLoading(false);
        return;
      }

      const contentType = res.headers.get('content-type') ?? '';

      if (contentType.includes('text/event-stream') && res.body) {
        // ── Streaming response ──
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = '';
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Parse SSE events
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? ''; // Keep incomplete line in buffer

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const jsonStr = line.slice(6).trim();
            if (!jsonStr) continue;

            try {
              const event = JSON.parse(jsonStr);

              if (event.type === 'meta' && event.threadId) {
                setActiveThreadId(event.threadId);
              } else if (event.type === 'delta' && event.content) {
                accumulated += event.content;
                setStreamingContent(accumulated);
              } else if (event.type === 'done') {
                // Streaming complete — add full message
                setMessages((prev) => [
                  ...prev,
                  {
                    role: 'assistant',
                    content: accumulated,
                    model: event.model,
                    tokensUsed: event.tokensUsed,
                  },
                ]);
                setStreamingContent('');
                // Refresh thread list
                loadThreads();
              } else if (event.type === 'error') {
                setError(event.error ?? 'Streaming greska.');
              }
            } catch {
              // Skip malformed JSON
            }
          }
        }

        // If stream ended without done event, add whatever we have
        if (accumulated && !messages.some((m) => m.content === accumulated)) {
          setMessages((prev) => {
            // Only add if not already added by 'done' event
            const lastMsg = prev[prev.length - 1];
            if (lastMsg?.role === 'assistant' && lastMsg.content === accumulated) {
              return prev;
            }
            return [...prev, { role: 'assistant', content: accumulated }];
          });
          setStreamingContent('');
        }
      } else {
        // ── JSON response (non-streaming / reasoning models) ──
        const data = await res.json();
        const reply = data.reply ?? 'Nema odgovora.';
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: reply,
            model: data.model,
            tokensUsed: data.tokensUsed,
          },
        ]);
        if (data.threadId) {
          setActiveThreadId(data.threadId);
        }
        loadThreads();
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        // User cancelled — OK
      } else {
        setError('Greska u mrezi. Pokusajte ponovo.');
      }
    } finally {
      setLoading(false);
      setStreamingContent('');
      abortRef.current = null;
    }
  }

  // ─── Stop streaming ─────────────────────────────────────────────────────

  const stopStreaming = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    if (streamingContent) {
      setMessages((prev) => [...prev, { role: 'assistant', content: streamingContent }]);
      setStreamingContent('');
    }
    setLoading(false);
  }, [streamingContent]);

  // ─── Handle textarea auto-resize and keyboard shortcuts ─────────────────

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
  };

  // ─── Not logged in ──────────────────────────────────────────────────────

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

  // ─── Active model display name ──────────────────────────────────────────

  const activeModelName = models.find((m) => m.id === selectedModel)?.naziv ?? selectedModel;

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="flex bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900" style={{ minHeight: '80vh' }}>
      {/* ── Sidebar: Thread list ─── */}
      <div
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } fixed left-0 top-0 z-40 h-full w-72 transform border-r border-gray-700/50 bg-gray-900/95 backdrop-blur-sm transition-transform duration-200 lg:static lg:z-auto`}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar header */}
          <div className="border-b border-gray-700/50 p-4">
            <button
              onClick={startNewConversation}
              className="flex w-full items-center gap-2 rounded-lg border border-gray-600 px-4 py-3 text-sm font-medium text-gray-300 transition hover:border-gray-400 hover:bg-gray-800 hover:text-white"
            >
              <span>✨</span>
              <span>Nova konverzacija</span>
            </button>
          </div>

          {/* Thread list */}
          <div className="flex-1 overflow-y-auto p-2">
            {!threadsLoaded ? (
              <div className="p-4 text-center text-sm text-gray-500">Učitavanje...</div>
            ) : threads.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">Nema konverzacija</div>
            ) : (
              threads.map((thread) => (
                <div
                  key={thread.id}
                  className={`group mb-1 flex items-center rounded-lg px-3 py-2.5 text-sm transition ${
                    activeThreadId === thread.id
                      ? 'bg-gray-700/60 text-white'
                      : 'text-gray-400 hover:bg-gray-800/60 hover:text-gray-200'
                  }`}
                >
                  <button
                    onClick={() => selectThread(thread.id)}
                    className="flex-1 truncate text-left"
                    title={thread.title}
                  >
                    {thread.title}
                  </button>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        shareThread(thread.id);
                      }}
                      className="rounded p-1 text-gray-500 hover:bg-gray-700 hover:text-blue-400"
                      title="Podeli"
                    >
                      🔗
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteThread(thread.id);
                      }}
                      className="rounded p-1 text-gray-500 hover:bg-gray-700 hover:text-red-400"
                      title="Obriši"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Sidebar footer */}
          <div className="border-t border-gray-700/50 p-3">
            <button
              onClick={() => setShowSettings(true)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-400 transition hover:bg-gray-800 hover:text-white"
            >
              <span>⚙️</span>
              <span>Podešavanja</span>
            </button>
            <div className="mt-2 px-3 text-xs text-gray-600">
              Plan: <span className="text-gray-400">{currentPlan}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile sidebar overlay ─── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main chat area ─── */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-700/50 px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-white lg:hidden"
            >
              ☰
            </button>
            <h2 className="text-lg font-bold text-white">🤖 SpajaPro AI</h2>
          </div>

          {/* Model picker */}
          <div className="relative">
            <button
              onClick={() => setShowModelPicker(!showModelPicker)}
              className="flex items-center gap-2 rounded-lg border border-gray-600 px-3 py-1.5 text-sm text-gray-300 transition hover:border-gray-400 hover:text-white"
            >
              <span>🧠</span>
              <span>{activeModelName}</span>
              <span className="text-xs text-gray-500">▼</span>
            </button>

            {showModelPicker && (
              <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-gray-700 bg-gray-900 p-2 shadow-2xl">
                {models.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      if (model.available) {
                        setSelectedModel(model.id);
                        setShowModelPicker(false);
                      }
                    }}
                    disabled={!model.available}
                    className={`flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                      model.id === selectedModel
                        ? 'bg-blue-600/20 text-blue-300'
                        : model.available
                          ? 'text-gray-300 hover:bg-gray-800'
                          : 'cursor-not-allowed text-gray-600'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{model.naziv}</span>
                        {!model.available && (
                          <span className="rounded bg-gray-700 px-1.5 py-0.5 text-xs text-gray-400">
                            {model.minPlan}+
                          </span>
                        )}
                        {model.id === selectedModel && <span className="text-blue-400">✓</span>}
                      </div>
                      <div className="mt-0.5 text-xs text-gray-500">{model.opis}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="mx-auto max-w-3xl">
            {messages.length === 0 && !streamingContent && (
              <div className="flex h-full min-h-[400px] items-center justify-center text-gray-500">
                <div className="text-center">
                  <p className="mb-2 text-5xl">🤖</p>
                  <p className="text-xl font-medium text-gray-300">Dobrodošli u SpajaPro AI!</p>
                  <p className="mt-2 text-sm text-gray-500">
                    Postavite pitanje da započnete razgovor. Podržavam Markdown, kod, tabele i matematiku.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {[
                      'Objasni mi TypeScript generike',
                      'Napiši React komponentu za todo listu',
                      'Šta je RAG u AI kontekstu?',
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          setInput(suggestion);
                          inputRef.current?.focus();
                        }}
                        className="rounded-lg border border-gray-700 px-3 py-2 text-xs text-gray-400 transition hover:border-gray-500 hover:text-gray-300"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={msg.id ?? i} className={`mb-6 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800/60 text-gray-100'
                  }`}
                >
                  <div className="mb-1 flex items-center gap-2 text-xs opacity-60">
                    <span>{msg.role === 'user' ? 'Vi' : 'SpajaPro AI'}</span>
                    {msg.model && msg.role === 'assistant' && (
                      <span className="rounded bg-gray-700/50 px-1 py-0.5">{msg.model}</span>
                    )}
                  </div>
                  {msg.role === 'assistant' ? (
                    <MarkdownRenderer content={msg.content} />
                  ) : (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  )}
                </div>
              </div>
            ))}

            {/* Streaming content */}
            {streamingContent && (
              <div className="mb-6 flex justify-start">
                <div className="max-w-[85%] rounded-2xl bg-gray-800/60 px-4 py-3 text-gray-100">
                  <div className="mb-1 text-xs opacity-60">SpajaPro AI</div>
                  <MarkdownRenderer content={streamingContent} />
                  <span className="inline-block h-4 w-1.5 animate-pulse bg-blue-400" />
                </div>
              </div>
            )}

            {/* Loading indicator (before streaming starts) */}
            {loading && !streamingContent && (
              <div className="mb-6 flex justify-start">
                <div className="rounded-2xl bg-gray-800/60 px-4 py-3 text-sm text-gray-300">
                  <div className="mb-1 text-xs opacity-60">SpajaPro AI</div>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-blue-400" style={{ animationDelay: '0ms' }} />
                    <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-blue-400" style={{ animationDelay: '150ms' }} />
                    <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-blue-400" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-4">
            <div
              role="alert"
              className={`mb-2 rounded-lg px-4 py-3 text-sm ${
                error.startsWith('✅')
                  ? 'bg-green-900/40 text-green-300'
                  : 'bg-red-900/40 text-red-300'
              }`}
            >
              {error}
              {error.includes('Nadogradite') && (
                <a href="/pricing" className="ml-2 text-blue-400 underline hover:text-blue-300">
                  Pogledaj planove
                </a>
              )}
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="border-t border-gray-700/50 px-4 py-3">
          <div className="mx-auto max-w-3xl">
            <form onSubmit={handleSend} className="flex items-end gap-3">
              <div className="relative flex-1">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Pošaljite poruku..."
                  maxLength={4000}
                  disabled={loading}
                  rows={1}
                  className="w-full resize-none rounded-xl border border-gray-600 bg-gray-900 px-4 py-3 pr-10 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-60"
                  style={{ maxHeight: 200 }}
                />
              </div>
              {loading ? (
                <button
                  type="button"
                  onClick={stopStreaming}
                  className="rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
                >
                  ■ Stop
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60"
                >
                  Pošalji
                </button>
              )}
            </form>
            <div className="mt-1.5 flex items-center justify-between text-xs text-gray-600">
              <span>Shift+Enter za novi red • Enter za slanje</span>
              <span>{input.length}/4000</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Settings Modal ─── */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-gray-700 bg-gray-900 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">⚙️ Podešavanja</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Custom Instructions */}
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Custom Instrukcije
              </label>
              <p className="mb-2 text-xs text-gray-500">
                SpajaPro će slediti ove instrukcije u svakom razgovoru.
              </p>
              <textarea
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="Npr: Odgovaraj uvek na srpskom. Koristi formalne izraze. Daj primere koda u TypeScript-u."
                maxLength={2000}
                rows={4}
                className="w-full resize-none rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              />
              <div className="mt-1 text-right text-xs text-gray-500">
                {customInstructions.length}/2000
              </div>
            </div>

            {/* Memory */}
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Memorija
              </label>
              <p className="mb-2 text-xs text-gray-500">
                Informacije koje SpajaPro pamti između sesija (npr. vaše ime, projekti na kojima radite).
              </p>
              <textarea
                value={memory}
                onChange={(e) => setMemory(e.target.value)}
                placeholder="Npr: Radim na Next.js projektu. Preferiram TypeScript i Tailwind CSS."
                maxLength={4000}
                rows={3}
                className="w-full resize-none rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              />
              <div className="mt-1 text-right text-xs text-gray-500">
                {memory.length}/4000
              </div>
            </div>

            {/* Preferred Model */}
            <div className="mb-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Podrazumevani Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
              >
                {models.map((m) => (
                  <option key={m.id} value={m.id} disabled={!m.available}>
                    {m.naziv} {!m.available ? `(zahteva ${m.minPlan}+ plan)` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Save button */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowSettings(false)}
                className="rounded-lg border border-gray-600 px-4 py-2 text-sm text-gray-300 transition hover:bg-gray-800"
              >
                Otkaži
              </button>
              <button
                onClick={saveSettings}
                disabled={settingsLoading}
                className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60"
              >
                {settingsLoading ? 'Čuvanje...' : 'Sačuvaj'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Close model picker on outside click */}
      {showModelPicker && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowModelPicker(false)}
        />
      )}
    </div>
  );
}
