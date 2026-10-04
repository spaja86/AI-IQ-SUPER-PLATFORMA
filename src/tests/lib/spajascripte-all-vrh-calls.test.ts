import assert from 'node:assert/strict';
import { runReferenceProgram } from '../../lib/petlje/spajascripte-reference-program';
import { VRH_INDIVIDUAL_PROFILES } from '../../lib/petlje/vrh-individual-profiles';
import { dispatchVrhLoop } from '../../lib/petlje/vrh-dispatcher';
let checked = 0;
const budget = { maxIterations: 1000, maxDurationMs: 1000, status: 'ACTIVATED' };
for (const [name, profile] of Object.entries(VRH_INDIVIDUAL_PROFILES)) {
 const input = { ...(profile === 'RANGE' ? { start: 3, end: 1, step: -1, target: 2 } : profile === 'TARGET' ? { start: 1, target: 3, step: 1 } : { start: 0, target: 2, sequence: [1,3,2] }), ...budget };
 const report = runReferenceProgram(`CALL "${name}" WITH ${JSON.stringify(input)} AS result\nPRINT result.status`);
 assert.equal(report.results[0].result.output, dispatchVrhLoop({kind:'loop-call',version:'0.2',name,input},'reference').output); checked++;
}
for (const name of ['UMBREL PETLJA','DURMITOR PETLJA']) {
 const input={start:2,end:2,step:1,target:2,sequence:[1,2],...budget};
 assert.equal(runReferenceProgram(`CALL "${name}" WITH ${JSON.stringify(input)} AS r\nPRINT r.completed`).results[0].result.kind,name); checked++;
}
const input={start:1,end:3,step:1,target:3,sequence:[1,2],...budget,spajaTransferPolicy:'strict',spajaExportFields:['output'],spajaImportTarget:'target',spajaSegments:[{segment:'RANGE',loops:['FOR PETLJA'],importFromPrevious:false},{segment:'TARGET',loops:['DOK PETLJA'],importFromPrevious:true}]};
const source=`CALL "SPAJA PETLJA" WITH ${JSON.stringify(input)} AS r\nPRINT r.transferEvents\nPRINT r.fallbackSummary\nPRINT r.output`;
const report=runReferenceProgram(source); assert.equal(report.output[2],'16'); assert(JSON.parse(report.output[0]).some((e:{event:string})=>e.event==='import')); checked++;
assert.equal(checked,38);
for(const source of ['CALL "unknown" WITH {} AS r','CALL "FOR PETLJA" WITH {bad} AS r','CALL "FOR PETLJA" WITH {} AS r','PRINT r.transferEvents']) assert.throws(()=>runReferenceProgram(source));
const partial={...input,spajaTransferPolicy:'fallback',spajaSegments:[{segment:'RANGE',loops:['FOR PETLJA','NIK PETLJA'],importFromPrevious:false}]};
assert.throws(()=>runReferenceProgram(`CALL "SPAJA PETLJA" WITH ${JSON.stringify(partial)} AS r\nPRINT r.output`));
console.log('PASS: all38 CALL profiles, result audit retention, strict input and partial-output rejection');
