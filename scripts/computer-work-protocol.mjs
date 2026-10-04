import { randomUUID } from 'node:crypto';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readCheckout, createRevisionEvidence } from './revision-test-evidence.mjs';

export function validateWorkRequest(request) {
  if (!request || typeof request !== 'object' || Array.isArray(request) || Object.keys(request).sort().join(',') !== 'expectedRevision,service,version' || request.version !== 'v1' || request.service !== 'reference-tests' || !/^[a-f0-9]{40}$/.test(request.expectedRevision)) throw new Error('Invalid work mušema');
  return { ...request };
}

/** Local synchronous job. Opt-in is not server identity authorization. */
export function runComputerJob(root, request, control, services = { readCheckout, createRevisionEvidence }) {
  const job = { id: randomUUID(), service: 'reference-tests', state: 'queued', history: ['queued'], evidence: null, reason: null, executionScope: 'local-fixed-tests', persistent: false, serverAuthorized: false };
  function finish(state, reason = null) { job.state = state; job.history.push(state); job.reason = reason; return job; }
  let validated;
  try { validated = validateWorkRequest(request); } catch { return finish('blocked', 'invalid-request'); }
  if (!control || control.execute !== true || Object.keys(control).some(k => !['execute','cancelBeforeStart'].includes(k)) || (control.cancelBeforeStart !== undefined && typeof control.cancelBeforeStart !== 'boolean')) return finish('blocked','explicit-local-opt-in-required');
  if (control.cancelBeforeStart) return finish('cancelled','cancelled-before-start');
  try {
    const before = services.readCheckout(root);
    if (before.dirty || before.revision !== validated.expectedRevision) return finish('blocked','checkout-not-clean-or-revision-mismatch');
    job.state = 'running'; job.history.push('running');
    const evidence = services.createRevisionEvidence(root);
    job.evidence = evidence;
    if (evidence.checkout?.revision !== validated.expectedRevision || evidence.checkoutAfter?.revision !== validated.expectedRevision || evidence.sourceStable !== true) return finish('blocked','source-changed-during-checks');
    return finish(evidence.checks?.passed === true ? 'passed' : 'failed', evidence.checks?.passed === true ? null : 'selected-checks-failed');
  } catch { return finish('failed','local-service-error'); }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    if (args.length !== 3 || args[0] !== '--execute' || args[1] !== 'reference-tests') throw new Error('Usage: --execute reference-tests <expected40hexRevision>');
    const job = runComputerJob(process.cwd(), { version:'v1',service:'reference-tests',expectedRevision:args[2] }, {execute:true});
    console.log(JSON.stringify(job,null,2)); process.exitCode = job.state === 'passed' ? 0 : 1;
  } catch(error) { console.error(error.message); process.exitCode=1; }
}
