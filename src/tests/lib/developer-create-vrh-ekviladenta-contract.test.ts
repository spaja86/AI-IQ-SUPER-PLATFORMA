import {
  DEVELOPER_CREATE_KRALJEVSKI_SAT_BOUNDED_TOKEN_SET,
  DEVELOPER_CREATE_KRALJEVSKI_SAT_READINESS_LANGUAGE,
  DEVELOPER_CREATE_KRALJEVSKI_RAD_BOUNDED_TOKEN_SEQUENCE,
  DEVELOPER_CREATE_KRALJEVSKI_RAD_FALLBACK_INPUTS,
  DEVELOPER_CREATE_KRALJEVSKI_RAD_SUMMARY_SAFE_FIELDS,
  DEVELOPER_CREATE_KRALJEVSKI_SAT_SUMMARY_SAFE_FIELDS,
  DEVELOPER_CREATE_SARADNJA_READY_BOUNDED_VOCABULARY,
  DEVELOPER_CREATE_SARADNJA_READY_DOKSA_PRETPLATA_CASE,
  DEVELOPER_CREATE_SARADNJA_READY_POSLOVNA_PONUDA_SCOPE_LOCK,
  DEVELOPER_CREATE_SARADNJA_READY_POSLOVNA_PONUDA_PRETPLATA_SCOPE_LOCK,
  DEVELOPER_CREATE_SARADNJA_READY_READINESS_SIGNALS,
  DEVELOPER_CREATE_SARADNJA_READY_RECOMMENDATION_LEVEL,
  DEVELOPER_CREATE_SARADNJA_READY_SUMMARY_SAFE_FIELDS,
  DEVELOPER_CREATE_IZVESTAJ_REPORT_LOCK,
  DEVELOPER_CREATE_IZVESTAJ_SCOPE_STATEMENT,
  DEVELOPER_CREATE_VRH_KRALJEVSKI_SAT_ALIAS,
  DEVELOPER_CREATE_VRH_KRALJEVSKI_RAD_ALIAS,
  DEVELOPER_CREATE_VRH_VINOGRADI_GROCKA_RESTORAN_ALIAS,
  DEVELOPER_CREATE_VRH_IZVESTAJ_ALIAS,
  DEVELOPER_CREATE_VRH_POSLOVNA_PONUDA_ZELEZARA_DOO_ALIAS,
  DEVELOPER_CREATE_NAVIGACIONI_SISTEM_SA_TREKEROM_TRACKER_CONTRACT,
  DEVELOPER_CREATE_VINOGRADI_GROCKA_RESTORAN_LEADERSHIP_TRANSITION,
  DEVELOPER_CREATE_VINOGRADI_GROCKA_RESTORAN_SUMMARY_SAFE_FIELDS,
  DEVELOPER_CREATE_POSLOVNA_PONUDA_ZELEZARA_DOO_URGENT_MEETING_INTAKE_PACKAGE,
  DEVELOPER_CREATE_POSLOVNA_PONUDA_ZELEZARA_DOO_SUMMARY_SAFE_FIELDS,
  DEVELOPER_CREATE_POSLOVNA_PONUDA_ZELEZARA_DOO_FALLBACK_INPUTS,
  DEVELOPER_CREATE_VRH_INTERPRETATION_ALIASES,
  DEVELOPER_CREATE_VRH_NAVIGACIONI_SISTEM_SA_TREKEROM_ALIAS,
} from '../../lib/extrimli/developer-create-vrh-ekviladenta-contract';

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

  await test('navigacioni alias is registered in interpretation aliases', () => {
    assert(
      DEVELOPER_CREATE_VRH_INTERPRETATION_ALIASES.includes(
        DEVELOPER_CREATE_VRH_NAVIGACIONI_SISTEM_SA_TREKEROM_ALIAS,
      ),
      'NAVIGACIONI SISTEM SA TREKEROM alias must be present in interpretation aliases',
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
      ['docs', 'types', 'routes', 'tests', 'workflows'],
      'unexpected IZVEŠTAJ measured branch layers',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_IZVESTAJ_REPORT_LOCK.platformTracks,
      ['technical-track', 'governance-track', 'public-boundary-track', 'business-track'],
      'unexpected IZVEŠTAJ platform tracks',
    );
    assertArrayEquals(
      DEVELOPER_CREATE_IZVESTAJ_REPORT_LOCK.reportingLayers,
      ['EXTREM', 'EXTRONDOL', 'SPAJA KOD'],
      'unexpected IZVEŠTAJ reporting layers',
    );
    assert(
      DEVELOPER_CREATE_IZVESTAJ_REPORT_LOCK.requiredAuditBlocks.includes('acceptanceEvidence'),
      'IZVEŠTAJ report lock must require acceptanceEvidence',
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

  console.log(`\n📊 developer-create-vrh-contract: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    console.error('Failures:');
    failures.forEach((failure) => console.error(` - ${failure}`));
    process.exitCode = 1;
  }
}

void runTests();
