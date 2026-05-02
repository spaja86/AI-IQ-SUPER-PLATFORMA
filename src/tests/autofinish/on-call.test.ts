// Autofinish #1093 — Unit Testovi getAutofinishOnCall()
// Kompanija SPAJA — Digitalna Industrija

import { getAutofinishOnCall } from '../../lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }
function assertEqual<T>(a: T, e: T, l?: string): void { if (a !== e) throw new Error(`${l ?? 'assertEqual'}: expected ${JSON.stringify(e)}, got ${JSON.stringify(a)}`); }

async function runTests(): Promise<void> {
  console.log('\n📟 getAutofinishOnCall() — Unit Test Suite (#1093)\n');
  await test('Vraća objekat', () => { const r = getAutofinishOnCall(); assert(typeof r === 'object' && r !== null, 'objekat'); });
  await test('verzija === APP_VERSION', () => { assertEqual(getAutofinishOnCall().verzija, APP_VERSION, 'verzija'); });
  await test('autofinishBroj === AUTOFINISH_COUNT', () => { assertEqual(getAutofinishOnCall().autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj'); });
  await test('ukupnoTimova > 0', () => { assert(getAutofinishOnCall().ukupnoTimova > 0, 'ukupnoTimova > 0'); });
  await test('timovi je niz', () => { assert(Array.isArray(getAutofinishOnCall().timovi), 'timovi niz'); });
  await test('ukupnoTimova === timovi.length', () => { const r = getAutofinishOnCall(); assertEqual(r.ukupnoTimova, r.timovi.length, 'ukupnoTimova=length'); });
  await test('ukupnoClanova === suma svih clanovi', () => {
    const r = getAutofinishOnCall();
    const suma = r.timovi.reduce((s, t) => s + t.clanovi.length, 0);
    assertEqual(r.ukupnoClanova, suma, 'ukupnoClanova=suma');
  });
  await test('aktivnih + uRezervi + slobodnih === ukupnoClanova', () => {
    const r = getAutofinishOnCall();
    assertEqual(r.aktivnih + r.uRezervi + r.slobodnih, r.ukupnoClanova, 'suma=ukupno');
  });
  await test('ukupnoOtvorenihIncidenata === suma otvoreniIncidenti', () => {
    const r = getAutofinishOnCall();
    const suma = r.timovi.flatMap((t) => t.clanovi).reduce((s, c) => s + c.otvoreniIncidenti, 0);
    assertEqual(r.ukupnoOtvorenihIncidenata, suma, 'ukupnoOtvorenih=suma');
  });
  await test('Svaki tim: schema polja', () => {
    for (const t of getAutofinishOnCall().timovi) {
      assert(typeof t.id === 'string' && t.id.length > 0, `tim.id: ${t.id}`);
      assert(typeof t.naziv === 'string' && t.naziv.length > 0, `tim.naziv: ${t.naziv}`);
      assert(typeof t.opis === 'string' && t.opis.length > 0, `tim.opis: ${t.id}`);
      assert(typeof t.aktivniClan === 'string' && t.aktivniClan.length > 0, `tim.aktivniClan: ${t.id}`);
      assert(typeof t.rezervniClan === 'string' && t.rezervniClan.length > 0, `tim.rezervniClan: ${t.id}`);
      assert(t.rotacijaDani > 0, `tim.rotacijaDani: ${t.id}`);
      assert(t.eskalacijaNakon > 0, `tim.eskalacijaNakon: ${t.id}`);
      assert(Array.isArray(t.clanovi) && t.clanovi.length > 0, `tim.clanovi niz: ${t.id}`);
    }
  });
  await test('Svaki član: schema polja', () => {
    const NIVOI = ['L1', 'L2', 'L3'];
    const STATUSI = ['aktivan', 'rezerva', 'slobodan'];
    for (const t of getAutofinishOnCall().timovi) {
      for (const c of t.clanovi) {
        assert(typeof c.id === 'string' && c.id.length > 0, `clan.id: ${c.id}`);
        assert(typeof c.ime === 'string' && c.ime.length > 0, `clan.ime: ${c.id}`);
        assert(typeof c.tim === 'string' && c.tim.length > 0, `clan.tim: ${c.id}`);
        assert(NIVOI.includes(c.nivo), `clan.nivo enum: ${c.nivo}`);
        assert(STATUSI.includes(c.status), `clan.status enum: ${c.status}`);
        assert(typeof c.smjenaOd === 'string' && !isNaN(Date.parse(c.smjenaOd)), `clan.smjenaOd ISO: ${c.id}`);
        assert(typeof c.smjenaDo === 'string' && !isNaN(Date.parse(c.smjenaDo)), `clan.smjenaDo ISO: ${c.id}`);
        assert(Array.isArray(c.kontakti) && c.kontakti.length > 0, `clan.kontakti niz: ${c.id}`);
        assert(typeof c.otvoreniIncidenti === 'number' && c.otvoreniIncidenti >= 0, `clan.otvoreniIncidenti: ${c.id}`);
        assert(typeof c.ukupnoSmjena === 'number' && c.ukupnoSmjena >= 0, `clan.ukupnoSmjena: ${c.id}`);
      }
    }
  });
  await test('Svaki kontakt: kanal enum + vrijednost neprazan', () => {
    const KANALI = ['slack', 'email', 'pager', 'telefon'];
    for (const t of getAutofinishOnCall().timovi) {
      for (const c of t.clanovi) {
        for (const k of c.kontakti) {
          assert(KANALI.includes(k.kanal), `kontakt.kanal: ${k.kanal}`);
          assert(typeof k.vrijednost === 'string' && k.vrijednost.length > 0, `kontakt.vrijednost: ${c.id}`);
        }
      }
    }
  });
  await test('Svaki tim: aktivniClan referencira postoji u clanovi', () => {
    for (const t of getAutofinishOnCall().timovi) {
      const ids = t.clanovi.map((c) => c.id);
      assert(ids.includes(t.aktivniClan), `aktivniClan postoji: ${t.id} → ${t.aktivniClan}`);
    }
  });
  await test('Svaki tim: rezervniClan referencira postoji u clanovi', () => {
    for (const t of getAutofinishOnCall().timovi) {
      const ids = t.clanovi.map((c) => c.id);
      assert(ids.includes(t.rezervniClan), `rezervniClan postoji: ${t.id} → ${t.rezervniClan}`);
    }
  });
  await test('timestamp je validan ISO', () => { assert(!isNaN(Date.parse(getAutofinishOnCall().timestamp)), 'ISO'); });
  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) { console.error('\n❌ Neuspješni testovi:'); failures.forEach((f) => console.error(`  • ${f}`)); process.exit(1); }
}
runTests().catch((e) => { console.error('Greška:', e); process.exit(1); });
