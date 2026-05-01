// Autofinish #1088 — Unit Testovi getAutofinishRunbook()
// Kompanija SPAJA — Digitalna Industrija

import { getAutofinishRunbook } from '../../lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }
function assertEqual<T>(a: T, e: T, l?: string): void { if (a !== e) throw new Error(`${l ?? 'assertEqual'}: expected ${JSON.stringify(e)}, got ${JSON.stringify(a)}`); }

async function runTests(): Promise<void> {
  console.log('\n📋 getAutofinishRunbook() — Unit Test Suite (#1088)\n');
  await test('Vraća objekat', () => { const r = getAutofinishRunbook(); assert(typeof r === 'object' && r !== null, 'objekat'); });
  await test('verzija === APP_VERSION', () => { assertEqual(getAutofinishRunbook().verzija, APP_VERSION, 'verzija'); });
  await test('autofinishBroj === AUTOFINISH_COUNT', () => { assertEqual(getAutofinishRunbook().autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj'); });
  await test('ukupnoRunbooka > 0', () => { assert(getAutofinishRunbook().ukupnoRunbooka > 0, 'ukupno > 0'); });
  await test('runbooki je niz', () => { assert(Array.isArray(getAutofinishRunbook().runbooki), 'niz'); });
  await test('ukupnoRunbooka === runbooki.length', () => { const r = getAutofinishRunbook(); assertEqual(r.ukupnoRunbooka, r.runbooki.length, 'ukupno=length'); });
  await test('Svaki runbook: schema polja', () => {
    const PRIORITETI = ['P1', 'P2', 'P3', 'P4'];
    const STATUSI = ['aktivan', 'u-reviziji', 'zastarjeo', 'arhiviran'];
    for (const rb of getAutofinishRunbook().runbooki) {
      assert(typeof rb.id === 'string' && rb.id.length > 0, `id: ${rb.id}`);
      assert(typeof rb.naziv === 'string' && rb.naziv.length > 0, `naziv: ${rb.naziv}`);
      assert(typeof rb.servis === 'string' && rb.servis.length > 0, `servis: ${rb.servis}`);
      assert(PRIORITETI.includes(rb.prioritet), `prioritet: ${rb.prioritet}`);
      assert(STATUSI.includes(rb.status), `status: ${rb.status}`);
      assert(typeof rb.vlasnik === 'string' && rb.vlasnik.length > 0, `vlasnik: ${rb.vlasnik}`);
      assert(typeof rb.okidac === 'string' && rb.okidac.length > 0, `okidac: ${rb.okidac}`);
      assert(Array.isArray(rb.koraci) && rb.koraci.length > 0, `koraci niz: ${rb.id}`);
      assert(rb.prosjecnoVrijemeMin > 0, `prosjecnoVrijemeMin: ${rb.prosjecnoVrijemeMin}`);
      assert(typeof rb.zadnjaRevizija === 'string' && rb.zadnjaRevizija.length > 0, `zadnjaRevizija: ${rb.id}`);
      assert(Array.isArray(rb.tagovi) && rb.tagovi.length > 0, `tagovi niz: ${rb.id}`);
    }
  });
  await test('Svaki korak: redni i opis', () => {
    for (const rb of getAutofinishRunbook().runbooki) {
      for (const k of rb.koraci) {
        assert(typeof k.redni === 'number' && k.redni >= 1, `korak.redni: ${k.redni}`);
        assert(typeof k.opis === 'string' && k.opis.length > 0, `korak.opis: ${k.opis}`);
      }
    }
  });
  await test('aktivnih + uReviziji + zastarjelih + arhiviranih === ukupnoRunbooka', () => {
    const r = getAutofinishRunbook();
    assertEqual(r.aktivnih + r.uReviziji + r.zastarjelih + r.arhiviranih, r.ukupnoRunbooka, 'suma=ukupno');
  });
  await test('pokriveniServisi je niz sa bar jednim elementom', () => { const r = getAutofinishRunbook(); assert(Array.isArray(r.pokriveniServisi) && r.pokriveniServisi.length > 0, 'pokriveniServisi'); });
  await test('timestamp je validan ISO', () => { assert(!isNaN(Date.parse(getAutofinishRunbook().timestamp)), 'ISO'); });
  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) { console.error('\n❌ Neuspješni testovi:'); failures.forEach((f) => console.error(`  • ${f}`)); process.exit(1); }
}
runTests().catch((e) => { console.error('Greška:', e); process.exit(1); });
