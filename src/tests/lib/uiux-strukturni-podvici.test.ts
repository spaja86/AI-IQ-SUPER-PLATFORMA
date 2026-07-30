import type { DepoIdentityLayer, GeneratorCatalog } from '@/lib/uiux-strukturni-podvici';
import {
  REFERENCE_DEPOT_POSSIBILITY_SPACE,
  detectBlockedPatterns,
  estimatePossibilitySpace,
  generateStructuredVariants,
  isSchemaVersionSupported,
  rankVariants,
  selectBestVariant,
  shouldStopExperiment,
  validateStructure,
} from '@/lib/uiux-strukturni-podvici';

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

const depo: DepoIdentityLayer = {
  depoId: 'io-openui-ao-home',
  depoTip: 'platform',
  domen: 'io-openui-ao',
  korisnickiSegment: 'returning',
  trziste: 'rs',
};

const catalog: GeneratorCatalog = {
  navigacije: [
    ['home', 'pricing', 'docs'],
    ['home', 'dashboard', 'support'],
  ],
  sekcije: [
    ['hero', 'benefits', 'checkout'],
    ['hero', 'analytics', 'faq'],
    ['intro', 'proof', 'cta'],
  ],
  prioriteti: [
    ['value-proposition', 'social-proof', 'conversion'],
    ['task-speed', 'error-prevention', 'retention'],
  ],
  sekvence: [
    ['hero', 'kartice', 'cta', 'tekst'],
    ['hero', 'statistika', 'progres', 'cta'],
    ['tekst', 'lista', 'baner'],
  ],
  varijante: [
    ['compact', 'balanced'],
    ['visual-heavy', 'insight-first'],
  ],
  stanja: [
    ['default', 'loading', 'error'],
    ['default', 'empty', 'success'],
  ],
  stilovi: [
    { tema: 'auto', tokenSet: 'spaja-v1', responsive: ['sm', 'md', 'lg'], a11yNivo: 'AA' },
    { tema: 'tamna', tokenSet: 'spaja-v2', responsive: ['md', 'lg', 'xl'], a11yNivo: 'AAA' },
  ],
};

async function runTests(): Promise<void> {
  console.log('\n🧪 UI/UX Strukturni Podvici Test Suite\n');

  await test('estimatePossibilitySpace podržava 870B referentni prostor', () => {
    const result = estimatePossibilitySpace([870_000, 1_000, 1_000]);
    assert(result >= REFERENCE_DEPOT_POSSIBILITY_SPACE, 'prostor mora biti najmanje 870B');
  });

  await test('generateStructuredVariants ne enumerira sve već vraća ograničen skup kandidata', () => {
    const variants = generateStructuredVariants({
      depo,
      catalog,
      seed: 'seed-1',
      maxCandidates: 12,
    });
    assertEqual(variants.length, 12, 'broj kandidata');
  });

  await test('validateStructure detektuje invalidnu checkout strukturu bez CTA', () => {
    const variants = generateStructuredVariants({
      depo,
      catalog,
      seed: 'seed-2',
      maxCandidates: 1,
    });
    const broken = {
      ...variants[0],
      informationArchitecture: {
        ...variants[0].informationArchitecture,
        sekcije: ['checkout'],
      },
      components: {
        ...variants[0].components,
        sekvence: ['hero', 'tekst'],
      },
    };

    const issues = validateStructure(broken);
    assert(issues.some((issue) => issue.ruleId === 'required-cta-on-checkout'), 'mora prijaviti CTA pravilo');
  });

  await test('rankVariants i selectBestVariant biraju segmentno najbolju varijantu', () => {
    const variants = generateStructuredVariants({
      depo,
      catalog,
      seed: 'seed-3',
      maxCandidates: 3,
    });

    const ranked = rankVariants([
      {
        schema: variants[0],
        metrics: { conversionRate: 0.61, taskCompletionMs: 8500, errorRate: 0.08, engagementScore: 0.53 },
      },
      {
        schema: {
          ...variants[1],
          identity: { ...variants[1].identity, korisnickiSegment: 'new' },
          metadata: { ...variants[1].metadata, stableCandidateId: 'stable-default' },
        },
        metrics: { conversionRate: 0.92, taskCompletionMs: 7000, errorRate: 0.09, engagementScore: 0.7 },
        stable: true,
      },
      {
        schema: {
          ...variants[2],
          identity: { ...variants[2].identity, korisnickiSegment: 'returning' },
        },
        metrics: { conversionRate: 0.8, taskCompletionMs: 6000, errorRate: 0.04, engagementScore: 0.88 },
      },
    ]);

    const selected = selectBestVariant(ranked, { segment: 'returning', fallbackStableId: 'stable-default' });
    assert(selected !== null, 'mora izabrati varijantu');
    assertEqual(selected!.schema.identity.korisnickiSegment, 'returning', 'segmentni izbor');
  });

  await test('selectBestVariant koristi stable fallback kada nema segmentnih kandidata', () => {
    const variants = generateStructuredVariants({
      depo,
      catalog,
      seed: 'seed-4',
      maxCandidates: 2,
    });

    const ranked = rankVariants([
      {
        schema: {
          ...variants[0],
          identity: { ...variants[0].identity, korisnickiSegment: 'new' },
          metadata: { ...variants[0].metadata, stableCandidateId: 'stable-fallback' },
        },
        metrics: { conversionRate: 0.3, taskCompletionMs: 12000, errorRate: 0.2, engagementScore: 0.2 },
        stable: true,
      },
      {
        schema: {
          ...variants[1],
          identity: { ...variants[1].identity, korisnickiSegment: 'new' },
        },
        metrics: { conversionRate: 0.9, taskCompletionMs: 7000, errorRate: 0.3, engagementScore: 0.7 },
      },
    ]);

    const selected = selectBestVariant(ranked, { segment: 'enterprise', fallbackStableId: 'stable-fallback' });
    assert(selected !== null, 'mora vratiti fallback');
    assertEqual(selected!.schema.metadata.stableCandidateId, 'stable-fallback', 'stable fallback');
  });

  await test('shouldStopExperiment prekida eksperiment kada error-rate probije limit', () => {
    const shouldStop = shouldStopExperiment(
      { sampleSize: 400, runtimeDays: 2, errorRate: 0.12, lift: 0.01 },
      { minSampleSize: 1000, maxRuntimeDays: 14, maxErrorRate: 0.1, minLift: 0.03 },
    );
    assertEqual(shouldStop, true, 'prelazak error-rate limita');
  });

  await test('detectBlockedPatterns vraća samo blokirane UX obrasce', () => {
    const patterns = detectBlockedPatterns(['hidden-primary-cta', 'smooth-nav', 'contrast-under-aa']);
    assertEqual(patterns.length, 2, 'broj blokiranih');
  });

  await test('isSchemaVersionSupported potvrđuje podržanu verziju šeme', () => {
    assertEqual(isSchemaVersionSupported('1.0.0'), true, 'aktuelna verzija mora biti podržana');
    assertEqual(isSchemaVersionSupported('2.0.0'), false, 'nepoznata verzija ne sme biti podržana');
  });

  console.log('\n──────────────────────────────────────────────────');
  console.log(`✅ Passed: ${passed}  ❌ Failed: ${failed}  📊 Total: ${passed + failed}`);
  console.log('──────────────────────────────────────────────────\n');

  if (failed > 0) {
    console.error('Failures:');
    for (const failure of failures) {
      console.error(`  - ${failure}`);
    }
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error('Runner error:', error);
  process.exit(1);
});
