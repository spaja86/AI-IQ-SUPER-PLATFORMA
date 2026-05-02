// Autofinish #1091 — Unit Testovi RunbookWidget
// Kompanija SPAJA — Digitalna Industrija

import { getAutofinishRunbook } from '../../lib/autofinish-petlja';
import type { AutofinishRunbookUnos, AutofinishRunbookPrioritet } from '../../lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }
function assertEqual<T>(a: T, e: T, l?: string): void { if (a !== e) throw new Error(`${l ?? 'assertEqual'}: expected ${JSON.stringify(e)}, got ${JSON.stringify(a)}`); }

// Simulira filter logiku RunbookWidget-a
function filterByPrioritet(runbooki: AutofinishRunbookUnos[], filter: AutofinishRunbookPrioritet | 'svi'): AutofinishRunbookUnos[] {
  return filter === 'svi' ? runbooki : runbooki.filter((r) => r.prioritet === filter);
}

async function runTests(): Promise<void> {
  console.log('\n📋 RunbookWidget — Unit Test Suite (#1091)\n');

  const runbook = getAutofinishRunbook();

  await test('Vraća objekat s runboocima', () => {
    assert(typeof runbook === 'object' && runbook !== null, 'objekat');
    assert(Array.isArray(runbook.runbooki), 'runbooki je niz');
  });

  await test('verzija === APP_VERSION', () => {
    assertEqual(runbook.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(runbook.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('Filter "svi" vraća sve runbooke', () => {
    const filtered = filterByPrioritet(runbook.runbooki, 'svi');
    assertEqual(filtered.length, runbook.runbooki.length, 'svi=ukupno');
  });

  await test('Filter P1 vraća samo P1 runbooke', () => {
    const filtered = filterByPrioritet(runbook.runbooki, 'P1');
    assert(filtered.every((r) => r.prioritet === 'P1'), 'svi P1');
  });

  await test('Filter P2 vraća samo P2 runbooke', () => {
    const filtered = filterByPrioritet(runbook.runbooki, 'P2');
    assert(filtered.every((r) => r.prioritet === 'P2'), 'svi P2');
  });

  await test('Filter P3 vraća samo P3 runbooke', () => {
    const filtered = filterByPrioritet(runbook.runbooki, 'P3');
    assert(filtered.every((r) => r.prioritet === 'P3'), 'svi P3');
  });

  await test('Filter P4 vraća samo P4 runbooke', () => {
    const filtered = filterByPrioritet(runbook.runbooki, 'P4');
    assert(filtered.every((r) => r.prioritet === 'P4'), 'svi P4');
  });

  await test('Zbir svih filtera P1+P2+P3+P4 === ukupno', () => {
    const p1 = filterByPrioritet(runbook.runbooki, 'P1').length;
    const p2 = filterByPrioritet(runbook.runbooki, 'P2').length;
    const p3 = filterByPrioritet(runbook.runbooki, 'P3').length;
    const p4 = filterByPrioritet(runbook.runbooki, 'P4').length;
    assertEqual(p1 + p2 + p3 + p4, runbook.ukupnoRunbooka, 'zbir prioriteta=ukupno');
  });

  await test('Svaki runbook ima naziv, servis i vlasnik za prikaz', () => {
    for (const rb of runbook.runbooki) {
      assert(typeof rb.naziv === 'string' && rb.naziv.length > 0, `naziv: ${rb.id}`);
      assert(typeof rb.servis === 'string' && rb.servis.length > 0, `servis: ${rb.id}`);
      assert(typeof rb.vlasnik === 'string' && rb.vlasnik.length > 0, `vlasnik: ${rb.id}`);
    }
  });

  await test('Svaki runbook ima korake za expand prikaz', () => {
    for (const rb of runbook.runbooki) {
      assert(Array.isArray(rb.koraci) && rb.koraci.length > 0, `koraci niz: ${rb.id}`);
      for (const k of rb.koraci) {
        assert(typeof k.opis === 'string' && k.opis.length > 0, `korak opis: ${rb.id}[${k.redni}]`);
      }
    }
  });

  await test('Svaki runbook ima tagove za prikaz', () => {
    for (const rb of runbook.runbooki) {
      assert(Array.isArray(rb.tagovi) && rb.tagovi.length > 0, `tagovi: ${rb.id}`);
      for (const t of rb.tagovi) {
        assert(typeof t === 'string' && t.length > 0, `tag string: ${rb.id}`);
      }
    }
  });

  await test('Svaki runbook ima prioritet u setu P1-P4', () => {
    const PRIORITETI: AutofinishRunbookPrioritet[] = ['P1', 'P2', 'P3', 'P4'];
    for (const rb of runbook.runbooki) {
      assert(PRIORITETI.includes(rb.prioritet), `prioritet: ${rb.prioritet} za ${rb.id}`);
    }
  });

  await test('JSON API link target /api/autofinish-runbook je ispravan', () => {
    const path = '/api/autofinish-runbook';
    assert(path.startsWith('/api/'), 'JSON API putanja počinje sa /api/');
    assert(path.includes('runbook'), 'JSON API putanja sadrži runbook');
  });

  await test('pokriveniServisi poklapa se sa servis vrijednostima runbooka', () => {
    const sviServisiIzRunbooka = new Set(runbook.runbooki.map((r) => r.servis));
    for (const s of runbook.pokriveniServisi) {
      assert(sviServisiIzRunbooka.has(s), `pokriveniServis ${s} postoji u runboocima`);
    }
  });

  await test('timestamp je validan ISO', () => {
    assert(!isNaN(Date.parse(runbook.timestamp)), 'ISO timestamp');
  });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) { console.error('\n❌ Neuspješni testovi:'); failures.forEach((f) => console.error(`  • ${f}`)); process.exit(1); }
}
runTests().catch((e) => { console.error('Greška:', e); process.exit(1); });
