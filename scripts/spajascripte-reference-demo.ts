import { runReferenceProgram } from '../src/lib/petlje/spajascripte-reference-program';
const source = `LET start = 1
LET end = 3
CALL FOR PETLJA FROM start TO end STEP 1 LIMIT 10 TIMEOUT 1000 AS result
PRINT result.output
PRINT result.status`;
console.log(JSON.stringify(runReferenceProgram(source), null, 2));
