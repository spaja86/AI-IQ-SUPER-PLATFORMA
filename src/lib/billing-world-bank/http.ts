import { createHash, timingSafeEqual } from 'node:crypto';
import { isAbsolute } from 'node:path';
import { LedgerError, parseTestEvent, validateTenant } from './contract';
import { billingWorldBankCapabilities } from './status';

function response(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'private, no-store', Vary: 'Authorization', 'X-Content-Type-Options': 'nosniff' } });
}
function configuration() {
  const env = process.env;
  if (!['development', 'test'].includes(env.NODE_ENV ?? '') || env.SPAJA_BILLING_TEST_ENABLED !== 'true') return null;
  const directory = env.SPAJA_BILLING_TEST_DIRECTORY;
  const tenant = env.SPAJA_BILLING_TEST_TENANT;
  const write = env.SPAJA_BILLING_TEST_WRITE_TOKEN;
  const read = env.SPAJA_BILLING_TEST_READ_TOKEN;
  if (!directory || !isAbsolute(directory) || !tenant || !write || !read || write === read ||
      !/^[a-f0-9]{64}$/.test(write) || !/^[a-f0-9]{64}$/.test(read)) return null;
  try { validateTenant(tenant); } catch { return null; }
  return { directory, tenant, write, read };
}
const tokenHash = (value: string) => createHash('sha256').update(value).digest();
async function boundedJson(request: Request) {
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') throw new LedgerError('application_json_required', 415);
  if (request.headers.get('content-encoding')) throw new LedgerError('encoded_body_not_supported', 415);
  const reader = request.body?.getReader();
  if (!reader) throw new LedgerError('invalid_json', 400);
  const chunks: Uint8Array[] = []; let bytes = 0;
  try {
    while (true) {
      const { value, done } = await reader.read(); if (done) break;
      bytes += value.byteLength;
      if (bytes > 16_384) { await reader.cancel(); throw new LedgerError('body_too_large', 413); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  try { return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks))); }
  catch { throw new LedgerError('invalid_json', 400); }
}

/** Server-to-server development endpoint. Separate scoped tokens; no cookies or proxy-header identities. */
export async function handleTestLedger(request: Request, method: 'GET' | 'POST') {
  const config = configuration();
  if (!config) return response({ error: 'test_integration_disabled' }, 404);
  const authorization = request.headers.get('authorization') ?? '';
  const match = /^Bearer ([a-f0-9]{64})$/.exec(authorization);
  if (!match) return response({ error: 'unauthorized' }, 401);
  const candidate = tokenHash(match[1]);
  const isRead = timingSafeEqual(candidate, tokenHash(config.read));
  const isWrite = timingSafeEqual(candidate, tokenHash(config.write));
  if (!isRead && !isWrite) return response({ error: 'unauthorized' }, 401);
  if ((method === 'GET' && !isRead) || (method === 'POST' && !isWrite) || request.headers.has('origin')) return response({ error: 'forbidden' }, 403);
  try {
    const params = new URL(request.url).searchParams;
    if ([...params.keys()].some(k => k !== 'limit') || params.getAll('limit').length > 1 || (method === 'POST' && params.size > 0)) throw new LedgerError('invalid_query');
    const rawLimit = params.get('limit') ?? '100';
    if (!/^(?:[1-9][0-9]?|100)$/.test(rawLimit)) throw new LedgerError('invalid_limit');
    // Parse and reject live/arbitrary input before opening local storage.
    const event = method === 'POST' ? parseTestEvent(await boundedJson(request)) : null;
    const { TestBillingLedger } = await import('./ledger');
    const ledger = new TestBillingLedger(config.directory);
    try {
      const capabilities = billingWorldBankCapabilities();
      if (event) {
        const receipt = ledger.ingest(config.tenant, event);
        return response({ ...capabilities, testLedgerCommitVerified: true, receipt,
          receiptSemantics: 'paymentStatus_at_original_event_commit; GET_for_current_status' }, receipt.disposition === 'applied' ? 201 : 200);
      }
      return response({ ...capabilities, localLedgerReadVerified: true, ledger: ledger.snapshot(config.tenant, Number(rawLimit)) });
    } finally { ledger.close(); }
  } catch (error) {
    if (error instanceof LedgerError) return response({ error: error.code, retryable: error.code === 'capture_required' }, error.status);
    // No token, payload, local path or DB error is returned/logged.
    return response({ error: 'test_ledger_unavailable', retryable: true }, 503);
  }
}
