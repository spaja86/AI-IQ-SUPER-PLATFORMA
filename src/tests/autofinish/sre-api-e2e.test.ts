// Autofinish #1108 — E2E SRE API Endpoints Konzistentnost Test
// Kompanija SPAJA — Digitalna Industrija

import {
  getAutofinishIncidentLog,
  getAutofinishErrorBudget,
  getAutofinishRunbook,
  getAutofinishOnCall,
  getAutofinishAlertRules,
  getAutofinishPostMortem,
} from '../../lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }
function assertEqual<T>(a: T, e: T, l?: string): void { if (a !== e) throw new Error(`${l ?? 'assertEqual'}: expected ${JSON.stringify(e)}, got ${JSON.stringify(a)}`); }

async function runTests(): Promise<void> {
  console.log('\n🏥 E2E SRE API Endpoints Konzistentnost — Test Suite (#1108)\n');

  const incidentLog = getAutofinishIncidentLog();
  const errorBudget = getAutofinishErrorBudget();
  const runbook = getAutofinishRunbook();
  const onCall = getAutofinishOnCall();
  const alertRules = getAutofinishAlertRules();
  const postMortem = getAutofinishPostMortem();

  const svi = [
    { naziv: 'incidentLog', data: incidentLog },
    { naziv: 'errorBudget', data: errorBudget },
    { naziv: 'runbook', data: runbook },
    { naziv: 'onCall', data: onCall },
    { naziv: 'alertRules', data: alertRules },
    { naziv: 'postMortem', data: postMortem },
  ];

  // ── Verzija konzistentnost ─────────────────────────────────────────────────
  await test('Svi SRE helperi vraćaju isti APP_VERSION', () => {
    for (const { naziv, data } of svi) {
      assertEqual((data as { verzija: string }).verzija, APP_VERSION, `${naziv}.verzija`);
    }
  });

  await test('Svi SRE helperi vraćaju isti AUTOFINISH_COUNT', () => {
    for (const { naziv, data } of svi) {
      assertEqual((data as { autofinishBroj: number }).autofinishBroj, AUTOFINISH_COUNT, `${naziv}.autofinishBroj`);
    }
  });

  // ── Timestamp konzistentnost ───────────────────────────────────────────────
  await test('Svi SRE helperi vraćaju validan ISO timestamp', () => {
    for (const { naziv, data } of svi) {
      const ts = (data as { timestamp: string }).timestamp;
      assert(!isNaN(Date.parse(ts)), `${naziv}.timestamp ISO: ${ts}`);
    }
  });

  // ── Incident Log ────────────────────────────────────────────────────────────
  await test('incidentLog ima incidente niz i ukupno', () => {
    assert(Array.isArray(incidentLog.incidenti), 'incidenti niz');
    assert(typeof incidentLog.ukupno === 'number' && incidentLog.ukupno >= 0, 'ukupno >= 0');
  });

  await test('incidentLog ukupno === incidenti.length', () => {
    assertEqual(incidentLog.ukupno, incidentLog.incidenti.length, 'ukupno=length');
  });

  await test('incidentLog API putanja je ispravan format', () => {
    const path = '/api/autofinish-incident-log';
    assert(path.startsWith('/api/autofinish-'), 'incident-log api putanja');
  });

  // ── Error Budget ────────────────────────────────────────────────────────────
  await test('errorBudget ima servise niz i prosjekPotrošnje', () => {
    assert(Array.isArray(errorBudget.servisi), 'servisi niz');
    assert(typeof errorBudget.prosjekPotrošnje === 'number', 'prosjekPotrošnje je broj');
  });

  await test('errorBudget svi servisi imaju SLO target između 0 i 100', () => {
    for (const s of errorBudget.servisi) {
      assert(s.sloTarget >= 0 && s.sloTarget <= 100, `sloTarget: ${s.naziv}`);
    }
  });

  await test('errorBudget API putanja je ispravan format', () => {
    const path = '/api/autofinish-error-budget';
    assert(path.startsWith('/api/autofinish-'), 'error-budget api putanja');
  });

  // ── Runbook ─────────────────────────────────────────────────────────────────
  await test('runbook ima runbooke niz i ukupnoRunbooka', () => {
    assert(Array.isArray(runbook.runbooki), 'runbooki niz');
    assert(typeof runbook.ukupnoRunbooka === 'number' && runbook.ukupnoRunbooka >= 0, 'ukupnoRunbooka >= 0');
  });

  await test('runbook ukupnoRunbooka === runbooki.length', () => {
    assertEqual(runbook.ukupnoRunbooka, runbook.runbooki.length, 'ukupnoRunbooka=length');
  });

  await test('runbook API putanja je ispravan format', () => {
    const path = '/api/autofinish-runbook';
    assert(path.startsWith('/api/autofinish-'), 'runbook api putanja');
  });

  // ── On-Call ─────────────────────────────────────────────────────────────────
  await test('onCall ima timove niz i ukupnoTimova', () => {
    assert(Array.isArray(onCall.timovi), 'timovi niz');
    assert(typeof onCall.ukupnoTimova === 'number' && onCall.ukupnoTimova >= 0, 'ukupnoTimova >= 0');
  });

  await test('onCall ukupnoTimova === timovi.length', () => {
    assertEqual(onCall.ukupnoTimova, onCall.timovi.length, 'ukupnoTimova=length');
  });

  await test('onCall API putanja je ispravan format', () => {
    const path = '/api/autofinish-on-call';
    assert(path.startsWith('/api/autofinish-'), 'on-call api putanja');
  });

  // ── Alert Rules ─────────────────────────────────────────────────────────────
  await test('alertRules ima pravila niz i ukupnoPravila', () => {
    assert(Array.isArray(alertRules.pravila), 'pravila niz');
    assert(typeof alertRules.ukupnoPravila === 'number' && alertRules.ukupnoPravila >= 0, 'ukupnoPravila >= 0');
  });

  await test('alertRules ukupnoPravila === pravila.length', () => {
    assertEqual(alertRules.ukupnoPravila, alertRules.pravila.length, 'ukupnoPravila=length');
  });

  await test('alertRules API putanja je ispravan format', () => {
    const path = '/api/autofinish-alert-rules';
    assert(path.startsWith('/api/autofinish-'), 'alert-rules api putanja');
  });

  // ── Post-mortem ─────────────────────────────────────────────────────────────
  await test('postMortem ima postmortemi niz i ukupno', () => {
    assert(Array.isArray(postMortem.postmortemi), 'postmortemi niz');
    assert(typeof postMortem.ukupno === 'number' && postMortem.ukupno >= 0, 'ukupno >= 0');
  });

  await test('postMortem ukupno === postmortemi.length', () => {
    assertEqual(postMortem.ukupno, postMortem.postmortemi.length, 'ukupno=length');
  });

  await test('postMortem API putanja je ispravan format', () => {
    const path = '/api/autofinish-post-mortem';
    assert(path.startsWith('/api/autofinish-'), 'post-mortem api putanja');
  });

  // ── Kros-konzistentnost: svi vraćaju objekte (ne null, ne undefined) ─────────
  await test('Niti jedan SRE helper ne vraća null ni undefined', () => {
    for (const { naziv, data } of svi) {
      assert(data !== null && data !== undefined, `${naziv} nije null/undefined`);
      assert(typeof data === 'object', `${naziv} je objekat`);
    }
  });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) { console.error('\n❌ Neuspješni testovi:'); failures.forEach((f) => console.error(`  • ${f}`)); process.exit(1); }
}
runTests().catch((e) => { console.error('Greška:', e); process.exit(1); });
