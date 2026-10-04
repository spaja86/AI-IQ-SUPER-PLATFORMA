import assert from 'node:assert/strict';
import { prepareIndirectWork, executeIndirectWork } from '../../../scripts/indirect-work-handoff';
const plan=prepareIndirectWork(process.cwd(),'a'.repeat(40));
assert.equal(plan.executionApproved,false);assert.equal(plan.plan.checksExecuted,false);
assert.equal(executeIndirectWork(process.cwd(),'a'.repeat(40),{execute:false}).job.state,'blocked');
assert.throws(()=>prepareIndirectWork(process.cwd(),'main'));
console.log('PASS: indirect planner handoff, work mušema and separate execution opt-in');
