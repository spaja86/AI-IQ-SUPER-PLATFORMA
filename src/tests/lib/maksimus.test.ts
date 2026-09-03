// SpajaUltraOmegaCore -∞Ω+∞ — MAKSIMUS Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  buildMaksimus,
  executeMaksimусTask,
  getMaksimусInfo,
  getMaksimусPersona,
  shouldHandoffToAnotherMaks,
  MAKSIMUS_CONTRACT_VERSION,
  MAKSIMUS_MODEL_VERSION,
  MAKSIMUS_SOURCE_OF_TRUTH,
  MAKSIMUS_WEIGHTS,
  MAKSIMUS_PERSONA,
} from '../../lib/maksimus';
import { getMaksimусLastSnapshot, setMaksimусLastSnapshot } from '../../lib/maksimus/store';
import { initiateMaksimусHandoff } from '../../lib/maksimus/handoff';

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
  console.log('\n🤖 MAKSIMUS — test suite\n');

  // ─── Persona / Identity validacija ────────────────────────────────────────

  await test('Persona ima ispravna id i naziv polja', () => {
    const persona = getMaksimусPersona();
    assertEqual(persona.id, 'maksimus', 'id');
    assert(persona.naziv.length > 0, 'naziv mora postojati');
    assert(persona.specijalizacija === 'analiticka-orkestracija', 'specijalizacija mora biti analiticka-orkestracija');
    assertEqual(persona.linkedAgent, 'another-maks', 'linkedAgent');
  });

  await test('MAKSIMUS_PERSONA konstanta je ispravna', () => {
    assertEqual(MAKSIMUS_PERSONA.id, 'maksimus', 'PERSONA.id');
    assertEqual(MAKSIMUS_PERSONA.verzija, '1.0.0', 'PERSONA.verzija');
    assert(MAKSIMUS_PERSONA.performanceKpi.evaluacijaMaxMs <= 50, 'evaluacijaMaxMs mora biti <= 50');
    assertEqual(MAKSIMUS_PERSONA.performanceKpi.buildMaxMin, 3, 'buildMaxMin mora biti 3');
    assertEqual(MAKSIMUS_PERSONA.performanceKpi.uptimeSla, '99.99%', 'uptimeSla');
  });

  await test('Persona ima ispravnu hipermreza konfiguraciju', () => {
    const persona = getMaksimусPersona();
    assertEqual(persona.octave, 13, 'octave mora biti 13');
    assertEqual(persona.hipermrezaNode, 128, 'hipermrezaNode mora biti 128');
  });

  await test('Persona ima opis i validne KPI vrednosti', () => {
    const persona = getMaksimусPersona();
    assert(persona.opis.length > 20, 'opis mora imati sadržaj');
    assert(persona.performanceKpi.evaluacijaMaxMs > 0, 'evaluacijaMaxMs mora biti pozitivan');
    assert(persona.performanceKpi.buildMaxMin > 0, 'buildMaxMin mora biti pozitivan');
    assert(persona.performanceKpi.uptimeSla.length > 0, 'uptimeSla mora biti definisan');
  });

  // ─── Handoff logika ────────────────────────────────────────────────────────

  await test('shouldHandoffToAnotherMaks — bez konteksta vraća false', () => {
    const result = shouldHandoffToAnotherMaks(undefined);
    assertEqual(result.handoff, false, 'handoff bez konteksta');
    assertEqual(result.razlog, null, 'razlog bez konteksta');
  });

  await test('shouldHandoffToAnotherMaks — kreativni kontekst triggera handoff', () => {
    const result = shouldHandoffToAnotherMaks('Potrebna kreativna sinteza za novu kampanju');
    assertEqual(result.handoff, true, 'handoff za kreativni kontekst');
    assert(result.razlog !== null && result.razlog.length > 0, 'razlog mora biti definisan za handoff');
  });

  await test('shouldHandoffToAnotherMaks — analitički kontekst ne triggera handoff', () => {
    const result = shouldHandoffToAnotherMaks('Analiza metrika i KPI praćenje za Q3');
    assertEqual(result.handoff, false, 'ne sme biti handoff za analitički kontekst');
    assertEqual(result.razlog, null, 'razlog mora biti null za analitički kontekst');
  });

  await test('shouldHandoffToAnotherMaks — prazni string ne triggera handoff', () => {
    const result = shouldHandoffToAnotherMaks('');
    assertEqual(result.handoff, false, 'prazan string ne sme triggerovati handoff');
  });

  // ─── Weight normalizacija ──────────────────────────────────────────────────

  await test('MAKSIMUS_WEIGHTS su normalizovani na 1.0', () => {
    const sum = Object.values(MAKSIMUS_WEIGHTS).reduce((s, w) => s + w, 0);
    assert(Math.abs(sum - 1) < 0.0001, `Weight suma mora biti 1.0 (trenutno: ${sum})`);
  });

  await test('MAKSIMUS_WEIGHTS ima ispravne ključeve', () => {
    assert('analitickaOrkestracija' in MAKSIMUS_WEIGHTS, 'analitickaOrkestracija mora postojati');
    assert('razvojnaStrategija' in MAKSIMUS_WEIGHTS, 'razvojnaStrategija mora postojati');
    assert('platformaKoordinacija' in MAKSIMUS_WEIGHTS, 'platformaKoordinacija mora postojati');
    assert('novaGeneracijaSync' in MAKSIMUS_WEIGHTS, 'novaGeneracijaSync mora postojati');
    assert('extrimliExtended' in MAKSIMUS_WEIGHTS, 'extrimliExtended mora postojati');
  });

  // ─── Store ────────────────────────────────────────────────────────────────

  await test('Store čuva i vraća snapshot (set/get round-trip)', () => {
    const snapshot = {
      ukupanScore: 0,
      domenScores: {
        analitickaOrkestracija: 0,
        razvojnaStrategija: 0,
        platformaKoordinacija: 0,
        novaGeneracijaSync: 0,
        extrimliExtended: 0,
      },
      timestamp: new Date().toISOString(),
    };
    setMaksimусLastSnapshot(snapshot);
    const snap = getMaksimусLastSnapshot();
    assert(snap !== null, 'store mora biti postavljen posle set');
  });

  await test('Store čuva i vraća snapshot sa vrednostima', () => {
    const snapshot = {
      ukupanScore: 87,
      domenScores: {
        analitickaOrkestracija: 87,
        razvojnaStrategija: 83,
        platformaKoordinacija: 90,
        novaGeneracijaSync: 85,
        extrimliExtended: 82,
      },
      timestamp: new Date().toISOString(),
    };
    setMaksimусLastSnapshot(snapshot);
    const retrieved = getMaksimусLastSnapshot();
    assert(retrieved !== null, 'snapshot mora biti sačuvan');
    assertEqual(retrieved.ukupanScore, 87, 'ukupanScore mora biti sačuvan');
    assertEqual(retrieved.domenScores.analitickaOrkestracija, 87, 'analitickaOrkestracija score');
    assertEqual(retrieved.domenScores.platformaKoordinacija, 90, 'platformaKoordinacija score');
    assertEqual(retrieved.domenScores.extrimliExtended, 82, 'extrimliExtended score');
  });

  // ─── buildMaksimus ────────────────────────────────────────────────────────

  await test('buildMaksimus vraća validnu strukturu', async () => {
    const result = await buildMaksimus();
    assert(result.sistem.length > 0, 'sistem mora imati vrednost');
    assert(result.kompanija.length > 0, 'kompanija mora imati vrednost');
    assert(result.verzija.length > 0, 'verzija mora imati vrednost');
    assert(result.ukupanScore >= 0 && result.ukupanScore <= 100, 'ukupanScore mora biti između 0 i 100');
    assert(['ODLICNO', 'SPREMNO', 'DELIMICNO', 'POTREBNO_POBOLJSANJE'].includes(result.konacnaOcena), 'konacnaOcena mora biti validan enum');
    assert(typeof result.procenatSpremnosti === 'number', 'procenatSpremnosti mora biti broj');
  });

  await test('buildMaksimus — domeni imaju validne score-ove', async () => {
    const result = await buildMaksimus();
    for (const [key, domen] of Object.entries(result.domeni)) {
      assert(domen.score >= 0 && domen.score <= 100, `${key}.score mora biti između 0 i 100`);
      assert(domen.confidence >= 0 && domen.confidence <= 100, `${key}.confidence mora biti između 0 i 100`);
      assert(domen.tezina > 0, `${key}.tezina mora biti pozitivna`);
      assert(domen.sourceOfTruth.length > 0, `${key}.sourceOfTruth mora biti definisan`);
      assert(['fresh', 'stale', 'unknown'].includes(domen.freshness), `${key}.freshness mora biti validan`);
    }
  });

  await test('buildMaksimus — meta ima ispravne versioning vrednosti', async () => {
    const result = await buildMaksimus();
    assertEqual(result.meta.contractVersion, MAKSIMUS_CONTRACT_VERSION, 'meta.contractVersion');
    assertEqual(result.meta.modelVersion, MAKSIMUS_MODEL_VERSION, 'meta.modelVersion');
    assertEqual(result.meta.sourceOfTruth, MAKSIMUS_SOURCE_OF_TRUTH, 'meta.sourceOfTruth');
    assert(result.meta.generatedAt.length > 0, 'meta.generatedAt mora biti definisan');
    assertEqual(result.meta.linkedAgent, 'another-maks', 'meta.linkedAgent');
    assertEqual(result.meta.octave, 13, 'meta.octave mora biti 13');
    assertEqual(result.meta.hipermrezaNode, 128, 'meta.hipermrezaNode mora biti 128');
  });

  await test('buildMaksimus — persona je ispravno ugrađena', async () => {
    const result = await buildMaksimus();
    assertEqual(result.persona.id, 'maksimus', 'persona.id');
    assertEqual(result.persona.linkedAgent, 'another-maks', 'persona.linkedAgent');
    assertEqual(result.persona.octave, 13, 'persona.octave');
    assertEqual(result.persona.hipermrezaNode, 128, 'persona.hipermrezaNode');
  });

  await test('buildMaksimus — handoff objekat je prisutan', async () => {
    const result = await buildMaksimus();
    assert(typeof result.handoff.aktivanHandoff === 'boolean', 'handoff.aktivanHandoff mora biti boolean');
    assert(result.handoff.linkedAgent.length > 0, 'handoff.linkedAgent mora biti definisan');
  });

  await test('buildMaksimus — trend objekat je prisutan', async () => {
    const result = await buildMaksimus();
    assert(['up', 'down', 'flat'].includes(result.trend.direction), 'trend.direction mora biti validan');
    assert(typeof result.trend.deltaScore === 'number', 'trend.deltaScore mora biti broj');
    assert(typeof result.trend.currentScore === 'number', 'trend.currentScore mora biti broj');
  });

  await test('buildMaksimus — preporuke su lista stringova', async () => {
    const result = await buildMaksimus();
    assert(Array.isArray(result.preporuke), 'preporuke mora biti niz');
    assert(result.preporuke.length > 0, 'mora biti barem jedna preporuka');
    for (const preporuka of result.preporuke) {
      assert(typeof preporuka === 'string' && preporuka.length > 0, 'svaka preporuka mora biti neprazan string');
    }
  });

  await test('buildMaksimus — EXTRIMLI integracija vraća realne signale', async () => {
    const result = await buildMaksimus();
    assert(result.domeni.extrimliExtended.score >= 0 && result.domeni.extrimliExtended.score <= 100, 'extrimliExtended score mora biti između 0 i 100');
    assert(result.extrimliIntegracija.sourceOfTruth === '/api/extrimli/extendol', 'sourceOfTruth mora biti /api/extrimli/extendol');
    assert(Number.isFinite(result.extrimliIntegracija.unifiedReadinessScore), 'unifiedReadinessScore mora biti konačan broj');
    assert(typeof result.extrimliIntegracija.maxFunctionalityForAll === 'boolean', 'maxFunctionalityForAll mora biti boolean');
  });

  // ─── Performance test ─────────────────────────────────────────────────────

  await test('buildMaksimus — evaluacija ≤ 50ms (KPI gate)', async () => {
    const start = Date.now();
    await buildMaksimus();
    const durationMs = Date.now() - start;
    assert(durationMs <= 50, `Evaluacija mora biti ≤ 50ms (izmereno: ${durationMs}ms)`);
  });

  // ─── executeMaksimусTask ──────────────────────────────────────────────────

  await test('executeMaksimусTask — analiticka-orkestracija vraća rezultat', async () => {
    const result = await executeMaksimусTask({ tip: 'analiticka-orkestracija' });
    assert(result.taskId.length > 0, 'taskId mora biti definisan');
    assertEqual(result.tip, 'analiticka-orkestracija', 'tip mora biti analiticka-orkestracija');
    assert(result.rezultat.length > 0, 'rezultat mora imati sadržaj');
    assert(result.score > 0, 'score mora biti pozitivan');
    assert(result.timestamp.length > 0, 'timestamp mora biti definisan');
  });

  await test('executeMaksimусTask — razvojna-strategija vraća rezultat', async () => {
    const result = await executeMaksimусTask({ tip: 'razvojna-strategija' });
    assertEqual(result.tip, 'razvojna-strategija', 'tip mora biti razvojna-strategija');
    assert(result.rezultat.length > 0, 'rezultat mora imati sadržaj');
  });

  await test('executeMaksimусTask — platforma-koordinacija vraća rezultat', async () => {
    const result = await executeMaksimусTask({ tip: 'platforma-koordinacija' });
    assertEqual(result.tip, 'platforma-koordinacija', 'tip mora biti platforma-koordinacija');
    assert(result.rezultat.length > 0, 'rezultat mora imati sadržaj');
  });

  await test('executeMaksimусTask — kreativni kontekst triggera handoff', async () => {
    const result = await executeMaksimусTask({
      tip: 'analiticka-orkestracija',
      kontekst: 'Kreativna sinteza i generativne ideje za kampanju',
    });
    assertEqual(result.handoffToAnotherMaks, true, 'handoffToAnotherMaks mora biti true za kreativni kontekst');
    assert(result.handoffRazlog !== null, 'handoffRazlog mora biti definisan');
  });

  await test('executeMaksimусTask — bez konteksta nema handoff', async () => {
    const result = await executeMaksimусTask({ tip: 'analiticka-orkestracija' });
    assertEqual(result.handoffToAnotherMaks, false, 'handoffToAnotherMaks mora biti false bez konteksta');
    assertEqual(result.handoffRazlog, null, 'handoffRazlog mora biti null bez konteksta');
  });

  await test('executeMaksimусTask — trajanjeMsEstimate je nenegativan broj', async () => {
    const result = await executeMaksimусTask({ tip: 'platforma-koordinacija' });
    assert(typeof result.trajanjeMsEstimate === 'number', 'trajanjeMsEstimate mora biti broj');
    assert(result.trajanjeMsEstimate >= 0, 'trajanjeMsEstimate mora biti nenegativan');
  });

  // ─── getMaksimусInfo ──────────────────────────────────────────────────────

  await test('getMaksimусInfo vraća validnu info strukturu', () => {
    const info = getMaksimусInfo();
    assert(info.sistem.length > 0, 'sistem mora imati vrednost');
    assert(info.kompanija.length > 0, 'kompanija mora imati vrednost');
    assertEqual(info.endpoint, MAKSIMUS_SOURCE_OF_TRUTH, 'endpoint mora biti ispravan');
    assertEqual(info.contractVersion, MAKSIMUS_CONTRACT_VERSION, 'contractVersion mora biti ispravan');
    assertEqual(info.modelVersion, MAKSIMUS_MODEL_VERSION, 'modelVersion mora biti ispravan');
    assert(typeof info.timestamp === 'string', 'timestamp mora biti string');
  });

  // ─── Handoff engine ───────────────────────────────────────────────────────

  await test('initiateMaksimусHandoff — another-maks je prihvaćen target', async () => {
    const result = await initiateMaksimусHandoff({
      sourceAgent: 'maksimus',
      targetAgent: 'another-maks',
      kontekst: 'Kreativni zadatak',
      prioritet: 'visok',
      timestamp: new Date().toISOString(),
    });
    assertEqual(result.accepted, true, 'another-maks mora biti prihvaćen target');
    assert(result.handoffId.length > 0, 'handoffId mora biti definisan');
    assertEqual(result.targetAgent, 'another-maks', 'targetAgent mora biti another-maks');
  });

  await test('initiateMaksimусHandoff — nepoznati target se odbija', async () => {
    const result = await initiateMaksimусHandoff({
      sourceAgent: 'maksimus',
      targetAgent: 'nepoznati-agent-xyz',
      kontekst: 'Test',
      prioritet: 'nizak',
      timestamp: new Date().toISOString(),
    });
    assertEqual(result.accepted, false, 'nepoznati agent mora biti odbijen');
    assert(result.razlog.length > 0, 'razlog mora biti definisan za odbijanje');
  });

  await test('initiateMaksimусHandoff — nova-generacija-agent je prihvaćen target', async () => {
    const result = await initiateMaksimусHandoff({
      sourceAgent: 'maksimus',
      targetAgent: 'nova-generacija-agent',
      kontekst: 'Feature flags sync',
      prioritet: 'srednji',
      timestamp: new Date().toISOString(),
    });
    assertEqual(result.accepted, true, 'nova-generacija-agent mora biti prihvaćen target');
  });

  // ─── Edge cases ───────────────────────────────────────────────────────────

  await test('buildMaksimus — timestamp je validan ISO 8601 format', async () => {
    const result = await buildMaksimus();
    const timestamp = new Date(result.timestamp);
    assert(!isNaN(timestamp.getTime()), 'timestamp mora biti validan datum');
  });

  await test('buildMaksimus — kriticniDomeni je niz', async () => {
    const result = await buildMaksimus();
    assert(Array.isArray(result.kriticniDomeni), 'kriticniDomeni mora biti niz');
    assertEqual(result.domeniBrojKriticnih, result.kriticniDomeni.length, 'domeniBrojKriticnih mora odgovarati dužini kriticniDomeni');
  });

  await test('buildMaksimus — uzastopni pozivi ažuriraju trend', async () => {
    const prvi = await buildMaksimus();
    const drugi = await buildMaksimus();
    assert(drugi.trend.reliable === true, 'drugi poziv mora imati reliable trend');
    assert(drugi.trend.previousScore !== null, 'previousScore mora biti dostupan posle prvog poziva');
    assertEqual(drugi.trend.previousScore, prvi.ukupanScore, 'previousScore mora biti ukupanScore prethodnog poziva');
  });

  await test('buildMaksimus — NaN/Infinity edge case: score ostaje u [0, 100]', async () => {
    const result = await buildMaksimus();
    assert(Number.isFinite(result.ukupanScore), 'ukupanScore mora biti konačan broj');
    assert(result.ukupanScore >= 0 && result.ukupanScore <= 100, 'ukupanScore mora biti u opsegu [0, 100]');
  });
}

runTests().then(() => {
  console.log(`\n────────────────────────────────────────`);
  console.log(`MAKSIMUS — Results: ${passed} passed, ${failed} failed`);
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
