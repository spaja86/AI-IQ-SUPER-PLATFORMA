import { NextRequest } from 'next/server';
import { getRandomJoke, validateFilters, type JokeFilters } from '@/lib/jokes/joke-api';
import { apiSuccess, apiError } from '@/lib/api/response';
import { logger } from '@/lib/logger';

/**
 * GET /api/jokes/random
 * Vraća random šalu sa filtrima
 *
 * Query params:
 *  - category: general | knock-knock | programming | spooky | christmas
 *  - type: single | twopart
 *  - safe: true | false
 *
 * @example
 *  GET /api/jokes/random?category=programming&type=single&safe=true
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);

    // Parse filters
    const filters: JokeFilters = {
      category: (url.searchParams.get('category') as any) || undefined,
      type: (url.searchParams.get('type') as any) || undefined,
      safe: url.searchParams.get('safe') === 'true' ? true : url.searchParams.get('safe') === 'false' ? false : undefined,
    };

    // Validiraj filtere
    if (!validateFilters(filters)) {
      return apiError('BAD_REQUEST', 'Invalid filter parameters');
    }

    logger.info('jokes', 'Fetching random joke', { filters });

    // Dohvati šalu
    const joke = await getRandomJoke(filters);

    if (!joke) {
      return apiError('INTERNAL_SERVER_ERROR', 'Failed to fetch joke from external API');
    }

    logger.info('jokes', 'Joke fetched successfully', { jokeId: joke.id });

    return apiSuccess({
      joke,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('jokes', 'Error in random joke endpoint', error);
    return apiError('INTERNAL_SERVER_ERROR', 'Failed to fetch joke');
  }
}

/**
 * POST /api/jokes/random
 * Vraća više šala
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      count?: number;
      filters?: JokeFilters;
    };

    const count = Math.min(body.count || 1, 10); // Max 10 jokes
    const filters = body.filters;

    if (!validateFilters(filters)) {
      return apiError('BAD_REQUEST', 'Invalid filter parameters');
    }

    logger.info('jokes', 'Fetching multiple jokes', { count, filters });

    // Dohvati više šala
    const jokes = [];
    for (let i = 0; i < count; i++) {
      const joke = await getRandomJoke(filters);
      if (joke) {
        jokes.push(joke);
        // Pauza da ne zbunimo API
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    logger.info('jokes', 'Multiple jokes fetched', { count: jokes.length });

    return apiSuccess({
      jokes,
      count: jokes.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('jokes', 'Error in multiple jokes endpoint', error);
    return apiError('INTERNAL_SERVER_ERROR', 'Failed to fetch jokes');
  }
}
