// Autofinish #1103 — Unit testovi getAutofinishPostMortem()
// Kompanija SPAJA — Digitalna Industrija

import { getAutofinishPostMortem } from '../../lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }
function assertEqual<T>(a: T, e: T, l?: string): void { if (a !== e) throw new Error(`${l ?? 'assertEqual'}: expected ${JSON.stringify(e)}, got ${JSON.stringify(a)}`); }

async function runTests(): Promise<void> {
  console.log('\n📋 getAutofinishPostMortem() — Unit Test Suite (#1103)\n');

  await test('Vraća objekat', () => {
    const r = getAutofinishPostMortem();
    assert(typeof r === 'object' && r !== null, 'objekat');
  });
  await test('verzija === APP_VERSION', () => {
    assertEqual(getAutofinishPostMortem().verzija, APP_VERSION, 'verzija');
  });
  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(getAutofinishPostMortem().autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });
  await test('ukupno > 0', () => {
    assert(getAutofinishPostMortem().ukupno > 0, 'ukupno > 0');
  });
  await test('postmortemi je niz', () => {
    assert(Array.isArray(getAutofinishPostMortem().postmortemi), 'postmortemi niz');
  });
  await test('ukupno === postmortemi.length', () => {
    const r = getAutofinishPostMortem();
    assertEqual(r.ukupno, r.postmortemi.length, 'ukupno=length');
  });
  await test('otvorenih + uPregledu + zatvorenih + arhiviranih === ukupno', () => {
    const r = getAutofinishPostMortem();
    assertEqual(r.otvorenih + r.uPregledu + r.zatvorenih + r.arhiviranih, r.ukupno, 'suma statusa=ukupno');
  });
  await test('otvorenih === broj postmortema sa status otvoren', () => {
    const r = getAutofinishPostMortem();
    const expected = r.postmortemi.filter((p) => p.status === 'otvoren').length;
    assertEqual(r.otvorenih, expected, 'otvorenih=computed');
  });
  await test('uPregledu === broj postmortema sa status u-pregledu', () => {
    const r = getAutofinishPostMortem();
    const expected = r.postmortemi.filter((p) => p.status === 'u-pregledu').length;
    assertEqual(r.uPregledu, expected, 'uPregledu=computed');
  });
  await test('zatvorenih === broj postmortema sa status zatvoren', () => {
    const r = getAutofinishPostMortem();
    const expected = r.postmortemi.filter((p) => p.status === 'zatvoren').length;
    assertEqual(r.zatvorenih, expected, 'zatvorenih=computed');
  });
  await test('arhiviranih === broj postmortema sa status arhiviran', () => {
    const r = getAutofinishPostMortem();
    const expected = r.postmortemi.filter((p) => p.status === 'arhiviran').length;
    assertEqual(r.arhiviranih, expected, 'arhiviranih=computed');
  });
  await test('otvorenihAkcija === broj akcija sa status otvoren ili u-toku', () => {
    const r = getAutofinishPostMortem();
    const expected = r.postmortemi
      .flatMap((p) => p.akcije)
      .filter((a) => a.status === 'otvoren' || a.status === 'u-toku').length;
    assertEqual(r.otvorenihAkcija, expected, 'otvorenihAkcija=computed');
  });
  await test('poSeveritetu suma === ukupno', () => {
    const r = getAutofinishPostMortem();
    const suma = (Object.values(r.poSeveritetu) as number[]).reduce((s, n) => s + n, 0);
    assertEqual(suma, r.ukupno, 'poSeveritetu suma=ukupno');
  });
  await test('poSeveritetu P1 odgovara broj postmortema P1', () => {
    const r = getAutofinishPostMortem();
    const expected = r.postmortemi.filter((p) => p.severity === 'P1').length;
    assertEqual(r.poSeveritetu['P1'], expected, 'poSeveritetu.P1=computed');
  });
  await test('Svaki postmortem: schema polja', () => {
    const STATUSI = ['otvoren', 'u-pregledu', 'zatvoren', 'arhiviran'];
    const SEVERITY = ['P1', 'P2', 'P3', 'P4'];
    for (const p of getAutofinishPostMortem().postmortemi) {
      assert(typeof p.id === 'string' && p.id.length > 0, `pm.id`);
      assert(typeof p.naslov === 'string' && p.naslov.length > 0, `pm.naslov: ${p.id}`);
      assert(typeof p.incidentId === 'string' && p.incidentId.length > 0, `pm.incidentId: ${p.id}`);
      assert(SEVERITY.includes(p.severity), `pm.severity enum: ${p.severity} (${p.id})`);
      assert(STATUSI.includes(p.status), `pm.status enum: ${p.status} (${p.id})`);
      assert(typeof p.vlasnik === 'string' && p.vlasnik.length > 0, `pm.vlasnik: ${p.id}`);
      assert(Array.isArray(p.zahvaceniServisi) && p.zahvaceniServisi.length > 0, `pm.zahvaceniServisi: ${p.id}`);
      assert(typeof p.korijenUzrok === 'string' && p.korijenUzrok.length > 0, `pm.korijenUzrok: ${p.id}`);
    }
  });
  await test('Svaki postmortem: MTTD/MTTR su nenegativan broj', () => {
    for (const p of getAutofinishPostMortem().postmortemi) {
      assert(typeof p.mttdSekundi === 'number' && p.mttdSekundi >= 0, `pm.mttdSekundi: ${p.id}`);
      assert(typeof p.mttrSekundi === 'number' && p.mttrSekundi >= 0, `pm.mttrSekundi: ${p.id}`);
    }
  });
  await test('Svaki postmortem: otvoreno je validan ISO', () => {
    for (const p of getAutofinishPostMortem().postmortemi) {
      assert(typeof p.otvoreno === 'string' && !isNaN(Date.parse(p.otvoreno)), `pm.otvoreno ISO: ${p.id}`);
    }
  });
  await test('Zatvoreni postmortem ima zatvoreno !== null i validan ISO', () => {
    for (const p of getAutofinishPostMortem().postmortemi) {
      if (p.status === 'zatvoren' || p.status === 'arhiviran') {
        assert(p.zatvoreno !== null, `zatvoreno nije null za ${p.status}: ${p.id}`);
        assert(!isNaN(Date.parse(p.zatvoreno!)), `zatvoreno ISO: ${p.id}`);
      }
    }
  });
  await test('Otvoreni/u-pregledu postmortem može imati zatvoreno === null', () => {
    for (const p of getAutofinishPostMortem().postmortemi) {
      if (p.status === 'otvoren' || p.status === 'u-pregledu') {
        // zatvoreno smije biti null — samo provjeravamo da nije nevažeći string
        if (p.zatvoreno !== null) {
          assert(!isNaN(Date.parse(p.zatvoreno)), `zatvoreno mora biti ISO ili null: ${p.id}`);
        }
      }
    }
  });
  await test('Svaki postmortem: timeline je niz i ima min 2 faze', () => {
    for (const p of getAutofinishPostMortem().postmortemi) {
      assert(Array.isArray(p.timeline) && p.timeline.length >= 2, `pm.timeline min 2 faze: ${p.id}`);
    }
  });
  await test('Svaka timeline faza: schema polja', () => {
    for (const p of getAutofinishPostMortem().postmortemi) {
      for (const f of p.timeline) {
        assert(typeof f.naziv === 'string' && f.naziv.length > 0, `faza.naziv: ${p.id}`);
        assert(typeof f.vrijemeISO === 'string' && !isNaN(Date.parse(f.vrijemeISO)), `faza.vrijemeISO ISO: ${p.id}`);
        assert(typeof f.trajanjeSekundi === 'number' && f.trajanjeSekundi >= 0, `faza.trajanjeSekundi: ${p.id}`);
      }
    }
  });
  await test('Svaki postmortem: akcije je niz', () => {
    for (const p of getAutofinishPostMortem().postmortemi) {
      assert(Array.isArray(p.akcije), `pm.akcije niz: ${p.id}`);
    }
  });
  await test('Svaka akcija: schema polja', () => {
    const AKCIJA_STATUSI = ['otvoren', 'u-toku', 'završen', 'odbijen'];
    const SEVERITY = ['P1', 'P2', 'P3', 'P4'];
    for (const p of getAutofinishPostMortem().postmortemi) {
      for (const a of p.akcije) {
        assert(typeof a.id === 'string' && a.id.length > 0, `akcija.id: ${p.id}`);
        assert(typeof a.opis === 'string' && a.opis.length > 0, `akcija.opis: ${p.id}/${a.id}`);
        assert(typeof a.odgovoran === 'string' && a.odgovoran.length > 0, `akcija.odgovoran: ${p.id}/${a.id}`);
        assert(typeof a.rokISO === 'string' && !isNaN(Date.parse(a.rokISO)), `akcija.rokISO ISO: ${p.id}/${a.id}`);
        assert(AKCIJA_STATUSI.includes(a.status), `akcija.status enum: ${a.status} (${p.id}/${a.id})`);
        assert(SEVERITY.includes(a.prioritet), `akcija.prioritet enum: ${a.prioritet} (${p.id}/${a.id})`);
      }
    }
  });
  await test('timestamp je validan ISO', () => {
    assert(!isNaN(Date.parse(getAutofinishPostMortem().timestamp)), 'ISO');
  });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) { console.error('\n❌ Neuspješni testovi:'); failures.forEach((f) => console.error(`  • ${f}`)); process.exit(1); }
}
runTests().catch((e) => { console.error('Greška:', e); process.exit(1); });
