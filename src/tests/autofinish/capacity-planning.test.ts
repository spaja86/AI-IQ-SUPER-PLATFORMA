// Autofinish #1110 — Unit testovi CapacityPlanningWidget (getAutofinishCapacityPlanning)
// Kompanija SPAJA — Digitalna Industrija

import { getAutofinishCapacityPlanning } from '../../lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }
function assertEqual<T>(a: T, e: T, l?: string): void { if (a !== e) throw new Error(`${l ?? 'assertEqual'}: expected ${JSON.stringify(e)}, got ${JSON.stringify(a)}`); }

const VALID_STATUSI = ['ok', 'upozorenje', 'kriticno'] as const;
const VALID_TRENDOVI = ['raste', 'pada', 'stabilan'] as const;
const VALID_TIPOVI = ['cpu', 'memorija', 'disk', 'mreza', 'baza'] as const;

async function runTests(): Promise<void> {
  console.log('\n📈 Unit testovi CapacityPlanningWidget — Test Suite (#1110)\n');

  const cap = getAutofinishCapacityPlanning();

  await test('verzija === APP_VERSION', () => {
    assertEqual(cap.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(cap.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('timestamp je validan ISO string', () => {
    assert(!isNaN(Date.parse(cap.timestamp)), `timestamp ISO: ${cap.timestamp}`);
  });

  await test('ukupnoResursa je pozitivan broj', () => {
    assert(typeof cap.ukupnoResursa === 'number' && cap.ukupnoResursa > 0, `ukupnoResursa: ${cap.ukupnoResursa}`);
  });

  await test('ukupnoResursa === resursi.length', () => {
    assertEqual(cap.ukupnoResursa, cap.resursi.length, 'ukupnoResursa=resursi.length');
  });

  await test('ok + uUpozorenju + kriticnih === ukupnoResursa', () => {
    const zbir = cap.ok + cap.uUpozorenju + cap.kriticnih;
    assertEqual(zbir, cap.ukupnoResursa, `ok+uUpozorenju+kriticnih=${zbir} !== ${cap.ukupnoResursa}`);
  });

  await test('ok >= 0', () => {
    assert(cap.ok >= 0, `ok: ${cap.ok}`);
  });

  await test('uUpozorenju >= 0', () => {
    assert(cap.uUpozorenju >= 0, `uUpozorenju: ${cap.uUpozorenju}`);
  });

  await test('kriticnih >= 0', () => {
    assert(cap.kriticnih >= 0, `kriticnih: ${cap.kriticnih}`);
  });

  await test('prosjecnaIskorištenost je između 0 i 100', () => {
    assert(
      typeof cap.prosjecnaIskorištenost === 'number' &&
      cap.prosjecnaIskorištenost >= 0 &&
      cap.prosjecnaIskorištenost <= 100,
      `prosjecnaIskorištenost: ${cap.prosjecnaIskorištenost}`,
    );
  });

  await test('Svaki resurs ima id koji nije prazan', () => {
    for (const r of cap.resursi) {
      assert(typeof r.id === 'string' && r.id.length > 0, `id prazan: ${JSON.stringify(r)}`);
    }
  });

  await test('Svaki resurs ima naziv koji nije prazan', () => {
    for (const r of cap.resursi) {
      assert(typeof r.naziv === 'string' && r.naziv.length > 0, `naziv prazan za ${r.id}`);
    }
  });

  await test('Svaki resurs ima servis koji nije prazan', () => {
    for (const r of cap.resursi) {
      assert(typeof r.servis === 'string' && r.servis.length > 0, `servis prazan za ${r.id}`);
    }
  });

  await test('Svaki resurs ima validan tip', () => {
    for (const r of cap.resursi) {
      assert((VALID_TIPOVI as readonly string[]).includes(r.tip), `nevalidan tip "${r.tip}" za ${r.id}`);
    }
  });

  await test('Svaki resurs ima validan status', () => {
    for (const r of cap.resursi) {
      assert((VALID_STATUSI as readonly string[]).includes(r.status), `nevalidan status "${r.status}" za ${r.id}`);
    }
  });

  await test('Svaki resurs ima validan trend', () => {
    for (const r of cap.resursi) {
      assert((VALID_TRENDOVI as readonly string[]).includes(r.trend), `nevalidan trend "${r.trend}" za ${r.id}`);
    }
  });

  await test('iskorištenostPct je između 0 i 100 za svaki resurs', () => {
    for (const r of cap.resursi) {
      assert(r.iskorištenostPct >= 0 && r.iskorištenostPct <= 100, `iskorištenostPct out of range: ${r.id} = ${r.iskorištenostPct}`);
    }
  });

  await test('pragUpozorenjaPct < pragKriticnoPct za svaki resurs', () => {
    for (const r of cap.resursi) {
      assert(r.pragUpozorenjaPct < r.pragKriticnoPct, `pragUpozorenja >= pragKriticno za ${r.id}`);
    }
  });

  await test('prognoza7dPct je između 0 i 100 za svaki resurs', () => {
    for (const r of cap.resursi) {
      assert(r.prognoza7dPct >= 0 && r.prognoza7dPct <= 100, `prognoza7dPct out of range: ${r.id} = ${r.prognoza7dPct}`);
    }
  });

  await test('preporuka nije prazna za svaki resurs', () => {
    for (const r of cap.resursi) {
      assert(typeof r.preporuka === 'string' && r.preporuka.length > 0, `preporuka prazna za ${r.id}`);
    }
  });

  await test('Status ok: iskorištenostPct < pragKriticnoPct i < pragUpozorenjaPct', () => {
    const okResursi = cap.resursi.filter((r) => r.status === 'ok');
    for (const r of okResursi) {
      assert(
        r.iskorištenostPct < r.pragUpozorenjaPct,
        `ok resurs ${r.id} ima iskorištenost ${r.iskorištenostPct} >= pragUpozorenja ${r.pragUpozorenjaPct}`,
      );
    }
  });

  await test('Status kriticno: iskorištenostPct >= pragKriticnoPct', () => {
    const kriticniResursi = cap.resursi.filter((r) => r.status === 'kriticno');
    for (const r of kriticniResursi) {
      assert(
        r.iskorištenostPct >= r.pragKriticnoPct,
        `kriticno resurs ${r.id} ima iskorištenost ${r.iskorištenostPct} < pragKriticno ${r.pragKriticnoPct}`,
      );
    }
  });

  await test('resursi niz nije prazan', () => {
    assert(Array.isArray(cap.resursi) && cap.resursi.length > 0, 'resursi prazan niz');
  });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) { console.error('\n❌ Neuspješni testovi:'); failures.forEach((f) => console.error(`  • ${f}`)); process.exit(1); }
}
runTests().catch((e) => { console.error('Greška:', e); process.exit(1); });
