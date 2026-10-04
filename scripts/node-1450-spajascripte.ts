import { createSpajascripteNode1450Plan } from '../src/lib/node-1450/spajascripte';
try {
  if (process.argv.slice(2).length) throw new Error('No arguments accepted; fixed read-only targets only.');
  console.log(JSON.stringify(createSpajascripteNode1450Plan(process.cwd()), null, 2));
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Planning failed');
  process.exitCode = 1;
}
