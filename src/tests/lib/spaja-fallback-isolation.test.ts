import assert from 'node:assert/strict';
import { dispatchVrhLoop } from '../../lib/petlje/vrh-dispatcher';
const input = { start: 1, end: 3, step: 1, target: 3, sequence: [1,2], maxIterations: 100, maxDurationMs: 1000, status: 'ACTIVATED', spajaTransferPolicy: 'fallback', spajaExportFields: ['output'], spajaImportTarget: 'start', spajaSegments: [{ segment: 'RANGE', loops: ['FOR PETLJA'], importFromPrevious: false }, { segment: 'TARGET', loops: ['DOK PETLJA', 'ITCH PETLJA'], importFromPrevious: true }] };
const request = { kind: 'loop-call', version: '0.3', name: 'SPAJA PETLJA', input };
const result = dispatchVrhLoop(request, 'reference');
assert.equal(result.completed, true); // traversal finished, not all children succeeded
assert.equal(result.fallbackSummary!.successful, false);
assert(result.fallbackSummary!.skipped.some(s => s.loop === 'DOK PETLJA'));
assert.equal(result.output, 9); // 6 from FOR + 3 from ITCH using original start=1, not imported 6
assert(result.transferEvents!.some(e => e.event === 'rollback' && e.loop === 'DOK PETLJA'));
assert(result.transferEvents!.some(e => e.event === 'export' && e.loop === 'ITCH PETLJA' && e.value === 3));
assert.equal(input.start, 1);
const strict = dispatchVrhLoop({ ...request, input: { ...input, spajaTransferPolicy: 'strict' } }, 'reference');
assert.equal(strict.completed, false); assert.equal(strict.fallbackSummary!.successful, false);
assert(!strict.transferEvents!.some(e => e.loop === 'ITCH PETLJA'));
const success = dispatchVrhLoop({ ...request, input: { ...input, spajaImportTarget: 'target', spajaSegments: [input.spajaSegments[0], { segment: 'TARGET', loops: ['DOK PETLJA'], importFromPrevious: true }] } }, 'reference');
assert.equal(success.fallbackSummary!.successful, true); assert.deepEqual(success.fallbackSummary!.skipped, []);
console.log('PASS: failed import rollback, partial outcome, continuation, successful fallback and strict stop');
