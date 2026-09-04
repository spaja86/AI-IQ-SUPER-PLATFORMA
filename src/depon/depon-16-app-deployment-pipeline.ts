/**
 * 🚀 DEPON-16 — App Deployment Pipeline
 *
 * CI/CD factory capable of building, testing, and deploying any of the
 * 180M apps registered on the platform. Each app gets an isolated build
 * pipeline triggered by source changes, manual dispatch, or DeponValue
 * threshold events.
 *
 * Pipeline stages:
 *   1. Source checkout & dependency install
 *   2. Lint + TypeCheck
 *   3. Unit & integration tests
 *   4. Security scan (SAST + dependency audit)
 *   5. Build artefact (Docker image / serverless bundle)
 *   6. Staging deploy + smoke test
 *   7. Production deploy + health check
 *   8. Kafka event: app.deployed
 *
 * Kompanija SPAJA — Digitalna Industrija
 */

import type { DeponId } from './depon-registry';

export const DEPON_ID: DeponId = 'DEPON-16';

// ─── Constants ────────────────────────────────────────────────────────────────

export const PIPELINE_CONFIG = {
  maxConcurrentPipelines: 1_000,
  buildTimeoutMs: 30 * 60 * 1000,         // 30 minutes
  stagingHealthCheckRetries: 3,
  productionHealthCheckRetries: 5,
  artefactRetentionDays: 30,
  kafkaTopic: 'app.deployed',
  supportedRuntimes: ['node18', 'node20', 'python310', 'python311', 'go121', 'rust', 'java21'] as const,
  supportedTargets: ['vercel', 'kubernetes', 'lambda', 'cloudrun', 'docker'] as const,
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export type PipelineRuntime = typeof PIPELINE_CONFIG.supportedRuntimes[number];
export type DeployTarget = typeof PIPELINE_CONFIG.supportedTargets[number];

export type PipelineStage =
  | 'checkout'
  | 'install'
  | 'lint'
  | 'typecheck'
  | 'test'
  | 'security-scan'
  | 'build'
  | 'staging-deploy'
  | 'smoke-test'
  | 'production-deploy'
  | 'health-check'
  | 'notify';

export type PipelineStageStatus = 'pending' | 'running' | 'passed' | 'failed' | 'skipped';

export type PipelineStatus = 'queued' | 'running' | 'success' | 'failed' | 'cancelled' | 'timeout';

export type PipelineTrigger =
  | 'git-push'
  | 'manual'
  | 'scheduled'
  | 'depon-value-threshold'
  | 'hotfix';

export type PipelineStageResult = {
  stage: PipelineStage;
  status: PipelineStageStatus;
  durationMs: number | null;
  log: string;
  startedAt: Date | null;
  completedAt: Date | null;
};

export type PipelineRun = {
  runId: string;
  appId: string;
  ownerState: string;
  trigger: PipelineTrigger;
  runtime: PipelineRuntime;
  target: DeployTarget;
  branch: string;
  commitSha: string;
  status: PipelineStatus;
  stages: PipelineStageResult[];
  artefactUrl: string | null;
  deployedUrl: string | null;
  queuedAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
};

export type SecurityScanResult = {
  passed: boolean;
  criticalVulnerabilities: number;
  highVulnerabilities: number;
  secretsFound: number;
  sastIssues: number;
  summary: string;
};

export type DeployKafkaEvent = {
  topic: string;
  appId: string;
  runId: string;
  status: 'success' | 'failed';
  deployedUrl: string | null;
  timestamp: Date;
};

// ─── Pipeline Builder ─────────────────────────────────────────────────────────

export function buildPipelineRun(params: {
  appId: string;
  ownerState: string;
  trigger: PipelineTrigger;
  runtime: PipelineRuntime;
  target: DeployTarget;
  branch?: string;
  commitSha?: string;
}): PipelineRun {
  const stages: PipelineStageResult[] = (
    [
      'checkout',
      'install',
      'lint',
      'typecheck',
      'test',
      'security-scan',
      'build',
      'staging-deploy',
      'smoke-test',
      'production-deploy',
      'health-check',
      'notify',
    ] satisfies PipelineStage[]
  ).map((stage) => ({
    stage,
    status: 'pending',
    durationMs: null,
    log: '',
    startedAt: null,
    completedAt: null,
  }));

  return {
    runId: `run_${params.appId}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    appId: params.appId,
    ownerState: params.ownerState,
    trigger: params.trigger,
    runtime: params.runtime,
    target: params.target,
    branch: params.branch ?? 'main',
    commitSha: params.commitSha ?? 'unknown',
    status: 'queued',
    stages,
    artefactUrl: null,
    deployedUrl: null,
    queuedAt: new Date(),
    startedAt: null,
    completedAt: null,
  };
}

export function advancePipelineStage(
  run: PipelineRun,
  stage: PipelineStage,
  status: PipelineStageStatus,
  durationMs: number,
  log: string,
): PipelineRun {
  const now = new Date();
  const updatedStages = run.stages.map((s) =>
    s.stage === stage
      ? { ...s, status, durationMs, log, startedAt: s.startedAt ?? now, completedAt: now }
      : s,
  );
  const allDone = updatedStages.every(
    (s) => s.status === 'passed' || s.status === 'skipped' || s.status === 'failed',
  );
  const anyFailed = updatedStages.some((s) => s.status === 'failed');
  const pipelineStatus: PipelineStatus = !allDone
    ? 'running'
    : anyFailed
      ? 'failed'
      : 'success';
  return {
    ...run,
    stages: updatedStages,
    status: pipelineStatus,
    startedAt: run.startedAt ?? now,
    completedAt: allDone ? now : null,
  };
}

export function buildSecurityScanResult(params: {
  criticalVulnerabilities?: number;
  highVulnerabilities?: number;
  secretsFound?: number;
  sastIssues?: number;
}): SecurityScanResult {
  const critical = params.criticalVulnerabilities ?? 0;
  const high = params.highVulnerabilities ?? 0;
  const secrets = params.secretsFound ?? 0;
  const sast = params.sastIssues ?? 0;
  const passed = critical === 0 && secrets === 0;
  return {
    passed,
    criticalVulnerabilities: critical,
    highVulnerabilities: high,
    secretsFound: secrets,
    sastIssues: sast,
    summary: passed
      ? `✅ Security scan passed. High: ${high}, SAST: ${sast}.`
      : `❌ Security scan failed. Critical: ${critical}, Secrets: ${secrets}.`,
  };
}

export function buildDeployKafkaEvent(run: PipelineRun): DeployKafkaEvent {
  return {
    topic: PIPELINE_CONFIG.kafkaTopic,
    appId: run.appId,
    runId: run.runId,
    status: run.status === 'success' ? 'success' : 'failed',
    deployedUrl: run.deployedUrl,
    timestamp: new Date(),
  };
}

export function getPipelineDurationMs(run: PipelineRun): number | null {
  if (!run.startedAt || !run.completedAt) return null;
  return run.completedAt.getTime() - run.startedAt.getTime();
}

export function isRuntimeSupported(runtime: string): runtime is PipelineRuntime {
  return (PIPELINE_CONFIG.supportedRuntimes as readonly string[]).includes(runtime);
}

export function isTargetSupported(target: string): target is DeployTarget {
  return (PIPELINE_CONFIG.supportedTargets as readonly string[]).includes(target);
}

export function getHealthStatus(): {
  depon: string;
  status: 'ok';
  version: string;
  maxConcurrentPipelines: number;
  supportedRuntimes: number;
} {
  return {
    depon: DEPON_ID,
    status: 'ok',
    version: '1.0.0',
    maxConcurrentPipelines: PIPELINE_CONFIG.maxConcurrentPipelines,
    supportedRuntimes: PIPELINE_CONFIG.supportedRuntimes.length,
  };
}
