// Autofinish #828 — Unit Testovi za pokreniAutofinishPetlju()
// Kompanija SPAJA — Digitalna Industrija
//
// Testovi pokrivaju:
//   1. Normalno završavanje (status 'zavrsena')
//   2. Maksimalne iteracije dostigle (status 'ponavljanje')
//   3. Parcijalni kvar podsistema
//   4. getAutofinishPetljaStatus() i getAutofinishPetljaSummary()
//   5. getIterationHistory() in-memory store (#815)
//
// Pokretanje: npx tsx src/tests/autofinish/autofinish-petlja.test.ts

import {
  pokreniAutofinishPetlju,
  getAutofinishPetljaStatus,
  getAutofinishPetljaSummary,
  getIterationHistory,
  clearIterationHistory,
} from '../../lib/autofinish-petlja';
import { AUTOFINISH_COUNT, APP_VERSION } from '../../lib/constants';

// ─── Minimal test runner ──────────────────────────────────────────────────────

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

// ─── Test Suite ───────────────────────────────────────────────────────────────

async function runTests(): Promise<void> {
  console.log('\n⚡ Autofinish Petlja — Unit Test Suite\n');

  // ── 1. Normalno završavanje ────────────────────────────────────────────────
  console.log('📦 pokreniAutofinishPetlju() — Normalno završavanje');

  await test('Vraća AutofinishPetljaIzvestaj objekat', () => {
    const izvestaj = pokreniAutofinishPetlju();
    assert(typeof izvestaj === 'object' && izvestaj !== null, 'izvestaj mora biti objekat');
  });

  await test('status je \'zavrsena\' kada su svi podsistemi na 100%', () => {
    const izvestaj = pokreniAutofinishPetlju();
    assertEqual(izvestaj.status, 'zavrsena', 'status');
  });

  await test('ukupniProgres je 100', () => {
    const izvestaj = pokreniAutofinishPetlju();
    assertEqual(izvestaj.ukupniProgres, 100, 'ukupniProgres');
  });

  await test('podsistemiNa100 jednako ukupnoPodsistema', () => {
    const izvestaj = pokreniAutofinishPetlju();
    assertEqual(izvestaj.podsistemiNa100, izvestaj.ukupnoPodsistema, 'podsistemiNa100 vs ukupnoPodsistema');
  });

  await test('ima tačno 9 podsistema', () => {
    const izvestaj = pokreniAutofinishPetlju();
    assertEqual(izvestaj.podsistemi.length, 9, 'broj podsistema');
  });

  await test('svi podsistemi imaju progres=100 i status=ok', () => {
    const izvestaj = pokreniAutofinishPetlju();
    for (const p of izvestaj.podsistemi) {
      assert(p.progres === 100, `${p.id} progres mora biti 100`);
      assert(p.status === 'ok', `${p.id} status mora biti ok`);
    }
  });

  await test('verzija odgovara APP_VERSION konstanti', () => {
    const izvestaj = pokreniAutofinishPetlju();
    assertEqual(izvestaj.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinish.iteracija odgovara AUTOFINISH_COUNT', () => {
    const izvestaj = pokreniAutofinishPetlju();
    assertEqual(izvestaj.autofinish.iteracija, AUTOFINISH_COUNT, 'autofinish.iteracija');
  });

  await test('zdravljePrag je uključen u izveštaj', () => {
    const izvestaj = pokreniAutofinishPetlju();
    assert(typeof izvestaj.zdravljePrag === 'number', 'zdravljePrag mora biti broj');
  });

  await test('ekosistem sadrži sva očekivana polja', () => {
    const izvestaj = pokreniAutofinishPetlju();
    const eko = izvestaj.ekosistem;
    assert(typeof eko.rute === 'number', 'ekosistem.rute');
    assert(typeof eko.apiRute === 'number', 'ekosistem.apiRute');
    assert(typeof eko.stranice === 'number', 'ekosistem.stranice');
    assert(typeof eko.dijagnostike === 'number', 'ekosistem.dijagnostike');
    assert(typeof eko.igrice === 'number', 'ekosistem.igrice');
  });

  // ── 2. Maksimalne iteracije (ponavljanje) ──────────────────────────────────
  console.log('\n📦 pokreniAutofinishPetlju() — Maksimalne iteracije');

  await test('status je \'ponavljanje\' kad maksIteracija=0', () => {
    const izvestaj = pokreniAutofinishPetlju(0);
    assertEqual(izvestaj.status, 'ponavljanje', 'status pri maksIteracija=0');
  });

  await test('iteracijaPetlje ne prelazi maksIteracija', () => {
    const max = 3;
    const izvestaj = pokreniAutofinishPetlju(max);
    assert(izvestaj.iteracijaPetlje <= max, `iteracijaPetlje (${izvestaj.iteracijaPetlje}) ne sme biti > ${max}`);
  });

  await test('visok zdravljePrag forsira status ponavljanje', () => {
    // zdravljePrag=101 ne može biti dostignut, pa ce biti 'ponavljanje' kad maksIteracija=1
    const izvestaj = pokreniAutofinishPetlju(1, 101);
    assertEqual(izvestaj.status, 'ponavljanje', 'status pri neostvarivom zdravljePragu');
  });

  // ── 3. Parcijalni kvar ─────────────────────────────────────────────────────
  console.log('\n📦 pokreniAutofinishPetlju() — Struktura podsistema');

  await test('svaki podsistem ima sva obavezna polja', () => {
    const izvestaj = pokreniAutofinishPetlju();
    for (const p of izvestaj.podsistemi) {
      assert(typeof p.id === 'string' && p.id.length > 0, `${p.id} mora imati id`);
      assert(typeof p.naziv === 'string' && p.naziv.length > 0, `${p.id} mora imati naziv`);
      assert(typeof p.ikona === 'string', `${p.id} mora imati ikona`);
      assert(typeof p.progres === 'number', `${p.id} mora imati progres`);
      assert(p.status === 'ok' || p.status === 'u_toku' || p.status === 'greska', `${p.id} status nije validan`);
      assert(typeof p.poruka === 'string', `${p.id} mora imati poruka`);
    }
  });

  await test('iteracije niz nije prazan posle jedne iteracije', () => {
    const izvestaj = pokreniAutofinishPetlju(1);
    assert(izvestaj.iteracije.length > 0, 'iteracije mora imati bar jedan zapis');
  });

  await test('svaka iteracija ima obavezna polja', () => {
    const izvestaj = pokreniAutofinishPetlju(2);
    for (const it of izvestaj.iteracije) {
      assert(typeof it.redosled === 'number', 'iteracija.redosled');
      assert(typeof it.podsistemiProvereni === 'number', 'iteracija.podsistemiProvereni');
      assert(typeof it.podsistemiUspesni === 'number', 'iteracija.podsistemiUspesni');
      assert(typeof it.ukupniProgres === 'number', 'iteracija.ukupniProgres');
      assert(typeof it.timestamp === 'string' && it.timestamp.includes('T'), 'iteracija.timestamp ISO format');
    }
  });

  // ── 4. getAutofinishPetljaStatus() ────────────────────────────────────────
  console.log('\n📦 getAutofinishPetljaStatus()');

  await test('vraća status string', () => {
    const s = getAutofinishPetljaStatus();
    assert(typeof s.status === 'string', 'status mora biti string');
  });

  await test('autofinishIteracija odgovara AUTOFINISH_COUNT', () => {
    const s = getAutofinishPetljaStatus();
    assertEqual(s.autofinishIteracija, AUTOFINISH_COUNT, 'autofinishIteracija');
  });

  await test('progres je u formatu \'N%\'', () => {
    const s = getAutofinishPetljaStatus();
    assert(s.progres.endsWith('%'), 'progres mora završavati sa %');
  });

  await test('podsistemiNa100 je u formatu \'N/N\'', () => {
    const s = getAutofinishPetljaStatus();
    assert(s.podsistemiNa100.includes('/'), 'podsistemiNa100 mora sadržati /');
  });

  await test('podsistemi niz nije prazan', () => {
    const s = getAutofinishPetljaStatus();
    assert(s.podsistemi.length > 0, 'podsistemi mora imati bar jedan element');
  });

  // ── 5. getAutofinishPetljaSummary() ───────────────────────────────────────
  console.log('\n📦 getAutofinishPetljaSummary()');

  await test('vraća status string', () => {
    const s = getAutofinishPetljaSummary();
    assert(typeof s.status === 'string', 'status mora biti string');
  });

  await test('autofinish odgovara AUTOFINISH_COUNT', () => {
    const s = getAutofinishPetljaSummary();
    assertEqual(s.autofinish, AUTOFINISH_COUNT, 'autofinish');
  });

  await test('progres je u formatu \'N%\'', () => {
    const s = getAutofinishPetljaSummary();
    assert(s.progres.endsWith('%'), 'progres mora završavati sa %');
  });

  // ── 6. getIterationHistory() in-memory store (#815) ───────────────────────
  console.log('\n📦 getIterationHistory() — In-memory store (#815)');

  await test('vraća niz', () => {
    const history = getIterationHistory();
    assert(Array.isArray(history), 'getIterationHistory mora vratiti niz');
  });

  await test('ne menja interni niz pri modifikaciji kopije', () => {
    clearIterationHistory();
    pokreniAutofinishPetlju(1);
    const h1 = getIterationHistory();
    h1.push({ redosled: 999, podsistemiProvereni: 0, podsistemiUspesni: 0, ukupniProgres: 0, timestamp: '' });
    const h2 = getIterationHistory();
    assert(h2.length !== h1.length, 'modifikacija kopije ne sme uticati na interni store');
  });

  await test('clearIterationHistory prazni store', () => {
    pokreniAutofinishPetlju(1);
    clearIterationHistory();
    const history = getIterationHistory();
    assertEqual(history.length, 0, 'posle clearIterationHistory history.length mora biti 0');
  });
}

// ─── Pokretanje testova ────────────────────────────────────────────────────────

runTests().then(() => {
  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo\n`);
  if (failures.length > 0) {
    console.error('Neuspeli testovi:');
    failures.forEach((f) => console.error(`  - ${f}`));
  }
  if (failed > 0) process.exit(1);
}).catch((e) => {
  console.error('Kritična greška u test suiteu:', e);
  process.exit(1);
});
