import { triggerPlatformDeploy } from './deploy-trigger';
import { createLocalDeploymentAdapter } from './local-deployment-adapter';
import { validDeploymentRequest } from './deployment-provider';
import type { DeploymentAdapter, DeploymentProviderId, DeploymentReceipt, DeploymentRequest } from './deployment-provider';

/** Optional Vercel compatibility adapter; existing production gates remain in the trigger. */
export const vercelDeploymentAdapter: DeploymentAdapter = {
  id: 'vercel',
  async deploy(request) {
    const base: DeploymentReceipt = { provider: 'vercel', status: 'blocked', deploymentId: null,
      sourceRevision: request.sourceRevision, version: request.version, artifactSha256: null,
      verification: 'not-verified', availabilityVerified: false, code: 'invalid-request' };
    if (!validDeploymentRequest(request)) return base;
    const result = await triggerPlatformDeploy(request);
    return { ...base, status: result.success ? 'accepted' : 'blocked', deploymentId: result.deploymentId,
      code: result.success ? 'hook-accepted-revision-unverified' : 'vercel-trigger-rejected' };
  },
  async rollback() {
    return { provider: 'vercel', status: 'blocked', deploymentId: null, sourceRevision: '', version: '', artifactSha256: null,
      verification: 'not-verified', availabilityVerified: false, code: 'rollback-unsupported' };
  },
};
/** Explicit provider, no fallback, automatic activation or HTTP exposure. */
export async function deployWithProvider(provider: DeploymentProviderId, request: DeploymentRequest, local = createLocalDeploymentAdapter()): Promise<DeploymentReceipt> {
  if (provider === 'spaja-local') return local.deploy(request);
  if (provider === 'vercel') return vercelDeploymentAdapter.deploy(request);
  throw new Error('Unknown deployment provider');
}
