// Autofinish #1116 — Unit testovi TehDugWidget (getAutofinishTehDug)
// Kompanija SPAJA — Digitalna Industrija

import { getAutofinishTehDug } from '../../lib/autofinish-petlja';
import type { AutofinishDugStavka } from '../../lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }
function assertEqual<T>(a: T, e: T, l?: string): void { if (a !== e) throw new Error(`${l ?? 'assertEqual'}: expected ${JSON.stringify(e)}, got ${JSON.stringify(a)}`); }

// ─── Simulacija TehDugWidget logike ───────────────────────────────────────────

const VALID_PRIORITETI = ['kriticno', 'visoko', 'srednje', 'nisko'] as const;
const VALID_KATEGORIJE = ['arhitektura', 'kod', 'testovi', 'dokumentacija', 'sigurnost', 'zavisnosti'] as const;
const VALID_TRENDOVI   = ['raste', 'pada', 'stabilan'] as const;

function computeTotals(stavke: AutofinishDugStavka[]) {
  const ukupnoSati        = stavke.reduce((sum, s) => sum + s.procijenjeniSati, 0);
  const ukupnoTjedniTrosak = stavke.reduce((sum, s) => sum + s.tjedniTrosak, 0);
  const kriticnoCount     = stavke.filter((s) => s.prioritet === 'kriticno').length;
  const visokoCount       = stavke.filter((s) => s.prioritet === 'visoko').length;
  const srednjeCount      = stavke.filter((s) => s.prioritet === 'srednje').length;
  const niskoCount        = stavke.filter((s) => s.prioritet === 'nisko').length;
  return { ukupnoSati, ukupnoTjedniTrosak, kriticnoCount, visokoCount, srednjeCount, niskoCount };
}

function filterByPrioritet(
  stavke: AutofinishDugStavka[],
  filter: typeof VALID_PRIORITETI[number] | 'svi',
) {
  return filter === 'svi' ? stavke : stavke.filter((s) => s.prioritet === filter);
}

function filterByTrend(
  stavke: AutofinishDugStavka[],
  trend: typeof VALID_TRENDOVI[number],
) {
  return stavke.filter((s) => s.trend === trend);
}

