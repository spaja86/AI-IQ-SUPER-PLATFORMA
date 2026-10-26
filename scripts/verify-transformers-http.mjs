#!/usr/bin/env node
// Opt-in local production HTTP check. Does not run a build, CI, browser or deployment.
import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import http from 'node:http';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

process.env.NODE_ENV = 'production';
process.env.NEXT_TELEMETRY_DISABLED = '1';
const root = resolve(fileURLToPath(new URL('../', import.meta.url)));
const require = createRequire(new URL('../package.json', import.meta.url));
const port = Number(process.env.TRANSFORMERS_QA_PORT ?? 3134);
assert.ok(Number.isInteger(port) && port >= 1024 && port <= 65535, 'Invalid TRANSFORMERS_QA_PORT');
await access(new URL('../.next/BUILD_ID', import.meta.url)).catch(() => {
  throw new Error('Production build missing. Run npm run build before this check.');
});

function readPage(path, timeoutMs) {
  return new Promise((resolve, reject) => {
    let settled = false;
    let body = '';
    let bytes = 0;
    const finish = (error, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (error) reject(error); else resolve(value);
    };
    const request = http.get({ hostname: '127.0.0.1', port, path, agent: false }, response => {
      response.on('data', chunk => {
        bytes += chunk.length;
        if (bytes > 2_000_000) {
          finish(new Error(`Response exceeds 2 MB: ${path}`));
          request.destroy();
          return;
        }
        body += chunk.toString('utf8');
      });
      response.on('end', () => finish(null, { path, status: response.statusCode, body, bytes,
        scriptPolicy: response.headers['content-security-policy'] ?? null }));
      response.on('error', error => finish(error));
      response.on('aborted', () => finish(new Error(`Response aborted: ${path}`)));
    });
    const timer = setTimeout(() => {
      finish(new Error(`HTTP deadline: ${path}`));
      request.destroy();
    }, timeoutMs);
    request.on('error', error => finish(error));
  });
}

let app;
let server;

async function withinDeadline(work, timeoutMs) {
  let timer;
  try {
    return await Promise.race([work, new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error('Next preparation deadline exceeded')), Math.max(1, timeoutMs));
    })]);
  } finally { clearTimeout(timer); }
}

async function stopServer() {
  const forceExit = setTimeout(() => process.exit(process.exitCode ?? 0), 3000).unref();
  try {
    server?.closeAllConnections();
    if (server?.listening) await new Promise(resolve => server.close(resolve));
    await app?.close();
  } finally { clearTimeout(forceExit); }
}
const interrupted = () => { process.exitCode = 130; void stopServer().finally(() => process.exit(130)); };
process.once('SIGINT', interrupted);
process.once('SIGTERM', interrupted);

try {
  const began = Date.now();
  const preparationDeadline = began + 300_000;
  // Use the documented Next API and await preparation. This does not validate next start.
  console.error('Preparing the existing production build with the Next API');
  const next = require('next');
  app = next({ dev: false, dir: root, hostname: '127.0.0.1', port });
  await withinDeadline(app.prepare(), preparationDeadline - Date.now());
  const handle = app.getRequestHandler();
  server = http.createServer((request, response) => {
    void handle(request, response).catch(error => {
      console.error(error.message);
      response.statusCode = 500;
      response.end('Request handler failed');
    });
  });
  await withinDeadline(new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', resolve);
  }), preparationDeadline - Date.now());
  const preparationMs = Date.now() - began;
  assert.ok(Date.now() <= preparationDeadline, 'Next preparation exceeded five minutes');
  console.error(`Next prepared in ${preparationMs} ms; checking application routes`);
  const direct = await readPage('/transformers', 20_000);
  assert.equal(direct.status, 200);
  assert.ok(direct.body.includes('SPREMAN ZA DUEL?'), 'Direct route must render the ready screen');
  const select = direct.body.match(/<select\b[^>]*aria-label="Pogled kamere"[^>]*>([\s\S]*?)<\/select>/);
  assert.ok(select, 'Camera selector missing');
  const options = [...select[1].matchAll(/<option\b([^>]*)>/g)].map(match => match[1]);
  assert.equal(options.length, 23);
  const enabled = options.filter(attributes => !/\bdisabled(?:\s|=|$)/.test(attributes));
  assert.deepEqual(enabled.map(attributes => attributes.match(/\bvalue="(\d+)"/)[1]), ['1', '2', '3', '4']);

  const native = await readPage('/spaja-digitalni-brouvzer?igricaId=igrica-transformers-1350', 20_000);
  assert.equal(native.status, 200);
  assert.ok(native.body.includes('TRANSFORMERS 1350'), 'Brouvzer must select the TRANSFORMERS tab');
  assert.ok(native.body.includes('igrica-transformers-1350'), 'Native game identity missing');
  console.log(JSON.stringify({ mode: 'prepared-next-api', preparationMs, elapsedMs: Date.now() - began,
    direct: { status: direct.status, bytes: direct.bytes, cameraOptions: 23, enabled: [1, 2, 3, 4] },
    brouvzer: { status: native.status, bytes: native.bytes, game: 'igrica-transformers-1350' },
    scriptPolicy: native.scriptPolicy,
    scope: 'HTTP and server-rendered content only; next start, client interactions and mobile are unverified',
  }, null, 2));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  process.removeListener('SIGINT', interrupted);
  process.removeListener('SIGTERM', interrupted);
  await stopServer();
}
