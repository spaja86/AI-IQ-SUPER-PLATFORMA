import assert from 'node:assert/strict';
import { runDurmitorPetlja, runUmbrelPetlja } from '../../lib/petlje';
const base={start:2,end:2,step:1,target:2,sequence:[1,2],maxDurationMs:1000};
const umbrella=runUmbrelPetlja({...base,maxIterations:1000});
const sufficient=runDurmitorPetlja({...base,maxIterations:1000});
assert.equal(sufficient.iterations,umbrella.iterations+1);
assert.equal(sufficient.output,umbrella.output+9);
assert.equal(sufficient.completed,true);
for(const maxIterations of [1,2,10,umbrella.iterations]) {
 const result=runDurmitorPetlja({...base,maxIterations});
 assert(result.iterations<=maxIterations);
 assert.equal(result.completed,false);
 assert.equal(result.reason,'max-iterations');
 assert.equal(result.trace.length,0);
}
const zero=runDurmitorPetlja({...base,maxIterations:100,maxDurationMs:0});
assert.equal(zero.iterations,0); assert.equal(zero.reason,'time-limit');
for(const maxIterations of [NaN,Infinity]) assert.equal(runDurmitorPetlja({...base,maxIterations}).reason,'invalid-input');
console.log('PASS: DURMITOR nested+layer total budget, sufficient-budget shape, zero-time and invalid budgets');
