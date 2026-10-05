import assert from 'node:assert/strict';
import { prepareKreatorijumIndirektPlan, executeKreatorijumIndirekt, runKreatorijumLocalCommand } from '../../lib/kreatorijum-local-service';
import { runIndirektPetlja } from '../../lib/petlje/indirekt-petlja';
const input = { start: 0, target: 10, sequence: [3, 1, 7, 10], maxIterations: 100, maxDurationMs: 1000, status: 'ACTIVATED' };
const options = { execute: true, mode: 'local-reference' };
const plan = prepareKreatorijumIndirektPlan(process.cwd(), input);
assert.equal(plan.executionPerformed, false);
assert.equal(plan.executionEnabled, false);
assert.equal(plan.authorizationGranted, false);
assert.equal(plan.plan.checksExecuted, false);
assert.equal(plan.plan.humanReviewRequired, true);
input.sequence[0] = 2;
assert.equal(plan.request.input.sequence![0], 3);
for (const invalid of [undefined, null, {}, plan, { execute: false, mode: 'local-reference' }, { execute: true, mode: 'java' }, { ...options, approval: true }]) {
  assert.throws(() => executeKreatorijumIndirekt(input, invalid));
}
let cases = 0;
for (const variation of [input, { ...input, status: 'DISABLED' }, { ...input, maxIterations: 1 }, { ...input, sequence: [] }, { ...input, sequence: [20, 15, 10] }]) {
  const actual = executeKreatorijumIndirekt(variation, options);
  const direct = runIndirektPetlja(variation);
  for (const key of ['output', 'iterations', 'completed', 'reason', 'status', 'trace', 'statusTrail', 'warnings'] as const) assert.deepEqual(actual.result[key], direct[key]);
  assert.equal(actual.numericalOutputUsable, direct.completed && direct.reason === 'completed');
  assert.equal(actual.authorizationGranted, false);
  assert.equal(actual.deploymentExecuted, false);
  cases++;
}
for (const invalid of [{ ...input, maxIterations: 0 }, { ...input, sequence: [Infinity] }, { ...input, unexpected: true }, { ...input, status: 'UNKNOWN' }]) {
  assert.throws(() => prepareKreatorijumIndirektPlan(process.cwd(), invalid));
  assert.throws(() => executeKreatorijumIndirekt(invalid, options));
}
const json = JSON.stringify(input);
assert.equal(runKreatorijumLocalCommand(process.cwd(), ['indirekt-plan', json]).executionPerformed, false);
assert.equal(runKreatorijumLocalCommand(process.cwd(), ['indirekt-run', json, '--execute']).executionPerformed, true);
for (const args of [['indirekt-run', json], ['indirekt-run', json, '--approve'], ['indirekt-plan', json, '--execute'], ['indirekt-run', json, '--execute', 'extra'], ['unknown', json], ['indirekt-plan', '{broken}']]) assert.throws(() => runKreatorijumLocalCommand(process.cwd(), args));
console.log(`PASS: KREATORIJUM plan/execution separation, ${cases} INDIREKT direct parity cases, strict inputs and CLI opt-in`);
