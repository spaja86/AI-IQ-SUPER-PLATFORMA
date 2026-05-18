// Autofinish #1140 — GitHub Billing AI IQ World Bank Tests
// Kompanija SPAJA — Digitalna Industrija

import { AUTOFINISH_COUNT, APP_VERSION, TOTAL_API_ROUTES, TOTAL_ROUTES } from '../../lib/constants';
import {
  gitHubBillingRacun,
  gitHubBillingUloge,
  gitHubBillingBudzet,
  gitHubPilotTransakcije,
  gitHubOrgBillingModel,
  gitHubBillingAuditLog,
  gitHubBillingRolloutFaze,
  getGitHubBillingStatistike,
  kreirajAuditZapis,
} from '../../lib/github-billing-aiiq-worldbank';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }
function assertEqual<T>(a: T, e: T, l?: string): void { if (a !== e) throw new Error(`${l ?? 'assertEqual'}: expected ${JSON.stringify(e)}, got ${JSON.stringify(a)}`); }

async function runTests(): Promise<void> {
  console.log('\n🏦💳 GitHub Billing AI IQ World Bank Tests (#1140)\n');

  // ── Billing račun ──────────────────────────────────────────────────────────
  await test('gitHubBillingRacun ima ispravne podatke', () => {
    assertEqual(gitHubBillingRacun.banka, 'AI IQ World Bank', 'banka');
    assertEqual(gitHubBillingRacun.valuta, 'USD', 'valuta');
    assertEqual(gitHubBillingRacun.status, 'aktivan', 'status');
    assert(gitHubBillingRacun.vlasnik.length > 0, 'vlasnik mora biti postavljen');
  });

  await test('gitHubBillingRacun ID postoji', () => {
    assert(gitHubBillingRacun.id.startsWith('aiiq-'), `id treba da pocinje sa aiiq-: ${gitHubBillingRacun.id}`);
  });

  // ── Uloge ──────────────────────────────────────────────────────────────────
  await test('postoje 3 billing uloge', () => {
    assertEqual(gitHubBillingUloge.length, 3, 'broj uloga');
  });

  await test('GLAVNI ENDŽIN uloga postoji', () => {
    const uloga = gitHubBillingUloge.find((u) => u.uloga === 'glavni_endzin');
    assert(uloga !== undefined, 'uloga glavni_endzin mora postojati');
    assert(uloga.odgovornosti.length >= 3, 'mora imati bar 3 odgovornosti');
  });

  await test('OMEGA AI operativa uloga postoji', () => {
    const uloga = gitHubBillingUloge.find((u) => u.uloga === 'omega_ai_operativa');
    assert(uloga !== undefined, 'uloga omega_ai_operativa mora postojati');
  });

  await test('uskladjenost uloga postoji', () => {
    const uloga = gitHubBillingUloge.find((u) => u.uloga === 'uskladjenost');
    assert(uloga !== undefined, 'uloga uskladjenost mora postojati');
  });

  // ── Budžet ─────────────────────────────────────────────────────────────────
  await test('budžet limiti su ispravni', () => {
    assert(gitHubBillingBudzet.mesecniLimitUSD > 0, 'mesecni limit mora biti > 0');
    assert(gitHubBillingBudzet.godisnjLimitUSD > gitHubBillingBudzet.mesecniLimitUSD, 'godisnji limit mora biti veci od mesecnog');
    assert(gitHubBillingBudzet.upozorenjeNa < gitHubBillingBudzet.mesecniLimitUSD, 'upozorenje mora biti ispod mesecnog limita');
    assert(gitHubBillingBudzet.kriticnoNa < gitHubBillingBudzet.mesecniLimitUSD, 'kriticno mora biti ispod mesecnog limita');
  });

  // ── Pilot transakcije ──────────────────────────────────────────────────────
  await test('postoje pilot transakcije', () => {
    assert(gitHubPilotTransakcije.length >= 2, `mora biti bar 2 pilot transakcije, ima: ${gitHubPilotTransakcije.length}`);
  });

  await test('sve pilot transakcije su u pilot fazi', () => {
    for (const t of gitHubPilotTransakcije) {
      assertEqual(t.status, 'pilot_faza', `transakcija ${t.id} status`);
    }
  });

  await test('pilot transakcije imaju ispravna odobrenja', () => {
    for (const t of gitHubPilotTransakcije) {
      assertEqual(t.odobrio, 'glavni_endzin', `transakcija ${t.id} odobrio`);
      assertEqual(t.izvrsio, 'omega_ai_operativa', `transakcija ${t.id} izvrsio`);
    }
  });

  await test('pilot transakcije imaju pozitivan iznos', () => {
    for (const t of gitHubPilotTransakcije) {
      assert(t.iznos > 0, `transakcija ${t.id} iznos mora biti > 0`);
    }
  });

  // ── Org billing model ──────────────────────────────────────────────────────
  await test('org billing model je ispravan', () => {
    assert(gitHubOrgBillingModel.billingOwner.includes('AI IQ World Bank'), 'billingOwner mora biti AI IQ World Bank');
    assertEqual(gitHubOrgBillingModel.platforma, 'GitHub', 'platforma');
    assert(gitHubOrgBillingModel.operativniKorisnik.includes('@'), 'operativni korisnik mora biti email');
  });

  // ── Audit log ──────────────────────────────────────────────────────────────
  await test('audit log ima zapise', () => {
    assert(gitHubBillingAuditLog.length >= 4, `mora biti bar 4 audit zapisa, ima: ${gitHubBillingAuditLog.length}`);
  });

  await test('svi audit zapisi su uspesni', () => {
    for (const z of gitHubBillingAuditLog) {
      assertEqual(z.status, 'uspesno', `audit zapis ${z.id} status`);
    }
  });

  await test('kreirajAuditZapis generiše ispravan zapis', () => {
    const zapis = kreirajAuditZapis('test_akcija', 'test_izvrsio', 'test_detalji');
    assert(zapis.id.startsWith('AUDIT-'), `id treba da pocinje sa AUDIT-: ${zapis.id}`);
    assertEqual(zapis.akcija, 'test_akcija', 'akcija');
    assertEqual(zapis.izvrsio, 'test_izvrsio', 'izvrsio');
    assertEqual(zapis.status, 'uspesno', 'default status');
  });

  // ── Rollout plan ──────────────────────────────────────────────────────────
  await test('postoje 3 rollout faze', () => {
    assertEqual(gitHubBillingRolloutFaze.length, 3, 'broj faza');
  });

  await test('prva faza je u toku', () => {
    const prvaFaza = gitHubBillingRolloutFaze.find((f) => f.faza === 1);
    assert(prvaFaza !== undefined, 'faza 1 mora postojati');
    assertEqual(prvaFaza.status, 'u_toku', 'faza 1 status');
  });

  await test('ostale faze su planirane', () => {
    const ostale = gitHubBillingRolloutFaze.filter((f) => f.faza > 1);
    for (const f of ostale) {
      assertEqual(f.status, 'planirana', `faza ${f.faza} status`);
    }
  });

  // ── Statistike ─────────────────────────────────────────────────────────────
  await test('getGitHubBillingStatistike vraća ispravne podatke', () => {
    const stats = getGitHubBillingStatistike();
    assert(stats.ukupnoTransakcija >= 2, 'ukupno transakcija >= 2');
    assert(stats.ukupnoIznosUSD > 0, 'ukupno iznos > 0');
    assert(stats.ukupnoFaza === 3, 'ukupno faza === 3');
    assert(stats.auditZapisa >= 4, 'audit zapisa >= 4');
    assertEqual(stats.verzija, APP_VERSION, 'verzija');
  });

  // ── Konstante ─────────────────────────────────────────────────────────────
  await test(`AUTOFINISH_COUNT === ${AUTOFINISH_COUNT}`, () => {
    assert(AUTOFINISH_COUNT >= 1153, `AUTOFINISH_COUNT mora biti >= 1153, je: ${AUTOFINISH_COUNT}`);
  });

  await test('TOTAL_API_ROUTES je ažuriran za GitHub billing', () => {
    assert(TOTAL_API_ROUTES >= 998, `TOTAL_API_ROUTES mora biti >= 998, je: ${TOTAL_API_ROUTES}`);
  });

  await test('TOTAL_ROUTES je ažuriran za GitHub billing', () => {
    assert(TOTAL_ROUTES >= 1057, `TOTAL_ROUTES mora biti >= 1057, je: ${TOTAL_ROUTES}`);
  });

  await test('APP_VERSION je ažurirana', () => {
    assert(APP_VERSION >= '46.53.0', `APP_VERSION mora biti >= 46.53.0, je: ${APP_VERSION}`);
  });
}

runTests().then(() => {
  console.log(`\n📊 Rezultati: ${passed} prošlo, ${failed} nije prošlo\n`);
  if (failures.length > 0) {
    console.error('Neuspeli testovi:\n' + failures.map((f) => `  • ${f}`).join('\n'));
    process.exit(1);
  }
}).catch((err) => {
  console.error('Neočekivana greška:', err);
  process.exit(1);
});
