import { createHash, randomUUID } from 'node:crypto';
import { mkdtempSync, readFileSync, writeFileSync, renameSync, rmSync, lstatSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { validDeploymentRequest } from './deployment-provider';
import type { DeploymentAdapter, DeploymentReceipt, DeploymentRequest, RollbackRequest } from './deployment-provider';

interface Release {
  deploymentId: string;
  sourceRevision: string;
  version: string;
  artifactSha256: string;
  triggeredBy: string;
  createdAt: string;
}
interface AuditEvent {
  operation: 'deploy' | 'rollback';
  status: DeploymentReceipt['status'];
  deploymentId: string | null;
  previousDeploymentId: string | null;
  triggeredBy: string;
  code: string;
  at: string;
}

/** Trusted single-process fixture worker. No shell, repository execution or network.
 * Not an OS sandbox. Restart/session import is unsupported. */
export function createLocalDeploymentAdapter(options: { executionEnabled?: boolean } = {}) {
  const enabled = options.executionEnabled === true;
  let workspace: string | null = null;
  let closed = false;
  let activeDeploymentId: string | null = null;
  let releases: Release[] = [];
  let audit: AuditEvent[] = [];
  const digest = (value: string) => createHash('sha256').update(value).digest('hex');
  const fixture = (release: Pick<Release, 'version' | 'sourceRevision'>) =>
    `<!doctype html><title>SPAJA local prototype</title><p>fixture-only</p><p>${release.version}</p><p>${release.sourceRevision}</p>`;
  function receipt(status: DeploymentReceipt['status'], code: string, release?: Release): DeploymentReceipt {
    return { provider: 'spaja-local', status, code, deploymentId: release?.deploymentId ?? null,
      version: release?.version ?? '', sourceRevision: release?.sourceRevision ?? '', artifactSha256: release?.artifactSha256 ?? null,
      verification: status === 'verified' ? 'local-artifact' : 'not-verified', availabilityVerified: false };
  }
  function event(operation: AuditEvent['operation'], result: DeploymentReceipt, actor: string): AuditEvent {
    return { operation, status: result.status, deploymentId: result.deploymentId, previousDeploymentId: activeDeploymentId,
      triggeredBy: typeof actor === 'string' ? actor.slice(0, 128) : '', code: result.code, at: new Date().toISOString() };
  }
  function record(operation: AuditEvent['operation'], result: DeploymentReceipt, actor: string) {
    audit = [...audit, event(operation, result, actor)].slice(-100);
  }
  function persist(nextActive: string, nextReleases: Release[], nextAudit: AuditEvent[]) {
    // Active pointer and ledger commit together; memory advances only after rename.
    const temporary = join(workspace!, 'state.pending');
    writeFileSync(temporary, JSON.stringify({ schemaVersion: 1, provider: 'spaja-local', scope: 'fixture-only', availabilityVerified: false,
      activeDeploymentId: nextActive, releases: nextReleases, audit: nextAudit }, null, 2), { mode: 0o600, flag: 'w' });
    renameSync(temporary, join(workspace!, 'state.json'));
    activeDeploymentId = nextActive; releases = nextReleases; audit = nextAudit;
  }
  function verify(release: Release) {
    const path = join(workspace!, release.deploymentId + '.html');
    const stat = lstatSync(path);
    if (!stat.isFile() || stat.isSymbolicLink() || stat.size > 1024) throw new Error('invalid-artifact');
    const content = readFileSync(path, 'utf8');
    if (content !== fixture(release) || digest(content) !== release.artifactSha256) throw new Error('invalid-artifact');
  }
  const adapter: DeploymentAdapter = {
    id: 'spaja-local',
    async deploy(request: DeploymentRequest) {
      const reason = closed ? 'session-closed' : !enabled ? 'execution-disabled'
        : !validDeploymentRequest(request) ? 'invalid-request'
        : request.environment !== 'dev' ? 'local-dev-only'
        : request.platformId !== 'spaja-local-prototype' ? 'local-fixture-only'
        : releases.length >= 20 ? 'release-limit' : null;
      if (reason) {
        const result = receipt('blocked', reason);
        record('deploy', result, request.triggeredBy); return result;
      }
      let artifactPath: string | null = null;
      try {
        workspace ??= mkdtempSync(join(tmpdir(), 'spaja-deploy-'));
        const release: Release = { deploymentId: randomUUID(), sourceRevision: request.sourceRevision, version: request.version,
          artifactSha256: digest(fixture(request)), triggeredBy: request.triggeredBy, createdAt: new Date().toISOString() };
        artifactPath = join(workspace, release.deploymentId + '.html');
        writeFileSync(artifactPath, fixture(release), { mode: 0o600, flag: 'wx' });
        verify(release);
        const result = receipt('verified', 'local-artifact-verified', release);
        persist(release.deploymentId, [...releases, release], [...audit, event('deploy', result, request.triggeredBy)].slice(-100));
        return result;
      } catch {
        if (artifactPath) { try { rmSync(artifactPath, { force: true }); } catch { /* inspect orphan manually */ } }
        const result = receipt('failed', 'local-write-or-verification-failed');
        record('deploy', result, request.triggeredBy); return result;
      }
    },
    async rollback(request: RollbackRequest) {
      const target = releases.find(release => release.deploymentId === request.deploymentId);
      const reason = closed ? 'session-closed' : !enabled ? 'execution-disabled'
        : typeof request.triggeredBy !== 'string' || !request.triggeredBy.trim() || request.triggeredBy.length > 128 ? 'invalid-actor'
        : !target ? 'unknown-release'
        : activeDeploymentId !== request.expectedActiveDeploymentId ? 'active-version-conflict' : null;
      if (reason) {
        const result = receipt('blocked', reason); record('rollback', result, request.triggeredBy); return result;
      }
      try {
        verify(target!);
        const result = receipt('verified', 'rollback-artifact-verified', target);
        persist(target!.deploymentId, releases, [...audit, event('rollback', result, request.triggeredBy)].slice(-100));
        return result;
      } catch {
        const result = receipt('failed', 'rollback-write-or-verification-failed');
        record('rollback', result, request.triggeredBy); return result;
      }
    },
  };
  return { ...adapter,
    inspect: () => ({ workspace, activeDeploymentId, releases: structuredClone(releases), audit: structuredClone(audit) }),
    /** Removes only the internally generated temporary directory. */
    dispose: () => { closed = true; if (workspace) rmSync(workspace, { recursive: true, force: true }); },
  };
}
