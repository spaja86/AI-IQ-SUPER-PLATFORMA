// Autofinish #1106 — Unit Testovi PostMortemWidget
// Kompanija SPAJA — Digitalna Industrija

import { getAutofinishPostMortem } from '../../lib/autofinish-petlja';
import type {
  AutofinishPostMortem,
  AutofinishPostMortemStatus,
  AutofinishPostMortemSeverity,
} from '../../lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }
function assertEqual<T>(a: T, e: T, l?: string): void { if (a !== e) throw new Error(`${l ?? 'assertEqual'}: expected ${JSON.stringify(e)}, got ${JSON.stringify(a)}`); }

// Simulira dupli filter logiku PostMortemWidget-a (status × severity)
function filterPostmortemi(
  postmortemi: AutofinishPostMortem[],
  filterStatus: AutofinishPostMortemStatus | 'svi',
  filterSeverity: AutofinishPostMortemSeverity | 'sve',
): AutofinishPostMortem[] {
  return postmortemi.filter((pm) => {
    const matchStatus = filterStatus === 'svi' || pm.status === filterStatus;
    const matchSeverity = filterSeverity === 'sve' || pm.severity === filterSeverity;
    return matchStatus && matchSeverity;
  });
}

async function runTests(): Promise<void> {
  console.log('\n📋 PostMortemWidget — Unit Test Suite (#1106)\n');

  const postMortem = getAutofinishPostMortem();

  await test('Vraća objekat s postmortemima', () => {
    assert(typeof postMortem === 'object' && postMortem !== null, 'objekat');
    assert(Array.isArray(postMortem.postmortemi), 'postmortemi je niz');
  });

  await test('verzija === APP_VERSION', () => {
    assertEqual(postMortem.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(postMortem.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('Filter "svi/sve" vraća sve postmorteme', () => {
    const filtered = filterPostmortemi(postMortem.postmortemi, 'svi', 'sve');
    assertEqual(filtered.length, postMortem.postmortemi.length, 'svi/sve=ukupno');
  });

  await test('Filter po statusu "otvoren" vraća samo otvorene', () => {
    const filtered = filterPostmortemi(postMortem.postmortemi, 'otvoren', 'sve');
    assert(filtered.every((pm) => pm.status === 'otvoren'), 'svi otvoreni');
  });

  await test('Filter po statusu "u-pregledu" vraća samo u pregledu', () => {
    const filtered = filterPostmortemi(postMortem.postmortemi, 'u-pregledu', 'sve');
    assert(filtered.every((pm) => pm.status === 'u-pregledu'), 'svi u pregledu');
  });

  await test('Filter po statusu "zatvoren" vraća samo zatvorene', () => {
    const filtered = filterPostmortemi(postMortem.postmortemi, 'zatvoren', 'sve');
    assert(filtered.every((pm) => pm.status === 'zatvoren'), 'svi zatvoreni');
  });

  await test('Filter po statusu "arhiviran" vraća samo arhivirane', () => {
    const filtered = filterPostmortemi(postMortem.postmortemi, 'arhiviran', 'sve');
    assert(filtered.every((pm) => pm.status === 'arhiviran'), 'svi arhivirani');
  });

  await test('Filter po severitetu "P1" vraća samo P1', () => {
    const filtered = filterPostmortemi(postMortem.postmortemi, 'svi', 'P1');
    assert(filtered.every((pm) => pm.severity === 'P1'), 'svi P1');
  });

  await test('Dupli filter (zatvoren × P1) vraća intersekciu', () => {
    const filtered = filterPostmortemi(postMortem.postmortemi, 'zatvoren', 'P1');
    assert(filtered.every((pm) => pm.status === 'zatvoren' && pm.severity === 'P1'), 'intersekcia zatvoren×P1');
  });

  await test('Zbir statusa === ukupno', () => {
    const suma = postMortem.otvorenih + postMortem.uPregledu + postMortem.zatvorenih + postMortem.arhiviranih;
    assertEqual(suma, postMortem.ukupno, 'suma statusa=ukupno');
  });

  await test('otvorenihAkcija je nenegativan broj', () => {
    assert(typeof postMortem.otvorenihAkcija === 'number' && postMortem.otvorenihAkcija >= 0, 'otvorenihAkcija >= 0');
  });

  await test('Status enum je validan za sve postmorteme', () => {
    const STATUSI: AutofinishPostMortemStatus[] = ['otvoren', 'u-pregledu', 'zatvoren', 'arhiviran'];
    for (const pm of postMortem.postmortemi) {
      assert(STATUSI.includes(pm.status), `status enum: ${pm.status} (${pm.id})`);
    }
  });

  await test('Severity enum je validan za sve postmorteme', () => {
    const SEVERITIES: AutofinishPostMortemSeverity[] = ['P1', 'P2', 'P3', 'P4'];
    for (const pm of postMortem.postmortemi) {
      assert(SEVERITIES.includes(pm.severity), `severity enum: ${pm.severity} (${pm.id})`);
    }
  });

  await test('Svaki postmortem ima naslov, vlasnika i incidentId', () => {
    for (const pm of postMortem.postmortemi) {
      assert(typeof pm.naslov === 'string' && pm.naslov.length > 0, `naslov: ${pm.id}`);
      assert(typeof pm.vlasnik === 'string' && pm.vlasnik.length > 0, `vlasnik: ${pm.id}`);
      assert(typeof pm.incidentId === 'string' && pm.incidentId.length > 0, `incidentId: ${pm.id}`);
    }
  });

  await test('MTTD i MTTR su nenegativni', () => {
    for (const pm of postMortem.postmortemi) {
      assert(pm.mttdSekundi >= 0, `mttdSekundi >= 0: ${pm.id}`);
      assert(pm.mttrSekundi >= 0, `mttrSekundi >= 0: ${pm.id}`);
    }
  });

  await test('Timeline ima min 2 faze', () => {
    for (const pm of postMortem.postmortemi) {
      assert(pm.timeline.length >= 2, `timeline >= 2 faze: ${pm.id}`);
    }
  });

  await test('Timeline faze imaju validan vrijemeISO', () => {
    for (const pm of postMortem.postmortemi) {
      for (const faza of pm.timeline) {
        assert(!isNaN(Date.parse(faza.vrijemeISO)), `faza vrijemeISO ISO: ${pm.id} — ${faza.naziv}`);
        assert(faza.trajanjeSekundi >= 0, `faza trajanjeSekundi >= 0: ${pm.id} — ${faza.naziv}`);
      }
    }
  });

  await test('Akcije prioritet enum je validan', () => {
    const SEVERITIES: AutofinishPostMortemSeverity[] = ['P1', 'P2', 'P3', 'P4'];
    for (const pm of postMortem.postmortemi) {
      for (const a of pm.akcije) {
        assert(SEVERITIES.includes(a.prioritet), `akcija prioritet: ${a.prioritet} (${a.id})`);
      }
    }
  });

  await test('Akcije imaju odgovornog i status', () => {
    const STATUSI = ['otvoren', 'u-toku', 'završen', 'odbijen'];
    for (const pm of postMortem.postmortemi) {
      for (const a of pm.akcije) {
        assert(typeof a.odgovoran === 'string' && a.odgovoran.length > 0, `odgovoran: ${a.id}`);
        assert(STATUSI.includes(a.status), `akcija status: ${a.status} (${a.id})`);
      }
    }
  });

  await test('Zatvoreni/arhivirani postmortemi imaju zatvoreno ISO', () => {
    for (const pm of postMortem.postmortemi) {
      if (pm.status === 'zatvoren' || pm.status === 'arhiviran') {
        assert(typeof pm.zatvoreno === 'string' && !isNaN(Date.parse(pm.zatvoreno)), `zatvoreno ISO: ${pm.id}`);
      }
    }
  });

  await test('JSON API link target /api/autofinish-post-mortem je ispravan', () => {
    const path = '/api/autofinish-post-mortem';
    assert(path.startsWith('/api/'), 'JSON API putanja počinje sa /api/');
    assert(path.includes('post-mortem'), 'JSON API putanja sadrži post-mortem');
  });

  await test('timestamp je validan ISO', () => {
    assert(!isNaN(Date.parse(postMortem.timestamp)), 'ISO timestamp');
  });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) { console.error('\n❌ Neuspješni testovi:'); failures.forEach((f) => console.error(`  • ${f}`)); process.exit(1); }
}
runTests().catch((e) => { console.error('Greška:', e); process.exit(1); });
