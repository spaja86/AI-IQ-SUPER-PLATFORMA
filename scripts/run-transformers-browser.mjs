// Run server, readiness probe and browser in one process tree/network namespace.
// Never binds a public interface or calls a deployment command.
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { resolve } from 'node:path';

const mode = process.env.TRANSFORMERS_SERVER_MODE || 'production';
if (!['production', 'development'].includes(mode)) throw new Error('Invalid server mode');
const port = Number(process.env.TRANSFORMERS_PORT || 3138);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Invalid port');
const output = resolve(process.env.TRANSFORMERS_RESULTS_DIR || 'test-results/transformers');
await mkdir(output, { recursive: true });
const url = `http://127.0.0.1:${port}`;
const log = createWriteStream(resolve(output, `server-${mode}.log`));
const args = mode === 'production' ? ['start'] : ['dev', '--webpack'];
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', ...args, '--hostname', '127.0.0.1', '--port', String(port)], {
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' }, stdio: ['ignore', 'pipe', 'pipe'],
});
server.stdout.pipe(log); server.stderr.pipe(log);
let exited = false;
server.on('exit', () => { exited = true; });
let tests;
const stop = () => { tests?.kill('SIGTERM'); server.kill('SIGTERM'); };
process.on('SIGINT', stop); process.on('SIGTERM', stop);
try {
  const started = Date.now();
  let ready;
  while (Date.now() - started < 120000 && !exited) {
    try {
      const response = await fetch(`${url}/transformers`, { signal: AbortSignal.timeout(60000) });
      const html = await response.text();
      if (response.ok && html.includes('SPREMAN ZA DUEL?')) {
        ready = { status: response.status, bytes: Buffer.byteLength(html), elapsedMs: Date.now() - started, mode,
          csp: response.headers.get('content-security-policy'), url };
        break;
      }
    } catch { /* server not listening yet; retry within the bounded deadline */ }
    await new Promise(r => setTimeout(r, 250));
  }
  if (!ready) throw new Error('Local route did not become ready within 120 seconds; inspect server log');
  await writeFile(resolve(output, `http-${mode}.json`), JSON.stringify(ready, null, 2));
  console.log(JSON.stringify({ http: ready }));
  const filter = process.env.TRANSFORMERS_TEST_PATTERN ? [`--test-name-pattern=${process.env.TRANSFORMERS_TEST_PATTERN}`] : [];
  tests = spawn(process.execPath, ['--test', '--test-concurrency=1', '--test-reporter=spec', ...filter, 'scripts/transformers-browser-qa.mjs'], {
    env: { ...process.env, TRANSFORMERS_DEV_URL: url, TRANSFORMERS_RESULTS_DIR: output }, stdio: ['ignore', 'pipe', 'pipe'],
  });
  const testLog = createWriteStream(resolve(output, `browser-${mode}.log`));
  for (const stream of [tests.stdout, tests.stderr]) { stream.pipe(testLog, { end: false }); stream.pipe(process.stdout); }
  const timeout = setTimeout(() => tests.kill('SIGTERM'), 600000);
  const result = await new Promise((accept, reject) => { tests.once('error', reject); tests.once('exit', (code, signal) => accept({ code, signal })); });
  clearTimeout(timeout); testLog.end();
  await writeFile(resolve(output, `exit-${mode}.json`), JSON.stringify(result));
  process.exitCode = result.code ?? 1;
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  await writeFile(resolve(output, `runner-error-${mode}.json`), JSON.stringify({ message, mode }));
  console.error(message);
  process.exitCode = 1;
} finally {
  stop();
  const killTimeout = setTimeout(() => server.kill('SIGKILL'), 5000);
  killTimeout.unref();
  log.end();
}
