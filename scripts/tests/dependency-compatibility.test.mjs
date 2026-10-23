import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { once } from 'node:events';

const require = createRequire(new URL('../../package.json', import.meta.url));

test('wallet and blockchain WebSocket clients retain local transport compatibility', async (t) => {
  const { WebSocketServer } = require('ws');
  const server = new WebSocketServer({ host: '127.0.0.1', port: 0 });
  const clients = new Set();
  t.after(async () => {
    for (const client of clients) client.terminate();
    for (const client of server.clients) client.terminate();
    await new Promise((resolve) => server.close(resolve));
  });
  server.on('connection', (socket) => socket.on('message', (message) => socket.send(message)));
  await once(server, 'listening');
  for (const consumer of ['viem', 'ethers', 'engine.io-client', '@walletconnect/jsonrpc-ws-connection']) {
    await t.test(consumer, { timeout: 5000 }, async () => {
      const consumerRequire = createRequire(require.resolve(consumer));
      const WebSocket = consumerRequire('ws');
      const client = new WebSocket(`ws://127.0.0.1:${server.address().port}`);
      clients.add(client);
      await once(client, 'open');
      const response = once(client, 'message');
      client.send('SPAJA transport probe');
      const [message] = await response;
      assert.equal(message.toString(), 'SPAJA transport probe');
      const closed = once(client, 'close');
      client.close(1000);
      assert.equal((await closed)[0], 1000);
      clients.delete(client);
    });
  }
});

test('Ignition lodash-es retains sorting, cloning and template behavior', async () => {
  const ignitionRequire = createRequire(require.resolve('@nomicfoundation/ignition-core'));
  const lodash = await import(pathToFileURL(ignitionRequire.resolve('lodash-es')).href);
  const source = [{ id: 'b', nested: { value: 2 } }, { id: 'a', nested: { value: 1 } }];
  const cloned = lodash.cloneDeep(source);
  cloned[0].nested.value = 3;
  assert.equal(source[0].nested.value, 2);
  assert.deepEqual(lodash.sortBy(source, 'id').map((item) => item.id), ['a', 'b']);
  assert.deepEqual(lodash.fromPairs([['project', 'SPAJA']]), { project: 'SPAJA' });
  assert.equal(lodash.template('<%= project %>')({ project: 'SPAJA' }), 'SPAJA');
});

test('Mocha serializer rejects the array-like CPU exhaustion pattern in a bounded child', () => {
  const mochaRequire = createRequire(require.resolve('mocha'));
  const serializerPath = mochaRequire.resolve('serialize-javascript');
  const script = `
    const assert = require('node:assert/strict');
    const serialize = require(process.argv[1]);
    const input = Object.create(Array.prototype);
    input.length = 1000000000;
    const result = serialize(input);
    assert.equal(result, '{"length":1000000000}');
    const escaped = serialize({ html: '</script><script>alert(1)</script>' });
    assert.ok(!escaped.includes('</script>'));
  `;
  const result = spawnSync(process.execPath, ['-e', script, serializerPath], { timeout: 5000, encoding: 'utf8' });
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
});

test('Mocha parallel workers serialize and execute ordinary test options', () => {
  const dir = mkdtempSync(join(tmpdir(), 'spaja-mocha-compat-'));
  try {
    for (const index of [1, 2]) {
      writeFileSync(join(dir, `fixture-${index}.cjs`), `const assert = require('node:assert/strict');\ndescribe('worker ${index}', () => { it('runs', () => assert.equal(2 + 2, 4)); });\n`);
    }
    const cli = require.resolve('mocha/bin/mocha.js');
    const result = spawnSync(process.execPath, [cli, '--no-config', '--no-package', '--parallel', '--jobs', '2', '--reporter', 'json', join(dir, 'fixture-1.cjs'), join(dir, 'fixture-2.cjs')], { timeout: 15000, encoding: 'utf8' });
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr || result.stdout);
    const report = JSON.parse(result.stdout);
    assert.equal(report.stats.tests, 2);
    assert.equal(report.stats.passes, 2);
    assert.equal(report.stats.failures, 0);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