async function runTests(): Promise<void> {
  console.log('\n🏦 Unit testovi TehDugWidget — Test Suite (#1116)\n');

  const result = getAutofinishTehDug();
  const { stavke } = result;

  await test('verzija === APP_VERSION', () => {
    assertEqual(result.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(result.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('timestamp je validan ISO string', () => {
    assert(!isNaN(Date.parse(result.timestamp)), `timestamp ISO: ${result.timestamp}`);
  });

  await test('ukupnoStavki === stavke.length', () => {
    assertEqual(result.ukupnoStavki, stavke.length, 'ukupnoStavki=stavke.length');
  });

  await test('stavke niz nije prazan', () => {
    assert(Array.isArray(stavke) && stavke.length > 0, 'stavke prazan niz');
  });

  // ─── computeTotals logika ─────────────────────────────────────────────────

  const totals = computeTotals(stavke);

  await test('ukupnoSati konzistentan s result.ukupnoSati', () => {
    assertEqual(totals.ukupnoSati, result.ukupnoSati, 'ukupnoSati konzistentnost');
  });

  await test('kriticnoCount konzistentan s result.kriticnoCount', () => {
    assertEqual(totals.kriticnoCount, result.kriticnoCount, 'kriticnoCount konzistentnost');
  });

  await test('visokoCount konzistentan s result.visokoCount', () => {
    assertEqual(totals.visokoCount, result.visokoCount, 'visokoCount konzistentnost');
  });

  await test('srednjeCount konzistentan s result.srednjeCount', () => {
    assertEqual(totals.srednjeCount, result.srednjeCount, 'srednjeCount konzistentnost');
  });

  await test('niskoCount konzistentan s result.niskoCount', () => {
    assertEqual(totals.niskoCount, result.niskoCount, 'niskoCount konzistentnost');
  });

  await test('kriticnoCount + visokoCount + srednjeCount + niskoCount === ukupnoStavki', () => {
    const zbir = result.kriticnoCount + result.visokoCount + result.srednjeCount + result.niskoCount;
    assertEqual(zbir, result.ukupnoStavki, `zbir prioriteta=${zbir} !== ${result.ukupnoStavki}`);
  });

  await test('ukupnoSati > 0', () => {
    assert(result.ukupnoSati > 0, `ukupnoSati: ${result.ukupnoSati}`);
  });

  await test('ukupnoTjedniTrosak > 0', () => {
    assert(totals.ukupnoTjedniTrosak > 0, `ukupnoTjedniTrosak: ${totals.ukupnoTjedniTrosak}`);
  });

  // ─── filterByPrioritet logika ─────────────────────────────────────────────

  await test('filterByPrioritet(svi) vraća sve stavke', () => {
    const filtered = filterByPrioritet(stavke, 'svi');
    assertEqual(filtered.length, stavke.length, 'filterByPrioritet svi');
  });

  await test('filterByPrioritet(kriticno) vraća samo kriticno stavke', () => {
    const filtered = filterByPrioritet(stavke, 'kriticno');
    for (const s of filtered) {
      assertEqual(s.prioritet, 'kriticno', `filter kriticno: ${s.id} ima prioritet ${s.prioritet}`);
    }
  });

  await test('filterByPrioritet(kriticno).length === kriticnoCount', () => {
    const filtered = filterByPrioritet(stavke, 'kriticno');
    assertEqual(filtered.length, result.kriticnoCount, `filterByPrioritet kriticno: ${filtered.length} != ${result.kriticnoCount}`);
  });

  await test('filterByPrioritet(visoko).length === visokoCount', () => {
    const filtered = filterByPrioritet(stavke, 'visoko');
    assertEqual(filtered.length, result.visokoCount, `filterByPrioritet visoko: ${filtered.length} != ${result.visokoCount}`);
  });

  // ─── filterByTrend logika ─────────────────────────────────────────────────

  await test('filterByTrend(raste) vraća samo stavke s trendom raste', () => {
    const filtered = filterByTrend(stavke, 'raste');
    for (const s of filtered) {
      assertEqual(s.trend, 'raste', `filterByTrend raste: ${s.id} ima trend ${s.trend}`);
    }
  });

  await test('filterByTrend(pada) vraća samo stavke s trendom pada', () => {
    const filtered = filterByTrend(stavke, 'pada');
    for (const s of filtered) {
      assertEqual(s.trend, 'pada', `filterByTrend pada: ${s.id} ima trend ${s.trend}`);
    }
  });

  // ─── Validacija stavki ────────────────────────────────────────────────────

  await test('Svaka stavka ima id koji nije prazan', () => {
    for (const s of stavke) {
      assert(typeof s.id === 'string' && s.id.length > 0, `id prazan za stavku: ${JSON.stringify(s)}`);
    }
  });

  await test('Svaka stavka ima naziv koji nije prazan', () => {
    for (const s of stavke) {
      assert(typeof s.naziv === 'string' && s.naziv.length > 0, `naziv prazan za ${s.id}`);
    }
  });

  await test('Svaka stavka ima validan prioritet', () => {
    for (const s of stavke) {
      assert((VALID_PRIORITETI as readonly string[]).includes(s.prioritet), `nevalidan prioritet "${s.prioritet}" za ${s.id}`);
    }
  });

  await test('Svaka stavka ima validnu kategoriju', () => {
    for (const s of stavke) {
      assert((VALID_KATEGORIJE as readonly string[]).includes(s.kategorija), `nevalidna kategorija "${s.kategorija}" za ${s.id}`);
    }
  });

  await test('Svaka stavka ima validan trend', () => {
    for (const s of stavke) {
      assert((VALID_TRENDOVI as readonly string[]).includes(s.trend), `nevalidan trend "${s.trend}" za ${s.id}`);
    }
  });

  await test('Svaka stavka ima procijenjeniSati > 0', () => {
    for (const s of stavke) {
      assert(typeof s.procijenjeniSati === 'number' && s.procijenjeniSati > 0, `procijenjeniSati <= 0 za ${s.id}: ${s.procijenjeniSati}`);
    }
  });

  await test('Svaka stavka ima tjedniTrosak > 0', () => {
    for (const s of stavke) {
      assert(typeof s.tjedniTrosak === 'number' && s.tjedniTrosak > 0, `tjedniTrosak <= 0 za ${s.id}: ${s.tjedniTrosak}`);
    }
  });

  await test('Stavke imaju jedinstvene ID-ove', () => {
    const ids = stavke.map((s) => s.id);
    const uniqueIds = new Set(ids);
    assertEqual(uniqueIds.size, ids.length, `Duplirani ID-ovi`);
  });

  console.log(`\n🏦 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) { console.error('\n❌ Neuspješni testovi:'); failures.forEach((f) => console.error(`  • ${f}`)); process.exit(1); }
}
runTests().catch((e) => { console.error('Greška:', e); process.exit(1); });
