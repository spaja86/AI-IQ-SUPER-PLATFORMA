/**
 * Joke API Integration
 * Koristi JokeAPI.dev za random jokes
 * https://jokeapi.dev
 */

export interface Joke {
  id: number;
  category: string;
  type: 'single' | 'twopart';
  joke?: string;
  setup?: string;
  delivery?: string;
  flags: {
    nsfw: boolean;
    religious: boolean;
    political: boolean;
    racist: boolean;
    sexist: boolean;
    explicit: boolean;
  };
  safe: boolean;
  lang: string;
}

export interface JokeResponse {
  error: boolean;
  category?: string;
  type?: string;
  joke?: string;
  setup?: string;
  delivery?: string;
  flags?: Record<string, boolean>;
  safe?: boolean;
  id?: number;
  lang?: string;
}

export interface JokeFilters {
  category?: 'general' | 'knock-knock' | 'programming' | 'spooky' | 'christmas';
  type?: 'single' | 'twopart';
  safe?: boolean;
}

const JOKE_API_BASE = 'https://v2.jokeapi.dev/joke';
const CACHE_TTL = 3600; // 1 sat

// In-memory cache
const jokeCache = new Map<string, { data: Joke; timestamp: number }>();

/**
 * Dohvata random šalu sa JokeAPI
 */
export async function getRandomJoke(filters?: JokeFilters): Promise<Joke | null> {
  try {
    const cacheKey = JSON.stringify(filters || {});
    const cached = jokeCache.get(cacheKey);

    // Proveri cache
    if (cached && Date.now() - cached.timestamp < CACHE_TTL * 1000) {
      return cached.data;
    }

    // Napravi URL sa filterima
    const category = filters?.category || 'Any';
    const params = new URLSearchParams();

    if (filters?.type) params.append('type', filters.type);
    if (filters?.safe !== undefined) params.append('safe-mode', filters.safe ? 'true' : 'false');

    const url = `${JOKE_API_BASE}/${category}?${params.toString()}`;

    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      console.error(`Joke API error: ${response.status}`);
      return null;
    }

    const data: JokeResponse = await response.json();

    if (data.error) {
      console.error('Joke API returned error:', data);
      return null;
    }

    const joke: Joke = {
      id: data.id || Math.random(),
      category: data.category || 'Unknown',
      type: (data.type as 'single' | 'twopart') || 'single',
      joke: data.joke,
      setup: data.setup,
      delivery: data.delivery,
      flags: data.flags || {},
      safe: data.safe ?? true,
      lang: data.lang || 'en',
    };

    // Sačuvaj u cache
    jokeCache.set(cacheKey, { data: joke, timestamp: Date.now() });

    return joke;
  } catch (error) {
    console.error('Error fetching joke:', error);
    return null;
  }
}

/**
 * Dohvata više šala odjednom
 */
export async function getMultipleJokes(
  count: number = 5,
  filters?: JokeFilters,
): Promise<Joke[]> {
  const jokes: Joke[] = [];

  for (let i = 0; i < count; i++) {
    const joke = await getRandomJoke(filters);
    if (joke) {
      jokes.push(joke);
      // Mala pauza između zahteva da ne zbunimo API
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return jokes;
}

/**
 * Formatira šalu za prikaz
 */
export function formatJoke(joke: Joke): string {
  if (joke.type === 'single' && joke.joke) {
    return joke.joke;
  }

  if (joke.type === 'twopart' && joke.setup && joke.delivery) {
    return `${joke.setup}\n\n${joke.delivery}`;
  }

  return 'Could not format joke';
}

/**
 * Vraća sve dostupne kategorije
 */
export const JOKE_CATEGORIES = [
  'Any',
  'General',
  'Knock-knock',
  'Programming',
  'Spooky',
  'Christmas',
] as const;

/**
 * Validiraj filter pre slanja
 */
export function validateFilters(filters?: JokeFilters): boolean {
  if (!filters) return true;

  if (filters.category && !['general', 'knock-knock', 'programming', 'spooky', 'christmas'].includes(filters.category)) {
    return false;
  }

  if (filters.type && !['single', 'twopart'].includes(filters.type)) {
    return false;
  }

  return true;
}
