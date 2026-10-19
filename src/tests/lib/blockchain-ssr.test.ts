import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import { createConfig, http } from 'wagmi';
import { polygon, polygonAmoy } from 'wagmi/chains';

// Run the actual configuration in isolated environments. Connector doubles expose
// eager setup without opening wallets, databases, relays or RPC connections.
const source = readFileSync(new URL('../../lib/blockchain/config.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;

function loadConfig(globals: Record<string, unknown>, env: Record<string, string> = {}) {
  const calls: string[] = [];
  const walletOptions: unknown[] = [];
  const connector = (id: string) => () => ({
    id, name: id, type: id,
    setup() { calls.push(`${id}:setup`); },
  });
  const exports: { wagmiConfig?: ReturnType<typeof createConfig> } = {};
  runInNewContext(compiled, {
    ...globals, exports, process: { env },
    require(id: string) {
      if (id === 'wagmi') return { createConfig, http };
      if (id === 'wagmi/chains') return { polygon, polygonAmoy };
      if (id === 'wagmi/connectors') return {
        injected: () => connector('injected'),
        walletConnect: (options: unknown) => {
          calls.push('walletConnect:factory');
          walletOptions.push(options);
          return connector('walletConnect');
        },
      };
      throw new Error(`Unexpected import: ${id}`);
    },
  });
  assert.ok(exports.wagmiConfig);
  return { config: exports.wagmiConfig, calls, walletOptions };
}

test('SSR never creates or sets up WalletConnect, even with a configured project ID', () => {
  const { config, calls } = loadConfig({}, { NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: 'test-project' });
  assert.deepEqual(config.connectors.map(c => c.id), ['injected']);
  assert.deepEqual(calls, ['injected:setup']);
  assert.equal(config._internal.ssr, true);
  assert.deepEqual(Array.from(config.chains, c => c.id), [137, 80002]);
});

test('IndexedDB alone does not turn a server or worker into a browser', () => {
  const { calls } = loadConfig({ indexedDB: { open() { throw new Error('Unexpected database open'); } } });
  assert.deepEqual(calls, ['injected:setup']);
});

test('browser without IndexedDB retains injected wallet support', () => {
  const { config, calls } = loadConfig({ window: {} });
  assert.deepEqual(config.connectors.map(c => c.id), ['injected']);
  assert.deepEqual(calls, ['injected:setup']);
});

test('supported browser retains WalletConnect setup and the supplied project ID', () => {
  const { config, calls, walletOptions } = loadConfig({
    window: {}, indexedDB: { open() { throw new Error('Configuration must not open a database itself'); } },
  }, { NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: 'test-project' });
  assert.deepEqual(config.connectors.map(c => c.id), ['injected', 'walletConnect']);
  assert.deepEqual(calls, ['walletConnect:factory', 'injected:setup', 'walletConnect:setup']);
  assert.equal((walletOptions[0] as { projectId: string }).projectId, 'test-project');
});
