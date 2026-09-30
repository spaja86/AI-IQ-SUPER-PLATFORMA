import assert from 'node:assert/strict';
import { getExtrimliExtremProfilerReport } from '../../lib/extrimli-extrem';
import { aggregateReadinessStatus } from '../../lib/extrimli-readiness';
import { evaluateExtrimliExtremRuntimeCore } from '../../lib/extrimli-runtime-core/extrem-adapter';

const report = getExtrimliExtremProfilerReport();
const result = evaluateExtrimliExtremRuntimeCore(report);

assert(['READY', 'WATCH', 'BLOCKED'].includes(result.readiness.status));
assert(result.readiness.score >= 0 && result.readiness.score <= 100);
assert.equal(
  result.governance.status,
  aggregateReadinessStatus([
    report.dokDikDakDukConsistencyHealth.status,
    report.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.readiness.status,
  ]),
);
assert.equal(result.governance.promotionAllowed, result.readiness.status === 'READY');
assert.equal(result.degraded, result.readiness.status !== 'READY');

console.log('EXTRIMLI EXTREM runtime core adapter tests passed');
