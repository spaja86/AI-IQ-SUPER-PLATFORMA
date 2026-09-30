import assert from 'node:assert/strict';
import { aggregateReadinessStatus } from '../../lib/extrimli-readiness';
import { getExtrimliRuntimeCoreFacade } from '../../lib/extrimli-runtime-core/facade';

const facade = getExtrimliRuntimeCoreFacade();
const surfaces = [facade.extrem, facade.extrondol, facade.spajaKod];

for (const surface of surfaces) {
  assert(['READY', 'WATCH', 'BLOCKED'].includes(surface.readiness.status));
  assert(surface.readiness.score >= 0 && surface.readiness.score <= 100);
}

assert.equal(
  facade.unified.readiness.status,
  aggregateReadinessStatus(surfaces.map((surface) => surface.readiness.status)),
);
assert.equal(facade.unified.governance.promotionAllowed, facade.unified.readiness.status === 'READY');
assert.equal(facade.unified.degraded, facade.unified.readiness.status !== 'READY');

console.log('EXTRIMLI runtime core facade tests passed');
