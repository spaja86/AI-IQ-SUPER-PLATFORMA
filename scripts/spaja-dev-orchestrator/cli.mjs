import { readFileSync, realpathSync, statSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { resolve } from 'node:path';
import { Store } from './store.mjs';
import { Runner } from './runner.mjs';

process.umask(0o077);
const [command, database, planPath, workspace = '.'] = process.argv.slice(2);
if (!['create', 'run', 'status', 'audit'].includes(command) || !database) {
  console.error('Usage: node scripts/spaja-dev-orchestrator/cli.mjs create DB PLAN.json [WORKSPACE] | run DB | status DB | audit DB');
  process.exitCode = 1;
} else {
  let store, runner, timer, input, stopping = false;
  const output = state => console.log(JSON.stringify({ id: state.id, status: state.status, hours: state.hours, deadline: state.deadline,
    reservedTaskMs: state.reservedTaskMs, spentMicros: state.spentMicros,
    tasks: state.tasks.map(t => ({ id: t.id, status: t.status, attempts: t.attempts, result: t.result })) }));
  const stop = async () => {
    if (stopping) return; stopping = true;
    clearInterval(timer); input?.close();
    if (command === 'run') process.stdin.destroy();
    try { await runner?.close(); }
    catch (error) { process.exitCode = 1; console.error(error.message); }
    finally { store?.close(); }
  };
  try {
    store = new Store(resolve(database));
    if (command === 'create') {
      if (!planPath || statSync(planPath).size > 65_536) throw new Error('Plan must be at most 64 KiB.');
      output(store.create(JSON.parse(readFileSync(planPath, 'utf8')), realpathSync(workspace)));
      store.close();
    } else if (command === 'status' || command === 'audit') {
      if (command === 'audit') { store.get(); console.log(JSON.stringify(store.events())); }
      else output(store.get());
      store.close();
    } else {
      runner = new Runner(store);
      console.log('LOCAL PROTOTYPE. No task starts until start/resume. Commands: start pause resume retry cancel status audit quit');
      output(store.get());
      input = createInterface({ input: process.stdin, terminal: false });
      input.on('line', line => {
        const action = line.trim();
        void (async () => {
          if (stopping) return;
          if (action === 'quit') { await stop(); return; }
          if (action === 'status') output(store.get());
          else if (action === 'audit') { store.get(); console.log(JSON.stringify(store.events())); }
          else output(await runner.control(action));
        })().catch(error => console.error(error.message));
      });
      input.on('close', () => { void stop(); });
      timer = setInterval(() => {
        void runner.tick().then(worked => { if (worked && !stopping) output(store.get()); }).catch(async error => {
          console.error(error.message); process.exitCode = 1; await stop();
        });
      }, 100);
      process.once('SIGINT', () => { void stop(); });
      process.once('SIGTERM', () => { void stop(); });
    }
  } catch (error) { console.error(error.message); process.exitCode = 1; await stop(); }
}
