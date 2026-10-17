import { execFileSync } from 'node:child_process';
import { createLocalDeploymentAdapter } from '../src/lib/deploy/local-deployment-adapter';
import { deployWithProvider } from '../src/lib/deploy/provider-adapters';

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('PLAN ONLY: offline dev fixture → SHA-256/content verification → local active pointer → v2 → rollback v1. No application build or server. Use --execute for temporary artifacts, removed on exit.');
    return;
  }
  if (args.length !== 1 || args[0] !== '--execute') throw new Error('Usage: node --import tsx scripts/spaja-local-deploy.ts [--execute]');
  // Fixed read-only Git commands: provenance, not proof of an application build.
  const sourceRevision = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  const checkoutDirty = execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim().length > 0;
  const adapter = createLocalDeploymentAdapter({ executionEnabled: true });
  try {
    const request = { platformId: 'spaja-local-prototype', environment: 'dev' as const, triggeredBy: 'local-cli', sourceRevision, version: 'local-v1' };
    const first = await deployWithProvider('spaja-local', request, adapter);
    const second = await adapter.deploy({ ...request, version: 'local-v2' });
    if (first.status !== 'verified' || second.status !== 'verified') throw new Error('Local fixture failed');
    const rollback = await adapter.rollback({ deploymentId: first.deploymentId!, expectedActiveDeploymentId: second.deploymentId!, triggeredBy: 'local-cli' });
    if (rollback.status !== 'verified') throw new Error('Local rollback failed');
    console.log(JSON.stringify({ scope: 'fixture-only', sourceRevision, checkoutDirty, availabilityVerified: false, deployments: [first, second], rollback, audit: adapter.inspect().audit }, null, 2));
  } finally { adapter.dispose(); }
}
main().catch(error => { console.error(error instanceof Error ? error.message : 'Local demonstration failed'); process.exitCode = 1; });
