import { createHash } from 'node:crypto';
import type { DeploymentRequest } from './deployment-provider';

/** Local in-process evidence, NOT a remotely authenticated attestation. */
export interface BuiltStaticArtifact {
  schemaVersion: 1;
  scope: 'dev-static-build';
  recipe: 'static-page-v1';
  jobId: string;
  status: string;
  sourceRevision: string;
  version: string;
  sourceSha256: string | null;
  compilerSha256: string;
  artifactSha256: string | null;
  html: string | null;
  availabilityVerified: false;
}

export function validBuiltStaticArtifact(value: BuiltStaticArtifact, request: DeploymentRequest): boolean {
  return !!value && value.schemaVersion === 1 && value.scope === 'dev-static-build'
    && value.recipe === 'static-page-v1' && value.status === 'succeeded'
    && typeof value.jobId === 'string' && /^[a-f0-9-]{36}$/.test(value.jobId)
    && value.sourceRevision === request.sourceRevision && value.version === request.version
    && typeof value.sourceSha256 === 'string' && /^[a-f0-9]{64}$/.test(value.sourceSha256)
    && typeof value.compilerSha256 === 'string' && /^[a-f0-9]{64}$/.test(value.compilerSha256)
    && typeof value.html === 'string' && Buffer.byteLength(value.html) > 0 && Buffer.byteLength(value.html) <= 65536
    && value.availabilityVerified === false
    && createHash('sha256').update(value.html).digest('hex') === value.artifactSha256;
}
