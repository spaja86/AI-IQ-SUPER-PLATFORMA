/** Browser-only format validation; never authenticates a local JSON report. */
export function summarizeLocalEvidence(text: string) {
  if (typeof text !== 'string' || text.length > 65536) throw new Error('Report too large');
  const value = JSON.parse(text);
  const names = ['spajascripte-vrh-calls','vrh-individual-profiles','vrh-orchestrator-musema','spaja-fallback-isolation','aiiq-plan-policy'];
  if (!value || value.format !== 'local-reference-evidence-v2' || value.trust !== 'unsigned-local-observation') throw new Error('Unsupported report');
  for (const checkout of [value.checkout, value.checkoutAfter]) {
    if (!checkout || !/^[a-f0-9]{40}$/.test(checkout.revision) || !/^[a-f0-9]{64}$/.test(checkout.sourceDigest) || checkout.digestScope !== 'tracked-toolchain-v1' || typeof checkout.dirty !== 'boolean') throw new Error('Invalid provenance');
  }
  const stable = !value.checkout.dirty && !value.checkoutAfter.dirty && value.checkout.revision === value.checkoutAfter.revision && value.checkout.sourceDigest === value.checkoutAfter.sourceDigest;
  if (value.sourceStable !== stable || !Number.isFinite(Date.parse(value.startedAt)) || !Number.isFinite(Date.parse(value.finishedAt)) || Date.parse(value.finishedAt) < Date.parse(value.startedAt)) throw new Error('Invalid report dates/stability');
  const c = value.checks;
  if (!c || c.suite !== 'reference-tests' || c.scope !== 'selected-local-tests-only' || c.javaBuildVerified !== false || c.nextBuildVerified !== false || c.deploymentExecuted !== false || !Array.isArray(c.results) || !c.results.length || c.results.length > names.length || !Array.isArray(c.skipped)) throw new Error('Invalid check report');
  const rows = c.results.map((r: {name: string; status: string; exitCode: number | null; signal: string | null; durationMs: number}, i: number) => {
    if (!r || r.name !== names[i] || !['passed','failed','execution-error'].includes(r.status) || !Number.isFinite(r.durationMs) || r.durationMs < 0 || !(r.exitCode === null || Number.isInteger(r.exitCode)) || !(r.signal === null || typeof r.signal === 'string') || (r.status === 'passed' && (r.exitCode !== 0 || r.signal !== null)) || (i < c.results.length - 1 && r.status !== 'passed')) throw new Error('Invalid row');
    return { name: r.name, status: r.status, exitCode: r.exitCode, durationMs: r.durationMs };
  });
  const passed = rows.length === names.length && rows.every((r: {status: string}) => r.status === 'passed');
  if (c.passed !== passed || JSON.stringify(c.skipped) !== JSON.stringify(names.slice(rows.length))) throw new Error('Inconsistent checks');
  return { revision: value.checkout.revision as string, sourceDigest: value.checkout.sourceDigest as string, finishedAt: value.finishedAt as string, rows,
    status: stable ? 'reported-current-checkout-unverified' : 'stale-at-creation', trusted: false, currentDeploymentCompared: false, executionEnabled: false };
}
