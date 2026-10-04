import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import { GET as bank } from '../../app/api/banka/route';
import { GET as accounts } from '../../app/api/erste-banka-racuni/route';
import { GET as transfers } from '../../app/api/banka-transfer-dugovi/route';
import { GET as session } from '../../app/api/bank-prototype/session/route';

async function main() {
  for (const handler of [bank, accounts, transfers]) {
    const response = await handler();
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.environment, 'simulation');
    assert.equal(body.paymentsEnabled, false);
    assert.equal(body.settlementVerified, false);
    const text = JSON.stringify(body);
    for (const forbidden of ['jmbg', 'registarskiBrojLicneKarte', 'brojRacuna', 'izvrseno']) {
      assert(!text.includes(forbidden));
    }
  }
  const response = await session(new NextRequest('https://example.test/api/bank-prototype/session?userId=other-user'));
  assert.equal(response.status, 401);
  assert.equal(response.headers.get('cache-control'), 'private, no-store');
  assert.equal(response.headers.get('vary'), 'Authorization');
  const error = await response.json();
  assert.equal(error.data, undefined);
  console.log('PASS: public route redaction, unverified settlement and private unauthenticated response');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
