import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { PILOT_EXAMPLE, PILOT_LIMITS } from './plan';
import { PilotStore } from './store';
import { tick } from './worker';
import { OMEGA_SKELETON } from './omega';

export async function startPilot(options: { database: string; port: number; assets: string; intervalMs?: number }) {
  if (!Number.isInteger(options.port) || options.port < 0 || options.port > 65535) throw new Error('Neispravan port.');
  const assets = new Map([
    ['/', { content: readFileSync(resolve(options.assets, 'index.html')), type: 'text/html; charset=utf-8' }],
    ['/pilot.js', { content: readFileSync(resolve(options.assets, 'pilot.js')), type: 'text/javascript; charset=utf-8' }],
    ['/pilot.css', { content: readFileSync(resolve(options.assets, 'pilot.css')), type: 'text/css; charset=utf-8' }],
    ['/omega', { content: readFileSync(resolve(options.assets, 'omega.html')), type: 'text/html; charset=utf-8' }],
    ['/omega.css', { content: readFileSync(resolve(options.assets, 'omega.css')), type: 'text/css; charset=utf-8' }],
    ['/omega.js', { content: readFileSync(resolve(options.assets, 'omega.js')), type: 'text/javascript; charset=utf-8' }],
  ]);
  const store = new PilotStore(options.database);
  let origin = '', busy = false, workerError = '', closing = false;
  const json = (res: ServerResponse, status: number, value: unknown) => { res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(value)); };
  async function readBody(req: IncomingMessage): Promise<unknown> {
    if (!req.headers['content-type']?.startsWith('application/json')) throw new Error('Potreban je application/json.');
    const chunks: Buffer[] = []; let bytes = 0;
    for await (const chunk of req) {
      bytes += chunk.length;
      if (bytes > PILOT_LIMITS.bodyBytes) throw new Error('Zahtev prelazi 64 KiB.');
      chunks.push(chunk);
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  }
  const server = createServer(async (req, res) => {
    res.setHeader('cache-control', 'no-store');
    res.setHeader('x-content-type-options', 'nosniff');
    res.setHeader('x-frame-options', 'DENY');
    res.setHeader('referrer-policy', 'no-referrer');
    res.setHeader('content-security-policy', "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'");
    // Explicit loopback host + origin + custom API header prevent browser DNS-rebinding/CSRF.
    // This is local-machine access, not multi-user authentication.
    if (req.headers.host !== new URL(origin).host || (req.headers.origin && req.headers.origin !== origin) || (req.headers['sec-fetch-site'] && !['same-origin', 'none'].includes(String(req.headers['sec-fetch-site'])))) {
      json(res, 403, { error: 'Dozvoljen je samo lokalni interfejs ovog pilota.' }); return;
    }
    const path = req.url ?? '';
    const asset = assets.get(path);
    if (req.method === 'GET' && asset) { res.writeHead(200, { 'content-type': asset.type }); res.end(asset.content); return; }
    if (req.headers['x-suoc-pilot'] !== '1') { json(res, 403, { error: 'Nedostaje lokalno API zaglavlje.' }); return; }
    try {
      if (req.method === 'GET' && path === '/api/status') {
        json(res, workerError ? 503 : 200, { scope: 'local-single-operator', worker: workerError ? 'blocked' : 'ready', error: workerError || undefined }); return;
      }
      if (req.method === 'GET' && path === '/api/example') { json(res, 200, PILOT_EXAMPLE); return; }
      if (req.method === 'GET' && path === '/api/omega') { json(res, 200, OMEGA_SKELETON); return; }
      if (req.method === 'GET' && path === '/api/runs') { json(res, 200, store.list().map(run => ({ id: run.id, name: run.name, status: run.status, updatedAt: run.updatedAt }))); return; }
      if (req.method === 'POST' && path === '/api/runs') { json(res, 201, store.create(await readBody(req))); return; }
      const match = /^\/api\/runs\/([a-f0-9-]{36})(?:\/(pause|resume|cancel|retry))?$/.exec(path);
      if (match && req.method === 'GET' && !match[2]) { json(res, 200, { run: store.get(match[1]), events: store.events(match[1]) }); return; }
      if (match && req.method === 'POST' && match[2]) {
        if (busy || workerError) { json(res, 409, { error: workerError || 'Sačekajte završetak trenutnog koraka.' }); return; }
        json(res, 200, store.control(match[1], match[2] as 'pause' | 'resume' | 'cancel' | 'retry')); return;
      }
      json(res, 404, { error: 'Putanja nije pronađena.' });
    } catch (e) {
      json(res, 400, { error: e instanceof Error ? e.message : 'Zahtev nije uspeo.' });
    }
  });
  server.requestTimeout = 10000;
  server.headersTimeout = 5000;
  try {
    await new Promise<void>((accept, reject) => { server.once('error', reject); server.listen(options.port, '127.0.0.1', () => { server.off('error', reject); accept(); }); });
  } catch (error) { store.close(); throw error; }
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Lokalni server nema adresu.');
  origin = `http://127.0.0.1:${address.port}`;
  const timer = setInterval(async () => {
    if (busy || workerError || closing) return;
    busy = true;
    try { await tick(store); }
    catch (e) { workerError = e instanceof Error ? e.message : 'Radnik je blokiran.'; }
    finally { busy = false; }
  }, options.intervalMs ?? 150);
  return {
    origin,
    async close() {
      closing = true; clearInterval(timer);
      await new Promise<void>((accept, reject) => { server.close(error => error ? reject(error) : accept()); server.closeIdleConnections(); });
      while (busy) await new Promise<void>(accept => setImmediate(accept));
      store.close();
    },
  };
}
