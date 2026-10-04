import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const cases = Object.freeze([
  { name: 'spajascripte-vrh-calls', file: 'src/tests/lib/spajascripte-all-vrh-calls.test.ts' },
  { name: 'vrh-individual-profiles', file: 'src/tests/lib/vrh-individual-profiles.test.ts' },
  { name: 'vrh-orchestrator-musema', file: 'src/tests/lib/vrh-orchestrator-musema.test.ts' },
  { name: 'spaja-fallback-isolation', file: 'src/tests/lib/spaja-fallback-isolation.test.ts' },
  { name: 'aiiq-plan-policy', file: 'src/tests/lib/aiiq-compiled-build-plan.test.ts' },
]);

/** Test opt-in is not identity authorization; run only in a trusted reviewed checkout. */
export function runLocalVerification(root, options, runner = spawnSync) {
  if (options?.execute !== true || options?.suite !== 'reference-tests' || Object.keys(options).sort().join(',') !== 'execute,suite') throw new Error('Explicit fixed-suite execution opt-in required');
  const results = [];
  for (const test of cases) {
    const start = performance.now();
    const result = runner(process.execPath, [resolve(root, 'node_modules/tsx/dist/cli.mjs'), test.file], {
      cwd: root, shell: false, encoding: 'utf8', timeout: 30000, maxBuffer: 65536,
      env: { PATH: process.env.PATH ?? '', HOME: process.env.HOME ?? '', LANG: 'C.UTF-8' },
    });
    const status = result.error || result.signal || result.status === null || result.status === undefined ? 'execution-error' : result.status === 0 ? 'passed' : 'failed';
    results.push({ name: test.name, status, exitCode: result.status ?? null, signal: result.signal ?? null, durationMs: Math.round(performance.now() - start) });
    if (status !== 'passed') break;
  }
  return { suite: 'reference-tests', results, skipped: cases.slice(results.length).map(c => c.name),
    passed: results.length === cases.length && results.every(r => r.status === 'passed'),
    javaBuildVerified: false, nextBuildVerified: false, deploymentExecuted: false, scope: 'selected-local-tests-only' };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.slice(2).join(' ') !== '--execute reference-tests') throw new Error('Usage: node scripts/local-verification.mjs --execute reference-tests');
    const report = runLocalVerification(process.cwd(), { execute: true, suite: 'reference-tests' });
    console.log(JSON.stringify(report, null, 2));
    process.exitCode = report.passed ? 0 : 1;
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
