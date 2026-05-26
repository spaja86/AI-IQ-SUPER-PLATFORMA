import assert from 'assert';
import {
  KOMPANIJA_FORMALNA_ADRESA,
  KOMPANIJA_FORMALNI_IDENTITET,
  KOMPANIJA_FORMALNI_NAZIV,
} from '../../lib/constants';
import {
  getEnterprisePodzahtevi,
  getEnterpriseZahtevByProviderAndSubtype,
} from '../../lib/kompanija-spaja-operativa';

function run() {
  console.log('\n📡 Enterprise CDN proxy request tests\n');

  const podzahtevi = getEnterprisePodzahtevi();
  assert.ok(Array.isArray(podzahtevi) && podzahtevi.length > 0, 'Podzahtevi moraju postojati');

  const cdn = podzahtevi.find((item) => item.podtip === 'vercel-cdn-proxy-trust');
  assert.ok(cdn, 'Vercel CDN/proxy trust podzahtev mora postojati');
  assert.strictEqual(cdn?.id, 'vercel');
  assert.strictEqual(cdn?.scope?.pravniIdentitet.naziv, KOMPANIJA_FORMALNI_NAZIV);
  assert.strictEqual(cdn?.scope?.pravniIdentitet.adresa, KOMPANIJA_FORMALNA_ADRESA);
  assert.strictEqual(cdn?.scope?.pravniIdentitet.punNaziv, KOMPANIJA_FORMALNI_IDENTITET);
  assert.ok(cdn?.dispatchChecklist?.length, 'Dispatch checklist mora postojati');
  assert.strictEqual(cdn?.envSignal, 'SPAJA_VERCEL_CDN_PROXY_REQUEST_SUBMITTED');

  const resolved = getEnterpriseZahtevByProviderAndSubtype('vercel', 'vercel-cdn-proxy-trust');
  assert.ok(resolved, 'Lookup po provider+podtip mora pronaći CDN zahtev');
  assert.strictEqual(resolved?.podtip, 'vercel-cdn-proxy-trust');

  console.log('✅ Enterprise CDN proxy request tests passed\n');
}

run();
