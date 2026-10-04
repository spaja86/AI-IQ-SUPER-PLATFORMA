import assert from 'node:assert/strict';
import { getSpajaServerControlPlane } from '../../lib/spaja-server-control-plane';
const report=getSpajaServerControlPlane();
assert.equal(report.runtime,'vercel-functions'); assert.equal(report.providesJdk,false);assert.equal(report.buildWorkerImplemented,false);assert.equal(report.executionEnabled,false);assert.equal(report.availabilityVerified,false);
assert.equal(report.adapters.length,3);
assert(report.adapters.every(a=>Object.keys(a).sort().join(',')==='configured,id,role'));
console.log('PASS: SPAJA SERVER presence-only metadata, no secret values or toolchain/availability claims');
