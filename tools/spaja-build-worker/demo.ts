import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createBuildWorker } from './worker';
import { createLocalDeploymentAdapter } from '../../src/lib/deploy/local-deployment-adapter';

// Reviewed fixture digest, deliberately NOT calculated from arbitrary requested input.
const APPROVED_SOURCE = 'c40540d5508946e0861c99533a050863ef8b7f1a0680ff3391d8b6e5502447a8';
async function main() {
  const args = process.argv.slice(2);
  if (!args.length) {
    console.log('PLAN ONLY: approved static-page source → isolated compiler → SHA-256 → opt-in local adapter → rollback. Use --execute-dev for temporary artifacts, deleted on exit. No Next.js build or server.');
    return;
  }
  if (args.length !== 1 || args[0] !== '--execute-dev') throw new Error('Usage: node --import tsx tools/spaja-build-worker/demo.ts [--execute-dev]');
  const worker = createBuildWorker({ executionEnabled: true, allowedSourceSha256: [APPROVED_SOURCE] });
  const adapter = createLocalDeploymentAdapter({ executionEnabled: true, builtArtifactsEnabled: true });
  const controller = new AbortController();
  const stop = () => controller.abort();
  process.on('SIGINT', stop); process.on('SIGTERM', stop);
  try {
    const source = readFileSync(new URL('./fixtures/page.json', import.meta.url), 'utf8');
    const sourceRevision = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
    const checkoutDirty = execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim().length > 0;
    const request = { recipe: 'static-page-v1', platformId: 'spaja-build-prototype', environment: 'dev' as const,
      sourceRevision, version: 'build-v1', triggeredBy: 'local-build-demo', source };
    const build = await worker.build(request, controller.signal);
    if (build.status !== 'succeeded') { console.log(JSON.stringify(build, null, 2)); process.exitCode = 1; return; }
    const first = await adapter.deployBuiltArtifact(request, build);
    const secondRequest = { ...request, version: 'build-v2' };
    const secondBuild = await worker.build(secondRequest, controller.signal);
    const second = await adapter.deployBuiltArtifact(secondRequest, secondBuild);
    if (first.status !== 'verified' || second.status !== 'verified') throw new Error('Local activation failed');
    const rollback = await adapter.rollback({ deploymentId: first.deploymentId!, expectedActiveDeploymentId: second.deploymentId!, triggeredBy: 'local-build-demo' });
    if (rollback.status !== 'verified') throw new Error('Local rollback failed');
    console.log(JSON.stringify({ scope: 'dev-static-build', checkoutDirty, availabilityVerified: false,
      build, secondBuild, deployments: [first, second], rollback, audit: adapter.inspect().audit }, null, 2));
  } finally {
    process.off('SIGINT', stop); process.off('SIGTERM', stop);
    worker.dispose(); adapter.dispose();
  }
}
main().catch(error => { console.error(error instanceof Error ? error.message : 'Build demonstration failed'); process.exitCode = 1; });
