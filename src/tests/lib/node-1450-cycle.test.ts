import assert from 'node:assert/strict';
import { buildAnalysisRound, compareDiagnosticRounds } from '../../lib/node-1450/cycle';
const target = 'src/lib/extrimli-extrem/index.ts';
const log = `${target}(1,1): error TS2322: mismatch`;
const failed = buildAnalysisRound(process.cwd(), target, log, 2, log);
assert.equal(failed.typecheckPassed, false);
assert.equal(failed.codeChanged, false);
assert.equal(failed.testsExecuted, false);
assert.equal(failed.comparison?.[0].countDelta, 0);
const passed = buildAnalysisRound(process.cwd(), target, '', 0, log);
assert.equal(passed.typecheckPassed, true);
assert.equal(passed.comparison?.[0].countDelta, -1);
assert.deepEqual(compareDiagnosticRounds({ TS2322: 2 }, { TS2345: 1 }), [
  { code: 'TS2322', before: 2, after: 0, countDelta: -2 },
  { code: 'TS2345', before: 0, after: 1, countDelta: 1 },
]);
assert.throws(() => buildAnalysisRound(process.cwd(), target, '', 2));
assert.throws(() => buildAnalysisRound(process.cwd(), target, log, 0));
assert.throws(() => buildAnalysisRound(process.cwd(), target, log, null));
assert.throws(() => buildAnalysisRound(process.cwd(), '../outside.ts', '', 0));
console.log('NODE 1450 cycle tests passed.');
