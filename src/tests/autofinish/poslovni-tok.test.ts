// Autofinish — Poslovni Tok Test (Plan 100% Uspešnog Poslovanja)

import { APP_VERSION, AUTOFINISH_COUNT, TOTAL_API_ROUTES, TOTAL_ROUTES, TOTAL_DIAGNOSTIKA } from '../../lib/constants';
import {
  kreirajSlaFaze,
  proveraDocumentGate,
  mozeTransicija,
  izracunajKpi,
  izracunajSlaIzvestaj,
  getPoslovniTokMeta,
  demoSlucajevi,
  SLA_CILJEVI_SATI,
  OBAVEZNI_DOKUMENTI,
  STATUS_TRANZICIJE,
  type PoslovniTokSlucaj,
  type PoslovniDokument,
} from '../../lib/poslovni-tok';
import {
  kreirajDeliveryChecklist,
  validirajArrivalEvent,
  finalizirajArrivalEvent,
  getDeliveryChecklistMeta,
  DEFAULT_DELIVERY_CHECKLIST,
  type ArrivalEvent,
} from '../../lib/delivery-checklist';
import { GET as getPoslovniTok } from '../../app/api/poslovni-tok/route';
import { GET as getKpiDashboard } from '../../app/api/kpi-dashboard/route';
import { GET as getSlaMonitor } from '../../app/api/sla-monitor/route';
import { GET as getAutofinishPoslovniTok } from '../../app/api/autofinish-poslovni-tok/route';

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
    console.error(`  ❌ ${name}\n     ${msg}`);
    failed++;
    failures.push(`${name}: ${msg}`);
  }
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`Assert failed: ${message}`);
}

