import { createHash } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { isAbsolute } from 'node:path';

export class PilotError extends Error {
  constructor(public status: number, public code: string, message: string) { super(message); }
}

export interface PilotConfig {
  apiKey: string;
  model: string;
  dbPath: string;
  allowedUsers: Set<string>;
  userDaily: number;
  globalDaily: number;
  maxOutput: number;
}

export function readPilotConfig(env: NodeJS.ProcessEnv = process.env): PilotConfig {
  const disabled = () => new PilotError(503, 'PILOT_DISABLED', 'AI pilot nije podešen za rad.');
  if (env.SPAJA_AI_PILOT_ENABLED !== 'true' || env.SPAJA_AI_RUNTIME !== 'persistent-node') throw disabled();
  if (!env.OPENAI_API_KEY || !env.SPAJA_AI_MODEL || !/^[a-zA-Z0-9._-]{1,120}$/.test(env.SPAJA_AI_MODEL)) throw disabled();
  if (!env.OMEGA_JWT_SECRET || env.OMEGA_JWT_SECRET.length < 32 || env.OMEGA_JWT_SECRET.includes('dev-only')) throw disabled();
  if (!env.SPAJA_AI_DB_PATH || !isAbsolute(env.SPAJA_AI_DB_PATH) || env.SPAJA_AI_DB_PATH === ':memory:') throw disabled();
  const allowedUsers = new Set((env.SPAJA_AI_ALLOWED_USER_IDS ?? '').split(',').map(x => x.trim()).filter(Boolean));
  if (!allowedUsers.size || allowedUsers.has('*')) throw disabled();
  const limit = (key: string, fallback: number, ceiling: number, minimum = 1) => {
    const n = Number(env[key] ?? fallback);
    if (!Number.isSafeInteger(n) || n < minimum || n > ceiling) throw disabled();
    return n;
  };
  return {
    apiKey: env.OPENAI_API_KEY, model: env.SPAJA_AI_MODEL, dbPath: env.SPAJA_AI_DB_PATH, allowedUsers,
    userDaily: limit('SPAJA_AI_USER_DAILY_REQUESTS', 10, 100),
    globalDaily: limit('SPAJA_AI_GLOBAL_DAILY_REQUESTS', 50, 500),
    maxOutput: limit('SPAJA_AI_MAX_OUTPUT_TOKENS', 512, 2048, 16),
  };
}

export type PilotMessage = { role: 'user' | 'assistant'; content: string };
export function parsePilotInput(body: unknown): { requestId: string; messages: PilotMessage[] } {
  const bad = () => new PilotError(400, 'INVALID_INPUT', 'Pošaljite ID zahteva i do 12 poruka, najviše 16000 UTF-8 bajtova ukupno.');
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw bad();
  const { requestId, messages } = body as Record<string, unknown>;
  if (typeof requestId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId)) throw bad();
  if (!Array.isArray(messages) || messages.length < 1 || messages.length > 12) throw bad();
  let bytes = 0;
  const clean = messages.map((item: unknown): PilotMessage => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) throw bad();
    const { role, content } = item as Record<string, unknown>;
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string' || !content.trim()) throw bad();
    bytes += Buffer.byteLength(content, 'utf8');
    return { role, content };
  });
  if (bytes > 16000 || clean.at(-1)?.role !== 'user') throw bad();
  return { requestId: requestId.toLowerCase(), messages: clean };
}

/** Every reservation consumes a daily request, including failures and unknown outcomes.
 * No prompt/answer/token is persisted. All workers MUST use the same durable DB file.
 */
