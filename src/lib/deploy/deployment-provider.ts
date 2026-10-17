import type { DeployTriggerRequest } from './deploy-trigger';

export type DeploymentProviderId = 'vercel' | 'spaja-local';
/** Revision is provenance, never an instruction to execute repository code. */
export interface DeploymentRequest extends DeployTriggerRequest {
  sourceRevision: string;
  version: string;
}
export interface DeploymentReceipt {
  provider: DeploymentProviderId;
  status: 'accepted' | 'verified' | 'blocked' | 'failed';
  deploymentId: string | null;
  sourceRevision: string;
  version: string;
  artifactSha256: string | null;
  verification: 'not-verified' | 'local-artifact';
  availabilityVerified: false;
  code: string;
}
export interface RollbackRequest {
  deploymentId: string;
  expectedActiveDeploymentId: string;
  triggeredBy: string;
}
export interface DeploymentAdapter {
  readonly id: DeploymentProviderId;
  deploy(request: DeploymentRequest): Promise<DeploymentReceipt>;
  rollback(request: RollbackRequest): Promise<DeploymentReceipt>;
}
export function validDeploymentRequest(request: DeploymentRequest): boolean {
  return typeof request.sourceRevision === 'string' && /^[a-f0-9]{40}$/.test(request.sourceRevision)
    && typeof request.version === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,63}$/.test(request.version)
    && typeof request.triggeredBy === 'string' && request.triggeredBy.trim().length > 0
    && request.triggeredBy.length <= 128 && ['dev', 'staging', 'production'].includes(request.environment);
}
