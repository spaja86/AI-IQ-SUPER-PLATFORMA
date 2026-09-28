import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  DEVELOPER_CREATE_KRALJEVSKI_SISTEM_REVIEW_ROSTER,
  DEVELOPER_CREATE_KRALJEVSKI_SISTEM_REVIEW_ROSTER_POLICY,
  DEVELOPER_CREATE_KRALJEVSKI_SISTEM_SCOPE_LOCK,
  DEVELOPER_CREATE_KRALJEVSKI_SISTEM_SUMMARY_SAFE_FIELDS,
  DEVELOPER_CREATE_KRALJEVSKI_SAT_BOUNDED_TOKEN_SET,
  DEVELOPER_CREATE_KRALJEVSKI_SAT_READINESS_LANGUAGE,
  DEVELOPER_CREATE_MEDALJE_SRBSKE_ACCEPTANCE_CRITERIA,
  DEVELOPER_CREATE_AUTOMATSKA_POPRAVKA_SVEGA_ACCEPTANCE_CRITERIA,
  DEVELOPER_CREATE_AUTOMATSKA_POPRAVKA_SVEGA_FALLBACK_INPUTS,
  DEVELOPER_CREATE_AUTOMATSKA_POPRAVKA_SVEGA_INPUT_NORMALIZATION_ALIASES,
  DEVELOPER_CREATE_AUTOMATSKA_POPRAVKA_SVEGA_SCOPE_STATEMENT,
  DEVELOPER_CREATE_AUTOMATSKA_POPRAVKA_SVEGA_SUMMARY_SAFE_FIELDS,
  DEVELOPER_CREATE_MEDALJE_SRBSKE_FALLBACK_INPUTS,
  DEVELOPER_CREATE_MEDALJE_SRBSKE_LAYER_OWNERSHIP_LOCK,
  DEVELOPER_CREATE_MEDALJE_SRBSKE_READINESS_LANGUAGE,
  DEVELOPER_CREATE_MEDALJE_SRBSKE_SCOPE_STATEMENT,
  DEVELOPER_CREATE_MEDALJE_SRBSKE_SUMMARY_SAFE_FIELDS,
  DEVELOPER_CREATE_KRALJEVSKI_RAD_BOUNDED_TOKEN_SEQUENCE,
  DEVELOPER_CREATE_KRALJEVSKI_RAD_FALLBACK_INPUTS,
  DEVELOPER_CREATE_KRALJEVSKI_RAD_SUMMARY_SAFE_FIELDS,
  DEVELOPER_CREATE_ALATI_RADIONICA_BOUNDED_TOKEN_SEQUENCE,
  DEVELOPER_CREATE_ALATI_RADIONICA_FALLBACK_INPUTS,
  DEVELOPER_CREATE_ALATI_RADIONICA_SUMMARY_SAFE_FIELDS,
  DEVELOPER_CREATE_ALATI_RADIONICA_TOKEN_POLICY,
  DEVELOPER_CREATE_VRH_ALATI_RADIONICA_ALIAS,
  DEVELOPER_CREATE_KRALJEVSKI_SAT_SUMMARY_SAFE_FIELDS,
  DEVELOPER_CREATE_SARADNJA_READY_BOUNDED_VOCABULARY,
  DEVELOPER_CREATE_SARADNJA_READY_AUTOMATIC_SUBSCRIPTION_GATES,
  DEVELOPER_CREATE_SARADNJA_READY_COST_TO_ZERO_FALLBACK_PLAN,
  DEVELOPER_CREATE_SARADNJA_READY_DOKSA_PRETPLATA_CASE,
  DEVELOPER_CREATE_SARADNJA_READY_EXTRONDOL_NEGOTIATION_QUESTIONS,
  DEVELOPER_CREATE_SARADNJA_READY_EXTREM_COST_HOTSPOTS,
  DEVELOPER_CREATE_SARADNJA_READY_FINAL_AUDIT_PACKAGE_CONTENTS,
  DEVELOPER_CREATE_SARADNJA_READY_POSLOVNA_PONUDA_SCOPE_LOCK,
  DEVELOPER_CREATE_SARADNJA_READY_POSLOVNA_PONUDA_PRETPLATA_SCOPE_LOCK,
  DEVELOPER_CREATE_SARADNJA_READY_READINESS_SIGNALS,
  DEVELOPER_CREATE_SARADNJA_READY_RECOMMENDATION_LEVEL,
  DEVELOPER_CREATE_SARADNJA_READY_SUMMARY_SAFE_FIELDS,
  DEVELOPER_CREATE_SARADNJA_READY_VERCEL_COST_TARGETS,
  DEVELOPER_CREATE_SARADNJA_READY_VERCEL_GOVERNANCE_BLOCKERS,
  DEVELOPER_CREATE_IZVESTAJ_REPORT_LOCK,
  DEVELOPER_CREATE_IZVESTAJ_MEASURED_BRANCH_LAYERS,
  DEVELOPER_CREATE_IZVESTAJ_PLATFORM_TRACKS,
  DEVELOPER_CREATE_IZVESTAJ_REPORTING_LAYERS,
  DEVELOPER_CREATE_IZVESTAJ_SCOPE_STATEMENT,
  DEVELOPER_CREATE_IZVESTAJ_REQUIRED_AUDIT_FIELDS,
  DEVELOPER_CREATE_IZVESTAJ_REQUIRED_BLOCKS,
  DEVELOPER_CREATE_VRH_KRALJEVSKI_SAT_ALIAS,
  DEVELOPER_CREATE_VRH_KRALJEVSKI_SISTEM_ALIAS,
  DEVELOPER_CREATE_VRH_KRALJEVSKI_RAD_ALIAS,
  DEVELOPER_CREATE_VRH_AUTOMATSKA_POPRAVKA_SVEGA_ALIAS,
  DEVELOPER_CREATE_VRH_ATOMATSKA_POPRAVKA_SVEGA_RAW_ALIAS,
  DEVELOPER_CREATE_VRH_MEDALJE_SRBSKE_ALIAS,
  DEVELOPER_CREATE_VRH_IZVESTAJ_ALIAS,
  DEVELOPER_CREATE_VRH_VINOGRADI_GROCKA_RESTORAN_ALIAS,
  DEVELOPER_CREATE_VRH_POSLOVNA_PONUDA_ZELEZARA_DOO_ALIAS,
  DEVELOPER_CREATE_NAVIGACIONI_SISTEM_SA_TREKEROM_TRACKER_CONTRACT,
  DEVELOPER_CREATE_REPO_WIDE_BOUNDED_VOCABULARY,
  DEVELOPER_CREATE_REPO_WIDE_BOUNDED_VOCABULARY_PHRASE,
  DEVELOPER_CREATE_FUNCTION_REGISTRY_SCOPE_STATEMENT,
  DEVELOPER_CREATE_FUNCTION_REGISTRY_OPERATION_KEYS,
  DEVELOPER_CREATE_FUNCTION_REGISTRY_EXTENSIBLE_ALIAS_SET,
  DEVELOPER_CREATE_FUNCTION_REGISTRY_SUMMARY_SAFE_FIELDS,
  DEVELOPER_CREATE_FUNCTION_REGISTRY_FALLBACK_RULES,
  DEVELOPER_CREATE_FUNCTION_REGISTRY_GOVERNANCE_REQUIRED_OUTPUTS,
  DEVELOPER_CREATE_REPO_WIDE_RADNI_TAKT_SUPPLEMENTAL_AUDIT_ROLE,
  DEVELOPER_CREATE_REPO_WIDE_RADNI_TAKT_SUPPLEMENTAL_DOWNSTREAM_FIELDS,
  DEVELOPER_CREATE_REPO_WIDE_RADNI_TAKT_SUPPLEMENTAL_SCOPE_LOCK,
  DEVELOPER_CREATE_REPO_WIDE_RADNI_TAKT_SUPPLEMENTAL_THEMATIC_SIGNALS,
  DEVELOPER_CREATE_VINOGRADI_GROCKA_RESTORAN_LEADERSHIP_TRANSITION,
  DEVELOPER_CREATE_VINOGRADI_GROCKA_RESTORAN_SUMMARY_SAFE_FIELDS,
  DEVELOPER_CREATE_POSLOVNA_PONUDA_ZELEZARA_DOO_URGENT_MEETING_INTAKE_PACKAGE,
  DEVELOPER_CREATE_POSLOVNA_PONUDA_ZELEZARA_DOO_SUMMARY_SAFE_FIELDS,
  DEVELOPER_CREATE_POSLOVNA_PONUDA_ZELEZARA_DOO_FALLBACK_INPUTS,
  DEVELOPER_CREATE_PADEZI_ACCEPTANCE_CRITERIA,
  DEVELOPER_CREATE_PADEZI_CANONICAL_ALIAS,
  DEVELOPER_CREATE_PADEZI_CANONICAL_CASE_SEQUENCE,
  DEVELOPER_CREATE_PADEZI_DOWNSTREAM_POLICY,
  DEVELOPER_CREATE_PADEZI_EXISTING_MODULE_ROUTES,
  DEVELOPER_CREATE_PADEZI_EXPANDED_MODULE_ROUTES,
  DEVELOPER_CREATE_PADEZI_OUTPUT_MODEL,
  DEVELOPER_CREATE_PADEZI_SCOPE_STATEMENT,
  DEVELOPER_CREATE_PADEZI_SUMMARY_SAFE_FIELDS,
  DEVELOPER_CREATE_VRH_MONTEZACIJA_ALIAS,
  DEVELOPER_CREATE_MONTEZACIJA_CANONICAL_ALIAS,
  DEVELOPER_CREATE_MONTEZACIJA_SCOPE_STATEMENT,
  DEVELOPER_CREATE_MONTEZACIJA_ROLE_CLASSIFICATION,
  DEVELOPER_CREATE_MONTEZACIJA_FALLBACK_INPUTS,
  DEVELOPER_CREATE_MONTEZACIJA_NAD_MONTEZACIJAMA_APPROVAL_ACCEPTANCE_CRITERIA,
  DEVELOPER_CREATE_MONTEZACIJA_NAD_MONTEZACIJAMA_APPROVAL_SUMMARY_SAFE_FIELDS,
  DEVELOPER_CREATE_KRALJEVSKA_MONTEZACIJA_APPROVAL_ACCEPTANCE_CRITERIA,
  DEVELOPER_CREATE_KRALJEVSKA_MONTEZACIJA_APPROVAL_SUMMARY_SAFE_FIELDS,
  DEVELOPER_CREATE_KRALJEVSKA_MONTEZACIJA_CANONICAL_ALIAS,
  DEVELOPER_CREATE_MONTEZACIJA_NAD_MONTEZACIJAMA_CANONICAL_ALIAS,
  DEVELOPER_CREATE_MONTEZACIJA_SUMMARY_SAFE_FIELDS,
  DEVELOPER_CREATE_ELEKTRONSKI_POTPIS_CANONICAL_ALIAS,
  DEVELOPER_CREATE_ELEKTRONSKI_POTPIS_FALLBACK_INPUTS,
  DEVELOPER_CREATE_ELEKTRONSKI_POTPIS_GOVERNANCE_REQUIRED_OUTPUTS,
  DEVELOPER_CREATE_ELEKTRONSKI_POTPIS_RELEASE_AUDIT_SUMMARY_SIGNAL,
  DEVELOPER_CREATE_ELEKTRONSKI_POTPIS_ROLE_CLASSIFICATION,
  DEVELOPER_CREATE_ELEKTRONSKI_POTPIS_SCOPE_STATEMENT,
  DEVELOPER_CREATE_ELEKTRONSKI_POTPIS_SUMMARY_SAFE_FIELDS,
  DEVELOPER_CREATE_VRH_INTERPRETATION_ALIASES,
  DEVELOPER_CREATE_VRH_ELEKTRONSKI_POTPIS_ALIAS,
  DEVELOPER_CREATE_VRH_MARKAN_ALIAS,
  DEVELOPER_CREATE_VRH_KRALJEVSKA_MONTEZACIJA_ALIAS,
  DEVELOPER_CREATE_MARKAN_CANONICAL_ALIAS,
  DEVELOPER_CREATE_MARKAN_SCOPE_STATEMENT,
  DEVELOPER_CREATE_MARKAN_ROLE_CLASSIFICATION,
  DEVELOPER_CREATE_MARKAN_GOVERNANCE_REQUIRED_OUTPUTS,
  DEVELOPER_CREATE_MARKAN_SUMMARY_SAFE_FIELDS,
  DEVELOPER_CREATE_VRH_MONTEZACIJA_NAD_MONTEZACIJAMA_ALIAS,
  DEVELOPER_CREATE_VRH_NAVIGACIONI_SISTEM_SA_TREKEROM_ALIAS,
  DEVELOPER_CREATE_VRH_PADEZI_ALIAS,
  DEVELOPER_CREATE_VRH_CANONICAL_OUTPUT_MODEL_FIELDS,
} from '../../lib/extrimli/developer-create-vrh-ekviladenta-contract';
import { navigation } from '../../lib/navigation';
import { akuzativSekvence } from '../../lib/sekvence/akuzativ-page';
import { padeziSekvence } from '../../lib/sekvence/padezi-page';
import { buildPadezNavigationButtons } from '../../lib/sekvence/padezi-shared';

