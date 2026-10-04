import { parseLoopCall, executeLoopCall } from '../src/lib/petlje/spajascripte-loop-adapter';
const source = 'LOOP {"name":"FOR PETLJA","input":{"start":1,"end":3,"step":1,"maxIterations":10,"maxDurationMs":1000,"status":"ACTIVATED"}}';
console.log(JSON.stringify({ target: 'existing-typescript-reference', ast: parseLoopCall(source), result: executeLoopCall(parseLoopCall(source), 'reference') }, null, 2));
