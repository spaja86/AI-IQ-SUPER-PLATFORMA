// Autofinish #821 — /api/autofinish-health-stream
// Server-Sent Events endpoint za real-time zdravlje podsistema
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { pokreniAutofinishPetlju } from '@/lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';

// Interval slanja SSE poruka (ms)
const STREAM_INTERVAL_MS = 5_000;
// Maksimalni broj događaja pre zatvaranja konekcije
const MAX_EVENTS = 12; // 60 sekundi

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  // Rate limit: max 5 SSE konekcija u 60s po IP
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/autofinish-health-stream'), 5, 60);
  if (!allowed) {
    return new Response(
      JSON.stringify({ error: 'Too Many Requests', verzija: APP_VERSION }),
      { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '60' } },
    );
  }

  const encoder = new TextEncoder();

  function buildEvent(eventType: string, data: unknown): Uint8Array {
    return encoder.encode(`event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`);
  }

  let interval: ReturnType<typeof setInterval> | undefined;
  let abort: (() => void) | undefined;
  const cleanup = () => {
    if (interval !== undefined) clearInterval(interval);
    if (abort) req.signal.removeEventListener('abort', abort);
  };
  const stream = new ReadableStream({
    start(controller) {
      let count = 0;
      let closed = false;
      const close = () => {
        if (closed) return;
        closed = true;
        cleanup();
        controller.close();
      };

      const sendHealth = () => {
        if (count >= MAX_EVENTS) {
          const closeData = {
            tip: 'close',
            poruka: 'Maksimalni broj događaja dostignut. Uspostavite novu konekciju.',
            verzija: APP_VERSION,
            autofinishIteracija: AUTOFINISH_COUNT,
            timestamp: new Date().toISOString(),
          };
          controller.enqueue(buildEvent('close', closeData));
          close();
          return;
        }

        count++;
        const izvestaj = pokreniAutofinishPetlju(1);

        const payload = {
          tip: 'zdravlje',
          iteracija: count,
          status: izvestaj.status,
          ukupniProgres: izvestaj.ukupniProgres,
          podsistemiNa100: `${izvestaj.podsistemiNa100}/${izvestaj.ukupnoPodsistema}`,
          podsistemi: izvestaj.podsistemi.map((p) => ({
            id: p.id,
            naziv: p.naziv,
            ikona: p.ikona,
            progres: p.progres,
            status: p.status,
          })),
          verzija: APP_VERSION,
          autofinishIteracija: AUTOFINISH_COUNT,
          timestamp: new Date().toISOString(),
        };

        controller.enqueue(buildEvent('zdravlje', payload));
      };

      abort = close;
      req.signal.addEventListener('abort', abort, { once: true });
      if (req.signal.aborted) { close(); return; }
      sendHealth();
      interval = setInterval(() => {
        try { sendHealth(); } catch { close(); }
      }, STREAM_INTERVAL_MS);
    },
    cancel() { cleanup(); },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
      'X-App-Version': APP_VERSION,
      'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
    },
  });
}
