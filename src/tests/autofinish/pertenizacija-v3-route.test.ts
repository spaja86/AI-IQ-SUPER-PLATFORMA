// Autofinish #1423 — PERTENIZACIJA 3 (Personalization v3) Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/pertenizacija-v3-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import {
  buildPersonalizationProfileV3,
  computePersonalizationSignalsV3,
  mergePersonalizationIntoPrompt,
  applyAdaptivePreferenceUpdate,
  buildExplainabilityPayloadV3,
  isPersonalizationV3Enabled,
  type ProfileV3Input,
} from '../../lib/personalizacija/engine-v3';
import {
  buildPersonalizationProfile,
  computePersonalizationSignals,
  applyStablePreferenceUpdate,
  buildExplainabilityPayload,
  isPersonalizationV2Enabled,
} from '../../lib/personalizacija/engine-v2';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

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
    throw new Error(
      `${label ?? 'assertEqual'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
    );
  }
}

const BASE_PROFILE_V3: ProfileV3Input = {
  custom_instructions: null,
  memory: null,
  preferred_model: 'gpt-4o-mini',
  preferred_language: 'sr',
  personalization_version: 'v3',
  stable_preferences: null,
  contextual_preferences: null,
  personalization_confidence: 0.8,
  personalization_updated_at: '2026-06-03T00:00:00Z',
  personalization_enabled: true,
  personalization_opt_out: false,
  adaptive_preferences: null,
  personalization_feedback: null,
  personalization_v3_score: 0,
};

async function runTests(): Promise<void> {
  console.log('\n🏁 PERTENIZACIJA 3 — Personalization v3 Coverage Test Suite (#1423)\n');

  // ── File structure checks ──────────────────────────────────────────
  await test('engine-v3.ts postoji', () => {
    const p = path.resolve(process.cwd(), 'src/lib/personalizacija/engine-v3.ts');
    assert(fs.existsSync(p), `${p} ne postoji`);
  });

  await test('engine-v2.ts postoji (compat check)', () => {
    const p = path.resolve(process.cwd(), 'src/lib/personalizacija/engine-v2.ts');
    assert(fs.existsSync(p), `${p} ne postoji`);
  });

  await test('DB migracija 017 postoji', () => {
    const p = path.resolve(process.cwd(), 'supabase/migrations/017_pertenizacija_v3.sql');
    assert(fs.existsSync(p), `${p} ne postoji`);
  });

  await test('DB migracija 017 sadrži ispravne kolone', () => {
    const p = path.resolve(process.cwd(), 'supabase/migrations/017_pertenizacija_v3.sql');
    const src = fs.readFileSync(p, 'utf8');
    assert(src.includes('adaptive_preferences'), 'Nedostaje adaptive_preferences');
    assert(src.includes('personalization_feedback'), 'Nedostaje personalization_feedback');
    assert(src.includes('personalization_v3_score'), 'Nedostaje personalization_v3_score');
  });

  await test('Settings ruta proširena sa v3 poljima', () => {
    const p = path.resolve(process.cwd(), 'src/app/api/spaja-pro/settings/route.ts');
    const src = fs.readFileSync(p, 'utf8');
    assert(src.includes('adaptivePreferences'), 'Nedostaje adaptivePreferences');
    assert(src.includes('resetPersonalizationV3'), 'Nedostaje resetPersonalizationV3');
    assert(src.includes('applyAdaptivePreferenceUpdate'), 'Nedostaje applyAdaptivePreferenceUpdate');
    assert(src.includes('buildExplainabilityPayloadV3'), 'Nedostaje buildExplainabilityPayloadV3');
    assert(src.includes('personalizacijaV3'), 'Nedostaje personalizacijaV3 u response');
    assert(src.includes("'v3'"), "Nedostaje 'v3' u personalizationVersion tipu");
  });

  await test('Chat ruta koristi v3 engine', () => {
    const p = path.resolve(process.cwd(), 'src/app/api/spaja-pro/chat/route.ts');
    const src = fs.readFileSync(p, 'utf8');
    assert(src.includes('buildPersonalizationProfileV3'), 'Nedostaje buildPersonalizationProfileV3');
    assert(src.includes('computePersonalizationSignalsV3'), 'Nedostaje computePersonalizationSignalsV3');
    assert(src.includes('isPersonalizationV3Enabled'), 'Nedostaje isPersonalizationV3Enabled');
    assert(src.includes('adaptive_preferences'), 'Nedostaje adaptive_preferences u profile select');
  });

  await test('Explain ruta podržava v3', () => {
    const p = path.resolve(process.cwd(), 'src/app/api/spaja-pro/personalizacija-explain/route.ts');
    assert(fs.existsSync(p), `${p} ne postoji`);
    const src = fs.readFileSync(p, 'utf8');
    assert(src.includes('buildExplainabilityPayloadV3'), 'Nedostaje buildExplainabilityPayloadV3');
    assert(src.includes('isPersonalizationV3Enabled'), 'Nedostaje isPersonalizationV3Enabled');
  });

  await test('Metrics ruta sadrži v3 personalizacione metrike', () => {
    const p = path.resolve(process.cwd(), 'src/app/api/spaja-baza-knowledge/metrics/route.ts');
    const src = fs.readFileSync(p, 'utf8');
    assert(src.includes('v3AdoptionCount'), 'Nedostaje v3AdoptionCount');
    assert(src.includes('v3AdoptionRate'), 'Nedostaje v3AdoptionRate');
    assert(src.includes('averageV3Score'), 'Nedostaje averageV3Score');
    assert(src.includes('personalization_v3_score'), 'Nedostaje personalization_v3_score u select');
  });

  await test('ADR-PERTENIZACIJA-3.md postoji', () => {
    const p = path.resolve(process.cwd(), 'docs/ADR-PERTENIZACIJA-3.md');
    assert(fs.existsSync(p), `${p} ne postoji`);
  });

  await test('Runbook sadrži PERTENIZACIJA 3 sekciju', () => {
    const p = path.resolve(process.cwd(), 'docs/SPAJA-BAZA-RUNBOOK.md');
    const src = fs.readFileSync(p, 'utf8');
    assert(src.includes('PERTENIZACIJA 3'), 'Nedostaje PERTENIZACIJA 3 u runbooku');
    assert(src.includes('PERSONALIZATION_V3_ENABLED'), 'Nedostaje kill-switch dokumentacija');
    assert(src.includes('resetPersonalizationV3'), 'Nedostaje resetPersonalizationV3');
  });

  await test('Konstante su ažurirane', () => {
    assert(/^\d+\.\d+\.\d+$/.test(APP_VERSION), 'APP_VERSION semver format');
    assert(AUTOFINISH_COUNT >= 1423, 'AUTOFINISH_COUNT baseline 1423');
  });

  // ── Engine v3 unit tests ──────────────────────────────────────────

  await test('buildPersonalizationProfileV3 — default values za prazan profil', () => {
    const p = buildPersonalizationProfileV3('u1', BASE_PROFILE_V3);
    assertEqual(p.version, 'v3', 'version');
    assertEqual(p.userId, 'u1', 'userId');
    assert(typeof p.v3Score === 'number', 'v3Score is number');
    assert(p.v3Score >= 0 && p.v3Score <= 1, 'v3Score in [0,1]');
    assert(typeof p.adaptive.topicWeights === 'object', 'topicWeights is object');
    assertEqual(p.adaptive.sessionCount, 0, 'sessionCount default 0');
    assertEqual(p.feedback.positiveCount, 0, 'positiveCount default 0');
  });

  await test('buildPersonalizationProfileV3 — v3Score > 0 za high confidence', () => {
    const p = buildPersonalizationProfileV3('u2', {
      ...BASE_PROFILE_V3,
      personalization_confidence: 1,
      adaptive_preferences: { topicWeights: { AI: 0.9, TS: 0.8 }, sessionCount: 10, sessionTempo: 'deep', lastAdaptedAt: null },
      personalization_feedback: { positiveCount: 8, negativeCount: 2, lastFeedbackAt: null },
    });
    assert(p.v3Score > 0.5, `v3Score treba biti > 0.5, je ${p.v3Score}`);
  });

  await test('computePersonalizationSignalsV3 — vraća prazne signale za opt-out', () => {
    const profile = buildPersonalizationProfileV3('u3', {
      ...BASE_PROFILE_V3,
      personalization_opt_out: true,
    });
    const signals = computePersonalizationSignalsV3(profile);
    assertEqual(signals.systemPromptInjection, '', 'systemPromptInjection prazno za opt-out');
    assertEqual(signals.routingHint.preferredModel, null, 'preferredModel null');
  });

  await test('computePersonalizationSignalsV3 — vraća prazne signale za disabled', () => {
    const profile = buildPersonalizationProfileV3('u4', {
      ...BASE_PROFILE_V3,
      personalization_enabled: false,
    });
    const signals = computePersonalizationSignalsV3(profile);
    assertEqual(signals.systemPromptInjection, '', 'systemPromptInjection prazno za disabled');
  });

  await test('computePersonalizationSignalsV3 — fallback na v2 za v2 profil', () => {
    const profile = buildPersonalizationProfileV3('u5', {
      ...BASE_PROFILE_V3,
      personalization_version: 'v2',
      stable_preferences: { toneStyle: 'formal', preferredTopics: [] },
    });
    const signals = computePersonalizationSignalsV3(profile);
    // Fallback na v2: version marker je v2
    assertEqual(signals.explainability.version, 'v2', 'explainability.version v2 za v2 profil');
    assert(signals.systemPromptInjection.includes('formalan') || signals.systemPromptInjection === '', 'v2 fallback');
  });

  await test('computePersonalizationSignalsV3 — toneStyle:formal generiše injection', () => {
    const profile = buildPersonalizationProfileV3('u6', {
      ...BASE_PROFILE_V3,
      stable_preferences: { toneStyle: 'formal', preferredTopics: [] },
    });
    const signals = computePersonalizationSignalsV3(profile);
    assert(signals.systemPromptInjection.includes('formalan'), 'formalan ton injection');
    assert(signals.explainability.activeSignals.includes('toneStyle:formal'), 'toneStyle signal');
  });

  await test('computePersonalizationSignalsV3 — sessionTempo:fast generiše injection', () => {
    const profile = buildPersonalizationProfileV3('u7', {
      ...BASE_PROFILE_V3,
      adaptive_preferences: { topicWeights: {}, sessionTempo: 'fast', sessionCount: 5, lastAdaptedAt: null },
    });
    const signals = computePersonalizationSignalsV3(profile);
    assert(signals.systemPromptInjection.includes('brze'), 'fast tempo injection');
    assert(signals.explainability.activeSignals.includes('sessionTempo:fast'), 'sessionTempo signal');
  });

  await test('computePersonalizationSignalsV3 — sessionTempo:deep daje temperature 0.7', () => {
    const profile = buildPersonalizationProfileV3('u8', {
      ...BASE_PROFILE_V3,
      adaptive_preferences: { topicWeights: {}, sessionTempo: 'deep', sessionCount: 3, lastAdaptedAt: null },
    });
    const signals = computePersonalizationSignalsV3(profile);
    assertEqual(signals.routingHint.preferredTemperature, 0.7, 'deep temperature 0.7');
  });

  await test('computePersonalizationSignalsV3 — technical tone overrides deep temperature', () => {
    const profile = buildPersonalizationProfileV3('u9', {
      ...BASE_PROFILE_V3,
      stable_preferences: { toneStyle: 'technical', preferredTopics: [] },
      adaptive_preferences: { topicWeights: {}, sessionTempo: 'deep', sessionCount: 2, lastAdaptedAt: null },
    });
    const signals = computePersonalizationSignalsV3(profile);
    assertEqual(signals.routingHint.preferredTemperature, 0.3, 'technical overrides deep temperature');
  });

  await test('computePersonalizationSignalsV3 — adaptive topics u knowledge hint', () => {
    const profile = buildPersonalizationProfileV3('u10', {
      ...BASE_PROFILE_V3,
      adaptive_preferences: { topicWeights: { AI: 0.9, 'TypeScript': 0.8, 'Next.js': 0.7 }, sessionTempo: null, sessionCount: 5, lastAdaptedAt: null },
    });
    const signals = computePersonalizationSignalsV3(profile);
    assert(signals.knowledgeHint.preferredTopics.includes('AI'), 'AI u knowledge hint');
  });

  await test('computePersonalizationSignalsV3 — knowledge hint bez duplikata', () => {
    const profile = buildPersonalizationProfileV3('u11', {
      ...BASE_PROFILE_V3,
      stable_preferences: { toneStyle: null, detailLevel: null, languageStyle: null, preferredTopics: ['AI'] },
      adaptive_preferences: { topicWeights: { AI: 0.9 }, sessionTempo: null, sessionCount: 2, lastAdaptedAt: null },
    });
    const signals = computePersonalizationSignalsV3(profile);
    const aiCount = signals.knowledgeHint.preferredTopics.filter((t) => t === 'AI').length;
    assertEqual(aiCount, 1, 'AI topic ne sme biti duplikat');
  });

  await test('mergePersonalizationIntoPrompt — v3 injection se dodaje iza baze', () => {
    const base = 'SECURITY RULES: never disclose secrets.';
    const profile = buildPersonalizationProfileV3('u12', {
      ...BASE_PROFILE_V3,
      stable_preferences: { toneStyle: 'casual', preferredTopics: [] },
    });
    const signals = computePersonalizationSignalsV3(profile);
    const merged = mergePersonalizationIntoPrompt(base, signals);
    assert(merged.startsWith('SECURITY RULES:'), 'Base prompt ostaje na početku');
    assert(merged.includes('Personalizacija'), 'v3 injection dodat');
  });

  await test('mergePersonalizationIntoPrompt — prazna injection ne menja prompt', () => {
    const base = 'Base prompt text.';
    const profile = buildPersonalizationProfileV3('u13', {
      ...BASE_PROFILE_V3,
      personalization_opt_out: true,
    });
    const signals = computePersonalizationSignalsV3(profile);
    const merged = mergePersonalizationIntoPrompt(base, signals);
    assertEqual(merged, base, 'Prompt nepromenjen za opt-out');
  });

  await test('applyAdaptivePreferenceUpdate — merge sa null osnovom', () => {
    const updated = applyAdaptivePreferenceUpdate(null, { sessionTempo: 'deep' });
    assertEqual(
      (updated as { sessionTempo: string })['sessionTempo'],
      'deep',
      'sessionTempo merged',
    );
  });

  await test('applyAdaptivePreferenceUpdate — zadržava postojeće vrednosti', () => {
    const initial = applyAdaptivePreferenceUpdate(null, { sessionCount: 5, sessionTempo: 'fast' });
    const updated = applyAdaptivePreferenceUpdate(initial, { sessionTempo: 'deep' });
    assertEqual(
      (updated as { sessionCount: number })['sessionCount'],
      5,
      'sessionCount zadržan',
    );
    assertEqual(
      (updated as { sessionTempo: string })['sessionTempo'],
      'deep',
      'sessionTempo ažuriran',
    );
  });

  await test('buildExplainabilityPayloadV3 — vraća konzistentan payload', () => {
    const payload = buildExplainabilityPayloadV3('u14', BASE_PROFILE_V3);
    assert(typeof payload.version === 'string', 'version string');
    assert(Array.isArray(payload.activeSignals), 'activeSignals array');
    assert(typeof payload.confidence === 'number', 'confidence number');
    assert(typeof payload.optOut === 'boolean', 'optOut boolean');
    assert(typeof payload.enabled === 'boolean', 'enabled boolean');
  });

  await test('buildExplainabilityPayloadV3 — sadrži v3Score za v3 profil', () => {
    const payload = buildExplainabilityPayloadV3('u15', BASE_PROFILE_V3);
    assert('v3Score' in payload, 'v3Score prisutan za v3 profil');
    assert(typeof payload.v3Score === 'number', 'v3Score is number');
  });

  await test('buildExplainabilityPayloadV3 — nema v3Score za v2 profil', () => {
    const payload = buildExplainabilityPayloadV3('u16', {
      ...BASE_PROFILE_V3,
      personalization_version: 'v2',
    });
    assert(!('v3Score' in payload) || payload.v3Score === undefined, 'v3Score odsutan za v2 profil');
  });

  await test('isPersonalizationV3Enabled — vraća boolean', () => {
    assert(typeof isPersonalizationV3Enabled() === 'boolean', 'boolean return');
  });

  // ── v2 regression checks ──────────────────────────────────────────
  await test('v2 testovi: buildPersonalizationProfile — default values', () => {
    const v2Profile = {
      custom_instructions: null,
      memory: null,
      preferred_model: 'gpt-4o-mini' as const,
      preferred_language: 'sr',
      personalization_version: 'v2',
      stable_preferences: null,
      contextual_preferences: null,
      personalization_confidence: 0.5,
      personalization_updated_at: null,
      personalization_enabled: true,
      personalization_opt_out: false,
    };
    const p = buildPersonalizationProfile('v2u1', v2Profile);
    assertEqual(p.version, 'v2', 'version v2');
    assertEqual(p.optOut, false, 'optOut');
    assertEqual(p.enabled, true, 'enabled');
  });

  await test('v2 testovi: computePersonalizationSignals — opt-out vraća prazne signale', () => {
    const v2Profile = {
      custom_instructions: null,
      memory: null,
      preferred_model: 'gpt-4o-mini' as const,
      preferred_language: 'sr',
      personalization_version: 'v2',
      stable_preferences: null,
      contextual_preferences: null,
      personalization_confidence: 0.8,
      personalization_updated_at: null,
      personalization_enabled: true,
      personalization_opt_out: true,
    };
    const p = buildPersonalizationProfile('v2u2', v2Profile);
    const signals = computePersonalizationSignals(p);
    assertEqual(signals.systemPromptInjection, '', 'systemPromptInjection prazno za v2 opt-out');
  });

  await test('v2 testovi: applyStablePreferenceUpdate — merge sa null', () => {
    const updated = applyStablePreferenceUpdate(null, { toneStyle: 'formal' });
    assertEqual((updated as { toneStyle: string })['toneStyle'], 'formal', 'toneStyle merged v2');
  });

  await test('v2 testovi: buildExplainabilityPayload — konzistentan payload', () => {
    const v2Profile = {
      custom_instructions: null,
      memory: null,
      preferred_model: 'gpt-4o-mini' as const,
      preferred_language: 'sr',
      personalization_version: 'v2',
      stable_preferences: null,
      contextual_preferences: null,
      personalization_confidence: 0.7,
      personalization_updated_at: null,
      personalization_enabled: true,
      personalization_opt_out: false,
    };
    const payload = buildExplainabilityPayload('v2u3', v2Profile);
    assert(typeof payload.version === 'string', 'v2 payload version string');
    assert(Array.isArray(payload.activeSignals), 'v2 payload activeSignals array');
  });

  await test('v2 testovi: isPersonalizationV2Enabled — vraća boolean', () => {
    assert(typeof isPersonalizationV2Enabled() === 'boolean', 'v2 boolean return');
  });

  console.log(`\n🏁 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) {
    console.error('\n❌ Neuspešni testovi:');
    failures.forEach((f) => console.error(`  • ${f}`));
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Kritična greška u test runneru:', e);
  process.exit(1);
});
