/**
 * omega-ai-dispatch.test.ts — Unit testi za OMEGA AI Dispatch modul
 *
 * Pokriva:
 *   - createDispatch() vraća DispatchIzvestaj sa ispravnom strukturom
 *   - 21 persona u 8 oktavnih nivoa
 *   - getDispatchSummary() vraća konzistentan sažetak
 *   - createMatricnoJezgro() vraća 8×8 matricu odaziva
 *   - createSinhronizaciju() vraća 8 oktava sa kompletnim statusom
 */

import {
  createDispatch,
  getDispatchSummary,
  createMatricnoJezgro,
  createSinhronizacija,
} from '../../lib/omega-ai-dispatch';

let passed = 0;
let failed = 0;
const failures: string[] = [];

async function test(name: string, fn: () => void | Promise<void>): Promise<void> {
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
    throw new Error(`${label ?? 'assertEqual'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

async function runTests(): Promise<void> {
  console.log('\n🤖 OMEGA AI Dispatch Test Suite\n');

  // ── createDispatch ──────────────────────────────────────

  const dispatch = createDispatch();

  await test('createDispatch vraća objekat', () => {
    assert(typeof dispatch === 'object' && dispatch !== null, 'dispatch mora biti objekat');
  });

  await test('dispatch ima 21 personu', () => {
    assertEqual(dispatch.ukupnoPersona, 21, 'ukupnoPersona');
  });

  await test('dispatch ima 8 oktavnih nivoa', () => {
    assertEqual(dispatch.ukupnoOktava, 8, 'ukupnoOktava');
  });

  await test('sekvence niz ima 8 elemenata', () => {
    assertEqual(dispatch.sekvence.length, 8, 'broj sekvenci');
  });

  await test('svaka sekvenca ima validan oktavni nivo (1-8)', () => {
    for (const seq of dispatch.sekvence) {
      assert(seq.oktavniNivo >= 1 && seq.oktavniNivo <= 8, `oktavniNivo ${seq.oktavniNivo} nije u opsegu [1,8]`);
    }
  });

  await test('svaka sekvenca ima naziv', () => {
    for (const seq of dispatch.sekvence) {
      assert(typeof seq.oktavniNaziv === 'string' && seq.oktavniNaziv.length > 0, `oktavniNaziv mora biti non-empty za nivo ${seq.oktavniNivo}`);
    }
  });

  await test('svaki zadatak u sekvencama ima obavezna polja', () => {
    for (const seq of dispatch.sekvence) {
      for (const zadatak of seq.zadaci) {
        assert(typeof zadatak.id === 'string' && zadatak.id.length > 0, `zadatak.id prazan, oktava ${seq.oktavniNivo}`);
        assert(typeof zadatak.personaNaziv === 'string', `zadatak.personaNaziv nedostaje, id=${zadatak.id}`);
        assert(['ceka', 'aktivan', 'zavrsen', 'preskocen', 'greska'].includes(zadatak.status), `nevalidan status: ${zadatak.status}`);
        assert(typeof zadatak.redosled === 'number', `zadatak.redosled mora biti broj, id=${zadatak.id}`);
      }
    }
  });

  await test('ukupan broj zadataka odgovara ukupnoPersona', () => {
    const ukupnoZadataka = dispatch.sekvence.reduce((sum, seq) => sum + seq.zadaci.length, 0);
    assertEqual(ukupnoZadataka, dispatch.ukupnoPersona, 'ukupno zadataka vs ukupnoPersona');
  });

  await test('timestamp je validan ISO 8601', () => {
    const iso = new Date(dispatch.timestamp);
    assert(!isNaN(iso.getTime()), `dispatch.timestamp nije validan datum: ${dispatch.timestamp}`);
  });

  // ── getDispatchSummary ────────────────────────────────────

  const summary = getDispatchSummary();

  await test('getDispatchSummary vraća sažetak', () => {
    assert(typeof summary === 'object' && summary !== null, 'summary mora biti objekat');
  });

  await test('summary.ukupnoPersona = 21', () => {
    assertEqual(summary.ukupnoPersona, 21, 'summary.ukupnoPersona');
  });

  await test('summary.ukupnoOktava = 8', () => {
    assertEqual(summary.ukupnoOktava, 8, 'summary.ukupnoOktava');
  });

  await test('summary.status je string', () => {
    assert(typeof summary.status === 'string' && summary.status.length > 0, 'summary.status mora biti non-empty string');
  });

  await test('summary.matricnoJezgro postoji sa statusom', () => {
    assert(typeof summary.matricnoJezgro === 'object', 'matricnoJezgro mora biti objekat');
    assert(typeof summary.matricnoJezgro.status === 'string', 'matricnoJezgro.status mora biti string');
  });

  await test('summary.neuroloskaMreza postoji sa statusom', () => {
    assert(typeof summary.neuroloskaMreza === 'object', 'neuroloskaMreza mora biti objekat');
    assert(typeof summary.neuroloskaMreza.status === 'string', 'neuroloskaMreza.status mora biti string');
  });

  // ── createMatricnoJezgro ──────────────────────────────────

  const matricno = createMatricnoJezgro();

  await test('createMatricnoJezgro vraća 8×8 dimenziju', () => {
    assertEqual(matricno.dimenzija, 8, 'matricno.dimenzija');
  });

  await test('matricno ima odazive (veze)', () => {
    assert(Array.isArray(matricno.odazivi), 'odazivi mora biti niz');
    assert(matricno.odazivi.length > 0, 'mora imati bar jedan odaziv');
    assertEqual(matricno.ukupnoVeza, matricno.odazivi.length, 'ukupnoVeza vs odazivi.length');
  });

  await test('svaki odaziv ima jacinu u [0, 1]', () => {
    for (const odaziv of matricno.odazivi) {
      assert(odaziv.jacina >= 0 && odaziv.jacina <= 1, `jacina ${odaziv.jacina} nije u [0,1]`);
    }
  });

  await test('svaki odaziv ima validan tip', () => {
    const validniTipovi = ['ekscitatorni', 'inhibitorni', 'modulatorni'];
    for (const odaziv of matricno.odazivi) {
      assert(validniTipovi.includes(odaziv.tip), `nevalidan tip odaziva: ${odaziv.tip}`);
    }
  });

  // ── createSinhronizaciju ──────────────────────────────────

  const sinhr = createSinhronizacija();

  await test('createSinhronizaciju vraća 8 oktava', () => {
    assertEqual(sinhr.oktave.length, 8, 'broj oktava u sinhronizaciji');
  });

  await test('sinhronizacija je u completnom stanju', () => {
    assertEqual(sinhr.status, 'kompletan', 'sinhr.status');
    assertEqual(sinhr.ukupniProgres, 100, 'ukupniProgres');
  });

  await test('svaka oktava ima elasticnoVreme > 0', () => {
    for (const okt of sinhr.oktave) {
      assert(okt.elasticnoVreme > 0, `elasticnoVreme mora biti > 0 za oktavu ${okt.oktavniNivo}`);
    }
  });

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) {
    console.error('Failures:\n' + failures.map((f) => `  - ${f}`).join('\n'));
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Unexpected error:', e);
  process.exit(1);
});
