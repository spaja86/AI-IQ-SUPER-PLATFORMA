import assert from 'node:assert/strict';
import { GET as status } from '../../app/api/spaja-digitalni-kompjuter-status/route';
import { GET as activate } from '../../app/api/spaja-digitalni-kompjuter-aktivacija/route';
import { GET as catalog } from '../../app/api/spaja-digitalni-kompjuter/route';
import { GET as overview } from '../../app/api/spaja-digitalni-kompjuter-pregled/route';
import { getSveKomponente, getKompjuterStatistika, spajaKonzole } from '../../lib/spaja-digitalni-kompjuter';
import { spajaDigitalniKompjuterSekvence } from '../../lib/sekvence/spaja-digitalni-kompjuter-page';

const envNames = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'BLOB_READ_WRITE_TOKEN', 'VERCEL_KV_REST_API_URL', 'VERCEL_KV_REST_API_TOKEN'];
const previous = envNames.map(name => process.env[name]);
const originalFetch = globalThis.fetch;

async function main() {
  let fetches = 0;
  globalThis.fetch = async () => { fetches++; throw new Error('Presence report must not contact providers'); };
  try {
    for (const configured of [false, true]) {
      for (const name of envNames) {
        if (configured) process.env[name] = 'synthetic-configuration-only';
        else delete process.env[name];
      }
      for (const handler of [status, activate, catalog, overview]) {
        const response = await handler();
        assert.equal(response.status, 200);
        const body = await response.json();
        assert.equal(body.runtimeVerified, false);
        assert.equal(body.statusScope, 'declaration-only');
        const server = body.server;
        assert.equal(server.configurationStatus, configured ? 'READY' : 'UNCONFIGURED');
        assert.equal(server.configurationScope, 'presence-only');
        assert(server.adapters.every((a: { configured: boolean }) => a.configured === configured));
        assert.deepEqual(server.availability, { status: 'not-measured', checkedAt: null, source: null });
        assert.equal(server.availabilityVerified, false);
        assert.deepEqual(server.execution, { status: 'not-verified', verifiedAt: null, source: null });
        assert.equal(server.executionEnabled, false);
        assert.equal(server.buildWorkerImplemented, false);
        const metrics = body.zdravlje ?? body.kompjuter ?? body.pregled;
        assert.equal(metrics.aktivnihKomponenti, null);
        if ('procenatAktivnih' in metrics) assert.equal(metrics.procenatAktivnih, null);
        assert.equal(metrics.deklarisanoAktivnihKomponenti, getSveKomponente().filter(c => c.status === 'aktivan').length);
        if (metrics.komponente) assert(metrics.komponente.every((c: { statusScope: string }) => c.statusScope === 'declaration-only'));
        assert(!JSON.stringify(body).includes('synthetic-configuration-only'));
      }
    }
    assert.equal(fetches, 0);
    assert.equal(getKompjuterStatistika().aktivnihKomponenti, null);
    const components = getSveKomponente();
    assert.equal(components.length, 16);
    assert(components.every(c => c.statusScope === 'declaration-only' && c.link && c.mogucnosti.length > 0));
    assert(spajaKonzole.every(c => c.statusScope === 'declaration-only'));
    assert.deepEqual(components.find(c => c.id === 'spaja-server')?.mogucnosti,
      ['Cloud hosting', 'Load balancing', 'Auto-scaling', 'Distribuirani resursi', 'Server klaster', 'Edge computing']);
    const text = JSON.stringify(spajaDigitalniKompjuterSekvence);
    assert(!text.includes('✅ Aktivan'));
    assert(text.includes('Deklarisano aktivne'));
    assert(text.includes('fizički i virtuelni resursi nisu izmereni'));
    console.log('PASS: 4 API handlers × 2 configuration states; unknown measurements, disabled execution, preserved catalog and declaration UI');
  } finally {
    globalThis.fetch = originalFetch;
    envNames.forEach((name, index) => {
      if (previous[index] === undefined) delete process.env[name]; else process.env[name] = previous[index];
    });
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
