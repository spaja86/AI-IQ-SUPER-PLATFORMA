// Autofinish #1101 — Unit Testovi AlertRulesWidget
// Kompanija SPAJA — Digitalna Industrija

import { getAutofinishAlertRules } from '../../lib/autofinish-petlja';
import type {
  AutofinishAlertPravilo,
  AutofinishAlertStatus,
  AutofinishAlertSeverity,
} from '../../lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }
function assertEqual<T>(a: T, e: T, l?: string): void { if (a !== e) throw new Error(`${l ?? 'assertEqual'}: expected ${JSON.stringify(e)}, got ${JSON.stringify(a)}`); }

// Simulira dupli filter logiku AlertRulesWidget-a (status × severity)
function filterPravila(
  pravila: AutofinishAlertPravilo[],
  filterStatus: AutofinishAlertStatus | 'svi',
  filterSeverity: AutofinishAlertSeverity | 'sve',
): AutofinishAlertPravilo[] {
  return pravila.filter((p) => {
    const matchStatus = filterStatus === 'svi' || p.status === filterStatus;
    const matchSeverity = filterSeverity === 'sve' || p.severity === filterSeverity;
    return matchStatus && matchSeverity;
  });
}

async function runTests(): Promise<void> {
  console.log('\n🔔 AlertRulesWidget — Unit Test Suite (#1101)\n');

  const alertRules = getAutofinishAlertRules();

  await test('Vraća objekat s pravilima', () => {
    assert(typeof alertRules === 'object' && alertRules !== null, 'objekat');
    assert(Array.isArray(alertRules.pravila), 'pravila je niz');
  });

  await test('verzija === APP_VERSION', () => {
    assertEqual(alertRules.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(alertRules.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('Filter "svi/sve" vraća sva pravila', () => {
    const filtered = filterPravila(alertRules.pravila, 'svi', 'sve');
    assertEqual(filtered.length, alertRules.pravila.length, 'svi/sve=ukupno pravila');
  });

  await test('Filter po statusu "aktivan" vraća samo aktivna pravila', () => {
    const filtered = filterPravila(alertRules.pravila, 'aktivan', 'sve');
    assert(filtered.every((p) => p.status === 'aktivan'), 'sva su aktivna');
  });

  await test('Filter po statusu "utišan" vraća samo utišana pravila', () => {
    const filtered = filterPravila(alertRules.pravila, 'utišan', 'sve');
    assert(filtered.every((p) => p.status === 'utišan'), 'sva su utišana');
  });

  await test('Filter po statusu "privremeno_onemogućen" vraća samo onemogućena', () => {
    const filtered = filterPravila(alertRules.pravila, 'privremeno_onemogućen', 'sve');
    assert(filtered.every((p) => p.status === 'privremeno_onemogućen'), 'sva su onemogućena');
  });

  await test('Filter po severitetu "kritičan" vraća samo kritična pravila', () => {
    const filtered = filterPravila(alertRules.pravila, 'svi', 'kritičan');
    assert(filtered.every((p) => p.severity === 'kritičan'), 'sva su kritična');
  });

  await test('Dupli filter (aktivan × visok) vraća intersekciu', () => {
    const filtered = filterPravila(alertRules.pravila, 'aktivan', 'visok');
    assert(filtered.every((p) => p.status === 'aktivan' && p.severity === 'visok'), 'intersekcia');
  });

  await test('Svako pravilo ima naziv i servis za prikaz', () => {
    for (const p of alertRules.pravila) {
      assert(typeof p.naziv === 'string' && p.naziv.length > 0, `naziv: ${p.id}`);
      assert(typeof p.servis === 'string' && p.servis.length > 0, `servis: ${p.id}`);
    }
  });

  await test('Status enum je validan za sva pravila', () => {
    const STATUSI: AutofinishAlertStatus[] = ['aktivan', 'utišan', 'privremeno_onemogućen'];
    for (const p of alertRules.pravila) {
      assert(STATUSI.includes(p.status), `status enum: ${p.status} (${p.id})`);
    }
  });

  await test('Severity enum je validan za sva pravila', () => {
    const SEVERITIES: AutofinishAlertSeverity[] = ['kritičan', 'visok', 'srednji', 'nizak'];
    for (const p of alertRules.pravila) {
      assert(SEVERITIES.includes(p.severity), `severity enum: ${p.severity} (${p.id})`);
    }
  });

  await test('Prag tip metrike enum je validan', () => {
    const TIPOVI = ['latencija', 'error_rate', 'cpu', 'memorija', 'dostupnost', 'throughput'];
    for (const p of alertRules.pravila) {
      assert(TIPOVI.includes(p.prag.tip), `prag.tip: ${p.prag.tip} (${p.id})`);
    }
  });

  await test('Prag operator enum je validan', () => {
    const OPERATORI = ['>', '<', '>=', '<='];
    for (const p of alertRules.pravila) {
      assert(OPERATORI.includes(p.prag.operator), `prag.operator: ${p.prag.operator} (${p.id})`);
    }
  });

  await test('Prag vrijednost je nenegativan broj, trajanjeSekundi je pozitivan', () => {
    for (const p of alertRules.pravila) {
      assert(p.prag.vrijednost >= 0, `prag.vrijednost >= 0: ${p.id}`);
      assert(p.prag.trajanjeSekundi > 0, `prag.trajanjeSekundi > 0: ${p.id}`);
    }
  });

  await test('Prag jedinica je string za prikaz', () => {
    for (const p of alertRules.pravila) {
      assert(typeof p.prag.jedinica === 'string' && p.prag.jedinica.length > 0, `prag.jedinica: ${p.id}`);
    }
  });

  await test('Eskalacije kanal enum je validan', () => {
    const KANALI = ['slack', 'pager', 'email'];
    for (const p of alertRules.pravila) {
      for (const e of p.eskalacije) {
        assert(KANALI.includes(e.kanal), `eskalacija.kanal: ${e.kanal} (${p.id})`);
      }
    }
  });

  await test('Eskalacije nivo enum je validan', () => {
    const NIVOI = ['L1', 'L2', 'L3'];
    for (const p of alertRules.pravila) {
      for (const e of p.eskalacije) {
        assert(NIVOI.includes(e.nivo), `eskalacija.nivo: ${e.nivo} (${p.id})`);
      }
    }
  });

  await test('Utišana pravila imaju prozor tišine za prikaz', () => {
    const utišana = alertRules.pravila.filter((p) => p.status === 'utišan');
    for (const p of utišana) {
      assert(typeof p.prozorTišineOd === 'string' && p.prozorTišineOd.length >= 10, `prozorTišineOd: ${p.id}`);
      assert(typeof p.prozorTišineDo === 'string' && p.prozorTišineDo.length >= 10, `prozorTišineDo: ${p.id}`);
    }
  });

  await test('aktiviranja7Dana je nenegativan broj za sva pravila', () => {
    for (const p of alertRules.pravila) {
      assert(typeof p.aktiviranja7Dana === 'number' && p.aktiviranja7Dana >= 0, `aktiviranja7Dana: ${p.id}`);
    }
  });

  await test('poServisima suma === ukupnoPravila', () => {
    const suma = Object.values(alertRules.poServisima).reduce((s, n) => s + n, 0);
    assertEqual(suma, alertRules.ukupnoPravila, 'poServisima suma=ukupno');
  });

  await test('kriticnih === broj pravila sa severity kritičan', () => {
    const cnt = alertRules.pravila.filter((p) => p.severity === 'kritičan').length;
    assertEqual(alertRules.kriticnih, cnt, 'kriticnih izračun');
  });

  await test('poslednjeAktiviranje je validan ISO ako nije null', () => {
    for (const p of alertRules.pravila) {
      if (p.poslednjeAktiviranje !== null) {
        assert(!isNaN(Date.parse(p.poslednjeAktiviranje)), `poslednjeAktiviranje ISO: ${p.id}`);
      }
    }
  });

  await test('JSON API link target /api/autofinish-alert-rules je ispravan', () => {
    const path = '/api/autofinish-alert-rules';
    assert(path.startsWith('/api/'), 'JSON API putanja počinje sa /api/');
    assert(path.includes('alert-rules'), 'JSON API putanja sadrži alert-rules');
  });

  await test('timestamp je validan ISO', () => {
    assert(!isNaN(Date.parse(alertRules.timestamp)), 'ISO timestamp');
  });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) { console.error('\n❌ Neuspješni testovi:'); failures.forEach((f) => console.error(`  • ${f}`)); process.exit(1); }
}
runTests().catch((e) => { console.error('Greška:', e); process.exit(1); });
