'use client';

import { useState, useEffect } from 'react';
import type { Joke } from '@/lib/jokes/joke-api';

interface JokeGeneratorProps {
  autoLoad?: boolean;
  showCategories?: boolean;
  showStats?: boolean;
}

export function JokeGenerator({
  autoLoad = true,
  showCategories = true,
  showStats = true,
}: JokeGeneratorProps) {
  const [joke, setJoke] = useState<Joke | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string>('Any');
  const [jokeType, setJokeType] = useState<'single' | 'twopart' | 'any'>('any');
  const [safe, setSafe] = useState(true);
  const [jokesCount, setJokesCount] = useState(0);
  const [favorites, setFavorites] = useState<Joke[]>([]);

  // Auto-load prvi put
  useEffect(() => {
    if (autoLoad) {
      fetchJoke();
    }
  }, []);

  const fetchJoke = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (category && category !== 'Any') {
        params.append('category', category.toLowerCase());
      }
      if (jokeType !== 'any') {
        params.append('type', jokeType);
      }
      params.append('safe', safe ? 'true' : 'false');

      const response = await fetch(`/api/jokes/random?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch joke');
      }

      const data = await response.json();
      setJoke(data.data?.joke || null);
      setJokesCount((c) => c + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = () => {
    if (joke && !favorites.find((f) => f.id === joke.id)) {
      setFavorites([...favorites, joke]);
    }
  };

  const removeFromFavorites = (id: number) => {
    setFavorites(favorites.filter((f) => f.id !== id));
  };

  const isFavorite = joke ? favorites.some((f) => f.id === joke.id) : false;

  const formatJoke = (j: Joke): string => {
    if (j.type === 'single' && j.joke) {
      return j.joke;
    }
    if (j.type === 'twopart' && j.setup && j.delivery) {
      return `${j.setup}\n\n${j.delivery}`;
    }
    return '';
  };

  const shareJoke = async () => {
    if (!joke) return;

    const text = formatJoke(joke);
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this joke!',
          text: text,
        });
      } catch {
        // User canceled
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(text);
      alert('Joke copied to clipboard!');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg shadow-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">🎭 Joke Generator</h1>
        <p className="text-purple-200">Get random jokes powered by JokeAPI</p>
      </div>

      {/* Filters */}
      {showCategories && (
        <div className="mb-6 p-4 bg-purple-800 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-purple-200 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-purple-700 text-white rounded border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option>Any</option>
                <option>General</option>
                <option>Knock-knock</option>
                <option>Programming</option>
                <option>Spooky</option>
                <option>Christmas</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-semibold text-purple-200 mb-2">
                Type
              </label>
              <select
                value={jokeType}
                onChange={(e) => setJokeType(e.target.value as any)}
                className="w-full px-3 py-2 bg-purple-700 text-white rounded border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="any">Any</option>
                <option value="single">Single</option>
                <option value="twopart">Two-part</option>
              </select>
            </div>

            {/* Safe Mode */}
            <div>
              <label className="block text-sm font-semibold text-purple-200 mb-2">
                Safe Mode
              </label>
              <label className="flex items-center text-purple-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={safe}
                  onChange={(e) => setSafe(e.target.checked)}
                  className="mr-2 w-4 h-4"
                />
                Enable safe mode
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Joke Display */}
      {error ? (
        <div className="p-6 bg-red-900 text-red-200 rounded-lg mb-6">
          <p className="font-semibold">❌ Error: {error}</p>
        </div>
      ) : null}

      {loading ? (
        <div className="p-12 text-center">
          <div className="inline-block animate-spin">
            <svg
              className="w-12 h-12 text-purple-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <p className="text-purple-200 mt-4">Loading joke...</p>
        </div>
      ) : joke ? (
        <div className="p-8 bg-purple-700 rounded-lg mb-6 border-l-4 border-purple-400">
          <p className="text-xl text-white mb-4 leading-relaxed whitespace-pre-wrap">
            {formatJoke(joke)}
          </p>
          <div className="flex gap-2 text-sm text-purple-300">
            <span className="px-3 py-1 bg-purple-600 rounded">
              {joke.category || 'Unknown'}
            </span>
            <span className="px-3 py-1 bg-purple-600 rounded">
              {joke.type === 'single' ? '📝 Single' : '🎭 Two-part'}
            </span>
            {joke.safe && (
              <span className="px-3 py-1 bg-green-600 rounded">✅ Safe</span>
            )}
          </div>
        </div>
      ) : null}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={fetchJoke}
          disabled={loading}
          className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white font-semibold rounded-lg transition"
        >
          {loading ? '⏳ Loading...' : '🎲 Next Joke'}
        </button>

        {joke && (
          <>
            <button
              onClick={addToFavorites}
              disabled={isFavorite}
              className="flex-1 px-6 py-3 bg-pink-600 hover:bg-pink-500 disabled:bg-pink-800 text-white font-semibold rounded-lg transition"
            >
              {isFavorite ? '❤️ Favorited' : '🤍 Add to Favorites'}
            </button>

            <button
              onClick={shareJoke}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition"
            >
              📤 Share
            </button>
          </>
        )}
      </div>

      {/* Stats */}
      {showStats && (
        <div className="p-4 bg-purple-800 rounded-lg text-center text-purple-200">
          <p className="text-sm">
            📊 Jokes loaded: <span className="font-bold text-purple-300">{jokesCount}</span> | 
            ❤️ Favorites: <span className="font-bold text-pink-300">{favorites.length}</span>
          </p>
        </div>
      )}

      {/* Favorites List */}
      {favorites.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">❤️ Your Favorites</h2>
          <div className="space-y-3">
            {favorites.map((fav) => (
              <div
                key={fav.id}
                className="p-4 bg-purple-800 rounded-lg border-l-4 border-pink-400"
              >
                <p className="text-white mb-2">{formatJoke(fav)}</p>
                <button
                  onClick={() => removeFromFavorites(fav.id)}
                  className="text-sm text-pink-300 hover:text-pink-200 font-semibold"
                >
                  ✕ Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
