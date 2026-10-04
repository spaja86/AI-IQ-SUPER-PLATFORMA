import assert from 'node:assert/strict';
import { runUmbrelPetlja } from '../../lib/petlje';
const base={start:1,end:3,step:1,target:3,sequence:[1,2,3],maxDurationMs:1000};
for(const maxIterations of [1,2,3,10,100]) {
 const result=runUmbrelPetlja({...base,maxIterations});
 assert(result.iterations<=maxIterations);
 if(maxIterations===1) { assert.equal(result.iterations,1); assert.equal(result.trace.length,1); assert.equal(result.reason,'max-iterations'); }
}
const zero=runUmbrelPetlja({...base,maxIterations:100,maxDurationMs:0});
assert.equal(zero.iterations,0); assert.equal(zero.trace.length,0); assert.equal(zero.reason,'time-limit');
for(const maxIterations of [NaN,Infinity,0]) assert.equal(runUmbrelPetlja({...base,maxIterations}).reason,'invalid-input');
assert.equal(runUmbrelPetlja({...base,maxIterations:10,status:'DISABLED'}).iterations,0);
console.log('PASS: UMBREL total iteration cap, no post-budget children, zero-time and invalid finite budgets');
