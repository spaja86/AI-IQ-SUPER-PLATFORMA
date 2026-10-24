import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer, request } from 'node:http';
import { createHash } from 'node:crypto';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { createNetworkConfig, publicDomain, main } from './network.mjs';

for (const domain of ['spaja.nivo*spaja', 'spaja.nivo-spaja', '*.spaja.rs', 'https://spaja.rs', 'spaja.rs/path', 'spaja.rs:443', '127.0.0.1', 'spaja.localhost', 'spaja.local', 'spaja.internal', 'spaja..rs', '-spaja.rs', 'spaja.rs\n{', 'SPAJA.rs', 'spaja.rs.', 'x'.repeat(64) + '.rs']) {
  test(`reject unsafe or non-public hostname: ${JSON.stringify(domain)}`, () => assert.throws(() => publicDomain(domain)));
}
test('accepts a syntactically valid host without claiming domain ownership', () => assert.equal(publicDomain('network.example.net'), 'network.example.net'));
test('local configuration binds only loopback and does not issue certificates', () => {
  const result = createNetworkConfig();
  assert.equal(result.manifest.mode, 'local');
  assert.equal(result.manifest.publicDnsVerified, false);
  assert.equal(result.manifest.upstreamAvailabilityVerified, false);
  assert.match(result.caddyfile, /auto_https off/);
  assert.equal(result.caddyfile.match(/bind 127.0.0.1/g)?.length, 4);
});
test('public configuration defaults to maintenance with no proxy upstreams', () => {
  const result = createNetworkConfig({ mode: 'public', domain: 'network.example.net' });
  assert.equal(result.manifest.applicationTraffic, 'maintenance');
  assert.doesNotMatch(result.caddyfile, /reverse_proxy|auto_https off/);
  assert.equal(result.manifest.dns.length, 3);
  assert.ok(result.manifest.dns.every(record => record.value === 'SERVER_PUBLIC_IPV4_REQUIRED'));
});
test('public application routing requires explicit serveApps boolean', () => {
  assert.throws(() => createNetworkConfig({ mode: 'public', domain: 'network.example.net', serveApps: 'true' }));
  const result = createNetworkConfig({ mode: 'public', domain: 'network.example.net', serveApps: true });
  assert.match(result.caddyfile, /strict_sni_host on/);
  assert.equal(result.caddyfile.match(/reverse_proxy 127.0.0.1:/g)?.length, 3);
});
test('rejects malformed ports and loops into the gateway or its admin API', () => {
  for (const platformPort of [0, 80, 8080, 2019, 65536, 3.5, NaN, '3000\nrespond 200']) assert.throws(() => createNetworkConfig({ platformPort }));
});
test('generator refuses to overwrite an existing directory', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'spaja-network-cli-'));
  try {
    await writeFile(join(directory, 'Caddyfile'), 'existing');
    await assert.rejects(main(['local', '--out', directory]), /EEXIST/);
    assert.equal(await readFile(join(directory, 'Caddyfile'), 'utf8'), 'existing');
  } finally { await rm(directory, { recursive: true }); }
});

const binary = process.env.CADDY_BIN;
const listen = server => new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve(server.address().port)));
const close = server => new Promise(resolve => { server.closeAllConnections(); server.close(resolve); });

