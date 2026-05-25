import {
  buildIssuerLicensingState,
  createIssuerAuthorityRequest,
  issueLicenseFromAuthority,
  transitionIssuerAuthorityStatus,
  getIssuerLicensingComplianceReport,
  getIssuerLicensingExpirations,
} from '../../lib/issuer-licensing';

let passed = 0;
let failed = 0;
const failures: string[] = [];

async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`  ❌ ${name}`);
    console.error(`     ${msg}`);
    failed++;
    failures.push(`${name}: ${msg}`);
  }
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`Assert failed: ${message}`);
}

async function runTests(): Promise<void> {
  console.log('\n🪪 Issuer licensing domain — Unit Test Suite\n');

  const initial = buildIssuerLicensingState();

  await test('State ima ovlašćenja, blokatore i role matricu', () => {
    assert(initial.authorities.length >= 1, 'mora postojati bar jedno ovlašćenje');
    assert(initial.blockers.length >= 1, 'mora postojati bar jedan blocker');
    assert(initial.roleMatrica.approver.length >= 1, 'approver permissions');
  });

  await test('Viewer ne može kreirati issuer ovlašćenje', () => {
    const denied = createIssuerAuthorityRequest(
      {
        naziv: 'Test Viewer Create',
        issuerEntitet: 'Test',
        kategorija: 'softver',
        pravniOsnov: 'Test',
        regulatorIliVendor: 'Test',
      },
      { role: 'viewer', id: 'viewer-1' },
    );
    assert(!denied.ok, 'viewer create mora biti odbijen');
  });

  let createdId = '';
  await test('Editor može kreirati issuer ovlašćenje', () => {
    const created = createIssuerAuthorityRequest(
      {
        naziv: 'Test Issuer Authority',
        issuerEntitet: 'Digitalna Industrija',
        kategorija: 'api-pristup',
        pravniOsnov: 'Test pravni osnov',
        regulatorIliVendor: 'Test regulator',
        checklistaPreIzdavanja: ['dokaz-ugovora'],
      },
      { role: 'editor', id: 'editor-1' },
    );
    assert(created.ok, 'editor create mora proći');
    if (created.ok) createdId = created.authority.id;
  });

  await test('Editor može prebaciti draft u u_proveri', () => {
    const moved = transitionIssuerAuthorityStatus(
      { authorityId: createdId, noviStatus: 'u_proveri', razlog: 'priprema odobrenja' },
      { role: 'editor', id: 'editor-1' },
    );
    assert(moved.ok, 'draft -> u_proveri mora biti dozvoljeno za editor');
  });

  await test('Editor ne može odobriti issuer ovlašćenje', () => {
    const denied = transitionIssuerAuthorityStatus(
      { authorityId: createdId, noviStatus: 'odobreno', razlog: 'manual test' },
      { role: 'editor', id: 'editor-1' },
    );
    assert(!denied.ok, 'editor ne sme odobriti');
  });

  await test('Approver može odobriti issuer ovlašćenje uz privremeni razlog', () => {
    const approved = transitionIssuerAuthorityStatus(
      { authorityId: createdId, noviStatus: 'odobreno', razlog: 'privremeno odobrenje' },
      { role: 'approver', id: 'approver-1' },
    );
    assert(approved.ok, 'approver odobrenje');
  });

  await test('Izdavanje je blokirano bez kompletne checkliste', () => {
    const blocked = issueLicenseFromAuthority(
      {
        authorityId: createdId,
        primalacNaziv: 'Test Partner',
        primalacEmail: 'partner@example.com',
        izdavanjeTip: 'direktna',
        checklistKeys: [],
      },
      { role: 'admin', id: 'admin-1' },
    );
    assert(!blocked.ok, 'izdavanje bez checkliste mora biti odbijeno');
  });

  await test('Admin može izdati licencu kada je gating ispunjen', () => {
    const issued = issueLicenseFromAuthority(
      {
        authorityId: createdId,
        primalacNaziv: 'Test Partner',
        primalacEmail: 'partner@example.com',
        izdavanjeTip: 'direktna',
        checklistKeys: ['dokaz-ugovora'],
      },
      { role: 'admin', id: 'admin-1' },
    );
    assert(issued.ok, 'izdavanje mora proći sa checklistom');
  });

  await test('Compliance i expirations helperi vraćaju validnu strukturu', () => {
    const mesecni = getIssuerLicensingComplianceReport('mesecni');
    const expirations = getIssuerLicensingExpirations(400);
    assert(mesecni.ukupnoOvlascenja >= 1, 'compliance ukupno');
    assert(typeof mesecni.approvalCoverageProcenat === 'number', 'compliance coverage');
    assert(Array.isArray(expirations), 'expirations je niz');
  });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) {
    console.error('\n❌ Neuspešni testovi:');
    failures.forEach((f) => console.error(`  • ${f}`));
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatalna greška u testu:', err);
  process.exit(1);
});
