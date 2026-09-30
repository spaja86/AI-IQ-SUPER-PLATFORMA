import assert from 'node:assert/strict';
import {
  EXTRIMLI_RUNTIME_CORE_VERSION,
  evaluateExtrimliRuntimeCore,
} from '../../lib/extrimli-runtime-core';

const ready = evaluateExtrimliRuntimeCore({
  technical: ['READY', 'READY'],
  governance: ['READY'],
});
assert.equal(ready.version, EXTRIMLI_RUNTIME_CORE_VERSION);
assert.equal(ready.readiness.status, 'READY');
assert.equal(ready.readiness.score, 100);
assert.equal(ready.governance.promotionAllowed, true);
assert.equal(ready.degraded, false);

const watch = evaluateExtrimliRuntimeCore({
  technical: ['READY'],
  governance: ['WATCH'],
});
assert.equal(watch.readiness.status, 'WATCH');
assert.equal(watch.governance.promotionAllowed, false);
assert.equal(watch.degraded, true);

const blocked = evaluateExtrimliRuntimeCore({
  technical: ['BLOCKED'],
  governance: ['READY'],
});
assert.equal(blocked.readiness.status, 'BLOCKED');
assert.equal(blocked.governance.promotionAllowed, false);

assert.throws(
  () => evaluateExtrimliRuntimeCore({ technical: [], governance: ['READY'] }),
  /requires technical and governance signals/,
);

console.log('EXTRIMLI runtime core tests passed');