test('real Caddy proxy integration', { skip: !binary && 'Set CADDY_BIN to run real proxy checks', timeout: 30000 }, async t => {
  const directory = await mkdtemp(join(tmpdir(), 'spaja-network-integration-'));
  let releaseStream;
  let resolveAbort;
  const upgradedSockets = new Set();
  const abortSeen = new Promise(resolve => { resolveAbort = resolve; });
  const backends = ['platform', 'deploy', 'super'].map(id => createServer(async (req, res) => {
    if (req.url === '/stream') {
      res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' });
      res.flushHeaders(); res.write('data: first\n\n');
      releaseStream = () => res.end('data: last\n\n');
      return;
    }
    if (req.url === '/abort') {
      res.writeHead(200, { 'Content-Type': 'text/event-stream' });
      res.write('data: ready\n\n');
      res.on('close', resolveAbort);
      return;
    }
    let bytes = 0;
    try { for await (const chunk of req) bytes += chunk.length; }
    catch { return; }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ id, path: req.url, method: req.method, bytes, headers: req.headers }));
  }));
  backends[0].on('upgrade', (req, socket) => {
    upgradedSockets.add(socket);
    socket.on('close', () => upgradedSockets.delete(socket));
    const accept = createHash('sha1').update(req.headers['sec-websocket-key'] + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64');
    socket.write(`HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ${accept}\r\n\r\n`);
    socket.once('data', data => {
      const size = data[1] & 127;
      const mask = data.subarray(2, 6);
      const payload = data.subarray(6, 6 + size).map((byte, index) => byte ^ mask[index % 4]);
      socket.write(Buffer.concat([Buffer.from([0x81, payload.length]), payload]));
    });
    socket.on('error', () => {});
  });
  let processHandle;
  try {
    const ports = await Promise.all(backends.map(listen));
    const reservation = createServer();
    const listenPort = await listen(reservation);
    await close(reservation);
    const result = createNetworkConfig({ listenPort, platformPort: ports[0], deployPort: ports[1], superPort: ports[2] });
    const config = join(directory, 'Caddyfile');
    await writeFile(config, result.caddyfile);
    const environment = { ...process.env, HOME: directory, XDG_DATA_HOME: join(directory, 'data'), XDG_CONFIG_HOME: join(directory, 'config') };
    for (const [name, settings] of [['local', result], ['public-maintenance', createNetworkConfig({ mode: 'public', domain: 'network.example.net' })], ['public-active', createNetworkConfig({ mode: 'public', domain: 'network.example.net', serveApps: true })]]) {
      const file = join(directory, name + '.Caddyfile');
      await writeFile(file, settings.caddyfile);
      const validation = spawnSync(binary, ['validate', '--config', file, '--adapter', 'caddyfile'], { env: environment, encoding: 'utf8' });
      assert.equal(validation.status, 0, validation.stderr);
    }
    let logs = '';
    processHandle = spawn(binary, ['run', '--config', config, '--adapter', 'caddyfile'], { env: environment, stdio: ['ignore', 'ignore', 'pipe'] });
    processHandle.stderr.on('data', data => { logs = (logs + data).slice(-6000); });
    const call = (path, { host = 'spaja.localhost', method = 'GET', headers = {}, body } = {}) => new Promise((resolve, reject) => {
      const req = request({ host: '127.0.0.1', port: listenPort, method, path, headers: { Host: `${host}:${listenPort}`, ...headers } }, res => {
        const chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks).toString() }));
        res.on('error', reject);
      });
      req.on('error', reject); req.end(body);
    });
    let ready = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      try { ready = (await call('/_spaja/health')).status === 200; } catch { /* Starting the test process. */ }
      if (ready) break;
      if (processHandle.exitCode !== null) throw new Error(logs);
      await delay(30);
    }
    assert.ok(ready, logs);
    await t.test('routes all three hosts and preserves path/query/body', async () => {
      for (const [index, host] of ['spaja.localhost', 'deploy.spaja.localhost', 'super.spaja.localhost'].entries()) {
        const response = await call('/a/path?q=one%20two', { host, method: 'POST', body: 'hello' });
        assert.equal(response.status, 200);
        const result = JSON.parse(response.body);
        assert.equal(result.id, ['platform', 'deploy', 'super'][index]);
        assert.equal(result.path, '/a/path?q=one%20two'); assert.equal(result.bytes, 5);
      }
    });
    await t.test('preserves application credentials and replaces forged identity/forwarded headers', async () => {
      const response = await call('/headers', { headers: { Authorization: 'Bearer fixture-only', Cookie: 'fixture=only', Forwarded: 'for=evil', 'X-Forwarded-For': '1.2.3.4', 'X-Forwarded-Host': 'evil.example', 'X-Forwarded-Proto': 'https', 'X-Real-IP': '1.2.3.4', 'CF-Connecting-IP': '1.2.3.4', 'OAI-Authenticated-User-Email': 'forged@example.net', 'OAI-Sites-Authorization': 'forged', 'X-Auth-Request-User': 'forged', 'X-Request-Id': 'forged' } });
      const headers = JSON.parse(response.body).headers;
      assert.equal(headers.authorization, 'Bearer fixture-only'); assert.equal(headers.cookie, 'fixture=only');
      assert.equal(headers['x-forwarded-for'], '127.0.0.1'); assert.equal(headers['x-forwarded-host'], `spaja.localhost:${listenPort}`); assert.equal(headers['x-forwarded-proto'], 'http');
      for (const name of ['forwarded', 'x-real-ip', 'cf-connecting-ip', 'oai-authenticated-user-email', 'oai-sites-authorization', 'x-auth-request-user']) assert.equal(headers[name], undefined, name);
      assert.match(headers['x-request-id'], /^[0-9a-f-]{36}$/); assert.equal(headers['x-request-id'], response.headers['x-request-id']);
    });
    await t.test('unknown hosts and private files are rejected', async () => {
      assert.equal((await call('/', { host: 'evil.example' })).status, 421);
      assert.equal((await call('/.env.local')).status, 404);
      assert.equal((await call('/.git/config')).status, 404);
      assert.equal((await call('/', { method: 'TRACE' })).status, 405);
    });
    await t.test('health and service directory do not claim upstream readiness', async () => {
      assert.equal(JSON.parse((await call('/_spaja/health')).body).upstream, 'not-measured');
      const directory = JSON.parse((await call('/_spaja/network')).body);
      assert.equal(directory.networkName, 'spaja.nivo*spaja'); assert.equal(directory.services.length, 3);
      assert.doesNotMatch(JSON.stringify(directory), /127\.0\.0\.1/);
      const page = await call('/_spaja/');
      assert.equal(page.status, 200); assert.match(page.body, /SUPEROMEGATRAJEKTORIJUM/);
      assert.match(page.headers['content-security-policy'], /frame-ancestors 'none'/);
    });
    await t.test('SSE is delivered before upstream completion', async () => {
      await new Promise((resolve, reject) => {
        const req = request({ host: '127.0.0.1', port: listenPort, path: '/stream', headers: { Host: `spaja.localhost:${listenPort}` } }, res => {
          let text = '';
          res.on('data', chunk => { text += chunk; if (text.includes('first')) releaseStream(); });
          res.on('end', () => { try { assert.match(text, /first[\s\S]*last/); resolve(); } catch (e) { reject(e); } });
        });
        req.on('error', reject); req.end();
      });
    });
    await t.test('client cancellation closes upstream stream', async () => {
      const req = request({ host: '127.0.0.1', port: listenPort, path: '/abort', headers: { Host: `spaja.localhost:${listenPort}` } }, res => res.once('data', () => req.destroy()));
      req.on('error', () => {}); req.end();
      await Promise.race([abortSeen, delay(3000).then(() => { throw new Error('Upstream did not close after cancellation'); })]);
    });
    await t.test('WebSocket upgrade and bidirectional payload survive proxying', async () => {
      await new Promise((resolve, reject) => {
        const req = request({ host: '127.0.0.1', port: listenPort, path: '/ws', headers: { Host: `spaja.localhost:${listenPort}`, Connection: 'Upgrade', Upgrade: 'websocket', 'Sec-WebSocket-Version': '13', 'Sec-WebSocket-Key': 'dGhlIHNhbXBsZSBub25jZQ==' } });
        req.on('upgrade', (res, socket) => {
          assert.equal(res.statusCode, 101);
          socket.once('data', data => { try { assert.equal(data.subarray(2).toString(), 'hi'); resolve(); } catch (e) { reject(e); } finally { socket.destroy(); } });
          socket.on('error', reject);
          socket.write(Buffer.from([0x81, 0x82, 1, 2, 3, 4, 0x69, 0x6b]));
        });
        req.on('response', () => reject(new Error('WebSocket did not upgrade')));
        req.on('error', reject); req.end();
      });
    });
    await t.test('oversized body returns 413', async () => {
      const response = await call('/large', { method: 'POST', body: Buffer.alloc(8 * 1024 * 1024 + 1) });
      assert.equal(response.status, 413);
    });
    await t.test('offline backend returns 502 and edge health remains separate', async () => {
      await close(backends[2]);
      assert.equal((await call('/', { host: 'super.spaja.localhost' })).status, 502);
      assert.equal((await call('/_spaja/health', { host: 'super.spaja.localhost' })).status, 200);
    });
  } finally {
    if (processHandle && processHandle.exitCode === null) {
      processHandle.kill('SIGTERM');
      await Promise.race([new Promise(resolve => processHandle.once('exit', resolve)), delay(1000)]);
      if (processHandle.exitCode === null) processHandle.kill('SIGKILL');
    }
    for (const socket of upgradedSockets) socket.destroy();
    await Promise.all(backends.map(close));
    await rm(directory, { recursive: true, force: true });
  }
});
