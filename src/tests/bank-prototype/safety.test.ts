import assert from 'node:assert/strict';
import { buildBankPrototypeSummary, readBankSession } from '../../lib/bank-prototype';
import { buildAiIqWorldBank } from '../../lib/ai-iq-world-bank';
import { buildAiIqWorldBankProcesiranje } from '../../lib/ai-iq-world-bank-procesiranje';

async function main() {
  const summary = buildBankPrototypeSummary();
  assert.deepEqual(Object.keys(summary).sort(), ['name', 'environment', 'paymentsEnabled', 'settlementVerified', 'accountIssuanceEnabled', 'cardIssuanceEnabled', 'invoiceBalance', 'notice'].sort());
  assert.equal(summary.paymentsEnabled, false);
  assert.equal(summary.invoiceBalance, null);
  let called = false;
  for (const header of [null, '', 'Basic test', 'Bearer ']) {
    assert.equal((await readBankSession(header, async () => { called = true; return null; })).status, 401);
  }
  assert.equal(called, false);
  assert.equal((await readBankSession('Bearer invalid', async () => null)).status, 401);
  const session = await readBankSession('Bearer valid', async () => ({ id: 'verified-server-user' }));
  assert.equal(session.status, 200);
  assert.equal(session.data?.userId, 'verified-server-user');
  await assert.rejects(readBankSession('Bearer valid', async () => { throw new Error('offline'); }));
  const legacy = buildAiIqWorldBank('test');
  assert.equal(legacy.environment, 'simulation');
  assert.equal(legacy.paymentsEnabled, false);
  assert.equal(legacy.ersteInfo.vlasnik.jmbg, '[REDACTED]');
  assert.equal(legacy.ersteInfo.vlasnik.registarskiBrojLicneKarte, '[REDACTED]');
  assert(legacy.ersteInfo.racuni.every(a => a.brojRacuna === 'SIMULATION-NOT-A-BANK-ACCOUNT'));
  assert(legacy.transferi.every(t => t.status !== 'izvrseno'));
  assert.equal(buildAiIqWorldBankProcesiranje().settlementVerified, false);
  console.log('PASS: allowlist, redaction, simulation and verified-identity-only session');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
