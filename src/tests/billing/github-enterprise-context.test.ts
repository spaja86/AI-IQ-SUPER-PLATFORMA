import assert from 'assert';
import { getEnterpriseZahtevi } from '../../lib/kompanija-spaja-operativa';

function run() {
  console.log('\n🏢 GitHub enterprise context tests\n');

  const github = getEnterpriseZahtevi().find((item) => item.id === 'github');
  assert.ok(github, 'GitHub enterprise zahtev mora postojati');
  assert.strictEqual(github?.eksplicitniKontekst?.accountEmail, 'spajicn@yahoo.com');
  assert.strictEqual(github?.eksplicitniKontekst?.ownerName, 'Nikola Spajić');
  assert.strictEqual(github?.eksplicitniKontekst?.najboljePretplate, true);
  assert.ok(github?.trazeniPlanovi.includes('Best available enterprise subscription package'));

  console.log('✅ GitHub enterprise context tests passed\n');
}

run();
