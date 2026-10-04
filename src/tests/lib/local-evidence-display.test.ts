import assert from 'node:assert/strict';
import { summarizeLocalEvidence } from '../../lib/local-evidence-display';
const checkout={revision:'a'.repeat(40),sourceDigest:'b'.repeat(64),digestScope:'tracked-toolchain-v1',dirty:false};
const names=['spajascripte-vrh-calls','vrh-individual-profiles','vrh-orchestrator-musema','spaja-fallback-isolation','aiiq-plan-policy'];
const value={format:'local-reference-evidence-v2',trust:'unsigned-local-observation',checkout,checkoutAfter:checkout,sourceStable:true,startedAt:'2026-10-04T00:00:00Z',finishedAt:'2026-10-04T00:00:01Z',checks:{suite:'reference-tests',scope:'selected-local-tests-only',javaBuildVerified:false,nextBuildVerified:false,deploymentExecuted:false,results:names.map(name=>({name,status:'passed',exitCode:0,signal:null,durationMs:1})),skipped:[],passed:true}};
const report=summarizeLocalEvidence(JSON.stringify(value));assert.equal(report.trusted,false);assert.equal(report.currentDeploymentCompared,false);assert.equal(report.rows.length,5);
for(const bad of [{}, {...value,sourceStable:false},{...value,checks:{...value.checks,nextBuildVerified:true}},{...value,checks:{...value.checks,passed:false}}]) assert.throws(()=>summarizeLocalEvidence(JSON.stringify(bad)));
assert.throws(()=>summarizeLocalEvidence('x'.repeat(65537)));
console.log('PASS: browser local report validation, no deployment/authentication claims and invalid evidence rejection');
