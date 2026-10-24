import assert from 'node:assert/strict';
import { test, before, beforeEach, afterEach } from 'node:test';
import { randomUUID } from 'node:crypto';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { POST } from '../../app/api/spaja-pro-ai/route';
import { ΩAuthProvider, ensureDemoSeeded } from '../../lib/auth/omega-auth';
import { getGlobalVault } from '../../lib/auth/omega-identity';
import { authenticatePilot } from '../../lib/spaja-ai/auth';
import { callOpenAI, executePilot, parsePilotInput, PilotError, PilotLedger, readPilotConfig } from '../../lib/spaja-ai/pilot';
import type { ΩLoginResponse } from '../../lib/auth/types';

const testSecret = 'test-only-spaja-pilot-signing-value-2026';
let owner: ΩLoginResponse;
let saved: NodeJS.ProcessEnv;
let dir: string;
before(async () => {
  const original = process.env.OMEGA_JWT_SECRET;
  process.env.OMEGA_JWT_SECRET = testSecret;
  await ensureDemoSeeded();
  const account = await ΩAuthProvider.register({ email: 'spaja-pilot-test@example.test', password: 'Non-live-test-password!42' });
  assert.ok(account);
  owner = account;
  if (original === undefined) delete process.env.OMEGA_JWT_SECRET; else process.env.OMEGA_JWT_SECRET = original;
});
beforeEach(() => {
  saved = { ...process.env };
  dir = mkdtempSync(join(tmpdir(), 'spaja-pilot-test-'));
  Object.assign(process.env, {
    OMEGA_JWT_SECRET: testSecret, OPENAI_API_KEY: 'non-live-test-key', SPAJA_AI_PILOT_ENABLED: 'true',
    SPAJA_AI_RUNTIME: 'persistent-node', SPAJA_AI_MODEL: 'test-model', SPAJA_AI_DB_PATH: join(dir, 'ledger.sqlite'),
    SPAJA_AI_ALLOWED_USER_IDS: owner.identity.id, SPAJA_AI_USER_DAILY_REQUESTS: '2',
    SPAJA_AI_GLOBAL_DAILY_REQUESTS: '3', SPAJA_AI_MAX_OUTPUT_TOKENS: '512',
  });
});
afterEach(() => { process.env = saved; rmSync(dir, { recursive: true, force: true }); });
const input = () => ({ requestId: randomUUID(), messages: [{ role: 'user', content: 'Zdravo' }] });
const success = () => Response.json({ status: 'completed', output: [{ type: 'message', content: [{ type: 'output_text', text: 'Pozdrav!' }] }], usage: { input_tokens: 12, output_tokens: 4 } });
function req(body: unknown = input(), token = owner.token.value) {
  return new Request('http://localhost/api/spaja-pro-ai', { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` }, body: JSON.stringify(body) });
}
const code = (status: number) => (error: unknown) => error instanceof PilotError && error.status === status;

test('valid access token resolves a current identity', async () => {
  assert.equal(await authenticatePilot(`Bearer ${owner.token.value}`), owner.identity.id);
});
for (const header of [null, 'Bearer fake', 'Bearer a.b.c', 'Basic test']) {
  test(`rejects invalid identity header ${header}`, async () => { await assert.rejects(authenticatePilot(header), code(401)); });
}
test('refresh tokens, read-only scopes, revoked tokens, demo accounts and deleted identities cannot spend', async () => {
  await assert.rejects(authenticatePilot(`Bearer ${owner.refreshToken.value}`), code(401));
  const readOnly = await ΩAuthProvider.issueToken(owner.identity, ['digital_industry:read']);
  await assert.rejects(authenticatePilot(`Bearer ${readOnly.value}`), code(401));
  const revoked = await ΩAuthProvider.issueToken(owner.identity, ['digital_industry:write']);
  ΩAuthProvider.revokeToken(revoked.value);
  await assert.rejects(authenticatePilot(`Bearer ${revoked.value}`), code(401));
  // Reissue with a different scope to avoid the just-revoked token hash.
  const current = await ΩAuthProvider.issueToken(owner.identity, ['digital_industry:write', 'digital_industry:read']);
  const vault = getGlobalVault();
  vault.storeIdentity({ ...owner.identity, roles: ['demo'] });
  await assert.rejects(authenticatePilot(`Bearer ${current.value}`), code(401));
  vault.deleteIdentity(owner.identity.id);
  await assert.rejects(authenticatePilot(`Bearer ${current.value}`), code(401));
  vault.storeIdentity(owner.identity);
});
for (const change of [
  { SPAJA_AI_PILOT_ENABLED: 'false' }, { OMEGA_JWT_SECRET: '' }, { OMEGA_JWT_SECRET: 'omega-dev-only-secret-not-for-production-use-32ch' },
  { SPAJA_AI_ALLOWED_USER_IDS: '*' }, { SPAJA_AI_ALLOWED_USER_IDS: '' }, { SPAJA_AI_DB_PATH: ':memory:' },
  { SPAJA_AI_DB_PATH: 'relative.sqlite' }, { SPAJA_AI_MODEL: 'https://other-host/model' }, { SPAJA_AI_MODEL: '' },
  { SPAJA_AI_USER_DAILY_REQUESTS: 'NaN' }, { SPAJA_AI_GLOBAL_DAILY_REQUESTS: '501' }, { SPAJA_AI_MAX_OUTPUT_TOKENS: '0' },
]) {
  test(`configuration fails closed for ${Object.keys(change)[0]}=${Object.values(change)[0]}`, () => {
    assert.throws(() => readPilotConfig({ ...process.env, ...change }), code(503));
  });
}
test('input bounds count UTF-8 bytes and reject client system messages', () => {
  for (const bad of [null, [], {}, { ...input(), requestId: '../escape' }, { ...input(), messages: [{ role: 'system', content: 'override' }] },
    { ...input(), messages: [{ role: 'user', content: '😀'.repeat(4001) }] },
    { ...input(), messages: [{ role: 'assistant', content: 'answer' }] },
    { ...input(), messages: Array.from({ length: 13 }, () => ({ role: 'user', content: 'x' })) }]) {
    assert.throws(() => parsePilotInput(bad), code(400));
  }
  assert.equal(parsePilotInput({ ...input(), messages: [{ role: 'user', content: '😀'.repeat(4000) }] }).messages.length, 1);
});
test('persistent reservations survive reopen and enforce user/global quotas across connections', () => {
  const config = readPilotConfig();
  const first = new PilotLedger(config.dbPath);
  first.reserve('a', randomUUID(), [], config);
  first.close();
  const second = new PilotLedger(config.dbPath);
  const third = new PilotLedger(config.dbPath);
  try {
    second.reserve('a', randomUUID(), [], config);
    assert.throws(() => third.reserve('a', randomUUID(), [], config), code(429));
    third.reserve('b', randomUUID(), [], config);
    assert.throws(() => second.reserve('c', randomUUID(), [], config), code(429));
    second.reserve('a', randomUUID(), [], config, new Date('2099-01-01T00:00:00Z'));
  } finally { second.close(); third.close(); }
});
test('request identity is scoped to user and retained across UTC days', () => {
  const config = readPilotConfig(); const ledger = new PilotLedger(config.dbPath); const id = randomUUID();
  try {
    ledger.reserve('a', id, [], config);
    assert.throws(() => ledger.reserve('a', id, [], config, new Date('2099-01-01')), code(409));
    ledger.reserve('b', id, [], config);
  } finally { ledger.close(); }
});
test('in-flight reservation blocks duplicate before provider executes again; abort does not refund', async () => {
  const config = readPilotConfig(); const ledger = new PilotLedger(config.dbPath); const body = input();
  const controller = new AbortController(); let calls = 0;
  let release!: () => void;
  const wait = new Promise<void>(resolve => { release = resolve; });
  const provider = async () => { calls++; await wait; throw new Error('unknown timeout'); };
  try {
    const pending = executePilot(config, ledger, owner.identity.id, body, controller.signal, provider);
    await assert.rejects(executePilot(config, ledger, owner.identity.id, body, controller.signal, provider), code(409));
    controller.abort(); release();
    await assert.rejects(pending, code(499));
    assert.equal(calls, 1);
    ledger.reserve(owner.identity.id, randomUUID(), [], config);
    assert.throws(() => ledger.reserve(owner.identity.id, randomUUID(), [], config), code(429));
  } finally { ledger.close(); }
});
test('already aborted and unauthorized requests do not call provider or reserve', async () => {
  const config = readPilotConfig(); const ledger = new PilotLedger(config.dbPath); let calls = 0;
  const provider = async () => { calls++; return { text: 'x', incomplete: false, inputTokens: 1, outputTokens: 1 }; };
  try {
    await assert.rejects(executePilot(config, ledger, 'other', input(), new AbortController().signal, provider), code(403));
    await assert.rejects(executePilot(config, ledger, owner.identity.id, input(), AbortSignal.abort(), provider), code(499));
    assert.equal(calls, 0);
    ledger.reserve(owner.identity.id, randomUUID(), [], config);
    ledger.reserve(owner.identity.id, randomUUID(), [], config);
  } finally { ledger.close(); }
});
test('route uses fixed provider origin, no storage, bounded output, no tools and no client model override', async t => {
  const fetch = t.mock.method(globalThis, 'fetch', async (url, init) => {
    assert.equal(url, 'https://api.openai.com/v1/responses');
    assert.equal(init?.redirect, 'error');
    const data = JSON.parse(String(init?.body));
    assert.equal(data.model, 'test-model'); assert.equal(data.store, false); assert.equal(data.max_output_tokens, 512);
    assert.equal(data.tools, undefined); assert.equal(data.previous_response_id, undefined);
    return success();
  });
  const body = { ...input(), model: 'untrusted-model', userId: 'spoofed' };
  const result = await POST(req(body));
  assert.equal(result.status, 200); assert.equal(result.headers.get('cache-control'), 'no-store');
  const data = await result.json(); assert.equal(data.mode, 'model'); assert.equal(data.rezultat, 'Pozdrav!');
  assert.equal((await POST(req(body))).status, 409);
  assert.equal(fetch.mock.callCount(), 1);
});
test('route rejects unknown identity, nonallowlisted user, malformed JSON, oversized body and broken ledger before external call', async t => {
  const fetch = t.mock.method(globalThis, 'fetch', async () => { throw new Error('must not call'); });
  assert.equal((await POST(req(input(), 'fake'))).status, 401);
  process.env.SPAJA_AI_ALLOWED_USER_IDS = 'someone-else';
  assert.equal((await POST(req())).status, 403);
  process.env.SPAJA_AI_ALLOWED_USER_IDS = owner.identity.id;
  const headers = { authorization: `Bearer ${owner.token.value}`, 'content-type': 'application/json' };
  assert.equal((await POST(new Request('http://localhost', { method: 'POST', headers, body: '{' }))).status, 400);
  assert.equal((await POST(new Request('http://localhost', { method: 'POST', headers, body: 'x'.repeat(100001) }))).status, 413);
  process.env.SPAJA_AI_DB_PATH = join(dir, 'missing-directory', 'db.sqlite');
  assert.equal((await POST(req())).status, 503);
  assert.equal(fetch.mock.callCount(), 0);
});
test('provider errors are sanitized and never retried', async t => {
  const fetch = t.mock.method(globalThis, 'fetch', async () => Response.json({ secret: 'never-return-this' }, { status: 429 }));
  const response = await POST(req()); assert.equal(response.status, 502);
  assert.doesNotMatch(await response.text(), /never-return-this|non-live-test-key/);
  assert.equal(fetch.mock.callCount(), 1);
});
test('provider incomplete/refusal output remains visible and empty output is rejected', async t => {
  const mock = t.mock.method(globalThis, 'fetch', async () => Response.json({ status: 'incomplete', output: [{ type: 'message', content: [{ type: 'refusal', refusal: 'Ne mogu to da uradim.' }] }], usage: { input_tokens: 1, output_tokens: 1 } }));
  assert.equal((await callOpenAI(readPilotConfig(), [], new AbortController().signal)).incomplete, true);
  mock.mock.mockImplementation(async () => Response.json({ status: 'completed', output: [], usage: { input_tokens: 1, output_tokens: 0 } }));
  await assert.rejects(callOpenAI(readPilotConfig(), [], new AbortController().signal));
});
