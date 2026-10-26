// Trusted supervisor, separate from task process: still responsive during a task CPU loop.
import { spawn } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { performance } from 'node:perf_hooks';

// Support both normal /proc mounts and host-mounted procfs in a PID namespace.
// Read numeric process metadata only; some kernels omit task/*/children entirely.
const hostPid = Number(readFileSync('/proc/self/status', 'utf8').match(/^Pid:\s+(\d+)/m)?.[1]);
function childRss(pid) {
  const processes = new Map();
  for (const entry of readdirSync('/proc')) {
    if (!/^\d+$/.test(entry)) continue;
    try {
      const stat = readFileSync(`/proc/${entry}/stat`, 'utf8');
      const fields = stat.slice(stat.lastIndexOf(')') + 2).split(' ');
      processes.set(Number(entry), { parent: Number(fields[1]) });
    } catch (error) { if (!['ENOENT', 'ESRCH', 'EACCES'].includes(error.code)) throw error; }
  }
  let direct;
  for (const [id, item] of processes) if (item.parent === hostPid) {
    try {
      const status = readFileSync(`/proc/${id}/status`, 'utf8');
      const ids = status.match(/^NSpid:\s+(.+)$/m)?.[1].trim().split(/\s+/).map(Number) ?? [id];
      if (ids.at(-1) === pid) direct = id;
    } catch (error) { if (error.code !== 'ENOENT' && error.code !== 'ESRCH') throw error; }
  }
  if (!direct) return null;
  let total = 0;
  const descendants = [direct];
  for (let i = 0; i < descendants.length; i++) {
    if (descendants.length > 8) throw new Error('Unexpected process tree.');
    const id = descendants[i];
    try {
      const status = readFileSync(`/proc/${id}/status`, 'utf8');
      total += Number(status.match(/^VmRSS:\s+(\d+)/m)?.[1] ?? 0);
    } catch (error) { if (error.code !== 'ENOENT' && error.code !== 'ESRCH') throw error; }
    for (const [next, item] of processes) if (item.parent === id) descendants.push(next);
  }
  return total;
}

let child, deadlineTimer, rssTimer, stopping = false, reason = '';
const kill = why => {
  reason ||= why;
  if (child?.pid) {
    try { process.kill(-child.pid, 'SIGKILL'); } catch (error) { if (error.code !== 'ESRCH') throw error; }
    child.kill('SIGKILL');
  }
};
process.on('disconnect', () => { stopping = true; kill('parent-disconnected'); if (!child) process.exit(1); });
process.on('message', message => {
  if (message.type === 'stop') { kill('interrupted'); return; }
  if (message.type !== 'execute' || child || stopping || !process.connected) return;
  const { args, directory, limits } = message;
  const timeoutMs = Math.min(message.timeoutMs, message.expiresAt === undefined ? message.timeoutMs : message.expiresAt - Date.now());
  if (timeoutMs <= 0) {
    process.send({ type: 'result', result: { ok: false, reason: 'task-timeout', summary: '', elapsedMs: 0 } }, () => process.disconnect());
    return;
  }
  let output = Buffer.alloc(0), totalBytes = 0, settled = false, missingSamples = 0;
  const started = performance.now();
  // CPU hard limit is independent of timers. No shell and no inherited credentials/NODE_OPTIONS.
  // Independent monotonic watchdog survives supervisor failure as well as main-process failure.
  child = spawn('/usr/bin/timeout', ['--signal=TERM', '--kill-after=0.2s', `${timeoutMs / 1000}s`,
    '/usr/bin/prlimit', `--cpu=${Math.max(1, Math.ceil(timeoutMs / 1000))}`, '--core=0', '--fsize=65536', '--', process.execPath, ...args], {
    cwd: directory, env: { LANG: 'C', TZ: 'UTC' }, detached: true, stdio: ['ignore', 'pipe', 'pipe'],
  });
  const collect = chunk => {
    totalBytes += chunk.length;
    if (output.length < limits.outputBytes) output = Buffer.concat([output, chunk.subarray(0, limits.outputBytes - output.length)]);
    if (totalBytes > limits.outputBytes) kill('output-limit');
  };
  child.stdout.on('data', collect); child.stderr.on('data', collect);
  child.on('spawn', () => { if (process.connected) process.send({ type: 'started', pid: child.pid }); });
  deadlineTimer = setTimeout(() => kill('task-timeout'), timeoutMs);
  rssTimer = setInterval(() => {
    try {
      const rssKb = childRss(child.pid);
      // A task that cannot be monitored must not continue without its resource limit.
      if (rssKb === null) {
        if (++missingSamples >= 3 && child.exitCode === null && child.signalCode === null) kill('resource-monitor-failed');
        return;
      }
      missingSamples = 0;
      if (rssKb > limits.rssMb * 1024) kill('rss-limit');
    } catch { kill('resource-monitor-failed'); }
  }, 25);
  child.on('error', () => { reason ||= 'spawn-failed'; });
  child.on('close', (code, signal) => {
    if (settled) return; settled = true;
    clearTimeout(deadlineTimer); clearInterval(rssTimer);
    const result = { ok: code === 0 && !reason, reason: reason || (code === 0 ? 'completed' : code === 124 ? 'task-timeout' : `exit:${code}:${signal}`),
      summary: output.toString('utf8'), elapsedMs: Math.ceil(performance.now() - started) };
    if (process.connected) process.send({ type: 'result', result }, () => process.disconnect());
  });
});