export class PilotLedger {
  private db: DatabaseSync;
  constructor(path: string) {
    this.db = new DatabaseSync(path);
    this.db.exec(`PRAGMA busy_timeout=5000; PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL;
      CREATE TABLE IF NOT EXISTS spaja_ai_requests (
        user_id TEXT NOT NULL, request_id TEXT NOT NULL, day TEXT NOT NULL,
        input_hash TEXT NOT NULL, model TEXT NOT NULL, output_limit INTEGER NOT NULL,
        state TEXT NOT NULL DEFAULT 'reserved', input_tokens INTEGER, output_tokens INTEGER,
        PRIMARY KEY(user_id, request_id));
      CREATE INDEX IF NOT EXISTS spaja_ai_day ON spaja_ai_requests(day, user_id);`);
  }
  reserve(userId: string, requestId: string, messages: PilotMessage[], config: PilotConfig, now = new Date()): void {
    const day = now.toISOString().slice(0, 10);
    this.db.exec('BEGIN IMMEDIATE');
    try {
      if (this.db.prepare('SELECT 1 FROM spaja_ai_requests WHERE user_id=? AND request_id=?').get(userId, requestId)) {
        throw new PilotError(409, 'DUPLICATE_REQUEST', 'Zahtev je već zabeležen; automatsko ponavljanje je zaustavljeno.');
      }
      const counts = this.db.prepare('SELECT COUNT(*) AS total, COALESCE(SUM(user_id=?),0) AS own FROM spaja_ai_requests WHERE day=?').get(userId, day) as { total: number; own: number };
      if (counts.total >= config.globalDaily || counts.own >= config.userDaily) {
        throw new PilotError(429, 'DAILY_LIMIT', 'Dnevna kvota AI pilota je dostignuta. Obnova je u 00:00 UTC.');
      }
      this.db.prepare('INSERT INTO spaja_ai_requests(user_id,request_id,day,input_hash,model,output_limit) VALUES(?,?,?,?,?,?)')
        .run(userId, requestId, day, createHash('sha256').update(JSON.stringify(messages)).digest('hex'), config.model, config.maxOutput);
      this.db.exec('COMMIT');
    } catch (error) { this.db.exec('ROLLBACK'); throw error; }
  }
  finish(userId: string, requestId: string, state: 'completed' | 'incomplete' | 'unknown', inputTokens?: number, outputTokens?: number): void {
    this.db.prepare("UPDATE spaja_ai_requests SET state=?,input_tokens=?,output_tokens=? WHERE user_id=? AND request_id=? AND state='reserved'")
      .run(state, inputTokens ?? null, outputTokens ?? null, userId, requestId);
  }
  close(): void { this.db.close(); }
}

export interface PilotResult { text: string; incomplete: boolean; inputTokens: number; outputTokens: number }
export type PilotProvider = (config: PilotConfig, messages: PilotMessage[], signal: AbortSignal) => Promise<PilotResult>;

export const callOpenAI: PilotProvider = async (config, messages, signal) => {
  // Fixed HTTPS origin, no gateway, redirects or automatic retries.
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST', redirect: 'error', signal: AbortSignal.any([signal, AbortSignal.timeout(45000)]),
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.apiKey}` },
    body: JSON.stringify({
      model: config.model, input: messages, max_output_tokens: config.maxOutput, store: false,
      instructions: 'Ti si SPAJA AI asistent. Odgovaraj na jeziku korisnika. Jasno označi neizvesnost. U ovom razgovoru nemaš pristup alatima, privatnim dokumentima, internetu ili izvršavanju radnji. Ne tvrdi da si ih koristio.',
    }),
  });
  if (!response.ok) throw new PilotError(502, 'PROVIDER_ERROR', 'Servis modela nije vratio odgovor. Zahtev se neće automatski ponoviti.');
  const data = await response.json();
  if (!['completed', 'incomplete'].includes(data?.status) || !Array.isArray(data?.output)) throw new Error('Invalid provider response');
  const text: string = data.output.filter((x: { type?: string }) => x?.type === 'message')
    .flatMap((x: { content?: unknown[] }) => Array.isArray(x.content) ? x.content : [])
    .map((x: { type?: string; text?: string; refusal?: string }) => x?.type === 'output_text' ? x.text : x?.type === 'refusal' ? x.refusal : '')
    .filter((x: unknown) => typeof x === 'string').join('\n');
  const inputTokens = data.usage?.input_tokens;
  const outputTokens = data.usage?.output_tokens;
  if (!text.trim() || !Number.isSafeInteger(inputTokens) || inputTokens < 0 || !Number.isSafeInteger(outputTokens) || outputTokens < 0) throw new Error('Invalid provider response');
  return { text, incomplete: data.status === 'incomplete', inputTokens, outputTokens };
};

export async function executePilot(config: PilotConfig, ledger: PilotLedger, userId: string, body: unknown, signal: AbortSignal, provider: PilotProvider = callOpenAI) {
  if (!config.allowedUsers.has(userId)) throw new PilotError(403, 'NOT_ALLOWED', 'Nalog nema pristup AI pilotu.');
  const { requestId, messages } = parsePilotInput(body);
  if (signal.aborted) throw new PilotError(499, 'CANCELLED', 'Zahtev je zaustavljen.');
  ledger.reserve(userId, requestId, messages, config);
  try {
    const result = await provider(config, messages, signal);
    ledger.finish(userId, requestId, result.incomplete ? 'incomplete' : 'completed', result.inputTokens, result.outputTokens);
    return { mode: 'model', model: config.model, requestId, rezultat: result.text, incomplete: result.incomplete,
      usage: { inputTokens: result.inputTokens, outputTokens: result.outputTokens } };
  } catch (error) {
    // The provider may have accepted a timed-out/aborted request: retain the reservation.
    ledger.finish(userId, requestId, 'unknown');
    if (signal.aborted) throw new PilotError(499, 'CANCELLED', 'Zahtev je zaustavljen. Kvota ostaje rezervisana.');
    if (error instanceof PilotError) throw error;
    throw new PilotError(502, 'PROVIDER_UNCERTAIN', 'Ishod zahteva nije potvrđen. Kvota ostaje rezervisana.');
  }
}
