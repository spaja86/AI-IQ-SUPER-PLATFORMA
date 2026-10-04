/** Read-only connection catalog. No historical test result is promoted to live evidence. */
export function getDigitalniKompjuterToolchain() {
  return {
    mode: 'read-only-catalog', runtimeVerified: false, executionEnabled: false,
    javaBuildVerified: false, nextBuildVerified: false, evidence: { status: 'not-attached', sourceRevision: null },
    modules: [
      { id: 'vrh', name: 'VRH — petlje i mušeme', role: 'reference-dispatch', reference: 'docs/VRH-ORCHESTRATOR-MUSEMA.md', status: 'declared-not-live-verified' },
      { id: 'spajascripte', name: 'Spajascripte', role: 'reference-language', reference: 'docs/SPAJASCRIPTE-ALL-VRH-CALLS.md', status: 'declared-not-live-verified' },
      { id: 'aiiq', name: 'AI IQ programski jezik', role: 'read-only-build-plan', reference: 'docs/AIIQ-PLAN-EXECUTION-SEPARATION.md', status: 'declared-not-live-verified' },
      { id: 'node1450', name: 'NODE 1450', role: 'read-only-analysis', reference: 'docs/NODE1450-SPAJASCRIPTE.md', status: 'declared-not-live-verified' },
      { id: 'checks', name: 'Lokalne provere', role: 'explicit-opt-in-fixed-tests', reference: 'docs/LOCAL-VERIFICATION-RUNNER.md', status: 'not-executed-by-catalog' },
    ],
    procedure: ['Review source revision and module contracts', 'Request explicit fixed-suite checks separately', 'Attach revision-bound evidence in a future reviewed integration', 'Never treat plan/catalog as execution approval'],
  };
}
