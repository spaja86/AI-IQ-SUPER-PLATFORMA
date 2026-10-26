import { DatabaseSync } from 'node:sqlite';
import { randomUUID } from 'node:crypto';
import { mkdirSync, chmodSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { digest, validatePlan } from './policy.mjs';

const terminal = new Set(['succeeded', 'canceled', 'expired', 'budget_exhausted']);
const eventHash = e => digest(JSON.stringify([e.seq, e.time, e.kind, e.detail, e.state_hash, e.previous_hash]));

/** Same WAL/FULL, exclusive ownership and atomic audit pattern as SUOC PilotStore.
 * Separate schema and queue: these are development tasks, never numeric VRH steps. */
export class Store {
  #db; #lock; #clock; #closed = false;
  constructor(path, clock = Date.now) {
    this.path = resolve(path); this.#clock = clock;
    mkdirSync(dirname(this.path), { recursive: true, mode: 0o700 });
    this.#lock = new DatabaseSync(`${this.path}.lock`, { timeout: 0 });
    try { this.#lock.exec('BEGIN EXCLUSIVE'); }
    catch { this.#lock.close(); throw new Error('Queue already has an owner.'); }
    try {
      this.#db = new DatabaseSync(this.path);
      chmodSync(this.path, 0o600); chmodSync(`${this.path}.lock`, 0o600);
      this.#db.exec(`PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL;
        CREATE TABLE IF NOT EXISTS session(id INTEGER PRIMARY KEY CHECK(id=1), document TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS events(seq INTEGER PRIMARY KEY, time INTEGER NOT NULL, kind TEXT NOT NULL,
          detail TEXT NOT NULL, state_hash TEXT NOT NULL, previous_hash TEXT NOT NULL, hash TEXT NOT NULL);`);
      if (this.#db.prepare('PRAGMA quick_check').get().quick_check !== 'ok') throw new Error('SQLite integrity failure.');
      if (this.#db.prepare('SELECT id FROM session').get()) {
        const state = this.get();
        if (state.status === 'running' || state.tasks.some(t => t.status === 'running')) {
          for (const task of state.tasks) if (task.status === 'running') task.status = 'interrupted';
          if (!terminal.has(state.status)) state.status = 'paused';
          this.#save(state, 'recovered', 'Explicit retry/resume required; uncertain work is never replayed automatically.');
        }
      }
    } catch (error) { this.close(); throw error; }
  }
  now(state) {
    const now = this.#clock();
    if (!Number.isSafeInteger(now) || now < 0 || (state && now < state.updatedAt)) throw new Error('Host clock moved backwards; execution refused.');
    return now;
  }
  events() { return this.#db.prepare('SELECT * FROM events ORDER BY seq').all(); }
  get() {
    const row = this.#db.prepare('SELECT document FROM session WHERE id=1').get();
    if (!row) throw new Error('No plan. Use create first.');
    let previous = ''; let seq = 0;
    const events = this.events();
    for (const event of events) {
      if (event.seq !== ++seq || event.previous_hash !== previous || event.hash !== eventHash(event)) throw new Error('Invalid audit chain.');
      previous = event.hash;
    }
    if (!events.length || events.at(-1).state_hash !== digest(row.document)) throw new Error('State does not match audit.');
    return JSON.parse(row.document);
  }
  #save(state, kind, detail = '') {
    this.#db.exec('BEGIN IMMEDIATE');
    try {
      if (this.#db.prepare('SELECT id FROM session').get()) this.get();
      state.updatedAt = this.now(state);
      const document = JSON.stringify(state);
      const last = this.#db.prepare('SELECT * FROM events ORDER BY seq DESC LIMIT 1').get();
      const event = { seq: (last?.seq ?? 0) + 1, time: state.updatedAt, kind, detail,
        state_hash: digest(document), previous_hash: last?.hash ?? '' };
      this.#db.prepare('INSERT INTO session VALUES(1,?) ON CONFLICT(id) DO UPDATE SET document=excluded.document').run(document);
      this.#db.prepare('INSERT INTO events VALUES(?,?,?,?,?,?,?)').run(event.seq, event.time, kind, detail, event.state_hash, event.previous_hash, eventHash(event));
      this.#db.exec('COMMIT');
    } catch (error) { this.#db.exec('ROLLBACK'); throw error; }
  }
  create(input, workspace = null) {
    if (this.#db.prepare('SELECT id FROM session').get()) throw new Error('Database already contains a plan.');
    const plan = validatePlan(input);
    const now = this.now();
    this.#save({ ...plan, workspace, id: randomUUID(), status: 'ready', createdAt: now, updatedAt: now,
      deadline: null, reservedTaskMs: 0, spentMicros: 0, controlCount: 0,
      tasks: plan.tasks.map(t => ({ ...t, status: 'queued', attempts: 0 })) }, 'created');
    return this.get();
  }
  #expire(state) {
    if (!terminal.has(state.status) && state.deadline !== null && this.now(state) >= state.deadline) {
      state.status = 'expired'; this.#save(state, 'expired'); return true;
    }
    return false;
  }
  control(action) {
    const state = this.get(); this.now(state);
    if (this.#expire(state) || terminal.has(state.status)) throw new Error('Session is terminal.');
    if (state.controlCount >= 512 && action !== 'cancel') throw new Error('Control event limit reached; cancel or use a new session.');
    const active = state.tasks.some(t => t.status === 'running');
    if (action === 'start') {
      if (state.status !== 'ready' || state.deadline !== null) throw new Error('Start requires a new ready plan.');
      state.deadline = this.now(state) + state.hours * 3_600_000; state.status = 'running';
    } else if (action === 'pause') {
      if (state.status !== 'running') throw new Error('Pause requires a running session.');
      state.status = 'paused';
    } else if (action === 'resume') {
      if (state.status !== 'paused' || active || state.tasks.some(t => ['failed', 'interrupted'].includes(t.status))) throw new Error('Resume requires paused, reconciled tasks.');
      state.status = 'running';
    } else if (action === 'retry') {
      if (!['paused', 'failed'].includes(state.status) || active) throw new Error('Retry requires stopped execution.');
      const uncertain = state.tasks.filter(t => ['failed', 'interrupted'].includes(t.status));
      if (!uncertain.length) throw new Error('No failed/interrupted tasks.');
      for (const task of uncertain) {
        if (task.attempts >= state.limits.maxAttempts) throw new Error('Attempt limit reached.');
        if (task.leaseUntil && this.now(state) < task.leaseUntil) throw new Error('Execution lease has not expired; inspect old process before retry.');
        task.status = 'queued'; delete task.result;
      }
      state.status = 'paused';
    } else if (action === 'cancel') {
      state.status = 'canceled';
      state.tasks.forEach(t => { if (t.status === 'queued') t.status = 'canceled'; });
    } else throw new Error('Unknown control.');
    state.controlCount++; this.#save(state, action);
    return this.get();
  }
  claim() {
    const state = this.get();
    if (this.#expire(state) || state.status !== 'running' || state.tasks.some(t => t.status === 'running')) return null;
    const task = state.tasks.find(t => t.status === 'queued' && t.dependsOn.every(id => state.tasks.find(s => s.id === id).status === 'succeeded'));
    if (!task) return null;
    const remaining = state.limits.totalTaskMs - state.reservedTaskMs;
    if (remaining < state.limits.taskMs) { state.status = 'budget_exhausted'; this.#save(state, 'budget_exhausted'); return null; }
    const timeoutMs = Math.min(state.limits.taskMs, state.deadline - this.now(state));
    task.status = 'running'; task.attempts++; task.token = randomUUID();
    task.leaseUntil = this.now(state) + timeoutMs + 2000;
    // Conservative reservation, never refunded (including crash/failed attempts).
    state.reservedTaskMs += state.limits.taskMs;
    this.#save(state, 'claimed', `${task.id}:${task.attempts}`);
    return { task, token: task.token, timeoutMs, state };
  }
  finish(token, result) {
    const state = this.get(); const task = state.tasks.find(t => t.token === token && t.status === 'running');
    if (!task) throw new Error('Stale execution token.');
    const expired = this.now(state) >= state.deadline;
    const stopped = terminal.has(state.status) || state.status === 'paused';
    const ok = result.ok === true && !expired && !stopped;
    task.status = ok ? 'succeeded' : (expired || stopped || result.reason === 'interrupted' ? 'interrupted' : 'failed');
    task.result = { ok, reason: String(result.reason ?? (ok ? 'completed' : 'interrupted')).slice(0, 80),
      summary: String(result.summary ?? '').slice(0, state.limits.outputBytes), artifact: result.artifact ?? null };
    task.leaseUntil = 0; // Runner calls finish only after process close (not just exit/signal).
    if (expired && !terminal.has(state.status)) state.status = 'expired';
    else if (!stopped) state.status = ok ? (state.tasks.every(t => t.status === 'succeeded') ? 'succeeded' : 'running') : 'failed';
    this.#save(state, task.status, task.id);
    return this.get();
  }
  uncertain(token) {
    const state = this.get();
    const task = state.tasks.find(t => t.token === token && t.status === 'running');
    if (!task) throw new Error('Stale execution token.');
    task.status = 'interrupted'; // Keep the lease. No proof the task process exited.
    if (!terminal.has(state.status)) state.status = 'paused';
    this.#save(state, 'uncertain', task.id);
  }
  close() {
    if (this.#closed) return; this.#closed = true;
    try { this.#db?.close(); } finally { this.#lock?.close(); }
  }
}
