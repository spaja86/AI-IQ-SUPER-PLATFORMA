// Autofinish #1420 — PERTENIZACIJA 2 (Personalization v2) Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/pertenizacija-v2-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import {
  buildPersonalizationProfile,
  computePersonalizationSignals,
  mergePersonalizationIntoPrompt,
  applyStablePreferenceUpdate,
  buildExplainabilityPayload,
  isPersonalizationV2Enabled,
  type ProfileV2Input,
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

const BASE_PROFILE: ProfileV2Input = {
  custom_instructions: null,
  memory: null,
  preferred_model: 'gpt-4o-mini',
  preferred_language: 'sr',
  personalization_version: 'v2',
  stable_preferences: null,
  contextual_preferences: null,
  personalization_confidence: 0.8,
  personalization_updated_at: '2026-06-02T00:00:00Z',
  personalization_enabled: true,
  personalization_opt_out: false,
};

async function runTests(): Promise<void> {
  console.log('\n🏁 PERTENIZACIJA 2 — Personalization v2 Coverage Test Suite (#1420)\n');

  // ── File structure checks ──────────────────────────────────────────
  await test('engine-v2.ts postoji', () => {
    const p = path.resolve(process.cwd(), 'src/lib/personalizacija/engine-v2.ts');
    assert(fs.existsSync(p), `${p} ne postoji`);
  });

  await test('DB migracija 016 postoji', () => {
    const p = path.resolve(process.cwd(), 'supabase/migrations/016_pertenizacija_v2.sql');
    assert(fs.existsSync(p), `${p} ne postoji`);
  });

  await test('Settings ruta proširena sa v2 poljima', () => {
    const p = path.resolve(process.cwd(), 'src/app/api/spaja-pro/settings/route.ts');
    const src = fs.readFileSync(p, 'utf8');
    assert(src.includes('personalizationOptOut'), 'Nedostaje personalizationOptOut');
    assert(src.includes('stablePreferences'), 'Nedostaje stablePreferences');
    assert(src.includes('resetPersonalization'), 'Nedostaje resetPersonalization');
    assert(src.includes('applyStablePreferenceUpdate'), 'Nedostaje applyStablePreferenceUpdate');
    assert(src.includes('buildExplainabilityPayload'), 'Nedostaje buildExplainabilityPayload');
  });

  await test('Chat ruta koristi v2 engine', () => {
    const p = path.resolve(process.cwd(), 'src/app/api/spaja-pro/chat/route.ts');
    const src = fs.readFileSync(p, 'utf8');
    assert(src.includes('buildPersonalizationProfile'), 'Nedostaje buildPersonalizationProfile');
    assert(src.includes('computePersonalizationSignals'), 'Nedostaje computePersonalizationSignals');
    assert(src.includes('mergePersonalizationIntoPrompt'), 'Nedostaje mergePersonalizationIntoPrompt');
    assert(src.includes('personalizationSignals.routingHint'), 'Nedostaje routing hint');
    assert(src.includes('personalizacija:'), 'Nedostaje personalizacija u response payload');
  });

  await test('Explain ruta postoji', () => {
    const p = path.resolve(process.cwd(), 'src/app/api/spaja-pro/personalizacija-explain/route.ts');
    assert(fs.existsSync(p), `${p} ne postoji`);
    const src = fs.readFileSync(p, 'utf8');
    assert(src.includes('buildExplainabilityPayload'), 'Nedostaje buildExplainabilityPayload');
  });

  await test('Metrics ruta sadrži v2 personalizacione metrike', () => {
    const p = path.resolve(process.cwd(), 'src/app/api/spaja-baza-knowledge/metrics/route.ts');
    const src = fs.readFileSync(p, 'utf8');
    assert(src.includes('personalizacijaV2'), 'Nedostaje personalizacijaV2 blok');
    assert(src.includes('v2AdoptionCount'), 'Nedostaje v2AdoptionCount');
    assert(src.includes('optOutCount'), 'Nedostaje optOutCount');
  });

  await test('ADR dokument postoji', () => {
    const p = path.resolve(process.cwd(), 'docs/ADR-PERTENIZACIJA-2.md');
    assert(fs.existsSync(p), `${p} ne postoji`);
  });

  await test('Konstante su ažurirane', () => {
    assert(/^\d+\.\d+\.\d+$/.test(APP_VERSION), 'APP_VERSION semver format');
    assert(AUTOFINISH_COUNT >= 1420, 'AUTOFINISH_COUNT baseline 1420');
  });

  // ── Engine unit tests ──────────────────────────────────────────────
  await test('buildPersonalizationProfile — default values za prazan profil', () => {
    const p = buildPersonalizationProfile('u1', BASE_PROFILE);
    assertEqual(p.version, 'v2', 'version');
    assertEqual(p.userId, 'u1', 'userId');
    assert(Array.isArray(p.stable.preferredTopics), 'preferredTopics is array');
    assert(Array.isArray(p.contextual.recentTopics), 'recentTopics is array');
    assertEqual(p.optOut, false, 'optOut');
    assertEqual(p.enabled, true, 'enabled');
  });

  await test('computePersonalizationSignals — vraća prazne signale za opt-out', () => {
    const optOutProfile = buildPersonalizationProfile('u2', {
      ...BASE_PROFILE,
      personalization_opt_out: true,
    });
    const signals = computePersonalizationSignals(optOutProfile);
    assertEqual(signals.systemPromptInjection, '', 'systemPromptInjection prazno');
    assertEqual(signals.routingHint.preferredModel, null, 'preferredModel null');
    assert(signals.explainability.optOut === true, 'explainability.optOut true');
  });

  await test('computePersonalizationSignals — vraća prazne signale za v1 profil', () => {
    const v1Profile = buildPersonalizationProfile('u3', {
      ...BASE_PROFILE,
      personalization_version: 'v1',
    });
    const signals = computePersonalizationSignals(v1Profile);
    assertEqual(signals.systemPromptInjection, '', 'systemPromptInjection prazno za v1');
  });

  await test('computePersonalizationSignals — toneStyle:formal generiše injection', () => {
    const profile = buildPersonalizationProfile('u4', {
      ...BASE_PROFILE,
      stable_preferences: { toneStyle: 'formal', preferredTopics: [] },
    });
    const signals = computePersonalizationSignals(profile);
    assert(signals.systemPromptInjection.includes('formalan'), 'formalan ton injection');
    assert(signals.explainability.activeSignals.includes('toneStyle:formal'), 'toneStyle signal');
  });

  await test('computePersonalizationSignals — detailLevel:brief generiše injection', () => {
    const profile = buildPersonalizationProfile('u5', {
      ...BASE_PROFILE,
      stable_preferences: { detailLevel: 'brief', preferredTopics: [] },
    });
    const signals = computePersonalizationSignals(profile);
    assert(signals.systemPromptInjection.includes('kratko'), 'brief injection');
  });

  await test('computePersonalizationSignals — technical tone snižava temperaturu', () => {
    const profile = buildPersonalizationProfile('u6', {
      ...BASE_PROFILE,
      stable_preferences: { toneStyle: 'technical', preferredTopics: [] },
    });
    const signals = computePersonalizationSignals(profile);
    assertEqual(signals.routingHint.preferredTemperature, 0.3, 'temperature 0.3');
  });

  await test('mergePersonalizationIntoPrompt — sigurno spaja, ne prepisuje base', () => {
    const base = 'SECURITY RULES: never disclose secrets.';
    const signals = computePersonalizationSignals(
      buildPersonalizationProfile('u7', {
        ...BASE_PROFILE,
        stable_preferences: { toneStyle: 'casual', preferredTopics: [] },
      }),
    );
    const merged = mergePersonalizationIntoPrompt(base, signals);
    assert(merged.startsWith('SECURITY RULES:'), 'Base prompt ostaje na početku');
    assert(merged.includes('SECURITY RULES:'), 'Security tekst nije obrisan');
    assert(merged.includes('Personalizacija'), 'v2 injection je dodat');
  });

  await test('mergePersonalizationIntoPrompt — prazna injection ne menja prompt', () => {
    const base = 'Base prompt text.';
    const emptySignals = computePersonalizationSignals(
      buildPersonalizationProfile('u8', { ...BASE_PROFILE, personalization_opt_out: true }),
    );
    const merged = mergePersonalizationIntoPrompt(base, emptySignals);
    assertEqual(merged, base, 'Prompt nepromenjen za opt-out');
  });

  await test('applyStablePreferenceUpdate — merge sa null osnovom', () => {
    const updated = applyStablePreferenceUpdate(null, { toneStyle: 'formal' });
    assertEqual((updated as { toneStyle: string })['toneStyle'], 'formal', 'toneStyle merged');
  });

  await test('applyStablePreferenceUpdate — limitira preferredTopics na 10', () => {
    const topics = Array.from({ length: 15 }, (_, i) => `topic${i}`);
    const updated = applyStablePreferenceUpdate(null, { preferredTopics: topics });
    assert(
      (updated as { preferredTopics: string[] })['preferredTopics'].length <= 10,
      'max 10 topics',
    );
  });

  await test('buildExplainabilityPayload — vraća konzistentan payload', () => {
    const payload = buildExplainabilityPayload('u9', BASE_PROFILE);
    assert(typeof payload.version === 'string', 'version string');
    assert(Array.isArray(payload.activeSignals), 'activeSignals array');
    assert(typeof payload.confidence === 'number', 'confidence number');
    assert(typeof payload.optOut === 'boolean', 'optOut boolean');
    assert(typeof payload.enabled === 'boolean', 'enabled boolean');
  });

  await test('isPersonalizationV2Enabled — vraća boolean', () => {
    assert(typeof isPersonalizationV2Enabled() === 'boolean', 'boolean return');
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
