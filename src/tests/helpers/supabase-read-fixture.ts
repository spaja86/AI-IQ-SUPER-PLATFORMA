import assert from 'node:assert/strict';
import { mock } from 'node:test';
import { resetSupabaseServerPoolState } from '../../lib/supabase/server';

/** Exercise the real SDK/query builder against an empty, offline database fixture. */
export async function withEmptySupabase<T>(run: () => Promise<T>): Promise<T> {
  const keys = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'] as const;
  const previous = keys.map(key => process.env[key]);
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://supabase.invalid';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-only-offline-service-key';
  resetSupabaseServerPoolState();
  const requests: string[] = [];
  const unexpected: string[] = [];
  const fetchMock = mock.method(globalThis, 'fetch', async (input: RequestInfo | URL, init?: RequestInit) => {
    const request = new Request(input, init);
    const url = new URL(request.url);
    if (url.origin !== 'http://supabase.invalid' || !url.pathname.startsWith('/rest/v1/') || !['GET', 'HEAD'].includes(request.method)) {
      unexpected.push(`${request.method} ${url.origin}${url.pathname}`);
      throw new Error('Unexpected network call in offline fixture');
    }
    requests.push(url.pathname);
    return new Response(request.method === 'HEAD' ? null : '[]', {
      status: 200, headers: { 'content-type': 'application/json', 'content-range': '*/0' },
    });
  });
  try {
    const result = await run();
    assert.deepEqual(unexpected, []);
    assert.ok(requests.length > 0, 'handler must exercise the database client');
    return result;
  } finally {
    fetchMock.mock.restore();
    resetSupabaseServerPoolState();
    keys.forEach((key, index) => { if (previous[index] === undefined) delete process.env[key]; else process.env[key] = previous[index]; });
  }
}
