import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { checkSourceContracts, sourceContracts } from '../predeploy-source-contracts.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const original = path => readFileSync(join(root, path), 'utf8');
function check(overrides = {}) {
  return checkSourceContracts(root, path => {
    if (Object.hasOwn(overrides, path)) {
      if (overrides[path] === null) throw Object.assign(new Error('missing fixture'), { code: 'ENOENT' });
      return overrides[path];
    }
    return original(path);
  });
}
function replace(source, from, to) {
  assert.ok(source.includes(from), `mutation target absent: ${from}`);
  return source.replaceAll(from, to);
}
function gate(t, report, args = []) {
  const cwd = mkdtempSync(join(tmpdir(), 'predeploy-gate-'));
  t.after(() => rmSync(cwd, { force: true, recursive: true }));
  const filename = join(cwd, 'report.txt');
  writeFileSync(filename, '=== Predeploy Check ===\n' + JSON.stringify({ mode: 'full', ...report }));
  return spawnSync(process.execPath, [join(root, 'scripts/ci/check-predeploy-contracts.mjs'), filename, ...args], { encoding: 'utf8' });
}

test('all source contracts pass without reading a sitemap or executing application code', async t => {
  const report = await checkSourceContracts(root, path => {
    assert.notEqual(path, 'src/app/sitemap.ts');
    assert.match(path, /^src\/(lib\/.*\.ts|app\/api\/.*\/route\.ts)$/);
    return original(path);
  });
  assert.equal(Object.keys(report).length, 7);
  for (const result of Object.values(report)) {
    assert.equal(result.contractReady, true, JSON.stringify(result));
    assert.equal(result.validation, 'source-only');
    assert.deepEqual(result.failures, []);
  }
  assert.equal(gate(t, report).status, 0);
});

for (const spec of sourceContracts.filter(spec => spec.blocker !== false)) {
  const lib = `src/lib/${spec.slug}.ts`;
  const route = `src/app/api/${spec.additionalRoute?.slug ?? spec.slug}/route.ts`;
  const routeSource = original(route);
  const libSource = original(lib);
  const mutations = {
    'missing route': { [route]: null },
    'empty route': { [route]: '' },
    'nonexported GET': { [route]: replace(routeSource, 'export async function GET', 'async function GET') },
    'wrong HTTP method': { [route]: replace(routeSource, 'export async function GET', 'export async function POST') },
    'comments cannot impersonate a route': { [route]: `/* ${routeSource.replaceAll('*/', '')} */` },
    'unparseable route': { [route]: routeSource + '\nexport function BROKEN( {' },
    'wrong contract header': { [route]: replace(routeSource, `X-${spec.header}-Contract-Version`, 'X-Unrelated-Contract-Version') },
    'missing model header': { [route]: replace(routeSource, `X-${spec.header}-Model-Version`, 'X-Unrelated-Model-Version') },
    'literal wrong version in header': { [route]: routeSource.replace(/(headers\.set\('X-[^']+-Contract-Version', )[^;]+;/g, "$1'v999');") },
    'wrong library import': { [route]: replace(routeSource, `from '@/lib/${spec.slug}'`, "from '@/lib/unrelated'") },
    'missing library': { [lib]: null },
    'wrong source of truth': { [lib]: replace(libSource, `/api/${spec.slug}`, '/api/absent') },
    'missing contract version export': { [lib]: replace(libSource, `export const ${spec.prefix}_CONTRACT_VERSION`, `const ${spec.prefix}_CONTRACT_VERSION`) },
    'invalid model version': { [lib]: libSource.replace(new RegExp(`(export const ${spec.prefix}_MODEL_VERSION = )'[^']+'`), "$1'unknown'") },
    'wrong metadata version binding': { [lib]: replace(libSource, `contractVersion: ${spec.prefix}_CONTRACT_VERSION,`, "contractVersion: 'v999',") },
    'navigation comment is insufficient': { 'src/lib/navigation.ts': `// href: '/${spec.slug}'\nexport const navigation = [];` },
  };
  for (const [name, overrides] of Object.entries(mutations)) {
    test(`${spec.key}: ${name} is blocked`, async () => {
      const result = (await check(overrides))[spec.key];
      assert.equal(result.contractReady, false, JSON.stringify(result));
      assert.ok(result.failures.length > 0);
    });
  }
  test(`${spec.key}: missing route fails the unchanged CI wrapper`, async t => {
    const result = gate(t, await check({ [route]: null }));
    assert.equal(result.status, 1);
    assert.match(result.stderr, new RegExp(spec.key));
  });
  test(`${spec.key}: malformed contract fails the unchanged CI wrapper`, async t => {
    const result = gate(t, await check(mutations['wrong source of truth']));
    assert.equal(result.status, 1);
    assert.match(result.stderr, new RegExp(spec.key));
  });
  test(`${spec.key}: quote style and whitespace do not change the contract`, async () => {
    const restyle = source => source.replace(/'([A-Za-z0-9@_./:-]+)'/g, (_match, value) => JSON.stringify(value))
      .replaceAll('.headers.set(', '.headers.set(\n  ');
    const result = (await check({ [route]: restyle(routeSource), [lib]: restyle(libSource) }))[spec.key];
    assert.equal(result.contractReady, true, JSON.stringify(result));
  });
}

test('canonical procesuiranje-svega is required even when extreme route exists', async () => {
  const result = (await check({ 'src/app/api/procesuiranje-svega/route.ts': null })).ekstremnoProcesuiranjeSvega;
  assert.equal(result.contractReady, false);
  assert.ok(result.failures.some(value => value.includes('cannot read src/app/api/procesuiranje-svega/route.ts')));
});
test('an uncalled header helper cannot satisfy the extreme contract', async () => {
  const path = 'src/app/api/ekstremno-procesuiranje-svega/route.ts';
  const source = replace(original(path), '    applyEkstremnoContractHeaders(', '    unrelated(');
  assert.equal((await check({ [path]: source })).ekstremnoProcesuiranjeSvega.contractReady, false);
});
test('missing navigation fails closed with structured diagnostics', async () => {
  const result = await check({ 'src/lib/navigation.ts': null });
  assert.ok(Object.values(result).every(value => value.contractReady === false && value.failures.length > 0));
});
test('maksimus2 and maksimus3 remain warning-only when absent', async t => {
  const result = await check({ 'src/app/api/maksimus-2/route.ts': null, 'src/app/api/maksimus-3/route.ts': null });
  for (const name of ['maksimus2', 'maksimus3']) {
    assert.equal(result[name].blocker, false);
    assert.equal(result[name].contractReady, false);
  }
  assert.equal(gate(t, result).status, 0);
});
test('full CLI report is accepted while strict mode still rejects missing production configuration', () => {
  const env = { ...process.env };
  for (const key of ['OMEGA_JWT_SECRET', 'CRON_SECRET', 'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY', 'OPENAI_API_KEY', 'STRIPE_SECRET_KEY']) delete env[key];
  for (const args of [[], ['--strict'], ['--fast'], ['--fast', '--strict']]) {
    const result = spawnSync(process.execPath, ['scripts/predeploy-check.mjs', ...args], { cwd: root, env, encoding: 'utf8' });
    assert.equal(result.status, args.includes('--strict') ? 1 : 0, result.stderr);
    const report = JSON.parse(result.stdout.slice(result.stdout.indexOf('{')));
    assert.equal(report.status, 'warning');
    assert.equal(report.missingRequiredEnv.length, 7);
    if (!args.includes('--fast')) assert.equal(report.analizaSvega.contractReady, true);
  }
});
