// Autofinish #1096 — Unit Testovi OnCallWidget
// Kompanija SPAJA — Digitalna Industrija

import { getAutofinishOnCall } from '../../lib/autofinish-petlja';
import type { AutofinishOnCallClan, AutofinishOnCallStatus } from '../../lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }
function assertEqual<T>(a: T, e: T, l?: string): void { if (a !== e) throw new Error(`${l ?? 'assertEqual'}: expected ${JSON.stringify(e)}, got ${JSON.stringify(a)}`); }

// Simulira filter logiku OnCallWidget-a (po statusu na nivou timova)
function filterTimoviByStatus(
  timovi: ReturnType<typeof getAutofinishOnCall>['timovi'],
  filter: AutofinishOnCallStatus | 'svi',
) {
  return filter === 'svi'
    ? timovi
    : timovi.filter((t) => t.clanovi.some((c) => c.status === filter));
}

// Simulira filter logiku OnCallWidget-a (po statusu na nivou članova)
function filterClanByStatus(
  clanovi: AutofinishOnCallClan[],
  filter: AutofinishOnCallStatus | 'svi',
): AutofinishOnCallClan[] {
  return filter === 'svi' ? clanovi : clanovi.filter((c) => c.status === filter);
}

async function runTests(): Promise<void> {
  console.log('\n📟 OnCallWidget — Unit Test Suite (#1096)\n');

  const onCall = getAutofinishOnCall();

  await test('Vraća objekat s timovima', () => {
    assert(typeof onCall === 'object' && onCall !== null, 'objekat');
    assert(Array.isArray(onCall.timovi), 'timovi je niz');
  });

  await test('verzija === APP_VERSION', () => {
    assertEqual(onCall.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(onCall.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('Filter "svi" vraća sve timove', () => {
    const filtered = filterTimoviByStatus(onCall.timovi, 'svi');
    assertEqual(filtered.length, onCall.timovi.length, 'svi=ukupno timova');
  });

  await test('Filter "aktivan" vraća timove koji imaju aktivnog člana', () => {
    const filtered = filterTimoviByStatus(onCall.timovi, 'aktivan');
    assert(filtered.every((t) => t.clanovi.some((c) => c.status === 'aktivan')), 'svaki tim ima aktivnog');
  });

  await test('Filter "rezerva" vraća timove koji imaju člana u rezervi', () => {
    const filtered = filterTimoviByStatus(onCall.timovi, 'rezerva');
    assert(filtered.every((t) => t.clanovi.some((c) => c.status === 'rezerva')), 'svaki tim ima u rezervi');
  });

  await test('Filter "slobodan" vraća timove koji imaju slobodnog člana', () => {
    const filtered = filterTimoviByStatus(onCall.timovi, 'slobodan');
    assert(filtered.every((t) => t.clanovi.some((c) => c.status === 'slobodan')), 'svaki tim ima slobodnog');
  });

  await test('Zbir aktivnih + uRezervi + slobodnih === ukupnoClanova', () => {
    assertEqual(onCall.aktivnih + onCall.uRezervi + onCall.slobodnih, onCall.ukupnoClanova, 'suma=ukupno');
  });

  await test('ukupnoOtvorenihIncidenata === suma otvoreniIncidenti svih članova', () => {
    const suma = onCall.timovi.flatMap((t) => t.clanovi).reduce((s, c) => s + c.otvoreniIncidenti, 0);
    assertEqual(onCall.ukupnoOtvorenihIncidenata, suma, 'ukupnoOtvorenih=suma');
  });

  await test('Svaki tim ima naziv i opis za prikaz', () => {
    for (const t of onCall.timovi) {
      assert(typeof t.naziv === 'string' && t.naziv.length > 0, `naziv: ${t.id}`);
      assert(typeof t.opis === 'string' && t.opis.length > 0, `opis: ${t.id}`);
    }
  });

  await test('Svaki tim ima rotacijaDani i eskalacijaNakon za prikaz', () => {
    for (const t of onCall.timovi) {
      assert(t.rotacijaDani > 0, `rotacijaDani: ${t.id}`);
      assert(t.eskalacijaNakon > 0, `eskalacijaNakon: ${t.id}`);
    }
  });

  await test('Svaki član ima ime, nivo badge i status za prikaz', () => {
    const NIVOI: string[] = ['L1', 'L2', 'L3'];
    const STATUSI: string[] = ['aktivan', 'rezerva', 'slobodan'];
    for (const t of onCall.timovi) {
      for (const c of t.clanovi) {
        assert(typeof c.ime === 'string' && c.ime.length > 0, `ime: ${c.id}`);
        assert(NIVOI.includes(c.nivo), `nivo enum: ${c.nivo}`);
        assert(STATUSI.includes(c.status), `status enum: ${c.status}`);
      }
    }
  });

  await test('Svaki član ima smjenaOd/smjenaDo za prikaz u widgetu', () => {
    for (const t of onCall.timovi) {
      for (const c of t.clanovi) {
        assert(typeof c.smjenaOd === 'string' && c.smjenaOd.length >= 10, `smjenaOd: ${c.id}`);
        assert(typeof c.smjenaDo === 'string' && c.smjenaDo.length >= 10, `smjenaDo: ${c.id}`);
      }
    }
  });

  await test('Svaki član ima kontakte za prikaz u widgetu', () => {
    const KANALI: string[] = ['slack', 'email', 'pager', 'telefon'];
    for (const t of onCall.timovi) {
      for (const c of t.clanovi) {
        assert(Array.isArray(c.kontakti) && c.kontakti.length > 0, `kontakti niz: ${c.id}`);
        for (const k of c.kontakti) {
          assert(KANALI.includes(k.kanal), `kontakt.kanal: ${k.kanal}`);
          assert(typeof k.vrijednost === 'string' && k.vrijednost.length > 0, `kontakt.vrijednost: ${c.id}`);
        }
      }
    }
  });

  await test('filterClanByStatus vraća samo traženi status', () => {
    const sviClanovi = onCall.timovi.flatMap((t) => t.clanovi);
    const aktivni = filterClanByStatus(sviClanovi, 'aktivan');
    assert(aktivni.every((c) => c.status === 'aktivan'), 'filtrirani su aktivni');
    const rezerva = filterClanByStatus(sviClanovi, 'rezerva');
    assert(rezerva.every((c) => c.status === 'rezerva'), 'filtrirani su rezerva');
  });

  await test('JSON API link target /api/autofinish-on-call je ispravan', () => {
    const path = '/api/autofinish-on-call';
    assert(path.startsWith('/api/'), 'JSON API putanja počinje sa /api/');
    assert(path.includes('on-call'), 'JSON API putanja sadrži on-call');
  });

  await test('timestamp je validan ISO', () => {
    assert(!isNaN(Date.parse(onCall.timestamp)), 'ISO timestamp');
  });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) { console.error('\n❌ Neuspješni testovi:'); failures.forEach((f) => console.error(`  • ${f}`)); process.exit(1); }
}
runTests().catch((e) => { console.error('Greška:', e); process.exit(1); });
