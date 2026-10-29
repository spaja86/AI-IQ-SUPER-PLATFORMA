import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const dir = new URL('./', import.meta.url);
export async function startServer(port = 4320) {
  // Deliberate fixed file allowlist; no filesystem path supplied by request.
  const files = new Map([
    ['/', [readFileSync(new URL('index.html', dir)), 'text/html; charset=utf-8']],
    ['/style.css', [readFileSync(new URL('style.css', dir)), 'text/css; charset=utf-8']],
    ['/ui.js', [readFileSync(new URL('dist/ui.js', dir)), 'text/javascript; charset=utf-8']],
  ]);
  let origin;
  const server = createServer((req, res) => {
    const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer', 'Content-Security-Policy': "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'", 'Permissions-Policy': 'camera=(), microphone=(), geolocation=()' };
    const reject = (code) => { res.writeHead(code, headers); res.end(); };
    if (req.headers.host !== new URL(origin).host || (req.headers.origin && req.headers.origin !== origin) || (req.headers['sec-fetch-site'] && !['same-origin', 'none'].includes(req.headers['sec-fetch-site']))) return reject(403);
    if (!['GET', 'HEAD'].includes(req.method)) return reject(405);
    const url = new URL(req.url, origin), file = files.get(url.pathname);
    if (!file) return reject(404);
    res.writeHead(200, { ...headers, 'Content-Type': file[1] }); res.end(req.method === 'HEAD' ? undefined : file[0]);
  });
  server.requestTimeout = 5000; server.headersTimeout = 5000; server.maxHeadersCount = 32;
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', resolve); });
  origin = `http://127.0.0.1:${server.address().port}`;
  return { origin, close: () => new Promise((resolve, reject) => server.close(e => e ? reject(e) : resolve())) };
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const app = await startServer(); console.log(`SPAJA probni sync: ${app.origin}`);
}
