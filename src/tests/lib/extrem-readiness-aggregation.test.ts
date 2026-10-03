import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { aggregateReadinessStatus, aggregateSignalReadinessStatus } from '../../lib/extrimli-readiness';
assert.equal(aggregateReadinessStatus(['READY', 'WATCH']), 'WATCH');
assert.equal(aggregateReadinessStatus(['READY', 'WATCH', 'BLOCKED']), 'BLOCKED');
assert.equal(aggregateReadinessStatus(['READY', 'READY']), 'READY');
assert.throws(() => aggregateReadinessStatus([]));
assert.equal(aggregateSignalReadinessStatus({ status: 'READY', audioVisualSyncStatus: 'WATCH', spatialEffectStatus: 'READY' }), 'WATCH');
// Regression: EXTREM status arrays must not be passed to the object-signal adapter.
const source = readFileSync(new URL('../../lib/extrimli-extrem/index.ts', import.meta.url), 'utf8');
assert.equal((source.match(/aggregateSignalReadinessStatus\(/g) ?? []).length, 1);
assert.ok(source.includes('aggregateSignalReadinessStatus(signal)'));
assert.ok(source.includes('const notes1450Status = aggregateReadinessStatus(notes1450FinalStatuses)'));
console.log('EXTREM readiness aggregation regressions passed.');
