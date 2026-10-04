import assert from 'node:assert/strict';
import { dispatchVrhLoop } from '../../lib/petlje/vrh-dispatcher';
import { validateVrhSpajaRequest } from '../../lib/petlje/vrh-spaja-profile';
import { runSpajaPetlja } from '../../lib/petlje';
const input = { start: 1, end: 3, step: 1, target: 3, sequence: [1, 2], maxIterations: 100, maxDurationMs: 1000, status: 'ACTIVATED', spajaTransferPolicy: 'strict', spajaExportFields: ['output'], spajaImportTarget: 'target', spajaSegments: [{ segment: 'RANGE', loops: ['FOR PETLJA'], importFromPrevious: false }, { segment: 'TARGET', loops: ['DOK PETLJA'], importFromPrevious: true }] };
const request = { kind: 'loop-call', version: '0.3', name: 'SPAJA PETLJA', input };
for (const variation of [input, { ...input, maxIterations: 1 }, { ...input, status: 'DISABLED' }, { ...input, step: 0 }]) {
  const req = { ...request, input: variation };
  const actual = dispatchVrhLoop(req, 'reference');
  const direct = runSpajaPetlja(validateVrhSpajaRequest(req));
  for (const field of ['output', 'iterations', 'completed', 'reason', 'status', 'warnings', 'trace'] as const) assert.deepEqual(actual[field], direct[field]);
  assert(actual.iterations <= variation.maxIterations);
}
assert.equal(dispatchVrhLoop(request, 'reference').output, 16); // FOR exports 6; DOK 1→6 sums remaining 4+3+2+1+0 =10
assert.equal(dispatchVrhLoop({ ...request, input: { ...input, spajaSegments: [input.spajaSegments[0], { ...input.spajaSegments[1], importFromPrevious: false }] } }, 'reference').output, 7);
for (const invalid of [{ ...input, spajaTransferPolicy: 'unknown' }, { ...input, spajaSegments: [{ ...input.spajaSegments[0], loops: ['UMBREL PETLJA'] }] }, { ...input, spajaSegments: [{ ...input.spajaSegments[0], loops: ['DIK PETLJA'] }] }, { ...input, spajaSegments: [{ ...input.spajaSegments[0], importFromPrevious: true }] }, { ...input, spajaExportFields: ['output', 'output'] }, { ...input, maxDurationMs: Infinity }, { ...input, extra: true }]) assert.throws(() => dispatchVrhLoop({ ...request, input: invalid }, 'reference'));
assert.throws(() => dispatchVrhLoop(request, 'java'));
const copy = validateVrhSpajaRequest(request); copy.sequence!.push(9); assert.equal(input.sequence.length, 2);
console.log('PASS: SPAJA strict transfer, exact runtime parity, shared iteration budget, blocked/invalid cases and rejected fallback/recursion/Java');