async function runTests(): Promise<void> {
  console.log('\n📋 Poslovni Tok — Plan 100% Uspešnog Poslovanja Test\n');

  // ── SLA Ciljevi ─────────────────────────────────────────────────────────
  await test('SLA_CILJEVI_SATI definiše sve statuse', () => {
    const statusi = ['lead', 'kontaktiran', 'ponuda', 'ugovor', 'uplata', 'isporuka', 'zatvoreno', 'otkazano'] as const;
    for (const s of statusi) {
      assert(SLA_CILJEVI_SATI[s] !== undefined, `SLA cilj nije definisan za: ${s}`);
    }
  });

  await test('SLA_CILJEVI_SATI: lead=4h, kontaktiran=48h, uplata=24h', () => {
    assert(SLA_CILJEVI_SATI['lead'] === 4, 'lead SLA mora biti 4h');
    assert(SLA_CILJEVI_SATI['kontaktiran'] === 48, 'kontaktiran SLA mora biti 48h');
    assert(SLA_CILJEVI_SATI['uplata'] === 24, 'uplata SLA mora biti 24h');
    assert(SLA_CILJEVI_SATI['zatvoreno'] === 0, 'zatvoreno SLA mora biti 0');
  });

  // ── Obavezni Dokumenti ──────────────────────────────────────────────────
  await test('OBAVEZNI_DOKUMENTI definiše gate za kritične faze', () => {
    assert(OBAVEZNI_DOKUMENTI['ugovor'].includes('ponuda-dokument'), 'ugovor gate zahteva ponuda-dokument');
    assert(OBAVEZNI_DOKUMENTI['ugovor'].includes('predracun'), 'ugovor gate zahteva predracun');
    assert(OBAVEZNI_DOKUMENTI['uplata'].includes('potpisani-ugovor'), 'uplata gate zahteva potpisani-ugovor');
    assert(OBAVEZNI_DOKUMENTI['uplata'].includes('faktura'), 'uplata gate zahteva fakturu');
    assert(OBAVEZNI_DOKUMENTI['zatvoreno'].includes('zapisnik-primopredaje'), 'zatvoreno zahteva zapisnik');
  });

  // ── Status Tranzicije ───────────────────────────────────────────────────
  await test('STATUS_TRANZICIJE definiše dozvoljene prelaze', () => {
    assert(STATUS_TRANZICIJE['lead'].includes('kontaktiran'), 'lead može ići u kontaktiran');
    assert(STATUS_TRANZICIJE['uplata'].includes('isporuka'), 'uplata može ići u isporuku');
    assert(STATUS_TRANZICIJE['zatvoreno'].length === 0, 'zatvoreno nema dozvoljenih prelaza');
    assert(STATUS_TRANZICIJE['isporuka'].includes('zatvoreno'), 'isporuka može ići u zatvoreno');
  });

  // ── kreirajSlaFaze ──────────────────────────────────────────────────────
  await test('kreirajSlaFaze vraća 7 faza', () => {
    const faze = kreirajSlaFaze({}, 'lead');
    assert(faze.length === 7, `Očekivano 7 faza, dobijeno ${faze.length}`);
  });

  await test('kreirajSlaFaze: faza bez timestampa ima ulaznAt=null i protekloSati=null', () => {
    const faze = kreirajSlaFaze({}, 'lead');
    const leadFaza = faze.find((f) => f.status === 'lead');
    assert(leadFaza !== undefined, 'lead faza mora postojati');
    assert(leadFaza.ulaznAt === null, 'ulaznAt mora biti null bez timestampa');
    assert(leadFaza.protekloSati === null, 'protekloSati mora biti null bez timestampa');
  });

  await test('kreirajSlaFaze: faza sa timestampom ima protekloSati > 0', () => {
    const pre = new Date(Date.now() - 5 * 3600_000).toISOString();
    const faze = kreirajSlaFaze({ lead: pre }, 'lead');
    const leadFaza = faze.find((f) => f.status === 'lead');
    assert(leadFaza !== undefined, 'lead faza mora postojati');
    assert(leadFaza.protekloSati !== null && leadFaza.protekloSati > 0, 'protekloSati mora biti > 0');
  });

  // ── proveraDocumentGate ─────────────────────────────────────────────────
  await test('proveraDocumentGate: ok ako su svi dokumenti verifikovani', () => {
    const dokumenti: PoslovniDokument[] = [
      { kljuc: 'ponuda-dokument', naziv: 'Ponuda', status: 'verifikovano', verifikovao: 'test', blockchainTxHash: null, updatedAt: new Date().toISOString() },
      { kljuc: 'predracun', naziv: 'Predračun', status: 'verifikovano', verifikovao: 'test', blockchainTxHash: null, updatedAt: new Date().toISOString() },
    ];
    const rezultat = proveraDocumentGate(dokumenti, 'ugovor');
    assert(rezultat.ok === true, 'gate mora biti ok');
    assert(rezultat.nedostaje.length === 0, 'ne sme biti nedostajućih dokumenata');
  });

  await test('proveraDocumentGate: ne ok ako dokument nije verifikovan', () => {
    const dokumenti: PoslovniDokument[] = [
      { kljuc: 'ponuda-dokument', naziv: 'Ponuda', status: 'primljeno', verifikovao: null, blockchainTxHash: null, updatedAt: new Date().toISOString() },
    ];
    const rezultat = proveraDocumentGate(dokumenti, 'ugovor');
    assert(rezultat.ok === false, 'gate mora biti ne ok');
    assert(rezultat.nedostaje.length > 0, 'mora biti nedostajućih dokumenata');
  });

  // ── mozeTransicija ──────────────────────────────────────────────────────
  await test('mozeTransicija: blokira nedozvoljeni prelaz', () => {
    const slucaj = demoSlucajevi[0];
    const rezultat = mozeTransicija(slucaj, 'zatvoreno');
    assert(rezultat.ok === false, 'treba biti blokiran nedozvoljeni prelaz');
    assert(rezultat.razlog !== undefined, 'mora biti razlog blokade');
  });

  // ── izracunajKpi ────────────────────────────────────────────────────────
  await test('izracunajKpi: prazna lista vraća sve 0', () => {
    const kpi = izracunajKpi([]);
    assert(kpi.ukupnoSlucajeva === 0, 'ukupno mora biti 0');
    assert(kpi.stopaZatvaranja === 0, 'stopa mora biti 0');
    assert(kpi.kpiOcena === 0, 'ocena mora biti 0');
  });

  await test('izracunajKpi: sa demo slucajevima vraća validne metrike', () => {
    const kpi = izracunajKpi(demoSlucajevi);
    assert(kpi.ukupnoSlucajeva === demoSlucajevi.length, 'ukupno mora biti tačno');
    assert(kpi.aktivnih >= 0, 'aktivnih mora biti >= 0');
    assert(kpi.stopaZatvaranja >= 0 && kpi.stopaZatvaranja <= 100, 'stopa mora biti 0-100');
    assert(kpi.kpiOcena >= 0 && kpi.kpiOcena <= 100, 'ocena mora biti 0-100');
  });

  // ── izracunajSlaIzvestaj ────────────────────────────────────────────────
  await test('izracunajSlaIzvestaj: vraća eskalacioni nivo 1-3', () => {
    const izvestaj = izracunajSlaIzvestaj(demoSlucajevi[0]);
    assert([1, 2, 3].includes(izvestaj.eskalacioniNivo), 'eskalacioni nivo mora biti 1, 2 ili 3');
    assert(izvestaj.slucajId === demoSlucajevi[0].id, 'slucajId mora biti tačan');
  });

  // ── getPoslovniTokMeta ──────────────────────────────────────────────────
  await test('getPoslovniTokMeta vraća meta objekt', () => {
    const meta = getPoslovniTokMeta();
    assert(meta.naziv !== '', 'naziv mora biti neprazan');
    assert(meta.canonicalLifecycle.length === 7, 'canonical lifecycle mora imati 7 faza');
    assert(meta.canonicalLifecycle[0] === 'lead', 'prva faza mora biti lead');
    assert(meta.canonicalLifecycle[6] === 'zatvoreno', 'poslednja faza mora biti zatvoreno');
  });

  // ── Delivery Checklist ──────────────────────────────────────────────────
  await test('kreirajDeliveryChecklist: kreira checklist sa 8 stavki', () => {
    const event = kreirajDeliveryChecklist('test-slucaj-001');
    assert(event.slucajId === 'test-slucaj-001', 'slucajId mora biti tačan');
    assert(event.checklist.length === DEFAULT_DELIVERY_CHECKLIST.length, `Očekivano ${DEFAULT_DELIVERY_CHECKLIST.length} stavki`);
    assert(event.signatura === null, 'signatura mora biti null na početku');
    assert(event.zatvorenoAt === null, 'zatvorenoAt mora biti null na početku');
  });

  await test('validirajArrivalEvent: nepopunjen event nije ok', () => {
    const event = kreirajDeliveryChecklist('test-slucaj-002');
    const rezultat = validirajArrivalEvent(event);
    assert(rezultat.ok === false, 'prazan event ne sme biti ok');
    assert(rezultat.nedostaju.length > 0, 'mora biti nedostajućih stavki');
  });

  await test('validirajArrivalEvent: kompletiran event sa signaturom je ok', () => {
    const event = kreirajDeliveryChecklist('test-slucaj-003');
    const now = new Date().toISOString();
    const kompletiran: ArrivalEvent = {
      ...event,
      lokacija: 'Beograd, Srbija',
      kontaktNaLicuMesta: 'Nikola Spajić',
      checklist: event.checklist.map((s) => ({ ...s, status: 'potvrdjeno' as const, potvrdilaOsoba: 'test@spaja.rs', updatedAt: now })),
      signatura: {
        tip: 'digitalni',
        potpisnik: 'Kupac',
        predstavnikKompanije: 'Nikola Spajić',
        lokacija: 'Beograd',
        timestamp: now,
        digitalniZapis: 'https://spaja.rs/sign/abc123',
        fallbackRazlog: null,
        odobrio: null,
      },
    };
    const rezultat = validirajArrivalEvent(kompletiran);
    assert(rezultat.ok === true, `Kompletiran event mora biti ok, nedostaju: ${rezultat.nedostaju.join(', ')}`);
  });

  await test('validirajArrivalEvent: fizički potpis bez razloga nije ok', () => {
    const event = kreirajDeliveryChecklist('test-slucaj-004');
    const now = new Date().toISOString();
    const sa_fizickim_potpisom: ArrivalEvent = {
      ...event,
      lokacija: 'Beograd',
      kontaktNaLicuMesta: 'Nikola Spajić',
      checklist: event.checklist.map((s) => ({ ...s, status: 'potvrdjeno' as const, potvrdilaOsoba: 'test', updatedAt: now })),
      signatura: {
        tip: 'fizicki_skenirano',
        potpisnik: 'Kupac',
        predstavnikKompanije: 'Nikola Spajić',
        lokacija: 'Beograd',
        timestamp: now,
        digitalniZapis: null,
        fallbackRazlog: null,   // nedostaje razlog
        odobrio: null,          // nedostaje odobrenje
      },
    };
    const rezultat = validirajArrivalEvent(sa_fizickim_potpisom);
    assert(rezultat.ok === false, 'fizički potpis bez razloga i odobrenja mora biti ne ok');
  });

  await test('finalizirajArrivalEvent: zatvara kompletiran event', () => {
    const event = kreirajDeliveryChecklist('test-slucaj-005');
    const now = new Date().toISOString();
    const kompletiran: ArrivalEvent = {
      ...event,
      lokacija: 'Beograd',
      kontaktNaLicuMesta: 'Nikola',
      checklist: event.checklist.map((s) => ({ ...s, status: 'potvrdjeno' as const, potvrdilaOsoba: 'test', updatedAt: now })),
      signatura: {
        tip: 'digitalni',
        potpisnik: 'Kupac',
        predstavnikKompanije: 'Nikola',
        lokacija: 'Beograd',
        timestamp: now,
        digitalniZapis: 'url',
        fallbackRazlog: null,
        odobrio: null,
      },
    };
    const finaliziran = finalizirajArrivalEvent(kompletiran);
    assert(finaliziran.zatvorenoAt !== null, 'zatvorenoAt mora biti setovan');
  });

  await test('getDeliveryChecklistMeta vraća meta objekt', () => {
    const meta = getDeliveryChecklistMeta();
    assert(meta.naziv !== '', 'naziv mora biti neprazan');
    assert(meta.obavezneStavke.length > 0, 'mora biti obaveznih stavki');
    assert(meta.signatureTipovi.includes('digitalni'), 'mora biti digitalni tip');
    assert(meta.signatureTipovi.includes('fizicki_skenirano'), 'mora biti fizicki_skenirano tip');
  });

  // ── API Endpointi ────────────────────────────────────────────────────────
  await test('GET /api/poslovni-tok vraća 200', async () => {
    const response = await getPoslovniTok();
    assert(response.status === 200, `status expected 200, got ${response.status}`);
  });

  await test('GET /api/poslovni-tok vraća meta i kpi', async () => {
    const response = await getPoslovniTok();
    const body = (await response.json()) as Record<string, unknown>;
    assert(body['status'] === 'aktivan', 'status mora biti aktivan');
    assert(body['meta'] !== undefined, 'meta mora biti prisutan');
    assert(body['kpi'] !== undefined, 'kpi mora biti prisutan');
    assert(body['slucajevi'] !== undefined, 'slucajevi moraju biti prisutni');
    assert(body['verzija'] === APP_VERSION, 'verzija mora biti tačna');
  });

  await test('GET /api/poslovni-tok vraća ličnu statistiku i evidenciju rikvestova', async () => {
    const response = await getPoslovniTok();
    const body = (await response.json()) as {
      licnaStatistika?: Record<string, unknown>;
      evidencijaRikvestova?: Array<Record<string, unknown>>;
    };

    assert(body.licnaStatistika !== undefined, 'licnaStatistika mora biti prisutna');
    assert(body.evidencijaRikvestova !== undefined, 'evidencijaRikvestova mora biti prisutna');
    assert(Array.isArray(body.evidencijaRikvestova), 'evidencijaRikvestova mora biti niz');
    assert(
      Number(body.licnaStatistika?.ukupnoRikvestova ?? 0) >= 4,
      'ukupnoRikvestova mora obuhvatiti OpenAI, Vercel, GitHub i Lamborghini',
    );
  });

  await test('GET /api/poslovni-tok evidencija sadrži OpenAI, Vercel, GitHub i Lamborghini', async () => {
    const response = await getPoslovniTok();
    const body = (await response.json()) as {
      evidencijaRikvestova?: Array<{ id?: string; naziv?: string }>;
    };
    const evidencija = body.evidencijaRikvestova ?? [];

    assert(evidencija.some((item) => item.id === 'openai'), 'mora sadržati OpenAI evidenciju');
    assert(evidencija.some((item) => item.id === 'vercel'), 'mora sadržati Vercel evidenciju');
    assert(evidencija.some((item) => item.id === 'github'), 'mora sadržati GitHub evidenciju');
    assert(
      evidencija.some((item) => (item.naziv ?? '').toLowerCase().includes('lamborghini')),
      'mora sadržati Lamborghini evidenciju',
    );
  });

  await test('GET /api/kpi-dashboard vraća 200', async () => {
    const response = await getKpiDashboard();
    assert(response.status === 200, `status expected 200, got ${response.status}`);
  });

  await test('GET /api/kpi-dashboard vraća KPI i target poređenje', async () => {
    const response = await getKpiDashboard();
    const body = (await response.json()) as Record<string, unknown>;
    assert(body['kpi'] !== undefined, 'kpi mora biti prisutan');
    assert(body['targetKpi'] !== undefined, 'targetKpi mora biti prisutan');
    assert(body['statusVs100'] !== undefined, 'statusVs100 mora biti prisutan');
    assert(body['kpiOcenaNivo'] !== undefined, 'kpiOcenaNivo mora biti prisutan');
  });

  await test('GET /api/sla-monitor vraća 200', async () => {
    const response = await getSlaMonitor();
    assert(response.status === 200, `status expected 200, got ${response.status}`);
  });

  await test('GET /api/sla-monitor vraća SLA izveštaj', async () => {
    const response = await getSlaMonitor();
    const body = (await response.json()) as Record<string, unknown>;
    assert(body['summary'] !== undefined, 'summary mora biti prisutan');
    assert(body['slaTargetiSati'] !== undefined, 'slaTargetiSati mora biti prisutan');
    assert(body['eskalacioniKanali'] !== undefined, 'eskalacioniKanali mora biti prisutan');
  });

  await test('GET /api/autofinish-poslovni-tok vraća 200', async () => {
    const response = await getAutofinishPoslovniTok();
    assert(response.status === 200, `status expected 200, got ${response.status}`);
  });

  await test('GET /api/autofinish-poslovni-tok vraća implementirane komponente', async () => {
    const response = await getAutofinishPoslovniTok();
    const body = (await response.json()) as Record<string, unknown>;
    assert(body['poslovniTokMonitor'] !== undefined, 'poslovniTokMonitor mora biti prisutan');
    assert(body['implementiraneKomponente'] !== undefined, 'implementiraneKomponente mora biti prisutan');
    assert(body['verzija'] === APP_VERSION, 'verzija mora biti tačna');
    assert(body['autofinish'] !== undefined, 'autofinish mora biti prisutan');
  });

  // ── Konstante ───────────────────────────────────────────────────────────
  await test('AUTOFINISH_COUNT je 1189', () => {
    assert(AUTOFINISH_COUNT === 1189, `AUTOFINISH_COUNT expected 1189, got ${AUTOFINISH_COUNT}`);
  });

  await test('TOTAL_API_ROUTES je 1042', () => {
    assert(TOTAL_API_ROUTES === 1042, `TOTAL_API_ROUTES expected 1042, got ${TOTAL_API_ROUTES}`);
  });

  await test('TOTAL_ROUTES je 1101', () => {
    assert(TOTAL_ROUTES === 1101, `TOTAL_ROUTES expected 1101, got ${TOTAL_ROUTES}`);
  });

  await test('TOTAL_DIAGNOSTIKA je 2352', () => {
    assert(TOTAL_DIAGNOSTIKA === 2352, `TOTAL_DIAGNOSTIKA expected 2352, got ${TOTAL_DIAGNOSTIKA}`);
  });

  // ── Finalni izveštaj ─────────────────────────────────────────────────────
  console.log(`\n📊 Rezultati: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) {
    console.error('\n❌ Padovi:');
    failures.forEach((f) => console.error(`   - ${f}`));
    process.exit(1);
  } else {
    console.log('\n✅ Svi testovi prošli!');
  }
}

runTests().catch((e) => {
  console.error('Fatalna greška u testovima:', e);
  process.exit(1);
});
