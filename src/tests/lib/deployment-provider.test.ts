import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, symlinkSync } from 'node:fs';
import { join } from 'node:path';
import { createLocalDeploymentAdapter } from '../../lib/deploy/local-deployment-adapter';
import { deployWithProvider, vercelDeploymentAdapter } from '../../lib/deploy/provider-adapters';
import type { DeploymentRequest } from '../../lib/deploy/deployment-provider';

async function run() {
  const request: DeploymentRequest = { platformId: 'spaja-local-prototype', environment: 'dev', triggeredBy: 'local-review', sourceRevision: 'a'.repeat(40), version: '1.0.0' };
  let networkCalls = 0;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => { networkCalls++; throw new Error('network forbidden'); };
  const disabled = createLocalDeploymentAdapter();
  const adapter = createLocalDeploymentAdapter({ executionEnabled: true });
  const other = createLocalDeploymentAdapter({ executionEnabled: true });
  try {
    assert.equal((await disabled.deploy(request)).code, 'execution-disabled');
    assert.equal(disabled.inspect().workspace, null);
    for (const bad of [
      { environment: 'production', confirmToken: 'DEPLOY_PRODUCTION' }, { environment: 'staging' },
      { platformId: 'ai-iq-super-platforma' }, { sourceRevision: '../../bad' }, { version: '<script>' },
      { triggeredBy: '' }, { environment: 'unknown' }, { version: 123 },
    ]) assert.equal((await adapter.deploy({ ...request, ...bad } as DeploymentRequest)).status, 'blocked');
    assert.equal(adapter.inspect().workspace, null);
    await assert.rejects(() => deployWithProvider('unknown' as never, request), /Unknown deployment provider/);
    assert.equal((await deployWithProvider('spaja-local', request)).status, 'blocked');

    const first = await deployWithProvider('spaja-local', request, adapter);
    const second = await adapter.deploy({ ...request, sourceRevision: 'b'.repeat(40), version: '2.0.0' });
    assert.equal(first.status, 'verified'); assert.equal(second.status, 'verified');
    assert.equal(first.verification, 'local-artifact'); assert.equal(first.availabilityVerified, false);
    assert.match(first.artifactSha256!, /^[a-f0-9]{64}$/);
    const workspace = adapter.inspect().workspace!;
    const state = JSON.parse(readFileSync(join(workspace, 'state.json'), 'utf8'));
    assert.equal(state.activeDeploymentId, second.deploymentId); assert.equal(state.releases.length, 2);
    assert.equal(state.releases[0].sourceRevision, request.sourceRevision);
    assert.equal(state.releases[0].version, '1.0.0'); assert.equal(state.releases[0].triggeredBy, 'local-review');
    assert.equal(state.audit.filter((e: {status: string}) => e.status === 'blocked').length, 8);
    const rollback = { deploymentId: first.deploymentId!, expectedActiveDeploymentId: second.deploymentId!, triggeredBy: 'local-review' };
    assert.equal((await adapter.rollback({ ...rollback, expectedActiveDeploymentId: first.deploymentId! })).code, 'active-version-conflict');
    assert.equal((await adapter.rollback({ ...rollback, deploymentId: '../outside' })).code, 'unknown-release');
    assert.equal((await adapter.rollback({ ...rollback, triggeredBy: '' })).code, 'invalid-actor');
    assert.equal((await other.rollback(rollback)).status, 'blocked');
    assert.equal((await disabled.rollback(rollback)).status, 'blocked');
    const rolledBack = await adapter.rollback(rollback);
    assert.equal(rolledBack.status, 'verified'); assert.equal(rolledBack.version, '1.0.0');
    assert.equal(adapter.inspect().activeDeploymentId, first.deploymentId);
    assert.equal(adapter.inspect().audit.at(-1)?.triggeredBy, 'local-review');
    assert.equal(adapter.inspect().audit.at(-1)?.previousDeploymentId, second.deploymentId);

    // Failed disk publication cannot advance the active pointer or ledger.
    mkdirSync(join(workspace, 'state.pending'));
    const beforeFailure = readFileSync(join(workspace, 'state.json'), 'utf8');
    assert.equal((await adapter.deploy({ ...request, version: 'cannot-publish' })).status, 'failed');
    assert.equal(adapter.inspect().activeDeploymentId, first.deploymentId);
    assert.equal(adapter.inspect().releases.length, 2);
    assert.equal(readFileSync(join(workspace, 'state.json'), 'utf8'), beforeFailure);
    rmSync(join(workspace, 'state.pending'), { recursive: true });
    const secondPath = join(workspace, second.deploymentId! + '.html');
    writeFileSync(secondPath, 'damaged');
    const returnToSecond = { deploymentId: second.deploymentId!, expectedActiveDeploymentId: first.deploymentId!, triggeredBy: 'local-review' };
    assert.equal((await adapter.rollback(returnToSecond)).status, 'failed');
    assert.equal(adapter.inspect().activeDeploymentId, first.deploymentId);
    rmSync(secondPath); symlinkSync(join(workspace, first.deploymentId! + '.html'), secondPath);
    assert.equal((await adapter.rollback(returnToSecond)).status, 'failed');
    rmSync(secondPath);
    assert.equal((await adapter.rollback(returnToSecond)).status, 'failed');
    assert.equal(networkCalls, 0, 'local operations never use network');

    const savedHook = process.env.VERCEL_DEPLOY_HOOK_AI_IQ;
    delete process.env.VERCEL_DEPLOY_HOOK_AI_IQ;
    try {
      const result = await deployWithProvider('vercel', { ...request, platformId: 'ai-iq-super-platforma' });
      assert.equal(result.status, 'blocked'); assert.equal(result.provider, 'vercel');
      assert.equal((await vercelDeploymentAdapter.rollback(rollback)).code, 'rollback-unsupported');
      process.env.VERCEL_DEPLOY_HOOK_AI_IQ = 'https://example.invalid/hook';
      globalThis.fetch = async () => new Response(JSON.stringify({ job: { id: 'mock-job' } }), { status: 200 });
      const accepted = await deployWithProvider('vercel', { ...request, platformId: 'ai-iq-super-platforma' });
      assert.equal(accepted.status, 'accepted'); assert.equal(accepted.verification, 'not-verified');
      assert.equal(accepted.availabilityVerified, false);
      // Existing production gate cannot be bypassed through the adapter.
      const denied = await deployWithProvider('vercel', { ...request, platformId: 'ai-iq-super-platforma', environment: 'production' });
      assert.equal(denied.status, 'blocked');
    } finally {
      if (savedHook === undefined) delete process.env.VERCEL_DEPLOY_HOOK_AI_IQ;
      else process.env.VERCEL_DEPLOY_HOOK_AI_IQ = savedHook;
    }
    for (let i = 2; i < 20; i++) assert.equal((await adapter.deploy({ ...request, version: `v${i}` })).status, 'verified');
    assert.equal((await adapter.deploy(request)).code, 'release-limit');
    const snapshot = adapter.inspect(); snapshot.releases.length = 0;
    assert.equal(adapter.inspect().releases.length, 20);
    for (let i = 0; i < 110; i++) await adapter.rollback({ ...rollback, deploymentId: 'unknown' });
    assert.equal(adapter.inspect().audit.length, 100);
    adapter.dispose(); assert.equal(existsSync(workspace), false);
    assert.equal((await adapter.deploy(request)).code, 'session-closed');
    console.log('PASS: provider separation, opt-in, dev-only fixed worker, version/digest evidence, CAS rollback, corruption/symlink/missing artifact, write failure, retention and cleanup; Vercel mocked only');
  } finally { globalThis.fetch = originalFetch; disabled.dispose(); adapter.dispose(); other.dispose(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
