// Autofinish #1262 — AI IQ World Bank — Unit Test Suite

import {
  buildAiIqWorldBank,
  AIIQ_WORLD_BANK_KAMATNA_STOPA,
  AIIQ_WORLD_BANK_MIN_ULOG,
  AIIQ_WORLD_BANK_URL,
  AIIQ_WORLD_BANK_REPO,
} from '../../lib/ai-iq-world-bank';
import {
  APP_VERSION,
  TOTAL_API_ROUTES,
  TOTAL_ROUTES,
  AUTOFINISH_COUNT,
} from '../../lib/constants';

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

function assertEqual<T>(actual: T, expected: T, label?: string): void {
  if (actual !== expected) {
    throw new Error(
      `${label ?? 'assertEqual'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
    );
  }
}

async function runTests(): Promise<void> {
  console.log('\n🏦 AI IQ World Bank — Unit Test Suite (#1262)\n');

  const r = buildAiIqWorldBank('test-user-id');

  // ── Status i metapodaci ───────────────────────────────────────────────────
  await test('Vraća objekat i status=aktivan', () => {
    assert(typeof r === 'object' && r !== null, 'rezultat je objekat');
    assertEqual(r.status, 'aktivan', 'status');
  });

  await test('Timestamp je validan ISO string', () => {
    assert(!Number.isNaN(Date.parse(r.timestamp)), 'timestamp ISO');
  });

  await test('verzija je APP_VERSION', () => {
    assertEqual(r.verzija, APP_VERSION, 'verzija');
  });

  await test('userId je prosleđen', () => {
    assertEqual(r.userId, 'test-user-id', 'userId');
  });

  // ── Profil banke ──────────────────────────────────────────────────────────
  await test('Profil banke ima sve obavezne vrednosti', () => {
    assertEqual(r.profil.naziv, 'AI IQ World Bank', 'naziv');
    assertEqual(r.profil.status, 'aktivan', 'status profila');
    assert(r.profil.url.length > 0, 'url nije prazan');
    assert(r.profil.repo.length > 0, 'repo nije prazan');
    assert(r.profil.misija.length > 0, 'misija nije prazna');
    assert(r.profil.vizija.length > 0, 'vizija nije prazna');
    assert(r.profil.vrednosti.length >= 4, 'vrednosti >= 4');
    assertEqual(r.profil.url, AIIQ_WORLD_BANK_URL, 'url konstanta');
    assertEqual(r.profil.repo, AIIQ_WORLD_BANK_REPO, 'repo konstanta');
  });

  await test('Kamatna stopa prompt ima ispravne vrednosti', () => {
    assertEqual(r.kamatnaStopaPrompt.stopa, AIIQ_WORLD_BANK_KAMATNA_STOPA, 'stopa');
    assert(r.kamatnaStopaPrompt.primeri.length >= 7, 'primeri.length >= 7');
    for (const primer of r.kamatnaStopaPrompt.primeri) {
      assert(primer.ulog.length > 0, 'primer.ulog nije prazan');
      assert(primer.zarada.length > 0, 'primer.zarada nije prazna');
      assert(primer.ukupno.length > 0, 'primer.ukupno nije prazno');
    }
  });

  await test('Konstante su konzistentne', () => {
    assertEqual(AIIQ_WORLD_BANK_KAMATNA_STOPA, 40, 'kamatna stopa = 40');
    assertEqual(AIIQ_WORLD_BANK_MIN_ULOG, 1_000, 'min ulog = 1000');
  });

  // ── Usluge ────────────────────────────────────────────────────────────────
  await test('Usluge imaju svih 6 servisa', () => {
    assertEqual(r.usluge.length, 6, 'usluge.length');
    const ids = r.usluge.map((u) => u.id);
    assert(ids.includes('stedni-racun'), 'stedni-racun');
    assert(ids.includes('racuni'), 'racuni');
    assert(ids.includes('transferi'), 'transferi');
    assert(ids.includes('krediti'), 'krediti');
    assert(ids.includes('investicije'), 'investicije');
    assert(ids.includes('analitika'), 'analitika');
  });

  await test('Svaka usluga ima id, naziv, opis, ikonu i oznake', () => {
    for (const u of r.usluge) {
      assert(u.id.length > 0, `usluga ${u.id}.id nije prazan`);
      assert(u.naziv.length > 0, `usluga ${u.id}.naziv nije prazno`);
      assert(u.opis.length > 0, `usluga ${u.id}.opis nije prazan`);
      assert(u.ikona.length > 0, `usluga ${u.id}.ikona nije prazna`);
      assert(u.oznake.length > 0, `usluga ${u.id}.oznake nisu prazne`);
    }
  });

  // ── Bezbednost ────────────────────────────────────────────────────────────
  await test('Bezbednost ima minimum 4 stavke', () => {
    assert(r.bezbednost.length >= 4, `bezbednost.length >= 4, je ${r.bezbednost.length}`);
  });

  // ── ERSTE računi ──────────────────────────────────────────────────────────
  await test('ERSTE info ima ispravne podatke', () => {
    assertEqual(r.ersteInfo.banka, 'ERSTE Banka DOO Smederevo', 'banka');
    assertEqual(r.ersteInfo.racuni.length, 3, 'broj računa = 3');
    const valute = r.ersteInfo.racuni.map((ra) => ra.valuta);
    assert(valute.includes('RSD'), 'RSD račun postoji');
    assert(valute.includes('EUR'), 'EUR račun postoji');
    assert(valute.includes('USD'), 'USD račun postoji');
    for (const racun of r.ersteInfo.racuni) {
      assert(racun.brojRacuna.length > 0, `račun ${racun.valuta}.brojRacuna nije prazan`);
    }
  });

  // ── Omega AI tehnologija ──────────────────────────────────────────────────
  await test('Omega AI ima 6 funkcija', () => {
    assertEqual(r.omegaAiTehnologija.funkcije.length, 6, 'omega funkcije.length = 6');
    const ids = r.omegaAiTehnologija.funkcije.map((f) => f.id);
    assert(ids.includes('ai-scoring'), 'ai-scoring');
    assert(ids.includes('ai-fraud'), 'ai-fraud');
    assert(ids.includes('ai-investicije'), 'ai-investicije');
    assert(ids.includes('ai-predikcija'), 'ai-predikcija');
    assert(ids.includes('ai-optimizacija'), 'ai-optimizacija');
    assert(ids.includes('ai-podrska'), 'ai-podrska');
  });

  // ── Smederevo ekspanzija ──────────────────────────────────────────────────
  await test('Smederevo ekspanzija ima opis i aktivnosti', () => {
    assert(r.smederevoEkspanzija.lokacija.includes('Smederevo'), 'lokacija sadrži Smederevo');
    assert(r.smederevoEkspanzija.aktivnosti.length >= 5, 'aktivnosti >= 5');
  });

  // ── Partneri ──────────────────────────────────────────────────────────────
  await test('Ima minimum 6 partnera', () => {
    assert(r.partneri.length >= 6, `partneri.length >= 6, je ${r.partneri.length}`);
    const ids = r.partneri.map((p) => p.id);
    assert(ids.includes('erste-banka'), 'erste-banka partner');
    assert(ids.includes('kompanija-spaja'), 'kompanija-spaja partner');
    assert(ids.includes('omega-ai'), 'omega-ai partner');
  });

  await test('Svaki partner ima id, naziv, opis, ikonu i status', () => {
    for (const p of r.partneri) {
      assert(p.id.length > 0, `partner.id nije prazan`);
      assert(p.naziv.length > 0, `partner ${p.id}.naziv`);
      assert(p.opis.length > 0, `partner ${p.id}.opis`);
      assert(p.ikona.length > 0, `partner ${p.id}.ikona`);
      assert(p.status.length > 0, `partner ${p.id}.status`);
    }
  });

  // ── Transferi ─────────────────────────────────────────────────────────────
  await test('Ima minimum 1 transfer', () => {
    assert(r.transferi.length >= 1, `transferi.length >= 1`);
    const trx = r.transferi[0];
    assert(trx !== undefined, 'prvi transfer postoji');
    assert(trx.iznos > 0, 'transfer.iznos > 0');
    assert(trx.valuta.length > 0, 'transfer.valuta');
    assert(trx.status.length > 0, 'transfer.status');
  });

  // ── Dugovi ────────────────────────────────────────────────────────────────
  await test('Dugovi imaju ispravnu strukturu', () => {
    assert(r.dugovi.ukupnoUSD >= 0, 'ukupnoUSD >= 0');
    assert(r.dugovi.stavke.length >= 1, 'stavke.length >= 1');
    assert(r.dugovi.napomena.length > 0, 'napomena nije prazna');
    const vercel = r.dugovi.stavke.find((d) => d.partner === 'Vercel');
    assert(vercel !== undefined, 'Vercel dug postoji');
  });

  // ── Kontakt ───────────────────────────────────────────────────────────────
  await test('Kontakt ima minimum 3 kanala', () => {
    assert(r.kontakt.length >= 3, `kontakt.length >= 3, je ${r.kontakt.length}`);
    for (const k of r.kontakt) {
      assert(k.adresa.length > 0, `kontakt.adresa nije prazna`);
      assert(k.namena.length > 0, `kontakt.namena nije prazna`);
    }
  });

  await test('Društvene mreže — ima minimum 4 mreže', () => {
    assert(r.drustvneMreze.length >= 4, `drustvneMreze.length >= 4`);
    for (const m of r.drustvneMreze) {
      assert(m.url.startsWith('https://'), `mreža ${m.naziv}.url mora biti https`);
    }
  });

  // ── Srpske banke ──────────────────────────────────────────────────────────
  await test('Srpske banke — ima 12 banaka u registru', () => {
    assertEqual(r.srpskeBanke.banke.length, 12, 'srpske banke = 12');
    const erste = r.srpskeBanke.banke.find((b) => b.id === 'erste');
    assert(erste !== undefined, 'Erste banka postoji');
    assertEqual(erste.statusZahteva, 'aktivna-saradnja', 'erste status aktivna-saradnja');
  });

  await test('Mesni porez ima ispravnu strukturu', () => {
    assert(r.srpskeBanke.mesniPorez.opis.length > 0, 'mesniPorez.opis');
    assert(r.srpskeBanke.mesniPorez.teritorija.length > 0, 'mesniPorez.teritorija');
    assert(r.srpskeBanke.mesniPorez.status.length > 0, 'mesniPorez.status');
  });

  // ── GitHub Billing ────────────────────────────────────────────────────────
  await test('GitHub Billing sekcija je prisutna i konzistentna', () => {
    assert(r.githubBilling.racun.status === 'aktivan', 'billing racun aktivan');
    assert(r.githubBilling.budzet.mesecniLimitUSD > 0, 'mesecniLimit > 0');
    assert(r.githubBilling.pilotTransakcije.length >= 2, 'pilot transakcije >= 2');
    assert(r.githubBilling.rolloutFaze.length === 3, 'rollout faze = 3');
    assert(r.githubBilling.uloge.length === 3, 'uloge = 3');
    assert(r.githubBilling.auditLog.length >= 4, 'audit log >= 4');
    assert(r.githubBilling.statistike.ukupnoTransakcija >= 2, 'statistike.ukupnoTransakcija >= 2');
  });

  // ── KPI ───────────────────────────────────────────────────────────────────
  await test('KPI ima sve obavezne vrednosti', () => {
    assertEqual(r.kpi.kamatnaStopaPrompt, AIIQ_WORLD_BANK_KAMATNA_STOPA, 'kpi.kamatnaStopaPrompt');
    assert(r.kpi.aktivnihRacuna > 0, 'aktivnih računa > 0');
    assert(r.kpi.transferaKnaDan > 0, 'transfera/dan > 0');
    assert(r.kpi.aiTacnost > 0, 'aiTacnost > 0');
    assert(r.kpi.partneraUkupno === r.partneri.length, 'partneraUkupno === partneri.length');
    assert(r.kpi.srpskihBanaka === r.srpskeBanke.banke.length, 'srpskihBanaka === banke.length');
    assert(r.kpi.githubBillingTransakcija >= 2, 'githubBillingTransakcija >= 2');
  });

  // ── Verzije i konstante ───────────────────────────────────────────────────
  await test('Verzije i konstante su ažurirani za AI IQ World Bank modul', () => {
    assertEqual(APP_VERSION, '54.1.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1272, 'AUTOFINISH_COUNT');
    assertEqual(TOTAL_API_ROUTES, 1138, 'TOTAL_API_ROUTES');
    assertEqual(TOTAL_ROUTES, 1230, 'TOTAL_ROUTES');
  });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) {
    console.error('\n❌ Neuspešni testovi:');
    failures.forEach((f) => console.error(`  • ${f}`));
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Kritična greška u test runneru:', e);
  process.exit(1);
});
