import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { createBuildWorker } from './worker';
import { createLocalDeploymentAdapter } from '../../src/lib/deploy/local-deployment-adapter';

const source = readFileSync(new URL('./fixtures/page.json', import.meta.url), 'utf8');
const sha = (s: string) => createHash('sha256').update(s).digest('hex');
const request = { recipe: 'static-page-v1', environment: 'dev' as const, platformId: 'spaja-build-prototype',
  sourceRevision: 'a'.repeat(40), version: 'build-v1', triggeredBy: 'regression', source };
function worker(extra = {}) {
  return createBuildWorker({ executionEnabled: true, allowedSourceSha256: [sha(source)], ...extra });
}

test('real sandbox build, digest, audit and local adapter activation/rollback', async () => {
  const w = worker(); const adapter = createLocalDeploymentAdapter({ executionEnabled: true, builtArtifactsEnabled: true });
  try {
    const first = await w.build(request);
    assert.equal(first.status, 'succeeded', JSON.stringify(first));
    assert.equal(first.sourceSha256, sha(source));
    assert.equal(first.artifactSha256, sha(first.html!));
    assert.match(first.html!, /<h1>SPAJA Build Worker<\/h1>/);
    assert.equal(first.availabilityVerified, false);
    const one = await adapter.deployBuiltArtifact(request, first);
    const two = await adapter.deployBuiltArtifact({ ...request, version: 'build-v2' }, await w.build({ ...request, version: 'build-v2' }));
    assert.equal(one.status, 'verified'); assert.equal(two.status, 'verified');
    assert.equal(readFileSync(join(adapter.inspect().workspace!, one.deploymentId! + '.html'), 'utf8'), first.html);
    assert.equal((await adapter.rollback({ deploymentId: one.deploymentId!, expectedActiveDeploymentId: two.deploymentId!, triggeredBy: 'regression' })).status, 'verified');
    assert.equal(w.inspect().results.length, 2);
    assert.equal(JSON.parse(readFileSync(join(w.inspect().workspace!, first.jobId, 'result.json'), 'utf8')).status, 'succeeded');
  } finally { w.dispose(); adapter.dispose(); }
});

test('allowlisted invalid source actually fails in compiler and cannot change active release', async () => {
  const invalid = '{'; const w = worker({ allowedSourceSha256: [sha(source), sha(invalid)] });
  const adapter = createLocalDeploymentAdapter({ executionEnabled: true, builtArtifactsEnabled: true });
  try {
    const active = await adapter.deployBuiltArtifact(request, await w.build(request));
    const result = await w.build({ ...request, source: invalid });
    assert.equal(result.status, 'failed'); assert.equal(result.code, 'compiler-failed');
    assert.equal(result.html, null); assert.equal(result.artifactSha256, null);
    assert.equal((await adapter.deployBuiltArtifact(request, result)).status, 'blocked');
    assert.equal(adapter.inspect().activeDeploymentId, active.deploymentId);
  } finally { w.dispose(); adapter.dispose(); }
});

test('execution defaults off and request cannot select commands, packages or production', async () => {
  const off = createBuildWorker(); const w = worker();
  try {
    assert.equal((await off.build(request)).code, 'execution-disabled');
    for (const extra of [{ command: 'id' }, { dependencies: ['evil'] }, { environment: 'production' },
      { recipe: 'next-build' }, { source: source + ' ' }, { sourceRevision: '../x' }, { platformId: 'ai-iq-super-platforma' }]) {
      assert.equal((await w.build({ ...request, ...extra })).status, 'rejected');
    }
    assert.equal(w.inspect().workspace, null);
  } finally { off.dispose(); w.dispose(); }
});

test('pre-abort, in-flight abort and timeout produce no artifact', async () => {
  const w = worker(); const fast = worker({ timeoutMs: 1 });
  try {
    const pre = new AbortController(); pre.abort();
    assert.equal((await w.build(request, pre.signal)).status, 'cancelled');
    const control = new AbortController();
    const pending = w.build(request, control.signal); control.abort();
    const result = await pending;
    assert.equal(result.status, 'cancelled'); assert.equal(result.html, null);
    assert.equal((await fast.build(request)).status, 'timed-out');
    assert.equal(w.inspect().results.filter(r => r.status === 'succeeded').length, 0);
  } finally { w.dispose(); fast.dispose(); }
});

