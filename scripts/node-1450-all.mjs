import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function discoverLanguages(root) {
  const extensions = new Set();
  let visited = 0;
  function walk(dir, depth = 0) {
    if (depth > 30) throw new Error('Discovery depth limit exceeded.');
    for (const item of readdirSync(dir, { withFileTypes: true })) {
      if (++visited > 50000) throw new Error('Discovery file limit exceeded.');
      if (item.name.startsWith('.') || item.isSymbolicLink()) continue;
      if (item.isDirectory()) walk(resolve(dir, item.name), depth + 1);
      else extensions.add(item.name.split('.').pop());
    }
  }
  for (const dir of ['src', 'scripts', 'contracts']) {
    const path = resolve(root, dir);
    if (existsSync(path)) walk(path);
  }
  const languages = { TypeScript: ['ts', 'tsx'], JavaScript: ['js', 'mjs', 'cjs'], Python: ['py'], Solidity: ['sol'], Rust: ['rs'], Go: ['go'], Java: ['java'] };
  return Object.entries(languages).filter(([, exts]) => exts.some(ext => extensions.has(ext))).map(([name]) => ({
    language: name, status: ['TypeScript', 'JavaScript'].includes(name) ? 'bounded-adapter' : 'unsupported-not-executed',
  }));
}

export function checks(root) {
  const bin = name => resolve(root, 'node_modules', name);
  return [
    { name: 'typecheck', args: [bin('typescript/bin/tsc'), '--noEmit', '--incremental', 'false', '--pretty', 'false'] },
    { name: 'node1450-lint', args: [bin('eslint/bin/eslint.js'), 'src/lib/node-1450', 'scripts/node-1450.ts', 'scripts/node-1450-cycle.ts', 'scripts/node-1450-all.mjs'] },
    ...['node-1450', 'node-1450-diagnostics', 'node-1450-cycle'].map(name => ({ name, args: [bin('tsx/dist/cli.mjs'), `src/tests/lib/${name}.test.ts`] })),
    { name: 'orchestrator-tests', args: ['--test', 'src/tests/node-1450-all.test.mjs'] },
  ];
}

export function runChecks(root, runner = spawnSync) {
  const results = [];
  for (const check of checks(root)) {
    const result = runner(process.execPath, check.args, { cwd: root, encoding: 'utf8', timeout: 120000, maxBuffer: 1024 * 1024, shell: false });
    const status = result.error || result.signal || result.status === null ? 'execution-error' : result.status === 0 ? 'passed' : 'failed';
    results.push({ name: check.name, status, exitCode: result.status ?? null, signal: result.signal ?? null });
    // Do not print source/diagnostic output which might include sensitive data.
    if (status !== 'passed') break;
  }
  return { checks: results, skipped: checks(root).slice(results.length).map(c => c.name),
    passed: results.length === checks(root).length && results.every(r => r.status === 'passed'),
    codeChanged: false, deploymentExecuted: false, paymentsExecuted: false };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.length !== 1 || args[0] !== '--check') {
    console.log('Usage: npm run node:1450:all -- --check\nFixed checks only; stops on first failure. No arbitrary scripts, repairs, deployments or payments.');
    process.exitCode = args[0] === '--help' ? 0 : 1;
  } else {
    try {
      const root = process.cwd();
      const languages = discoverLanguages(root);
      const report = runChecks(root);
      console.log(JSON.stringify({ languages, ...report }, null, 2));
      process.exitCode = report.passed ? 0 : 1;
    } catch {
      console.error('Check orchestration failed. No success is claimed.');
      process.exitCode = 1;
    }
  }
}
