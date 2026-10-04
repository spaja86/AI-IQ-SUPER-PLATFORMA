import { spawnSync } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runLocalVerification } from './local-verification.mjs';

export function readCheckout(root) {
  const git = args => {
    const result = spawnSync('git', args, { cwd: root, encoding: 'utf8', shell: false, timeout: 10000, maxBuffer: 65536 });
    if (result.error || result.status !== 0) throw new Error('Git checkout verification failed');
    return result.stdout.trim();
  };
  const revision = git(['rev-parse', 'HEAD']);
  if (!/^[a-f0-9]{40}$/.test(revision)) throw new Error('Invalid Git revision');
  return { revision, dirty: git(['status', '--porcelain', '--untracked-files=all']) !== '' };
}

export function createRevisionEvidence(root) {
  const before = readCheckout(root), startedAt = new Date().toISOString();
  const checks = runLocalVerification(root, { execute: true, suite: 'reference-tests' });
  const after = readCheckout(root);
  return { format: 'local-reference-evidence-v1', startedAt, finishedAt: new Date().toISOString(),
    checkout: before, checkoutAfter: after, sourceStable: !before.dirty && !after.dirty && before.revision === after.revision,
    trust: 'unsigned-local-observation', nodeVersion: process.version, checks };
}

export function assessRevisionEvidence(value, current) {
  if (!value || value.format !== 'local-reference-evidence-v1' || value.trust !== 'unsigned-local-observation' ||
      !value.checkout || !value.checkoutAfter || !/^[a-f0-9]{40}$/.test(value.checkout.revision) || !/^[a-f0-9]{40}$/.test(value.checkoutAfter.revision) ||
      typeof value.checkout.dirty !== 'boolean' || typeof value.checkoutAfter.dirty !== 'boolean' || typeof value.sourceStable !== 'boolean' ||
      !Number.isFinite(Date.parse(value.startedAt)) || !Number.isFinite(Date.parse(value.finishedAt)) || Date.parse(value.finishedAt) < Date.parse(value.startedAt)) throw new Error('Invalid evidence envelope');
  const c = value.checks;
  const names = ['spajascripte-vrh-calls','vrh-individual-profiles','vrh-orchestrator-musema','spaja-fallback-isolation','aiiq-plan-policy'];
  if (!c || c.suite !== 'reference-tests' || c.scope !== 'selected-local-tests-only' || c.javaBuildVerified !== false || c.nextBuildVerified !== false || c.deploymentExecuted !== false ||
      !Array.isArray(c.results) || !c.results.length || c.results.length > 5 || !Array.isArray(c.skipped) || typeof c.passed !== 'boolean') throw new Error('Invalid check report');
  c.results.forEach((r,i) => {
    if (r.name !== names[i] || !['passed','failed','execution-error'].includes(r.status) || !Number.isFinite(r.durationMs) || r.durationMs < 0 ||
        !(r.exitCode === null || Number.isInteger(r.exitCode)) || !(r.signal === null || typeof r.signal === 'string') ||
        (r.status === 'passed' && (r.exitCode !== 0 || r.signal !== null)) || (i < c.results.length-1 && r.status !== 'passed')) throw new Error('Invalid check row');
  });
  const passed = c.results.length === 5 && c.results.every(r => r.status === 'passed');
  if (c.passed !== passed || JSON.stringify(c.skipped) !== JSON.stringify(names.slice(c.results.length))) throw new Error('Inconsistent report');
  const stable = !value.checkout.dirty && !value.checkoutAfter.dirty && value.checkout.revision === value.checkoutAfter.revision;
  if (value.sourceStable !== stable) throw new Error('Inconsistent checkout stability');
  return { status: !stable || current.dirty || current.revision !== value.checkout.revision ? 'stale' : passed ? 'reported-passed' : 'reported-failed',
    trusted: false, executionEnabled: false, javaBuildVerified: false, nextBuildVerified: false, scope: 'selected-local-tests-only' };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    if (args.join(' ') === '--execute reference-tests') {
      const report = createRevisionEvidence(process.cwd());
      console.log(JSON.stringify(report,null,2)); process.exitCode = report.checks.passed ? 0 : 1;
    } else if (args.length === 2 && args[0] === '--inspect') {
      if (!statSync(args[1]).isFile() || statSync(args[1]).size > 65536) throw new Error('Report must be a file <=64KiB');
      console.log(JSON.stringify(assessRevisionEvidence(JSON.parse(readFileSync(args[1],'utf8')),readCheckout(process.cwd())),null,2));
    } else throw new Error('Usage: --execute reference-tests | --inspect <report.json>');
  } catch(error) { console.error(error.message); process.exitCode=1; }
}