test('adapter requires separate opt-in and refuses altered provenance/digest', async () => {
  const w = worker(); const adapter = createLocalDeploymentAdapter({ executionEnabled: true, builtArtifactsEnabled: true });
  const off = createLocalDeploymentAdapter({ executionEnabled: true });
  try {
    const result = await w.build(request);
    assert.equal((await off.deployBuiltArtifact(request, result)).code, 'built-artifacts-disabled');
    for (const change of [{ html: result.html + 'tamper' }, { sourceRevision: 'b'.repeat(40) }, { version: 'other' }, { status: 'failed' }]) {
      assert.equal((await adapter.deployBuiltArtifact(request, { ...result, ...change } as typeof result)).status, 'blocked');
    }
    assert.equal(adapter.inspect().workspace, null);
  } finally { w.dispose(); adapter.dispose(); off.dispose(); }
});

test('concurrency rejected, dispose cancels and removes owned temporary files', async () => {
  const w = worker(); const pending = w.build(request);
  assert.equal((await w.build(request)).code, 'worker-busy');
  const path = w.inspect().workspace;
  w.dispose();
  assert.equal((await pending).status, 'cancelled');
  if (path) assert.equal(existsSync(path), false);
  assert.equal((await w.build(request)).code, 'session-closed');
});

test('failed audit persistence discards built output and leaves no publishable artifact', async () => {
  const w = worker();
  try {
    const pending = w.build(request);
    const root = w.inspect().workspace!;
    const { readdirSync, mkdirSync } = await import('node:fs');
    const job = readdirSync(root)[0]; mkdirSync(join(root, job, 'result.pending'));
    const result = await pending;
    assert.equal(result.status, 'failed'); assert.equal(result.code, 'audit-write-failed');
    assert.equal(result.html, null); assert.equal(existsSync(join(root, job, 'artifact.html')), false);
  } finally { w.dispose(); }
});

test('built-artifact disk failure and corrupted rollback preserve active state', async () => {
  const w = worker(); const adapter = createLocalDeploymentAdapter({ executionEnabled: true, builtArtifactsEnabled: true });
  const { mkdirSync, rmSync, writeFileSync } = await import('node:fs');
  try {
    const result = await w.build(request);
    const one = await adapter.deployBuiltArtifact(request, result);
    const two = await adapter.deployBuiltArtifact(request, result);
    const root = adapter.inspect().workspace!;
    const state = readFileSync(join(root, 'state.json'), 'utf8');
    mkdirSync(join(root, 'state.pending'));
    assert.equal((await adapter.deployBuiltArtifact(request, result)).status, 'failed');
    assert.equal(readFileSync(join(root, 'state.json'), 'utf8'), state);
    rmSync(join(root, 'state.pending'), { recursive: true });
    writeFileSync(join(root, one.deploymentId! + '.html'), 'corrupted');
    assert.equal((await adapter.rollback({ deploymentId: one.deploymentId!, expectedActiveDeploymentId: two.deploymentId!, triggeredBy: 'regression' })).status, 'failed');
    assert.equal(adapter.inspect().activeDeploymentId, two.deploymentId);
  } finally { w.dispose(); adapter.dispose(); }
});

test('source size and immutable per-session job budget are enforced', async () => {
  const invalid = '{'; const w = worker({ allowedSourceSha256: [sha(invalid), sha('x'.repeat(16385))] });
  try {
    assert.equal((await w.build({ ...request, source: 'x'.repeat(16385) })).code, 'invalid-source');
    for (let i = 0; i < 20; i++) assert.equal((await w.build({ ...request, source: invalid })).status, 'failed');
    assert.equal((await w.build({ ...request, source: invalid })).code, 'job-limit');
    assert.equal(w.inspect().results.length, 20);
  } finally { w.dispose(); }
});
