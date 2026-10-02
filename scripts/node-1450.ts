import { createNode1450Plan } from '../src/lib/node-1450';

const [goal, ...files] = process.argv.slice(2);
if (!goal || goal === '--help') {
  console.log('Usage: npm run node:1450 -- "goal" src/path.ts [docs/path.md ...]\nRead-only planner: validates paths and prints JSON; never executes checks or changes code.');
  if (!goal) process.exitCode = 1;
} else {
  try {
    console.log(JSON.stringify(createNode1450Plan(process.cwd(), goal, files), null, 2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Planning failed.');
    process.exitCode = 1;
  }
}
