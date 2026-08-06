// SpajaUltraOmegaCore -∞Ω+∞ — TARKEN HINGIL EKOLAN MAKSIMUS Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  buildThem,
  executeThemTask,
  getThemInfo,
  getThemPersona,
  resolveHandoffTarget,
  THEM_CONTRACT_VERSION,
  THEM_MODEL_VERSION,
  THEM_SOURCE_OF_TRUTH,
  THEM_WEIGHTS,
  THEM_PERSONA,
  getThemLastSnapshot,
  setThemLastSnapshot,
  evaluateSystemState,
  computeEkolanScore,
  normalizeSignal,
  computeHingilScore,
  modelScenario,
  computeKonvergencijaScore,
  buildStrategyResult,
  executeHandoff,
  resolveFallbackAgent,
} from '../../lib/tarken-hingil-ekolan-maksimus';

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
  console.log('\n🤖 TARKEN HINGIL EKOLAN MAKSIMUS — test suite\n');

  // ─── Persona (Identity) ───────────────────────────────────────────────────

  await test('Persona ima ispravna id i naziv polja', () => {
    const persona = getThemPersona();
    assertEqual(persona.id, 'tarken-hingil-ekolan-maksimus', 'id');
    assert(persona.naziv.length > 0, 'naziv mora postojati');
    assertEqual(persona.specijalizacija, 'strateska-orkestracija', 'specijalizacija');
    assert(persona.linkedAgents.includes('another-maks'), 'linkedAgents mora sadržati another-maks');
    assert(persona.linkedAgents.includes('maksimus-2'), 'linkedAgents mora sadržati maksimus-2');
  });

  await test('THEM_PERSONA konstanta — octave i node su ispravni', () => {
    assertEqual(THEM_PERSONA.octave, 16, 'octave mora biti 16');
    assertEqual(THEM_PERSONA.hipermrezaNode, 256, 'hipermrezaNode mora biti 256');
    assertEqual(THEM_PERSONA.verzija, '1.0.0', 'verzija mora biti 1.0.0');
  });

  await test('Persona KPI vrednosti su u granicama', () => {
    const persona = getThemPersona();
    assert(persona.performanceKpi.evaluacijaMaxMs <= 50, 'evaluacijaMaxMs mora biti <= 50');
    assert(persona.performanceKpi.handoffMaxMs <= 100, 'handoffMaxMs mora biti <= 100');
    assertEqual(persona.performanceKpi.buildMaxMin, 3, 'buildMaxMin mora biti 3');
    assert(persona.performanceKpi.hipermrezaKonvergencija >= 0.95, 'hipermrezaKonvergencija mora biti >= 0.95');
    assertEqual(persona.performanceKpi.uptimeSla, '99.99%', 'uptimeSla');
  });

  await test('Persona ima opis sa sadržajem', () => {
    const persona = getThemPersona();
    assert(persona.opis.length > 20, 'opis mora imati sadržaj');
  });

  // ─── resolveHandoffTarget ─────────────────────────────────────────────────

  await test('resolveHandoffTarget — bez konteksta i targetAgent vraća false', () => {
    const result = resolveHandoffTarget(undefined);
    assertEqual(result.handoff, false, 'handoff bez konteksta');
    assertEqual(result.agent, null, 'agent mora biti null');
    assertEqual(result.razlog, null, 'razlog mora biti null');
  });

  await test('resolveHandoffTarget — eksplicitan targetAgent triggera handoff', () => {
    const result = resolveHandoffTarget(undefined, 'maksimus-2');
    assertEqual(result.handoff, true, 'handoff mora biti true za eksplicitni target');
    assertEqual(result.agent, 'maksimus-2', 'agent mora biti maksimus-2');
    assert(result.razlog !== null, 'razlog mora biti definisan');
  });

  await test('resolveHandoffTarget — analitički kontekst → maksimus-2', () => {
    const result = resolveHandoffTarget('Potrebna analiza metrika za Q3 izveštaj');
    assertEqual(result.handoff, true, 'handoff za analitički kontekst');
    assertEqual(result.agent, 'maksimus-2', 'agent mora biti maksimus-2');
  });

  await test('resolveHandoffTarget — kreativni kontekst → another-maks', () => {
    const result = resolveHandoffTarget('Generiši kreativnu kampanju za platformu');
    assertEqual(result.handoff, true, 'handoff za kreativni kontekst');
    assertEqual(result.agent, 'another-maks', 'agent mora biti another-maks');
  });

  await test('resolveHandoffTarget — neutralni kontekst → bez handoff', () => {
    const result = resolveHandoffTarget('Pokreni apex orkestraciju za sve node-ove');
    assertEqual(result.handoff, false, 'neutralni kontekst ne trigge handoff');
    assertEqual(result.agent, null, 'agent mora biti null');
  });

  // ─── THEM_WEIGHTS ─────────────────────────────────────────────────────────

  await test('THEM_WEIGHTS su normalizovani na 1.0', () => {
    const sum = Object.values(THEM_WEIGHTS).reduce((s, w) => s + w, 0);
    assert(Math.abs(sum - 1) < 0.0001, `Weight suma mora biti 1.0 (trenutno: ${sum})`);
  });

  await test('THEM_WEIGHTS ima sve ključeve', () => {
    assert('straskaOrkestracija' in THEM_WEIGHTS, 'straskaOrkestracija mora postojati');
    assert('adaptivniSignal' in THEM_WEIGHTS, 'adaptivniSignal mora postojati');
    assert('ekoskoMonitoring' in THEM_WEIGHTS, 'ekoskoMonitoring mora postojati');
    assert('industrijskaKonvergencija' in THEM_WEIGHTS, 'industrijskaKonvergencija mora postojati');
  });

  // ─── Store ────────────────────────────────────────────────────────────────

  await test('Store čuva i vraća snapshot (round-trip)', () => {
    const snapshot = {
      ukupanScore: 88,
      domenScores: {
        straskaOrkestracija: 90,
        adaptivniSignal: 85,
        ekoskoMonitoring: 88,
        industrijskaKonvergencija: 87,
      },
      timestamp: new Date().toISOString(),
    };
    setThemLastSnapshot(snapshot);
    const retrieved = getThemLastSnapshot();
    assert(retrieved !== null, 'snapshot mora biti sačuvan');
    assertEqual(retrieved.ukupanScore, 88, 'ukupanScore mora biti sačuvan');
    assertEqual(retrieved.domenScores.straskaOrkestracija, 90, 'straskaOrkestracija score');
  });

  // ─── Ekolan Engine ────────────────────────────────────────────────────────

  await test('evaluateSystemState vraća validnu strukturu', () => {
    const state = evaluateSystemState();
    assert(state.healthScore >= 0 && state.healthScore <= 100, 'healthScore mora biti 0–100');
    assert(state.entropyLevel >= 0 && state.entropyLevel <= 1, 'entropyLevel mora biti 0–1');
    assert(state.resourceUtilization >= 0 && state.resourceUtilization <= 1, 'resourceUtilization mora biti 0–1');
    assert(typeof state.anomalijaDetektovana === 'boolean', 'anomalijaDetektovana mora biti boolean');
    assert(Array.isArray(state.dijagnostikaLog), 'dijagnostikaLog mora biti niz');
    assert(state.dijagnostikaLog.length > 0, 'dijagnostikaLog mora imati bar jedan unos');
  });

  await test('computeEkolanScore vraća score između 0 i 100', () => {
    const state = evaluateSystemState();
    const score = computeEkolanScore(state);
    assert(score >= 0 && score <= 100, `ekolanScore mora biti 0–100, dobijeno: ${score}`);
  });

  await test('computeEkolanScore — zdravi sistem → visok score', () => {
    const healthyState = {
      healthScore: 95,
      entropyLevel: 0.05,
      resourceUtilization: 0.3,
      anomalijaDetektovana: false,
      dijagnostikaLog: ['Sistem stabilan.'],
    };
    const score = computeEkolanScore(healthyState);
    assert(score >= 70, `Zdravi sistem mora imati score >= 70, dobijeno: ${score}`);
  });

  await test('computeEkolanScore — degradirani sistem → niži score', () => {
    const degradedState = {
      healthScore: 30,
      entropyLevel: 0.9,
      resourceUtilization: 0.95,
      anomalijaDetektovana: true,
      dijagnostikaLog: ['Anomalija detektovana.'],
    };
    const score = computeEkolanScore(degradedState);
    assert(score < 50, `Degradirani sistem mora imati score < 50, dobijeno: ${score}`);
  });

  // ─── Hingil Signal ────────────────────────────────────────────────────────

  await test('normalizeSignal — normalni ulaz', () => {
    const result = normalizeSignal([0.5, 0.7, 0.9, 0.6, 0.8]);
    assertEqual(result.valid, true, 'valid mora biti true za normalni ulaz');
    assertEqual(result.errorReason, null, 'errorReason mora biti null');
    assert(result.normalized.length === 5, 'normalized mora imati isti broj elemenata');
    assert(result.normalized.every((n) => n >= 0 && n <= 1), 'svi normalized mora biti 0–1');
  });

  await test('normalizeSignal — prazan niz', () => {
    const result = normalizeSignal([]);
    assertEqual(result.valid, false, 'valid mora biti false za prazan niz');
    assert(result.errorReason !== null, 'errorReason mora biti definisan');
  });

  await test('normalizeSignal — NaN i Infinity se filtriraju', () => {
    const result = normalizeSignal([NaN, Infinity, -Infinity, 0.5, 0.8]);
    assertEqual(result.valid, true, 'valid mora biti true posle filtriranja NaN/Infinity');
    assert(result.normalized.every((n) => Number.isFinite(n)), 'normalized ne sme sadržati NaN/Infinity');
  });

  await test('normalizeSignal — svi NaN/Infinity → invalid', () => {
    const result = normalizeSignal([NaN, Infinity, -Infinity]);
    assertEqual(result.valid, false, 'valid mora biti false kada su svi uzorci NaN/Infinity');
  });

  await test('normalizeSignal — isti uzorci (nulti opseg) → 0.5', () => {
    const result = normalizeSignal([0.5, 0.5, 0.5]);
    assertEqual(result.valid, true, 'valid mora biti true');
    assert(result.normalized.every((n) => n === 0.5), 'svi normalized moraju biti 0.5 za isti ulaz');
  });

  await test('computeHingilScore — validan signal → score 0–100', () => {
    const result = normalizeSignal([0.6, 0.75, 0.82, 0.78, 0.91]);
    const score = computeHingilScore(result);
    assert(score >= 0 && score <= 100, `hingilScore mora biti 0–100, dobijeno: ${score}`);
  });

  await test('computeHingilScore — invalid signal → 40', () => {
    const result = normalizeSignal([]);
    const score = computeHingilScore(result);
    assertEqual(score, 40, 'invalid signal mora dati score 40');
  });

  // ─── Tarken Strategy ──────────────────────────────────────────────────────

  await test('modelScenario — zdravi sistem → expansion', () => {
    const scenario = modelScenario(95, 0.05);
    assertEqual(scenario, 'expansion', 'zdravi sistem mora biti expansion');
  });

  await test('modelScenario — umereni sistem → consolidation', () => {
    const scenario = modelScenario(75, 0.3);
    assertEqual(scenario, 'consolidation', 'umereni sistem mora biti consolidation');
  });

  await test('modelScenario — oslabljeni sistem → maintenance', () => {
    const scenario = modelScenario(55, 0.6);
    assertEqual(scenario, 'maintenance', 'oslabljeni sistem mora biti maintenance');
  });

  await test('modelScenario — kritični sistem → recovery', () => {
    const scenario = modelScenario(30, 0.85);
    assertEqual(scenario, 'recovery', 'kritični sistem mora biti recovery');
  });

  await test('computeKonvergencijaScore — vraća vrednost 0.0–1.0', () => {
    const score = computeKonvergencijaScore(92, 88, 85);
    assert(score >= 0 && score <= 1, `konvergencijaScore mora biti 0–1, dobijeno: ${score}`);
  });

  await test('computeKonvergencijaScore — zdravi ulazi → visoka konvergencija', () => {
    const score = computeKonvergencijaScore(95, 92, 90);
    assert(score >= 0.9, `visoki ulazi moraju dati visoku konvergenciju (>= 0.9), dobijeno: ${score}`);
  });

  await test('buildStrategyResult — expansion scenario ima preporuke', () => {
    const result = buildStrategyResult('expansion', 0.97);
    assertEqual(result.scenario, 'expansion', 'scenario mora biti expansion');
    assert(result.longHorizonPlanning.length > 0, 'mora biti barem jedan plan');
    assert(result.stratesePreporuke.length > 0, 'mora biti barem jedna preporuka');
    assert(result.industriesConverging.length > 0, 'mora biti barem jedna industrija');
  });

  await test('buildStrategyResult — recovery scenario preporučuje fallback', () => {
    const result = buildStrategyResult('recovery', 0.5);
    assert(
      result.stratesePreporuke.some((p) => p.toLowerCase().includes('maksimus') || p.toLowerCase().includes('fallback')),
      'recovery preporuke moraju pomenuti fallback ili maksimus',
    );
  });

  // ─── Handoff ──────────────────────────────────────────────────────────────

  await test('executeHandoff — maksimus-2 sa razlogom → initiated', () => {
    const result = executeHandoff({ targetAgent: 'maksimus-2', razlog: 'Analitički zadatak.' });
    assertEqual(result.status, 'initiated', 'status mora biti initiated');
    assertEqual(result.targetAgent, 'maksimus-2', 'targetAgent mora biti maksimus-2');
    assert(result.handoffId.length > 0, 'handoffId mora biti definisan');
  });

  await test('executeHandoff — another-maks sa razlogom → initiated', () => {
    const result = executeHandoff({ targetAgent: 'another-maks', razlog: 'Kreativni zadatak.' });
    assertEqual(result.status, 'initiated', 'status mora biti initiated');
  });

  await test('executeHandoff — nepodržani agent → failed', () => {
    const result = executeHandoff({ targetAgent: 'nepostojeci-agent' as 'maksimus-2', razlog: 'test' });
    assertEqual(result.status, 'failed', 'status mora biti failed za nepodržani agent');
  });

  await test('executeHandoff — prazan razlog → failed', () => {
    const result = executeHandoff({ targetAgent: 'maksimus-2', razlog: '' });
    assertEqual(result.status, 'failed', 'status mora biti failed za prazan razlog');
  });

  await test('resolveFallbackAgent — vraća maksimus-2 kao default', () => {
    const agent = resolveFallbackAgent(['Anomalija detektovana: zdravlje sistema opalo.']);
    assert(agent !== null, 'fallbackAgent mora biti definisan');
  });

  // ─── buildThem ────────────────────────────────────────────────────────────

  await test('buildThem vraća validnu strukturu', async () => {
    const result = await buildThem();
    assert(result.sistem.length > 0, 'sistem mora imati vrednost');
    assert(result.kompanija.length > 0, 'kompanija mora imati vrednost');
    assert(result.verzija.length > 0, 'verzija mora imati vrednost');
    assert(result.ukupanScore >= 0 && result.ukupanScore <= 100, 'ukupanScore mora biti 0–100');
    assert(['ODLICNO', 'SPREMNO', 'DELIMICNO', 'POTREBNO_POBOLJSANJE'].includes(result.konacnaOcena), 'konacnaOcena mora biti validan enum');
  });

  await test('buildThem — hipermrezaKonvergencija je u opsegu 0–1', async () => {
    const result = await buildThem();
    assert(result.hipermrezaKonvergencija >= 0 && result.hipermrezaKonvergencija <= 1, 'hipermrezaKonvergencija mora biti 0–1');
  });

  await test('buildThem — domeni imaju validne score-ove', async () => {
    const result = await buildThem();
    for (const [key, domen] of Object.entries(result.domeni)) {
      assert(domen.score >= 0 && domen.score <= 100, `${key}.score mora biti 0–100`);
      assert(domen.confidence >= 0 && domen.confidence <= 100, `${key}.confidence mora biti 0–100`);
      assert(domen.tezina > 0, `${key}.tezina mora biti pozitivna`);
      assert(domen.sourceOfTruth.length > 0, `${key}.sourceOfTruth mora biti definisan`);
      assert(['fresh', 'stale', 'unknown'].includes(domen.freshness), `${key}.freshness mora biti validan`);
    }
  });

  await test('buildThem — selfHealing objekat je prisutan', async () => {
    const result = await buildThem();
    assert(typeof result.selfHealing.anomalijaDetektovana === 'boolean', 'anomalijaDetektovana mora biti boolean');
    assert(Array.isArray(result.selfHealing.dijagnostikaLog), 'dijagnostikaLog mora biti niz');
  });

  await test('buildThem — handoff objekat je prisutan', async () => {
    const result = await buildThem();
    assert(typeof result.handoff.aktivanHandoff === 'boolean', 'aktivanHandoff mora biti boolean');
    assert(Array.isArray(result.handoff.linkedAgents), 'linkedAgents mora biti niz');
    assert(result.handoff.linkedAgents.length > 0, 'linkedAgents mora imati elemente');
  });

  await test('buildThem — meta ima ispravne versioning vrednosti', async () => {
    const result = await buildThem();
    assertEqual(result.meta.contractVersion, THEM_CONTRACT_VERSION, 'meta.contractVersion');
    assertEqual(result.meta.modelVersion, THEM_MODEL_VERSION, 'meta.modelVersion');
    assertEqual(result.meta.sourceOfTruth, THEM_SOURCE_OF_TRUTH, 'meta.sourceOfTruth');
    assert(result.meta.generatedAt.length > 0, 'meta.generatedAt mora biti definisan');
  });

  await test('buildThem — persona je ispravno ugrađena', async () => {
    const result = await buildThem();
    assertEqual(result.persona.id, 'tarken-hingil-ekolan-maksimus', 'persona.id');
    assertEqual(result.persona.octave, 16, 'persona.octave');
    assertEqual(result.persona.hipermrezaNode, 256, 'persona.hipermrezaNode');
  });

  await test('buildThem — preporuke su lista stringova', async () => {
    const result = await buildThem();
    assert(Array.isArray(result.preporuke), 'preporuke mora biti niz');
    assert(result.preporuke.length > 0, 'mora biti barem jedna preporuka');
    for (const p of result.preporuke) {
      assert(typeof p === 'string' && p.length > 0, 'svaka preporuka mora biti neprazan string');
    }
  });

  await test('buildThem — trend objekat je prisutan', async () => {
    const result = await buildThem();
    assert(['up', 'down', 'flat'].includes(result.trend.direction), 'trend.direction mora biti validan');
    assert(typeof result.trend.deltaScore === 'number', 'trend.deltaScore mora biti broj');
  });

  await test('buildThem — uzastopni pozivi ažuriraju trend', async () => {
    const prvi = await buildThem();
    const drugi = await buildThem();
    assert(drugi.trend.reliable === true, 'drugi poziv mora imati reliable trend');
    assertEqual(drugi.trend.previousScore, prvi.ukupanScore, 'previousScore mora biti ukupanScore prethodnog poziva');
  });

  // ─── Performance KPI gate ─────────────────────────────────────────────────

  await test('buildThem — evaluacija ≤ 50ms (KPI gate)', async () => {
    const start = Date.now();
    await buildThem();
    const durationMs = Date.now() - start;
    assert(durationMs <= 50, `Evaluacija mora biti ≤ 50ms (izmereno: ${durationMs}ms)`);
  });

  // ─── executeThemTask ──────────────────────────────────────────────────────

  await test('executeThemTask — strateska-orkestracija vraća rezultat', async () => {
    const result = await executeThemTask({ tip: 'strateska-orkestracija' });
    assert(result.taskId.startsWith('them-'), 'taskId mora počinjati sa them-');
    assertEqual(result.tip, 'strateska-orkestracija', 'tip mora biti strateska-orkestracija');
    assert(result.rezultat.length > 0, 'rezultat mora imati sadržaj');
    assert(result.score > 0, 'score mora biti pozitivan');
    assert(result.hipermrezaKonvergencija >= 0 && result.hipermrezaKonvergencija <= 1, 'hipermrezaKonvergencija mora biti 0–1');
  });

  await test('executeThemTask — adaptivni-signal vraća rezultat', async () => {
    const result = await executeThemTask({ tip: 'adaptivni-signal' });
    assertEqual(result.tip, 'adaptivni-signal', 'tip mora biti adaptivni-signal');
    assert(result.rezultat.length > 0, 'rezultat mora imati sadržaj');
  });

  await test('executeThemTask — ekoloski-monitoring vraća rezultat', async () => {
    const result = await executeThemTask({ tip: 'ekoloski-monitoring' });
    assertEqual(result.tip, 'ekoloski-monitoring', 'tip mora biti ekoloski-monitoring');
  });

  await test('executeThemTask — industrijska-konvergencija vraća rezultat', async () => {
    const result = await executeThemTask({ tip: 'industrijska-konvergencija' });
    assertEqual(result.tip, 'industrijska-konvergencija', 'tip mora biti industrijska-konvergencija');
  });

  await test('executeThemTask — kontekst sa analizom triggera handoff na maksimus-2', async () => {
    const result = await executeThemTask({
      tip: 'strateska-orkestracija',
      kontekst: 'Analiza statistike i metrika za Q4',
    });
    assertEqual(result.handoffToAgent, 'maksimus-2', 'handoffToAgent mora biti maksimus-2');
    assert(result.handoffRazlog !== null, 'handoffRazlog mora biti definisan');
  });

  await test('executeThemTask — bez konteksta → bez handoff', async () => {
    const result = await executeThemTask({ tip: 'strateska-orkestracija' });
    assertEqual(result.handoffToAgent, null, 'bez konteksta nema handoff');
  });

  await test('executeThemTask — trajanjeMsEstimate je nenegativan', async () => {
    const result = await executeThemTask({ tip: 'industrijska-konvergencija' });
    assert(typeof result.trajanjeMsEstimate === 'number', 'trajanjeMsEstimate mora biti broj');
    assert(result.trajanjeMsEstimate >= 0, 'trajanjeMsEstimate mora biti nenegativan');
  });

  // ─── getThemInfo ──────────────────────────────────────────────────────────

  await test('getThemInfo vraća validnu info strukturu', () => {
    const info = getThemInfo();
    assert(info.sistem.length > 0, 'sistem mora imati vrednost');
    assert(info.kompanija.length > 0, 'kompanija mora imati vrednost');
    assertEqual(info.endpoint, THEM_SOURCE_OF_TRUTH, 'endpoint mora biti ispravan');
    assertEqual(info.contractVersion, THEM_CONTRACT_VERSION, 'contractVersion mora biti ispravan');
    assertEqual(info.modelVersion, THEM_MODEL_VERSION, 'modelVersion mora biti ispravan');
    assert(typeof info.timestamp === 'string', 'timestamp mora biti string');
  });

  // ─── Edge cases ───────────────────────────────────────────────────────────

  await test('buildThem — timestamp je validan ISO 8601 format', async () => {
    const result = await buildThem();
    const ts = new Date(result.timestamp);
    assert(!isNaN(ts.getTime()), 'timestamp mora biti validan datum');
  });

  await test('buildThem — kriticniDomeni je niz koji odgovara domeniBrojKriticnih', async () => {
    const result = await buildThem();
    assert(Array.isArray(result.kriticniDomeni), 'kriticniDomeni mora biti niz');
    assertEqual(result.domeniBrojKriticnih, result.kriticniDomeni.length, 'domeniBrojKriticnih mora odgovarati dužini');
  });
}

runTests().then(() => {
  console.log(`\n────────────────────────────────────────`);
  console.log(`TARKEN HINGIL EKOLAN MAKSIMUS — Results: ${passed} passed, ${failed} failed`);
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
