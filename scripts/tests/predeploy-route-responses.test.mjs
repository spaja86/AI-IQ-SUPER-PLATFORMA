import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import { test } from 'node:test';
import ts from 'typescript';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
// Exercise actual route bodies with deterministic collaborators. Never load the
// application dependency graph, send alerts, access caches, or contact a service.
const cases = [
  ['analiza-svega', 'ANALIZA', 'Analiza', 'v2', '2.0.0', 'buildAnalizaSvega'],
  ['potencijal-svega-ovoga-do-sada', 'POTENCIJAL', 'Potencijal', 'v1', '1.0.0', 'buildPotencijalSvegaOvogaDoSada'],
  ['procesuiranje-svega', 'PROCESUIRANJE_SVEGA', 'Procesuiranje', 'v2', '2.1.0', 'buildProcesuiranjeSvega'],
  ['ekstremno-procesuiranje-svega', 'PROCESUIRANJE_SVEGA', 'Procesuiranje', 'v2', '2.1.0', 'buildEkstremnoProcesuiranjeSvega'],
  ['procesuiranje-3', 'PROCESUIRANJE_3', 'Procesuiranje3', 'v3', '3.0.0', 'buildProcesuiranje3'],
  ['maksimus-svega', 'MAKSIMUS_SVEGA', 'Maksimus', 'v1', '1.0.0', 'buildMaksimusSvega'],
];
function loadRoute(row, { failBuilder = false, allowed = true } = {}) {
  const [slug, prefix, , contractVersion, modelVersion, builder] = row;
  const canonical = slug === 'ekstremno-procesuiranje-svega' ? 'procesuiranje-svega' : slug;
  const payload = {
    marker: 'contract-fixture', domeni: {}, scheduler: { queueDepth: 0, fairnessIndex: 1 },
    meta: { contractVersion, modelVersion, sourceOfTruth: `/api/${canonical}`,
      degraded: false, degradedSources: [], auditSignal: 'fixture' },
  };
  const source = readFileSync(resolve(root, `src/app/api/${slug}/route.ts`), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const modules = {
    'next/server': { NextResponse: Response },
    '@/lib/api/response': {
      apiSuccess: (data, status) => Response.json({ success: true, data }, { status }),
      apiRateLimited: () => Response.json({ error: 'rate limited' }, { status: 429 }),
      apiInternalError: () => Response.json({ error: 'internal error' }, { status: 500 }),
    },
    '@/lib/rate-limit': { checkRateLimitGlobal: async () => allowed, rateLimitKey: () => 'fixture' },
    [`@/lib/${canonical}`]: {
      [`${prefix}_CONTRACT_VERSION`]: contractVersion,
      [`${prefix}_MODEL_VERSION`]: modelVersion,
      [`${prefix}_SOURCE_OF_TRUTH`]: payload.meta.sourceOfTruth,
      [`${prefix}_DEGRADED_MODE`]: 'partial',
      [builder]: () => { if (failBuilder) throw new Error('fixture failure'); return payload; },
      buildEkstremnoProcesuiranjeSvegaFallback: () => ({ ...payload, meta: { ...payload.meta, degraded: true } }),
    },
    '@/lib/analiza-svega-alert': { dispatchAnalizaSvegaAlert: async () => ({ sent: false, reason: 'webhook-not-configured' }) },
    '@/lib/analiza-svega-export': { serializeAnalizaSvegaCSV: () => 'fixture,csv' },
    '@/lib/analiza-svega-store': { getCachedAnalizaSvega: async () => null, setCachedAnalizaSvega: async () => {} },
  };
  const exports = {};
  runInNewContext(code, { exports, Response, URL, console: { warn() {}, error() {} }, require(name) {
    assert.ok(Object.hasOwn(modules, name), `unexpected application import: ${name}`);
    return modules[name];
  } }, { timeout: 1000 });
  assert.equal(typeof exports.GET, 'function');
  return exports.GET;
}

for (const row of cases) {
  const [slug, , header, contractVersion, modelVersion] = row;
  test(`${slug}: successful GET returns matching contract/model headers and payload`, async () => {
    const response = await loadRoute(row)(new Request(`http://localhost/api/${slug}`));
    assert.equal(response.status, 200);
    assert.equal(response.headers.get(`X-${header}-Contract-Version`), contractVersion);
    assert.equal(response.headers.get(`X-${header}-Model-Version`), modelVersion);
    const { data } = await response.json();
    assert.equal(data.marker, 'contract-fixture');
    assert.equal(data.meta.contractVersion, contractVersion);
    assert.equal(data.meta.modelVersion, modelVersion);
    assert.equal(data.meta.sourceOfTruth, `/api/${slug === 'ekstremno-procesuiranje-svega' ? 'procesuiranje-svega' : slug}`);
  });
  test(`${slug}: rate limiting is preserved`, async () => {
    const response = await loadRoute(row, { allowed: false })(new Request(`http://localhost/api/${slug}`));
    assert.equal(response.status, 429);
  });
}
for (const suffix of ['?raw=1', '?format=json', '?format=csv']) {
  test(`analiza-svega ${suffix}: alternate success format retains version headers`, async () => {
    const response = await loadRoute(cases[0])(new Request(`http://localhost/api/analiza-svega${suffix}`));
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('X-Analiza-Contract-Version'), 'v2');
    assert.equal(response.headers.get('X-Analiza-Model-Version'), '2.0.0');
    if (suffix === '?format=csv') assert.match(response.headers.get('content-type'), /text\/csv/);
    else assert.equal((await response.json()).meta.sourceOfTruth, '/api/analiza-svega');
  });
}
test('extreme fallback returns the shared contract with explicit degraded status', async () => {
  const response = await loadRoute(cases[3], { failBuilder: true })(new Request('http://localhost/api/ekstremno-procesuiranje-svega'));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('X-Procesuiranje-Contract-Version'), 'v2');
  assert.equal(response.headers.get('X-Procesuiranje-Model-Version'), '2.1.0');
  assert.equal(response.headers.get('X-Procesuiranje-Source-Of-Truth'), '/api/procesuiranje-svega');
  assert.equal(response.headers.get('X-Procesuiranje-Degraded'), '1');
  assert.equal((await response.json()).data.meta.degraded, true);
});
