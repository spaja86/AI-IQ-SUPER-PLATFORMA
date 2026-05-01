// Autofinish #1112 — Unit testovi DoraMetricsWidget (getAutofinishDoraMetrics)
// Kompanija SPAJA — Digitalna Industrija

import { getAutofinishDoraMetrics } from '../../lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }
function assertEqual<T>(a: T, e: T, l?: string): void { if (a !== e) throw new Error(`${l ?? 'assertEqual'}: expected ${JSON.stringify(e)}, got ${JSON.stringify(a)}`); }

const VALID_RATINGS = ['elite', 'high', 'medium', 'low'] as const;
const VALID_TRENDS = ['raste', 'pada', 'stabilan'] as const;

async function runTests(): Promise<void> {
  console.log('\n📊 Unit testovi DoraMetricsWidget — Test Suite (#1112)\n');

  const dora = getAutofinishDoraMetrics();

  await test('verzija === APP_VERSION', () => {
    assertEqual(dora.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(dora.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('timestamp je validan ISO string', () => {
    assert(!isNaN(Date.parse(dora.timestamp)), `timestamp ISO: ${dora.timestamp}`);
  });

  await test('period nije prazan', () => {
    assert(typeof dora.period === 'string' && dora.period.length > 0, 'period prazan');
  });

  await test('ukupnoMetrika je pozitivan broj', () => {
    assert(typeof dora.ukupnoMetrika === 'number' && dora.ukupnoMetrika > 0, `ukupnoMetrika: ${dora.ukupnoMetrika}`);
  });

  await test('ukupnoMetrika === metrike.length', () => {
    assertEqual(dora.ukupnoMetrika, dora.metrike.length, 'ukupnoMetrika=metrike.length');
  });

  await test('eliteCount + highCount + mediumCount + lowCount === ukupnoMetrika', () => {
    const zbir = dora.eliteCount + dora.highCount + dora.mediumCount + dora.lowCount;
    assertEqual(zbir, dora.ukupnoMetrika, `zbir ratingova=${zbir} !== ${dora.ukupnoMetrika}`);
  });

  await test('eliteCount >= 0', () => {
    assert(dora.eliteCount >= 0, `eliteCount: ${dora.eliteCount}`);
  });

  await test('highCount >= 0', () => {
    assert(dora.highCount >= 0, `highCount: ${dora.highCount}`);
  });

  await test('mediumCount >= 0', () => {
    assert(dora.mediumCount >= 0, `mediumCount: ${dora.mediumCount}`);
  });

  await test('lowCount >= 0', () => {
    assert(dora.lowCount >= 0, `lowCount: ${dora.lowCount}`);
  });

  await test('metrike niz nije prazan', () => {
    assert(Array.isArray(dora.metrike) && dora.metrike.length > 0, 'metrike prazan niz');
  });

  await test('Svaka metrika ima id koji nije prazan', () => {
    for (const m of dora.metrike) {
      assert(typeof m.id === 'string' && m.id.length > 0, `id prazan za metriku: ${JSON.stringify(m)}`);
    }
  });

  await test('Svaka metrika ima naziv koji nije prazan', () => {
    for (const m of dora.metrike) {
      assert(typeof m.naziv === 'string' && m.naziv.length > 0, `naziv prazan za ${m.id}`);
    }
  });

  await test('Svaka metrika ima opis koji nije prazan', () => {
    for (const m of dora.metrike) {
      assert(typeof m.opis === 'string' && m.opis.length > 0, `opis prazan za ${m.id}`);
    }
  });

  await test('Svaka metrika ima jedinica koja nije prazna', () => {
    for (const m of dora.metrike) {
      assert(typeof m.jedinica === 'string' && m.jedinica.length > 0, `jedinica prazna za ${m.id}`);
    }
  });

  await test('Svaka metrika ima vrijednost >= 0', () => {
    for (const m of dora.metrike) {
      assert(typeof m.vrijednost === 'number' && m.vrijednost >= 0, `vrijednost < 0 za ${m.id}: ${m.vrijednost}`);
    }
  });

  await test('Svaka metrika ima validan rating', () => {
    for (const m of dora.metrike) {
      assert((VALID_RATINGS as readonly string[]).includes(m.rating), `nevalidan rating "${m.rating}" za ${m.id}`);
    }
  });

  await test('Svaka metrika ima validan trend', () => {
    for (const m of dora.metrike) {
      assert((VALID_TRENDS as readonly string[]).includes(m.trend), `nevalidan trend "${m.trend}" za ${m.id}`);
    }
  });

  await test('Svaka metrika ima eliteTarget koji nije prazan', () => {
    for (const m of dora.metrike) {
      assert(typeof m.eliteTarget === 'string' && m.eliteTarget.length > 0, `eliteTarget prazan za ${m.id}`);
    }
  });

  await test('Svaka metrika ima highTarget koji nije prazan', () => {
    for (const m of dora.metrike) {
      assert(typeof m.highTarget === 'string' && m.highTarget.length > 0, `highTarget prazan za ${m.id}`);
    }
  });

  await test('Svaka metrika ima mediumTarget koji nije prazan', () => {
    for (const m of dora.metrike) {
      assert(typeof m.mediumTarget === 'string' && m.mediumTarget.length > 0, `mediumTarget prazan za ${m.id}`);
    }
  });

  await test('Svaka metrika ima sparkline s bar >= 2 tačaka', () => {
    for (const m of dora.metrike) {
      assert(Array.isArray(m.sparkline) && m.sparkline.length >= 2, `sparkline < 2 tačaka za ${m.id}: ${m.sparkline.length}`);
    }
  });

  await test('Svaka sparkline tačka ima period i vrijednost >= 0', () => {
    for (const m of dora.metrike) {
      for (const sp of m.sparkline) {
        assert(typeof sp.period === 'string' && sp.period.length > 0, `sparkline period prazan za ${m.id}`);
        assert(typeof sp.vrijednost === 'number' && sp.vrijednost >= 0, `sparkline vrijednost < 0 za ${m.id}: ${sp.vrijednost}`);
      }
    }
  });

  await test('eliteCount konzistentan s metrike array', () => {
    const eliteActual = dora.metrike.filter((m) => m.rating === 'elite').length;
    assertEqual(eliteActual, dora.eliteCount, 'eliteCount konzistentnost');
  });

  await test('highCount konzistentan s metrike array', () => {
    const highActual = dora.metrike.filter((m) => m.rating === 'high').length;
    assertEqual(highActual, dora.highCount, 'highCount konzistentnost');
  });

  await test('mediumCount konzistentan s metrike array', () => {
    const mediumActual = dora.metrike.filter((m) => m.rating === 'medium').length;
    assertEqual(mediumActual, dora.mediumCount, 'mediumCount konzistentnost');
  });

  await test('lowCount konzistentan s metrike array', () => {
    const lowActual = dora.metrike.filter((m) => m.rating === 'low').length;
    assertEqual(lowActual, dora.lowCount, 'lowCount konzistentnost');
  });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) { console.error('\n❌ Neuspješni testovi:'); failures.forEach((f) => console.error(`  • ${f}`)); process.exit(1); }
}
runTests().catch((e) => { console.error('Greška:', e); process.exit(1); });