let passed = 0;
let failed = 0;
const failures: string[] = [];

async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`  ❌ ${name}`);
    console.error(`     ${message}`);
    failed++;
    failures.push(`${name}: ${message}`);
  }
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function assertArrayEquals(actual: readonly string[], expected: readonly string[], label: string): void {
  assert(actual.length === expected.length, `${label}: expected ${expected.length} items, got ${actual.length}`);
  for (let index = 0; index < expected.length; index += 1) {
    assert(actual[index] === expected[index], `${label}: mismatch at index ${index}, expected ${expected[index]}, got ${actual[index]}`);
  }
}

async function runTests(): Promise<void> {
  console.log('\n🔗 [developer-create-vrh-contract] tests\n');
  const filePath = fileURLToPath(import.meta.url);
  const root = path.resolve(path.dirname(filePath), '../../..');
  const manifest = await fs.readFile(path.join(root, 'docs/EXTRIMLI-DEVELOPER-CREATE-PROGRAM.md'), 'utf8');
  const vrhDoc = await fs.readFile(path.join(root, 'docs/EXTRIMLI-VRH-PROGRAMSKOG-EKVILADENTA.md'), 'utf8');
  const extrimliDoc = await fs.readFile(path.join(root, 'docs/EXTRIMLI.md'), 'utf8');
  const multiRepoLinks = await fs.readFile(path.join(root, 'docs/MULTI-REPO-LINKS.md'), 'utf8');

  await test('navigacioni alias is registered in interpretation aliases', () => {
    assert(
      DEVELOPER_CREATE_VRH_INTERPRETATION_ALIASES.includes(
        DEVELOPER_CREATE_VRH_NAVIGACIONI_SISTEM_SA_TREKEROM_ALIAS,
      ),
      'NAVIGACIONI SISTEM SA TREKEROM alias must be present in interpretation aliases',
    );
  });

  await test('padezi alias stays registered, normalized and summary-safe', () => {
    assert(
      DEVELOPER_CREATE_VRH_INTERPRETATION_ALIASES.includes(DEVELOPER_CREATE_VRH_PADEZI_ALIAS),
      'PADEŽI alias must be present in interpretation aliases',
    );
    assert(
      DEVELOPER_CREATE_PADEZI_CANONICAL_ALIAS ===
        'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == PADEŽI',
      'PADEŽI canonical alias mismatch',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_PADEZI_CANONICAL_CASE_SEQUENCE,
      ['NOMINATIV', 'GENITIV', 'DATIV', 'AKUZATIV', 'VOKATIV', 'INSTRUMENTAL', 'LOKATIV'],
      'unexpected PADEŽI canonical case sequence',
    );
    assert(
      DEVELOPER_CREATE_PADEZI_CANONICAL_CASE_SEQUENCE.filter((item) => item === 'LOKATIV').length === 1,
      'LOKATIV must appear exactly once in the PADEŽI canonical sequence',
    );
    assert(
      DEVELOPER_CREATE_PADEZI_SCOPE_STATEMENT.includes('additive-only bounded jezički paket') &&
        DEVELOPER_CREATE_PADEZI_SCOPE_STATEMENT.includes('bez novih runtime source-of-truth površina') &&
        DEVELOPER_CREATE_PADEZI_SCOPE_STATEMENT.includes('nove rute su dozvoljene samo kroz postojeći padežni UI/routing obrazac') &&
        DEVELOPER_CREATE_PADEZI_SCOPE_STATEMENT.includes('bez paralelnog source-of-truth sistema'),
      'PADEŽI scope statement must preserve additive-only and routing-pattern rules',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_PADEZI_EXISTING_MODULE_ROUTES,
      ['/nominativ', '/genitiv', '/dativ', '/akuzativ'],
      'unexpected PADEŽI existing module routes',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_PADEZI_EXPANDED_MODULE_ROUTES,
      ['/vokativ', '/instrumental', '/lokativ'],
      'unexpected PADEŽI expanded module routes',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_PADEZI_OUTPUT_MODEL.fields,
      DEVELOPER_CREATE_VRH_CANONICAL_OUTPUT_MODEL_FIELDS,
      'PADEŽI output model must reuse the canonical VRH output fields',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_PADEZI_SUMMARY_SAFE_FIELDS,
      [
        'canonicalAlias',
        'canonicalCases',
        'readinessStatus',
        'blockerReason',
        'watchReasons',
        'humanReviewStatus',
        'rolloutPlan',
        'rollbackPlan',
        'releaseAuditSummary',
        'downstreamReference',
      ],
      'unexpected PADEŽI summary-safe fields',
    );
    assert(
      DEVELOPER_CREATE_PADEZI_ACCEPTANCE_CRITERIA.includes('duplicate-lokativ-normalized-to-vokativ-in-canonical-sequence'),
      'PADEŽI acceptance criteria must record canonical normalization of the duplicate lokativ request',
    );
    assert(
      DEVELOPER_CREATE_PADEZI_DOWNSTREAM_POLICY.syncMode === 'summary-only',
      'PADEŽI downstream policy must remain summary-only',
    );
  });

  await test('padezi docs and routes stay aligned with the canonical package', async () => {
    assert(
      manifest.includes('### 2.2.6.a) PADEŽI bounded jezički paket'),
      'manifest PADEŽI section heading missing',
    );
    assert(
      vrhDoc.includes('`PADEŽI`'),
      'VRH doc PADEŽI marker missing',
    );
    assert(
      extrimliDoc.includes('bounded `PADEŽI` paket'),
      'EXTRIMLI doc PADEŽI marker missing',
    );
    const routeExpectations = [
      ['src/app/padezi/page.tsx', 'padeziSekvence'],
      ['src/app/vokativ/page.tsx', 'vokativSekvence'],
      ['src/app/instrumental/page.tsx', 'instrumentalSekvence'],
      ['src/app/lokativ/page.tsx', 'lokativSekvence'],
    ] as const;
    await Promise.all(
      routeExpectations.map(async ([relativePath, exportName]) => {
        const absolutePath = path.join(root, relativePath);
        await fs.access(absolutePath);
        const routeSource = await fs.readFile(absolutePath, 'utf8');
        assert(
          routeSource.includes(exportName) &&
            routeSource.includes('StranicaRenderer') &&
            routeSource.includes(`sekvence={${exportName}}`),
          `${relativePath} must render ${exportName} through StranicaRenderer`,
        );
      }),
    );
    const overviewHero = padeziSekvence.find((sekvenca) => sekvenca.id === 'padezi-hero');
    const overviewCta = padeziSekvence.find((sekvenca) => sekvenca.id === 'padezi-cta');
    const akuzativCta = akuzativSekvence.find((sekvenca) => sekvenca.id === 'akuzativ-povezane-teme');

    assert(overviewHero && overviewCta && akuzativCta, 'expected PADEŽI and AKUZATIV navigation sections to exist');

    const overviewHeroButtons = overviewHero!.podaci?.dugmad ?? [];
    const overviewCtaButtons = overviewCta!.podaci?.dugmad ?? [];
    const akuzativButtons = akuzativCta!.podaci?.dugmad ?? [];

    assert(
      overviewHeroButtons[0]?.href === '/akuzativ' && overviewCtaButtons[0]?.href === '/akuzativ',
      'PADEŽI overview must keep AKUZATIV as the primary linked page flow',
    );
    assertArrayEquals(
      overviewHeroButtons.map((button: { href: string }) => button.href),
      ['/akuzativ', '/nominativ', '/genitiv', '/dativ', '/vokativ', '/instrumental', '/lokativ'],
      'PADEŽI overview hero buttons must cover all case routes with AKUZATIV first',
    );
    assertArrayEquals(
      overviewCtaButtons.map((button: { href: string }) => button.href),
      ['/akuzativ', '/nominativ', '/genitiv', '/dativ', '/vokativ', '/instrumental', '/lokativ'],
      'PADEŽI overview CTA buttons must cover all case routes with AKUZATIV first',
    );
    assertArrayEquals(
      akuzativButtons.map((button: { href: string }) => button.href),
      buildPadezNavigationButtons('akuzativ', { includeOverview: false }).map((button) => button.href),
      'AKUZATIV related-case buttons must stay aligned with the shared PADEŽI navigation helper',
    );
    assert(
      !navigation.some((item) => item.label === 'PADEŽI') &&
        navigation.some((item) => item.label === 'AKUZATIV' && item.href === '/akuzativ'),
      'top-level navigation must preserve AKUZATIV without adding a competing PADEŽI primary entry',
    );
  });

  await test('repo-wide RADNI TAKT supplemental lock stays additive-only and bounded', () => {
    assertArrayEquals(
      DEVELOPER_CREATE_REPO_WIDE_BOUNDED_VOCABULARY,
      ['EXTRIMLI', 'EXTRONDOL', 'EXTREM', 'DOK', 'DUK', 'DAK', 'DIK', 'FOR'],
      'unexpected repo-wide bounded vocabulary',
    );
    assert(
      DEVELOPER_CREATE_REPO_WIDE_BOUNDED_VOCABULARY_PHRASE ===
        'EXTRIMLI EXTRONDOL EXTREM DOK DUK DAK DIK FOR',
      'repo-wide bounded vocabulary phrase mismatch',
    );
    assert(
      DEVELOPER_CREATE_REPO_WIDE_RADNI_TAKT_SUPPLEMENTAL_SCOPE_LOCK ===
        'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == RADNI TAKT DA SE ODRAZI NA SVEMU U REPOZITORIJUMU',
      'repo-wide RADNI TAKT supplemental scope lock mismatch',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_REPO_WIDE_RADNI_TAKT_SUPPLEMENTAL_THEMATIC_SIGNALS,
      [
        'developer-and-create-vrh',
        'radni-takt-repo-wide-reflection',
        'vuk',
        'bounded-vocabulary-extrimli-extrondol-extrem-dok-duk-dak-dik-for',
        'audit-safe-summary-only',
      ],
      'unexpected repo-wide RADNI TAKT supplemental thematic signals',
    );
    assert(
      DEVELOPER_CREATE_REPO_WIDE_RADNI_TAKT_SUPPLEMENTAL_AUDIT_ROLE ===
        'additive-audit-reference-only',
      'repo-wide RADNI TAKT supplemental audit role mismatch',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_REPO_WIDE_RADNI_TAKT_SUPPLEMENTAL_DOWNSTREAM_FIELDS,
      [
        'scenarioId',
        'readinessStatus',
        'blockerWatchReason',
        'reviewPosture',
        'ownershipLockSummary',
        'boundedThematicLabels',
      ],
      'unexpected repo-wide RADNI TAKT supplemental downstream fields',
    );
  });

  await test('function registry lock stays additive-only and bounded to existing routes', () => {
    assert(
      DEVELOPER_CREATE_FUNCTION_REGISTRY_SCOPE_STATEMENT.includes('bez novih runtime ruta'),
      'FUNCTION REGISTRY scope statement must keep route lock',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_FUNCTION_REGISTRY_OPERATION_KEYS,
      [
        'FUNCTION PETLJE',
        'FUNCTION RETURN_TO_START',
        'FUNCTION DIREKT',
        'FUNCTION INDIREKT',
        'FUNCTION THIS',
        'FUNCTION CREATE',
        'FUNCTION DELETE',
        'FUNCTION REPEAT',
        'FUNCTION IN',
        'FUNCTION BACKUP',
        'FUNCTION ENTER',
      ],
      'unexpected FUNCTION REGISTRY operation keys',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_FUNCTION_REGISTRY_EXTENSIBLE_ALIAS_SET,
      ['i tako dalje', 'FUNCTION CREAT', 'FUNCTION DELET', 'FUNCTION REAPIT', 'FUNCTION INDRIEKT'],
      'unexpected FUNCTION REGISTRY extensible alias set',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_FUNCTION_REGISTRY_SUMMARY_SAFE_FIELDS,
      ['status', 'readiness', 'blockerReason', 'humanReviewStatus', 'rolloutPlan', 'rollbackPlan', 'downstreamReference'],
      'unexpected FUNCTION REGISTRY summary-safe fields',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_FUNCTION_REGISTRY_GOVERNANCE_REQUIRED_OUTPUTS,
      ['readiness', 'blockerReason', 'humanReviewStatus', 'rolloutPlan', 'rollbackPlan', 'downstreamReference'],
      'unexpected FUNCTION REGISTRY governance outputs',
    );
    assert(
      DEVELOPER_CREATE_FUNCTION_REGISTRY_FALLBACK_RULES.routeBoundaryViolation
        === 'set-BLOCKED-and-keep-existing-route-boundary',
      'FUNCTION REGISTRY route-boundary fallback mismatch',
    );
  });

  await test('kraljevski sistem stays additive-only, summary-safe and documentation-only', () => {
    assert(
      DEVELOPER_CREATE_VRH_INTERPRETATION_ALIASES.includes('DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == KRALJEVSKI SISTEM'),
      'KRALJEVSKI SISTEM alias must be present in interpretation aliases',
    );
    assert(
      DEVELOPER_CREATE_KRALJEVSKI_SISTEM_SCOPE_LOCK.includes('additive-only bounded governance/orchestration alias'),
      'KRALJEVSKI SISTEM scope lock must preserve additive-only alias wording',
    );
    assert(
      DEVELOPER_CREATE_KRALJEVSKI_SISTEM_SCOPE_LOCK.includes('bez novih runtime ruta'),
      'KRALJEVSKI SISTEM scope lock must forbid new runtime routes',
    );
    assert(
      DEVELOPER_CREATE_KRALJEVSKI_SISTEM_SCOPE_LOCK.includes('bez novog source-of-truth sistema'),
      'KRALJEVSKI SISTEM scope lock must forbid new source-of-truth systems',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_KRALJEVSKI_SISTEM_SUMMARY_SAFE_FIELDS,
      [
        'canonicalAlias',
        'kraljevstvoScope',
        'approvalStatus',
        'payoutReadinessStatus',
        'paymentVerificationPosture',
        'blockerReason',
        'reviewPosture',
        'publicSummary',
        'downstreamReference',
        'boundedRosterRoles',
      ],
      'unexpected KRALJEVSKI SISTEM summary-safe fields',
    );
    assert(
      DEVELOPER_CREATE_KRALJEVSKI_SISTEM_REVIEW_ROSTER.length === 5,
      'KRALJEVSKI SISTEM review roster length mismatch',
    );
    assert(
      DEVELOPER_CREATE_KRALJEVSKI_SISTEM_REVIEW_ROSTER_POLICY.namesStayDocumentationOnly,
      'KRALJEVSKI SISTEM roster names must stay documentation-only',
    );
    assert(
      DEVELOPER_CREATE_KRALJEVSKI_SISTEM_REVIEW_ROSTER_POLICY.noOperationalIdentityUsage,
      'KRALJEVSKI SISTEM roster must reject operational identity usage',
    );
    assert(
      DEVELOPER_CREATE_KRALJEVSKI_SISTEM_REVIEW_ROSTER_POLICY.noPayrollOwnershipUsage,
      'KRALJEVSKI SISTEM roster must reject payroll ownership usage',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_KRALJEVSKI_SISTEM_REVIEW_ROSTER_POLICY.summaryOnlyRoleFields,
      ['rosterSlot', 'publicRole', 'responsibility'],
      'unexpected KRALJEVSKI SISTEM summary-only roster fields',
    );
  });

  await test('kraljevski sistem docs and downstream registry keep roster summary-only', () => {
    const kraljevskiSistemAliasSuffix =
      DEVELOPER_CREATE_VRH_KRALJEVSKI_SISTEM_ALIAS.split(' == ').at(-1);
    assert(
      manifest.includes(`\`${kraljevskiSistemAliasSuffix}\``),
      'manifest KRALJEVSKI SISTEM alias marker missing',
    );
    assert(
      manifest.includes('documentation/review roster') &&
        manifest.includes('payment verification posture') &&
        manifest.includes('downstream reference'),
      'manifest KRALJEVSKI SISTEM summary-safe markers missing',
    );
    assert(
      vrhDoc.includes(`\`${kraljevskiSistemAliasSuffix}\``) &&
        vrhDoc.includes('documentation/review roster') &&
        vrhDoc.includes('payment verification posture'),
      'VRH doc KRALJEVSKI SISTEM markers missing',
    );
    assert(
      multiRepoLinks.includes('`KRALJEVSKI SISTEM` bounded governance/orchestration alias + documentation/review roster'),
      'multi-repo KRALJEVSKI SISTEM row missing',
    );
    assert(
      manifest.includes('audit-safe review/stakeholder katalog') &&
        manifest.includes('operativne identitete') &&
        manifest.includes('nosioce payout podataka'),
      'manifest roster privacy and documentation-only wording missing',
    );
    assert(
      vrhDoc.includes('audit-safe uloge i review odgovornosti') &&
        vrhDoc.includes('operativni identiteti') &&
        vrhDoc.includes('nosioci osetljivih podataka'),
      'VRH doc roster privacy and documentation-only wording missing',
    );
    assert(
      multiRepoLinks.includes('`rosterSlot`, `publicRole` i `responsibility`') &&
        multiRepoLinks.includes('never sync personal contacts, payroll/bank/KYC data, security roles, operational identities or raw governance formulas'),
      'multi-repo roster privacy boundary missing',
    );
  });

  await test('izvestaj alias stays registered with locked report metadata', () => {
    assert(
      DEVELOPER_CREATE_VRH_INTERPRETATION_ALIASES.includes(DEVELOPER_CREATE_VRH_IZVESTAJ_ALIAS),
      'IZVEŠTAJ alias must be present in interpretation aliases',
    );
    assert(
      DEVELOPER_CREATE_IZVESTAJ_SCOPE_STATEMENT.includes('additive-only bounded branch report / audit snapshot alias'),
      'IZVEŠTAJ scope statement must preserve additive-only audit snapshot wording',
    );
    assert(
      DEVELOPER_CREATE_IZVESTAJ_REPORT_LOCK.canonicalAlias === DEVELOPER_CREATE_VRH_IZVESTAJ_ALIAS,
      'IZVEŠTAJ report lock canonical alias mismatch',
    );
    assert(
      DEVELOPER_CREATE_IZVESTAJ_REPORT_LOCK.sourceOfTruth === '/api/extrimli/extrondol',
      'IZVEŠTAJ report lock source of truth mismatch',
    );
    assert(
      DEVELOPER_CREATE_IZVESTAJ_REPORT_LOCK.canonicalFormat === 'developer-create-branch-report-v1',
      'IZVEŠTAJ report lock format mismatch',
    );
    assert(
      DEVELOPER_CREATE_IZVESTAJ_REPORT_LOCK.roadmapStageId === 'v5-extrondol-release-audit-and-orchestration',
      'IZVEŠTAJ report lock roadmap stage mismatch',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_IZVESTAJ_REPORT_LOCK.measuredBranchLayers,
      DEVELOPER_CREATE_IZVESTAJ_MEASURED_BRANCH_LAYERS,
      'unexpected IZVEŠTAJ measured branch layers',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_IZVESTAJ_REPORT_LOCK.platformTracks,
      DEVELOPER_CREATE_IZVESTAJ_PLATFORM_TRACKS,
      'unexpected IZVEŠTAJ platform tracks',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_IZVESTAJ_REPORT_LOCK.reportingLayers,
      DEVELOPER_CREATE_IZVESTAJ_REPORTING_LAYERS,
      'unexpected IZVEŠTAJ reporting layers',
    );
    assert(
      DEVELOPER_CREATE_IZVESTAJ_REPORT_LOCK.requiredAuditBlocks.includes('acceptanceEvidence'),
      'IZVEŠTAJ report lock must require acceptanceEvidence',
    );
  });

  await test('izvestaj alias remains additive-only and keeps canonical branch report fields stable', () => {
    assert(
      DEVELOPER_CREATE_VRH_INTERPRETATION_ALIASES.includes(DEVELOPER_CREATE_VRH_IZVESTAJ_ALIAS),
      'IZVEŠTAJ alias must remain part of the VRH interpretation aliases',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_IZVESTAJ_REQUIRED_BLOCKS,
      [
        'completed',
        'partial',
        'blocked',
        'branchCompletionPercent',
        'platformCompletionPercent',
        'promotionReadinessStatus',
        'nextStep',
        'rolloutPlan',
        'rollbackPlan',
        'humanReviewStatus',
        'downstreamReference',
      ],
      'unexpected izvestaj required blocks',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_IZVESTAJ_REQUIRED_AUDIT_FIELDS,
      [
        'roadmapStageId',
        'measurableOutput',
        'acceptanceEvidence',
        'rolloutPlan',
        'rollbackPlan',
        'humanReviewStatus',
        'downstreamReference',
        'branchCompletionPercent',
        'platformCompletionPercent',
      ],
      'unexpected izvestaj audit fields',
    );
  });

  await test('navigacioni tracker required fields remain stable', () => {
    const expected = [
      'canonicalAlias',
      'status',
      'conflictIntensity',
      'currentWave',
      'auditEvidence',
      'rollbackReadiness',
      'downstreamReference',
    ];
    assertArrayEquals(
      DEVELOPER_CREATE_NAVIGACIONI_SISTEM_SA_TREKEROM_TRACKER_CONTRACT.requiredTrackerFields,
      expected,
      'unexpected navigacioni tracker required fields',
    );
  });

  await test('navigacioni governance outputs remain stable', () => {
    const expected = [
      'promotionFreeze',
      'humanReviewStatus',
      'reviewPosture',
      'releaseAuditSummary',
      'rolloutPlan',
      'rollbackPlan',
    ];
    assertArrayEquals(
      DEVELOPER_CREATE_NAVIGACIONI_SISTEM_SA_TREKEROM_TRACKER_CONTRACT.requiredGovernanceOutputs,
      expected,
      'unexpected navigacioni governance outputs',
    );
  });

  await test('saradnja-ready poslovna ponuda contract stays bounded and summary-safe', () => {
    assert(
      DEVELOPER_CREATE_VRH_INTERPRETATION_ALIASES.includes(DEVELOPER_CREATE_SARADNJA_READY_POSLOVNA_PONUDA_SCOPE_LOCK),
      'POSLOVNA PONUDA alias must remain part of the VRH interpretation aliases',
    );
    assert(
      DEVELOPER_CREATE_VRH_INTERPRETATION_ALIASES.includes(
        DEVELOPER_CREATE_SARADNJA_READY_POSLOVNA_PONUDA_PRETPLATA_SCOPE_LOCK,
      ),
      'POSLOVNA PONUDA / PRETPLATA alias must remain part of the VRH interpretation aliases',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_SARADNJA_READY_BOUNDED_VOCABULARY,
      ['EXTRIMLI', 'EXTRONDOL', 'EXTREM', 'DOK', 'DUK', 'DAK', 'DIK', 'FOR'],
      'unexpected saradnja-ready bounded vocabulary',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_SARADNJA_READY_READINESS_SIGNALS,
      ['offer-clarity', 'consistency', 'collaboration-utility', 'presentation-readiness', 'stability'],
      'unexpected saradnja-ready readiness signals',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_SARADNJA_READY_SUMMARY_SAFE_FIELDS,
      [
        'canonicalAlias',
        'status',
        'blockerReason',
        'watchReasons',
        'reviewPosture',
        'downstreamReference',
        'businessSummary',
        'recommendationLevel',
      ],
      'unexpected saradnja-ready summary-safe fields',
    );
    assert(
      DEVELOPER_CREATE_SARADNJA_READY_RECOMMENDATION_LEVEL === 'EKSTREMNA_PREPORUKA',
      'saradnja-ready recommendation level must stay extreme',
    );
    assert(
      DEVELOPER_CREATE_SARADNJA_READY_VERCEL_COST_TARGETS.primary
      === 'drive-real-vercel-cost-as-close-to-zero-as-possible',
      'unexpected primary Vercel cost target',
    );
    assert(
      DEVELOPER_CREATE_SARADNJA_READY_VERCEL_COST_TARGETS.fallback
      === 'if-zero-is-not-possible-use-controlled-enterprise-autopay-with-hard-guardrails',
      'unexpected fallback Vercel cost target',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_SARADNJA_READY_VERCEL_GOVERNANCE_BLOCKERS,
      [
        'confirm-enterprise-governed-model',
        'resolve-invoice-5JJYX4KN-0015-amount-385.52-usd',
        'capture-invoice-and-payment-evidence-package',
        'lock-autopay-to-corporate-method-only',
        'configure-finance-channel-notifications',
        'enable-finops-thresholds-50-75-90-100',
        'enable-monthly-reconciliation',
        'enable-quarterly-vendor-review',
      ],
      'unexpected Vercel governance blockers',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_SARADNJA_READY_EXTREM_COST_HOTSPOTS,
      [
        'preview-deployment-churn',
        'duplicate-github-actions-and-vercel-builds',
        'cron-and-scheduled-route-usage',
        'analytics-and-add-on-usage',
        'bandwidth-image-and-function-usage',
        'unnecessary-branch-deployments',
        'artifact-cache-and-retention-patterns',
      ],
      'unexpected EXTREM cost hotspots',
    );
    assert(
      DEVELOPER_CREATE_SARADNJA_READY_EXTRONDOL_NEGOTIATION_QUESTIONS.length === 14,
      'unexpected number of EXTRONDOL negotiation questions',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_SARADNJA_READY_COST_TO_ZERO_FALLBACK_PLAN,
      [
        'reduce-preview-deployment-churn',
        'keep-vercel-only-for-frontend-ssr-and-lightweight-apis',
        'remove-duplicate-build-and-deploy-steps-from-github-actions-where-vercel-already-builds',
        'disable-nonessential-scheduled-surfaces',
        'keep-only-operationally-justified-add-ons',
        'measure-cost-per-deployment-and-cost-per-active-user',
      ],
      'unexpected cost-to-zero fallback plan',
    );
    assert(
      DEVELOPER_CREATE_SARADNJA_READY_AUTOMATIC_SUBSCRIPTION_GATES.activationCriteria.includes('payment-verification')
      && DEVELOPER_CREATE_SARADNJA_READY_AUTOMATIC_SUBSCRIPTION_GATES.noSkippedWavePhases,
      'automatic subscription gates must keep payment verification and no-skipped-wave lock',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_SARADNJA_READY_FINAL_AUDIT_PACKAGE_CONTENTS,
      [
        'vercel-business-offer',
        'negotiation-question-list',
        'cost-to-zero-fallback-plan',
        'rollout-plan',
        'rollback-plan',
        'kpi-impact-summary',
        'downstream-summary-only-reference',
      ],
      'unexpected final audit package contents',
    );
  });

  await test('DOKSA pretplata case stays additive-only, gated, and private-message safe', () => {
    assert(
      DEVELOPER_CREATE_SARADNJA_READY_DOKSA_PRETPLATA_CASE.canonicalSubscriberLegalEntity ===
        'DOKSA d.o.o. Zrenjanin',
      'DOKSA legal entity must remain canonical',
    );
    assert(
      DEVELOPER_CREATE_SARADNJA_READY_DOKSA_PRETPLATA_CASE.intakeContactOrAuthorizedSignerRole ===
        'private-intake-contact-or-authorized-signer',
      'DOKSA signer/contact role must stay private-intake scoped',
    );
    assert(
      DEVELOPER_CREATE_SARADNJA_READY_DOKSA_PRETPLATA_CASE.intakeContactOrAuthorizedSignerRequiresValidation,
      'DOKSA signer/contact validation requirement must remain enabled',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_SARADNJA_READY_DOKSA_PRETPLATA_CASE.activationHardGates,
      ['contract-approval', 'compliance-review', 'human-review', 'payment-verification', 'downstream-reference'],
      'unexpected DOKSA pretplata hard gates',
    );
    assert(
      DEVELOPER_CREATE_SARADNJA_READY_DOKSA_PRETPLATA_CASE.directEmploymentRequestMessageHandling
        .publicSafeSummaryAllowed === false,
      'private employment-request message must stay out of public-safe summary',
    );
    assert(
      DEVELOPER_CREATE_SARADNJA_READY_DOKSA_PRETPLATA_CASE.directEmploymentRequestMessageHandling
        .downstreamSyncAllowed === false,
      'private employment-request message must stay out of downstream sync',
    );
    assert(
      DEVELOPER_CREATE_SARADNJA_READY_DOKSA_PRETPLATA_CASE.acceptanceCriteria
        .noActivationWithoutConfirmedIdentityContractAndPayment,
      'identity, contract, and payment must remain mandatory before activation',
    );
  });

  await test('kraljevski sat track remains additive-only and summary-safe', () => {
    assert(
      DEVELOPER_CREATE_VRH_INTERPRETATION_ALIASES.includes(DEVELOPER_CREATE_VRH_KRALJEVSKI_SAT_ALIAS),
      'KRALJEVSKI SAT alias must remain part of the VRH interpretation aliases',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_KRALJEVSKI_SAT_BOUNDED_TOKEN_SET,
      ['DIP', 'KAR', 'DUR', 'CUR', 'RET', 'DOK', 'OKOT'],
      'unexpected kraljevski sat bounded token set',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_KRALJEVSKI_SAT_READINESS_LANGUAGE,
      ['READY', 'WATCH', 'BLOCKED'],
      'unexpected kraljevski sat readiness language',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_KRALJEVSKI_SAT_SUMMARY_SAFE_FIELDS,
      [
        'canonicalAlias',
        'status',
        'blockerReason',
        'watchReasons',
        'reviewPosture',
        'downstreamReference',
        'kraljevskiSatTokenSummary',
        'fallbackInputStatus',
      ],
      'unexpected kraljevski sat summary-safe fields',
    );
  });

  await test('medalje srbske track remains additive-only, audit-gated, and summary-safe', () => {
    assert(
      DEVELOPER_CREATE_VRH_INTERPRETATION_ALIASES.includes(DEVELOPER_CREATE_VRH_MEDALJE_SRBSKE_ALIAS),
      'MEDALJE SRBSKE alias must remain part of the VRH interpretation aliases',
    );
    assert(
      DEVELOPER_CREATE_MEDALJE_SRBSKE_SCOPE_STATEMENT.includes('additive-only bounded traka'),
      'MEDALJE SRBSKE scope statement must preserve additive-only wording',
    );
    assert(
      DEVELOPER_CREATE_MEDALJE_SRBSKE_SCOPE_STATEMENT.includes('bez novih runtime ruta'),
      'MEDALJE SRBSKE scope statement must forbid new runtime routes',
    );
    assert(
      DEVELOPER_CREATE_MEDALJE_SRBSKE_SCOPE_STATEMENT.includes(
        'bez paralelnog source-of-truth modela',
      ),
      'MEDALJE SRBSKE scope statement must forbid parallel source-of-truth models',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_MEDALJE_SRBSKE_READINESS_LANGUAGE,
      ['READY', 'WATCH', 'BLOCKED'],
      'unexpected MEDALJE SRBSKE readiness language',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_MEDALJE_SRBSKE_FALLBACK_INPUTS,
      ['NaN', 'Infinity', 'empty', 'conflict'],
      'unexpected MEDALJE SRBSKE fallback inputs',
    );
    assert(
      DEVELOPER_CREATE_MEDALJE_SRBSKE_LAYER_OWNERSHIP_LOCK.dokDikFor === 'EXTREM' &&
        DEVELOPER_CREATE_MEDALJE_SRBSKE_LAYER_OWNERSHIP_LOCK.dakDuk === 'EXTRONDOL' &&
        DEVELOPER_CREATE_MEDALJE_SRBSKE_LAYER_OWNERSHIP_LOCK.spajaKod === 'audit-safe-summary-only',
      'MEDALJE SRBSKE ownership lock mismatch',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_MEDALJE_SRBSKE_ACCEPTANCE_CRITERIA,
      [
        'preserve-vrh-canonical-lock-and-bounded-vocabulary',
        'keep-track-additive-only-no-new-routes-and-no-parallel-source-of-truth',
        'preserve-ownership-split-dok-dik-for-extrem-dak-duk-extrondol-spaja-kod-summary-only',
        'require-ready-watch-blocked-with-deterministic-fallback-input-boundaries',
        'require-human-review-release-audit-summary-and-rollback-readiness-before-promotion',
        'require-downstream-reference-docs-multi-repo-links-summary-only',
      ],
      'unexpected MEDALJE SRBSKE acceptance criteria',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_MEDALJE_SRBSKE_SUMMARY_SAFE_FIELDS,
      [
        'canonicalAlias',
        'status',
        'blockerReason',
        'watchReasons',
        'reviewPosture',
        'humanReviewStatus',
        'releaseAuditSummaryRequired',
        'rollbackRequiredBeforePromotion',
        'downstreamReference',
        'fallbackInputStatus',
      ],
      'unexpected MEDALJE SRBSKE summary-safe fields',
    );
    assert(
      manifest.includes('### 2.2.16) MEDALJE SRBSKE bounded traka') &&
        manifest.includes('`DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == MEDALJE SRBSKE`') &&
        manifest.includes('`EXTRIMLI EXTRONDOL EXTREM DOK DUK DAK DIK FOR`'),
      'manifest MEDALJE SRBSKE bounded-track markers missing',
    );
    assert(
      vrhDoc.includes('## MEDALJE SRBSKE (bounded extension)') &&
        vrhDoc.includes('`DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == MEDALJE SRBSKE`') &&
        vrhDoc.includes('human-review, release-audit summary, rollback readiness'),
      'VRH doc MEDALJE SRBSKE markers missing',
    );
    assert(
      multiRepoLinks.includes('Developer/Create `MEDALJE SRBSKE` bounded track') &&
        multiRepoLinks.includes('do not promise dedicated `medaljeSrbskeTrack` runtime surfaces') &&
        multiRepoLinks.includes('`DAK/DUK=EXTRONDOL`'),
      'multi-repo links MEDALJE SRBSKE row missing',
    );
  });

  await test('automatska popravka svega track remains additive-only, normalized, and summary-safe', () => {
    assert(
      DEVELOPER_CREATE_VRH_INTERPRETATION_ALIASES.includes(
        DEVELOPER_CREATE_VRH_AUTOMATSKA_POPRAVKA_SVEGA_ALIAS,
      ),
      'AUTOMATSKA POPRAVKA SVEGA canonical alias must remain part of the VRH interpretation aliases',
    );
    assert(
      DEVELOPER_CREATE_VRH_INTERPRETATION_ALIASES.includes(
        DEVELOPER_CREATE_VRH_ATOMATSKA_POPRAVKA_SVEGA_RAW_ALIAS,
      ),
      'ATOMATSKA POPRAVKA SVEGA raw alias must remain part of the VRH interpretation aliases as supplemental normalization input',
    );
    assert(
      DEVELOPER_CREATE_AUTOMATSKA_POPRAVKA_SVEGA_SCOPE_STATEMENT.includes('additive-only bounded repair/governance traka'),
      'AUTOMATSKA POPRAVKA SVEGA scope statement must preserve additive-only repair/governance wording',
    );
    assert(
      DEVELOPER_CREATE_AUTOMATSKA_POPRAVKA_SVEGA_SCOPE_STATEMENT.includes('bez novog runtime engine-a'),
      'AUTOMATSKA POPRAVKA SVEGA scope statement must forbid a new runtime engine',
    );
    assert(
      DEVELOPER_CREATE_AUTOMATSKA_POPRAVKA_SVEGA_SCOPE_STATEMENT.includes(
        'ATOMATSKA POPRAVKA SVEGA',
      ),
      'AUTOMATSKA POPRAVKA SVEGA scope statement must document raw typo alias normalization',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_AUTOMATSKA_POPRAVKA_SVEGA_INPUT_NORMALIZATION_ALIASES,
      [
        DEVELOPER_CREATE_VRH_ATOMATSKA_POPRAVKA_SVEGA_RAW_ALIAS,
      ],
      'unexpected AUTOMATSKA POPRAVKA SVEGA normalization aliases',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_AUTOMATSKA_POPRAVKA_SVEGA_FALLBACK_INPUTS,
      [
        'NaN',
        'Infinity',
        'empty',
        'conflict',
        'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == ATOMATSKA POPRAVKA SVEGA',
      ],
      'unexpected AUTOMATSKA POPRAVKA SVEGA fallback inputs',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_AUTOMATSKA_POPRAVKA_SVEGA_ACCEPTANCE_CRITERIA,
      [
        'preserve-vrh-canonical-lock-and-bounded-vocabulary',
        'normalize-atomatska-input-to-automatska-canonical-alias-without-new-runtime-engine',
        'keep-track-additive-only-no-new-routes-and-no-parallel-source-of-truth',
        'preserve-ownership-split-dok-dik-for-extrem-dak-duk-extrondol-spaja-kod-summary-only',
        'require-ready-watch-blocked-repair-summary-and-deterministic-fallback-boundaries',
        'require-human-review-wawe-freeze-rollout-rollback-and-release-audit-before-promotion',
        'require-summary-only-downstream-reference-docs-multi-repo-links-for-io-openui-ao',
      ],
      'unexpected AUTOMATSKA POPRAVKA SVEGA acceptance criteria',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_AUTOMATSKA_POPRAVKA_SVEGA_SUMMARY_SAFE_FIELDS,
      [
        'canonicalAlias',
        'status',
        'blockerReason',
        'watchReasons',
        'reviewPosture',
        'humanReviewStatus',
        'rolloutPlan',
        'rollbackPlan',
        'releaseAuditSummary',
        'downstreamReference',
        'repairSummary',
        'fallbackInputStatus',
      ],
      'unexpected AUTOMATSKA POPRAVKA SVEGA summary-safe fields',
    );
    assert(
      manifest.includes('### 2.2.17) AUTOMATSKA POPRAVKA SVEGA bounded traka') &&
        manifest.includes('`DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == AUTOMATSKA POPRAVKA SVEGA`') &&
        manifest.includes('sirovi unos `DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == ATOMATSKA POPRAVKA SVEGA` ostaje samo supplemental/input-normalization alias'),
      'manifest AUTOMATSKA POPRAVKA SVEGA bounded-track markers missing',
    );
    assert(
      vrhDoc.includes('## AUTOMATSKA POPRAVKA SVEGA (bounded extension)') &&
        vrhDoc.includes('`DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == AUTOMATSKA POPRAVKA SVEGA`') &&
        vrhDoc.includes('Sirovi unos `DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == ATOMATSKA POPRAVKA SVEGA` ostaje samo supplemental/input-normalization alias'),
      'VRH doc AUTOMATSKA POPRAVKA SVEGA markers missing',
    );
    assert(
      multiRepoLinks.includes('Developer/Create `AUTOMATSKA POPRAVKA SVEGA` bounded track') &&
        multiRepoLinks.includes('spajaKod.publicSignals.automatskaPopravkaSvegaStatus') &&
        multiRepoLinks.includes('treat raw `ATOMATSKA...` only as supplemental normalization input'),
      'multi-repo links AUTOMATSKA POPRAVKA SVEGA row missing',
    );
  });

  await test('kraljevski rad track remains bounded with strict sequence and summary-safe contract', () => {
    assert(
      DEVELOPER_CREATE_VRH_INTERPRETATION_ALIASES.includes(DEVELOPER_CREATE_VRH_KRALJEVSKI_RAD_ALIAS),
      'KRALJEVSKI RAD alias must remain part of the VRH interpretation aliases',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_KRALJEVSKI_RAD_BOUNDED_TOKEN_SEQUENCE,
      ['DIR', 'DUR', 'DAR', 'RER', 'DIK', 'DUR', 'DAR', 'DJOMPA', 'DOKAT', 'KRUNA', 'ZOMBAT', 'DUKUS', 'NIKSON', 'KITAN', 'DIKAT', 'KVATRO', 'KALIMERO'],
      'unexpected kraljevski rad bounded token sequence',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_KRALJEVSKI_RAD_FALLBACK_INPUTS,
      ['NaN', 'Infinity', 'empty', 'conflict'],
      'unexpected kraljevski rad fallback inputs',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_KRALJEVSKI_RAD_SUMMARY_SAFE_FIELDS,
      ['canonicalAlias', 'status', 'blockerReason', 'watchReasons', 'reviewPosture', 'downstreamReference', 'sequenceValidationSummary', 'tokenOrderStatus', 'duplicateRuleStatus', 'fallbackInputStatus'],
      'unexpected kraljevski rad summary-safe fields',
    );
  });

  await test('montezacija alias remains additive-only and bounded', () => {
    assert(
      DEVELOPER_CREATE_VRH_INTERPRETATION_ALIASES.includes(DEVELOPER_CREATE_VRH_MONTEZACIJA_ALIAS),
      'MONTEZACIJA alias must remain part of the VRH interpretation aliases',
    );
    assert(
      DEVELOPER_CREATE_MONTEZACIJA_CANONICAL_ALIAS === DEVELOPER_CREATE_VRH_MONTEZACIJA_ALIAS,
      'MONTEZACIJA canonical alias mismatch',
    );
    assert(
      DEVELOPER_CREATE_MONTEZACIJA_SCOPE_STATEMENT.includes('additive-only bounded alias'),
      'MONTEZACIJA scope statement must preserve additive-only boundary',
    );
    assert(
      DEVELOPER_CREATE_MONTEZACIJA_ROLE_CLASSIFICATION === 'additive-only-bounded-montezacija-alias-track',
      'MONTEZACIJA role classification mismatch',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_MONTEZACIJA_FALLBACK_INPUTS,
      ['NaN', 'Infinity', 'empty', 'conflict', 'unknown-token'],
      'unexpected MONTEZACIJA fallback inputs',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_MONTEZACIJA_SUMMARY_SAFE_FIELDS,
      ['canonicalAlias', 'status', 'blockerReason', 'watchReasons', 'reviewPosture', 'downstreamReference', 'montezacijaSummary', 'montezacijaNadMontezacijamaApprovalPackage', 'kraljevskaMontezacijaApprovalPackage'],
      'unexpected MONTEZACIJA summary-safe fields',
    );
    assert(
      DEVELOPER_CREATE_VRH_INTERPRETATION_ALIASES.includes(
        DEVELOPER_CREATE_VRH_MONTEZACIJA_NAD_MONTEZACIJAMA_ALIAS,
      ),
      'MONTEZACIJA NAD MONTEZACIJAMA alias must remain part of the VRH interpretation aliases',
    );
    assert(
      DEVELOPER_CREATE_MONTEZACIJA_NAD_MONTEZACIJAMA_CANONICAL_ALIAS
        === DEVELOPER_CREATE_VRH_MONTEZACIJA_NAD_MONTEZACIJAMA_ALIAS,
      'MONTEZACIJA NAD MONTEZACIJAMA canonical alias mismatch',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_MONTEZACIJA_NAD_MONTEZACIJAMA_APPROVAL_ACCEPTANCE_CRITERIA,
      [
        'preserve-vrh-canonical-lock-and-bounded-vocabulary',
        'keep-alias-additive-only-no-new-routes-and-no-parallel-source-of-truth',
        'preserve-ownership-split-dok-dik-for-extrem-dak-duk-extrondol-spaja-kod-summary-only',
        'require-measurable-status-blocker-review-rollout-rollback-downstream-reference',
        'require-human-review-and-release-audit-summary-before-promotion',
        'require-rollback-readiness-before-promotion',
      ],
      'unexpected MONTEZACIJA NAD MONTEZACIJAMA approval acceptance criteria',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_MONTEZACIJA_NAD_MONTEZACIJAMA_APPROVAL_SUMMARY_SAFE_FIELDS,
      [
        'canonicalAlias',
        'status',
        'reviewPosture',
        'humanReviewStatus',
        'releaseAuditSummaryRequired',
        'rollbackRequiredBeforePromotion',
        'downstreamReference',
      ],
      'unexpected MONTEZACIJA NAD MONTEZACIJAMA approval summary-safe fields',
    );
    assert(
      DEVELOPER_CREATE_VRH_INTERPRETATION_ALIASES.includes(DEVELOPER_CREATE_VRH_KRALJEVSKA_MONTEZACIJA_ALIAS),
      'KRALJEVSKA MONTEZACIJA alias must remain part of the VRH interpretation aliases',
    );
    assert(
      DEVELOPER_CREATE_KRALJEVSKA_MONTEZACIJA_CANONICAL_ALIAS
        === DEVELOPER_CREATE_VRH_KRALJEVSKA_MONTEZACIJA_ALIAS,
      'KRALJEVSKA MONTEZACIJA canonical alias mismatch',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_KRALJEVSKA_MONTEZACIJA_APPROVAL_ACCEPTANCE_CRITERIA,
      [
        'preserve-vrh-canonical-lock-and-bounded-vocabulary',
        'confirm-kraljevska-montezacija-as-additive-meta-layer-over-montezacija-chain',
        'keep-alias-additive-only-no-new-routes-and-no-parallel-source-of-truth',
        'preserve-ownership-split-dok-dik-for-extrem-dak-duk-extrondol-spaja-kod-summary-only',
        'require-human-review-release-audit-rollout-rollback-and-downstream-reference-before-promotion',
      ],
      'unexpected KRALJEVSKA MONTEZACIJA approval acceptance criteria',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_KRALJEVSKA_MONTEZACIJA_APPROVAL_SUMMARY_SAFE_FIELDS,
      [
        'canonicalAlias',
        'status',
        'blockerReason',
        'reviewPosture',
        'humanReviewStatus',
        'releaseAuditSummaryRequired',
        'rollbackRequiredBeforePromotion',
        'downstreamReference',
      ],
      'unexpected KRALJEVSKA MONTEZACIJA approval summary-safe fields',
    );
  });

  await test('elektronski potpis alias remains additive-only, identity-gated, and summary-safe', () => {
    assert(
      DEVELOPER_CREATE_VRH_INTERPRETATION_ALIASES.includes(DEVELOPER_CREATE_VRH_ELEKTRONSKI_POTPIS_ALIAS),
      'ELEKTRONSKI POTPIS alias must remain part of the VRH interpretation aliases',
    );
    assert(
      DEVELOPER_CREATE_ELEKTRONSKI_POTPIS_CANONICAL_ALIAS === DEVELOPER_CREATE_VRH_ELEKTRONSKI_POTPIS_ALIAS,
      'ELEKTRONSKI POTPIS canonical alias mismatch',
    );
    assert(
      DEVELOPER_CREATE_ELEKTRONSKI_POTPIS_SCOPE_STATEMENT.includes('potvrdom identiteta'),
      'ELEKTRONSKI POTPIS scope statement must keep identity confirmation mandatory',
    );
    assert(
      DEVELOPER_CREATE_ELEKTRONSKI_POTPIS_ROLE_CLASSIFICATION === 'additive-only-bounded-elektronski-potpis-alias-track',
      'ELEKTRONSKI POTPIS role classification mismatch',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_ELEKTRONSKI_POTPIS_FALLBACK_INPUTS,
      ['NaN', 'Infinity', 'empty', 'conflict', 'identity-unverified', 'signature-display-missing'],
      'unexpected ELEKTRONSKI POTPIS fallback inputs',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_ELEKTRONSKI_POTPIS_GOVERNANCE_REQUIRED_OUTPUTS,
      ['humanReviewStatus', 'releaseAuditSummary', 'rolloutPlan', 'rollbackPlan', 'downstreamReference'],
      'unexpected ELEKTRONSKI POTPIS governance outputs',
    );
    assert(
      DEVELOPER_CREATE_ELEKTRONSKI_POTPIS_RELEASE_AUDIT_SUMMARY_SIGNAL === 'releaseAuditSummary',
      'ELEKTRONSKI POTPIS release audit summary signal mismatch',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_ELEKTRONSKI_POTPIS_SUMMARY_SAFE_FIELDS,
      ['canonicalAlias', 'status', 'reviewPosture', 'identityConfirmationStatus', 'signatureDisplaySummary', 'downstreamReference'],
      'unexpected ELEKTRONSKI POTPIS summary-safe fields',
    );
  });

  await test('markan alias remains additive-only with locked ownership and governance outputs', () => {
    assert(
      DEVELOPER_CREATE_VRH_INTERPRETATION_ALIASES.includes(DEVELOPER_CREATE_VRH_MARKAN_ALIAS),
      'MARKAN alias must remain part of the VRH interpretation aliases',
    );
    assert(
      DEVELOPER_CREATE_MARKAN_CANONICAL_ALIAS === DEVELOPER_CREATE_VRH_MARKAN_ALIAS,
      'MARKAN canonical alias mismatch',
    );
    assert(
      DEVELOPER_CREATE_MARKAN_SCOPE_STATEMENT.includes('additive-only bounded'),
      'MARKAN scope statement must preserve additive-only boundary',
    );
    assert(
      DEVELOPER_CREATE_MARKAN_ROLE_CLASSIFICATION === 'additive-only-bounded-markan-alias-track',
      'MARKAN role classification mismatch',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_MARKAN_GOVERNANCE_REQUIRED_OUTPUTS,
      ['readinessStatus', 'blockerReason', 'watchReasons', 'humanReviewStatus', 'rolloutPlan', 'rollbackPlan', 'releaseAuditSummary', 'downstreamReference'],
      'unexpected MARKAN governance outputs',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_MARKAN_SUMMARY_SAFE_FIELDS,
      ['canonicalAlias', 'readinessStatus', 'blockerReason', 'watchReasons', 'humanReviewStatus', 'rolloutPlan', 'rollbackPlan', 'releaseAuditSummary', 'downstreamReference'],
      'unexpected MARKAN summary-safe fields',
    );
  });

  await test('vinogradi grocka restoran alias remains bounded and governance-ready', () => {
    assert(
      DEVELOPER_CREATE_VRH_INTERPRETATION_ALIASES.includes(
        DEVELOPER_CREATE_VRH_VINOGRADI_GROCKA_RESTORAN_ALIAS,
      ),
      'VINOGRADI GROCKA, RESTORAN alias must remain part of the VRH interpretation aliases',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_VINOGRADI_GROCKA_RESTORAN_LEADERSHIP_TRANSITION.appointedExecutiveDirectors,
      ['JONAČIĆ SLAVIŠA', 'JONAČIĆ MARKO'],
      'unexpected VINOGRADI GROCKA, RESTORAN appointed executive directors',
    );
    assert(
      DEVELOPER_CREATE_VINOGRADI_GROCKA_RESTORAN_LEADERSHIP_TRANSITION.mandatoryAuditTrail,
      'VINOGRADI GROCKA, RESTORAN audit trail must stay mandatory',
    );
    assert(
      DEVELOPER_CREATE_VINOGRADI_GROCKA_RESTORAN_LEADERSHIP_TRANSITION.mandatoryEffectiveDate,
      'VINOGRADI GROCKA, RESTORAN effective date must stay mandatory',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_VINOGRADI_GROCKA_RESTORAN_SUMMARY_SAFE_FIELDS,
      [
        'canonicalAlias',
        'status',
        'blockerReason',
        'watchReasons',
        'reviewPosture',
        'downstreamReference',
        'effectiveDate',
        'auditTrailReference',
        'leadershipTransitionSummary',
      ],
      'unexpected VINOGRADI GROCKA, RESTORAN summary-safe fields',
    );
  });

  await test('poslovna ponuda / železara d.o.o. smederevo alias remains additive-only, intake-structured, and privacy-safe', () => {
    assert(
      DEVELOPER_CREATE_VRH_INTERPRETATION_ALIASES.includes(
        DEVELOPER_CREATE_VRH_POSLOVNA_PONUDA_ZELEZARA_DOO_ALIAS,
      ),
      'POSLOVNA PONUDA / ŽELEZARA D.O.O. SMEDEREVO alias must remain part of the VRH interpretation aliases',
    );
    assert(
      DEVELOPER_CREATE_POSLOVNA_PONUDA_ZELEZARA_DOO_URGENT_MEETING_INTAKE_PACKAGE.infrastructureRequirements
        .storageSqm === 2000,
      'ŽELEZARA urgent-meeting intake storage requirement must stay 2000m²',
    );
    assert(
      DEVELOPER_CREATE_POSLOVNA_PONUDA_ZELEZARA_DOO_URGENT_MEETING_INTAKE_PACKAGE.infrastructureRequirements
        .truckParkingSqm === 5000,
      'ŽELEZARA urgent-meeting intake truck-parking requirement must stay 5000m²',
    );
    assert(
      DEVELOPER_CREATE_POSLOVNA_PONUDA_ZELEZARA_DOO_URGENT_MEETING_INTAKE_PACKAGE.privacyCompliance
        .phoneNumbersPublicSummaryAllowed === false,
      'ŽELEZARA phone numbers must remain blocked from public summary',
    );
    assert(
      DEVELOPER_CREATE_POSLOVNA_PONUDA_ZELEZARA_DOO_URGENT_MEETING_INTAKE_PACKAGE.privacyCompliance
        .phoneNumbersDownstreamSyncAllowed === false,
      'ŽELEZARA phone numbers must remain blocked from downstream sync',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_POSLOVNA_PONUDA_ZELEZARA_DOO_SUMMARY_SAFE_FIELDS,
      [
        'canonicalAlias',
        'status',
        'blockerReason',
        'watchReasons',
        'reviewPosture',
        'downstreamReference',
        'urgentMeetingSummary',
        'businessCollaborationStatus',
        'locationReadinessStatus',
        'operationsPlanStatus',
        'procurementLogisticsStatus',
        'referenceListStatus',
      ],
      'unexpected POSLOVNA PONUDA / ŽELEZARA D.O.O. SMEDEREVO summary-safe fields',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_POSLOVNA_PONUDA_ZELEZARA_DOO_FALLBACK_INPUTS,
      ['NaN', 'Infinity', 'empty', 'conflict'],
      'unexpected POSLOVNA PONUDA / ŽELEZARA D.O.O. SMEDEREVO fallback inputs',
    );
  });

  await test('ALATI / RADIONICA alias stays additive-only and keeps Napoleon-bound RANDOM posture', () => {
    assert(
      DEVELOPER_CREATE_VRH_INTERPRETATION_ALIASES.includes(DEVELOPER_CREATE_VRH_ALATI_RADIONICA_ALIAS),
      'ALATI / RADIONICA alias must remain part of the VRH interpretation aliases',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_ALATI_RADIONICA_BOUNDED_TOKEN_SEQUENCE,
      ['RIN', 'KUR', 'ZUR', 'ENDER', 'ĐUKAR', 'ZINDAR', 'ONDOR', 'DOKER', 'VIGAR', 'DOBER', 'ZUMBUR', 'ZAKAL', 'DOMBAR', 'ĐUKAR 2', 'OKAR', 'OMBER', 'KSION', 'DIPET', 'OPAL', 'DUET-KALER', 'ZIDION'],
      'unexpected ALATI / RADIONICA token sequence',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_ALATI_RADIONICA_FALLBACK_INPUTS,
      ['NaN', 'Infinity', 'empty', 'conflict', 'unknown-token'],
      'unexpected ALATI / RADIONICA fallback inputs',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_ALATI_RADIONICA_SUMMARY_SAFE_FIELDS,
      ['canonicalAlias', 'status', 'blockerReason', 'watchReasons', 'reviewPosture', 'downstreamReference', 'sequenceValidationSummary', 'tokenOrderStatus', 'duplicateRuleStatus', 'fallbackInputStatus', 'randomSelectionScopeStatement'],
      'unexpected ALATI / RADIONICA summary-safe fields',
    );
    assert(DEVELOPER_CREATE_ALATI_RADIONICA_TOKEN_POLICY.ondorIsCanonical, 'ALATI / RADIONICA must keep ONDOR canonical');
    assert(
      DEVELOPER_CREATE_ALATI_RADIONICA_TOKEN_POLICY.djukarVariantMode === 'ĐUKAR and ĐUKAR 2 are distinct canonical singletons',
      'ALATI / RADIONICA must keep distinct ĐUKAR variant policy',
    );
    assert(
      manifest.includes('ALATI / RADIONICA') && manifest.includes('Napoleon Diskaveri bounded-selection kanal'),
      'Developer/Create manifest must document ALATI / RADIONICA and Napoleon-bound RANDOM posture',
    );
    assert(
      vrhDoc.includes('ALATI / RADIONICA') && vrhDoc.includes('RANDOM selekcija svega'),
      'VRH doc must document ALATI / RADIONICA and RANDOM linkage',
    );
    assert(
      extrimliDoc.includes('ALATI / RADIONICA') && extrimliDoc.includes('ONDOR'),
      'EXTRIMLI doc must document ALATI / RADIONICA bounded token policy',
    );
    assert(
      multiRepoLinks.includes('Developer/Create `ALATI / RADIONICA` bounded package'),
      'multi-repo links must include ALATI / RADIONICA downstream row',
    );
  });

  console.log(`\n📊 developer-create-vrh-contract: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    console.error('Failures:');
    failures.forEach((failure) => console.error(` - ${failure}`));
    process.exitCode = 1;
  }
}

void runTests();
