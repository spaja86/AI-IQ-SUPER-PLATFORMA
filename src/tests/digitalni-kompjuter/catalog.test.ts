import assert from 'node:assert/strict';
import type { User } from '@supabase/supabase-js';
import { getSveKomponente, getAktivneKomponente, getKompjuterStatistika } from '../../lib/spaja-digitalni-kompjuter';
import { canReadB2BControlCenter } from '../../lib/b2b-control-center-auth';
import { GET as activate } from '../../app/api/spaja-digitalni-kompjuter-aktivacija/route';
import { GET as status } from '../../app/api/spaja-digitalni-kompjuter-status/route';
const components = getSveKomponente();
assert.equal(new Set(components.map(c => c.id)).size, components.length);
assert(components.some(c => c.id === 'spaja-dzojstici'));
assert.equal(getKompjuterStatistika().ukupnoKomponenti, components.length);
assert.equal(getKompjuterStatistika().aktivnihKomponenti, getAktivneKomponente().length);
function user(app: unknown, editable: unknown = 999) {
  return { app_metadata: { clearanceLevel: app }, user_metadata: { clearanceLevel: editable } } as unknown as User;
}
assert.equal(canReadB2BControlCenter(user(undefined)), false);
for (const value of [0, -1, '1', NaN, Infinity, 1.5]) assert.equal(canReadB2BControlCenter(user(value)), false);
assert.equal(canReadB2BControlCenter(user(1)), true);
async function main() {
  for (const handler of [activate, status]) {
    const response = await handler();
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.status, 'deklarisano');
    assert.equal(body.runtimeVerified, false);
    assert.equal(body.rezim, 'declaration-only');
    if (body.aktivacija) assert.equal(body.aktivacija.aktiviran, false);
  }
  console.log('PASS: catalog consistency, trusted authorization and non-provisioning API contracts');
}
main().catch(e => { console.error(e); process.exitCode = 1; });
