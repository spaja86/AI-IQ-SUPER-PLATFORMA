import assert from 'node:assert/strict';
import { runForPetlja } from '../../lib/petlje';
import { parseLoopCall, executeLoopCall, validateLoopCall } from '../../lib/petlje/spajascripte-loop-adapter';
const base = { start: 1, end: 3, step: 1, maxIterations: 10, maxDurationMs: 1000, status: 'ACTIVATED' };
function source(input = base, name = 'FOR PETLJA') { return `LOOP ${JSON.stringify({ name, input })}`; }
for (const input of [base, { ...base, start: 3, end: 1, step: -1 }, { ...base, step: 0 }, { ...base, maxIterations: 1 }, { ...base, status: 'DISABLED' }]) {
  const call = parseLoopCall(source(input));
  const actual = executeLoopCall(call, 'reference');
  const expected = runForPetlja(call.input);
  for (const key of ['output', 'iterations', 'reason', 'status', 'completed', 'warnings', 'trace', 'statusTrail'] as const) assert.deepEqual(actual[key], expected[key]);
  assert(actual.iterations <= input.maxIterations);
}
assert.equal(parseLoopCall(source(base, 'SPAJA PETLJA')).name, 'SPAJA PETLJA');
assert.throws(() => executeLoopCall(parseLoopCall(source(base, 'SPAJA PETLJA')), 'reference'));
assert.throws(() => executeLoopCall(parseLoopCall(source()), 'java'));
for (const name of ['__proto__', 'constructor', 'REPEAT']) assert.throws(() => parseLoopCall(source(base, name)));
for (const input of [{ ...base, maxIterations: 1001 }, { ...base, maxDurationMs: 0 }, { ...base, maxIterations: 1.5 }, { ...base, status: 'AKTIVEJT' }, { ...base, secret: 'not-allowed' }, { ...base, end: null }]) assert.throws(() => parseLoopCall(`LOOP ${JSON.stringify({ name: 'FOR PETLJA', input })}`));
assert.throws(() => parseLoopCall('LOOP {}\nPRINT 1'));
assert.throws(() => validateLoopCall({ kind: 'loop-call', version: '0.1', name: 'FOR PETLJA', input: { ...base, step: Infinity } }));
assert.throws(() => validateLoopCall(null));
console.log('PASS: FOR reference parity, guard/status preservation, strict schema, unknown and unsupported targets rejected');
