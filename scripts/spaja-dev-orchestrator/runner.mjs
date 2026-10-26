import { fork } from 'node:child_process';
import { mkdirSync, lstatSync, readdirSync, realpathSync, accessSync, constants } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeModule, verifySource } from './adapters.mjs';

const ownDirectory = dirname(fileURLToPath(import.meta.url));
function privateDirectory(path) {
  const parent = dirname(path);
  if (parent !== path) {
    try { if (!lstatSync(parent).isDirectory() || lstatSync(parent).isSymbolicLink()) throw new Error('Unsafe artifact parent.'); }
    catch (error) { if (error.code !== 'ENOENT') throw error; privateDirectory(parent); }
  }
  try { mkdirSync(path, { mode: 0o700 }); }
  catch (error) { if (error.code !== 'EEXIST') throw error; }
  if (!lstatSync(path).isDirectory() || lstatSync(path).isSymbolicLink() || realpathSync(path) !== resolve(path)) throw new Error('Unsafe artifact directory.');
}
export function preflight() {
  if (process.platform !== 'linux' || Number(process.versions.node.split('.')[0]) !== 24) throw new Error('Prototype requires Linux and Node.js 24.');
  accessSync('/usr/bin/prlimit', constants.X_OK);
  accessSync('/usr/bin/timeout', constants.X_OK);
  accessSync('/proc/self/status', constants.R_OK);
}

export class Runner {
  #store; #active = null; #busy = false; #closing = false;
  constructor(store) { preflight(); this.#store = store; }
  async control(action) {
    const stopRequested = ['pause', 'cancel'].includes(action);
    try {
      return this.#store.control(action); // Persist stop intent before signaling when possible.
    } catch (error) {
      // A failed stop write must not leave this worker dispatching more tasks.
      // Reopen/reconcile the store explicitly before any subsequent execution.
      if (stopRequested) this.#closing = true;
      throw error;
    } finally {
      if (stopRequested && this.#active?.connected) this.#active.send({ type: 'stop' });
    }
  }
  async tick() {
    if (this.#busy || this.#closing) return false;
    this.#busy = true;
    let claimed;
    try {
      claimed = this.#store.claim();
      if (!claimed) return false;
      const { state, task, timeoutMs } = claimed;
      const root = `${this.#store.path}.artifacts`;
      const directory = join(root, state.id, `${task.id}-${task.attempts}`);
      privateDirectory(dirname(directory));
      mkdirSync(directory, { mode: 0o700 }); // Fresh attempt only. Never overwrite uncertain artifacts.
      const common = ['--permission', '--disable-proto=throw', `--max-old-space-size=${state.limits.heapMb}`,
        `--allow-fs-read=${ownDirectory}`, `--allow-fs-read=${directory}`];
      let args;
      if (task.kind === 'verify-module') {
        const source = state.tasks.find(t => t.id === task.source);
        const expectedSource = join(root, state.id, `${source.id}-${source.attempts}`);
        if (source.result?.artifact !== expectedSource) throw new Error('Missing source artifact.');
        verifySource(source, expectedSource);
        // Test a new exact copy of the approved deterministic template, not editable arbitrary code.
        writeModule(source, directory);
        args = [...common, '--test', '--test-isolation=none', '--test-reporter=tap', `${source.moduleName}.test.mjs`];
      } else {
        if (task.kind === 'file-manifest' && !state.workspace) throw new Error('Manifest requires a pinned workspace.');
        args = [...common, `--allow-fs-write=${directory}`,
          ...(task.kind === 'file-manifest' ? [`--allow-fs-read=${state.workspace}`] : []),
          join(ownDirectory, 'adapters.mjs'), task.kind,
          JSON.stringify({ task, directory, workspace: state.workspace })];
      }
      const remainingMs = Math.min(timeoutMs, state.deadline - this.#store.now(state));
      if (remainingMs <= 0) {
        this.#store.finish(claimed.token, { ok: false, reason: 'interrupted' }); return true;
      }
      const result = await this.#execute({ args, directory, timeoutMs: remainingMs,
        expiresAt: task.leaseUntil - 2000, limits: state.limits });
      let artifactSize = 0;
      for (const file of readdirSync(directory)) {
        const stat = lstatSync(join(directory, file));
        if (!stat.isFile() || stat.isSymbolicLink()) throw new Error('Unexpected artifact type.');
        artifactSize += stat.size;
      }
      if (artifactSize > state.limits.artifactBytes) { result.ok = false; result.reason = 'artifact-limit'; }
      this.#store.finish(claimed.token, { ...result, artifact: directory });
      return true;
    } catch (error) {
      if (claimed && error.uncertain) this.#store.uncertain(claimed.token);
      else if (claimed) this.#store.finish(claimed.token, { ok: false, reason: 'adapter-error', summary: error.message });
      else throw error;
      return true;
    } finally { this.#active = null; this.#busy = false; }
  }
  #execute(message) {
    return new Promise((resolveResult, reject) => {
      const supervisor = fork(join(ownDirectory, 'supervisor.mjs'), [], {
        env: { LANG: 'C', TZ: 'UTC' }, execArgv: [], stdio: ['ignore', 'ignore', 'pipe', 'ipc'],
      });
      this.#active = supervisor;
      let result, failed;
      supervisor.stderr.resume();
      supervisor.on('message', message => { if (message.type === 'result') result = message.result; });
      supervisor.on('error', error => { failed = error; });
      supervisor.on('close', () => {
        // Unexpected supervisor death leaves task lease intact: do not claim it was killed.
        if (!result) {
          const error = failed ?? new Error('Supervisor lost; worker outcome uncertain.');
          error.uncertain = true; reject(error);
        }
        else resolveResult(result);
      });
      supervisor.send({ type: 'execute', ...message });
    });
  }
  async close() {
    this.#closing = true;
    try {
      if (this.#store.get().status === 'running') await this.control('pause');
    } finally {
      // Stop/drain even if audit verification, the clock or a SQLite write fails.
      try {
        if (this.#active?.connected) this.#active.send({ type: 'stop' });
      } finally {
        while (this.#busy) await new Promise(resolve => setTimeout(resolve, 10));
      }
    }
  }
}
