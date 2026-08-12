import {
  GIGATRON_PARTY,
  GIGATRON_SUBSCRIPTION,
  buildGigatronAuditEntry,
  canIssueGigatronInvoice,
  generateGigatronInvoice,
  getGigatronSubscriptionOverview,
  isGigatronIntakeComplete,
} from '../../lib/billing/gigatron-subscription';

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
  console.log('\n📋 GIGATRON d.o.o. Pretplata Tests — 1 beskonačan račun\n');

  await test('Pretplata je inicijalno u RSD i incomplete-intake statusu', () => {
    ok(GIGATRON_SUBSCRIPTION.currency === 'RSD', `currency=${GIGATRON_SUBSCRIPTION.currency}`);
    ok(GIGATRON_SUBSCRIPTION.status === 'incomplete-intake', `status=${GIGATRON_SUBSCRIPTION.status}`);
  });

  await test('Pojam beskonačnog računa je modelovan kao endDate null i autoRenew true', () => {
    ok(GIGATRON_SUBSCRIPTION.endDate === null, 'endDate === null');
    ok(GIGATRON_SUBSCRIPTION.autoRenew === true, 'autoRenew === true');
  });

  await test('Intake nije kompletan bez pravnog osnova i identifikacije', () => {
    ok(!isGigatronIntakeComplete(), 'isGigatronIntakeComplete === false');
  });

  await test('Faktura ne može da se izda dok status nije odobren', () => {
    ok(!canIssueGigatronInvoice(), 'canIssueGigatronInvoice === false');
    ok(generateGigatronInvoice('2026-08-12') === null, 'invoice === null');
  });

  await test('Overview vraća governance referencu i guard status', () => {
    const overview = getGigatronSubscriptionOverview();
    ok(overview.governance === '/docs/GIGATRON-PRETPLATA-BESKONACNI-RACUN.md', `governance=${overview.governance}`);
    ok(overview.canIssueInvoice === false, 'canIssueInvoice === false');
  });

  await test('Audit zapis koristi RSD i OKRID', () => {
    const audit = buildGigatronAuditEntry('2026-08-12', '2026-09-12');
    ok(audit.currency === 'RSD', `currency=${audit.currency}`);
    ok(audit.okrid === 'OKRID-2026-GIGATRON-SUB-001', `okrid=${audit.okrid}`);
  });

  await test('Faktura se generiše tek nakon simulacije pravno odobrenog stanja', () => {
    const originalStatus = GIGATRON_SUBSCRIPTION.status;
    const originalIznos = GIGATRON_SUBSCRIPTION.iznosRsd;
    const originalPdv = GIGATRON_SUBSCRIPTION.pdvStopa;
    const originalOsnov = GIGATRON_SUBSCRIPTION.pravniOsnov;
    const originalOpis = GIGATRON_SUBSCRIPTION.opisUsluge;
    const originalSediste = GIGATRON_PARTY.sediste;
    const originalPib = GIGATRON_PARTY.pib;
    const originalMb = GIGATRON_PARTY.mb;
    const originalPotpisnik = GIGATRON_PARTY.ovlasceniPotpisnik;
    const originalEmail = GIGATRON_PARTY.email;

    try {
      GIGATRON_SUBSCRIPTION.status = 'approved-for-invoice';
      GIGATRON_SUBSCRIPTION.iznosRsd = 200000;
      GIGATRON_SUBSCRIPTION.pdvStopa = 0.2;
      GIGATRON_SUBSCRIPTION.pravniOsnov = 'Okvirni ugovor o pretplati';
      GIGATRON_SUBSCRIPTION.opisUsluge = 'Mesečna B2B pretplata — GIGATRON IT & Elektronika';
      GIGATRON_PARTY.sediste = 'Republika Srbija';
      GIGATRON_PARTY.pib = '100000002';
      GIGATRON_PARTY.mb = '200000002';
      GIGATRON_PARTY.ovlasceniPotpisnik = 'Ovlašćeno lice';
      GIGATRON_PARTY.email = 'office@gigatron.rs';

      const faktura = generateGigatronInvoice('2026-08-12');
      ok(faktura !== null, 'invoice exists');
      ok(faktura?.ukupnoRsd === 240000, `ukupnoRsd=${faktura?.ukupnoRsd}`);
      ok(faktura?.datumDospeca === '2026-09-12', `datumDospeca=${faktura?.datumDospeca}`);
      ok(faktura?.valuta === 'RSD', `valuta=${faktura?.valuta}`);
    } finally {
      GIGATRON_SUBSCRIPTION.status = originalStatus;
      GIGATRON_SUBSCRIPTION.iznosRsd = originalIznos;
      GIGATRON_SUBSCRIPTION.pdvStopa = originalPdv;
      GIGATRON_SUBSCRIPTION.pravniOsnov = originalOsnov;
      GIGATRON_SUBSCRIPTION.opisUsluge = originalOpis;
      GIGATRON_PARTY.sediste = originalSediste;
      GIGATRON_PARTY.pib = originalPib;
      GIGATRON_PARTY.mb = originalMb;
      GIGATRON_PARTY.ovlasceniPotpisnik = originalPotpisnik;
      GIGATRON_PARTY.email = originalEmail;
    }
  });

  await test('Mesečni obračun klampuje kraj meseca ispravno', () => {
    const originalStatus = GIGATRON_SUBSCRIPTION.status;
    const originalIznos = GIGATRON_SUBSCRIPTION.iznosRsd;
    const originalPdv = GIGATRON_SUBSCRIPTION.pdvStopa;

    try {
      GIGATRON_SUBSCRIPTION.status = 'approved-for-invoice';
      GIGATRON_SUBSCRIPTION.iznosRsd = 1000;
      GIGATRON_SUBSCRIPTION.pdvStopa = 0.2;
      const faktura = generateGigatronInvoice('2026-01-31');
      ok(faktura?.datumDospeca === '2026-02-28', `datumDospeca=${faktura?.datumDospeca}`);
    } finally {
      GIGATRON_SUBSCRIPTION.status = originalStatus;
      GIGATRON_SUBSCRIPTION.iznosRsd = originalIznos;
      GIGATRON_SUBSCRIPTION.pdvStopa = originalPdv;
    }
  });

  await test('Mesečni obračun podržava leap year februar', () => {
    const originalStatus = GIGATRON_SUBSCRIPTION.status;
    const originalIznos = GIGATRON_SUBSCRIPTION.iznosRsd;
    const originalPdv = GIGATRON_SUBSCRIPTION.pdvStopa;

    try {
      GIGATRON_SUBSCRIPTION.status = 'approved-for-invoice';
      GIGATRON_SUBSCRIPTION.iznosRsd = 1000;
      GIGATRON_SUBSCRIPTION.pdvStopa = 0.2;
      const faktura = generateGigatronInvoice('2028-01-31');
      ok(faktura?.datumDospeca === '2028-02-29', `datumDospeca=${faktura?.datumDospeca}`);
    } finally {
      GIGATRON_SUBSCRIPTION.status = originalStatus;
      GIGATRON_SUBSCRIPTION.iznosRsd = originalIznos;
      GIGATRON_SUBSCRIPTION.pdvStopa = originalPdv;
    }
  });

  await test('Godišnji obračun pomera godinu za 1', () => {
    const originalStatus = GIGATRON_SUBSCRIPTION.status;
    const originalIznos = GIGATRON_SUBSCRIPTION.iznosRsd;
    const originalPdv = GIGATRON_SUBSCRIPTION.pdvStopa;
    const originalInterval = GIGATRON_SUBSCRIPTION.interval;

    try {
      GIGATRON_SUBSCRIPTION.status = 'approved-for-invoice';
      GIGATRON_SUBSCRIPTION.iznosRsd = 1000;
      GIGATRON_SUBSCRIPTION.pdvStopa = 0.2;
      GIGATRON_SUBSCRIPTION.interval = 'yearly';
      const faktura = generateGigatronInvoice('2026-08-12');
      ok(faktura?.datumDospeca === '2027-08-12', `datumDospeca=${faktura?.datumDospeca}`);
    } finally {
      GIGATRON_SUBSCRIPTION.status = originalStatus;
      GIGATRON_SUBSCRIPTION.iznosRsd = originalIznos;
      GIGATRON_SUBSCRIPTION.pdvStopa = originalPdv;
      GIGATRON_SUBSCRIPTION.interval = originalInterval;
    }
  });

  await test('PDV obračun je ispravan za round2', () => {
    const originalStatus = GIGATRON_SUBSCRIPTION.status;
    const originalIznos = GIGATRON_SUBSCRIPTION.iznosRsd;
    const originalPdv = GIGATRON_SUBSCRIPTION.pdvStopa;

    try {
      GIGATRON_SUBSCRIPTION.status = 'approved-for-invoice';
      GIGATRON_SUBSCRIPTION.iznosRsd = 333;
      GIGATRON_SUBSCRIPTION.pdvStopa = 0.2;
      const faktura = generateGigatronInvoice('2026-08-12');
      ok(faktura !== null, 'invoice exists');
      ok(faktura?.pdvIznosRsd === 66.6, `pdvIznosRsd=${faktura?.pdvIznosRsd}`);
      ok(faktura?.ukupnoRsd === 399.6, `ukupnoRsd=${faktura?.ukupnoRsd}`);
    } finally {
      GIGATRON_SUBSCRIPTION.status = originalStatus;
      GIGATRON_SUBSCRIPTION.iznosRsd = originalIznos;
      GIGATRON_SUBSCRIPTION.pdvStopa = originalPdv;
    }
  });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failed > 0) process.exit(1);
}

runTests().catch((error) => {
  console.error('Test greška:', error);
  process.exit(1);
});
