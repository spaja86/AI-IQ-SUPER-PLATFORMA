import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, renameSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { BuiltStaticArtifact } from '../../src/lib/deploy/built-static-artifact';

const COMPILER_SHA256 = 'a7b91bdf8ce7cdcf83fe53510b56ce855d600ab649440cfcd0433a6a376e3ead';
export const BUILD_LIMITS = Object.freeze({ sourceBytes: 16384, artifactBytes: 65536, logBytes: 2048,
  timeoutMs: 2000, memoryBytes: 134217728, cpuSeconds: 2, jobs: 20, concurrency: 1 });
const digest = (data: string | Buffer) => createHash('sha256').update(data).digest('hex');
type Status = 'succeeded' | 'rejected' | 'failed' | 'cancelled' | 'timed-out';
export interface BuildResult extends BuiltStaticArtifact {
  status: Status; code: string; startedAt: string; finishedAt: string; durationMs: number;
  exitCode: number | null; signal: string | null; log: string;
}
type Options = { executionEnabled?: boolean; allowedSourceSha256?: readonly string[]; timeoutMs?: number };
const fields = ['recipe', 'environment', 'platformId', 'sourceRevision', 'version', 'triggeredBy', 'source'];

/** Trusted local caller only. No HTTP surface, custom command, dependency installer or host fallback. */
export function createBuildWorker(options: Options = {}) {
  const executionEnabled = options.executionEnabled === true;
  const approved = new Set(options.allowedSourceSha256 ?? []);
  if (approved.size > 32 || [...approved].some(x => !/^[a-f0-9]{64}$/.test(x))) throw new Error('invalid-source-policy');
  const timeoutMs = options.timeoutMs ?? BUILD_LIMITS.timeoutMs;
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > BUILD_LIMITS.timeoutMs) throw new Error('invalid-timeout');
  let workspace: string | null = null;
  let closed = false;
  let busy = false;
  let jobs = 0;
  let child: ChildProcessWithoutNullStreams | null = null;
  let cancelActive: (() => void) | null = null;
  const results: BuildResult[] = [];
  function removeWorkspace() { if (workspace) rmSync(workspace, { recursive: true, force: true }); }
  return {
    async build(input: unknown, signal?: AbortSignal): Promise<BuildResult> {
      const started = Date.now();
      const r = input && typeof input === 'object' && !Array.isArray(input) ? input as Record<string, unknown> : {};
      const result: BuildResult = { schemaVersion: 1, scope: 'dev-static-build', recipe: 'static-page-v1',
        jobId: randomUUID(), status: 'rejected', code: '', sourceRevision: typeof r.sourceRevision === 'string' ? r.sourceRevision.slice(0, 40) : '',
        version: typeof r.version === 'string' ? r.version.slice(0, 64) : '', sourceSha256: null,
        compilerSha256: COMPILER_SHA256, artifactSha256: null, html: null, availabilityVerified: false,
        startedAt: new Date(started).toISOString(), finishedAt: '', durationMs: 0, exitCode: null, signal: null, log: '' };
      const finish = (status: Status, code: string, jobDir?: string) => {
        result.status = status; result.code = code; result.finishedAt = new Date().toISOString(); result.durationMs = Date.now() - started;
        if (status !== 'succeeded') { result.html = null; result.artifactSha256 = null; }
        if (jobDir) {
          // Audit is separate from deployment state. If audit cannot commit, do not return an artifact.
          try {
            const { html: _html, ...record } = result;
            void _html;
            writeFileSync(join(jobDir, 'result.pending'), JSON.stringify(record, null, 2), { mode: 0o600, flag: 'wx' });
            renameSync(join(jobDir, 'result.pending'), join(jobDir, 'result.json'));
          } catch { result.status = 'failed'; result.code = 'audit-write-failed'; result.html = null; result.artifactSha256 = null; }
          if (result.status !== 'succeeded') {
            try { rmSync(join(jobDir, 'artifact.html'), { force: true }); }
            catch { result.code = 'failed-artifact-cleanup-required'; }
          }
        }
        results.push(structuredClone(result)); if (results.length > BUILD_LIMITS.jobs) results.shift();
        return structuredClone(result);
      };
      const reason = closed ? 'session-closed' : !executionEnabled ? 'execution-disabled'
        : busy ? 'worker-busy' : jobs >= BUILD_LIMITS.jobs ? 'job-limit'
        : Object.keys(r).length !== fields.length || fields.some(k => !(k in r)) || Object.keys(r).some(k => !fields.includes(k)) ? 'invalid-request'
        : r.recipe !== 'static-page-v1' || r.environment !== 'dev' || r.platformId !== 'spaja-build-prototype' ? 'recipe-or-environment-denied'
        : typeof r.sourceRevision !== 'string' || !/^[a-f0-9]{40}$/.test(r.sourceRevision)
          || typeof r.version !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,63}$/.test(r.version)
          || typeof r.triggeredBy !== 'string' || !r.triggeredBy.trim() || r.triggeredBy.length > 128 ? 'invalid-provenance'
        : typeof r.source !== 'string' || Buffer.byteLength(r.source) > BUILD_LIMITS.sourceBytes ? 'invalid-source'
        : !approved.has(digest(r.source)) ? 'source-not-approved' : process.platform !== 'linux' ? 'linux-required' : null;
      if (reason) return finish('rejected', reason);
      result.sourceSha256 = digest(r.source as string);
      if (signal?.aborted) return finish('cancelled', 'cancelled-before-start');
      busy = true; jobs++;
      let jobDir: string | undefined;
      try {
        const compiler = readFileSync(fileURLToPath(new URL('./compiler.py', import.meta.url)));
        if (digest(compiler) !== COMPILER_SHA256) return finish('rejected', 'compiler-integrity-mismatch');
        workspace ??= mkdtempSync(join(tmpdir(), 'spaja-build-'));
        jobDir = join(workspace, result.jobId); mkdirSync(jobDir, { mode: 0o700 });
        const compilerPath = join(jobDir, 'compiler.py');
        writeFileSync(compilerPath, compiler, { mode: 0o400, flag: 'wx' });
        const outcome = await new Promise<{ status: Status; code: string; stdout: Buffer }>(resolve => {
          let forced: { status: Status; code: string } | null = null;
          const chunks: Buffer[] = []; let bytes = 0; let logBytes = 0;
          const stop = (status: Status, code: string) => {
            forced ??= { status, code }; child?.kill('SIGKILL');
          };
          // Fixed system interpreter, isolated Python mode, minimal environment, no inherited descriptors or shell.
          const buildProcess = spawn('/usr/bin/python3', ['-I', '-S', compilerPath], { cwd: jobDir, env: { NODE_ENV: 'development' }, shell: false, stdio: ['pipe', 'pipe', 'pipe'] });
          child = buildProcess;
          cancelActive = () => stop('cancelled', 'build-cancelled');
          const abort = cancelActive;
          signal?.addEventListener('abort', abort, { once: true });
          if (signal?.aborted || closed) abort();
          const timer = setTimeout(() => stop('timed-out', 'wall-time-limit'), timeoutMs);
          buildProcess.stdout.on('data', (chunk: Buffer) => {
            bytes += chunk.length;
            if (bytes > BUILD_LIMITS.artifactBytes) stop('failed', 'output-limit'); else chunks.push(chunk);
          });
          buildProcess.stderr.on('data', (chunk: Buffer) => {
            logBytes += chunk.length;
            if (logBytes > BUILD_LIMITS.logBytes) stop('failed', 'log-limit'); else result.log += chunk.toString('utf8');
          });
          buildProcess.stdin.on('error', () => { /* EPIPE from early sandbox rejection is handled at close. */ });
          buildProcess.on('error', () => { forced ??= { status: 'failed', code: 'sandbox-launch-failed' }; });
          buildProcess.on('close', (code, exitSignal) => {
            clearTimeout(timer); signal?.removeEventListener('abort', abort); child = null; cancelActive = null;
            result.exitCode = code; result.signal = exitSignal;
            resolve({ ...(forced ?? (code === 0 && result.log === 'sandbox-ready\n' ? { status: 'succeeded' as const, code: 'artifact-built' }
              : { status: 'failed' as const, code: code === 78 ? 'sandbox-unavailable' : 'compiler-failed' })), stdout: Buffer.concat(chunks) });
          });
          buildProcess.stdin.end(r.source as string, 'utf8');
        });
        if (outcome.status !== 'succeeded') return finish(outcome.status, outcome.code, jobDir);
        if (outcome.stdout.length === 0) return finish('failed', 'empty-artifact', jobDir);
        result.html = outcome.stdout.toString('utf8'); result.artifactSha256 = digest(outcome.stdout);
        // The parent alone writes output; the compiler cannot open or create any file.
        const artifact = join(jobDir, 'artifact.html');
        writeFileSync(artifact, outcome.stdout, { mode: 0o400, flag: 'wx' });
        if (digest(readFileSync(artifact)) !== result.artifactSha256) return finish('failed', 'artifact-integrity-mismatch', jobDir);
        return finish('succeeded', 'artifact-built', jobDir);
      } catch { return finish('failed', 'worker-io-failed', jobDir); }
      finally { busy = false; if (closed) removeWorkspace(); }
    },
    inspect: () => ({ workspace, busy, closed, results: structuredClone(results) }),
    dispose() { closed = true; if (busy) cancelActive?.(); else removeWorkspace(); },
  };
}
