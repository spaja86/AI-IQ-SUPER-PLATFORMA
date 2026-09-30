import assert from 'node:assert/strict';
import { getExtrimliSpajaKodReport } from '../../lib/extrimli-extrondol';
import { aggregateReadinessStatus } from '../../lib/extrimli-readiness';
import { evaluateExtrimliSpajaKodRuntimeCore } from '../../lib/extrimli-runtime-core/spaja-kod-adapter';

const facade = getExtrimliSpajaKodReport();
const result = evaluateExtrimliSpajaKodRuntimeCore(facade);
const systemStatus = facade.publicSignals.systemStatus === 'STABLE'
  ? 'READY'
  : facade.publicSignals.systemStatus === 'ATTENTION'
    ? 'WATCH'
    : 'BLOCKED';
const governanceStatus = aggregateReadinessStatus([
  facade.readiness.promotionFreeze ? 'BLOCKED' : 'READY',
  facade.completeness.exportReady ? 'READY' : 'WATCH',
]);

assert(['READY', 'WATCH', 'BLOCKED'].includes(result.readiness.status));
assert(result.readiness.score >= 0 && result.readiness.score <= 100);
assert.equal(result.governance.status, governanceStatus);
assert.equal(result.governance.promotionAllowed, result.readiness.status === 'READY');
assert.equal(result.degraded, result.readiness.status !== 'READY');
assert.equal(result.readiness.status, aggregateReadinessStatus([facade.readiness.status, systemStatus, governanceStatus]));

console.log('EXTRIMLI SPAJA KOD runtime core adapter tests passed');
