// Autokuća B2B Perpetual Subscription — Unit Tests
// Kompanija SPAJA — Digitalna Industrija
// Governance: docs/AUTOKUCA-PRETPLATA.md

import assert from 'assert';
import {
  AUTOKUCA_KLIJENTI,
  AUTOKUCA_SUBSCRIPTIONS,
  getAutokucaSubscription,
  getAutokucaKlijent,
  isIntakeComplete,
  isSubscriptionActive,
  generateFullInvoice,
  buildAuditEntry,
  getAllAutokucaSubscriptionStatuses,
  type AutokucaKlijentId,
} from '../../lib/billing/autokuca-subscription';

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    console.error(`  ❌ ${name}: ${e instanceof Error ? e.message : String(e)}`);
    failed++;
  }
}

function ok(condition: boolean, msg: string): void {
  if (!condition) throw new Error(`Assert failed: ${msg}`);
}

async function runTests(): Promise<void> {
  console.log('\n📋 Autokuća B2B Pretplata Tests\n');

  // ── Klijenti ─────────────────────────────────────────────────────────────

  await test('Postoje tačno 2 autokuća klijenta', () => {
    ok(Object.keys(AUTOKUCA_KLIJENTI).length === 2, 'ukupno klijenata === 2');
  });

  await test('Kragujevac klijent ima ispravan OKRID', () => {
    const k = getAutokucaKlijent('AUTOKUCA-KG');
    ok(k.okrid === 'OKRID-2026-AUTOKUCA-KG-001', `okrid=${k.okrid}`);
  });

  await test('Beograd klijent ima ispravan OKRID', () => {
    const k = getAutokucaKlijent('AUTOKUCA-BG');
    ok(k.okrid === 'OKRID-2026-AUTOKUCA-BG-001', `okrid=${k.okrid}`);
  });

  await test('Kragujevac klijent ima ispravno pravno ime', () => {
    const k = getAutokucaKlijent('AUTOKUCA-KG');
    ok(k.pravnoIme === 'Kragujevac Autokuća d.o.o.', `pravnoIme=${k.pravnoIme}`);
  });

  await test('Beograd klijent ima ispravno pravno ime', () => {
    const k = getAutokucaKlijent('AUTOKUCA-BG');
    ok(k.pravnoIme === 'Beograd Autokuća d.o.o.', `pravnoIme=${k.pravnoIme}`);
  });

  // ── Subscription registar ─────────────────────────────────────────────────

  await test('Postoje tačno 2 subscription zapisa', () => {
    ok(Object.keys(AUTOKUCA_SUBSCRIPTIONS).length === 2, 'ukupno subscription === 2');
  });

  await test('KG subscription ima ispravan broj računa', () => {
    const s = getAutokucaSubscription('AUTOKUCA-KG');
    ok(s.invoiceNumber === 'INV-KG-2026-001', `invoiceNumber=${s.invoiceNumber}`);
  });

  await test('BG subscription ima ispravan broj računa', () => {
    const s = getAutokucaSubscription('AUTOKUCA-BG');
    ok(s.invoiceNumber === 'INV-BG-2026-001', `invoiceNumber=${s.invoiceNumber}`);
  });

  await test('KG subscription valuta je EUR', () => {
    const s = getAutokucaSubscription('AUTOKUCA-KG');
    ok(s.currency === 'EUR', `currency=${s.currency}`);
  });

  await test('BG subscription valuta je EUR', () => {
    const s = getAutokucaSubscription('AUTOKUCA-BG');
    ok(s.currency === 'EUR', `currency=${s.currency}`);
  });

  await test('KG subscription endDate je null (beskonačno)', () => {
    const s = getAutokucaSubscription('AUTOKUCA-KG');
    ok(s.endDate === null, 'endDate === null (perpetual)');
  });

  await test('BG subscription endDate je null (beskonačno)', () => {
    const s = getAutokucaSubscription('AUTOKUCA-BG');
    ok(s.endDate === null, 'endDate === null (perpetual)');
  });

  await test('KG subscription autoRenew je true', () => {
    const s = getAutokucaSubscription('AUTOKUCA-KG');
    ok(s.autoRenew === true, 'autoRenew === true');
  });

  await test('BG subscription autoRenew je true', () => {
    const s = getAutokucaSubscription('AUTOKUCA-BG');
    ok(s.autoRenew === true, 'autoRenew === true');
  });

  await test('KG PDV stopa je 20%', () => {
    const s = getAutokucaSubscription('AUTOKUCA-KG');
    ok(s.pdvStopa === 0.20, `pdvStopa=${s.pdvStopa}`);
  });

  await test('BG PDV stopa je 20%', () => {
    const s = getAutokucaSubscription('AUTOKUCA-BG');
    ok(s.pdvStopa === 0.20, `pdvStopa=${s.pdvStopa}`);
  });

  await test('KG inicijalni status je incomplete-intake', () => {
    const s = getAutokucaSubscription('AUTOKUCA-KG');
    ok(s.status === 'incomplete-intake', `status=${s.status}`);
  });

  await test('BG inicijalni status je incomplete-intake', () => {
    const s = getAutokucaSubscription('AUTOKUCA-BG');
    ok(s.status === 'incomplete-intake', `status=${s.status}`);
  });

  // ── Intake provera ────────────────────────────────────────────────────────

  await test('KG intake nije kompletan bez PIB/MB/iznosa', () => {
    ok(!isIntakeComplete('AUTOKUCA-KG'), 'isIntakeComplete(KG) === false');
  });

  await test('BG intake nije kompletan bez PIB/MB/iznosa', () => {
    ok(!isIntakeComplete('AUTOKUCA-BG'), 'isIntakeComplete(BG) === false');
  });

  // ── Aktivacija i faktura ──────────────────────────────────────────────────

  await test('KG pretplata nije aktivna pre aktivacije', () => {
    ok(!isSubscriptionActive('AUTOKUCA-KG'), 'isSubscriptionActive(KG) === false');
  });

  await test('BG pretplata nije aktivna pre aktivacije', () => {
    ok(!isSubscriptionActive('AUTOKUCA-BG'), 'isSubscriptionActive(BG) === false');
  });

  await test('generateFullInvoice vraća null dok pretplata nije aktivna (KG)', () => {
    const faktura = generateFullInvoice('AUTOKUCA-KG', '2026-08-02');
    ok(faktura === null, 'faktura === null dok nije active');
  });

  await test('generateFullInvoice vraća null dok pretplata nije aktivna (BG)', () => {
    const faktura = generateFullInvoice('AUTOKUCA-BG', '2026-08-02');
    ok(faktura === null, 'faktura === null dok nije active');
  });

  // ── Simulacija aktivacije i generisanja fakture ───────────────────────────

  await test('generateFullInvoice generiše ispravan račun posle aktivacije (KG)', () => {
    // Simuliramo aktivno stanje direktno na kopiji
    const sub = AUTOKUCA_SUBSCRIPTIONS['AUTOKUCA-KG'];
    const originalStatus = sub.status;
    const originalIznos = sub.iznos;

    sub.status = 'active';
    sub.iznos = 500;

    const faktura = generateFullInvoice('AUTOKUCA-KG', '2026-08-02');
    ok(faktura !== null, 'faktura nije null');
    ok(faktura!.invoiceNumber === 'INV-KG-2026-001', `invoiceNumber=${faktura!.invoiceNumber}`);
    ok(faktura!.valuta === 'EUR', `valuta=${faktura!.valuta}`);
    ok(faktura!.iznos === 500, `iznos=${faktura!.iznos}`);
    ok(faktura!.pdvIznos === 100, `pdvIznos=${faktura!.pdvIznos}`);
    ok(faktura!.ukupnoSaPdv === 600, `ukupnoSaPdv=${faktura!.ukupnoSaPdv}`);
    ok(faktura!.datumDospeca === '2026-09-02', `datumDospeca=${faktura!.datumDospeca}`);
    ok(faktura!.izdavalac.includes('SPAJA'), `izdavalac=${faktura!.izdavalac}`);
    ok(faktura!.primalac === 'Kragujevac Autokuća d.o.o.', `primalac=${faktura!.primalac}`);

    // Vrati originalne vrednosti
    sub.status = originalStatus;
    sub.iznos = originalIznos;
  });

  await test('generateFullInvoice generiše ispravan račun posle aktivacije (BG)', () => {
    const sub = AUTOKUCA_SUBSCRIPTIONS['AUTOKUCA-BG'];
    const originalStatus = sub.status;
    const originalIznos = sub.iznos;

    sub.status = 'active';
    sub.iznos = 750;

    const faktura = generateFullInvoice('AUTOKUCA-BG', '2026-08-02');
    ok(faktura !== null, 'faktura nije null');
    ok(faktura!.invoiceNumber === 'INV-BG-2026-001', `invoiceNumber=${faktura!.invoiceNumber}`);
    ok(faktura!.iznos === 750, `iznos=${faktura!.iznos}`);
    ok(faktura!.pdvIznos === 150, `pdvIznos=${faktura!.pdvIznos}`);
    ok(faktura!.ukupnoSaPdv === 900, `ukupnoSaPdv=${faktura!.ukupnoSaPdv}`);
    ok(faktura!.primalac === 'Beograd Autokuća d.o.o.', `primalac=${faktura!.primalac}`);

    sub.status = originalStatus;
    sub.iznos = originalIznos;
  });

  // ── Godišnja naplata — datum dospeća ─────────────────────────────────────

  await test('Godišnja naplata ima datum dospeća +1 godina', () => {
    const sub = AUTOKUCA_SUBSCRIPTIONS['AUTOKUCA-KG'];
    const originalStatus = sub.status;
    const originalIznos = sub.iznos;
    const originalInterval = sub.naplataInterval;

    sub.status = 'active';
    sub.iznos = 5000;
    sub.naplataInterval = 'yearly';

    const faktura = generateFullInvoice('AUTOKUCA-KG', '2026-08-02');
    ok(faktura !== null, 'faktura nije null (yearly)');
    ok(faktura!.datumDospeca === '2027-08-02', `datumDospeca=${faktura!.datumDospeca}`);

    sub.status = originalStatus;
    sub.iznos = originalIznos;
    sub.naplataInterval = originalInterval;
  });

  // ── Audit log ─────────────────────────────────────────────────────────────

  await test('buildAuditEntry generiše ispravan audit zapis za KG', () => {
    const entry = buildAuditEntry('AUTOKUCA-KG', '2026-08-02', '2026-09-02');
    ok(entry.okrid === 'OKRID-2026-AUTOKUCA-KG-001', `okrid=${entry.okrid}`);
    ok(entry.klijentId === 'AUTOKUCA-KG', `klijentId=${entry.klijentId}`);
    ok(entry.invoiceNumber === 'INV-KG-2026-001', `invoiceNumber=${entry.invoiceNumber}`);
    ok(entry.currency === 'EUR', `currency=${entry.currency}`);
    ok(entry.cycleStart === '2026-08-02', `cycleStart=${entry.cycleStart}`);
    ok(entry.cycleEnd === '2026-09-02', `cycleEnd=${entry.cycleEnd}`);
    ok(typeof entry.timestamp === 'string', 'timestamp postoji');
  });

  await test('buildAuditEntry generiše ispravan audit zapis za BG', () => {
    const entry = buildAuditEntry('AUTOKUCA-BG', '2026-08-02', '2026-09-02');
    ok(entry.okrid === 'OKRID-2026-AUTOKUCA-BG-001', `okrid=${entry.okrid}`);
    ok(entry.invoiceNumber === 'INV-BG-2026-001', `invoiceNumber=${entry.invoiceNumber}`);
    ok(entry.currency === 'EUR', `currency=${entry.currency}`);
  });

  // ── Status pregled ────────────────────────────────────────────────────────

  await test('getAllAutokucaSubscriptionStatuses vraća 2 zapisa', () => {
    const statusi = getAllAutokucaSubscriptionStatuses();
    ok(statusi.length === 2, `statusi.length=${statusi.length}`);
  });

  await test('Status pregled sadrži KG i BG', () => {
    const statusi = getAllAutokucaSubscriptionStatuses();
    const ids = statusi.map((s) => s.klijentId);
    ok(ids.includes('AUTOKUCA-KG'), 'sadrži KG');
    ok(ids.includes('AUTOKUCA-BG'), 'sadrži BG');
  });

  await test('Status pregled — endDate je null za oba (perpetual)', () => {
    const statusi = getAllAutokucaSubscriptionStatuses();
    for (const s of statusi) {
      ok(s.endDate === null, `endDate===null za ${s.klijentId}`);
    }
  });

  await test('Status pregled — autoRenew je true za oba', () => {
    const statusi = getAllAutokucaSubscriptionStatuses();
    for (const s of statusi) {
      ok(s.autoRenew === true, `autoRenew===true za ${s.klijentId}`);
    }
  });

  await test('Status pregled — currency je EUR za oba', () => {
    const statusi = getAllAutokucaSubscriptionStatuses();
    for (const s of statusi) {
      ok(s.currency === 'EUR', `currency===EUR za ${s.klijentId}`);
    }
  });

  await test('Status pregled — intakeComplete je false dok nema PIB/MB (oba)', () => {
    const statusi = getAllAutokucaSubscriptionStatuses();
    for (const s of statusi) {
      ok(!s.intakeComplete, `intakeComplete===false za ${s.klijentId}`);
    }
  });

  // suppress unused import warning
  void assert;

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failed > 0) process.exit(1);
}

runTests().catch((e) => { console.error('Test greška:', e); process.exit(1); });
