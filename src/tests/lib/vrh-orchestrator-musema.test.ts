import assert from 'node:assert/strict';
import { dispatchVrhLoop } from '../../lib/petlje/vrh-dispatcher';
import { resolveVrhLoop } from '../../lib/petlje/vrh-registry';
import { validateVrhOrchestratorMusema } from '../../lib/petlje/vrh-orchestrator-musema';
const base = { start: 2, end: 2, step: 1, target: 2, sequence: [1,2], maxIterations: 1000, maxDurationMs: 1000, status: 'ACTIVATED' };
for (const name of ['UMBREL PETLJA', 'DURMITOR PETLJA']) {
  for (const input of [base, { ...base, maxIterations: 1 }, { ...base, status: 'DISABLED' }, { ...base, step: 0 }]) {
    const request = { kind: 'loop-call', version: '0.4', name, input };
    const result = dispatchVrhLoop(request, 'reference'), direct = resolveVrhLoop(name)(input as Parameters<ReturnType<typeof resolveVrhLoop>>[0]);
    for (const field of ['output', 'iterations', 'completed', 'reason', 'status', 'warnings', 'trace'] as const) assert.deepEqual(result[field], direct[field]);
    assert(result.iterations <= input.maxIterations);
  }
  const request = { kind: 'loop-call', version: '0.4', name, input: base };
  assert.throws(() => dispatchVrhLoop(request, 'java'));
  for (const input of [{ ...base, maxIterations: NaN }, { ...base, maxDurationMs: 1001 }, { ...base, sequence: Array(1001).fill(1) }, { ...base, spajaSegments: [] }, { ...base, target: Infinity }]) assert.throws(() => validateVrhOrchestratorMusema({ ...request, input }));
}
for (const name of ['SPAJA PETLJA', '__proto__', 'FOR PETLJA']) assert.throws(() => dispatchVrhLoop({ kind: 'loop-call', version: '0.4', name, input: base }, 'reference'));
console.log('PASS: UMBREL/DURMITOR mušema parity, total budgets, strict fields and Java/unsupported-name rejection');
