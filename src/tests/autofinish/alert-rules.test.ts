// Autofinish #1098 — Unit Testovi getAutofinishAlertRules()
// Kompanija SPAJA — Digitalna Industrija

import { getAutofinishAlertRules } from '../../lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }
function assertEqual<T>(a: T, e: T, l?: string): void { if (a !== e) throw new Error(`${l ?? 'assertEqual'}: expected ${JSON.stringify(e)}, got ${JSON.stringify(a)}`); }

async function runTests(): Promise<void> {
  console.log('\n🚨 getAutofinishAlertRules() — Unit Test Suite (#1098)\n');
  await test('Vraća objekat', () => { const r = getAutofinishAlertRules(); assert(typeof r === 'object' && r !== null, 'objekat'); });
  await test('verzija === APP_VERSION', () => { assertEqual(getAutofinishAlertRules().verzija, APP_VERSION, 'verzija'); });
  await test('autofinishBroj === AUTOFINISH_COUNT', () => { assertEqual(getAutofinishAlertRules().autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj'); });
  await test('ukupnoPravila > 0', () => { assert(getAutofinishAlertRules().ukupnoPravila > 0, 'ukupnoPravila > 0'); });
  await test('pravila je niz', () => { assert(Array.isArray(getAutofinishAlertRules().pravila), 'pravila niz'); });
  await test('ukupnoPravila === pravila.length', () => {
    const r = getAutofinishAlertRules();
    assertEqual(r.ukupnoPravila, r.pravila.length, 'ukupnoPravila=length');
  });
  await test('aktivnih + utišanih + privremeno_onemogućenih === ukupnoPravila', () => {
    const r = getAutofinishAlertRules();
    assertEqual(r.aktivnih + r.utišanih + r.privremeno_onemogućenih, r.ukupnoPravila, 'suma statusa=ukupno');
  });
  await test('kriticnih === broj pravila sa severity kritičan', () => {
    const r = getAutofinishAlertRules();
    const expected = r.pravila.filter((p) => p.severity === 'kritičan').length;
    assertEqual(r.kriticnih, expected, 'kriticnih=computed');
  });
  await test('poServisima suma === ukupnoPravila', () => {
    const r = getAutofinishAlertRules();
    const suma = Object.values(r.poServisima).reduce((s, n) => s + n, 0);
    assertEqual(suma, r.ukupnoPravila, 'poServisima suma=ukupno');
  });
  await test('Svako pravilo: schema polja', () => {
    const STATUSI = ['aktivan', 'utišan', 'privremeno_onemogućen'];
    const SEVERITY = ['kritičan', 'visok', 'srednji', 'nizak'];
    for (const p of getAutofinishAlertRules().pravila) {
      assert(typeof p.id === 'string' && p.id.length > 0, `pravilo.id: ${p.id}`);
      assert(typeof p.naziv === 'string' && p.naziv.length > 0, `pravilo.naziv: ${p.id}`);
      assert(typeof p.servis === 'string' && p.servis.length > 0, `pravilo.servis: ${p.id}`);
      assert(STATUSI.includes(p.status), `pravilo.status enum: ${p.status}`);
      assert(SEVERITY.includes(p.severity), `pravilo.severity enum: ${p.severity}`);
      assert(typeof p.aktiviranja7Dana === 'number' && p.aktiviranja7Dana >= 0, `pravilo.aktiviranja7Dana: ${p.id}`);
      assert(typeof p.kreiran === 'string' && !isNaN(Date.parse(p.kreiran)), `pravilo.kreiran ISO: ${p.id}`);
    }
  });
  await test('Svako pravilo: prag schema', () => {
    const TIPOVI = ['latencija', 'error_rate', 'cpu', 'memorija', 'dostupnost', 'throughput'];
    const OPERATORI = ['>', '<', '>=', '<='];
    for (const p of getAutofinishAlertRules().pravila) {
      const g = p.prag;
      assert(TIPOVI.includes(g.tip), `prag.tip enum: ${g.tip} (${p.id})`);
      assert(OPERATORI.includes(g.operator), `prag.operator enum: ${g.operator} (${p.id})`);
      assert(typeof g.vrijednost === 'number', `prag.vrijednost: ${p.id}`);
      assert(typeof g.jedinica === 'string' && g.jedinica.length > 0, `prag.jedinica: ${p.id}`);
      assert(typeof g.trajanjeSekundi === 'number' && g.trajanjeSekundi > 0, `prag.trajanjeSekundi: ${p.id}`);
    }
  });
  await test('Svako pravilo: eskalacije je niz i nije prazan', () => {
    for (const p of getAutofinishAlertRules().pravila) {
      assert(Array.isArray(p.eskalacije) && p.eskalacije.length > 0, `eskalacije niz: ${p.id}`);
    }
  });
  await test('Svaka eskalacija: schema polja', () => {
    const NIVOI = ['L1', 'L2', 'L3'];
    const KANALI = ['slack', 'pager', 'email'];
    for (const p of getAutofinishAlertRules().pravila) {
      for (const e of p.eskalacije) {
        assert(typeof e.nakon === 'number' && e.nakon > 0, `eskalacija.nakon: ${p.id}`);
        assert(NIVOI.includes(e.nivo), `eskalacija.nivo enum: ${e.nivo} (${p.id})`);
        assert(KANALI.includes(e.kanal), `eskalacija.kanal enum: ${e.kanal} (${p.id})`);
        assert(typeof e.primatelj === 'string' && e.primatelj.length > 0, `eskalacija.primatelj: ${p.id}`);
      }
    }
  });
  await test('Utišano pravilo ima prozorTišine postavljen', () => {
    for (const p of getAutofinishAlertRules().pravila) {
      if (p.status === 'utišan') {
        assert(p.prozorTišineOd !== null, `prozorTišineOd nije null za utišano: ${p.id}`);
        assert(p.prozorTišineDo !== null, `prozorTišineDo nije null za utišano: ${p.id}`);
        assert(!isNaN(Date.parse(p.prozorTišineOd!)), `prozorTišineOd ISO: ${p.id}`);
        assert(!isNaN(Date.parse(p.prozorTišineDo!)), `prozorTišineDo ISO: ${p.id}`);
      }
    }
  });
  await test('poslednjeAktiviranje je null ili validan ISO', () => {
    for (const p of getAutofinishAlertRules().pravila) {
      if (p.poslednjeAktiviranje !== null) {
        assert(!isNaN(Date.parse(p.poslednjeAktiviranje)), `poslednjeAktiviranje ISO: ${p.id}`);
      }
    }
  });
  await test('poServisima ključevi odgovaraju pravila.servis vrijednostima', () => {
    const r = getAutofinishAlertRules();
    const servisi = new Set(r.pravila.map((p) => p.servis));
    for (const k of Object.keys(r.poServisima)) {
      assert(servisi.has(k), `poServisima ključ postoji u pravilima: ${k}`);
    }
  });
  await test('timestamp je validan ISO', () => { assert(!isNaN(Date.parse(getAutofinishAlertRules().timestamp)), 'ISO'); });
  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) { console.error('\n❌ Neuspješni testovi:'); failures.forEach((f) => console.error(`  • ${f}`)); process.exit(1); }
}
runTests().catch((e) => { console.error('Greška:', e); process.exit(1); });
