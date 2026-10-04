import assert from 'node:assert/strict';
import { VRH_INDIVIDUAL_PROFILES, validateVrhProfileRequest, dispatchVrhProfile } from '../../lib/petlje/vrh-individual-profiles';
import { dispatchVrhLoop } from '../../lib/petlje/vrh-dispatcher';
import { resolveVrhLoop } from '../../lib/petlje/vrh-registry';
assert.equal(Object.keys(VRH_INDIVIDUAL_PROFILES).length, 35);
let checks = 0;
for (const [name, profile] of Object.entries(VRH_INDIVIDUAL_PROFILES)) {
  const base = { ...(profile === 'RANGE' ? { start: 3, end: 1, step: -1, target: 2 } : profile === 'TARGET' ? { start: 1, target: 3, step: 1 } : { start: 0, target: 2, sequence: [1, 3, 2] }), maxIterations: 100, maxDurationMs: 1000, status: 'ACTIVATED' };
  for (const input of [base, { ...base, status: 'DISABLED' }, { ...base, maxIterations: 1 }]) {
    const call = validateVrhProfileRequest({ kind: 'loop-call', version: '0.2', name, input });
    const actual = dispatchVrhLoop(call, 'reference'), direct = resolveVrhLoop(name)(call.input);
    for (const key of ['output', 'iterations', 'completed', 'reason', 'status', 'warnings', 'trace', 'statusTrail'] as const) assert.deepEqual(actual[key], direct[key], `${name}: ${key}`);
    assert(actual.iterations <= input.maxIterations);
    checks++;
  }
  const request = { kind: 'loop-call', version: '0.2', name, input: base };
  assert.throws(() => dispatchVrhProfile(request, 'java'));
  for (const invalid of [{ ...base, maxIterations: Infinity }, { ...base, maxDurationMs: 1001 }, { ...base, status: 'AKTIVEJT' }, { ...base, unexpected: true }, { ...base, start: NaN }]) assert.throws(() => validateVrhProfileRequest({ ...request, input: invalid }));
}
for (const name of ['SPAJA PETLJA', 'UMBREL PETLJA', 'DURMITOR PETLJA', '__proto__']) assert.throws(() => validateVrhProfileRequest({ kind: 'loop-call', version: '0.2', name, input: {} }));
assert.throws(() => validateVrhProfileRequest(null));
console.log(`PASS: ${checks} per-profile direct parity/status/budget cases across 35 loops; strict negative and Java rejection`);
