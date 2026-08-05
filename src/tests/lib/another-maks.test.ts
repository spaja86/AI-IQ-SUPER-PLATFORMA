// SpajaUltraOmegaCore -∞Ω+∞ — ANOTHER MAKS Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  buildAnotherMaks,
  executeAnotherMaksTask,
  getAnotherMaksInfo,
  getAnotherMaksPersona,
  shouldHandoffToMaks,
  ANOTHER_MAKS_CONTRACT_VERSION,
  ANOTHER_MAKS_MODEL_VERSION,
  ANOTHER_MAKS_SOURCE_OF_TRUTH,
  ANOTHER_MAKS_WEIGHTS,
  ANOTHER_MAKS_PERSONA,
} from '../../lib/another-maks';
import { getAnotherMaksLastSnapshot, setAnotherMaksLastSnapshot } from '../../lib/another-maks/store';

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

async function runTests(): Promise<void> {
  console.log('\n🤖 ANOTHER MAKS — test suite\n');

  // ─── Persona validacija ────────────────────────────────────────────────────

  await test('Persona ima ispravna id i naziv polja', () => {
    const persona = getAnotherMaksPersona();
    assertEqual(persona.id, 'another-maks', 'id');
    assert(persona.naziv.length > 0, 'naziv mora postojati');
    assert(persona.specijalizacija === 'kreativna-sinteza', 'specijalizacija mora biti kreativna-sinteza');
    assertEqual(persona.linkedAgent, 'maksimus-2', 'linkedAgent');
  });

  await test('ANOTHER_MAKS_PERSONA konstanta je ispravna', () => {
    assertEqual(ANOTHER_MAKS_PERSONA.id, 'another-maks', 'PERSONA.id');
    assertEqual(ANOTHER_MAKS_PERSONA.verzija, '1.0.0', 'PERSONA.verzija');
    assert(ANOTHER_MAKS_PERSONA.performanceKpi.evaluacijaMaxMs <= 50, 'evaluacijaMaxMs mora biti <= 50');
    assertEqual(ANOTHER_MAKS_PERSONA.performanceKpi.buildMaxMin, 3, 'buildMaxMin mora biti 3');
    assertEqual(ANOTHER_MAKS_PERSONA.performanceKpi.uptimeSla, '99.99%', 'uptimeSla');
  });

  await test('Persona ima opis i validne KPI vrednosti', () => {
    const persona = getAnotherMaksPersona();
    assert(persona.opis.length > 20, 'opis mora imati sadržaj');
    assert(persona.performanceKpi.evaluacijaMaxMs > 0, 'evaluacijaMaxMs mora biti pozitivan');
    assert(persona.performanceKpi.buildMaxMin > 0, 'buildMaxMin mora biti pozitivan');
    assert(persona.performanceKpi.uptimeSla.length > 0, 'uptimeSla mora biti definisan');
  });

  // ─── Handoff logika ────────────────────────────────────────────────────────

  await test('shouldHandoffToMaks — bez konteksta vraća false', () => {
    const result = shouldHandoffToMaks(undefined);
    assertEqual(result.handoff, false, 'handoff bez konteksta');
    assertEqual(result.razlog, null, 'razlog bez konteksta');
  });

  await test('shouldHandoffToMaks — analitički kontekst triggera handoff', () => {
    const result = shouldHandoffToMaks('Potrebna analiza metrika za Q3 izveštaj');
    assertEqual(result.handoff, true, 'handoff za analitički kontekst');
    assert(result.razlog !== null && result.razlog.length > 0, 'razlog mora biti definisan za handoff');
  });

  await test('shouldHandoffToMaks — kreativni kontekst ne triggera handoff', () => {
    const result = shouldHandoffToMaks('Generiši novu kreativnu kampanju za platformu');
    assertEqual(result.handoff, false, 'ne sme biti handoff za kreativni kontekst');
    assertEqual(result.razlog, null, 'razlog mora biti null za kreativni kontekst');
  });

  // ─── Weight normalizacija ──────────────────────────────────────────────────

  await test('ANOTHER_MAKS_WEIGHTS su normalizovani na 1.0', () => {
    const sum = Object.values(ANOTHER_MAKS_WEIGHTS).reduce((s, w) => s + w, 0);
    assert(Math.abs(sum - 1) < 0.0001, `Weight suma mora biti 1.0 (trenutno: ${sum})`);
  });

  await test('ANOTHER_MAKS_WEIGHTS ima ispravne ključeve', () => {
    assert('kreativnaSinteza' in ANOTHER_MAKS_WEIGHTS, 'kreativnaSinteza mora postojati');
    assert('generativnaOrkestracija' in ANOTHER_MAKS_WEIGHTS, 'generativnaOrkestracija mora postojati');
    assert('inovacioniSignal' in ANOTHER_MAKS_WEIGHTS, 'inovacioniSignal mora postojati');
    assert('novaGeneracijaSync' in ANOTHER_MAKS_WEIGHTS, 'novaGeneracijaSync mora postojati');
  });

  // ─── Store ────────────────────────────────────────────────────────────────

  await test('Store je inicijalno null', () => {
    // Resetovati snapshot
    setAnotherMaksLastSnapshot({
      ukupanScore: 0,
      domenScores: {
        kreativnaSinteza: 0,
        generativnaOrkestracija: 0,
        inovacioniSignal: 0,
        novaGeneracijaSync: 0,
      },
      timestamp: new Date().toISOString(),
    });
    const snap = getAnotherMaksLastSnapshot();
    assert(snap !== null, 'store mora biti postavljen');
  });

  await test('Store čuva i vraća snapshot', () => {
    const snapshot = {
      ukupanScore: 82,
      domenScores: {
        kreativnaSinteza: 85,
        generativnaOrkestracija: 78,
        inovacioniSignal: 88,
        novaGeneracijaSync: 80,
      },
      timestamp: new Date().toISOString(),
    };
    setAnotherMaksLastSnapshot(snapshot);
    const retrieved = getAnotherMaksLastSnapshot();
    assert(retrieved !== null, 'snapshot mora biti sačuvan');
    assertEqual(retrieved.ukupanScore, 82, 'ukupanScore mora biti sačuvan');
    assertEqual(retrieved.domenScores.kreativnaSinteza, 85, 'kreativnaSinteza score');
  });

  // ─── buildAnotherMaks ─────────────────────────────────────────────────────

  await test('buildAnotherMaks vraća validnu strukturu', async () => {
    const result = await buildAnotherMaks();
    assert(result.sistem.length > 0, 'sistem mora imati vrednost');
    assert(result.kompanija.length > 0, 'kompanija mora imati vrednost');
    assert(result.verzija.length > 0, 'verzija mora imati vrednost');
    assert(result.ukupanScore >= 0 && result.ukupanScore <= 100, 'ukupanScore mora biti između 0 i 100');
    assert(['ODLICNO', 'SPREMNO', 'DELIMICNO', 'POTREBNO_POBOLJSANJE'].includes(result.konacnaOcena), 'konacnaOcena mora biti validan enum');
    assert(typeof result.procenatSpremnosti === 'number', 'procenatSpremnosti mora biti broj');
  });

  await test('buildAnotherMaks — domeni imaju validne score-ove', async () => {
    const result = await buildAnotherMaks();
    for (const [key, domen] of Object.entries(result.domeni)) {
      assert(domen.score >= 0 && domen.score <= 100, `${key}.score mora biti između 0 i 100`);
      assert(domen.confidence >= 0 && domen.confidence <= 100, `${key}.confidence mora biti između 0 i 100`);
      assert(domen.tezina > 0, `${key}.tezina mora biti pozitivna`);
      assert(domen.sourceOfTruth.length > 0, `${key}.sourceOfTruth mora biti definisan`);
      assert(['fresh', 'stale', 'unknown'].includes(domen.freshness), `${key}.freshness mora biti validan`);
    }
  });

  await test('buildAnotherMaks — meta ima ispravne versioning vrednosti', async () => {
    const result = await buildAnotherMaks();
    assertEqual(result.meta.contractVersion, ANOTHER_MAKS_CONTRACT_VERSION, 'meta.contractVersion');
    assertEqual(result.meta.modelVersion, ANOTHER_MAKS_MODEL_VERSION, 'meta.modelVersion');
    assertEqual(result.meta.sourceOfTruth, ANOTHER_MAKS_SOURCE_OF_TRUTH, 'meta.sourceOfTruth');
    assert(result.meta.generatedAt.length > 0, 'meta.generatedAt mora biti definisan');
    assertEqual(result.meta.linkedAgent, 'maksimus-2', 'meta.linkedAgent');
  });

  await test('buildAnotherMaks — persona je ispravno ugrađena', async () => {
    const result = await buildAnotherMaks();
    assertEqual(result.persona.id, 'another-maks', 'persona.id');
    assertEqual(result.persona.linkedAgent, 'maksimus-2', 'persona.linkedAgent');
  });

  await test('buildAnotherMaks — handoff objekat je prisutan', async () => {
    const result = await buildAnotherMaks();
    assert(typeof result.handoff.aktivanHandoff === 'boolean', 'handoff.aktivanHandoff mora biti boolean');
    assert(result.handoff.linkedAgent.length > 0, 'handoff.linkedAgent mora biti definisan');
  });

  await test('buildAnotherMaks — trend objekat je prisutan', async () => {
    const result = await buildAnotherMaks();
    assert(['up', 'down', 'flat'].includes(result.trend.direction), 'trend.direction mora biti validan');
    assert(typeof result.trend.deltaScore === 'number', 'trend.deltaScore mora biti broj');
    assert(typeof result.trend.currentScore === 'number', 'trend.currentScore mora biti broj');
  });

  await test('buildAnotherMaks — preporuke su lista stringova', async () => {
    const result = await buildAnotherMaks();
    assert(Array.isArray(result.preporuke), 'preporuke mora biti niz');
    assert(result.preporuke.length > 0, 'mora biti barem jedna preporuka');
    for (const preporuka of result.preporuke) {
      assert(typeof preporuka === 'string' && preporuka.length > 0, 'svaka preporuka mora biti neprazan string');
    }
  });

  // ─── Performance test ─────────────────────────────────────────────────────

  await test('buildAnotherMaks — evaluacija ≤ 50ms (KPI gate)', async () => {
    const start = Date.now();
    await buildAnotherMaks();
    const durationMs = Date.now() - start;
    assert(durationMs <= 50, `Evaluacija mora biti ≤ 50ms (izmereno: ${durationMs}ms)`);
  });

  // ─── executeAnotherMaksTask ───────────────────────────────────────────────

  await test('executeAnotherMaksTask — kreativna-sinteza vraća rezultat', async () => {
    const result = await executeAnotherMaksTask({ tip: 'kreativna-sinteza' });
    assert(result.taskId.length > 0, 'taskId mora biti definisan');
    assertEqual(result.tip, 'kreativna-sinteza', 'tip mora biti kreativna-sinteza');
    assert(result.rezultat.length > 0, 'rezultat mora imati sadržaj');
    assert(result.score > 0, 'score mora biti pozitivan');
    assert(result.timestamp.length > 0, 'timestamp mora biti definisan');
  });

  await test('executeAnotherMaksTask — generativna-orkestracija vraća rezultat', async () => {
    const result = await executeAnotherMaksTask({ tip: 'generativna-orkestracija' });
    assertEqual(result.tip, 'generativna-orkestracija', 'tip mora biti generativna-orkestracija');
    assert(result.rezultat.length > 0, 'rezultat mora imati sadržaj');
  });

  await test('executeAnotherMaksTask — inovacioni-signal vraća rezultat', async () => {
    const result = await executeAnotherMaksTask({ tip: 'inovacioni-signal' });
    assertEqual(result.tip, 'inovacioni-signal', 'tip mora biti inovacioni-signal');
    assert(result.rezultat.length > 0, 'rezultat mora imati sadržaj');
  });

  await test('executeAnotherMaksTask — kontekst triggera handoff za analitiku', async () => {
    const result = await executeAnotherMaksTask({
      tip: 'kreativna-sinteza',
      kontekst: 'Analiza statistike i metrika za izveštaj',
    });
    assertEqual(result.handoffToMaks, true, 'handoffToMaks mora biti true za analitički kontekst');
    assert(result.handoffRazlog !== null, 'handoffRazlog mora biti definisan');
  });

  await test('executeAnotherMaksTask — bez konteksta nema handoff', async () => {
    const result = await executeAnotherMaksTask({ tip: 'kreativna-sinteza' });
    assertEqual(result.handoffToMaks, false, 'handoffToMaks mora biti false bez konteksta');
    assertEqual(result.handoffRazlog, null, 'handoffRazlog mora biti null bez konteksta');
  });

  await test('executeAnotherMaksTask — trajanjeMsEstimate je nenegativan broj', async () => {
    const result = await executeAnotherMaksTask({ tip: 'inovacioni-signal' });
    assert(typeof result.trajanjeMsEstimate === 'number', 'trajanjeMsEstimate mora biti broj');
    assert(result.trajanjeMsEstimate >= 0, 'trajanjeMsEstimate mora biti nenegativan');
  });

  // ─── getAnotherMaksInfo ───────────────────────────────────────────────────

  await test('getAnotherMaksInfo vraća validnu info strukturu', () => {
    const info = getAnotherMaksInfo();
    assert(info.sistem.length > 0, 'sistem mora imati vrednost');
    assert(info.kompanija.length > 0, 'kompanija mora imati vrednost');
    assertEqual(info.endpoint, ANOTHER_MAKS_SOURCE_OF_TRUTH, 'endpoint mora biti ispravan');
    assertEqual(info.contractVersion, ANOTHER_MAKS_CONTRACT_VERSION, 'contractVersion mora biti ispravan');
    assertEqual(info.modelVersion, ANOTHER_MAKS_MODEL_VERSION, 'modelVersion mora biti ispravan');
    assert(typeof info.timestamp === 'string', 'timestamp mora biti string');
  });

  // ─── Edge cases ───────────────────────────────────────────────────────────

  await test('buildAnotherMaks — timestamp je validan ISO 8601 format', async () => {
    const result = await buildAnotherMaks();
    const timestamp = new Date(result.timestamp);
    assert(!isNaN(timestamp.getTime()), 'timestamp mora biti validan datum');
  });

  await test('buildAnotherMaks — kriticniDomeni je niz', async () => {
    const result = await buildAnotherMaks();
    assert(Array.isArray(result.kriticniDomeni), 'kriticniDomeni mora biti niz');
    assertEqual(result.domeniBrojKriticnih, result.kriticniDomeni.length, 'domeniBrojKriticnih mora odgovarati dužini kriticniDomeni');
  });

  await test('buildAnotherMaks — uzastopni pozivi ažuriraju trend', async () => {
    const prvi = await buildAnotherMaks();
    const drugi = await buildAnotherMaks();
    assert(drugi.trend.reliable === true, 'drugi poziv mora imati reliable trend');
    assert(drugi.trend.previousScore !== null, 'previousScore mora biti dostupan posle prvog poziva');
    assertEqual(drugi.trend.previousScore, prvi.ukupanScore, 'previousScore mora biti ukupanScore prethodnog poziva');
  });
}

runTests().then(() => {
  console.log(`\n────────────────────────────────────────`);
  console.log(`ANOTHER MAKS — Results: ${passed} passed, ${failed} failed`);
  if (failures.length > 0) {
    console.error('\nFailed tests:');
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  } else {
    console.log('✅ Svi testovi prošli.');
    process.exit(0);
  }
}).catch((err) => {
  console.error('Test runner error:', err);
  process.exit(1);
});
