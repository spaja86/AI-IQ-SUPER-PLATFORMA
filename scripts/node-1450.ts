import { analyzeTypeScriptDiagnostics, readDiagnosticArtifact } from '../src/lib/node-1450/diagnostics';
import { createNode1450Plan } from '../src/lib/node-1450';

const args = process.argv.slice(2);
const [goal, ...files] = args;
if (!goal || goal === '--help') {
  console.log('Usage: npm run node:1450 -- "goal" src/path.ts [docs/path.md ...]\nRead-only planner: validates paths and prints JSON; never executes checks or changes code.');
  if (!goal) process.exitCode = 1;
} else {
  try {
    if (goal === '--diagnostics') {
      if (files.length !== 2) throw new Error('Usage: --diagnostics artifact.log src/lib/extrimli-extrem/file.ts');
      console.log(JSON.stringify(analyzeTypeScriptDiagnostics(process.cwd(), readDiagnosticArtifact(files[0]), files[1]), null, 2));
    } else {
      console.log(JSON.stringify(createNode1450Plan(process.cwd(), goal, files), null, 2));
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Planning failed.');
    process.exitCode = 1;
  }
}
