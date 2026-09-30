import assert from 'node:assert/strict';
import { getExtrimliExtrondolReport } from '../../lib/extrimli-extrondol';
import { aggregateReadinessStatus } from '../../lib/extrimli-readiness';
import { evaluateExtrimliExtrondolRuntimeCore } from '../../lib/extrimli-runtime-core/extrondol-adapter';

const report = getExtrimliExtrondolReport();
const result = evaluateExtrimliExtrondolRuntimeCore(report);
const reflectionStatus = report.developerAndCreateRepoWideReflection.status;
const freezeStatus = report.rollout.promotionFreeze ? 'BLOCKED' : 'READY';

assert(['READY', 'WATCH', 'BLOCKED'].includes(result.readiness.status));
assert(result.readiness.score >= 0 && result.readiness.score <= 100);
assert.equal(result.governance.status, aggregateReadinessStatus([reflectionStatus, freezeStatus]));
assert.equal(result.governance.promotionAllowed, result.readiness.status === 'READY');
assert.equal(result.degraded, result.readiness.status !== 'READY');

console.log('EXTRIMLI EXTRONDOL runtime core adapter tests passed');
