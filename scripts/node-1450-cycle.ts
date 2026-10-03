import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { buildAnalysisRound } from '../src/lib/node-1450/cycle';
import { createNode1450Plan } from '../src/lib/node-1450';
import { readDiagnosticArtifact } from '../src/lib/node-1450/diagnostics';

const [target, previousArtifact, ...extra] = process.argv.slice(2);
if (!target || target === '--help') {
  console.log('Usage: npm run node:1450:cycle -- src/lib/extrimli-extrem/index.ts [previous.log]\nRuns local tsc once; prints read-only analysis. Does not repair files, run tests or deploy.');
  if (!target) process.exitCode = 1;
} else {
  try {
    if (extra.length) throw new Error('Unexpected arguments.');
    createNode1450Plan(process.cwd(), 'TypeScript analysis cycle', [target]);
    if (!target.startsWith('src/lib/extrimli-extrem/') || !/\.tsx?$/.test(target)) throw new Error('Select an EXTREM TypeScript target.');
    const previous = previousArtifact ? readDiagnosticArtifact(previousArtifact) : undefined;
    const compiler = resolve(process.cwd(), 'node_modules/typescript/bin/tsc');
    const result = spawnSync(process.execPath, [compiler, '--noEmit', '--incremental', 'false', '--pretty', 'false'], {
      cwd: process.cwd(), encoding: 'utf8', timeout: 120000, maxBuffer: 1024 * 1024,
    });
    if (result.error || result.signal) throw new Error('Typecheck failed to complete (timeout, output limit or process failure).');
    const round = buildAnalysisRound(process.cwd(), target, result.stdout + result.stderr, result.status, previous);
    console.log(JSON.stringify(round, null, 2));
    // Analysis success must not conceal a failing project check.
    process.exitCode = result.status ?? 1;
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Analysis cycle failed.');
    process.exitCode = 1;
  }
}
