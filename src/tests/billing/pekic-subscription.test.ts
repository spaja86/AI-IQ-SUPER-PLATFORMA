import {
  PEKIC_PARTY,
  PEKIC_SUBSCRIPTION,
  buildPekicAuditEntry,
  canIssuePekicInvoice,
  generatePekicInvoice,
  getPekicSubscriptionOverview,
  isPekicIntakeComplete,
} from '../../lib/billing/pekic-subscription';

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (error) {
    console.error(`  ❌ ${name}: ${error instanceof Error ? error.message : String(error)}`);
    failed++;
  }
}

function ok(condition: boolean, msg: string): void {
  if (!condition) throw new Error(`Assert failed: ${msg}`);
}

async function runTests(): Promise<void> {
  console.log('\n📋 PEKIC d.o.o. Pretplata Tests\n');

  await test('Pretplata je inicijalno u RSD i incomplete-intake statusu', () => {
    ok(PEKIC_SUBSCRIPTION.currency === 'RSD', `currency=${PEKIC_SUBSCRIPTION.currency}`);
    ok(PEKIC_SUBSCRIPTION.status === 'incomplete-intake', `status=${PEKIC_SUBSCRIPTION.status}`);
  });

  await test('Pojam beskonačnog računa je modelovan kao endDate null', () => {
    ok(PEKIC_SUBSCRIPTION.endDate === null, 'endDate === null');
  });

  await test('Intake nije kompletan bez pravnog osnova i identifikacije', () => {
    ok(!isPekicIntakeComplete(), 'isPekicIntakeComplete === false');
  });

  await test('Faktura ne može da se izda dok status nije odobren', () => {
    ok(!canIssuePekicInvoice(), 'canIssuePekicInvoice === false');
    ok(generatePekicInvoice('2026-08-05') === null, 'invoice === null');
  });

  await test('Overview vraća governance referencu i guard status', () => {
    const overview = getPekicSubscriptionOverview();
    ok(overview.governance === '/docs/PEKIC-DOO-PRETPLATA-RSD.md', `governance=${overview.governance}`);
    ok(overview.canIssueInvoice === false, 'canIssueInvoice === false');
  });

  await test('Audit zapis koristi RSD i OKRID', () => {
    const audit = buildPekicAuditEntry('2026-08-05', '2026-09-05');
    ok(audit.currency === 'RSD', `currency=${audit.currency}`);
    ok(audit.okrid === 'OKRID-2026-PEKIC-001', `okrid=${audit.okrid}`);
  });

  await test('Faktura se generiše tek nakon simulacije pravno odobrenog stanja', () => {
    const originalStatus = PEKIC_SUBSCRIPTION.status;
    const originalIznos = PEKIC_SUBSCRIPTION.iznosRsd;
    const originalPdv = PEKIC_SUBSCRIPTION.pdvStopa;
    const originalOsnov = PEKIC_SUBSCRIPTION.pravniOsnov;
    const originalOpis = PEKIC_SUBSCRIPTION.opisUsluge;
    const originalSediste = PEKIC_PARTY.sediste;
    const originalPib = PEKIC_PARTY.pib;
    const originalMb = PEKIC_PARTY.mb;
    const originalPotpisnik = PEKIC_PARTY.ovlasceniPotpisnik;
    const originalEmail = PEKIC_PARTY.email;

    PEKIC_SUBSCRIPTION.status = 'approved-for-invoice';
    PEKIC_SUBSCRIPTION.iznosRsd = 100000;
    PEKIC_SUBSCRIPTION.pdvStopa = 0.2;
    PEKIC_SUBSCRIPTION.pravniOsnov = 'Okvirni ugovor o pretplati';
    PEKIC_SUBSCRIPTION.opisUsluge = 'Mesečna B2B pretplata';
    PEKIC_PARTY.sediste = 'Republika Srbija';
    PEKIC_PARTY.pib = '100000001';
    PEKIC_PARTY.mb = '200000001';
    PEKIC_PARTY.ovlasceniPotpisnik = 'Ovlašćeno lice';
    PEKIC_PARTY.email = 'office@pekic.rs';

    const faktura = generatePekicInvoice('2026-08-05');
    ok(faktura !== null, 'invoice exists');
    ok(faktura?.ukupnoRsd === 120000, `ukupnoRsd=${faktura?.ukupnoRsd}`);
    ok(faktura?.datumDospeca === '2026-09-05', `datumDospeca=${faktura?.datumDospeca}`);

    PEKIC_SUBSCRIPTION.status = originalStatus;
    PEKIC_SUBSCRIPTION.iznosRsd = originalIznos;
    PEKIC_SUBSCRIPTION.pdvStopa = originalPdv;
    PEKIC_SUBSCRIPTION.pravniOsnov = originalOsnov;
    PEKIC_SUBSCRIPTION.opisUsluge = originalOpis;
    PEKIC_PARTY.sediste = originalSediste;
    PEKIC_PARTY.pib = originalPib;
    PEKIC_PARTY.mb = originalMb;
    PEKIC_PARTY.ovlasceniPotpisnik = originalPotpisnik;
    PEKIC_PARTY.email = originalEmail;
  });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failed > 0) process.exit(1);
}

runTests().catch((error) => {
  console.error('Test greška:', error);
  process.exit(1);
});
