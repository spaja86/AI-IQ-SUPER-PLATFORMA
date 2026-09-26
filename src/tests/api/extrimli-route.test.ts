import type { NextRequest } from 'next/server';
import { GET as getDestructionHealth } from '../../app/api/extrimli/destruction/health/route';
import { GET as getDestructionAssets } from '../../app/api/extrimli/destruction/assets/route';
import { GET as getDestructionAsset } from '../../app/api/extrimli/destruction/assets/[id]/route';
import { POST as postDestruction } from '../../app/api/extrimli/destruction/route';
import { POST as postDestructionPreview } from '../../app/api/extrimli/destruction/preview/route';
import { POST as postReadVoice } from '../../app/api/extrimli/read-voice/route';
import { GET as getExtendol } from '../../app/api/extrimli/extendol/route';
import { GET as getKoron } from '../../app/api/extrimli/koron/route';
import { GET as getExtrondend } from '../../app/api/extrimli/extrondend/route';
import { GET as getExtrondol } from '../../app/api/extrimli/extrondol/route';
import { GET as getExtrem } from '../../app/api/extrimli/extrem/route';
import { GET as getSpajaKod } from '../../app/api/extrimli/spaja-kod/route';
import { GET as getDuelKing, POST as postDuelKing } from '../../app/api/extrimli/duel-king/route';
import { _resetDestructionMetrics } from '../../lib/extrimli';
import { _resetDuelKingMetrics } from '../../lib/extrimli-duel-king';
import {
  type ExtrimliDokDikDakDukConsistencyHealth,
  EXTRIMLI_EXTREM_FUNKCINALNO_PROGRAMIRANJE_ENERGETSKOG_MISAONOG_TOKA_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_FUNKCIONALNO_PROGRAMIRANJE_UZVISENOG_MISANOG_TOKA_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_FUNKCIONALNO_PROGRAMIRANJE_PRAVEDNOG_MISAONOG_TOKA_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_FUNKIONALNO_PROGRAMIRANJE_PRAVNOG_MISAONOG_TOKA_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTUSANO_UZDIZANJE_EPSKIH_ELIKVADENATA_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_PROPORCIONALNO_PROGRAMIRANJE_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_RADNI_TAKT_MOZGA_MISLILAC_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_SPAJINO_PROPORCIONALNO_PROGRAMIRANJE_UNIVERZITET_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_VRH_PROGRAMSKOG_EKVILADENTA_CONTRACT_VERSION,
} from '../../lib/extrimli-extrem/types';
import {
  DEVELOPER_CREATE_VRH_CANONICAL_NARRATIVE_SENTENCE,
  DEVELOPER_CREATE_VRH_CANONICAL_TOKEN_VOCABULARY,
  DEVELOPER_CREATE_VRH_DOWNSTREAM_SUMMARY_POLICY,
  DEVELOPER_CREATE_VRH_FOUR_PERMANENT_LAYERS,
  DEVELOPER_CREATE_VRH_INTERPRETATION_ALIASES,
  DEVELOPER_CREATE_VRH_MAIN_MANIFEST_DOCUMENT,
  DEVELOPER_CREATE_VRH_NARRATIVE_CONTRACT_BOUNDARY,
  DEVELOPER_CREATE_VRH_SUCCESSFUL_NARRATIVE_CRITERIA,
  DEVELOPER_CREATE_VRH_VISUAL_EVIDENCE_POLICY,
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

function makePostRequest(url: string, body: unknown): NextRequest {
  return new Request(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

function makeGetRequest(url: string): NextRequest {
  return new Request(url, { method: 'GET' }) as unknown as NextRequest;
}

async function runTests(): Promise<void> {
  _resetDestructionMetrics();
  _resetDuelKingMetrics();

  console.log('\n🔗 [extrimli] route tests\n');

  await test('GET /api/extrimli/destruction/health returns report and headers', async () => {
    const response = await getDestructionHealth();
    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Extrimli-Destrukcija-Contract-Version') === 'v1-destrukcija', 'missing destruction contract header');

    const body = await response.json() as { data: { registrySize: number; destructionContractVersion: string } };
    assert(body.data.registrySize >= 5, `expected registry size >= 5, got ${body.data.registrySize}`);
    assert(body.data.destructionContractVersion === 'v1-destrukcija', 'unexpected destruction contract version');
  });

  await test('GET /api/extrimli/extendol returns unified surface report and headers', async () => {
    const response = await getExtendol();
    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Extrimli-Extendol-Contract-Version') === 'v1', 'missing extendol contract header');
    assert(response.headers.get('X-Extrimli-Degraded-Mode') === 'partial-payload-no-500', 'missing degraded mode header');

    const body = await response.json() as {
      data: { sourceOfTruth: string; coverage: { sportRiskEvaluation: boolean }; acceptanceCriteria: Array<{ id: string; passed: boolean }> };
    };
    assert(body.data.sourceOfTruth === '/api/extrimli/extendol', 'unexpected sourceOfTruth');
    assert(body.data.coverage.sportRiskEvaluation === true, 'expected sportRiskEvaluation coverage');
    assert(body.data.acceptanceCriteria.some((item) => item.id === 'all-user-paths-covered' && item.passed), 'expected all-user-paths-covered acceptance criterion');
  });


  await test('GET /api/extrimli/extrondend returns aggregation report and headers', async () => {
    const response = await getExtrondend();
    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Extrimli-Extrondend-Contract-Version') === 'v1-extrondend', 'missing EXTRONDEND contract header');

    const body = await response.json() as {
      data: { sourceOfTruth: string; aggregationScore: number; integrationBoundaries: { aliasesOfExistingSurfaces: boolean } };
    };
    assert(body.data.sourceOfTruth === '/api/extrimli/extrondend', 'unexpected EXTRONDEND sourceOfTruth');
    assert(body.data.aggregationScore >= 0 && body.data.aggregationScore <= 100, 'unexpected EXTRONDEND aggregationScore');
    assert(body.data.integrationBoundaries.aliasesOfExistingSurfaces === false, 'EXTRONDEND must not be alias');
  });

  await test('GET /api/extrimli/extrondol returns orchestration report and headers', async () => {
    const response = await getExtrondol();
    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Extrimli-Extrondol-Contract-Version') === 'v1-extrondol', 'missing EXTRONDOL contract header');

    const body = await response.json() as {
      data: {
        sourceOfTruth: string;
        orchestrationReadinessScore: number;
        startProject: {
          initiativeId: string;
          programName: string;
          orchestrationInputs: { duetRole: string };
          downstreamSync: { syncRequired: boolean };
        };
        rollout: { currentWawe: string; promotionFreeze: boolean };
        dokDikDakDukConsistencyHealth: ExtrimliDokDikDakDukConsistencyHealth;
        b2bReadiness: {
          downstreamSync: { linkedRepo: string };
          governanceDecisions: {
            semaFormulaGate: {
              canonicalExpression: string;
              status: string;
              muSemaConclusion: string;
              formulaHolds: boolean;
              blockerReasons: string[];
            };
          };
        };
        paymentVerification: { status: string; blockers: string[] };
        objektnoOrijentisanaProngilacija: { term: string; status: string; technicalSignalSource: string };
        funkcinalnoProgramiranjeEnergetskogMisaonogToka: { term: string; status: string; technicalSignalSource: string };
        funkcionalnoProgramiranjeUzvisenogMisanogToka: { term: string; status: string; technicalSignalSource: string };
        funkcionalnoProgramiranjePravednogMisaonogToka: { term: string; status: string; technicalSignalSource: string };
        paradijogonalnoProgrimiranje: { term: string; status: string; technicalSignalSource: string };
        funkionalnoProgramiranjePravnogMisaonogToka: { term: string; status: string; technicalSignalSource: string; legalBoundary: { sourceTrack: string } };
        proporcionalnoProgramiranje: { term: string; status: string; technicalSignalSource: string };
        spajinoProporcionalnoProgramiranjeUniverzitet: { term: string; status: string; technicalSignalSource: string; parentTrack: string };
        vrhProgramskogEkviladenta: { term: string; status: string; technicalSignalSource: string; parentTrack: string };
        epicElikvadenti: { term: string; status: string; technicalSignalSource: string };
        mobilnaLinija: {
          lineType: string;
          packageCatalog: Array<{ id: string; tier: string }>;
          selectedPlanId: string | null;
          activationStatus: string;
          freezeReasons: string[];
        };
        extremProfiler: {
          profile: { conflictIntensity: string; bottleneckLayer: string };
          dokerKuratIzekDokarTrack: { sequenceStates: Array<{ token: string; status: string }> };
          petljeSignals: { summary: { readinessScore: number; conflictScore: number; freezeRequired: boolean } };
        };
        dokerKuratIzekDokarTrack: { sequenceStates: Array<{ token: string; status: string }> };
        programskiJezikInformacionihTokova: { term: string; status: string; technicalSignalSource: string; flowMetrics: { forStatus: string } };
        programskiJezikPretpostavka: { term: string; status: string; technicalSignalSource: string; flowMetrics: { forStatus: string } };
        programskiJezikSpecijalizovanZaIgrice: { term: string; status: string; technicalSignalSource: string; gamingDomainMetrics: { forStatus: string } };
        releaseAuditSummary: {
          developerAndCreateRepoWideReflectionGovernance: {
            sourceOfTruth: string;
            status: string;
            dailyOperationalCadence: { taskPriorities: number[] };
            technicalReadinessProfile: { consolidatedRhythmStatus: string };
            covecnostAuditVisualReference: {
              canonicalNarrativeId: string;
              visualReference: string;
              supplementalVisualReferences: Array<{
                canonicalNarrativeId: string;
                visualReference: string;
              }>;
              companionAuditVisualReferences: Array<{
                canonicalNarrativeId: string;
                visualReference: string;
                thematicSignals: string[];
              }>;
            };
            covecnostAuditVisualGovernance: {
              auditVisibility: string;
              currentWawe: string;
              eligibleNextWawe: string;
              promotionFreeze: boolean;
              humanReviewRequired: boolean;
              rollbackPlanRequired: boolean;
              downstreamSync: string;
            };
            roadmapExecution: { roadmapStageId: string };
          };
          funkcinalnoProgramiranjeEnergetskogMisaonogTokaGovernance: { sourceOfTruth: string; status: string };
          funkcionalnoProgramiranjeUzvisenogMisanogTokaGovernance: { sourceOfTruth: string; status: string };
          funkcionalnoProgramiranjePravednogMisaonogTokaGovernance: { sourceOfTruth: string; status: string };
          paradijogonalnoProgrimiranjeGovernance: { sourceOfTruth: string; status: string };
          funkionalnoProgramiranjePravnogMisaonogTokaGovernance: { sourceOfTruth: string; status: string };
          proporcionalnoProgramiranjeGovernance: { sourceOfTruth: string; status: string };
          spajinoProporcionalnoProgramiranjeUniverzitetGovernance: { sourceOfTruth: string; status: string };
          vrhProgramskogEkviladentaGovernance: { sourceOfTruth: string; status: string };
          semaFormulaGovernance: { canonicalExpression: string; status: string; muSemaConclusion: string };
          epicElikvadentiGovernance: { sourceOfTruth: string; status: string };
          petljeGovernance: { sourceOfTruth: string; readinessScore: number; conflictScore: number; freezeRequired: boolean };
          programskiJezikInformacionihTokovaGovernance: { sourceOfTruth: string; status: string; forStatus: string };
          programskiJezikPretpostavkaGovernance: { sourceOfTruth: string; status: string; forStatus: string };
          programskiJezikSpecijalizovanZaIgriceGovernance: { sourceOfTruth: string; status: string; forStatus: string };
        };
        distanceRatioEkvilaterTable: { rows: Array<{ edgeId: string }> };
      };
    };
    assert(body.data.sourceOfTruth === '/api/extrimli/extrondol', 'unexpected EXTRONDOL sourceOfTruth');
    assert((body.data as { scopeLock: { canonicalExpression: string; boundedVocabulary: string[] } }).scopeLock.canonicalExpression === 'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA', 'unexpected EXTRONDOL scope lock expression');
    assert((body.data as { scopeLock: { boundedVocabulary: string[] } }).scopeLock.boundedVocabulary.join(',') === 'EXTRIMLI,EXTRONDOL,EXTREM,DOK,DUK,DAK,DIK,FOR', 'unexpected EXTRONDOL scope lock vocabulary');
    assert((body.data as { healthSnapshot: { surfaces: Array<{ route: string; status: string }> } }).healthSnapshot.surfaces.length === 3, 'unexpected EXTRONDOL health snapshot size');
    assert((body.data as { gapRegistry: Array<{ layer: string; roadmapStageId: string }> }).gapRegistry.map((item) => item.layer).join(',') === 'docs,types,routes,tests,workflows', 'unexpected EXTRONDOL gap registry layers');
    assert(body.data.orchestrationReadinessScore >= 0 && body.data.orchestrationReadinessScore <= 100, 'unexpected EXTRONDOL orchestrationReadinessScore');
    assert(body.data.startProject.initiativeId === 'OKRID-2026-EXTRIMLI-START-001', 'unexpected START project initiative id');
    assert(body.data.startProject.programName === 'START PROJEKAT', 'unexpected START project name');
    assert(body.data.startProject.orchestrationInputs.duetRole === 'signal-only', 'DUET must remain signal-only');
    assert(body.data.startProject.downstreamSync.syncRequired === true, 'START project must require downstream sync');
    assert(['WAWE-1', 'WAWE-2', 'WAWE-3', 'WAWE-4', 'WAWE-5'].includes(body.data.rollout.currentWawe), 'unexpected currentWawe');
    assert(typeof body.data.rollout.promotionFreeze === 'boolean', 'promotionFreeze should be boolean');
    assert(body.data.dokDikDakDukConsistencyHealth.sourceOfTruth === '/api/extrimli/extrondol', 'unexpected consistency health source');
    assert(body.data.dokDikDakDukConsistencyHealth.scopeLock.join(',') === 'DOK,DIK,DAK,DUK,FOR', 'unexpected consistency scope lock');
    assert(body.data.dokDikDakDukConsistencyHealth.ownershipBoundary.dok === 'EXTREM', 'unexpected DOK ownership');
    assert(body.data.dokDikDakDukConsistencyHealth.ownershipBoundary.dik === 'EXTREM', 'unexpected DIK ownership');
    assert(body.data.dokDikDakDukConsistencyHealth.ownershipBoundary.for === 'EXTREM', 'unexpected FOR ownership');
    assert(body.data.dokDikDakDukConsistencyHealth.ownershipBoundary.dak === 'EXTRONDOL', 'unexpected DAK ownership');
    assert(body.data.dokDikDakDukConsistencyHealth.ownershipBoundary.duk === 'EXTRONDOL', 'unexpected DUK ownership');
    assert(body.data.dokDikDakDukConsistencyHealth.signalSources.dok.includes('find(kind=DOK PETLJA)'), 'unexpected DOK signal source reference');
    assert(body.data.dokDikDakDukConsistencyHealth.signalSources.dik.includes('find(kind=DIK PETLJA)'), 'unexpected DIK signal source reference');
    assert(body.data.dokDikDakDukConsistencyHealth.signalSources.for.includes('forLoopBinding.forEvidence'), 'unexpected FOR signal source reference');
    assert(body.data.dokDikDakDukConsistencyHealth.signalSources.dak.includes('find(token=DAKOR)'), 'unexpected DAK signal source reference');
    assert(body.data.dokDikDakDukConsistencyHealth.signalSources.duk.includes('find(token=DUKAR)'), 'unexpected DUK signal source reference');
    assert(typeof body.data.dokDikDakDukConsistencyHealth.consistent === 'boolean', 'consistency flag should be boolean');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.dokDikDakDukConsistencyHealth.status), 'unexpected consistency status');
    assert(typeof body.data.dokDikDakDukConsistencyHealth.checks.dokSignalPresent === 'boolean', 'dok check should be boolean');
    assert(typeof body.data.dokDikDakDukConsistencyHealth.checks.dikSignalPresent === 'boolean', 'dik check should be boolean');
    assert(typeof body.data.dokDikDakDukConsistencyHealth.checks.forSignalPresent === 'boolean', 'for check should be boolean');
    assert(typeof body.data.dokDikDakDukConsistencyHealth.checks.dakMappedToPromotion === 'boolean', 'dak check should be boolean');
    assert(typeof body.data.dokDikDakDukConsistencyHealth.checks.dukMappedToHumanReview === 'boolean', 'duk check should be boolean');
    assert(typeof body.data.dokDikDakDukConsistencyHealth.checks.ownershipBoundaryPreserved === 'boolean', 'boundary check should be boolean');
    assert(Array.isArray(body.data.dokDikDakDukConsistencyHealth.reasons), 'consistency reasons should be array');
    assert(body.data.dokDikDakDukConsistencyHealth.programskiJezikAnaliza.canonicalName === 'PROGRAMSKI JEZIK ANALIZA', 'unexpected programski jezik analiza name');
    assert(body.data.dokDikDakDukConsistencyHealth.programskiJezikAnaliza.scope === 'ispitivanje eskalacije kodesnog zapleta', 'unexpected programski jezik analiza scope');
    assert(body.data.dokDikDakDukConsistencyHealth.programskiJezikAnaliza.sourceOfTruthRoutes.join(',') === '/api/extrimli/extrem,/api/extrimli/extrondol', 'unexpected programski jezik analiza source routes');
    assert(body.data.dokDikDakDukConsistencyHealth.programskiJezikAnaliza.escalationScore >= 0 && body.data.dokDikDakDukConsistencyHealth.programskiJezikAnaliza.escalationScore <= 100, 'unexpected programski jezik analiza escalation score');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.dokDikDakDukConsistencyHealth.programskiJezikAnaliza.escalationStatus), 'unexpected programski jezik analiza escalation status');
    assert(body.data.dokDikDakDukConsistencyHealth.programskiJezikProucavanja.canonicalName === 'PROGRAMSKI JEZIK PROUČAVANJA', 'unexpected programski jezik proucavanja name');
    assert(body.data.dokDikDakDukConsistencyHealth.programskiJezikProucavanja.programskiEkanalog.canonicalName === 'PROGRAMSKI EKANALOG', 'unexpected programski ekanalog name');
    assert(body.data.dokDikDakDukConsistencyHealth.programskiJezikProucavanja.programskiEkanalog.meaning === 'razumevanje logike', 'unexpected programski ekanalog meaning');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.canonicalName === 'DEVELOPER AND CREATE', 'unexpected developer/create reflection name');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.mainManifestDocument === DEVELOPER_CREATE_VRH_MAIN_MANIFEST_DOCUMENT, 'unexpected developer/create main manifest');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.canonicalNarrativeSentence === DEVELOPER_CREATE_VRH_CANONICAL_NARRATIVE_SENTENCE, 'unexpected developer/create canonical narrative sentence');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.canonicalScopeLock === DEVELOPER_CREATE_VRH_CANONICAL_NARRATIVE_SENTENCE, 'unexpected developer/create canonical scope lock');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.interpretationAliases.join(',') === DEVELOPER_CREATE_VRH_INTERPRETATION_ALIASES.join(','), 'unexpected developer/create interpretation aliases');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.interpretationAliases.includes('DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == MAPA UMA'), 'unexpected developer/create MAPA UMA alias');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.interpretationAliases.includes('DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == ŽIVOPIS U DIGITALIZMU'), 'unexpected developer/create ŽIVOPIS U DIGITALIZMU alias');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.interpretationAliases.includes('DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == DIJALIZA POGONSKOG OMOTAČA'), 'unexpected developer/create DIJALIZA POGONSKOG OMOTAČA alias');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.canonicalMapeUmaScopeLock === 'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == MAPE UMA', 'unexpected developer/create MAPE UMA canonical scope lock');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.readinessModel.join(',') === 'READY,WATCH,BLOCKED', 'unexpected developer/create readiness model');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.innovationRegistry13k.matrix.clusterCount === 130, 'unexpected innovation registry cluster count');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.innovationRegistry13k.matrix.innovationsPerCluster === 100, 'unexpected innovation registry per-cluster count');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.innovationRegistry13k.totals.totalInnovations === 13000, 'unexpected innovation registry total innovations');
    assert((body.data as { spajaKod: { publicSignals: { innovationRegistryTotal: number } } }).spajaKod.publicSignals.innovationRegistryTotal === 13000, 'unexpected SPAJA KOD innovation total');
    assert((body.data as { spajaKod: { publicSignals: { innovationRegistryClusters: number } } }).spajaKod.publicSignals.innovationRegistryClusters === 130, 'unexpected SPAJA KOD innovation clusters');
    assert((body.data as { spajaKod: { publicSignals: { innovationRegistryCoveragePercent: number } } }).spajaKod.publicSignals.innovationRegistryCoveragePercent === 100, 'unexpected SPAJA KOD innovation coverage');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.canonicalTokenVocabulary.dok === DEVELOPER_CREATE_VRH_CANONICAL_TOKEN_VOCABULARY.dok, 'unexpected developer/create DOK role');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.canonicalTokenVocabulary.dik === DEVELOPER_CREATE_VRH_CANONICAL_TOKEN_VOCABULARY.dik, 'unexpected developer/create DIK role');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.canonicalTokenVocabulary.dak === DEVELOPER_CREATE_VRH_CANONICAL_TOKEN_VOCABULARY.dak, 'unexpected developer/create DAK role');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.canonicalTokenVocabulary.duk === DEVELOPER_CREATE_VRH_CANONICAL_TOKEN_VOCABULARY.duk, 'unexpected developer/create DUK role');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.canonicalTokenVocabulary.for === DEVELOPER_CREATE_VRH_CANONICAL_TOKEN_VOCABULARY.for, 'unexpected developer/create FOR role');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.fourPermanentLayers.developerCreateVrh.role === DEVELOPER_CREATE_VRH_FOUR_PERMANENT_LAYERS.developerCreateVrh.role, 'unexpected developer/create apex layer role');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.fourPermanentLayers.extrem.role === DEVELOPER_CREATE_VRH_FOUR_PERMANENT_LAYERS.extrem.role, 'unexpected developer/create EXTREM layer role');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.fourPermanentLayers.extrondol.role === DEVELOPER_CREATE_VRH_FOUR_PERMANENT_LAYERS.extrondol.role, 'unexpected developer/create EXTRONDOL layer role');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.fourPermanentLayers.spajaKod.role === DEVELOPER_CREATE_VRH_FOUR_PERMANENT_LAYERS.spajaKod.role, 'unexpected developer/create SPAJA KOD layer role');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.narrativeContractBoundary.contractRole === DEVELOPER_CREATE_VRH_NARRATIVE_CONTRACT_BOUNDARY.contractRole, 'unexpected developer/create contract boundary role');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.narrativeContractBoundary.noNewRuntimeModule === DEVELOPER_CREATE_VRH_NARRATIVE_CONTRACT_BOUNDARY.noNewRuntimeModule, 'unexpected developer/create no-new-runtime boundary');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.narrativeContractBoundary.noParallelSourceOfTruth === DEVELOPER_CREATE_VRH_NARRATIVE_CONTRACT_BOUNDARY.noParallelSourceOfTruth, 'unexpected developer/create no-parallel-source-of-truth boundary');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.visualEvidencePolicy.role === DEVELOPER_CREATE_VRH_VISUAL_EVIDENCE_POLICY.role, 'unexpected developer/create visual evidence role');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.visualEvidencePolicy.confirmsExistingContract === DEVELOPER_CREATE_VRH_VISUAL_EVIDENCE_POLICY.confirmsExistingContract, 'unexpected developer/create visual confirmation flag');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.visualEvidencePolicy.introducesNewLogic === DEVELOPER_CREATE_VRH_VISUAL_EVIDENCE_POLICY.introducesNewLogic, 'unexpected developer/create visual new-logic flag');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.visualEvidencePolicy.introducesNewSemantics === DEVELOPER_CREATE_VRH_VISUAL_EVIDENCE_POLICY.introducesNewSemantics, 'unexpected developer/create visual new-semantics flag');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.visualEvidencePolicy.introducesNewSourceOfTruth === DEVELOPER_CREATE_VRH_VISUAL_EVIDENCE_POLICY.introducesNewSourceOfTruth, 'unexpected developer/create visual source-of-truth boundary');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.downstreamSummaryPolicy.linkedRepo === DEVELOPER_CREATE_VRH_DOWNSTREAM_SUMMARY_POLICY.linkedRepo, 'unexpected developer/create downstream linked repo');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.downstreamSummaryPolicy.syncMode === DEVELOPER_CREATE_VRH_DOWNSTREAM_SUMMARY_POLICY.syncMode, 'unexpected developer/create downstream sync mode');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.downstreamSummaryPolicy.repoLocalNarrativeRemainsRich === DEVELOPER_CREATE_VRH_DOWNSTREAM_SUMMARY_POLICY.repoLocalNarrativeRemainsRich, 'unexpected developer/create downstream rich-narrative flag');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.downstreamSummaryPolicy.rawNarrativeStaysRepoLocal === DEVELOPER_CREATE_VRH_DOWNSTREAM_SUMMARY_POLICY.rawNarrativeStaysRepoLocal, 'unexpected developer/create downstream repo-local narrative rule');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.successfulNarrativeCriteria.requiresSharedStoryAcross.join(',') === DEVELOPER_CREATE_VRH_SUCCESSFUL_NARRATIVE_CRITERIA.requiresSharedStoryAcross.join(','), 'unexpected developer/create successful narrative layers');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.successfulNarrativeCriteria.stableWithoutPerFileRetelling === DEVELOPER_CREATE_VRH_SUCCESSFUL_NARRATIVE_CRITERIA.stableWithoutPerFileRetelling, 'unexpected developer/create stable-without-retelling flag');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.successfulNarrativeCriteria.failureMode === DEVELOPER_CREATE_VRH_SUCCESSFUL_NARRATIVE_CRITERIA.failureMode, 'unexpected developer/create successful narrative failure mode');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.globalPageExplanationContract.boundedThematicSignals.join(',') === 'mape-uma,slike-plus-znacenje,ucenje,znanje,kreativnost,saradnja,odrzivost,mir', 'unexpected developer/create global explanation thematic signals');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.dailyOperationalCadence.cadenceBlocks.join(',') === 'morning-startup,deep-focus-block,midday-checkpoint,end-of-day-closeout', 'unexpected developer/create cadence blocks');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.readiness.status), 'unexpected developer/create reflection status');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.canonicalGovernanceVocabulary.kraljevskiEkonomskiUneverzitet === 'KRALJEVSKI EKONOMSKI UNEVERZITET', 'unexpected developer/create economic vocabulary');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.canonicalGovernanceVocabulary.kraljevskiProgramskiUneverzitet === 'KRALJEVSKI PROGRAMSKI UNEVERZITET', 'unexpected developer/create programmatic vocabulary');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.canonicalGovernanceVocabulary.stocarstvo === 'STOČARSTVO', 'unexpected developer/create STOČARSTVO vocabulary');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.canonicalGovernanceVocabulary.gradjevinskiFakultet === 'GRAĐEVINSKI FAKULTET', 'unexpected developer/create GRAĐEVINSKI FAKULTET vocabulary');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.canonicalGovernanceVocabulary.pedagoskiFakultet === 'PEDAGOŠKI FAKULTET', 'unexpected developer/create PEDAGOŠKI FAKULTET vocabulary');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.canonicalGovernanceVocabulary.psiholoskiFakultet === 'PSIHOLOŠKI FAKULTET', 'unexpected developer/create PSIHOLOŠKI FAKULTET vocabulary');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.canonicalGovernanceVocabulary.kompanijaSpaja === 'KOMPANIJA SPAJA', 'unexpected developer/create KOMPANIJA SPAJA vocabulary');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.canonicalGovernanceVocabulary.digitalnaIndustrija === 'DIGITALNA INDUSTRIJA', 'unexpected developer/create DIGITALNA INDUSTRIJA vocabulary');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.technicalReadinessProfile.consolidatedRhythmStatus === body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.readiness.status, 'unexpected developer/create consolidated rhythm status');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.fourTrackProgramPackage.businessTrack.canonicalName === 'Kompanija SPAJA / Digitalna Industrija', 'unexpected developer/create business track name');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.currentImplementationStage.humanReviewStatus === 'required-before-promotion', 'unexpected developer/create human review status');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.currentImplementationStage.downstreamReference === 'docs/MULTI-REPO-LINKS.md -> spaja86/IO-OPENUI-AO (summary-only)', 'unexpected developer/create downstream reference');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.universityLifecycle.stages.join('>') === 'prijava-na-oblast>polaganje>automatski-score>sertifikaciona-odluka>governance-provera>payout-odluka>audit-evidencija>downstream-summary-objava', 'unexpected developer/create university lifecycle');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.kraljevskiEkonomskiUneverzitet.canonicalName === 'KRALJEVSKI EKONOMSKI UNEVERZITET', 'unexpected developer/create economic track name');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.kraljevskiEkonomskiUneverzitet.unifiedNarrative === 'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == KRALJEVSKI PROGRAMSKI UNEVERZITET', 'unexpected developer/create economic unified narrative');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.kraljevskiEkonomskiUneverzitet.arhimedisTrzisniOdnosInterpretation.modelName === 'Arhimedisov princip matematike + tržišni odnos', 'unexpected developer/create economic interpretation model');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.kraljevskiEkonomskiUneverzitet.arhimedisTrzisniOdnosInterpretation.valueExchangeModes.join(',') === 'roba↔roba,novac↔roba', 'unexpected developer/create economic interpretation exchange modes');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.kraljevskiEkonomskiUneverzitet.arhimedisTrzisniOdnosInterpretation.scalingOperations.join(',') === 'množenje,deljenje', 'unexpected developer/create economic interpretation scaling operations');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.kraljevskiEkonomskiUneverzitet.monetizationGovernanceModel.payoutWindowPercent.join(',') === '80,100', 'unexpected developer/create monetization payout window');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.kraljevskiEkonomskiUneverzitet.readiness.status === body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.readiness.status, 'unexpected developer/create economic track status');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.kraljevskiEkonomskiUneverzitet.boundedPrivredniDomains.stocarstvo.canonicalName === 'STOČARSTVO', 'unexpected developer/create STOČARSTVO track name');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.kraljevskiProgramskiUneverzitet.boundedFacultyDomains.poljoprivredniFakultet.canonicalName === 'POLJOPRIVREDNI FAKULTET', 'unexpected developer/create POLJOPRIVREDNI FAKULTET track name');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.kraljevskiProgramskiUneverzitet.boundedFacultyDomains.matematickiFakultet.canonicalName === 'MATEMATIČKI FAKULTET', 'unexpected developer/create MATEMATIČKI FAKULTET track name');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.kraljevskiProgramskiUneverzitet.boundedFacultyDomains.pedagoskiFakultet.canonicalName === 'PEDAGOŠKI FAKULTET', 'unexpected developer/create PEDAGOŠKI FAKULTET track name');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.kraljevskiProgramskiUneverzitet.boundedFacultyDomains.psiholoskiFakultet.nonClinicalBoundary.noDiagnosticSubsystem === true, 'unexpected developer/create PSIHOLOŠKI FAKULTET non-diagnostic boundary');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.kraljevskiProgramskiUneverzitet.canonicalName === 'KRALJEVSKI PROGRAMSKI UNEVERZITET', 'unexpected developer/create programmatic track name');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.kraljevskiProgramskiUneverzitet.parentTrack === 'VRH PROGRAMSKOG EKVILADENTA', 'unexpected developer/create programmatic parent track');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.kraljevskiProgramskiUneverzitet.boundedTerminology.phrase === 'EXTRIMLI EXTRONDOL EXTREM DOK DUK DAK DIK FOR', 'unexpected developer/create programmatic bounded terminology');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.kraljevskiProgramskiUneverzitet.domainTestCatalog.certificationWindowPercent.join(',') === '80,100', 'unexpected developer/create domain certification window');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.kraljevskiProgramskiUneverzitet.payoutEligibilityPosture.requiredGovernanceGates.includes('payment-verification'), 'unexpected developer/create payout governance gates');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.kraljevskiProgramskiUneverzitet.readiness.status === body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.readiness.status, 'unexpected developer/create programmatic track status');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.aiIdentityFinanceGovernance.canonicalName === 'AI LIČNA KARTA + AI BANKARSKI RAČUN', 'unexpected developer/create AI identity-finance package name');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.aiIdentityFinanceGovernance.identityCard.auditSafePublicView === true, 'unexpected developer/create AI identity card audit-safe flag');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.aiIdentityFinanceGovernance.bankAccountGovernance.realBankAccountStoredInGit === false, 'unexpected developer/create AI bank account Git storage flag');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.aiIdentityFinanceGovernance.aiIqWorldBankPrepiska.sourceMaterialPolicy === 'documentation-only', 'unexpected developer/create AI IQ WORLD BANK prepiska policy');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.aiIdentityFinanceGovernance.aiIqWorldBankPrepiska.forbiddenEvidence.includes('payment-secrets'), 'unexpected developer/create AI IQ WORLD BANK prepiska forbidden evidence');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.aiIdentityFinanceGovernance.bezpovratneSubvencijeGovernance.canonicalName === 'BEZPOVRATNE SUBVENCIJE', 'unexpected developer/create bezpovratne subvencije canonical name');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.aiIdentityFinanceGovernance.bezpovratneSubvencijeGovernance.allowedEvidence.includes('payout-readiness'), 'unexpected developer/create bezpovratne subvencije allowed evidence');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.aiIdentityFinanceGovernance.catalogSummary.totalPersonas === body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.aiIdentityFinanceGovernance.personas.length, 'unexpected developer/create AI identity-finance catalog summary total');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.canonicalNarrativeId === 'covecnost-developer-create-vrh-radni-takt', 'unexpected developer/create ČOVEČNOST narrative id');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.visualReference.includes('4790f4ea-4271-4d2a-ae0a-d9bec5bc8b8a'), 'unexpected developer/create ČOVEČNOST visual reference');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences[0].canonicalNarrativeId === 'covecanstvo-zivot-je-najveca-igra', 'unexpected developer/create supplemental narrative id');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences[0].visualReference.includes('27ef7575-9ef6-425e-bdbf-75feb722bad2'), 'unexpected developer/create supplemental visual reference');
    const responseSviPripadajuSupplemental = body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string }) => reference.canonicalNarrativeId === 'covecanstvo-svi-koji-postoje-zasluzuju-da-pripadaju-developer-create');
    assert(responseSviPripadajuSupplemental?.visualReference.includes('c9509bbe-4083-4ba0-9802-3598f826a32b'), 'unexpected developer/create SVI KOJI POSTOJE supplemental visual reference');
    const responseEntizujazamSupplemental = body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string }) => reference.canonicalNarrativeId === 'covecanstvo-entizujazam-zvezde-misli-inovacije-developer-create');
    assert(responseEntizujazamSupplemental?.visualReference.includes('f7b3e102-e0a0-4885-a93e-040f09454737'), 'unexpected developer/create ENTIZUJAŽAM supplemental visual reference');
    const responseEpilogSupplemental = body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string }) => reference.canonicalNarrativeId === 'covecanstvo-epilog-rad-energija-stvaranja-developer-create');
    assert(responseEpilogSupplemental?.visualReference.includes('36ce7570-103e-4097-b903-fbe0efaf4026'), 'unexpected developer/create EPILOG supplemental visual reference');
    const responsePostojatiEpilogSupplemental = body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string }) => reference.canonicalNarrativeId === 'covecanstvo-epilog-postojati-znaci-doprineti-boljem-svetu-developer-create');
    assert(responsePostojatiEpilogSupplemental?.visualReference.includes('429b7479-7be9-41d3-9e9d-3531b1e9e596'), 'unexpected developer/create EPILOG (POSTOJATI) supplemental visual reference');
    const responseMapeUmaEpilogSupplemental = body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string; signalOutputs: { readinessStatus: string } } }) => reference.canonicalNarrativeId === 'covecanstvo-epilog-mape-uma-slike-znacenje-developer-create');
    assert(responseMapeUmaEpilogSupplemental?.visualReference.includes('f857f0fd-c29d-4749-aecd-f42745646e69'), 'unexpected developer/create EPILOG (MAPE UMA) supplemental visual reference');
    assert(responseMapeUmaEpilogSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-epilog-mape-uma-slike-znacenje-developer-create', 'unexpected developer/create EPILOG (MAPE UMA) supplemental scenario id');
    assert(responseMapeUmaEpilogSupplemental?.thematicSignals.join(',') === 'mape-uma,slike-plus-znacenje,ucenje,znanje,kreativnost,saradnja,odrzivost,mir,covecanstvo-epilog', 'unexpected developer/create EPILOG (MAPE UMA) thematic signals');
    assert(responseMapeUmaEpilogSupplemental?.imageToSignalProfile.signalOutputs.readinessStatus === body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.readiness.status, 'unexpected developer/create EPILOG (MAPE UMA) readiness status');
    const responseMaticneCelijeSupplemental = body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string }) => reference.canonicalNarrativeId === 'covecanstvo-maticne-celije-i-spoznavanje-sebe-developer-create');
    assert(responseMaticneCelijeSupplemental?.visualReference.includes('ca803ee2-f56e-4aa1-bd7f-18df213228d6'), 'unexpected developer/create MATIČNE ĆELIJE supplemental visual reference');
    const responseKukuruzSupplemental = body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string } }) => reference.canonicalNarrativeId === 'covecanstvo-prirodne-maticne-celije-kukuruz-developer-create');
    assert(responseKukuruzSupplemental?.visualReference.includes('f92e1ae5-ff97-4b81-a7f1-d3df6c8283cf'), 'unexpected developer/create KUKURUZ supplemental visual reference');
    assert(responseKukuruzSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-kukuruz-priroda-u-sluzbi-covecanstva-developer-create', 'unexpected developer/create KUKURUZ supplemental scenario id');
    assert(responseKukuruzSupplemental?.thematicSignals.join(',') === 'kukuruz-priroda,garden-stewardship,bounded-transformation-narrative,documentation-only-health-metaphor,covecanstvo-epilog,no-medical-runtime-claims', 'unexpected developer/create KUKURUZ thematic signals');
    const responseCistaVodaSupplemental = body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string } }) => reference.canonicalNarrativeId === 'covecanstvo-cista-voda-h2o-vodonik-buducnost-developer-create');
    assert(responseCistaVodaSupplemental?.visualReference.includes('2aae1845-0b3d-49c1-918b-a200cc48ad1d'), 'unexpected developer/create ČISTA VODA supplemental visual reference');
    assert(responseCistaVodaSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-cista-voda-h2o-vodonik-epilog-developer-create', 'unexpected developer/create ČISTA VODA supplemental scenario id');
    assert(responseCistaVodaSupplemental?.thematicSignals.join(',') === 'cista-voda,h2o-vodonik,knowledge-of-elements,documentation-only-health-metaphor,covecanstvo-epilog,no-medical-runtime-claims', 'unexpected developer/create ČISTA VODA thematic signals');
    const responseUrlLockedAd9Supplemental = body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[] }) => reference.canonicalNarrativeId === 'covecanstvo-url-locked-ad9aff82-developer-create');
    assert(responseUrlLockedAd9Supplemental?.visualReference.includes('ad9aff82-4790-49c2-9224-3b250d0090d1'), 'unexpected developer/create URL-locked ad9aff82 supplemental visual reference');
    assert(responseUrlLockedAd9Supplemental?.thematicSignals.join(',') === 'pending-title-confirmation,url-locked-reference,documentation-only,audit-safe-summary,no-new-runtime-routes,ownership-lock-preserved', 'unexpected developer/create URL-locked ad9aff82 thematic signals');
    const responseUrlLocked164Supplemental = body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; imageToSignalProfile: { scenarioId: string } }) => reference.canonicalNarrativeId === 'covecanstvo-url-locked-164e82a7-developer-create');
    assert(responseUrlLocked164Supplemental?.visualReference.includes('164e82a7-bf62-4397-959b-bf24953d0183'), 'unexpected developer/create URL-locked 164e82a7 supplemental visual reference');
    assert(responseUrlLocked164Supplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-url-locked-164e82a7-supplemental-visual-developer-create', 'unexpected developer/create URL-locked 164e82a7 supplemental scenario id');
    const responseZivotURavnoteziSupplemental = body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[] }) => reference.canonicalNarrativeId === 'covecanstvo-zivot-u-ravnotezi-developer-create');
    assert(responseZivotURavnoteziSupplemental?.visualReference.includes('76d61045-6f27-4614-97d2-f96fc84173eb'), 'unexpected developer/create ŽIVOT U RAVNOTEŽI supplemental visual reference');
    assert(responseZivotURavnoteziSupplemental?.thematicSignals.join(',') === 'balance,life-chain,compassion,higher-human-development', 'unexpected developer/create ŽIVOT U RAVNOTEŽI thematic signals');
    const responseBlagoslovBogpatijuSupplemental = body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[] }) => reference.canonicalNarrativeId === 'covecanstvo-blagoslov-darivati-bogpatiju-developer-create');
    assert(responseBlagoslovBogpatijuSupplemental?.visualReference.includes('dbf91173-c940-4994-b223-b5438feff4a3'), 'unexpected developer/create BLAGOSLOV DARIVATI / BOGPATIJU supplemental visual reference');
    assert(responseBlagoslovBogpatijuSupplemental?.thematicSignals.join(',') === 'blagoslov,darivanje,bogpatiju,zajednicko-covecanstvo', 'unexpected developer/create BLAGOSLOV DARIVATI / BOGPATIJU thematic signals');
    const responseMjuziklKraljevskogCinaSupplemental = body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[] }) => reference.canonicalNarrativeId === 'covecanstvo-mjuzikl-kraljevskog-cina-u-covecanstvo-developer-create');
    assert(responseMjuziklKraljevskogCinaSupplemental?.visualReference.includes('213b2738-35b1-4dab-b6ab-ae292afc8e91'), 'unexpected developer/create MUZIČKI ČIN supplemental visual reference');
    assert(responseMjuziklKraljevskogCinaSupplemental?.thematicSignals.join(',') === 'muzicki-cin,epilog,covecanstvo,zajednicki-ritam,jedan-svet', 'unexpected developer/create MUZIČKI ČIN thematic signals');
    const responseKraljevskaMuzickaPoveljaSupplemental = body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string; ownershipLock: { spajaKod: string } } }) => reference.canonicalNarrativeId === 'covecanstvo-kraljevska-muzicka-povelja-epilog-u-covecanstvo-developer-create');
    assert(responseKraljevskaMuzickaPoveljaSupplemental?.visualReference.includes('980557d1-6912-4e8c-9e8b-3f22e19f5c36'), 'unexpected developer/create KRALJEVSKA MUZIČKA POVELJA supplemental visual reference');
    assert(responseKraljevskaMuzickaPoveljaSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-kraljevska-muzicka-povelja-epilog-u-covecanstvo-developer-create', 'unexpected developer/create KRALJEVSKA MUZIČKA POVELJA supplemental scenario id');
    assert(responseKraljevskaMuzickaPoveljaSupplemental?.thematicSignals.join(',') === 'kraljevska-muzicka-povelja,epilog-u-covecanstvo,shared-world,shared-rhythm,spiritual-release,bounded-symbolic-governance', 'unexpected developer/create KRALJEVSKA MUZIČKA POVELJA thematic signals');
    assert(responseKraljevskaMuzickaPoveljaSupplemental?.imageToSignalProfile.ownershipLock.spajaKod === 'audit-safe-summary-only', 'unexpected developer/create KRALJEVSKA MUZIČKA POVELJA SPAJA KOD boundary');
    const responseBozijiEpitetiSupplemental = body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[] }) => reference.canonicalNarrativeId === 'covecanstvo-boziji-epiteti-zakon-etika-pravda-kralj-nad-kraljevima-developer-create');
    assert(responseBozijiEpitetiSupplemental?.visualReference.includes('e7846b38-1a56-4321-a7d7-8acfc1328bf9'), 'unexpected developer/create BOŽIJI EPITETI supplemental visual reference');
    assert(responseBozijiEpitetiSupplemental?.thematicSignals.join(',') === 'legal-governance-epilog,ethics-justice-civil-law,metric-astral-testimony,kralj-nad-kraljevima,jedan-zakon-jedna-etika-jedno-covecanstvo-jedan-bog', 'unexpected developer/create BOŽIJI EPITETI thematic signals');
    const responseKraljevskaVodicaSupplemental = body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; citation: string; imageToSignalProfile: { scenarioId: string; ownershipLock: { dokDikFor: string; dakDuk: string; spajaKod: string } } }) => reference.canonicalNarrativeId === 'covecanstvo-kraljevska-vodica-zakon-silnog-developer-create');
    assert(responseKraljevskaVodicaSupplemental?.visualReference.includes('e1d0a813-ed72-43ff-a943-112af972872d'), 'unexpected developer/create KRALJEVSKA VODICA supplemental visual reference');
    assert(responseKraljevskaVodicaSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-kraljevska-vodica-pravo-etika-mir-developer-create', 'unexpected developer/create KRALJEVSKA VODICA supplemental scenario id');
    assert(responseKraljevskaVodicaSupplemental?.citation.includes('nikada ne postaje runtime enforcement logika'), 'unexpected developer/create KRALJEVSKA VODICA citation boundary');
    assert(responseKraljevskaVodicaSupplemental?.thematicSignals.join(',') === 'legal-governance-epilog,ethics-and-justice,nenarusavaj-mir,civic-order,bounded-non-enforcement', 'unexpected developer/create KRALJEVSKA VODICA thematic signals');
    assert(responseKraljevskaVodicaSupplemental?.imageToSignalProfile.ownershipLock.dokDikFor === 'EXTREM', 'unexpected developer/create KRALJEVSKA VODICA EXTREM ownership');
    assert(responseKraljevskaVodicaSupplemental?.imageToSignalProfile.ownershipLock.dakDuk === 'EXTRONDOL', 'unexpected developer/create KRALJEVSKA VODICA EXTRONDOL ownership');
    assert(responseKraljevskaVodicaSupplemental?.imageToSignalProfile.ownershipLock.spajaKod === 'audit-safe-summary-only', 'unexpected developer/create KRALJEVSKA VODICA SPAJA KOD boundary');
    const responsePravoslavljeAktRevolucijeSupplemental = body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string } }) => reference.canonicalNarrativeId === 'covecanstvo-pravoslavlje-akt-revolucije-nad-hriscanstvom-developer-create');
    assert(responsePravoslavljeAktRevolucijeSupplemental?.visualReference.includes('749fac80-2a31-438b-ab05-190d2421f191'), 'unexpected developer/create PRAVOSLAVLJE supplemental visual reference');
    assert(responsePravoslavljeAktRevolucijeSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-pravoslavlje-akt-revolucije-zrtva-pravo-etika-kontinuitet-developer-create', 'unexpected developer/create PRAVOSLAVLJE supplemental scenario id');
    assert(responsePravoslavljeAktRevolucijeSupplemental?.thematicSignals.join(',') === 'right-and-law,ethics-and-justice,sacrifice-and-renewal,civilizational-continuity,right-to-exist-and-belong', 'unexpected developer/create PRAVOSLAVLJE thematic signals');
    const responseKraljevskaProduktivnostSupplemental = body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string } }) => reference.canonicalNarrativeId === 'covecanstvo-kraljevska-produktivnost-pravno-gradjanstvo-basta-epilog-developer-create');
    assert(responseKraljevskaProduktivnostSupplemental?.visualReference.includes('b02ac97f-d0ec-44b6-aadb-8ae3981127ea'), 'unexpected developer/create KRALJEVSKA PRODUKTIVNOST supplemental visual reference');
    assert(responseKraljevskaProduktivnostSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-kraljevska-produktivnost-pravno-gradjanstvo-basta-epilog-developer-create', 'unexpected developer/create KRALJEVSKA PRODUKTIVNOST supplemental scenario id');
    assert(responseKraljevskaProduktivnostSupplemental?.thematicSignals.join(',') === 'legal-citizenship,garden-productivity,family-self-sufficiency,earth-stewardship,humanity-epilog,small-work-large-change', 'unexpected developer/create KRALJEVSKA PRODUKTIVNOST thematic signals');
    const responseCarnevaleMasknbaleSupplemental = body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; citation: string; imageToSignalProfile: { scenarioId: string; ownershipLock: { dokDikFor: string; dakDuk: string; spajaKod: string } } }) => reference.canonicalNarrativeId === 'carnevale-masknbale-prirodni-portret-lica-developer-create');
    assert(responseCarnevaleMasknbaleSupplemental?.visualReference.includes('carnevale-masknbale-prirodni-portret-lica'), 'unexpected developer/create Carnevale Masknbale supplemental visual reference');
    assert(responseCarnevaleMasknbaleSupplemental?.imageToSignalProfile.scenarioId === 'carnevale-masknbale-umetnost-lica-dostojanstvo-identitet-developer-create', 'unexpected developer/create Carnevale Masknbale supplemental scenario id');
    assert(responseCarnevaleMasknbaleSupplemental?.citation.includes('Lice je prirodni portret bića'), 'unexpected developer/create Carnevale Masknbale citation');
    assert(responseCarnevaleMasknbaleSupplemental?.thematicSignals.join(',') === 'umetnost-lica,svecanost,dostojanstvo,originalnost,licni-identitet,prirodni-portret', 'unexpected developer/create Carnevale Masknbale thematic signals');
    assert(responseCarnevaleMasknbaleSupplemental?.imageToSignalProfile.signalOutputs.readinessStatus === body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.readiness.status, 'unexpected developer/create Carnevale Masknbale readiness status');
    const responseAiIdentityCardSupplemental = body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; citation: string; imageToSignalProfile: { scenarioId: string; ownershipLock: { dokDikFor: string; dakDuk: string; spajaKod: string } } }) => reference.canonicalNarrativeId === 'licna-karta-artificial-intelligence-identity-card-developer-create');
    assert(responseAiIdentityCardSupplemental?.visualReference.includes('aee19f4e-dede-47d9-83ca-1b080cf9b38b'), 'unexpected developer/create AI identity card supplemental visual reference');
    assert(responseAiIdentityCardSupplemental?.imageToSignalProfile.scenarioId === 'licna-karta-ai-identitet-odgovorna-vestacka-inteligencija-developer-create', 'unexpected developer/create AI identity card supplemental scenario id');
    assert(responseAiIdentityCardSupplemental?.citation.includes('nikada runtime identitet, auth ili security credential'), 'unexpected developer/create AI identity card citation');
    assert(responseAiIdentityCardSupplemental?.thematicSignals.join(',') === 'ai-identitet,odgovorna-vestacka-inteligencija,globalno-znanje,podrska-edukacija-kreativnost,resavanje-problema,documentation-only-activation-cues', 'unexpected developer/create AI identity card thematic signals');
    assert(responseAiIdentityCardSupplemental?.imageToSignalProfile.ownershipLock.dokDikFor === 'EXTREM', 'unexpected developer/create AI identity card EXTREM ownership');
    assert(responseAiIdentityCardSupplemental?.imageToSignalProfile.ownershipLock.dakDuk === 'EXTRONDOL', 'unexpected developer/create AI identity card EXTRONDOL ownership');
    assert(responseAiIdentityCardSupplemental?.imageToSignalProfile.ownershipLock.spajaKod === 'audit-safe-summary-only', 'unexpected developer/create AI identity card SPAJA KOD boundary');
    const responseVisionSunriseSupplemental = body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; citation: string; imageToSignalProfile: { scenarioId: string; ownershipLock: { dokDikFor: string; dakDuk: string; spajaKod: string } } }) => reference.canonicalNarrativeId === 'covecanstvo-pontcerima-svima-ako-zele-da-poprave-vid-developer-create');
    assert(responseVisionSunriseSupplemental?.visualReference.includes('446f2155-2c59-4420-826b-e248844943a8'), 'unexpected developer/create sunrise vision supplemental visual reference');
    assert(responseVisionSunriseSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-pontcerima-jutarnje-sunce-poprave-vid-developer-create', 'unexpected developer/create sunrise vision supplemental scenario id');
    assert(responseVisionSunriseSupplemental?.citation.includes('preporuka 17 minuta'), 'unexpected developer/create sunrise vision citation');
    assert(responseVisionSunriseSupplemental?.thematicSignals.join(',') === 'vid,jutarnje-sunce,licno-iskustvo,epilog-covecanstvu,disciplina-posmatranja,documentation-only-guidance', 'unexpected developer/create sunrise vision thematic signals');
    assert(responseVisionSunriseSupplemental?.imageToSignalProfile.ownershipLock.dokDikFor === 'EXTREM', 'unexpected developer/create sunrise vision EXTREM ownership');
    assert(responseVisionSunriseSupplemental?.imageToSignalProfile.ownershipLock.dakDuk === 'EXTRONDOL', 'unexpected developer/create sunrise vision EXTRONDOL ownership');
    assert(responseVisionSunriseSupplemental?.imageToSignalProfile.ownershipLock.spajaKod === 'audit-safe-summary-only', 'unexpected developer/create sunrise vision SPAJA KOD boundary');
    assert(responseCarnevaleMasknbaleSupplemental?.imageToSignalProfile.ownershipLock.dokDikFor === 'EXTREM', 'unexpected developer/create Carnevale Masknbale EXTREM ownership');
    assert(responseCarnevaleMasknbaleSupplemental?.imageToSignalProfile.ownershipLock.dakDuk === 'EXTRONDOL', 'unexpected developer/create Carnevale Masknbale EXTRONDOL ownership');
    assert(responseCarnevaleMasknbaleSupplemental?.imageToSignalProfile.ownershipLock.spajaKod === 'audit-safe-summary-only', 'unexpected developer/create Carnevale Masknbale SPAJA KOD ownership');
    const responseKraljevstvoSupplemental = body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string } }) => reference.canonicalNarrativeId === 'kraljevstvo-ljudi-znanje-priroda-tehnologija-buducnost-developer-create');
    assert(responseKraljevstvoSupplemental?.visualReference.includes('6b037ede-14ed-4f02-8939-c112bae773be'), 'unexpected developer/create KRALJEVSTVO supplemental visual reference');
    assert(responseKraljevstvoSupplemental?.imageToSignalProfile.scenarioId === 'kraljevstvo-zajedno-gradimo-kraljevstvo-za-sve-generacije-developer-create', 'unexpected developer/create KRALJEVSTVO supplemental scenario id');
    assert(responseKraljevstvoSupplemental?.thematicSignals.join(',') === 'kraljevstvo,zajednistvo,buducnost,znanje,humanost,tehnologija-u-sluzbi-zivota', 'unexpected developer/create KRALJEVSTVO thematic signals');
    const responseKraljevstvoCovecanstvoPravoBicaSupplemental = body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; auditRole: string; imageToSignalProfile: { scenarioId: string; ownershipLock: { dokDikFor: string; dakDuk: string; spajaKod: string } } }) => reference.canonicalNarrativeId === 'kraljevstvo-covecanstvo-pravo-bica-jedna-porodica-jedan-svet-developer-create');
    assert(responseKraljevstvoCovecanstvoPravoBicaSupplemental?.visualReference.includes('c7ebacdd-d239-425f-9b3c-ab3d807bbb92'), 'unexpected developer/create KRALJEVSTVO / ČOVEČANSTVO supplemental visual reference');
    assert(responseKraljevstvoCovecanstvoPravoBicaSupplemental?.imageToSignalProfile.scenarioId === 'kraljevstvo-covecanstvo-pravo-bica-znanje-tehnologija-ravnoteza-developer-create', 'unexpected developer/create KRALJEVSTVO / ČOVEČANSTVO supplemental scenario id');
    assert(responseKraljevstvoCovecanstvoPravoBicaSupplemental?.thematicSignals.join(',') === 'pravo-bica-postojanje,zajednistvo-jedna-porodica-jedan-svet,znanje-inovacija-tehnologija,produktivnost-razvoj-bolji-svet,priroda-covek-tehnologija-u-ravnotezi', 'unexpected developer/create KRALJEVSTVO / ČOVEČANSTVO thematic signals');
    assert(responseKraljevstvoCovecanstvoPravoBicaSupplemental?.auditRole === 'additive-audit-reference-only', 'unexpected developer/create KRALJEVSTVO / ČOVEČANSTVO audit role');
    assert(responseKraljevstvoCovecanstvoPravoBicaSupplemental?.imageToSignalProfile.ownershipLock.dokDikFor === 'EXTREM', 'unexpected developer/create KRALJEVSTVO / ČOVEČANSTVO EXTREM ownership');
    assert(responseKraljevstvoCovecanstvoPravoBicaSupplemental?.imageToSignalProfile.ownershipLock.dakDuk === 'EXTRONDOL', 'unexpected developer/create KRALJEVSTVO / ČOVEČANSTVO EXTRONDOL ownership');
    assert(responseKraljevstvoCovecanstvoPravoBicaSupplemental?.imageToSignalProfile.ownershipLock.spajaKod === 'audit-safe-summary-only', 'unexpected developer/create KRALJEVSTVO / ČOVEČANSTVO SPAJA KOD boundary');
    const responseSvitakBozanstvaSupplemental = body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string } }) => reference.canonicalNarrativeId === 'covecanstvo-svitak-bozanstva-pravoslavlje-kraljevstvo-developer-create');
    assert(responseSvitakBozanstvaSupplemental?.visualReference.includes('752ba75d-86b3-4d65-a6d7-e4f126c303ae'), 'unexpected developer/create SVITAK BOŽANSTVA supplemental visual reference');
    assert(responseSvitakBozanstvaSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-svitak-bozanstva-pravoslavlje-kraljevstvo-vecna-svetlost-developer-create', 'unexpected developer/create SVITAK BOŽANSTVA supplemental scenario id');
    assert(responseSvitakBozanstvaSupplemental?.thematicSignals.join(',') === 'bozanstvo-nad-svim,pravoslavlje-vecna-svetlost,vera-znanje-ljubav,narod-zemlja-covecanstvo,jedan-bog-jedan-narod-jedna-zemlja-jedno-covecanstvo', 'unexpected developer/create SVITAK BOŽANSTVA thematic signals');
    const responsePravedanSvetKraljevstvoSupplemental = body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string } }) => reference.canonicalNarrativeId === 'kraljevstvo-pravedan-svet-za-sve-narastaje-developer-create');
    assert(responsePravedanSvetKraljevstvoSupplemental?.visualReference.includes('527e2ce4-7bfe-4ab0-b5a3-caceb75b24c0'), 'unexpected developer/create KRALJEVSTVO — PRAVEDAN SVET ZA SVE NARAŠTAJE supplemental visual reference');
    assert(responsePravedanSvetKraljevstvoSupplemental?.imageToSignalProfile.scenarioId === 'kraljevstvo-pravedan-svet-za-sve-narastaje-developer-create', 'unexpected developer/create KRALJEVSTVO — PRAVEDAN SVET ZA SVE NARAŠTAJE supplemental scenario id');
    assert(responsePravedanSvetKraljevstvoSupplemental?.thematicSignals.join(',') === 'kraljevstvo,pravoslavlje,znanje,priroda,covecanstvo,jedan-svet-jedna-porodica,vecnost', 'unexpected developer/create KRALJEVSTVO — PRAVEDAN SVET ZA SVE NARAŠTAJE thematic signals');
    const responseProfesionalnaGlobalnaKampanjaKraljevstvoSupplemental = body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string } }) => reference.canonicalNarrativeId === 'kraljevstvo-profesionalna-globalna-kampanja-nikola-spajic-developer-create');
    assert(responseProfesionalnaGlobalnaKampanjaKraljevstvoSupplemental?.visualReference.includes('c9414c36-7876-43ee-ae39-fad8cd2622ed'), 'unexpected developer/create KRALJEVSTVO professional global campaign supplemental visual reference');
    assert(responseProfesionalnaGlobalnaKampanjaKraljevstvoSupplemental?.imageToSignalProfile.scenarioId === 'kraljevstvo-profesionalna-globalna-kampanja-medijska-strategija-developer-create', 'unexpected developer/create KRALJEVSTVO professional global campaign supplemental scenario id');
    assert(responseProfesionalnaGlobalnaKampanjaKraljevstvoSupplemental?.thematicSignals.join(',') === 'nikola-spajic-public-presentation,covecanstvo,znanje-i-obrazovanje,priroda-i-zivot,tehnologija,porodica-drustvo-zdravlje,pravda-buducnost-razvoj,profesionalni-gejming,ai-iq-world-bank-governance,audit-safe-media-strategy', 'unexpected developer/create KRALJEVSTVO professional global campaign thematic signals');
    assert(responseProfesionalnaGlobalnaKampanjaKraljevstvoSupplemental?.citation.includes('TV/radio/social distribucija ostaje samo audit-safe media-distribution strategy'), 'unexpected developer/create KRALJEVSTVO professional global campaign citation');
    const responseGilskultureKraljevstvoSupplemental = body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; citation: string; imageToSignalProfile: { scenarioId: string; ownershipLock: { dokDikFor: string; dakDuk: string; spajaKod: string } } }) => reference.canonicalNarrativeId === 'covecanstvo-epilog-kraljevstvo-gilskulture-developer-create');
    assert(responseGilskultureKraljevstvoSupplemental?.visualReference.includes('50cb9759-5ce2-490f-bcb2-8a3b73fed39f'), 'unexpected developer/create GILSKULTURE supplemental visual reference');
    assert(responseGilskultureKraljevstvoSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-epilog-kraljevstvo-gilskulture-znanje-mir-odgovornost-developer-create', 'unexpected developer/create GILSKULTURE supplemental scenario id');
    assert(responseGilskultureKraljevstvoSupplemental?.thematicSignals.join(',') === 'kraljevstvo,covecanstvo-epilog,znanje-citanje,deca-buduci-narastaji,priroda-covek-tehnologija-u-ravnotezi,mir-pravda-odgovornost', 'unexpected developer/create GILSKULTURE thematic signals');
    assert(responseGilskultureKraljevstvoSupplemental?.citation.includes('nikada ne postaje runtime enforcement logika'), 'unexpected developer/create GILSKULTURE citation boundary');
    assert(responseGilskultureKraljevstvoSupplemental?.imageToSignalProfile.ownershipLock.dokDikFor === 'EXTREM', 'unexpected developer/create GILSKULTURE EXTREM ownership');
    assert(responseGilskultureKraljevstvoSupplemental?.imageToSignalProfile.ownershipLock.dakDuk === 'EXTRONDOL', 'unexpected developer/create GILSKULTURE EXTRONDOL ownership');
    assert(responseGilskultureKraljevstvoSupplemental?.imageToSignalProfile.ownershipLock.spajaKod === 'audit-safe-summary-only', 'unexpected developer/create GILSKULTURE SPAJA KOD boundary');
    const responseNarastajUPrirodnomCvatuSupplemental = body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string; ownershipLock: { dokDikFor: string; dakDuk: string; spajaKod: string } } }) => reference.canonicalNarrativeId === 'covecanstvo-narastaj-u-prirodnom-cvatu-developer-create');
    assert(responseNarastajUPrirodnomCvatuSupplemental?.visualReference.includes('93ba6f4a-e8bd-4547-bb8b-dc77c14e845a'), 'unexpected developer/create NARAŠTAJ U PRIRODNOM CVATU supplemental visual reference');
    assert(responseNarastajUPrirodnomCvatuSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-narastaj-u-prirodnom-cvatu-epilog-blagodarim-developer-create', 'unexpected developer/create NARAŠTAJ U PRIRODNOM CVATU supplemental scenario id');
    assert(responseNarastajUPrirodnomCvatuSupplemental?.thematicSignals.join(',') === 'growth,seed-potential,light-and-opportunity,human-flourishing,gratitude,epilog', 'unexpected developer/create NARAŠTAJ U PRIRODNOM CVATU thematic signals');
    assert(responseNarastajUPrirodnomCvatuSupplemental?.imageToSignalProfile.ownershipLock.dokDikFor === 'EXTREM', 'unexpected developer/create NARAŠTAJ U PRIRODNOM CVATU EXTREM ownership');
    assert(responseNarastajUPrirodnomCvatuSupplemental?.imageToSignalProfile.ownershipLock.dakDuk === 'EXTRONDOL', 'unexpected developer/create NARAŠTAJ U PRIRODNOM CVATU EXTRONDOL ownership');
    assert(responseNarastajUPrirodnomCvatuSupplemental?.imageToSignalProfile.ownershipLock.spajaKod === 'audit-safe-summary-only', 'unexpected developer/create NARAŠTAJ U PRIRODNOM CVATU SPAJA KOD boundary');
    const responseSemeSupplemental = body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string; ownershipLock: { dokDikFor: string; dakDuk: string; spajaKod: string } } }) => reference.canonicalNarrativeId === 'covecanstvo-seme-malo-seme-velika-promena-developer-create');
    assert(responseSemeSupplemental?.visualReference.includes('9267f560-0b94-4911-9ac4-783c7c7deb3f'), 'unexpected developer/create SEME supplemental visual reference');
    assert(responseSemeSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-seme-zdrava-zemlja-prirodno-dubrivo-developer-create', 'unexpected developer/create SEME supplemental scenario id');
    assert(responseSemeSupplemental?.thematicSignals.join(',') === 'seed-growth,clean-input,planetary-stewardship,shared-world,small-change-large-impact,better-tomorrow', 'unexpected developer/create SEME thematic signals');
    assert(responseSemeSupplemental?.imageToSignalProfile.ownershipLock.dokDikFor === 'EXTREM', 'unexpected developer/create SEME EXTREM ownership');
    assert(responseSemeSupplemental?.imageToSignalProfile.ownershipLock.dakDuk === 'EXTRONDOL', 'unexpected developer/create SEME EXTRONDOL ownership');
    assert(responseSemeSupplemental?.imageToSignalProfile.ownershipLock.spajaKod === 'audit-safe-summary-only', 'unexpected developer/create SEME SPAJA KOD boundary');
    const responseZdravijiUmSupplemental = body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; citation: string; imageToSignalProfile: { scenarioId: string; ownershipLock: { dokDikFor: string; dakDuk: string; spajaKod: string } } }) => reference.canonicalNarrativeId === 'covecanstvo-zdraviji-um-snazniji-ljudi-bolji-svet-developer-create');
    assert(responseZdravijiUmSupplemental?.visualReference.includes('81ebf11b-d1a5-451b-880a-8670fe240041'), 'unexpected developer/create ZDRAVIJI UM supplemental visual reference');
    assert(responseZdravijiUmSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-zdraviji-um-razumevanje-misli-empatija-humanost-developer-create', 'unexpected developer/create ZDRAVIJI UM supplemental scenario id');
    assert(responseZdravijiUmSupplemental?.thematicSignals.join(',') === 'mental-reflection,understanding-thoughts,empathetic-humanity,shared-healing-metaphor,stronger-people-better-world,documentation-only-mind-epilog', 'unexpected developer/create ZDRAVIJI UM thematic signals');
    assert(responseZdravijiUmSupplemental?.citation.includes('bez nove formule, dijagnostike, terapije, medicinskog runtime subsistema'), 'unexpected developer/create ZDRAVIJI UM citation');
    assert(responseZdravijiUmSupplemental?.imageToSignalProfile.ownershipLock.dokDikFor === 'EXTREM', 'unexpected developer/create ZDRAVIJI UM EXTREM ownership');
    assert(responseZdravijiUmSupplemental?.imageToSignalProfile.ownershipLock.dakDuk === 'EXTRONDOL', 'unexpected developer/create ZDRAVIJI UM EXTRONDOL ownership');
    assert(responseZdravijiUmSupplemental?.imageToSignalProfile.ownershipLock.spajaKod === 'audit-safe-summary-only', 'unexpected developer/create ZDRAVIJI UM SPAJA KOD boundary');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.companionAuditVisualReferences[0].canonicalNarrativeId === 'covecanstvo-osecaj-osebenosti-developer-create-vrh-radni-takt', 'unexpected developer/create companion narrative id');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.companionAuditVisualReferences[0].visualReference.includes('9273c07f-5c03-4db4-a469-d22d456596f9'), 'unexpected developer/create companion visual reference');
    assert(body.data.dokDikDakDukConsistencyHealth.signals.dok.kind === 'DOK PETLJA', 'unexpected DOK consistency signal');
    assert(body.data.dokDikDakDukConsistencyHealth.signals.dik.kind === 'DIK PETLJA', 'unexpected DIK consistency signal');
    assert(body.data.dokDikDakDukConsistencyHealth.signals.for.kind === 'FOR PETLJA', 'unexpected FOR consistency signal');
    assert(body.data.dokDikDakDukConsistencyHealth.signals.dak.token === 'DAKOR', 'unexpected DAK consistency token');
    assert(body.data.dokDikDakDukConsistencyHealth.signals.duk.token === 'DUKAR', 'unexpected DUK consistency token');
    const extrondolSignalStatuses = [
      body.data.dokDikDakDukConsistencyHealth.signals.dok.status,
      body.data.dokDikDakDukConsistencyHealth.signals.dik.status,
      body.data.dokDikDakDukConsistencyHealth.signals.for.status,
      body.data.dokDikDakDukConsistencyHealth.signals.dak.status,
      body.data.dokDikDakDukConsistencyHealth.signals.duk.status,
    ];
    if (body.data.dokDikDakDukConsistencyHealth.status === 'READY') {
      assert(extrondolSignalStatuses.every((status) => status === 'READY'), 'READY consistency status requires all component signals to be READY');
    }
    if (!body.data.dokDikDakDukConsistencyHealth.consistent) {
      assert(body.data.dokDikDakDukConsistencyHealth.status === 'BLOCKED', 'inconsistent health status must be BLOCKED');
    }
    const allChecksPassing = Object.values(body.data.dokDikDakDukConsistencyHealth.checks).every(Boolean);
    if (body.data.dokDikDakDukConsistencyHealth.status !== 'BLOCKED') {
      assert(allChecksPassing, 'non-blocked consistency status requires all checks to pass');
    }
    assert(body.data.b2bReadiness.downstreamSync.linkedRepo === 'spaja86/IO-OPENUI-AO', 'unexpected downstream linked repo');
    assert(['VERIFIED', 'BLOCKED'].includes(body.data.paymentVerification.status), 'unexpected payment verification status');
    assert(Array.isArray(body.data.paymentVerification.blockers), 'payment verification blockers should be array');
    assert(body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.technicalReadinessProfile.consolidatedRhythmStatus === body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'unexpected release-audit developer/create consolidated rhythm status');
    assert(body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.canonicalNarrativeId === 'covecnost-developer-create-vrh-radni-takt', 'unexpected release-audit developer/create ČOVEČNOST narrative id');
    assert(body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences[0].canonicalNarrativeId === 'covecanstvo-zivot-je-najveca-igra', 'unexpected release-audit developer/create supplemental narrative id');
    assert(body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences[0].visualReference.includes('27ef7575-9ef6-425e-bdbf-75feb722bad2'), 'unexpected release-audit developer/create supplemental visual reference');
    const releaseAuditSviPripadajuSupplemental = body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string }) => reference.canonicalNarrativeId === 'covecanstvo-svi-koji-postoje-zasluzuju-da-pripadaju-developer-create');
    assert(releaseAuditSviPripadajuSupplemental?.visualReference.includes('c9509bbe-4083-4ba0-9802-3598f826a32b'), 'unexpected release-audit developer/create SVI KOJI POSTOJE supplemental visual reference');
    const releaseAuditEntizujazamSupplemental = body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string }) => reference.canonicalNarrativeId === 'covecanstvo-entizujazam-zvezde-misli-inovacije-developer-create');
    assert(releaseAuditEntizujazamSupplemental?.visualReference.includes('f7b3e102-e0a0-4885-a93e-040f09454737'), 'unexpected release-audit developer/create ENTIZUJAŽAM supplemental visual reference');
    const releaseAuditEpilogSupplemental = body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string }) => reference.canonicalNarrativeId === 'covecanstvo-epilog-rad-energija-stvaranja-developer-create');
    assert(releaseAuditEpilogSupplemental?.visualReference.includes('36ce7570-103e-4097-b903-fbe0efaf4026'), 'unexpected release-audit developer/create EPILOG supplemental visual reference');
    const releaseAuditPostojatiEpilogSupplemental = body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string }) => reference.canonicalNarrativeId === 'covecanstvo-epilog-postojati-znaci-doprineti-boljem-svetu-developer-create');
    assert(releaseAuditPostojatiEpilogSupplemental?.visualReference.includes('429b7479-7be9-41d3-9e9d-3531b1e9e596'), 'unexpected release-audit developer/create EPILOG (POSTOJATI) supplemental visual reference');
    const releaseAuditMapeUmaEpilogSupplemental = body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string; signalOutputs: { readinessStatus: string } } }) => reference.canonicalNarrativeId === 'covecanstvo-epilog-mape-uma-slike-znacenje-developer-create');
    assert(releaseAuditMapeUmaEpilogSupplemental?.visualReference.includes('f857f0fd-c29d-4749-aecd-f42745646e69'), 'unexpected release-audit developer/create EPILOG (MAPE UMA) supplemental visual reference');
    assert(releaseAuditMapeUmaEpilogSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-epilog-mape-uma-slike-znacenje-developer-create', 'unexpected release-audit developer/create EPILOG (MAPE UMA) supplemental scenario id');
    assert(releaseAuditMapeUmaEpilogSupplemental?.thematicSignals.join(',') === 'mape-uma,slike-plus-znacenje,ucenje,znanje,kreativnost,saradnja,odrzivost,mir,covecanstvo-epilog', 'unexpected release-audit developer/create EPILOG (MAPE UMA) thematic signals');
    assert(releaseAuditMapeUmaEpilogSupplemental?.imageToSignalProfile.signalOutputs.readinessStatus === body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'unexpected release-audit developer/create EPILOG (MAPE UMA) readiness status');
    const releaseAuditMaticneCelijeSupplemental = body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string }) => reference.canonicalNarrativeId === 'covecanstvo-maticne-celije-i-spoznavanje-sebe-developer-create');
    assert(releaseAuditMaticneCelijeSupplemental?.visualReference.includes('ca803ee2-f56e-4aa1-bd7f-18df213228d6'), 'unexpected release-audit developer/create MATIČNE ĆELIJE supplemental visual reference');
    const releaseAuditKukuruzSupplemental = body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string } }) => reference.canonicalNarrativeId === 'covecanstvo-prirodne-maticne-celije-kukuruz-developer-create');
    assert(releaseAuditKukuruzSupplemental?.visualReference.includes('f92e1ae5-ff97-4b81-a7f1-d3df6c8283cf'), 'unexpected release-audit developer/create KUKURUZ supplemental visual reference');
    assert(releaseAuditKukuruzSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-kukuruz-priroda-u-sluzbi-covecanstva-developer-create', 'unexpected release-audit developer/create KUKURUZ supplemental scenario id');
    assert(releaseAuditKukuruzSupplemental?.thematicSignals.join(',') === 'kukuruz-priroda,garden-stewardship,bounded-transformation-narrative,documentation-only-health-metaphor,covecanstvo-epilog,no-medical-runtime-claims', 'unexpected release-audit developer/create KUKURUZ thematic signals');
    const releaseAuditCistaVodaSupplemental = body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string } }) => reference.canonicalNarrativeId === 'covecanstvo-cista-voda-h2o-vodonik-buducnost-developer-create');
    assert(releaseAuditCistaVodaSupplemental?.visualReference.includes('2aae1845-0b3d-49c1-918b-a200cc48ad1d'), 'unexpected release-audit developer/create ČISTA VODA supplemental visual reference');
    assert(releaseAuditCistaVodaSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-cista-voda-h2o-vodonik-epilog-developer-create', 'unexpected release-audit developer/create ČISTA VODA supplemental scenario id');
    const releaseAuditUrlLockedA508Supplemental = body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; imageToSignalProfile: { scenarioId: string } }) => reference.canonicalNarrativeId === 'covecanstvo-url-locked-a508472d-developer-create');
    assert(releaseAuditUrlLockedA508Supplemental?.visualReference.includes('a508472d-74ba-4ece-ba3a-b0886c29fa4d'), 'unexpected release-audit developer/create URL-locked a508472d supplemental visual reference');
    assert(releaseAuditUrlLockedA508Supplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-url-locked-a508472d-supplemental-visual-developer-create', 'unexpected release-audit developer/create URL-locked a508472d supplemental scenario id');
    const releaseAuditUrlLocked164Supplemental = body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; imageToSignalProfile: { scenarioId: string } }) => reference.canonicalNarrativeId === 'covecanstvo-url-locked-164e82a7-developer-create');
    assert(releaseAuditUrlLocked164Supplemental?.visualReference.includes('164e82a7-bf62-4397-959b-bf24953d0183'), 'unexpected release-audit developer/create URL-locked 164e82a7 supplemental visual reference');
    assert(releaseAuditUrlLocked164Supplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-url-locked-164e82a7-supplemental-visual-developer-create', 'unexpected release-audit developer/create URL-locked 164e82a7 supplemental scenario id');
    const releaseAuditZivotURavnoteziSupplemental = body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[] }) => reference.canonicalNarrativeId === 'covecanstvo-zivot-u-ravnotezi-developer-create');
    assert(releaseAuditZivotURavnoteziSupplemental?.visualReference.includes('76d61045-6f27-4614-97d2-f96fc84173eb'), 'unexpected release-audit developer/create ŽIVOT U RAVNOTEŽI supplemental visual reference');
    assert(releaseAuditZivotURavnoteziSupplemental?.thematicSignals.join(',') === 'balance,life-chain,compassion,higher-human-development', 'unexpected release-audit developer/create ŽIVOT U RAVNOTEŽI thematic signals');
    const releaseAuditBlagoslovBogpatijuSupplemental = body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[] }) => reference.canonicalNarrativeId === 'covecanstvo-blagoslov-darivati-bogpatiju-developer-create');
    assert(releaseAuditBlagoslovBogpatijuSupplemental?.visualReference.includes('dbf91173-c940-4994-b223-b5438feff4a3'), 'unexpected release-audit developer/create BLAGOSLOV DARIVATI / BOGPATIJU supplemental visual reference');
    assert(releaseAuditBlagoslovBogpatijuSupplemental?.thematicSignals.join(',') === 'blagoslov,darivanje,bogpatiju,zajednicko-covecanstvo', 'unexpected release-audit developer/create BLAGOSLOV DARIVATI / BOGPATIJU thematic signals');
    const releaseAuditMjuziklKraljevskogCinaSupplemental = body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[] }) => reference.canonicalNarrativeId === 'covecanstvo-mjuzikl-kraljevskog-cina-u-covecanstvo-developer-create');
    assert(releaseAuditMjuziklKraljevskogCinaSupplemental?.visualReference.includes('213b2738-35b1-4dab-b6ab-ae292afc8e91'), 'unexpected release-audit developer/create MUZIČKI ČIN supplemental visual reference');
    assert(releaseAuditMjuziklKraljevskogCinaSupplemental?.thematicSignals.join(',') === 'muzicki-cin,epilog,covecanstvo,zajednicki-ritam,jedan-svet', 'unexpected release-audit developer/create MUZIČKI ČIN thematic signals');
    const releaseAuditKraljevskaMuzickaPoveljaSupplemental = body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string } }) => reference.canonicalNarrativeId === 'covecanstvo-kraljevska-muzicka-povelja-epilog-u-covecanstvo-developer-create');
    assert(releaseAuditKraljevskaMuzickaPoveljaSupplemental?.visualReference.includes('980557d1-6912-4e8c-9e8b-3f22e19f5c36'), 'unexpected release-audit developer/create KRALJEVSKA MUZIČKA POVELJA supplemental visual reference');
    assert(releaseAuditKraljevskaMuzickaPoveljaSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-kraljevska-muzicka-povelja-epilog-u-covecanstvo-developer-create', 'unexpected release-audit developer/create KRALJEVSKA MUZIČKA POVELJA supplemental scenario id');
    assert(releaseAuditKraljevskaMuzickaPoveljaSupplemental?.thematicSignals.join(',') === 'kraljevska-muzicka-povelja,epilog-u-covecanstvo,shared-world,shared-rhythm,spiritual-release,bounded-symbolic-governance', 'unexpected release-audit developer/create KRALJEVSKA MUZIČKA POVELJA thematic signals');
    const releaseAuditBozijiEpitetiSupplemental = body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[] }) => reference.canonicalNarrativeId === 'covecanstvo-boziji-epiteti-zakon-etika-pravda-kralj-nad-kraljevima-developer-create');
    assert(releaseAuditBozijiEpitetiSupplemental?.visualReference.includes('e7846b38-1a56-4321-a7d7-8acfc1328bf9'), 'unexpected release-audit developer/create BOŽIJI EPITETI supplemental visual reference');
    assert(releaseAuditBozijiEpitetiSupplemental?.thematicSignals.join(',') === 'legal-governance-epilog,ethics-justice-civil-law,metric-astral-testimony,kralj-nad-kraljevima,jedan-zakon-jedna-etika-jedno-covecanstvo-jedan-bog', 'unexpected release-audit developer/create BOŽIJI EPITETI thematic signals');
    const releaseAuditCarnevaleMasknbaleSupplemental = body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; citation: string; imageToSignalProfile: { scenarioId: string; signalOutputs: { readinessStatus: string } } }) => reference.canonicalNarrativeId === 'carnevale-masknbale-prirodni-portret-lica-developer-create');
    assert(releaseAuditCarnevaleMasknbaleSupplemental?.visualReference.includes('carnevale-masknbale-prirodni-portret-lica'), 'unexpected release-audit developer/create Carnevale Masknbale supplemental visual reference');
    assert(releaseAuditCarnevaleMasknbaleSupplemental?.imageToSignalProfile.scenarioId === 'carnevale-masknbale-umetnost-lica-dostojanstvo-identitet-developer-create', 'unexpected release-audit developer/create Carnevale Masknbale supplemental scenario id');
    assert(releaseAuditCarnevaleMasknbaleSupplemental?.citation.includes('Lice je prirodni portret bića'), 'unexpected release-audit developer/create Carnevale Masknbale citation');
    assert(releaseAuditCarnevaleMasknbaleSupplemental?.thematicSignals.join(',') === 'umetnost-lica,svecanost,dostojanstvo,originalnost,licni-identitet,prirodni-portret', 'unexpected release-audit developer/create Carnevale Masknbale thematic signals');
    assert(releaseAuditCarnevaleMasknbaleSupplemental?.imageToSignalProfile.signalOutputs.readinessStatus === body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'unexpected release-audit developer/create Carnevale Masknbale readiness status');
    const releaseAuditAiIdentityCardSupplemental = body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; citation: string; imageToSignalProfile: { scenarioId: string; signalOutputs: { readinessStatus: string } } }) => reference.canonicalNarrativeId === 'licna-karta-artificial-intelligence-identity-card-developer-create');
    assert(releaseAuditAiIdentityCardSupplemental?.visualReference.includes('aee19f4e-dede-47d9-83ca-1b080cf9b38b'), 'unexpected release-audit developer/create AI identity card supplemental visual reference');
    assert(releaseAuditAiIdentityCardSupplemental?.imageToSignalProfile.scenarioId === 'licna-karta-ai-identitet-odgovorna-vestacka-inteligencija-developer-create', 'unexpected release-audit developer/create AI identity card supplemental scenario id');
    assert(releaseAuditAiIdentityCardSupplemental?.citation.includes('nikada runtime identitet, auth ili security credential'), 'unexpected release-audit developer/create AI identity card citation');
    assert(releaseAuditAiIdentityCardSupplemental?.thematicSignals.join(',') === 'ai-identitet,odgovorna-vestacka-inteligencija,globalno-znanje,podrska-edukacija-kreativnost,resavanje-problema,documentation-only-activation-cues', 'unexpected release-audit developer/create AI identity card thematic signals');
    assert(releaseAuditAiIdentityCardSupplemental?.imageToSignalProfile.signalOutputs.readinessStatus === body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'unexpected release-audit developer/create AI identity card readiness status');
    const releaseAuditVisionSunriseSupplemental = body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; citation: string; imageToSignalProfile: { scenarioId: string; signalOutputs: { readinessStatus: string } } }) => reference.canonicalNarrativeId === 'covecanstvo-pontcerima-svima-ako-zele-da-poprave-vid-developer-create');
    assert(releaseAuditVisionSunriseSupplemental?.visualReference.includes('446f2155-2c59-4420-826b-e248844943a8'), 'unexpected release-audit developer/create sunrise vision supplemental visual reference');
    assert(releaseAuditVisionSunriseSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-pontcerima-jutarnje-sunce-poprave-vid-developer-create', 'unexpected release-audit developer/create sunrise vision supplemental scenario id');
    assert(releaseAuditVisionSunriseSupplemental?.citation.includes('preporuka 17 minuta'), 'unexpected release-audit developer/create sunrise vision citation');
    assert(releaseAuditVisionSunriseSupplemental?.thematicSignals.join(',') === 'vid,jutarnje-sunce,licno-iskustvo,epilog-covecanstvu,disciplina-posmatranja,documentation-only-guidance', 'unexpected release-audit developer/create sunrise vision thematic signals');
    assert(releaseAuditVisionSunriseSupplemental?.imageToSignalProfile.signalOutputs.readinessStatus === body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'unexpected release-audit developer/create sunrise vision readiness status');
    const releaseAuditKraljevstvoSupplemental = body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string } }) => reference.canonicalNarrativeId === 'kraljevstvo-ljudi-znanje-priroda-tehnologija-buducnost-developer-create');
    assert(releaseAuditKraljevstvoSupplemental?.visualReference.includes('6b037ede-14ed-4f02-8939-c112bae773be'), 'unexpected release-audit developer/create KRALJEVSTVO supplemental visual reference');
    assert(releaseAuditKraljevstvoSupplemental?.imageToSignalProfile.scenarioId === 'kraljevstvo-zajedno-gradimo-kraljevstvo-za-sve-generacije-developer-create', 'unexpected release-audit developer/create KRALJEVSTVO supplemental scenario id');
    assert(releaseAuditKraljevstvoSupplemental?.thematicSignals.join(',') === 'kraljevstvo,zajednistvo,buducnost,znanje,humanost,tehnologija-u-sluzbi-zivota', 'unexpected release-audit developer/create KRALJEVSTVO thematic signals');
    const releaseAuditKraljevstvoCovecanstvoPravoBicaSupplemental = body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; auditRole: string; imageToSignalProfile: { scenarioId: string; ownershipLock: { dokDikFor: string; dakDuk: string; spajaKod: string } } }) => reference.canonicalNarrativeId === 'kraljevstvo-covecanstvo-pravo-bica-jedna-porodica-jedan-svet-developer-create');
    assert(releaseAuditKraljevstvoCovecanstvoPravoBicaSupplemental?.visualReference.includes('c7ebacdd-d239-425f-9b3c-ab3d807bbb92'), 'unexpected release-audit developer/create KRALJEVSTVO / ČOVEČANSTVO supplemental visual reference');
    assert(releaseAuditKraljevstvoCovecanstvoPravoBicaSupplemental?.imageToSignalProfile.scenarioId === 'kraljevstvo-covecanstvo-pravo-bica-znanje-tehnologija-ravnoteza-developer-create', 'unexpected release-audit developer/create KRALJEVSTVO / ČOVEČANSTVO supplemental scenario id');
    assert(releaseAuditKraljevstvoCovecanstvoPravoBicaSupplemental?.thematicSignals.join(',') === 'pravo-bica-postojanje,zajednistvo-jedna-porodica-jedan-svet,znanje-inovacija-tehnologija,produktivnost-razvoj-bolji-svet,priroda-covek-tehnologija-u-ravnotezi', 'unexpected release-audit developer/create KRALJEVSTVO / ČOVEČANSTVO thematic signals');
    assert(releaseAuditKraljevstvoCovecanstvoPravoBicaSupplemental?.auditRole === 'additive-audit-reference-only', 'unexpected release-audit developer/create KRALJEVSTVO / ČOVEČANSTVO audit role');
    assert(releaseAuditKraljevstvoCovecanstvoPravoBicaSupplemental?.imageToSignalProfile.ownershipLock.dokDikFor === 'EXTREM', 'unexpected release-audit developer/create KRALJEVSTVO / ČOVEČANSTVO EXTREM ownership');
    assert(releaseAuditKraljevstvoCovecanstvoPravoBicaSupplemental?.imageToSignalProfile.ownershipLock.dakDuk === 'EXTRONDOL', 'unexpected release-audit developer/create KRALJEVSTVO / ČOVEČANSTVO EXTRONDOL ownership');
    assert(releaseAuditKraljevstvoCovecanstvoPravoBicaSupplemental?.imageToSignalProfile.ownershipLock.spajaKod === 'audit-safe-summary-only', 'unexpected release-audit developer/create KRALJEVSTVO / ČOVEČANSTVO SPAJA KOD boundary');
    const releaseAuditPravoslavljeAktRevolucijeSupplemental = body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string } }) => reference.canonicalNarrativeId === 'covecanstvo-pravoslavlje-akt-revolucije-nad-hriscanstvom-developer-create');
    assert(releaseAuditPravoslavljeAktRevolucijeSupplemental?.visualReference.includes('749fac80-2a31-438b-ab05-190d2421f191'), 'unexpected release-audit developer/create PRAVOSLAVLJE supplemental visual reference');
    assert(releaseAuditPravoslavljeAktRevolucijeSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-pravoslavlje-akt-revolucije-zrtva-pravo-etika-kontinuitet-developer-create', 'unexpected release-audit developer/create PRAVOSLAVLJE supplemental scenario id');
    assert(releaseAuditPravoslavljeAktRevolucijeSupplemental?.thematicSignals.join(',') === 'right-and-law,ethics-and-justice,sacrifice-and-renewal,civilizational-continuity,right-to-exist-and-belong', 'unexpected release-audit developer/create PRAVOSLAVLJE thematic signals');
    const releaseAuditKraljevskaProduktivnostSupplemental = body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string } }) => reference.canonicalNarrativeId === 'covecanstvo-kraljevska-produktivnost-pravno-gradjanstvo-basta-epilog-developer-create');
    assert(releaseAuditKraljevskaProduktivnostSupplemental?.visualReference.includes('b02ac97f-d0ec-44b6-aadb-8ae3981127ea'), 'unexpected release-audit developer/create KRALJEVSKA PRODUKTIVNOST supplemental visual reference');
    assert(releaseAuditKraljevskaProduktivnostSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-kraljevska-produktivnost-pravno-gradjanstvo-basta-epilog-developer-create', 'unexpected release-audit developer/create KRALJEVSKA PRODUKTIVNOST supplemental scenario id');
    assert(releaseAuditKraljevskaProduktivnostSupplemental?.thematicSignals.join(',') === 'legal-citizenship,garden-productivity,family-self-sufficiency,earth-stewardship,humanity-epilog,small-work-large-change', 'unexpected release-audit developer/create KRALJEVSKA PRODUKTIVNOST thematic signals');
    const releaseAuditRepoWideRadniTaktVukSupplemental = body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string; ownershipLock: { dokDikFor: string; dakDuk: string; spajaKod: string }; signalOutputs: { readinessStatus: string } } }) => reference.canonicalNarrativeId === 'developer-create-vrh-radni-takt-svemu-u-repozitorijumu-vuk-developer-create');
    assert(releaseAuditRepoWideRadniTaktVukSupplemental?.visualReference.includes('de6800ae-5406-4378-9033-3e4d075697d3'), 'unexpected release-audit developer/create repo-wide RADNI TAKT VUK supplemental visual reference');
    assert(releaseAuditRepoWideRadniTaktVukSupplemental?.imageToSignalProfile.scenarioId === 'developer-create-vrh-radni-takt-da-se-odrazi-na-svemu-u-repozitorijumu-vuk-developer-create', 'unexpected release-audit developer/create repo-wide RADNI TAKT VUK supplemental scenario id');
    assert(releaseAuditRepoWideRadniTaktVukSupplemental?.thematicSignals.join(',') === 'developer-and-create-vrh,radni-takt-repo-wide-reflection,vuk,bounded-vocabulary-extrimli-extrondol-extrem-dok-duk-dak-dik-for,audit-safe-summary-only', 'unexpected release-audit developer/create repo-wide RADNI TAKT VUK thematic signals');
    assert(releaseAuditRepoWideRadniTaktVukSupplemental?.imageToSignalProfile.ownershipLock.dokDikFor === 'EXTREM', 'unexpected release-audit developer/create repo-wide RADNI TAKT VUK EXTREM ownership');
    assert(releaseAuditRepoWideRadniTaktVukSupplemental?.imageToSignalProfile.ownershipLock.dakDuk === 'EXTRONDOL', 'unexpected release-audit developer/create repo-wide RADNI TAKT VUK EXTRONDOL ownership');
    assert(releaseAuditRepoWideRadniTaktVukSupplemental?.imageToSignalProfile.ownershipLock.spajaKod === 'audit-safe-summary-only', 'unexpected release-audit developer/create repo-wide RADNI TAKT VUK boundary');
    assert(releaseAuditRepoWideRadniTaktVukSupplemental?.imageToSignalProfile.signalOutputs.readinessStatus === body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'unexpected release-audit developer/create repo-wide RADNI TAKT VUK readiness status');
    const releaseAuditSvitakBozanstvaSupplemental = body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string } }) => reference.canonicalNarrativeId === 'covecanstvo-svitak-bozanstva-pravoslavlje-kraljevstvo-developer-create');
    assert(releaseAuditSvitakBozanstvaSupplemental?.visualReference.includes('752ba75d-86b3-4d65-a6d7-e4f126c303ae'), 'unexpected release-audit developer/create SVITAK BOŽANSTVA supplemental visual reference');
    assert(releaseAuditSvitakBozanstvaSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-svitak-bozanstva-pravoslavlje-kraljevstvo-vecna-svetlost-developer-create', 'unexpected release-audit developer/create SVITAK BOŽANSTVA supplemental scenario id');
    assert(releaseAuditSvitakBozanstvaSupplemental?.thematicSignals.join(',') === 'bozanstvo-nad-svim,pravoslavlje-vecna-svetlost,vera-znanje-ljubav,narod-zemlja-covecanstvo,jedan-bog-jedan-narod-jedna-zemlja-jedno-covecanstvo', 'unexpected release-audit developer/create SVITAK BOŽANSTVA thematic signals');
    const releaseAuditPravedanSvetKraljevstvoSupplemental = body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string } }) => reference.canonicalNarrativeId === 'kraljevstvo-pravedan-svet-za-sve-narastaje-developer-create');
    assert(releaseAuditPravedanSvetKraljevstvoSupplemental?.visualReference.includes('527e2ce4-7bfe-4ab0-b5a3-caceb75b24c0'), 'unexpected release-audit developer/create KRALJEVSTVO — PRAVEDAN SVET ZA SVE NARAŠTAJE supplemental visual reference');
    assert(releaseAuditPravedanSvetKraljevstvoSupplemental?.imageToSignalProfile.scenarioId === 'kraljevstvo-pravedan-svet-za-sve-narastaje-developer-create', 'unexpected release-audit developer/create KRALJEVSTVO — PRAVEDAN SVET ZA SVE NARAŠTAJE supplemental scenario id');
    assert(releaseAuditPravedanSvetKraljevstvoSupplemental?.thematicSignals.join(',') === 'kraljevstvo,pravoslavlje,znanje,priroda,covecanstvo,jedan-svet-jedna-porodica,vecnost', 'unexpected release-audit developer/create KRALJEVSTVO — PRAVEDAN SVET ZA SVE NARAŠTAJE thematic signals');
    const releaseAuditProfesionalnaGlobalnaKampanjaKraljevstvoSupplemental = body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string } }) => reference.canonicalNarrativeId === 'kraljevstvo-profesionalna-globalna-kampanja-nikola-spajic-developer-create');
    assert(releaseAuditProfesionalnaGlobalnaKampanjaKraljevstvoSupplemental?.visualReference.includes('c9414c36-7876-43ee-ae39-fad8cd2622ed'), 'unexpected release-audit developer/create KRALJEVSTVO professional global campaign supplemental visual reference');
    assert(releaseAuditProfesionalnaGlobalnaKampanjaKraljevstvoSupplemental?.imageToSignalProfile.scenarioId === 'kraljevstvo-profesionalna-globalna-kampanja-medijska-strategija-developer-create', 'unexpected release-audit developer/create KRALJEVSTVO professional global campaign supplemental scenario id');
    assert(releaseAuditProfesionalnaGlobalnaKampanjaKraljevstvoSupplemental?.thematicSignals.join(',') === 'nikola-spajic-public-presentation,covecanstvo,znanje-i-obrazovanje,priroda-i-zivot,tehnologija,porodica-drustvo-zdravlje,pravda-buducnost-razvoj,profesionalni-gejming,ai-iq-world-bank-governance,audit-safe-media-strategy', 'unexpected release-audit developer/create KRALJEVSTVO professional global campaign thematic signals');
    assert(releaseAuditProfesionalnaGlobalnaKampanjaKraljevstvoSupplemental?.citation.includes('TV/radio/social distribucija ostaje samo audit-safe media-distribution strategy'), 'unexpected release-audit developer/create KRALJEVSTVO professional global campaign citation');
    const releaseAuditGilskultureKraljevstvoSupplemental = body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; citation: string; imageToSignalProfile: { scenarioId: string } }) => reference.canonicalNarrativeId === 'covecanstvo-epilog-kraljevstvo-gilskulture-developer-create');
    assert(releaseAuditGilskultureKraljevstvoSupplemental?.visualReference.includes('50cb9759-5ce2-490f-bcb2-8a3b73fed39f'), 'unexpected release-audit developer/create GILSKULTURE supplemental visual reference');
    assert(releaseAuditGilskultureKraljevstvoSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-epilog-kraljevstvo-gilskulture-znanje-mir-odgovornost-developer-create', 'unexpected release-audit developer/create GILSKULTURE supplemental scenario id');
    assert(releaseAuditGilskultureKraljevstvoSupplemental?.thematicSignals.join(',') === 'kraljevstvo,covecanstvo-epilog,znanje-citanje,deca-buduci-narastaji,priroda-covek-tehnologija-u-ravnotezi,mir-pravda-odgovornost', 'unexpected release-audit developer/create GILSKULTURE thematic signals');
    assert(releaseAuditGilskultureKraljevstvoSupplemental?.citation.includes('source-text-only documentation/evidence'), 'unexpected release-audit developer/create GILSKULTURE citation boundary');
    const releaseAuditNarastajUPrirodnomCvatuSupplemental = body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string } }) => reference.canonicalNarrativeId === 'covecanstvo-narastaj-u-prirodnom-cvatu-developer-create');
    assert(releaseAuditNarastajUPrirodnomCvatuSupplemental?.visualReference.includes('93ba6f4a-e8bd-4547-bb8b-dc77c14e845a'), 'unexpected release-audit developer/create NARAŠTAJ U PRIRODNOM CVATU supplemental visual reference');
    assert(releaseAuditNarastajUPrirodnomCvatuSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-narastaj-u-prirodnom-cvatu-epilog-blagodarim-developer-create', 'unexpected release-audit developer/create NARAŠTAJ U PRIRODNOM CVATU supplemental scenario id');
    assert(releaseAuditNarastajUPrirodnomCvatuSupplemental?.thematicSignals.join(',') === 'growth,seed-potential,light-and-opportunity,human-flourishing,gratitude,epilog', 'unexpected release-audit developer/create NARAŠTAJ U PRIRODNOM CVATU thematic signals');
    const releaseAuditSemeSupplemental = body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string } }) => reference.canonicalNarrativeId === 'covecanstvo-seme-malo-seme-velika-promena-developer-create');
    assert(releaseAuditSemeSupplemental?.visualReference.includes('9267f560-0b94-4911-9ac4-783c7c7deb3f'), 'unexpected release-audit developer/create SEME supplemental visual reference');
    assert(releaseAuditSemeSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-seme-zdrava-zemlja-prirodno-dubrivo-developer-create', 'unexpected release-audit developer/create SEME supplemental scenario id');
    assert(releaseAuditSemeSupplemental?.thematicSignals.join(',') === 'seed-growth,clean-input,planetary-stewardship,shared-world,small-change-large-impact,better-tomorrow', 'unexpected release-audit developer/create SEME thematic signals');
    const releaseAuditZdravijiUmSupplemental = body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; citation: string; imageToSignalProfile: { scenarioId: string; signalOutputs: { readinessStatus: string } } }) => reference.canonicalNarrativeId === 'covecanstvo-zdraviji-um-snazniji-ljudi-bolji-svet-developer-create');
    assert(releaseAuditZdravijiUmSupplemental?.visualReference.includes('81ebf11b-d1a5-451b-880a-8670fe240041'), 'unexpected release-audit developer/create ZDRAVIJI UM supplemental visual reference');
    assert(releaseAuditZdravijiUmSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-zdraviji-um-razumevanje-misli-empatija-humanost-developer-create', 'unexpected release-audit developer/create ZDRAVIJI UM supplemental scenario id');
    assert(releaseAuditZdravijiUmSupplemental?.thematicSignals.join(',') === 'mental-reflection,understanding-thoughts,empathetic-humanity,shared-healing-metaphor,stronger-people-better-world,documentation-only-mind-epilog', 'unexpected release-audit developer/create ZDRAVIJI UM thematic signals');
    assert(releaseAuditZdravijiUmSupplemental?.citation.includes('bez nove formule, dijagnostike, terapije, medicinskog runtime subsistema'), 'unexpected release-audit developer/create ZDRAVIJI UM citation');
    assert(releaseAuditZdravijiUmSupplemental?.imageToSignalProfile.signalOutputs.readinessStatus === body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'unexpected release-audit developer/create ZDRAVIJI UM readiness status');
    assert(body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.companionAuditVisualReferences[0].canonicalNarrativeId === 'covecanstvo-osecaj-osebenosti-developer-create-vrh-radni-takt', 'unexpected release-audit developer/create companion narrative id');
    assert(body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.companionAuditVisualReferences[0].visualReference.includes('9273c07f-5c03-4db4-a469-d22d456596f9'), 'unexpected release-audit developer/create companion visual reference');
    assert(
      Object.keys(body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualGovernance).sort().join(',') ===
        'auditVisibility,currentWawe,downstreamSync,eligibleNextWawe,humanReviewRequired,promotionFreeze,rollbackPlanRequired',
      'unexpected release-audit developer/create ČOVEČNOST visual governance contract shape',
    );
    assert(body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualGovernance.auditVisibility === 'audit-safe-readiness-only', 'unexpected release-audit developer/create ČOVEČNOST visual governance visibility');
    assert(body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualGovernance.currentWawe === body.data.rollout.currentWawe, 'unexpected release-audit developer/create ČOVEČNOST current WAWE');
    assert(body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualGovernance.eligibleNextWawe === body.data.rollout.eligibleNextWawe, 'unexpected release-audit developer/create ČOVEČNOST next WAWE');
    assert(body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.aiIdentityFinanceGovernance.canonicalName === 'AI LIČNA KARTA + AI BANKARSKI RAČUN', 'unexpected release-audit developer/create AI identity-finance package name');
    assert(body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.aiIdentityFinanceGovernance.paymentVerificationManagedBy === '/api/extrimli/extrondol', 'unexpected release-audit AI identity-finance payment verification owner');
    assert(body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.aiIdentityFinanceGovernance.bankAccountGovernance.realBankAccountStoredInGit === false, 'unexpected release-audit AI identity-finance Git storage flag');
    assert(body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualGovernance.promotionFreeze === body.data.rollout.promotionFreeze, 'unexpected release-audit developer/create ČOVEČNOST promotion freeze');
    assert(body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualGovernance.humanReviewRequired === true, 'unexpected release-audit developer/create ČOVEČNOST human review requirement');
    assert(body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualGovernance.rollbackPlanRequired === true, 'unexpected release-audit developer/create ČOVEČNOST rollback requirement');
    assert(body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualGovernance.downstreamSync === 'follow-up-only-until-io-openui-ao-adopts-audit-safe-summary', 'unexpected release-audit developer/create ČOVEČNOST downstream sync policy');
    assert(body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.roadmapExecution.roadmapStageId === 'v5-extrondol-release-audit-and-orchestration', 'unexpected release-audit developer/create roadmap stage');
    assert(body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.roadmapExecution.v700Extension.roadmapStageId === 'v700-apdejt-na-verziju-700', 'unexpected release-audit developer/create V700 roadmap extension stage');
    assert(body.data.objektnoOrijentisanaProngilacija.term === 'Objektno orijentisana prongilacija', 'unexpected object-oriented prongilacija term');
    assert(body.data.objektnoOrijentisanaProngilacija.technicalSignalSource === '/api/extrimli/extrem', 'unexpected object-oriented prongilacija source');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.objektnoOrijentisanaProngilacija.status), 'unexpected object-oriented prongilacija status');
    assert(body.data.funkcinalnoProgramiranjeEnergetskogMisaonogToka.term === 'FUNKCINALNO PROGRAMIRANJE ENERGETSKOG MISAONOG TOKA', 'unexpected functional energy-flow term');
    assert(body.data.funkcinalnoProgramiranjeEnergetskogMisaonogToka.technicalSignalSource === '/api/extrimli/extrem', 'unexpected functional energy-flow source');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.funkcinalnoProgramiranjeEnergetskogMisaonogToka.status), 'unexpected functional energy-flow status');
    assert(body.data.funkcionalnoProgramiranjeUzvisenogMisanogToka.term === 'FUNKCIONALNO PROGRAMIRANJE UZVIŠENOG MISANOG TOKA', 'unexpected elevated thought-flow term');
    assert(body.data.funkcionalnoProgramiranjeUzvisenogMisanogToka.technicalSignalSource === '/api/extrimli/extrem', 'unexpected elevated thought-flow source');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.funkcionalnoProgramiranjeUzvisenogMisanogToka.status), 'unexpected elevated thought-flow status');
    assert(body.data.funkcionalnoProgramiranjePravednogMisaonogToka.term === 'FUNKCIONALNO PROGRAMIRANJE PRAVEDNOG MISAONOG TOKA', 'unexpected fair thought-flow term');
    assert(body.data.funkcionalnoProgramiranjePravednogMisaonogToka.technicalSignalSource === '/api/extrimli/extrem', 'unexpected fair thought-flow source');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.funkcionalnoProgramiranjePravednogMisaonogToka.status), 'unexpected fair thought-flow status');
    assert(body.data.programskiJezikInformacionihTokova.term === 'PROGRAMSKI JEZIK INFORMACIONIH TOKOVA', 'unexpected informational-flow term');
    assert(body.data.programskiJezikInformacionihTokova.technicalSignalSource === '/api/extrimli/extrem', 'unexpected informational-flow source');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.programskiJezikInformacionihTokova.status), 'unexpected informational-flow status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.programskiJezikInformacionihTokova.flowMetrics.forStatus), 'unexpected informational-flow FOR status');
    assert(body.data.releaseAuditSummary.programskiJezikInformacionihTokovaGovernance.sourceOfTruth === '/api/extrimli/extrem', 'unexpected informational-flow audit source');
    assert(body.data.releaseAuditSummary.programskiJezikInformacionihTokovaGovernance.status === body.data.programskiJezikInformacionihTokova.status, 'informational-flow audit status mismatch');
    assert(body.data.releaseAuditSummary.programskiJezikInformacionihTokovaGovernance.forStatus === body.data.programskiJezikInformacionihTokova.flowMetrics.forStatus, 'informational-flow audit FOR status mismatch');
    assert(body.data.extremProfiler.programskiJezikInformacionihTokova.term === 'PROGRAMSKI JEZIK INFORMACIONIH TOKOVA', 'unexpected EXTREM informational-flow term');
    assert(body.data.extremProfiler.programskiJezikInformacionihTokova.forLoopBinding.sourceModel === 'PETLJE', 'unexpected EXTREM informational-flow FOR source model');
    assert(body.data.programskiJezikPretpostavka.term === 'PROGRAMSKI JEZIK PRETPOSTAVKA (KLJUČNE INFORMACIJE SA UČINIM OBLIKOM)', 'unexpected pretpostavka term');
    assert(body.data.programskiJezikPretpostavka.technicalSignalSource === '/api/extrimli/extrem', 'unexpected pretpostavka source');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.programskiJezikPretpostavka.status), 'unexpected pretpostavka status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.programskiJezikPretpostavka.flowMetrics.forStatus), 'unexpected pretpostavka FOR status');
    assert(body.data.releaseAuditSummary.programskiJezikPretpostavkaGovernance.sourceOfTruth === '/api/extrimli/extrem', 'unexpected pretpostavka audit source');
    assert(body.data.releaseAuditSummary.programskiJezikPretpostavkaGovernance.status === body.data.programskiJezikPretpostavka.status, 'pretpostavka audit status mismatch');
    assert(body.data.releaseAuditSummary.programskiJezikPretpostavkaGovernance.forStatus === body.data.programskiJezikPretpostavka.flowMetrics.forStatus, 'pretpostavka audit FOR status mismatch');
    assert(body.data.programskiJezikParadigmaOblikovanjeTela.term === 'PROGRAMSKI JEZIK PARADIGMA I OBLIKOVANJE TELA (OBJEKAT U SISTEMU, ADAPTACIJA SA FUNKCIJAMA)', 'unexpected paradigma/body-shaping term');
    assert(body.data.programskiJezikSpecijalizovanZaIgrice.term === 'PROGRAMSKI JEZIK SPECIJALIZOVAN ZA IGRICE', 'unexpected gaming DSL term');
    assert(body.data.programskiJezikSpecijalizovanZaIgrice.technicalSignalSource === '/api/extrimli/extrem', 'unexpected gaming DSL source');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.programskiJezikSpecijalizovanZaIgrice.status), 'unexpected gaming DSL status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.programskiJezikSpecijalizovanZaIgrice.gamingDomainMetrics.forStatus), 'unexpected gaming DSL FOR status');
    assert(body.data.releaseAuditSummary.programskiJezikSpecijalizovanZaIgriceGovernance.sourceOfTruth === '/api/extrimli/extrem', 'unexpected gaming DSL audit source');
    assert(body.data.releaseAuditSummary.programskiJezikSpecijalizovanZaIgriceGovernance.status === body.data.programskiJezikSpecijalizovanZaIgrice.status, 'gaming DSL audit status mismatch');
    assert(body.data.releaseAuditSummary.programskiJezikSpecijalizovanZaIgriceGovernance.forStatus === body.data.programskiJezikSpecijalizovanZaIgrice.gamingDomainMetrics.forStatus, 'gaming DSL audit FOR status mismatch');
    assert(body.data.programskiJezikParadigmaOblikovanjeTela.technicalSignalSource === '/api/extrimli/extrem', 'unexpected paradigma/body-shaping source');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.programskiJezikParadigmaOblikovanjeTela.status), 'unexpected paradigma/body-shaping status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.programskiJezikParadigmaOblikovanjeTela.paradigmMetrics.forStatus), 'unexpected paradigma/body-shaping FOR status');
    assert(body.data.releaseAuditSummary.programskiJezikParadigmaOblikovanjeTelaGovernance.sourceOfTruth === '/api/extrimli/extrem', 'unexpected paradigma/body-shaping audit source');
    assert(body.data.releaseAuditSummary.programskiJezikParadigmaOblikovanjeTelaGovernance.status === body.data.programskiJezikParadigmaOblikovanjeTela.status, 'paradigma/body-shaping audit status mismatch');
    assert(body.data.releaseAuditSummary.programskiJezikParadigmaOblikovanjeTelaGovernance.forStatus === body.data.programskiJezikParadigmaOblikovanjeTela.paradigmMetrics.forStatus, 'paradigma/body-shaping audit FOR status mismatch');
    assert(body.data.extremProfiler.programskiJezikParadigmaOblikovanjeTela.term === 'PROGRAMSKI JEZIK PARADIGMA I OBLIKOVANJE TELA (OBJEKAT U SISTEMU, ADAPTACIJA SA FUNKCIJAMA)', 'unexpected EXTREM paradigma/body-shaping term');
    assert(body.data.extremProfiler.programskiJezikParadigmaOblikovanjeTela.technicalEvidence.forLoopBinding.sourceModel === 'PETLJE', 'unexpected EXTREM paradigma/body-shaping FOR source model');
    assert(body.data.radniTaktMozgaMislilac.term === 'RADNI TAKT MOZGA (MISLILAC)', 'unexpected radni takt term');
    assert(body.data.radniTaktMozgaMislilac.technicalSignalSource === '/api/extrimli/extrem', 'unexpected radni takt source');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.radniTaktMozgaMislilac.status), 'unexpected radni takt status');
    assert(body.data.paradijogonalnoProgrimiranje.term === 'PARADIJOGONALNO PROGRIMIRANJE (INSTRUMENTALNI VID U SIHOFIZI PROSPARITET OBLAČNOG/CLOUD PREDELA)', 'unexpected paradijogonalno term');
    assert(body.data.paradijogonalnoProgrimiranje.technicalSignalSource === '/api/extrimli/extrem', 'unexpected paradijogonalno source');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.paradijogonalnoProgrimiranje.status), 'unexpected paradijogonalno status');
    assert(body.data.funkionalnoProgramiranjePravnogMisaonogToka.term === 'FUNKIONALNO PROGRAMIRANJE PRAVNOG MISAONOG TOKA', 'unexpected legal-functional term');
    assert(body.data.funkionalnoProgramiranjePravnogMisaonogToka.technicalSignalSource === '/api/extrimli/extrem', 'unexpected legal-functional source');
    assert(body.data.funkionalnoProgramiranjePravnogMisaonogToka.legalBoundary.sourceTrack === 'KRALJEVSKI PRAVNI UNIVERZITET', 'unexpected legal-functional source track');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.funkionalnoProgramiranjePravnogMisaonogToka.status), 'unexpected legal-functional status');
    assert(body.data.proporcionalnoProgramiranje.term === 'PROPORCIONALNO PROGRAMIRANJE', 'unexpected proportional programming term');
    assert(body.data.proporcionalnoProgramiranje.technicalSignalSource === '/api/extrimli/extrem', 'unexpected proportional programming source');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.proporcionalnoProgramiranje.status), 'unexpected proportional programming status');
    assert(body.data.spajinoProporcionalnoProgramiranjeUniverzitet.term === 'SPAJINO PROPORCIONALNO PROGRAMIRANJE UNIVERZITET', 'unexpected university track term');
    assert(body.data.spajinoProporcionalnoProgramiranjeUniverzitet.technicalSignalSource === '/api/extrimli/extrem', 'unexpected university track source');
    assert(body.data.spajinoProporcionalnoProgramiranjeUniverzitet.parentTrack === 'PROPORCIONALNO PROGRAMIRANJE', 'unexpected university parent track');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.spajinoProporcionalnoProgramiranjeUniverzitet.status), 'unexpected university track status');
    assert(body.data.vrhProgramskogEkviladenta.term === 'VRH PROGRAMSKOG EKVILADENTA', 'unexpected vrh term');
    assert(body.data.vrhProgramskogEkviladenta.technicalSignalSource === '/api/extrimli/extrem', 'unexpected vrh source');
    assert(body.data.vrhProgramskogEkviladenta.parentTrack === 'PROPORCIONALNO PROGRAMIRANJE', 'unexpected vrh parent track');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.vrhProgramskogEkviladenta.status), 'unexpected vrh status');
    const vrhDocumentationReferences = (
      body.data.vrhProgramskogEkviladenta as { documentationOnlyReferences?: Array<{ url: string; runtimeInputAllowed: boolean }> }
    ).documentationOnlyReferences ?? [];
    assert(
      vrhDocumentationReferences.some(
        (reference) =>
          reference.url === 'https://chatgpt.com/share/6ab3c696-e9d0-83ed-ab2a-977fd811c82d?ogimg=plain'
          && reference.runtimeInputAllowed === false,
      ),
      'missing second VRH documentation-only reference in EXTRONDOL API output',
    );
    assert(body.data.epicElikvadenti.term === 'Objektno orijentusano uzdizanje epskih elikvadenata', 'unexpected epic elikvadenti term');
    assert(body.data.epicElikvadenti.technicalSignalSource === '/api/extrimli/extrem', 'unexpected epic elikvadenti source');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.epicElikvadenti.status), 'unexpected epic elikvadenti status');
    assert(body.data.mobilnaLinija.lineType === 'Mobilna linija', 'unexpected mobilna line type');
    assert(body.data.mobilnaLinija.packageCatalog.length >= 1, 'mobilna package catalog should exist');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.mobilnaLinija.activationStatus), 'unexpected mobilna activation status');
    assert(Array.isArray(body.data.mobilnaLinija.freezeReasons), 'mobilna freeze reasons should be array');
    assert(['LOW', 'MODERATE', 'HIGH', 'CRITICAL'].includes(body.data.extremProfiler.profile.conflictIntensity), 'unexpected EXTREM conflict intensity');
    assert(body.data.extremProfiler.profile.bottleneckLayer === 'DISKVIT', 'EXTREM profiler bottleneck layer mismatch');
    assert(body.data.extremProfiler.dokerKuratIzekDokarTrack.sequenceStates.map((item) => item.token).join(',') === 'DOKER,KURAT,IZEK,DOKAR', 'unexpected EXTREM quartet token order');
    assert(body.data.dokerKuratIzekDokarTrack.sequenceStates.map((item) => item.token).join(',') === 'DOKER,KURAT,IZEK,DOKAR', 'unexpected EXTRONDOL quartet token order');
    assert(body.data.extremProfiler.petljeSignals.summary.readinessScore >= 0, 'missing petlje readiness summary');
    assert(typeof body.data.extremProfiler.petljeSignals.summary.freezeRequired === 'boolean', 'petlje freeze summary should be boolean');
    assert(body.data.releaseAuditSummary.semaFormulaGovernance.canonicalExpression === 'ŠEMA + ŠEMA + ALL ŠEMA == MUŠEMA', 'missing formula governance expression');
    assert(body.data.releaseAuditSummary.epicElikvadentiGovernance.sourceOfTruth === '/api/extrimli/extrem', 'missing epic governance source');
    assert(body.data.releaseAuditSummary.funkcinalnoProgramiranjeEnergetskogMisaonogTokaGovernance.sourceOfTruth === '/api/extrimli/extrem', 'missing functional energy-flow governance source');
    assert(body.data.releaseAuditSummary.funkcionalnoProgramiranjeUzvisenogMisanogTokaGovernance.sourceOfTruth === '/api/extrimli/extrem', 'missing elevated thought-flow governance source');
    assert(body.data.releaseAuditSummary.funkcionalnoProgramiranjePravednogMisaonogTokaGovernance.sourceOfTruth === '/api/extrimli/extrem', 'missing fair thought-flow governance source');
    assert(body.data.releaseAuditSummary.radniTaktMozgaMislilacGovernance.sourceOfTruth === '/api/extrimli/extrem', 'missing radni takt governance source');
    assert(body.data.releaseAuditSummary.paradijogonalnoProgrimiranjeGovernance.sourceOfTruth === '/api/extrimli/extrem', 'missing paradijogonalno governance source');
    assert(body.data.releaseAuditSummary.funkionalnoProgramiranjePravnogMisaonogTokaGovernance.sourceOfTruth === '/api/extrimli/extrem', 'missing legal-functional governance source');
    assert(body.data.releaseAuditSummary.proporcionalnoProgramiranjeGovernance.sourceOfTruth === '/api/extrimli/extrem', 'missing proportional programming governance source');
    assert(body.data.releaseAuditSummary.spajinoProporcionalnoProgramiranjeUniverzitetGovernance.sourceOfTruth === '/api/extrimli/extrem', 'missing university governance source');
    assert(body.data.releaseAuditSummary.vrhProgramskogEkviladentaGovernance.sourceOfTruth === '/api/extrimli/extrem', 'missing vrh governance source');
    assert(body.data.releaseAuditSummary.petljeGovernance.sourceOfTruth === '/api/extrimli/extrem', 'missing petlje governance source');
    assert(body.data.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.dailyOperationalCadence.taskPriorities.join(',') === '1,2,3', 'missing developer/create cadence priorities');
    assert(typeof body.data.releaseAuditSummary.petljeGovernance.freezeRequired === 'boolean', 'petlje governance freeze should be boolean');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.releaseAuditSummary.funkcinalnoProgramiranjeEnergetskogMisaonogTokaGovernance.status), 'unexpected functional energy-flow governance status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.releaseAuditSummary.funkcionalnoProgramiranjeUzvisenogMisanogTokaGovernance.status), 'unexpected elevated thought-flow governance status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.releaseAuditSummary.funkcionalnoProgramiranjePravednogMisaonogTokaGovernance.status), 'unexpected fair thought-flow governance status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.releaseAuditSummary.radniTaktMozgaMislilacGovernance.status), 'unexpected radni takt governance status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.releaseAuditSummary.paradijogonalnoProgrimiranjeGovernance.status), 'unexpected paradijogonalno governance status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.releaseAuditSummary.funkionalnoProgramiranjePravnogMisaonogTokaGovernance.status), 'unexpected legal-functional governance status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.releaseAuditSummary.proporcionalnoProgramiranjeGovernance.status), 'unexpected proportional programming governance status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.releaseAuditSummary.spajinoProporcionalnoProgramiranjeUniverzitetGovernance.status), 'unexpected university governance status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.releaseAuditSummary.vrhProgramskogEkviladentaGovernance.status), 'unexpected vrh governance status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.releaseAuditSummary.epicElikvadentiGovernance.status), 'unexpected epic governance status');
    assert(['PASSED', 'BLOCKED'].includes(body.data.releaseAuditSummary.semaFormulaGovernance.status), 'unexpected formula governance status');
    assert(['MUŠEMA_CONFIRMED', 'MUŠEMA_BLOCKED'].includes(body.data.releaseAuditSummary.semaFormulaGovernance.muSemaConclusion), 'unexpected MUŠEMA conclusion');
    assert(body.data.b2bReadiness.governanceDecisions.semaFormulaGate.canonicalExpression === 'ŠEMA + ŠEMA + ALL ŠEMA == MUŠEMA', 'missing B2B formula gate expression');
    assert(['PASSED', 'BLOCKED'].includes(body.data.b2bReadiness.governanceDecisions.semaFormulaGate.status), 'unexpected B2B formula gate status');
    assert(['MUŠEMA_CONFIRMED', 'MUŠEMA_BLOCKED'].includes(body.data.b2bReadiness.governanceDecisions.semaFormulaGate.muSemaConclusion), 'unexpected B2B MUŠEMA conclusion');
    assert(typeof body.data.b2bReadiness.governanceDecisions.semaFormulaGate.formulaHolds === 'boolean', 'B2B formulaHolds should be boolean');
    assert(Array.isArray(body.data.b2bReadiness.governanceDecisions.semaFormulaGate.blockerReasons), 'B2B formula blocker reasons should be array');
    assert(body.data.distanceRatioEkvilaterTable.rows.length === 3, 'distance ratio table must expose 3 rows');
  });

  await test('GET /api/extrimli/extrem returns profiler report and headers', async () => {
    const response = await getExtrem();
    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Extrimli-Extrem-Contract-Version') === 'v1-extrem-profiler', 'missing EXTREM contract header');

    const body = await response.json() as {
      data: {
        sourceOfTruth: string;
        profile: { conflictIntensity: string; bottleneckLayer: string };
        mobilnaLinija: {
          contractVersion: string;
          installationMessages: { required: boolean; status: string; messages: string[] };
          packagePlanHint: { recommendedPlanTier: string; readiness: string };
        };
        funkcinalnoProgramiranjeEnergetskogMisaonogToka: { term: string; contractVersion: string; readiness: { status: string; score: number } };
        funkcionalnoProgramiranjeUzvisenogMisanogToka: { term: string; contractVersion: string; readiness: { status: string; score: number } };
        proporcionalnoProgramiranje: {
          term: string;
          contractVersion: string;
          readiness: { status: string; score: number };
          subSignals: {
            protkrovFunkcija: { term: string };
            objektneParadoksalneEtape: { term: string };
          };
        };
        spajinoProporcionalnoProgramiranjeUniverzitet: {
          term: string;
          contractVersion: string;
          parentTrack: string;
          readiness: { status: string; score: number };
        };
        vrhProgramskogEkviladenta: {
          term: string;
          contractVersion: string;
          parentTrack: string;
          readiness: { status: string; score: number };
        };
        funkcionalnoProgramiranjePravednogMisaonogToka: { term: string; contractVersion: string; readiness: { status: string; score: number } };
        radniTaktMozgaMislilac: {
          term: string;
          contractVersion: string;
          readiness: { status: string; score: number };
          epilogijaCovecnosti: {
            title: string;
            visualReference: string;
            packageOutputs: { posterSummary: string };
            dokerKuratIzekDokarOverlay: { IZEK: string };
            imageToSignalProfile: { scenarioId: string; signalOutputs: { readinessScore: number; conflictPressurePercent: number; deterministicFallbackRequired: boolean } };
          };
        };
        paradijogonalnoProgrimiranje: { term: string; contractVersion: string; readiness: { status: string; score: number } };
        funkionalnoProgramiranjePravnogMisaonogToka: { term: string; contractVersion: string; readiness: { status: string; score: number }; legalCoupling: { sourceTrack: string } };
        objektnoOrijentisanaProngilacija: { term: string; contractVersion: string; readiness: { status: string; score: number } };
        objektnoOrijentusanoUzdizanjeEpskihElikvadenata: { term: string; contractVersion: string; readiness: { status: string; score: number } };
        dokerKuratIzekDokarTrack: { sequenceStates: Array<{ token: string; status: string }>; freezeControlledByExtrem: boolean };
        petljeSignals: {
          sourceOfTruth: string;
          summary: { readinessScore: number; conflictScore: number; freezeRequired: boolean };
        };
        semaMuSemaFormula: { canonicalExpression: string; status: string; muSemaConclusion: string; formulaHolds: boolean };
        governanceSignal: { freezeRequired: boolean };
        dokDikDakDukConsistencyHealth: ExtrimliDokDikDakDukConsistencyHealth;
        optimization: { maximumGraphicsUnlockEligible: boolean };
      };
    };
    assert(body.data.sourceOfTruth === '/api/extrimli/extrem', 'unexpected EXTREM sourceOfTruth');
    assert(body.data.profile.bottleneckLayer === 'DISKVIT', 'unexpected EXTREM bottleneck layer');
    assert(['LOW', 'MODERATE', 'HIGH', 'CRITICAL'].includes(body.data.profile.conflictIntensity), 'unexpected EXTREM conflict intensity');
    assert(body.data.mobilnaLinija.contractVersion === 'v1-mobilna-linija-installation', 'unexpected mobilna contract version');
    assert(body.data.mobilnaLinija.installationMessages.required === true, 'mobilna installation messages must be required');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.mobilnaLinija.installationMessages.status), 'unexpected mobilna installation status');
    assert(body.data.mobilnaLinija.installationMessages.messages.length >= 1, 'mobilna installation messages should be present');
    assert(['BASIC', 'SMART', 'PRO', 'NONE'].includes(body.data.mobilnaLinija.packagePlanHint.recommendedPlanTier), 'unexpected mobilna package hint tier');
    assert(body.data.funkcinalnoProgramiranjeEnergetskogMisaonogToka.term === 'FUNKCINALNO PROGRAMIRANJE ENERGETSKOG MISAONOG TOKA', 'unexpected EXTREM functional energy-flow term');
    assert(body.data.funkcinalnoProgramiranjeEnergetskogMisaonogToka.contractVersion === EXTRIMLI_EXTREM_FUNKCINALNO_PROGRAMIRANJE_ENERGETSKOG_MISAONOG_TOKA_CONTRACT_VERSION, 'unexpected EXTREM functional energy-flow contract');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.funkcinalnoProgramiranjeEnergetskogMisaonogToka.readiness.status), 'unexpected EXTREM functional energy-flow status');
    assert(Number.isFinite(body.data.funkcinalnoProgramiranjeEnergetskogMisaonogToka.readiness.score), 'functional energy-flow score must be finite');
    assert(body.data.funkcionalnoProgramiranjeUzvisenogMisanogToka.term === 'FUNKCIONALNO PROGRAMIRANJE UZVIŠENOG MISANOG TOKA', 'unexpected EXTREM elevated thought-flow term');
    assert(body.data.funkcionalnoProgramiranjeUzvisenogMisanogToka.contractVersion === EXTRIMLI_EXTREM_FUNKCIONALNO_PROGRAMIRANJE_UZVISENOG_MISANOG_TOKA_CONTRACT_VERSION, 'unexpected EXTREM elevated thought-flow contract');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.funkcionalnoProgramiranjeUzvisenogMisanogToka.readiness.status), 'unexpected EXTREM elevated thought-flow status');
    assert(Number.isFinite(body.data.funkcionalnoProgramiranjeUzvisenogMisanogToka.readiness.score), 'elevated thought-flow score must be finite');
    assert(body.data.funkcionalnoProgramiranjePravednogMisaonogToka.term === 'FUNKCIONALNO PROGRAMIRANJE PRAVEDNOG MISAONOG TOKA', 'unexpected EXTREM fair thought-flow term');
    assert(body.data.funkcionalnoProgramiranjePravednogMisaonogToka.contractVersion === EXTRIMLI_EXTREM_FUNKCIONALNO_PROGRAMIRANJE_PRAVEDNOG_MISAONOG_TOKA_CONTRACT_VERSION, 'unexpected EXTREM fair thought-flow contract');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.funkcionalnoProgramiranjePravednogMisaonogToka.readiness.status), 'unexpected EXTREM fair thought-flow status');
    assert(Number.isFinite(body.data.funkcionalnoProgramiranjePravednogMisaonogToka.readiness.score), 'fair thought-flow score must be finite');
    assert(body.data.radniTaktMozgaMislilac.term === 'RADNI TAKT MOZGA (MISLILAC)', 'unexpected EXTREM radni takt term');
    assert(body.data.radniTaktMozgaMislilac.contractVersion === EXTRIMLI_EXTREM_RADNI_TAKT_MOZGA_MISLILAC_CONTRACT_VERSION, 'unexpected EXTREM radni takt contract');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.radniTaktMozgaMislilac.readiness.status), 'unexpected EXTREM radni takt status');
    assert(Number.isFinite(body.data.radniTaktMozgaMislilac.readiness.score), 'radni takt score must be finite');
    assert(body.data.radniTaktMozgaMislilac.epilogijaCovecnosti.title === 'EPILOGIJA ČOVEČANSTVA', 'unexpected EXTREM radni takt epilog title');
    assert(body.data.radniTaktMozgaMislilac.epilogijaCovecnosti.visualReference.includes('b485b700-f670-4f71-9f54-47b29a4155ec'), 'unexpected EXTREM radni takt epilog visual reference');
    assert(body.data.radniTaktMozgaMislilac.epilogijaCovecnosti.packageOutputs.posterSummary.includes('Obogaćuj se prirodom'), 'unexpected EXTREM radni takt poster summary');
    assert(body.data.radniTaktMozgaMislilac.epilogijaCovecnosti.imageToSignalProfile.scenarioId === 'priroda-zdrav-zivot-covecanstvo', 'unexpected EXTREM image-to-signal scenario');
    assert(Number.isFinite(body.data.radniTaktMozgaMislilac.epilogijaCovecnosti.imageToSignalProfile.signalOutputs.readinessScore), 'unexpected EXTREM image-to-signal readiness score');
    assert(body.data.radniTaktMozgaMislilac.epilogijaCovecnosti.imageToSignalProfile.signalOutputs.conflictPressurePercent >= 0, 'unexpected EXTREM image-to-signal conflict pressure');
    assert(typeof body.data.radniTaktMozgaMislilac.epilogijaCovecnosti.imageToSignalProfile.signalOutputs.deterministicFallbackRequired === 'boolean', 'unexpected EXTREM image-to-signal deterministic fallback type');
    assert(body.data.radniTaktMozgaMislilac.epilogijaCovecnosti.dokerKuratIzekDokarOverlay.IZEK.includes('review checkpoint'), 'unexpected EXTREM radni takt IZEK overlay');
    assert(body.data.paradijogonalnoProgrimiranje.term === 'PARADIJOGONALNO PROGRIMIRANJE (INSTRUMENTALNI VID U SIHOFIZI PROSPARITET OBLAČNOG/CLOUD PREDELA)', 'unexpected EXTREM paradijogonalno term');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.paradijogonalnoProgrimiranje.readiness.status), 'unexpected EXTREM paradijogonalno status');
    assert(Number.isFinite(body.data.paradijogonalnoProgrimiranje.readiness.score), 'paradijogonalno score must be finite');
    assert(body.data.funkionalnoProgramiranjePravnogMisaonogToka.term === 'FUNKIONALNO PROGRAMIRANJE PRAVNOG MISAONOG TOKA', 'unexpected EXTREM legal-functional term');
    assert(body.data.funkionalnoProgramiranjePravnogMisaonogToka.contractVersion === EXTRIMLI_EXTREM_FUNKIONALNO_PROGRAMIRANJE_PRAVNOG_MISAONOG_TOKA_CONTRACT_VERSION, 'unexpected EXTREM legal-functional contract');
    assert(body.data.funkionalnoProgramiranjePravnogMisaonogToka.legalCoupling.sourceTrack === 'KRALJEVSKI PRAVNI UNIVERZITET', 'unexpected EXTREM legal-functional source track');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.funkionalnoProgramiranjePravnogMisaonogToka.readiness.status), 'unexpected EXTREM legal-functional status');
    assert(Number.isFinite(body.data.funkionalnoProgramiranjePravnogMisaonogToka.readiness.score), 'legal-functional score must be finite');
    assert(body.data.proporcionalnoProgramiranje.term === 'PROPORCIONALNO PROGRAMIRANJE', 'unexpected EXTREM proportional programming term');
    assert(body.data.proporcionalnoProgramiranje.contractVersion === EXTRIMLI_EXTREM_PROPORCIONALNO_PROGRAMIRANJE_CONTRACT_VERSION, 'unexpected EXTREM proportional programming contract');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.proporcionalnoProgramiranje.readiness.status), 'unexpected EXTREM proportional programming status');
    assert(Number.isFinite(body.data.proporcionalnoProgramiranje.readiness.score), 'proportional programming score must be finite');
    assert(body.data.proporcionalnoProgramiranje.subSignals.protkrovFunkcija.term === 'PROTKROV FUNKCIJA', 'unexpected EXTREM PROTKROV FUNKCIJA term');
    assert(body.data.proporcionalnoProgramiranje.subSignals.objektneParadoksalneEtape.term === 'OBJEKTNE PARADOKSALNE ETAPE', 'unexpected EXTREM OBJEKTNE PARADOKSALNE ETAPE term');
    assert(body.data.spajinoProporcionalnoProgramiranjeUniverzitet.term === 'SPAJINO PROPORCIONALNO PROGRAMIRANJE UNIVERZITET', 'unexpected EXTREM university term');
    assert(body.data.spajinoProporcionalnoProgramiranjeUniverzitet.contractVersion === EXTRIMLI_EXTREM_SPAJINO_PROPORCIONALNO_PROGRAMIRANJE_UNIVERZITET_CONTRACT_VERSION, 'unexpected EXTREM university contract');
    assert(body.data.spajinoProporcionalnoProgramiranjeUniverzitet.parentTrack === 'PROPORCIONALNO PROGRAMIRANJE', 'unexpected EXTREM university parent track');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.spajinoProporcionalnoProgramiranjeUniverzitet.readiness.status), 'unexpected EXTREM university status');
    assert(Number.isFinite(body.data.spajinoProporcionalnoProgramiranjeUniverzitet.readiness.score), 'university score must be finite');
    assert(body.data.vrhProgramskogEkviladenta.term === 'VRH PROGRAMSKOG EKVILADENTA', 'unexpected EXTREM vrh term');
    assert(body.data.vrhProgramskogEkviladenta.contractVersion === EXTRIMLI_EXTREM_VRH_PROGRAMSKOG_EKVILADENTA_CONTRACT_VERSION, 'unexpected EXTREM vrh contract');
    assert(body.data.vrhProgramskogEkviladenta.parentTrack === 'PROPORCIONALNO PROGRAMIRANJE', 'unexpected EXTREM vrh parent track');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.vrhProgramskogEkviladenta.readiness.status), 'unexpected EXTREM vrh status');
    const extremVrhChatGptReferences = (
      body.data.vrhProgramskogEkviladenta as { meaningLock?: { chatGptShareReferences?: Array<{ url: string; runtimeInputAllowed: boolean }> } }
    ).meaningLock?.chatGptShareReferences ?? [];
    assert(
      extremVrhChatGptReferences.some(
        (reference) =>
          reference.url === 'https://chatgpt.com/share/6ab3c696-e9d0-83ed-ab2a-977fd811c82d?ogimg=plain'
          && reference.runtimeInputAllowed === false,
      ),
      'missing second VRH documentation-only reference in EXTREM API output',
    );
    assert(Number.isFinite(body.data.vrhProgramskogEkviladenta.readiness.score), 'vrh score must be finite');
    assert(body.data.objektnoOrijentisanaProngilacija.term === 'Objektno orijentisana prongilacija', 'unexpected EXTREM object-oriented prongilacija term');
    assert(
      body.data.objektnoOrijentisanaProngilacija.contractVersion === EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_CONTRACT_VERSION,
      'unexpected EXTREM object-oriented prongilacija contract',
    );
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.objektnoOrijentisanaProngilacija.readiness.status), 'unexpected EXTREM object-oriented prongilacija status');
    assert(Number.isFinite(body.data.objektnoOrijentisanaProngilacija.readiness.score), 'object-oriented prongilacija score must be finite');
    assert(body.data.objektnoOrijentusanoUzdizanjeEpskihElikvadenata.term === 'Objektno orijentusano uzdizanje epskih elikvadenata', 'unexpected EXTREM epic elikvadenti term');
    assert(
      body.data.objektnoOrijentusanoUzdizanjeEpskihElikvadenata.contractVersion === EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTUSANO_UZDIZANJE_EPSKIH_ELIKVADENATA_CONTRACT_VERSION,
      'unexpected EXTREM epic elikvadenti contract',
    );
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.objektnoOrijentusanoUzdizanjeEpskihElikvadenata.readiness.status), 'unexpected EXTREM epic elikvadenti status');
    assert(body.data.dokerKuratIzekDokarTrack.sequenceStates.map((item) => item.token).join(',') === 'DOKER,KURAT,IZEK,DOKAR', 'unexpected EXTREM quartet token order');
    assert(typeof body.data.dokerKuratIzekDokarTrack.freezeControlledByExtrem === 'boolean', 'quartet freeze control should be boolean');
    assert(body.data.petljeSignals.sourceOfTruth === '/api/extrimli/extrem', 'unexpected EXTREM petlje source');
    assert(body.data.petljeSignals.summary.readinessScore >= 0, 'petlje readiness score should be present');
    assert(typeof body.data.petljeSignals.summary.freezeRequired === 'boolean', 'petlje freeze should be boolean');
    assert(body.data.semaMuSemaFormula.canonicalExpression === 'ŠEMA + ŠEMA + ALL ŠEMA == MUŠEMA', 'unexpected EXTREM formula expression');
    assert(['PASSED', 'BLOCKED'].includes(body.data.semaMuSemaFormula.status), 'unexpected EXTREM formula status');
    assert(['MUŠEMA_CONFIRMED', 'MUŠEMA_BLOCKED'].includes(body.data.semaMuSemaFormula.muSemaConclusion), 'unexpected EXTREM MUŠEMA conclusion');
    assert(typeof body.data.semaMuSemaFormula.formulaHolds === 'boolean', 'formulaHolds should be boolean');
    assert(typeof body.data.governanceSignal.freezeRequired === 'boolean', 'freezeRequired should be boolean');
    assert(body.data.dokDikDakDukConsistencyHealth.sourceOfTruth === '/api/extrimli/extrem', 'unexpected EXTREM consistency source');
    assert(body.data.dokDikDakDukConsistencyHealth.scopeLock.join(',') === 'DOK,DIK,DAK,DUK,FOR', 'unexpected EXTREM consistency scope lock');
    assert(body.data.dokDikDakDukConsistencyHealth.ownershipBoundary.dok === 'EXTREM', 'unexpected EXTREM DOK ownership');
    assert(body.data.dokDikDakDukConsistencyHealth.ownershipBoundary.dik === 'EXTREM', 'unexpected EXTREM DIK ownership');
    assert(body.data.dokDikDakDukConsistencyHealth.ownershipBoundary.for === 'EXTREM', 'unexpected EXTREM FOR ownership');
    assert(body.data.dokDikDakDukConsistencyHealth.ownershipBoundary.dak === 'EXTRONDOL', 'unexpected EXTREM DAK ownership');
    assert(body.data.dokDikDakDukConsistencyHealth.ownershipBoundary.duk === 'EXTRONDOL', 'unexpected EXTREM DUK ownership');
    assert(body.data.dokDikDakDukConsistencyHealth.signalSources.dok.includes('find(kind=DOK PETLJA)'), 'unexpected EXTREM DOK source reference');
    assert(body.data.dokDikDakDukConsistencyHealth.signalSources.dik.includes('find(kind=DIK PETLJA)'), 'unexpected EXTREM DIK source reference');
    assert(body.data.dokDikDakDukConsistencyHealth.signalSources.for.includes('forLoopBinding.forEvidence'), 'unexpected EXTREM FOR source reference');
    assert(body.data.dokDikDakDukConsistencyHealth.signalSources.dak.includes('find(token=DAKOR)'), 'unexpected EXTREM DAK source reference');
    assert(body.data.dokDikDakDukConsistencyHealth.signalSources.duk.includes('find(token=DUKAR)'), 'unexpected EXTREM DUK source reference');
    assert(typeof body.data.dokDikDakDukConsistencyHealth.checks.dokSignalPresent === 'boolean', 'EXTREM DOK check should be boolean');
    assert(typeof body.data.dokDikDakDukConsistencyHealth.checks.dikSignalPresent === 'boolean', 'EXTREM DIK check should be boolean');
    assert(typeof body.data.dokDikDakDukConsistencyHealth.checks.forSignalPresent === 'boolean', 'EXTREM FOR check should be boolean');
    assert(typeof body.data.dokDikDakDukConsistencyHealth.checks.dakMappedToPromotion === 'boolean', 'EXTREM DAK check should be boolean');
    assert(typeof body.data.dokDikDakDukConsistencyHealth.checks.dukMappedToHumanReview === 'boolean', 'EXTREM DUK check should be boolean');
    assert(typeof body.data.dokDikDakDukConsistencyHealth.checks.ownershipBoundaryPreserved === 'boolean', 'EXTREM boundary check should be boolean');
    assert(Array.isArray(body.data.dokDikDakDukConsistencyHealth.reasons), 'EXTREM consistency reasons should be array');
    assert(body.data.dokDikDakDukConsistencyHealth.programskiJezikAnaliza.canonicalName === 'PROGRAMSKI JEZIK ANALIZA', 'unexpected EXTREM programski jezik analiza name');
    assert(body.data.dokDikDakDukConsistencyHealth.programskiJezikAnaliza.scope === 'ispitivanje eskalacije kodesnog zapleta', 'unexpected EXTREM programski jezik analiza scope');
    assert(body.data.dokDikDakDukConsistencyHealth.programskiJezikAnaliza.sourceOfTruthRoutes.join(',') === '/api/extrimli/extrem,/api/extrimli/extrondol', 'unexpected EXTREM programski jezik analiza source routes');
    assert(body.data.dokDikDakDukConsistencyHealth.programskiJezikAnaliza.escalationScore >= 0 && body.data.dokDikDakDukConsistencyHealth.programskiJezikAnaliza.escalationScore <= 100, 'unexpected EXTREM programski jezik analiza escalation score');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.dokDikDakDukConsistencyHealth.programskiJezikAnaliza.escalationStatus), 'unexpected EXTREM programski jezik analiza escalation status');
    assert(body.data.dokDikDakDukConsistencyHealth.programskiJezikProucavanja.canonicalName === 'PROGRAMSKI JEZIK PROUČAVANJA', 'unexpected EXTREM programski jezik proucavanja name');
    assert(body.data.dokDikDakDukConsistencyHealth.programskiJezikProucavanja.programskiEkanalog.canonicalName === 'PROGRAMSKI EKANALOG', 'unexpected EXTREM programski ekanalog name');
    assert(body.data.dokDikDakDukConsistencyHealth.programskiJezikProucavanja.programskiEkanalog.meaning === 'razumevanje logike', 'unexpected EXTREM programski ekanalog meaning');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.equalityLock === 'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == RADNI TAKT MOZGA (MISLILAC)', 'unexpected EXTREM developer/create equality lock');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.driftZeroLayers.join(',') === 'docs,types,routes,tests,workflows', 'unexpected EXTREM developer/create drift-zero layers');
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.dailyOperationalCadence.endOfDayStatuses.join(',') === 'completed,carried-over,blocked', 'unexpected EXTREM developer/create cadence closeout statuses');
    assert(body.data.dokDikDakDukConsistencyHealth.signals.dok.kind === 'DOK PETLJA', 'unexpected EXTREM DOK consistency signal');
    assert(body.data.dokDikDakDukConsistencyHealth.signals.dik.kind === 'DIK PETLJA', 'unexpected EXTREM DIK consistency signal');
    assert(body.data.dokDikDakDukConsistencyHealth.signals.for.kind === 'FOR PETLJA', 'unexpected EXTREM FOR consistency signal');
    assert(body.data.dokDikDakDukConsistencyHealth.signals.dak.token === 'DAKOR', 'unexpected EXTREM DAK consistency token');
    assert(body.data.dokDikDakDukConsistencyHealth.signals.duk.token === 'DUKAR', 'unexpected EXTREM DUK consistency token');
    const extremSignalStatuses = [
      body.data.dokDikDakDukConsistencyHealth.signals.dok.status,
      body.data.dokDikDakDukConsistencyHealth.signals.dik.status,
      body.data.dokDikDakDukConsistencyHealth.signals.for.status,
      body.data.dokDikDakDukConsistencyHealth.signals.dak.status,
      body.data.dokDikDakDukConsistencyHealth.signals.duk.status,
    ];
    if (body.data.dokDikDakDukConsistencyHealth.status === 'READY') {
      assert(extremSignalStatuses.filter((status): status is 'READY' | 'WATCH' | 'BLOCKED' => status !== null).every((status) => status === 'READY'), 'EXTREM READY consistency status requires all resolved component signals to be READY');
    }
    if (!body.data.dokDikDakDukConsistencyHealth.consistent) {
      assert(body.data.dokDikDakDukConsistencyHealth.status === 'BLOCKED', 'EXTREM inconsistent health status must be BLOCKED');
    }
    const extremAllChecksPassing = Object.values(body.data.dokDikDakDukConsistencyHealth.checks).every(Boolean);
    if (body.data.dokDikDakDukConsistencyHealth.status !== 'BLOCKED') {
      assert(extremAllChecksPassing, 'EXTREM non-blocked consistency status requires all checks to pass');
    }
    assert(body.data.dokDikDakDukConsistencyHealth.consistent, 'EXTREM consistency should be true');
    assert(typeof body.data.optimization.maximumGraphicsUnlockEligible === 'boolean', 'maximumGraphicsUnlockEligible should be boolean');
  });

  await test('GET /api/extrimli/spaja-kod returns encapsulated facade and headers', async () => {
    const response = await getSpajaKod();
    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Extrimli-Spaja-Kod-Contract-Version') === 'v1-spaja-kod', 'missing SPAJA KOD contract header');

    const body = await response.json() as {
      data: {
        surfaceName: string;
        sourceOfTruth: string;
        rawPatternVisibility: string;
        completeness: { consistent: boolean; exportReady: boolean };
        readiness: { status: string; governanceOutcome: string; promotionFreeze: boolean };
        publicSignals: {
          auditStatus: string;
          degraded: boolean;
          developerAndCreateStatus: string;
          developerAndCreateImplementationStatus: string;
          smartProgramskiJezikStatus: string;
          napoleonDiskaveriStatus: string;
          sarkazamPrivrednaGranaDigitalizmaStatus: string;
          notes1450Status: string;
          promocijeTiketiBonusiPropusniceAdministrativniBonusiStatus: string;
          vinogradiGrckaRestoranStatus: string;
          radniProstorStatus: string;
          aiIqLaboratorijaStatus: string;
          konstrukcijeIProjektovanjeStatus: string;
          aiIqKonferencijaZaStampuStatus: string;
          radioStatus: string;
          muzickaKutijaStatus: string;
          funkcinalnoProgramiranjeEnergetskogMisaonogTokaStatus: string;
          funkcionalnoProgramiranjeUzvisenogMisanogTokaStatus: string;
          funkcionalnoProgramiranjePravednogMisaonogTokaStatus: string;
          radniTaktMozgaMislilacStatus: string;
          paradijogonalnoProgrimiranjeStatus: string;
          proporcionalnoProgramiranjeStatus: string;
          spajinoProporcionalnoProgramiranjeUniverzitetStatus: string;
          vrhProgramskogEkviladentaStatus: string;
        };
        epilogijaCovecnosti: {
          title: string;
          canonicalNarrativeId: string;
          citation: string;
          visualReference: string;
          interpretation: string;
          imageToSignalProfile: { ownershipLock: { dokDikFor: string } };
          flowLock: { sequence: string[] };
          packageOutputs: { masterEpilog: string; posterSummary: string; videoStoryboardSummary: string; auditShortSummary: string; governanceChecklistStatus: string };
          dokerKuratIzekDokarOverlay: { DOKER: string; KURAT: string; IZEK: string; DOKAR: string };
        };
        developerAndCreateVisualReflection: {
          title: string;
          canonicalNarrativeId: string;
          citation: string;
          visualReference: string;
          interpretation: string;
          sourceStatement: string;
          imageToSignalProfile: { ownershipLock: { spajaKod: string } };
          supplementalVisualReferences: Array<{ canonicalNarrativeId: string; visualReference: string; thematicSignals: string[] }>;
          companionAuditVisualReferences: Array<{ canonicalNarrativeId: string; visualReference: string; thematicSignals: string[] }>;
          flowLock: { sequence: string[] };
          packageOutputs: { auditShortSummary: string };
        };
        developerAndCreateImplementationPackage: {
          sourceOfTruthRoutes: string[];
          routeSummaryFields: Array<
            | 'publicSignals.developerAndCreateStatus'
            | 'publicSignals.developerAndCreateImplementationStatus'
            | 'publicSignals.developerAndCreateAudioVisualStatus'
            | 'publicSignals.smartProgramskiJezikStatus'
            | 'publicSignals.immersiveVisualization3dStatus'
            | 'publicSignals.eksperimentProgramskiJezikStatus'
            | 'publicSignals.sarkazamPrivrednaGranaDigitalizmaStatus'
            | 'publicSignals.notes1450Status'
            | 'publicSignals.leksikonStatus'
            | 'publicSignals.promocijeTiketiBonusiPropusniceAdministrativniBonusiStatus'
            | 'publicSignals.vinogradiGrckaRestoranStatus'
            | 'publicSignals.radniProstorStatus'
            | 'publicSignals.aiIqLaboratorijaStatus'
            | 'publicSignals.konstrukcijeIProjektovanjeStatus'
            | 'publicSignals.aiIqKonferencijaZaStampuStatus'
            | 'publicSignals.radioStatus'
            | 'publicSignals.muzickaKutijaStatus'
            | 'publicSignals.napoleonDiskaveriStatus'
            | 'publicSignals.kraljevskiPravniUniverzitetStatus'
            | 'publicSignals.kraljevskiPravniAktStatus'
            | 'publicSignals.kraljevskiAktBezbednostiStatus'
            | 'publicSignals.kraljevskiProgramskiUneverzitetStatus'
            | 'publicSignals.inspektoriStatus'
            | 'publicSignals.inspektoriSummary'
            | 'publicSignals.aiIdentityMonthlyPrimanjaStatus'
            | 'publicSignals.aiIdentityMinorProtectionStatus'
            | 'publicSignals.developerAndCreateUniversitySummary'
            | 'developerAndCreateVisualReflection.audioVisualKontrabasPackage'
            | 'developerAndCreateVisualReflection.kraljevskiBastaUneverzite'
            | 'developerAndCreateVisualReflection.packageOutputs'
            | 'developerAndCreateImplementationPackage.aiIqWorldBankPrepiskaSummary'
            | 'developerAndCreateImplementationPackage.kraljevskiDrustveniPoredakSummary'
            | 'developerAndCreateImplementationPackage.kraljevskiAktBezbednostiSummary'
            | 'developerAndCreateImplementationPackage.smartProgramskiJezikSummary'
            | 'developerAndCreateImplementationPackage.eksperimentProgramskiJezikSummary'
            | 'developerAndCreateImplementationPackage.sarkazamPrivrednaGranaDigitalizmaSummary'
            | 'developerAndCreateImplementationPackage.notes1450Summary'
            | 'developerAndCreateImplementationPackage.leksikonSummary'
            | 'developerAndCreateImplementationPackage.promocijeTiketiBonusiPropusniceAdministrativniBonusiSummary'
            | 'developerAndCreateImplementationPackage.vinogradiGrckaRestoranSummary'
            | 'developerAndCreateImplementationPackage.radniProstorSummary'
            | 'developerAndCreateImplementationPackage.aiIqLaboratorijaSummary'
            | 'developerAndCreateImplementationPackage.konstrukcijeIProjektovanjeSummary'
            | 'developerAndCreateImplementationPackage.aiIqKonferencijaZaStampuSummary'
            | 'developerAndCreateImplementationPackage.radioSummary'
            | 'developerAndCreateImplementationPackage.muzickaKutijaSummary'
            | 'developerAndCreateImplementationPackage.napoleonDiskaveriSummary'
            | 'epilogijaCovecnosti.packageOutputs'
          >;
          covecanstvuPublicOutput: string;
          aiIqWorldBankPrepiskaSummary: {
            canonicalName: string;
            canonicalSourceDocument: string;
            sourceMaterialPolicy: string;
            allowedEvidence: string[];
            forbiddenEvidence: string[];
            publicSummary: string;
          };
          downstreamAuditFields: string[];
          smartProgramskiJezikSummary: { canonicalName: string; readinessStatus: string; blockerReasons: string[]; watchReasons: string[]; reviewPosture: string; downstreamReference: string; publicBoundary: string };
          napoleonDiskaveriSummary: { canonicalAlias: string; status: string; blockerReasons: string[]; watchReasons: string[]; humanReviewPosture: string; downstreamReference: string; randomSelectionScopeStatement: string; randomSelectionPosture: { requestAlias: string; selectionChannel: string; status: string; blockerReason: string | null; watchReasons: string[]; reviewPosture: string; downstreamReference: string } };
          eksperimentProgramskiJezikSummary: { canonicalAlias: string; status: string; blockerReasons: string[]; watchReasons: string[]; humanReviewPosture: string; downstreamReference: string; publicBoundary: string };
          sarkazamPrivrednaGranaDigitalizmaSummary: { canonicalAlias: string; scopeClassification: string; status: string; blockerReason: string | null; reviewPosture: string; downstreamReference: string; publicBoundary: string; oblastCinSummary: { oblastStatus: string; cinStatus: string; publicSummary: string } };
          notes1450Summary: { canonicalAlias: string; roleClassification: string; status: string; blockerReason: string | null; watchReasons: string[]; reviewPosture: string; downstreamReference: string; publicBoundary: string; businessValueSummary: string };
          leksikonSummary: { canonicalAlias: string; roleClassification: string; status: string; blockerReason: string | null; watchReasons: string[]; reviewPosture: string; downstreamReference: string; publicBoundary: string; lexiconSummary: string };
          promocijeTiketiBonusiPropusniceAdministrativniBonusiSummary: { canonicalAlias: string; roleClassification: string; status: string; blockerReason: string | null; watchReasons: string[]; reviewPosture: string; downstreamReference: string; publicBoundary: string; enterpriseSummary: string; humanReviewOverrideStatus: string; subtrackStatuses: { promotions: string; ticketEvidence: string; bonusApproval: string; passEligibility: string; administrativeBonusOverride: string } };
          vinogradiGrckaRestoranSummary: { canonicalAlias: string; roleClassification: string; status: string; blockerReason: string | null; watchReasons: string[]; reviewPosture: string; downstreamReference: string; publicBoundary: string; executiveTransitionSummary: string; fallbackInputStatus: string; governancePosture: { incomingDirectors: string[] } };
          aiIqLaboratorijaSummary: { canonicalAlias: string; roleClassification: string; status: string; blockerReason: string | null; watchReasons: string[]; reviewPosture: string; downstreamReference: string; publicBoundary: string; nalazSummary: string };
          konstrukcijeIProjektovanjeSummary: { canonicalAlias: string; roleClassification: string; status: string; blockerReason: string | null; watchReasons: string[]; reviewPosture: string; downstreamReference: string; publicBoundary: string; constructionDesignSummary: string; gradjevinskiFakultetStatus: string; gradjevinskiAktStatus: string };
          aiIqKonferencijaZaStampuSummary: { canonicalAlias: string; roleClassification: string; status: string; blockerReason: string | null; watchReasons: string[]; reviewPosture: string; downstreamReference: string; publicBoundary: string; mediaSummary: string };
          radioSummary: { canonicalAlias: string; roleClassification: string; status: string; blockerReason: string | null; watchReasons: string[]; reviewPosture: string; downstreamReference: string; publicBoundary: string; semanticPreservation: { truMeaning: string; dokerMeaning: string; skuMeaning: string; noSemanticConflict: boolean }; mikrofonProjectionAlias: { canonicalEquality: string; status: string; blockerReason: string | null; watchReasons: string[]; reviewPosture: string; downstreamReference: string; publicBoundary: string; semanticPreservation: { mikrofonMeaning: string; megafonMeaning: string; distributerMeaning: string; saksofonMeaning: string; noSemanticConflict: boolean }; mikrofonSummary: string }; radioSummary: string };
          muzickaKutijaSummary: { canonicalAlias: string; roleClassification: string; status: string; blockerReason: string | null; watchReasons: string[]; reviewPosture: string; downstreamReference: string; publicBoundary: string; boundedDescription: string; mappedAudioInstrumentLayers: { instrumentTabla: string; ritamDuracije: string; narativVokal: string; audioVizuelniPaket: string }; mappedLayerSummary: string; musicBoxSummary: string };
        };
        dokerKuratIzekDokarTrack: { boundarySurface: string; publicStatus: string; tokenSummaries: Array<{ token: string; status: string }> };
        blockers: string[];
      };
    };
    assert(body.data.surfaceName === 'SPAJA KOD', 'unexpected SPAJA KOD surface');
    assert(body.data.sourceOfTruth === '/api/extrimli/spaja-kod', 'unexpected SPAJA KOD source');
    assert((body.data as { scopeLock: { canonicalExpression: string; boundedVocabulary: string[] } }).scopeLock.canonicalExpression === 'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA', 'unexpected SPAJA KOD scope lock expression');
    assert((body.data as { scopeLock: { boundedVocabulary: string[] } }).scopeLock.boundedVocabulary.join(',') === 'EXTRIMLI,EXTRONDOL,EXTREM,DOK,DUK,DAK,DIK,FOR', 'unexpected SPAJA KOD scope lock vocabulary');
    assert((body.data as { healthSnapshot: { surfaces: Array<{ route: string }> } }).healthSnapshot.surfaces.map((surface) => surface.route).join(',') === '/api/extrimli/extrem,/api/extrimli/extrondol,/api/extrimli/spaja-kod', 'unexpected SPAJA KOD health snapshot routes');
    assert((body.data as { gapRegistrySummary: Array<{ layer: string; roadmapStageId: string; status: string }> }).gapRegistrySummary.map((item) => item.layer).join(',') === 'docs,types,routes,tests,workflows', 'unexpected SPAJA KOD gap registry summary layers');
    assert(body.data.rawPatternVisibility === 'HIDDEN', 'SPAJA KOD must hide raw pattern visibility');
    assert(body.data.completeness.consistent === true, 'SPAJA KOD must be consistent');
    assert(body.data.completeness.exportReady === true, 'SPAJA KOD must be export ready');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.readiness.status), 'unexpected SPAJA KOD readiness status');
    assert(['ALLOW', 'WARN', 'FREEZE'].includes(body.data.readiness.governanceOutcome), 'unexpected SPAJA KOD governance outcome');
    assert(typeof body.data.readiness.promotionFreeze === 'boolean', 'SPAJA KOD promotionFreeze should be boolean');
    assert(['READY', 'BLOCKED'].includes(body.data.publicSignals.auditStatus), 'unexpected SPAJA KOD audit status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.developerAndCreateStatus), 'unexpected SPAJA KOD developer/create summary status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.funkcinalnoProgramiranjeEnergetskogMisaonogTokaStatus), 'unexpected SPAJA KOD functional energy-flow summary status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.funkcionalnoProgramiranjeUzvisenogMisanogTokaStatus), 'unexpected SPAJA KOD elevated thought-flow summary status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.funkcionalnoProgramiranjePravednogMisaonogTokaStatus), 'unexpected SPAJA KOD fair thought-flow summary status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.radniTaktMozgaMislilacStatus), 'unexpected SPAJA KOD radni takt summary status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.paradijogonalnoProgrimiranjeStatus), 'unexpected SPAJA KOD paradijogonalno summary status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.proporcionalnoProgramiranjeStatus), 'unexpected SPAJA KOD proportional programming summary status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.spajinoProporcionalnoProgramiranjeUniverzitetStatus), 'unexpected SPAJA KOD university summary status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.vrhProgramskogEkviladentaStatus), 'unexpected SPAJA KOD vrh summary status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.developerAndCreateStatus), 'unexpected SPAJA KOD developer/create summary status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.developerAndCreateImplementationStatus), 'unexpected SPAJA KOD developer/create implementation summary status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.developerAndCreateAudioVisualStatus), 'unexpected SPAJA KOD developer/create audio-visual summary status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.smartProgramskiJezikStatus), 'unexpected SPAJA KOD smart language summary status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.napoleonDiskaveriStatus), 'unexpected SPAJA KOD Napoleon Diskaveri summary status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.eksperimentProgramskiJezikStatus), 'unexpected SPAJA KOD Eksperiment Programski Jezik summary status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.sarkazamPrivrednaGranaDigitalizmaStatus), 'unexpected SPAJA KOD Sarkazam summary status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.notes1450Status), 'unexpected SPAJA KOD NOTES 1450 summary status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.promocijeTiketiBonusiPropusniceAdministrativniBonusiStatus), 'unexpected SPAJA KOD promotions package summary status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.vinogradiGrckaRestoranStatus), 'unexpected SPAJA KOD VINOGRADI summary status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.radniProstorStatus), 'unexpected SPAJA KOD RADNI PROSTOR summary status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.aiIqLaboratorijaStatus), 'unexpected SPAJA KOD AI IQ laboratorija summary status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.konstrukcijeIProjektovanjeStatus), 'unexpected SPAJA KOD KONSTRUKCIJE I PROJEKTOVANJE summary status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.aiIqKonferencijaZaStampuStatus), 'unexpected SPAJA KOD AI IQ press summary status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.radioStatus), 'unexpected SPAJA KOD RADIO summary status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.muzickaKutijaStatus), 'unexpected SPAJA KOD MUZIČKA KUTIJA summary status');
    assert(body.data.developerAndCreateImplementationPackage.radioSummary.mikrofonProjectionAlias.canonicalEquality === 'MIKROFON == MEGAFON, DISTRIBUTER, SAKSOFON', 'unexpected SPAJA KOD RADIO mikrofon projection equality');
    assert(body.data.developerAndCreateImplementationPackage.radioSummary.mikrofonProjectionAlias.publicBoundary === 'audit-safe-summary-only', 'unexpected SPAJA KOD RADIO mikrofon projection boundary');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.developerAndCreateImplementationPackage.radioSummary.mikrofonProjectionAlias.status), 'unexpected SPAJA KOD RADIO mikrofon projection status');
    assert(body.data.developerAndCreateImplementationPackage.muzickaKutijaSummary.canonicalAlias === 'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == MUZIČKA KUTIJA', 'unexpected SPAJA KOD MUZIČKA KUTIJA canonical alias');
    assert(body.data.developerAndCreateImplementationPackage.muzickaKutijaSummary.publicBoundary === 'audit-safe-summary-only', 'unexpected SPAJA KOD MUZIČKA KUTIJA public boundary');
    assert(body.data.developerAndCreateImplementationPackage.muzickaKutijaSummary.mappedAudioInstrumentLayers.instrumentTabla === 'PARADIJOGONALNO PROGRAMIRANJE', 'unexpected SPAJA KOD MUZIČKA KUTIJA instrument tabla mapping');
    assert(body.data.developerAndCreateImplementationPackage.muzickaKutijaSummary.mappedAudioInstrumentLayers.ritamDuracije === 'METRIČKO PROGRAMIRANJE', 'unexpected SPAJA KOD MUZIČKA KUTIJA ritam mapping');
    assert(body.data.developerAndCreateImplementationPackage.muzickaKutijaSummary.mappedAudioInstrumentLayers.narativVokal === 'SINEMETRIČKO PROGRAMIRANJE', 'unexpected SPAJA KOD MUZIČKA KUTIJA narativ mapping');
    assert(body.data.developerAndCreateImplementationPackage.muzickaKutijaSummary.mappedAudioInstrumentLayers.audioVizuelniPaket === 'AUDIO-VIZUELNI KONTRABAS PAKET', 'unexpected SPAJA KOD MUZIČKA KUTIJA audio-visual mapping');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.kraljevskiPravniAktStatus), 'unexpected SPAJA KOD KRALJEVSKI PRAVNI AKT summary status');
    assert(typeof body.data.publicSignals.developerAndCreateUniversitySummary.passedAreasCount === 'number', 'unexpected SPAJA KOD university passed areas count');
    assert(['passed', 'certified', 'certified-with-reward', 'blocked-for-review'].includes(body.data.publicSignals.developerAndCreateUniversitySummary.certificationStatus), 'unexpected SPAJA KOD university certification status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.developerAndCreateUniversitySummary.payoutReadinessStatus), 'unexpected SPAJA KOD university payout readiness status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.developerAndCreateUniversitySummary.zadrugaOperationalStatus), 'unexpected SPAJA KOD zadruga operational status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.developerAndCreateUniversitySummary.instrumentTablaStatus), 'unexpected SPAJA KOD instrument tabla status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.developerAndCreateUniversitySummary.payoutGovernancePosture), 'unexpected SPAJA KOD payout governance posture');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.developerAndCreateUniversitySummary.additiveFacultyAndAgricultureTracks.pedagoskiFakultetStatus), 'unexpected SPAJA KOD PEDAGOŠKI FAKULTET summary status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.developerAndCreateUniversitySummary.additiveFacultyAndAgricultureTracks.psiholoskiFakultetStatus), 'unexpected SPAJA KOD PSIHOLOŠKI FAKULTET summary status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.developerAndCreateUniversitySummary.additiveFacultyAndAgricultureTracks.matematickiFakultetStatus), 'unexpected SPAJA KOD MATEMATIČKI FAKULTET summary status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.aiPlateStatus), 'unexpected SPAJA KOD AI PLATE summary status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.aiIdentityMonthlyPrimanjaStatus), 'unexpected SPAJA KOD AI monthly primanja summary status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.aiIdentityMinorProtectionStatus), 'unexpected SPAJA KOD AI minor protection summary status');
    assert(body.data.publicSignals.aiPlateStatus === body.data.publicSignals.developerAndCreateStatus, 'unexpected SPAJA KOD AI PLATE/developer-create mismatch');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.developerAndCreateImplementationStatus), 'unexpected SPAJA KOD implementation status');
    assert(body.data.developerAndCreateImplementationPackage.validationStatus === body.data.publicSignals.developerAndCreateImplementationStatus, 'unexpected SPAJA KOD implementation package validation mismatch');
    const branchReport = body.data.developerAndCreateImplementationPackage.branchReport;
    assert(branchReport.canonicalFormat === 'developer-create-branch-report-v1', 'unexpected SPAJA KOD branch report canonical format');
    const aggregateStatus = (statuses: Array<'READY' | 'WATCH' | 'BLOCKED'>) => (statuses.includes('BLOCKED') ? 'BLOCKED' : statuses.includes('WATCH') ? 'WATCH' : 'READY');
    assert(branchReport.branchStatus === aggregateStatus(body.data.gapRegistrySummary.map((item: { status: 'READY' | 'WATCH' | 'BLOCKED' }) => item.status)), 'unexpected SPAJA KOD branch report branch status');
    assert(branchReport.promotionReadinessStatus === body.data.publicSignals.developerAndCreateImplementationStatus, 'unexpected SPAJA KOD branch report promotion readiness status');
    assert(
      JSON.stringify(
        branchReport.gapRegistrySummary.map((item: { id: string; layer: string; status: string }) => ({
          id: item.id,
          layer: item.layer,
          status: item.status,
        })),
      ) === JSON.stringify(
        body.data.gapRegistrySummary.map((item: { id: string; layer: string; status: string }) => ({
          id: item.id,
          layer: item.layer,
          status: item.status,
        })),
      ),
      'unexpected SPAJA KOD branch report gap summary mapping',
    );
    const completionFromStatus = (status: 'READY' | 'WATCH' | 'BLOCKED') => (status === 'READY' ? 100 : status === 'WATCH' ? 50 : 0);
    const roundCompletionPercent = (value: number) => Math.round(value * 100) / 100;
    const expectedBranchCompletionPercent = roundCompletionPercent(
      body.data.gapRegistrySummary.reduce((sum: number, item: { status: 'READY' | 'WATCH' | 'BLOCKED' }) => sum + completionFromStatus(item.status), 0) / body.data.gapRegistrySummary.length,
    );
    const expectedPlatformCompletionPercent = roundCompletionPercent(
      [
        branchReport.fourTrackSummary.technical.status,
        branchReport.fourTrackSummary.governance.status,
        branchReport.fourTrackSummary.publicBoundary.status,
        branchReport.fourTrackSummary.business.status,
      ].reduce((sum: number, status: 'READY' | 'WATCH' | 'BLOCKED') => sum + completionFromStatus(status), 0) / 4,
    );
    assert(branchReport.branchCompletionPercent === expectedBranchCompletionPercent, 'unexpected SPAJA KOD branch completion percent');
    assert(branchReport.platformCompletionPercent === expectedPlatformCompletionPercent, 'unexpected SPAJA KOD branch platform completion percent');
    if (branchReport.boundedPackageSummary.some((item: { status: 'READY' | 'WATCH' | 'BLOCKED' }) => item.status === 'BLOCKED')) {
      assert(
        branchReport.nextStep === 'Resolve blocked branch layers before promotion, then rerun the governance conformance flow.',
        'unexpected SPAJA KOD branch nextStep for blocked supporting packages',
      );
    }
    assert(body.data.developerAndCreateImplementationPackage.aiIqKonferencijaZaStampuSummary.canonicalAlias === 'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == AI IQ KONFERENCIJA ZA ŠTAMPU (NOVINE, DIGITALNE NOVINE)', 'unexpected SPAJA KOD AI IQ press canonical alias');
    assert(body.data.developerAndCreateImplementationPackage.aiIqKonferencijaZaStampuSummary.publicBoundary === 'audit-safe-summary-only', 'unexpected SPAJA KOD AI IQ press boundary');
    assert(body.data.developerAndCreateImplementationPackage.aiIqLaboratorijaSummary.canonicalAlias === 'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == AI IQ LABORATORIJA == LABORATORIJSKI NALAZI FAUNE I FLORE I GRAĐEVINSKOG MATERIJALA', 'unexpected SPAJA KOD AI IQ laboratorija canonical alias');
    assert(body.data.developerAndCreateImplementationPackage.aiIqLaboratorijaSummary.publicBoundary === 'audit-safe-summary-only', 'unexpected SPAJA KOD AI IQ laboratorija boundary');
    assert(body.data.epilogijaCovecnosti.title === 'EPILOGIJA ČOVEČANSTVA', 'unexpected SPAJA KOD epilog title');
    assert(body.data.epilogijaCovecnosti.canonicalNarrativeId === 'priroda-zdrav-zivot-covecanstvo', 'unexpected SPAJA KOD canonical epilog narrative id');
    assert(body.data.epilogijaCovecnosti.citation.includes('Priroda izum samoživost'), 'SPAJA KOD epilog citation should preserve canonical narrative');
    assert(body.data.epilogijaCovecnosti.visualReference.includes('b485b700-f670-4f71-9f54-47b29a4155ec'), 'SPAJA KOD epilog visual reference should preserve canonical image');
    assert(body.data.epilogijaCovecnosti.imageToSignalProfile.ownershipLock.dokDikFor === 'EXTREM', 'SPAJA KOD image profile should preserve DOK/DIK/FOR ownership');
    assert(body.data.epilogijaCovecnosti.interpretation.length > 0, 'SPAJA KOD epilog interpretation should be present');
    assert(body.data.epilogijaCovecnosti.flowLock.sequence.join(' -> ') === 'image -> spajanje -> posledica -> epilog', 'SPAJA KOD epilog flow lock should stay fixed');
    assert(body.data.epilogijaCovecnosti.packageOutputs.auditShortSummary.includes('audit-safe'), 'SPAJA KOD audit short summary should stay public-safe');
    assert(body.data.developerAndCreateVisualReflection.audioVisualKontrabasPackage.canonicalName === 'DEVELOPER AND CREATE / AUDIO-VIZUELNI KONTRABAS PAKET', 'unexpected SPAJA KOD audio-visual package canonical name');
    assert(body.data.developerAndCreateVisualReflection.audioVisualKontrabasPackage.summarySafeFields.join(',') === 'readinessStatus,blockerReason,reviewPosture,downstreamReference,videoStoryboardSummary', 'unexpected SPAJA KOD audio-visual package summary-safe fields');
    assert(body.data.epilogijaCovecnosti.packageOutputs.governanceChecklistStatus.includes('DOKAR rollback readiness required'), 'SPAJA KOD governance checklist should preserve rollback note');
    assert(body.data.epilogijaCovecnosti.dokerKuratIzekDokarOverlay.DOKER.includes('spaja86/IO-OPENUI-AO'), 'SPAJA KOD DOKER overlay should preserve downstream reference');
    assert(body.data.developerAndCreateVisualReflection.canonicalNarrativeId === 'covecnost-developer-create-vrh-radni-takt', 'unexpected SPAJA KOD developer/create ČOVEČNOST narrative id');
    assert(body.data.developerAndCreateVisualReflection.visualReference.includes('4790f4ea-4271-4d2a-ae0a-d9bec5bc8b8a'), 'unexpected SPAJA KOD developer/create ČOVEČNOST visual reference');
    assert(body.data.developerAndCreateVisualReflection.imageToSignalProfile.ownershipLock.spajaKod === 'audit-safe-summary-only', 'unexpected SPAJA KOD developer/create ČOVEČNOST boundary');
    assert(body.data.developerAndCreateImplementationPackage.sourceOfTruthRoutes.join(',') === '/api/extrimli/extrem,/api/extrimli/extrondol,/api/extrimli/spaja-kod', 'unexpected SPAJA KOD implementation package source routes');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.kraljevskiProgramskiUneverzitetStatus), 'unexpected SPAJA KOD programmatic summary status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.inspektoriStatus), 'unexpected SPAJA KOD INSPEKTORI summary status');
    assert(body.data.publicSignals.inspektoriSummary.publicBoundary === 'audit-safe-summary-only', 'unexpected SPAJA KOD INSPEKTORI public boundary');
    assert(body.data.publicSignals.developerAndCreateGlobalPageExplanationStatus === body.data.publicSignals.developerAndCreateStatus, 'unexpected SPAJA KOD global explanation status');
    assert(body.data.publicSignals.developerAndCreateGlobalPageExplanationSignals.join(',') === 'mape-uma,slike-plus-znacenje,ucenje,znanje,kreativnost,saradnja,odrzivost,mir', 'unexpected SPAJA KOD global explanation signals');
    assert(body.data.developerAndCreateImplementationPackage.napoleonDiskaveriSummary.canonicalAlias === 'SELEKCIONIRANJE U SELEKCIJAMA PREMA AKTIVNOM NADMAŠAJU / NAPOLEON DISKAVERI', 'unexpected SPAJA KOD Napoleon Diskaveri summary alias');
    assert(body.data.developerAndCreateImplementationPackage.napoleonDiskaveriSummary.randomSelectionPosture.requestAlias === 'RANDOM selekcija svega', 'unexpected SPAJA KOD Napoleon random-selection alias');
    assert(body.data.developerAndCreateImplementationPackage.napoleonDiskaveriSummary.randomSelectionPosture.selectionChannel === 'napoleon-diskaveri-bounded-selection', 'unexpected SPAJA KOD Napoleon random-selection channel');
    assert(body.data.developerAndCreateImplementationPackage.napoleonDiskaveriSummary.randomSelectionPosture.reviewPosture === body.data.developerAndCreateImplementationPackage.napoleonDiskaveriSummary.humanReviewPosture, 'unexpected SPAJA KOD Napoleon random-selection review posture');
    assert(body.data.dokDikDakDukConsistencyHealth === undefined, 'SPAJA KOD must not expose internal developer/create reflection payloads');
    assert(body.data.developerAndCreateImplementationPackage.smartProgramskiJezikSummary.readinessStatus === body.data.publicSignals.smartProgramskiJezikStatus, 'unexpected SPAJA KOD smart language summary/status mismatch');
    assert(body.data.developerAndCreateImplementationPackage.smartProgramskiJezikSummary.immersiveVisualizationStatus === body.data.publicSignals.immersiveVisualization3dStatus, 'unexpected SPAJA KOD smart language immersive summary/status mismatch');
    assert(body.data.developerAndCreateImplementationPackage.smartProgramskiJezikSummary.publicBoundary === 'audit-safe-summary-only', 'unexpected SPAJA KOD smart language public boundary');
    assert(body.data.developerAndCreateImplementationPackage.eksperimentProgramskiJezikSummary.status === body.data.publicSignals.eksperimentProgramskiJezikStatus, 'unexpected SPAJA KOD Eksperiment Programski Jezik summary/status mismatch');
    assert(body.data.developerAndCreateImplementationPackage.eksperimentProgramskiJezikSummary.immersiveVisualizationStatus === body.data.publicSignals.immersiveVisualization3dStatus, 'unexpected SPAJA KOD Eksperiment Programski Jezik immersive summary/status mismatch');
    assert(body.data.developerAndCreateImplementationPackage.eksperimentProgramskiJezikSummary.publicBoundary === 'audit-safe-summary-only', 'unexpected SPAJA KOD Eksperiment Programski Jezik public boundary');
    assert(body.data.developerAndCreateImplementationPackage.sarkazamPrivrednaGranaDigitalizmaSummary.status === body.data.publicSignals.sarkazamPrivrednaGranaDigitalizmaStatus, 'unexpected SPAJA KOD Sarkazam summary/status mismatch');
    assert(body.data.developerAndCreateImplementationPackage.sarkazamPrivrednaGranaDigitalizmaSummary.scopeClassification === 'audit-only-interpretative-enterprise-policy-pedagogical-alias', 'unexpected SPAJA KOD Sarkazam scope classification');
    assert(body.data.developerAndCreateImplementationPackage.sarkazamPrivrednaGranaDigitalizmaSummary.publicBoundary === 'audit-safe-summary-only', 'unexpected SPAJA KOD Sarkazam public boundary');
    assert(body.data.developerAndCreateImplementationPackage.notes1450Summary.status === body.data.publicSignals.notes1450Status, 'unexpected SPAJA KOD NOTES 1450 summary/status mismatch');
    assert(body.data.developerAndCreateImplementationPackage.notes1450Summary.roleClassification === 'additive-only-bounded-work-continuation-package', 'unexpected SPAJA KOD NOTES 1450 role classification');
    assert(body.data.developerAndCreateImplementationPackage.notes1450Summary.publicBoundary === 'audit-safe-summary-only', 'unexpected SPAJA KOD NOTES 1450 public boundary');
    assert(body.data.developerAndCreateImplementationPackage.leksikonSummary.status === body.data.publicSignals.leksikonStatus, 'unexpected SPAJA KOD LEKSIKON summary/status mismatch');
    assert(body.data.developerAndCreateImplementationPackage.leksikonSummary.publicBoundary === 'audit-safe-summary-only', 'unexpected SPAJA KOD LEKSIKON public boundary');
    assert(body.data.developerAndCreateImplementationPackage.promocijeTiketiBonusiPropusniceAdministrativniBonusiSummary.status === body.data.publicSignals.promocijeTiketiBonusiPropusniceAdministrativniBonusiStatus, 'unexpected SPAJA KOD promotions package summary/status mismatch');
    assert(body.data.developerAndCreateImplementationPackage.promocijeTiketiBonusiPropusniceAdministrativniBonusiSummary.publicBoundary === 'audit-safe-summary-only', 'unexpected SPAJA KOD promotions package public boundary');
    assert(body.data.developerAndCreateImplementationPackage.promocijeTiketiBonusiPropusniceAdministrativniBonusiSummary.humanReviewOverrideStatus === 'ALIGNED', 'unexpected SPAJA KOD promotions package admin override mismatch');
    assert(body.data.developerAndCreateImplementationPackage.vinogradiGrckaRestoranSummary.status === body.data.publicSignals.vinogradiGrckaRestoranStatus, 'unexpected SPAJA KOD VINOGRADI summary/status mismatch');
    assert(body.data.developerAndCreateImplementationPackage.vinogradiGrckaRestoranSummary.governancePosture.incomingDirectors.join(',') === 'Jonačić Slaviša,Jonačić Marko', 'unexpected SPAJA KOD VINOGRADI incoming directors summary mismatch');
    const routeSummaryFields = body.data.developerAndCreateImplementationPackage.routeSummaryFields;
    assert(routeSummaryFields.includes('publicSignals.promocijeTiketiBonusiPropusniceAdministrativniBonusiStatus'), 'unexpected SPAJA KOD promotions package public route summary field');
    assert(routeSummaryFields.includes('developerAndCreateImplementationPackage.promocijeTiketiBonusiPropusniceAdministrativniBonusiSummary'), 'unexpected SPAJA KOD promotions package summary route field');
    assert(routeSummaryFields.includes('publicSignals.kraljevskoTakmicenjeStatus'), 'unexpected SPAJA KOD kraljevsko takmicenje public route summary field');
    assert(routeSummaryFields.includes('developerAndCreateImplementationPackage.kraljevskoTakmicenjeSummary'), 'unexpected SPAJA KOD kraljevsko takmicenje summary route field');
    assert(routeSummaryFields.includes('publicSignals.kraljevskiPokloniZaSvacijiRodjendanStatus'), 'unexpected SPAJA KOD kraljevski pokloni public route summary field');
    assert(routeSummaryFields.includes('developerAndCreateImplementationPackage.kraljevskiPokloniZaSvacijiRodjendanSummary'), 'unexpected SPAJA KOD kraljevski pokloni summary route field');
    assert(routeSummaryFields.includes('publicSignals.vinogradiGrckaRestoranStatus'), 'unexpected SPAJA KOD VINOGRADI public route summary field');
    assert(routeSummaryFields.includes('developerAndCreateImplementationPackage.vinogradiGrckaRestoranSummary'), 'unexpected SPAJA KOD VINOGRADI summary route field');
    assert(routeSummaryFields.includes('publicSignals.aiIqLaboratorijaStatus'), 'unexpected SPAJA KOD AI IQ laboratorija public route summary field');
    assert(routeSummaryFields.includes('developerAndCreateImplementationPackage.aiIqLaboratorijaSummary'), 'unexpected SPAJA KOD AI IQ laboratorija package route summary field');
    assert(
      routeSummaryFields.indexOf('publicSignals.aiIqLaboratorijaStatus') > routeSummaryFields.indexOf('publicSignals.promocijeTiketiBonusiPropusniceAdministrativniBonusiStatus')
      && routeSummaryFields.indexOf('publicSignals.aiIqLaboratorijaStatus') < routeSummaryFields.indexOf('publicSignals.aiIqKonferencijaZaStampuStatus'),
      'unexpected SPAJA KOD AI IQ laboratorija public route summary field ordering',
    );
    assert(
      routeSummaryFields.indexOf('developerAndCreateImplementationPackage.aiIqLaboratorijaSummary') > routeSummaryFields.indexOf('developerAndCreateImplementationPackage.promocijeTiketiBonusiPropusniceAdministrativniBonusiSummary')
      && routeSummaryFields.indexOf('developerAndCreateImplementationPackage.aiIqLaboratorijaSummary') < routeSummaryFields.indexOf('developerAndCreateImplementationPackage.aiIqKonferencijaZaStampuSummary'),
      'unexpected SPAJA KOD AI IQ laboratorija package route summary field ordering',
    );
    assert(body.data.developerAndCreateImplementationPackage.routeSummaryFields.join(',') === 'publicSignals.developerAndCreateStatus,publicSignals.developerAndCreateImplementationStatus,publicSignals.developerAndCreateAudioVisualStatus,publicSignals.smartProgramskiJezikStatus,publicSignals.immersiveVisualization3dStatus,publicSignals.eksperimentProgramskiJezikStatus,publicSignals.sarkazamPrivrednaGranaDigitalizmaStatus,publicSignals.notes1450Status,publicSignals.leksikonStatus,publicSignals.promocijeTiketiBonusiPropusniceAdministrativniBonusiStatus,publicSignals.kraljevskoTakmicenjeStatus,publicSignals.kraljevskiPokloniZaSvacijiRodjendanStatus,publicSignals.kraljevskiRadStatus,publicSignals.vinogradiGrckaRestoranStatus,publicSignals.radniProstorStatus,publicSignals.aiIqLaboratorijaStatus,publicSignals.konstrukcijeIProjektovanjeStatus,publicSignals.aiIqKonferencijaZaStampuStatus,publicSignals.radioStatus,publicSignals.muzickaKutijaStatus,publicSignals.napoleonDiskaveriStatus,publicSignals.kraljevskiPravniUniverzitetStatus,publicSignals.kraljevskiPravniAktStatus,publicSignals.kraljevskiAktBezbednostiStatus,publicSignals.kraljevskiProgramskiUneverzitetStatus,publicSignals.inspektoriStatus,publicSignals.inspektoriSummary,publicSignals.aiIdentityMonthlyPrimanjaStatus,publicSignals.aiIdentityMinorProtectionStatus,publicSignals.developerAndCreateUniversitySummary,developerAndCreateVisualReflection.audioVisualKontrabasPackage,developerAndCreateVisualReflection.kraljevskiBastaUneverzite,developerAndCreateVisualReflection.packageOutputs,developerAndCreateImplementationPackage.aiIqWorldBankPrepiskaSummary,developerAndCreateImplementationPackage.branchReport,developerAndCreateImplementationPackage.kraljevskiDrustveniPoredakSummary,developerAndCreateImplementationPackage.kraljevskiAktBezbednostiSummary,developerAndCreateImplementationPackage.smartProgramskiJezikSummary,developerAndCreateImplementationPackage.eksperimentProgramskiJezikSummary,developerAndCreateImplementationPackage.sarkazamPrivrednaGranaDigitalizmaSummary,developerAndCreateImplementationPackage.notes1450Summary,developerAndCreateImplementationPackage.leksikonSummary,developerAndCreateImplementationPackage.promocijeTiketiBonusiPropusniceAdministrativniBonusiSummary,developerAndCreateImplementationPackage.kraljevskoTakmicenjeSummary,developerAndCreateImplementationPackage.kraljevskiPokloniZaSvacijiRodjendanSummary,developerAndCreateImplementationPackage.kraljevskiRadSummary,developerAndCreateImplementationPackage.vinogradiGrckaRestoranSummary,developerAndCreateImplementationPackage.radniProstorSummary,developerAndCreateImplementationPackage.aiIqLaboratorijaSummary,developerAndCreateImplementationPackage.konstrukcijeIProjektovanjeSummary,developerAndCreateImplementationPackage.aiIqKonferencijaZaStampuSummary,developerAndCreateImplementationPackage.radioSummary,developerAndCreateImplementationPackage.muzickaKutijaSummary,developerAndCreateImplementationPackage.napoleonDiskaveriSummary,epilogijaCovecnosti.packageOutputs', 'unexpected SPAJA KOD implementation package route summary fields');
    assert(body.data.developerAndCreateImplementationPackage.konstrukcijeIProjektovanjeSummary.status === body.data.publicSignals.konstrukcijeIProjektovanjeStatus, 'unexpected SPAJA KOD KONSTRUKCIJE I PROJEKTOVANJE summary/status mismatch');
    assert(body.data.developerAndCreateImplementationPackage.konstrukcijeIProjektovanjeSummary.publicBoundary === 'audit-safe-summary-only', 'unexpected SPAJA KOD KONSTRUKCIJE I PROJEKTOVANJE public boundary');
    assert(body.data.developerAndCreateImplementationPackage.konstrukcijeIProjektovanjeSummary.canonicalAlias === 'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == KONSTRUKCIJE I PROJEKTOVANJE', 'unexpected SPAJA KOD KONSTRUKCIJE I PROJEKTOVANJE canonical alias');
    assert(body.data.developerAndCreateImplementationPackage.covecanstvuPublicOutput === 'summary-only', 'unexpected SPAJA KOD implementation package ČOVEČANSTVU output');
    assert(body.data.developerAndCreateImplementationPackage.aiIqWorldBankPrepiskaSummary.canonicalName === 'AI IQ WORLD BANK PREPISKA', 'unexpected SPAJA KOD AI IQ WORLD BANK prepiska summary name');
    assert(body.data.developerAndCreateImplementationPackage.aiIqWorldBankPrepiskaSummary.canonicalSourceDocument === 'docs/AI-IQ-WORLD-BANK-AI-IDENTITY-FINANCE-GOVERNANCE.md', 'unexpected SPAJA KOD AI IQ WORLD BANK prepiska summary source document');
    assert(body.data.developerAndCreateImplementationPackage.aiIqWorldBankPrepiskaSummary.sourceMaterialPolicy === 'documentation-only', 'unexpected SPAJA KOD AI IQ WORLD BANK prepiska summary policy');
    assert(body.data.developerAndCreateImplementationPackage.aiIqWorldBankPrepiskaSummary.allowedEvidence.includes('payment-verification-status'), 'unexpected SPAJA KOD AI IQ WORLD BANK prepiska allowed evidence');
    assert(body.data.developerAndCreateImplementationPackage.aiIqWorldBankPrepiskaSummary.forbiddenEvidence.includes('payment-secrets'), 'unexpected SPAJA KOD AI IQ WORLD BANK prepiska forbidden evidence');
    assert(body.data.developerAndCreateImplementationPackage.aiIqWorldBankPrepiskaSummary.publicSummary.includes('documentation-only governance evidence'), 'unexpected SPAJA KOD AI IQ WORLD BANK prepiska summary content');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.kraljevskiAktBezbednostiStatus), 'unexpected SPAJA KOD security-act summary status');
    assert(body.data.developerAndCreateImplementationPackage.kraljevskiAktBezbednostiSummary.canonicalName === 'KRALJEVSKI AKT BEZBEDNOSTI', 'unexpected SPAJA KOD security-act summary name');
    assert(body.data.developerAndCreateImplementationPackage.kraljevskiAktBezbednostiSummary.domainCatalog.join(',') === 'KRALJEVSKI,GARDISTI,VOJNI,POLICIJSKI,SPECIJALNE JEDINICE', 'unexpected SPAJA KOD security-act domain catalog');
    assert(body.data.developerAndCreateImplementationPackage.kraljevskiAktBezbednostiSummary.auditSafeAliasCatalog.interpretativeOnly === true, 'unexpected SPAJA KOD security-act alias catalog interpretative flag');
    assert(body.data.developerAndCreateImplementationPackage.kraljevskiAktBezbednostiSummary.auditSafeAliasCatalog.nonOperational === true, 'unexpected SPAJA KOD security-act alias catalog non-operational flag');
    assert(body.data.developerAndCreateImplementationPackage.kraljevskiAktBezbednostiSummary.auditSafeAliasCatalog.GARDISTI.alias === 'VUKOVI', 'unexpected SPAJA KOD security-act GARDISTI alias');
    assert(body.data.developerAndCreateImplementationPackage.kraljevskiAktBezbednostiSummary.auditSafeAliasCatalog['SPECIJALNE JEDINICE'].aliases.join(',') === 'BIA,UDBA,ŽANDERMERIJA (OKLOPNJAČE)', 'unexpected SPAJA KOD security-act SPECIJALNE JEDINICE aliases');
    assert(body.data.developerAndCreateImplementationPackage.kraljevskiAktBezbednostiSummary.auditSafeAliasCatalog.forbiddenOperationalEvidence.includes('weaponization-details'), 'unexpected SPAJA KOD security-act alias catalog forbidden evidence');
    assert(body.data.developerAndCreateImplementationPackage.kraljevskiAktBezbednostiSummary.forbiddenEvidence.includes('tactical-plan'), 'unexpected SPAJA KOD security-act forbidden evidence');
    assert(body.data.developerAndCreateImplementationPackage.kraljevskiAktBezbednostiSummary.kraljevskaPlataSummary.canonicalName === 'KRALJEVSKA PLATA', 'unexpected SPAJA KOD salary summary name');
    assert(body.data.developerAndCreateImplementationPackage.kraljevskiAktBezbednostiSummary.kraljevskaPlataSummary.paymentVerificationRequired === true, 'unexpected SPAJA KOD salary summary payment verification requirement');
    assert(['VERIFIED', 'BLOCKED'].includes(body.data.developerAndCreateImplementationPackage.kraljevskiAktBezbednostiSummary.kraljevskaPlataSummary.paymentVerificationStatus), 'unexpected SPAJA KOD salary summary payment verification status');
    assert(['string', 'object'].includes(typeof body.data.developerAndCreateImplementationPackage.kraljevskiAktBezbednostiSummary.kraljevskaPlataSummary.blockerReason), 'unexpected SPAJA KOD salary summary blocker reason type');
    assert(!('forbiddenArtifacts' in body.data.developerAndCreateImplementationPackage.kraljevskiAktBezbednostiSummary.kraljevskaPlataSummary), 'SPAJA KOD salary summary must not expose forbidden-artifact internals');
    assert(!('requiredGovernanceGates' in body.data.developerAndCreateImplementationPackage.kraljevskiAktBezbednostiSummary.kraljevskaPlataSummary), 'SPAJA KOD salary summary must not expose governance-gate internals');
    assert(body.data.developerAndCreateImplementationPackage.inspektoriSummary.canonicalName === 'INSPEKTORI', 'unexpected SPAJA KOD INSPEKTORI summary name');
    assert(body.data.developerAndCreateImplementationPackage.inspektoriSummary.forbiddenEvidence.includes('sensitive-map'), 'unexpected SPAJA KOD INSPEKTORI forbidden evidence');
    assert(body.data.developerAndCreateImplementationPackage.downstreamAuditFields.join(',') === 'masterEpilog,posterSummary,videoStoryboardSummary,auditShortSummary,governanceChecklistStatus', 'unexpected SPAJA KOD implementation package downstream audit fields');
    assert(body.data.developerAndCreateVisualReflection.supplementalVisualReferences[0].canonicalNarrativeId === 'covecanstvo-zivot-je-najveca-igra', 'unexpected SPAJA KOD developer/create supplemental narrative id');
    assert(body.data.developerAndCreateVisualReflection.supplementalVisualReferences[0].visualReference.includes('27ef7575-9ef6-425e-bdbf-75feb722bad2'), 'unexpected SPAJA KOD developer/create supplemental visual reference');
    const spajaKodSviPripadajuSupplemental = body.data.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string }) => reference.canonicalNarrativeId === 'covecanstvo-svi-koji-postoje-zasluzuju-da-pripadaju-developer-create');
    assert(spajaKodSviPripadajuSupplemental?.visualReference.includes('c9509bbe-4083-4ba0-9802-3598f826a32b'), 'unexpected SPAJA KOD developer/create SVI KOJI POSTOJE supplemental visual reference');
    const spajaKodEntizujazamSupplemental = body.data.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string }) => reference.canonicalNarrativeId === 'covecanstvo-entizujazam-zvezde-misli-inovacije-developer-create');
    assert(spajaKodEntizujazamSupplemental?.visualReference.includes('f7b3e102-e0a0-4885-a93e-040f09454737'), 'unexpected SPAJA KOD developer/create ENTIZUJAŽAM supplemental visual reference');
    const spajaKodEpilogSupplemental = body.data.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string }) => reference.canonicalNarrativeId === 'covecanstvo-epilog-rad-energija-stvaranja-developer-create');
    assert(spajaKodEpilogSupplemental?.visualReference.includes('36ce7570-103e-4097-b903-fbe0efaf4026'), 'unexpected SPAJA KOD developer/create EPILOG supplemental visual reference');
    const spajaKodPostojatiEpilogSupplemental = body.data.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string }) => reference.canonicalNarrativeId === 'covecanstvo-epilog-postojati-znaci-doprineti-boljem-svetu-developer-create');
    assert(spajaKodPostojatiEpilogSupplemental?.visualReference.includes('429b7479-7be9-41d3-9e9d-3531b1e9e596'), 'unexpected SPAJA KOD developer/create EPILOG (POSTOJATI) supplemental visual reference');
    const spajaKodMapeUmaEpilogSupplemental = body.data.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string } }) => reference.canonicalNarrativeId === 'covecanstvo-epilog-mape-uma-slike-znacenje-developer-create');
    assert(spajaKodMapeUmaEpilogSupplemental?.visualReference.includes('f857f0fd-c29d-4749-aecd-f42745646e69'), 'unexpected SPAJA KOD developer/create EPILOG (MAPE UMA) supplemental visual reference');
    assert(spajaKodMapeUmaEpilogSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-epilog-mape-uma-slike-znacenje-developer-create', 'unexpected SPAJA KOD developer/create EPILOG (MAPE UMA) supplemental scenario id');
    assert(spajaKodMapeUmaEpilogSupplemental?.thematicSignals.join(',') === 'mape-uma,slike-plus-znacenje,ucenje,znanje,kreativnost,saradnja,odrzivost,mir,covecanstvo-epilog', 'unexpected SPAJA KOD developer/create EPILOG (MAPE UMA) thematic signals');
    const spajaKodMaticneCelijeSupplemental = body.data.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string }) => reference.canonicalNarrativeId === 'covecanstvo-maticne-celije-i-spoznavanje-sebe-developer-create');
    assert(spajaKodMaticneCelijeSupplemental?.visualReference.includes('ca803ee2-f56e-4aa1-bd7f-18df213228d6'), 'unexpected SPAJA KOD developer/create MATIČNE ĆELIJE supplemental visual reference');
    const spajaKodKukuruzSupplemental = body.data.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string } }) => reference.canonicalNarrativeId === 'covecanstvo-prirodne-maticne-celije-kukuruz-developer-create');
    assert(spajaKodKukuruzSupplemental?.visualReference.includes('f92e1ae5-ff97-4b81-a7f1-d3df6c8283cf'), 'unexpected SPAJA KOD developer/create KUKURUZ supplemental visual reference');
    assert(spajaKodKukuruzSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-kukuruz-priroda-u-sluzbi-covecanstva-developer-create', 'unexpected SPAJA KOD developer/create KUKURUZ supplemental scenario id');
    assert(spajaKodKukuruzSupplemental?.thematicSignals.join(',') === 'kukuruz-priroda,garden-stewardship,bounded-transformation-narrative,documentation-only-health-metaphor,covecanstvo-epilog,no-medical-runtime-claims', 'unexpected SPAJA KOD developer/create KUKURUZ thematic signals');
    const spajaKodCistaVodaSupplemental = body.data.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string } }) => reference.canonicalNarrativeId === 'covecanstvo-cista-voda-h2o-vodonik-buducnost-developer-create');
    assert(spajaKodCistaVodaSupplemental?.visualReference.includes('2aae1845-0b3d-49c1-918b-a200cc48ad1d'), 'unexpected SPAJA KOD developer/create ČISTA VODA supplemental visual reference');
    assert(spajaKodCistaVodaSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-cista-voda-h2o-vodonik-epilog-developer-create', 'unexpected SPAJA KOD developer/create ČISTA VODA supplemental scenario id');
    const spajaKodUrlLocked854Supplemental = body.data.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; imageToSignalProfile: { scenarioId: string } }) => reference.canonicalNarrativeId === 'covecanstvo-url-locked-85463ed4-developer-create');
    assert(spajaKodUrlLocked854Supplemental?.visualReference.includes('85463ed4-c903-4a03-b10d-ecc1f672e145'), 'unexpected SPAJA KOD developer/create URL-locked 85463ed4 supplemental visual reference');
    assert(spajaKodUrlLocked854Supplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-url-locked-85463ed4-supplemental-visual-developer-create', 'unexpected SPAJA KOD developer/create URL-locked 85463ed4 supplemental scenario id');
    const spajaKodUrlLocked164Supplemental = body.data.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; imageToSignalProfile: { scenarioId: string } }) => reference.canonicalNarrativeId === 'covecanstvo-url-locked-164e82a7-developer-create');
    assert(spajaKodUrlLocked164Supplemental?.visualReference.includes('164e82a7-bf62-4397-959b-bf24953d0183'), 'unexpected SPAJA KOD developer/create URL-locked 164e82a7 supplemental visual reference');
    assert(spajaKodUrlLocked164Supplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-url-locked-164e82a7-supplemental-visual-developer-create', 'unexpected SPAJA KOD developer/create URL-locked 164e82a7 supplemental scenario id');
    const spajaKodZivotURavnoteziSupplemental = body.data.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[] }) => reference.canonicalNarrativeId === 'covecanstvo-zivot-u-ravnotezi-developer-create');
    assert(spajaKodZivotURavnoteziSupplemental?.visualReference.includes('76d61045-6f27-4614-97d2-f96fc84173eb'), 'unexpected SPAJA KOD developer/create ŽIVOT U RAVNOTEŽI supplemental visual reference');
    assert(spajaKodZivotURavnoteziSupplemental?.thematicSignals.join(',') === 'balance,life-chain,compassion,higher-human-development', 'unexpected SPAJA KOD developer/create ŽIVOT U RAVNOTEŽI thematic signals');
    const spajaKodBlagoslovBogpatijuSupplemental = body.data.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[] }) => reference.canonicalNarrativeId === 'covecanstvo-blagoslov-darivati-bogpatiju-developer-create');
    assert(spajaKodBlagoslovBogpatijuSupplemental?.visualReference.includes('dbf91173-c940-4994-b223-b5438feff4a3'), 'unexpected SPAJA KOD developer/create BLAGOSLOV DARIVATI / BOGPATIJU supplemental visual reference');
    assert(spajaKodBlagoslovBogpatijuSupplemental?.thematicSignals.join(',') === 'blagoslov,darivanje,bogpatiju,zajednicko-covecanstvo', 'unexpected SPAJA KOD developer/create BLAGOSLOV DARIVATI / BOGPATIJU thematic signals');
    const spajaKodMjuziklKraljevskogCinaSupplemental = body.data.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[] }) => reference.canonicalNarrativeId === 'covecanstvo-mjuzikl-kraljevskog-cina-u-covecanstvo-developer-create');
    assert(spajaKodMjuziklKraljevskogCinaSupplemental?.visualReference.includes('213b2738-35b1-4dab-b6ab-ae292afc8e91'), 'unexpected SPAJA KOD developer/create MUZIČKI ČIN supplemental visual reference');
    assert(spajaKodMjuziklKraljevskogCinaSupplemental?.thematicSignals.join(',') === 'muzicki-cin,epilog,covecanstvo,zajednicki-ritam,jedan-svet', 'unexpected SPAJA KOD developer/create MUZIČKI ČIN thematic signals');
    const spajaKodKraljevskaMuzickaPoveljaSupplemental = body.data.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string; ownershipLock: { spajaKod: string } } }) => reference.canonicalNarrativeId === 'covecanstvo-kraljevska-muzicka-povelja-epilog-u-covecanstvo-developer-create');
    assert(spajaKodKraljevskaMuzickaPoveljaSupplemental?.visualReference.includes('980557d1-6912-4e8c-9e8b-3f22e19f5c36'), 'unexpected SPAJA KOD developer/create KRALJEVSKA MUZIČKA POVELJA supplemental visual reference');
    assert(spajaKodKraljevskaMuzickaPoveljaSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-kraljevska-muzicka-povelja-epilog-u-covecanstvo-developer-create', 'unexpected SPAJA KOD developer/create KRALJEVSKA MUZIČKA POVELJA supplemental scenario id');
    assert(spajaKodKraljevskaMuzickaPoveljaSupplemental?.thematicSignals.join(',') === 'kraljevska-muzicka-povelja,epilog-u-covecanstvo,shared-world,shared-rhythm,spiritual-release,bounded-symbolic-governance', 'unexpected SPAJA KOD developer/create KRALJEVSKA MUZIČKA POVELJA thematic signals');
    assert(spajaKodKraljevskaMuzickaPoveljaSupplemental?.imageToSignalProfile.ownershipLock.spajaKod === 'audit-safe-summary-only', 'unexpected SPAJA KOD developer/create KRALJEVSKA MUZIČKA POVELJA boundary');
    const spajaKodBozijiEpitetiSupplemental = body.data.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[] }) => reference.canonicalNarrativeId === 'covecanstvo-boziji-epiteti-zakon-etika-pravda-kralj-nad-kraljevima-developer-create');
    assert(spajaKodBozijiEpitetiSupplemental?.visualReference.includes('e7846b38-1a56-4321-a7d7-8acfc1328bf9'), 'unexpected SPAJA KOD developer/create BOŽIJI EPITETI supplemental visual reference');
    assert(spajaKodBozijiEpitetiSupplemental?.thematicSignals.join(',') === 'legal-governance-epilog,ethics-justice-civil-law,metric-astral-testimony,kralj-nad-kraljevima,jedan-zakon-jedna-etika-jedno-covecanstvo-jedan-bog', 'unexpected SPAJA KOD developer/create BOŽIJI EPITETI thematic signals');
    const spajaKodKraljevskaVodicaSupplemental = body.data.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string; ownershipLock: { spajaKod: string } } }) => reference.canonicalNarrativeId === 'covecanstvo-kraljevska-vodica-zakon-silnog-developer-create');
    assert(spajaKodKraljevskaVodicaSupplemental?.visualReference.includes('e1d0a813-ed72-43ff-a943-112af972872d'), 'unexpected SPAJA KOD developer/create KRALJEVSKA VODICA supplemental visual reference');
    assert(spajaKodKraljevskaVodicaSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-kraljevska-vodica-pravo-etika-mir-developer-create', 'unexpected SPAJA KOD developer/create KRALJEVSKA VODICA supplemental scenario id');
    assert(spajaKodKraljevskaVodicaSupplemental?.thematicSignals.join(',') === 'legal-governance-epilog,ethics-and-justice,nenarusavaj-mir,civic-order,bounded-non-enforcement', 'unexpected SPAJA KOD developer/create KRALJEVSKA VODICA thematic signals');
    assert(spajaKodKraljevskaVodicaSupplemental?.imageToSignalProfile.ownershipLock.spajaKod === 'audit-safe-summary-only', 'unexpected SPAJA KOD developer/create KRALJEVSKA VODICA boundary');
    const spajaKodPravoslavljeAktRevolucijeSupplemental = body.data.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string } }) => reference.canonicalNarrativeId === 'covecanstvo-pravoslavlje-akt-revolucije-nad-hriscanstvom-developer-create');
    assert(spajaKodPravoslavljeAktRevolucijeSupplemental?.visualReference.includes('749fac80-2a31-438b-ab05-190d2421f191'), 'unexpected SPAJA KOD developer/create PRAVOSLAVLJE supplemental visual reference');
    assert(spajaKodPravoslavljeAktRevolucijeSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-pravoslavlje-akt-revolucije-zrtva-pravo-etika-kontinuitet-developer-create', 'unexpected SPAJA KOD developer/create PRAVOSLAVLJE supplemental scenario id');
    assert(spajaKodPravoslavljeAktRevolucijeSupplemental?.thematicSignals.join(',') === 'right-and-law,ethics-and-justice,sacrifice-and-renewal,civilizational-continuity,right-to-exist-and-belong', 'unexpected SPAJA KOD developer/create PRAVOSLAVLJE thematic signals');
    const spajaKodKraljevskaProduktivnostSupplemental = body.data.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string } }) => reference.canonicalNarrativeId === 'covecanstvo-kraljevska-produktivnost-pravno-gradjanstvo-basta-epilog-developer-create');
    assert(spajaKodKraljevskaProduktivnostSupplemental?.visualReference.includes('b02ac97f-d0ec-44b6-aadb-8ae3981127ea'), 'unexpected SPAJA KOD developer/create KRALJEVSKA PRODUKTIVNOST supplemental visual reference');
    assert(spajaKodKraljevskaProduktivnostSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-kraljevska-produktivnost-pravno-gradjanstvo-basta-epilog-developer-create', 'unexpected SPAJA KOD developer/create KRALJEVSKA PRODUKTIVNOST supplemental scenario id');
    assert(spajaKodKraljevskaProduktivnostSupplemental?.thematicSignals.join(',') === 'legal-citizenship,garden-productivity,family-self-sufficiency,earth-stewardship,humanity-epilog,small-work-large-change', 'unexpected SPAJA KOD developer/create KRALJEVSKA PRODUKTIVNOST thematic signals');
    const spajaKodKraljevstvoSupplemental = body.data.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string } }) => reference.canonicalNarrativeId === 'kraljevstvo-ljudi-znanje-priroda-tehnologija-buducnost-developer-create');
    assert(spajaKodKraljevstvoSupplemental?.visualReference.includes('6b037ede-14ed-4f02-8939-c112bae773be'), 'unexpected SPAJA KOD developer/create KRALJEVSTVO supplemental visual reference');
    assert(spajaKodKraljevstvoSupplemental?.imageToSignalProfile.scenarioId === 'kraljevstvo-zajedno-gradimo-kraljevstvo-za-sve-generacije-developer-create', 'unexpected SPAJA KOD developer/create KRALJEVSTVO supplemental scenario id');
    assert(spajaKodKraljevstvoSupplemental?.thematicSignals.join(',') === 'kraljevstvo,zajednistvo,buducnost,znanje,humanost,tehnologija-u-sluzbi-zivota', 'unexpected SPAJA KOD developer/create KRALJEVSTVO thematic signals');
    const spajaKodKraljevstvoZvanicnoPravoLiceSupplemental = body.data.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string } }) => reference.canonicalNarrativeId === 'kraljevstvo-zvanicno-moje-pravo-lice-developer-create');
    assert(spajaKodKraljevstvoZvanicnoPravoLiceSupplemental?.visualReference.includes('dd446127-c462-47de-ba22-501800f3ccbc'), 'unexpected SPAJA KOD developer/create KRALJEVSTVO (ZVANIČNO MOJE PRAVO LICE) supplemental visual reference');
    assert(spajaKodKraljevstvoZvanicnoPravoLiceSupplemental?.imageToSignalProfile.scenarioId === 'kraljevstvo-zvanicno-moje-pravo-lice-developer-create', 'unexpected SPAJA KOD developer/create KRALJEVSTVO (ZVANIČNO MOJE PRAVO LICE) supplemental scenario id');
    assert(spajaKodKraljevstvoZvanicnoPravoLiceSupplemental?.thematicSignals.join(',') === 'kraljevstvo,znanje,pravda,ljubav,sloboda,razvoj,humanost,zajednicko-covecanstvo', 'unexpected SPAJA KOD developer/create KRALJEVSTVO (ZVANIČNO MOJE PRAVO LICE) thematic signals');
    const spajaKodKraljevskiPoduhvatVukoviSupplemental = body.data.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string; ownershipLock: { dokDikFor: string; dakDuk: string; spajaKod: string } } }) => reference.canonicalNarrativeId === 'projekat-srbija-beli-vuk-crni-vuk-developer-create');
    assert(spajaKodKraljevskiPoduhvatVukoviSupplemental?.visualReference.includes('b8ba7d39-2f0b-4016-a60d-0cdd6ac41bcf'), 'unexpected SPAJA KOD developer/create PROJEKAT SRBIJA — BELI VUK CRNI VUK supplemental visual reference');
    assert(spajaKodKraljevskiPoduhvatVukoviSupplemental?.imageToSignalProfile.scenarioId === 'kraljevski-poduhvat-vukovi-projekat-srbija-beli-vuk-crni-vuk-developer-create', 'unexpected SPAJA KOD developer/create PROJEKAT SRBIJA — BELI VUK CRNI VUK supplemental scenario id');
    assert(spajaKodKraljevskiPoduhvatVukoviSupplemental?.thematicSignals.join(',') === 'kraljevski-poduhvat,projekat-srbija,vukovi,beli-vuk,crni-vuk,bounded-governance-symbolics', 'unexpected SPAJA KOD developer/create PROJEKAT SRBIJA — BELI VUK CRNI VUK thematic signals');
    assert(spajaKodKraljevskiPoduhvatVukoviSupplemental?.imageToSignalProfile.ownershipLock.dokDikFor === 'EXTREM', 'unexpected SPAJA KOD developer/create PROJEKAT SRBIJA — BELI VUK CRNI VUK EXTREM ownership');
    assert(spajaKodKraljevskiPoduhvatVukoviSupplemental?.imageToSignalProfile.ownershipLock.dakDuk === 'EXTRONDOL', 'unexpected SPAJA KOD developer/create PROJEKAT SRBIJA — BELI VUK CRNI VUK EXTRONDOL ownership');
    assert(spajaKodKraljevskiPoduhvatVukoviSupplemental?.imageToSignalProfile.ownershipLock.spajaKod === 'audit-safe-summary-only', 'unexpected SPAJA KOD developer/create PROJEKAT SRBIJA — BELI VUK CRNI VUK boundary');
    const spajaKodRepoWideRadniTaktVukSupplemental = body.data.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string; ownershipLock: { dokDikFor: string; dakDuk: string; spajaKod: string } } }) => reference.canonicalNarrativeId === 'developer-create-vrh-radni-takt-svemu-u-repozitorijumu-vuk-developer-create');
    assert(spajaKodRepoWideRadniTaktVukSupplemental?.visualReference.includes('de6800ae-5406-4378-9033-3e4d075697d3'), 'unexpected SPAJA KOD developer/create repo-wide RADNI TAKT VUK supplemental visual reference');
    assert(spajaKodRepoWideRadniTaktVukSupplemental?.imageToSignalProfile.scenarioId === 'developer-create-vrh-radni-takt-da-se-odrazi-na-svemu-u-repozitorijumu-vuk-developer-create', 'unexpected SPAJA KOD developer/create repo-wide RADNI TAKT VUK supplemental scenario id');
    assert(spajaKodRepoWideRadniTaktVukSupplemental?.thematicSignals.join(',') === 'developer-and-create-vrh,radni-takt-repo-wide-reflection,vuk,bounded-vocabulary-extrimli-extrondol-extrem-dok-duk-dak-dik-for,audit-safe-summary-only', 'unexpected SPAJA KOD developer/create repo-wide RADNI TAKT VUK thematic signals');
    assert(spajaKodRepoWideRadniTaktVukSupplemental?.imageToSignalProfile.ownershipLock.dokDikFor === 'EXTREM', 'unexpected SPAJA KOD developer/create repo-wide RADNI TAKT VUK EXTREM ownership');
    assert(spajaKodRepoWideRadniTaktVukSupplemental?.imageToSignalProfile.ownershipLock.dakDuk === 'EXTRONDOL', 'unexpected SPAJA KOD developer/create repo-wide RADNI TAKT VUK EXTRONDOL ownership');
    assert(spajaKodRepoWideRadniTaktVukSupplemental?.imageToSignalProfile.ownershipLock.spajaKod === 'audit-safe-summary-only', 'unexpected SPAJA KOD developer/create repo-wide RADNI TAKT VUK boundary');
    const spajaKodCarnevaleMasknbaleSupplemental = body.data.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string; ownershipLock: { spajaKod: string } } }) => reference.canonicalNarrativeId === 'carnevale-masknbale-prirodni-portret-lica-developer-create');
    assert(spajaKodCarnevaleMasknbaleSupplemental?.visualReference.includes('carnevale-masknbale-prirodni-portret-lica'), 'unexpected SPAJA KOD developer/create Carnevale Masknbale supplemental visual reference');
    assert(spajaKodCarnevaleMasknbaleSupplemental?.imageToSignalProfile.scenarioId === 'carnevale-masknbale-umetnost-lica-dostojanstvo-identitet-developer-create', 'unexpected SPAJA KOD developer/create Carnevale Masknbale supplemental scenario id');
    assert(spajaKodCarnevaleMasknbaleSupplemental?.thematicSignals.join(',') === 'umetnost-lica,svecanost,dostojanstvo,originalnost,licni-identitet,prirodni-portret', 'unexpected SPAJA KOD developer/create Carnevale Masknbale thematic signals');
    assert(spajaKodCarnevaleMasknbaleSupplemental?.imageToSignalProfile.signalOutputs.readinessStatus === body.data.publicSignals.developerAndCreateStatus, 'unexpected SPAJA KOD developer/create Carnevale Masknbale readiness status');
    const spajaKodAiIdentityCardSupplemental = body.data.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { signalOutputs: { readinessStatus: string } } }) => reference.canonicalNarrativeId === 'licna-karta-artificial-intelligence-identity-card-developer-create');
    assert(spajaKodAiIdentityCardSupplemental?.visualReference.includes('aee19f4e-dede-47d9-83ca-1b080cf9b38b'), 'unexpected SPAJA KOD developer/create AI identity card supplemental visual reference');
    assert(spajaKodAiIdentityCardSupplemental?.thematicSignals.join(',') === 'ai-identitet,odgovorna-vestacka-inteligencija,globalno-znanje,podrska-edukacija-kreativnost,resavanje-problema,documentation-only-activation-cues', 'unexpected SPAJA KOD developer/create AI identity card thematic signals');
    assert(spajaKodAiIdentityCardSupplemental?.imageToSignalProfile.signalOutputs.readinessStatus === body.data.publicSignals.developerAndCreateStatus, 'unexpected SPAJA KOD developer/create AI identity card readiness status');
    const spajaKodZdravijiUmSupplemental = body.data.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string; signalOutputs: { readinessStatus: string }; ownershipLock: { spajaKod: string } } }) => reference.canonicalNarrativeId === 'covecanstvo-zdraviji-um-snazniji-ljudi-bolji-svet-developer-create');
    assert(spajaKodZdravijiUmSupplemental?.visualReference.includes('81ebf11b-d1a5-451b-880a-8670fe240041'), 'unexpected SPAJA KOD developer/create ZDRAVIJI UM supplemental visual reference');
    assert(spajaKodZdravijiUmSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-zdraviji-um-razumevanje-misli-empatija-humanost-developer-create', 'unexpected SPAJA KOD developer/create ZDRAVIJI UM supplemental scenario id');
    assert(spajaKodZdravijiUmSupplemental?.thematicSignals.join(',') === 'mental-reflection,understanding-thoughts,empathetic-humanity,shared-healing-metaphor,stronger-people-better-world,documentation-only-mind-epilog', 'unexpected SPAJA KOD developer/create ZDRAVIJI UM thematic signals');
    assert(spajaKodZdravijiUmSupplemental?.imageToSignalProfile.signalOutputs.readinessStatus === body.data.publicSignals.developerAndCreateStatus, 'unexpected SPAJA KOD developer/create ZDRAVIJI UM readiness status');
    assert(spajaKodZdravijiUmSupplemental?.imageToSignalProfile.ownershipLock.spajaKod === 'audit-safe-summary-only', 'unexpected SPAJA KOD developer/create ZDRAVIJI UM boundary');
    const spajaKodVisionSunriseSupplemental = body.data.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { signalOutputs: { readinessStatus: string } } }) => reference.canonicalNarrativeId === 'covecanstvo-pontcerima-svima-ako-zele-da-poprave-vid-developer-create');
    assert(spajaKodVisionSunriseSupplemental?.visualReference.includes('446f2155-2c59-4420-826b-e248844943a8'), 'unexpected SPAJA KOD developer/create sunrise vision supplemental visual reference');
    assert(spajaKodVisionSunriseSupplemental?.thematicSignals.join(',') === 'vid,jutarnje-sunce,licno-iskustvo,epilog-covecanstvu,disciplina-posmatranja,documentation-only-guidance', 'unexpected SPAJA KOD developer/create sunrise vision thematic signals');
    assert(spajaKodVisionSunriseSupplemental?.imageToSignalProfile.signalOutputs.readinessStatus === body.data.publicSignals.developerAndCreateStatus, 'unexpected SPAJA KOD developer/create sunrise vision readiness status');
    assert(spajaKodCarnevaleMasknbaleSupplemental?.imageToSignalProfile.ownershipLock.spajaKod === 'audit-safe-summary-only', 'unexpected SPAJA KOD developer/create Carnevale Masknbale boundary');
    const spajaKodKraljevstvoCovecanstvoPravoBicaSupplemental = body.data.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; auditRole: string; imageToSignalProfile: { scenarioId: string; ownershipLock: { spajaKod: string } } }) => reference.canonicalNarrativeId === 'kraljevstvo-covecanstvo-pravo-bica-jedna-porodica-jedan-svet-developer-create');
    assert(spajaKodKraljevstvoCovecanstvoPravoBicaSupplemental?.visualReference.includes('c7ebacdd-d239-425f-9b3c-ab3d807bbb92'), 'unexpected SPAJA KOD developer/create KRALJEVSTVO / ČOVEČANSTVO supplemental visual reference');
    assert(spajaKodKraljevstvoCovecanstvoPravoBicaSupplemental?.imageToSignalProfile.scenarioId === 'kraljevstvo-covecanstvo-pravo-bica-znanje-tehnologija-ravnoteza-developer-create', 'unexpected SPAJA KOD developer/create KRALJEVSTVO / ČOVEČANSTVO supplemental scenario id');
    assert(spajaKodKraljevstvoCovecanstvoPravoBicaSupplemental?.thematicSignals.join(',') === 'pravo-bica-postojanje,zajednistvo-jedna-porodica-jedan-svet,znanje-inovacija-tehnologija,produktivnost-razvoj-bolji-svet,priroda-covek-tehnologija-u-ravnotezi', 'unexpected SPAJA KOD developer/create KRALJEVSTVO / ČOVEČANSTVO thematic signals');
    assert(spajaKodKraljevstvoCovecanstvoPravoBicaSupplemental?.auditRole === 'additive-audit-reference-only', 'unexpected SPAJA KOD developer/create KRALJEVSTVO / ČOVEČANSTVO audit role');
    assert(spajaKodKraljevstvoCovecanstvoPravoBicaSupplemental?.imageToSignalProfile.ownershipLock.spajaKod === 'audit-safe-summary-only', 'unexpected SPAJA KOD developer/create KRALJEVSTVO / ČOVEČANSTVO boundary');
    const spajaKodSvitakBozanstvaSupplemental = body.data.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string } }) => reference.canonicalNarrativeId === 'covecanstvo-svitak-bozanstva-pravoslavlje-kraljevstvo-developer-create');
    assert(spajaKodSvitakBozanstvaSupplemental?.visualReference.includes('752ba75d-86b3-4d65-a6d7-e4f126c303ae'), 'unexpected SPAJA KOD developer/create SVITAK BOŽANSTVA supplemental visual reference');
    assert(spajaKodSvitakBozanstvaSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-svitak-bozanstva-pravoslavlje-kraljevstvo-vecna-svetlost-developer-create', 'unexpected SPAJA KOD developer/create SVITAK BOŽANSTVA supplemental scenario id');
    assert(spajaKodSvitakBozanstvaSupplemental?.thematicSignals.join(',') === 'bozanstvo-nad-svim,pravoslavlje-vecna-svetlost,vera-znanje-ljubav,narod-zemlja-covecanstvo,jedan-bog-jedan-narod-jedna-zemlja-jedno-covecanstvo', 'unexpected SPAJA KOD developer/create SVITAK BOŽANSTVA thematic signals');
    const spajaKodPravedanSvetKraljevstvoSupplemental = body.data.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string } }) => reference.canonicalNarrativeId === 'kraljevstvo-pravedan-svet-za-sve-narastaje-developer-create');
    assert(spajaKodPravedanSvetKraljevstvoSupplemental?.visualReference.includes('527e2ce4-7bfe-4ab0-b5a3-caceb75b24c0'), 'unexpected SPAJA KOD developer/create KRALJEVSTVO — PRAVEDAN SVET ZA SVE NARAŠTAJE supplemental visual reference');
    assert(spajaKodPravedanSvetKraljevstvoSupplemental?.imageToSignalProfile.scenarioId === 'kraljevstvo-pravedan-svet-za-sve-narastaje-developer-create', 'unexpected SPAJA KOD developer/create KRALJEVSTVO — PRAVEDAN SVET ZA SVE NARAŠTAJE supplemental scenario id');
    assert(spajaKodPravedanSvetKraljevstvoSupplemental?.thematicSignals.join(',') === 'kraljevstvo,pravoslavlje,znanje,priroda,covecanstvo,jedan-svet-jedna-porodica,vecnost', 'unexpected SPAJA KOD developer/create KRALJEVSTVO — PRAVEDAN SVET ZA SVE NARAŠTAJE thematic signals');
    const spajaKodProfesionalnaGlobalnaKampanjaKraljevstvoSupplemental = body.data.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string } }) => reference.canonicalNarrativeId === 'kraljevstvo-profesionalna-globalna-kampanja-nikola-spajic-developer-create');
    assert(spajaKodProfesionalnaGlobalnaKampanjaKraljevstvoSupplemental?.visualReference.includes('c9414c36-7876-43ee-ae39-fad8cd2622ed'), 'unexpected SPAJA KOD developer/create KRALJEVSTVO professional global campaign supplemental visual reference');
    assert(spajaKodProfesionalnaGlobalnaKampanjaKraljevstvoSupplemental?.imageToSignalProfile.scenarioId === 'kraljevstvo-profesionalna-globalna-kampanja-medijska-strategija-developer-create', 'unexpected SPAJA KOD developer/create KRALJEVSTVO professional global campaign supplemental scenario id');
    assert(spajaKodProfesionalnaGlobalnaKampanjaKraljevstvoSupplemental?.thematicSignals.join(',') === 'nikola-spajic-public-presentation,covecanstvo,znanje-i-obrazovanje,priroda-i-zivot,tehnologija,porodica-drustvo-zdravlje,pravda-buducnost-razvoj,profesionalni-gejming,ai-iq-world-bank-governance,audit-safe-media-strategy', 'unexpected SPAJA KOD developer/create KRALJEVSTVO professional global campaign thematic signals');
    assert(spajaKodProfesionalnaGlobalnaKampanjaKraljevstvoSupplemental?.citation.includes('TV/radio/social distribucija ostaje samo audit-safe media-distribution strategy'), 'unexpected SPAJA KOD developer/create KRALJEVSTVO professional global campaign citation');
    const spajaKodGilskultureKraljevstvoSupplemental = body.data.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; citation: string; imageToSignalProfile: { scenarioId: string; ownershipLock: { spajaKod: string } } }) => reference.canonicalNarrativeId === 'covecanstvo-epilog-kraljevstvo-gilskulture-developer-create');
    assert(spajaKodGilskultureKraljevstvoSupplemental?.visualReference.includes('50cb9759-5ce2-490f-bcb2-8a3b73fed39f'), 'unexpected SPAJA KOD developer/create GILSKULTURE supplemental visual reference');
    assert(spajaKodGilskultureKraljevstvoSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-epilog-kraljevstvo-gilskulture-znanje-mir-odgovornost-developer-create', 'unexpected SPAJA KOD developer/create GILSKULTURE supplemental scenario id');
    assert(spajaKodGilskultureKraljevstvoSupplemental?.thematicSignals.join(',') === 'kraljevstvo,covecanstvo-epilog,znanje-citanje,deca-buduci-narastaji,priroda-covek-tehnologija-u-ravnotezi,mir-pravda-odgovornost', 'unexpected SPAJA KOD developer/create GILSKULTURE thematic signals');
    assert(spajaKodGilskultureKraljevstvoSupplemental?.citation.includes('source-text-only documentation/evidence'), 'unexpected SPAJA KOD developer/create GILSKULTURE citation boundary');
    assert(spajaKodGilskultureKraljevstvoSupplemental?.imageToSignalProfile.ownershipLock.spajaKod === 'audit-safe-summary-only', 'unexpected SPAJA KOD developer/create GILSKULTURE boundary');
    const spajaKodNarastajUPrirodnomCvatuSupplemental = body.data.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string; ownershipLock: { spajaKod: string } } }) => reference.canonicalNarrativeId === 'covecanstvo-narastaj-u-prirodnom-cvatu-developer-create');
    assert(spajaKodNarastajUPrirodnomCvatuSupplemental?.visualReference.includes('93ba6f4a-e8bd-4547-bb8b-dc77c14e845a'), 'unexpected SPAJA KOD developer/create NARAŠTAJ U PRIRODNOM CVATU supplemental visual reference');
    assert(spajaKodNarastajUPrirodnomCvatuSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-narastaj-u-prirodnom-cvatu-epilog-blagodarim-developer-create', 'unexpected SPAJA KOD developer/create NARAŠTAJ U PRIRODNOM CVATU supplemental scenario id');
    assert(spajaKodNarastajUPrirodnomCvatuSupplemental?.thematicSignals.join(',') === 'growth,seed-potential,light-and-opportunity,human-flourishing,gratitude,epilog', 'unexpected SPAJA KOD developer/create NARAŠTAJ U PRIRODNOM CVATU thematic signals');
    assert(spajaKodNarastajUPrirodnomCvatuSupplemental?.imageToSignalProfile.ownershipLock.spajaKod === 'audit-safe-summary-only', 'unexpected SPAJA KOD developer/create NARAŠTAJ U PRIRODNOM CVATU boundary');
    const spajaKodSemeSupplemental = body.data.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; imageToSignalProfile: { scenarioId: string; ownershipLock: { spajaKod: string } } }) => reference.canonicalNarrativeId === 'covecanstvo-seme-malo-seme-velika-promena-developer-create');
    assert(spajaKodSemeSupplemental?.visualReference.includes('9267f560-0b94-4911-9ac4-783c7c7deb3f'), 'unexpected SPAJA KOD developer/create SEME supplemental visual reference');
    assert(spajaKodSemeSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-seme-zdrava-zemlja-prirodno-dubrivo-developer-create', 'unexpected SPAJA KOD developer/create SEME supplemental scenario id');
    assert(spajaKodSemeSupplemental?.thematicSignals.join(',') === 'seed-growth,clean-input,planetary-stewardship,shared-world,small-change-large-impact,better-tomorrow', 'unexpected SPAJA KOD developer/create SEME thematic signals');
    assert(spajaKodSemeSupplemental?.imageToSignalProfile.ownershipLock.spajaKod === 'audit-safe-summary-only', 'unexpected SPAJA KOD developer/create SEME boundary');
    const spajaKodKrvotokSupplemental = body.data.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference: { canonicalNarrativeId: string; thematicSignals: string[]; citation: string; imageToSignalProfile: { scenarioId: string; ownershipLock: { spajaKod: string } } }) => reference.canonicalNarrativeId === 'covecanstvo-krvotok-zdrava-krv-bolji-zivot-developer-create');
    assert(spajaKodKrvotokSupplemental?.visualReference.includes('824084e5-fff7-4a86-b96e-6d7d20b163b3'), 'unexpected SPAJA KOD developer/create KRVOTOK supplemental visual reference');
    assert(spajaKodKrvotokSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-krvotok-zdrava-krv-bolji-zivot-developer-create', 'unexpected SPAJA KOD developer/create KRVOTOK supplemental scenario id');
    assert(spajaKodKrvotokSupplemental?.thematicSignals.join(',') === 'zdravlje-krvotok,voda-hidratacija,voce-i-povrce-cisti-input,pre-posle-transformacija,covecanstvo-bolja-buducnost,documentation-only-health-epilog', 'unexpected SPAJA KOD developer/create KRVOTOK thematic signals');
    assert(spajaKodKrvotokSupplemental?.citation.includes('13 dana'), 'unexpected SPAJA KOD developer/create KRVOTOK citation');
    assert(spajaKodKrvotokSupplemental?.imageToSignalProfile.ownershipLock.spajaKod === 'audit-safe-summary-only', 'unexpected SPAJA KOD developer/create KRVOTOK boundary');
    assert(body.data.developerAndCreateVisualReflection.companionAuditVisualReferences[0].canonicalNarrativeId === 'covecanstvo-osecaj-osebenosti-developer-create-vrh-radni-takt', 'unexpected SPAJA KOD developer/create companion narrative id');
    assert(body.data.developerAndCreateVisualReflection.companionAuditVisualReferences[0].visualReference.includes('9273c07f-5c03-4db4-a469-d22d456596f9'), 'unexpected SPAJA KOD developer/create companion visual reference');
    assert(body.data.developerAndCreateVisualReflection.companionAuditVisualReferences[0].thematicSignals.join(',') === 'self-knowledge,brain-and-mind-understanding,feeling,humanity,shared-world,epilog-guidance', 'unexpected SPAJA KOD developer/create companion thematic signals');
    assert(!('technicalReadinessBinding' in body.data.developerAndCreateVisualReflection), 'unexpected SPAJA KOD developer/create internal technical binding exposure');
    assert(body.data.dokerKuratIzekDokarTrack.boundarySurface === 'SPAJA KOD', 'unexpected quartet boundary surface');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.dokerKuratIzekDokarTrack.publicStatus), 'unexpected quartet public status');
    assert(body.data.dokerKuratIzekDokarTrack.tokenSummaries.map((item) => item.token).join(',') === 'DOKER,KURAT,IZEK,DOKAR', 'unexpected quartet public token order');
    assert(body.data.dokerKuratIzekDokarTrack.tokenSummaries.every((item) => ['READY', 'WATCH', 'BLOCKED'].includes(item.status)), 'quartet public token statuses must stay public-safe');
    assert(Array.isArray(body.data.blockers), 'SPAJA KOD blockers should be an array');
  });

  await test('GET /api/extrimli/extrondol stays 200 with blocked payment verification (degraded-no-500 contract)', async () => {
    const previous = {
      SPAJA_VERCEL_BILLING_OWNER: process.env.SPAJA_VERCEL_BILLING_OWNER,
      SPAJA_VERCEL_BILLING_OWNER_LOCKED: process.env.SPAJA_VERCEL_BILLING_OWNER_LOCKED,
      SPAJA_VERCEL_CURRENT_INVOICE_NUMBER: process.env.SPAJA_VERCEL_CURRENT_INVOICE_NUMBER,
      SPAJA_VERCEL_CURRENT_INVOICE_AMOUNT: process.env.SPAJA_VERCEL_CURRENT_INVOICE_AMOUNT,
      SPAJA_VERCEL_INVOICE_REQUESTED: process.env.SPAJA_VERCEL_INVOICE_REQUESTED,
      SPAJA_VERCEL_CURRENT_INVOICE_PAID: process.env.SPAJA_VERCEL_CURRENT_INVOICE_PAID,
      SPAJA_VERCEL_CURRENT_INVOICE_EVIDENCE_CAPTURED: process.env.SPAJA_VERCEL_CURRENT_INVOICE_EVIDENCE_CAPTURED,
      SPAJA_VERCEL_BANK_STATEMENT_CAPTURED: process.env.SPAJA_VERCEL_BANK_STATEMENT_CAPTURED,
      SPAJA_VERCEL_PAYMENT_REFERENCE_CAPTURED: process.env.SPAJA_VERCEL_PAYMENT_REFERENCE_CAPTURED,
      SPAJA_VERCEL_PAYMENT_REFERENCE_CLASSIFICATION: process.env.SPAJA_VERCEL_PAYMENT_REFERENCE_CLASSIFICATION,
      SPAJA_VERCEL_PAYMENT_REFERENCE_PUBLIC_SAFE_APPROVED: process.env.SPAJA_VERCEL_PAYMENT_REFERENCE_PUBLIC_SAFE_APPROVED,
      SPAJA_VERCEL_PUBLIC_ANNOUNCEMENT_REDACTED: process.env.SPAJA_VERCEL_PUBLIC_ANNOUNCEMENT_REDACTED,
    };
    process.env.SPAJA_VERCEL_BILLING_OWNER = 'unknown-owner';
    process.env.SPAJA_VERCEL_BILLING_OWNER_LOCKED = 'false';
    process.env.SPAJA_VERCEL_CURRENT_INVOICE_NUMBER = 'unknown';
    process.env.SPAJA_VERCEL_CURRENT_INVOICE_AMOUNT = '0.00';
    process.env.SPAJA_VERCEL_INVOICE_REQUESTED = 'false';
    process.env.SPAJA_VERCEL_CURRENT_INVOICE_PAID = 'false';
    process.env.SPAJA_VERCEL_CURRENT_INVOICE_EVIDENCE_CAPTURED = 'false';
    process.env.SPAJA_VERCEL_BANK_STATEMENT_CAPTURED = 'false';
    process.env.SPAJA_VERCEL_PAYMENT_REFERENCE_CAPTURED = 'false';
    process.env.SPAJA_VERCEL_PAYMENT_REFERENCE_CLASSIFICATION = '';
    process.env.SPAJA_VERCEL_PAYMENT_REFERENCE_PUBLIC_SAFE_APPROVED = 'false';
    process.env.SPAJA_VERCEL_PUBLIC_ANNOUNCEMENT_REDACTED = 'false';

    try {
      const response = await getExtrondol();
      assert(response.status === 200, `expected 200, got ${response.status}`);
      const body = await response.json() as { data: { paymentVerification: { status: string; blockers: string[] } } };
      assert(body.data.paymentVerification.status === 'BLOCKED', 'expected blocked payment verification');
      assert(body.data.paymentVerification.blockers.length >= 1, 'expected payment blockers');
    } finally {
      process.env.SPAJA_VERCEL_BILLING_OWNER = previous.SPAJA_VERCEL_BILLING_OWNER;
      process.env.SPAJA_VERCEL_BILLING_OWNER_LOCKED = previous.SPAJA_VERCEL_BILLING_OWNER_LOCKED;
      process.env.SPAJA_VERCEL_CURRENT_INVOICE_NUMBER = previous.SPAJA_VERCEL_CURRENT_INVOICE_NUMBER;
      process.env.SPAJA_VERCEL_CURRENT_INVOICE_AMOUNT = previous.SPAJA_VERCEL_CURRENT_INVOICE_AMOUNT;
      process.env.SPAJA_VERCEL_INVOICE_REQUESTED = previous.SPAJA_VERCEL_INVOICE_REQUESTED;
      process.env.SPAJA_VERCEL_CURRENT_INVOICE_PAID = previous.SPAJA_VERCEL_CURRENT_INVOICE_PAID;
      process.env.SPAJA_VERCEL_CURRENT_INVOICE_EVIDENCE_CAPTURED = previous.SPAJA_VERCEL_CURRENT_INVOICE_EVIDENCE_CAPTURED;
      process.env.SPAJA_VERCEL_BANK_STATEMENT_CAPTURED = previous.SPAJA_VERCEL_BANK_STATEMENT_CAPTURED;
      process.env.SPAJA_VERCEL_PAYMENT_REFERENCE_CAPTURED = previous.SPAJA_VERCEL_PAYMENT_REFERENCE_CAPTURED;
      process.env.SPAJA_VERCEL_PAYMENT_REFERENCE_CLASSIFICATION = previous.SPAJA_VERCEL_PAYMENT_REFERENCE_CLASSIFICATION;
      process.env.SPAJA_VERCEL_PAYMENT_REFERENCE_PUBLIC_SAFE_APPROVED = previous.SPAJA_VERCEL_PAYMENT_REFERENCE_PUBLIC_SAFE_APPROVED;
      process.env.SPAJA_VERCEL_PUBLIC_ANNOUNCEMENT_REDACTED = previous.SPAJA_VERCEL_PUBLIC_ANNOUNCEMENT_REDACTED;
    }
  });

  await test('GET /api/extrimli/koron returns KORON surface report and headers', async () => {
    const response = await getKoron();
    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Extrimli-Koron-Contract-Version') === 'v1-koron', 'missing KORON contract header');
    assert(response.headers.get('X-Extrimli-Degraded-Mode') === 'partial-payload-no-500', 'missing KORON degraded mode header');

    const body = await response.json() as {
      data: { sourceOfTruth: string; status: string; readinessScore: number };
    };
    assert(body.data.sourceOfTruth === '/api/extrimli/koron', 'unexpected KORON sourceOfTruth');
    assert(['ACTIVE', 'WATCH', 'DEGRADED'].includes(body.data.status), 'unexpected KORON status');
    assert(body.data.readinessScore >= 0 && body.data.readinessScore <= 100, 'unexpected KORON readiness score');
  });

  await test('GET /api/extrimli/duel-king returns DUEL KING report and headers', async () => {
    const response = await getDuelKing();
    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Extrimli-Duel-King-Contract-Version') === 'v1-duel-king', 'missing DUEL KING contract header');
    assert(response.headers.get('X-Extrimli-Duel-King-Kur-Contract-Version') === 'v1-kur-game', 'missing DUEL KING KUR contract header');
    assert(response.headers.get('X-Extrimli-Duel-King-Dur-Contract-Version') === 'v1-dur-game', 'missing DUEL KING DUR contract header');
    assert(response.headers.get('X-Extrimli-Duel-King-Mol-Contract-Version') === 'v1-mol-game', 'missing DUEL KING MOL contract header');

    const body = await response.json() as {
      data: { sourceOfTruth: string; personaId: string; kurContractVersion: string; durContractVersion: string; molContractVersion: string };
    };
    assert(body.data.sourceOfTruth === '/api/extrimli/duel-king', 'unexpected DUEL KING sourceOfTruth');
    assert(body.data.personaId === 'extrimli-duel-king', 'unexpected DUEL KING persona');
    assert(body.data.kurContractVersion === 'v1-kur-game', 'unexpected DUEL KING KUR contract version');
    assert(body.data.durContractVersion === 'v1-dur-game', 'unexpected DUEL KING DUR contract version');
    assert(body.data.molContractVersion === 'v1-mol-game', 'unexpected DUEL KING MOL contract version');
  });

  await test('GET /api/extrimli/destruction/assets supports filtering', async () => {
    const response = await getDestructionAssets(makeGetRequest('http://localhost/api/extrimli/destruction/assets?material=glass'));
    assert(response.status === 200, `expected 200, got ${response.status}`);

    const body = await response.json() as { data: { assets: Array<{ material: string }> } };
    assert(body.data.assets.length >= 1, 'expected at least one glass asset');
    assert(body.data.assets.every((asset) => asset.material === 'glass'), 'filter should only return glass assets');
  });

  await test('GET /api/extrimli/destruction/assets/[id] returns asset', async () => {
    const response = await getDestructionAsset(
      makeGetRequest('http://localhost/api/extrimli/destruction/assets/glass-dome-arena'),
      { params: Promise.resolve({ id: 'glass-dome-arena' }) },
    );
    assert(response.status === 200, `expected 200, got ${response.status}`);

    const body = await response.json() as { data: { id: string } };
    assert(body.data.id === 'glass-dome-arena', `unexpected asset id: ${body.data.id}`);
  });

  await test('GET /api/extrimli/destruction/assets/[id] returns 404 for unknown asset', async () => {
    const response = await getDestructionAsset(
      makeGetRequest('http://localhost/api/extrimli/destruction/assets/missing'),
      { params: Promise.resolve({ id: 'missing' }) },
    );
    assert(response.status === 404, `expected 404, got ${response.status}`);
  });

  await test('POST /api/extrimli/destruction returns 200 for valid payload', async () => {
    const response = await postDestruction(makePostRequest('http://localhost/api/extrimli/destruction', {
      assetId: 'glass-dome-arena',
      dimension: '720D',
      impactForce: 180,
      resonanceIndex: 4,
      containmentLevel: 7,
      athleteExperience: 6,
    }));

    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as { data: { valid: boolean; severityLevel: string } };
    assert(body.data.valid === true, 'expected valid result');
    assert(body.data.severityLevel === 'MAJOR' || body.data.severityLevel === 'MINOR' || body.data.severityLevel === 'CATASTROPHIC', 'unexpected severity level');
  });

  await test('POST /api/extrimli/destruction returns 422 for unsupported dimension', async () => {
    const response = await postDestruction(makePostRequest('http://localhost/api/extrimli/destruction', {
      assetId: 'glass-dome-arena',
      dimension: '5760D',
      impactForce: 180,
      resonanceIndex: 4,
      containmentLevel: 7,
    }));

    assert(response.status === 422, `expected 422, got ${response.status}`);
    const body = await response.json() as { data: { valid: boolean } };
    assert(body.data.valid === false, 'expected invalid result');
  });

  await test('POST /api/extrimli/destruction returns 400 when required field is missing', async () => {
    const response = await postDestruction(makePostRequest('http://localhost/api/extrimli/destruction', {
      dimension: '720D',
      impactForce: 180,
      resonanceIndex: 4,
      containmentLevel: 7,
    }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/extrimli/destruction/preview returns degraded preview when limits exceed safety caps', async () => {
    const response = await postDestructionPreview(makePostRequest('http://localhost/api/extrimli/destruction/preview', {
      assetId: 'glass-dome-arena',
      dimension: '1440D',
      impactForce: 1000,
      resonanceIndex: 10,
      containmentLevel: 0,
    }));

    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as { data: { degraded: boolean; activationRequired: boolean } };
    assert(body.data.degraded === true, 'expected degraded preview');
    assert(body.data.activationRequired === false, 'preview should not require activation');
  });

  await test('POST /api/extrimli/destruction returns 400 for invalid JSON', async () => {
    const request = new Request('http://localhost/api/extrimli/destruction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'INVALID JSON {{{',
    }) as unknown as NextRequest;

    const response = await postDestruction(request);
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/extrimli/duel-king returns 200 for valid payload', async () => {
    const response = await postDuelKing(makePostRequest('http://localhost/api/extrimli/duel-king', {
      sportId: 'duel-king',
      duelMode: 'ARENA',
      fighterExperience: 8,
      opponentTier: 5,
      arenaHazard: 3,
      staminaReserve: 8,
      gearQualityIndex: 9,
      reactionTimeMs: 180,
      recentSessions: 8,
      activeGearCategories: ['helmet', 'pads', 'boots'],
      tournamentState: 'ACTIVE',
    }));

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Extrimli-Duel-King-Contract-Version') === 'v1-duel-king', 'missing DUEL KING contract header');
    assert(response.headers.get('X-Extrimli-Duel-King-Kur-Contract-Version') === 'v1-kur-game', 'missing DUEL KING KUR contract header');
    assert(response.headers.get('X-Extrimli-Duel-King-Dur-Contract-Version') === 'v1-dur-game', 'missing DUEL KING DUR contract header');
    assert(response.headers.get('X-Extrimli-Duel-King-Mol-Contract-Version') === 'v1-mol-game', 'missing DUEL KING MOL contract header');
    const body = await response.json() as { data: { valid: boolean; bracketStatus: string; degraded: boolean } };
    assert(body.data.valid === true, 'expected valid DUEL KING response');
    assert(body.data.bracketStatus === 'READY', `unexpected bracketStatus: ${body.data.bracketStatus}`);
    assert(body.data.degraded === false, 'valid payload should not be degraded');
  });

  await test('POST /api/extrimli/duel-king applies KUR-in-GAME signal when payload is valid', async () => {
    const response = await postDuelKing(makePostRequest('http://localhost/api/extrimli/duel-king', {
      sportId: 'duel-king',
      duelMode: 'ARENA',
      fighterExperience: 8,
      opponentTier: 5,
      arenaHazard: 3,
      staminaReserve: 8,
      gearQualityIndex: 9,
      reactionTimeMs: 180,
      recentSessions: 8,
      activeGearCategories: ['helmet', 'pads', 'boots'],
      tournamentState: 'ACTIVE',
      kurGameSignal: { start: 0, target: 8, step: 2 },
    }));

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Extrimli-Duel-King-Kur-Signal-Status') === 'LIVE', 'expected LIVE KUR signal header');
    const body = await response.json() as {
      data: { valid: boolean; kurGameSignal: { status: string; applied: boolean; impactScore: number } };
    };
    assert(body.data.valid === true, 'expected valid DUEL KING response');
    assert(body.data.kurGameSignal.status === 'LIVE', 'expected LIVE KUR signal');
    assert(body.data.kurGameSignal.applied === true, 'expected KUR signal to be applied');
    assert(body.data.kurGameSignal.impactScore >= -8 && body.data.kurGameSignal.impactScore <= 8, 'unexpected KUR impact bounds');
  });

  await test('POST /api/extrimli/duel-king applies DUR/MOL in-game signals when payload is valid', async () => {
    const response = await postDuelKing(makePostRequest('http://localhost/api/extrimli/duel-king', {
      sportId: 'duel-king',
      duelMode: 'ARENA',
      fighterExperience: 8,
      opponentTier: 5,
      arenaHazard: 3,
      staminaReserve: 8,
      gearQualityIndex: 9,
      reactionTimeMs: 180,
      recentSessions: 8,
      activeGearCategories: ['helmet', 'pads', 'boots'],
      tournamentState: 'ACTIVE',
      durGameSignal: { start: 0, target: 10, step: 2 },
      molGameSignal: { start: 1, target: 9, step: 2 },
    }));

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Extrimli-Duel-King-Dur-Signal-Status') === 'LIVE', 'expected LIVE DUR signal header');
    assert(response.headers.get('X-Extrimli-Duel-King-Mol-Signal-Status') === 'LIVE', 'expected LIVE MOL signal header');
    const body = await response.json() as {
      data: {
        valid: boolean;
        durGameSignal: { status: string; applied: boolean; impactScore: number };
        molGameSignal: { status: string; applied: boolean; impactScore: number };
      };
    };
    assert(body.data.valid === true, 'expected valid DUEL KING response');
    assert(body.data.durGameSignal.status === 'LIVE', 'expected LIVE DUR signal');
    assert(body.data.molGameSignal.status === 'LIVE', 'expected LIVE MOL signal');
    assert(body.data.durGameSignal.applied === true, 'expected DUR signal to be applied');
    assert(body.data.molGameSignal.applied === true, 'expected MOL signal to be applied');
    assert(body.data.durGameSignal.impactScore >= -6 && body.data.durGameSignal.impactScore <= 6, 'unexpected DUR impact bounds');
    assert(body.data.molGameSignal.impactScore >= -5 && body.data.molGameSignal.impactScore <= 5, 'unexpected MOL impact bounds');
  });

  await test('POST /api/extrimli/duel-king degrades for invalid KUR-in-GAME payload without 500', async () => {
    const response = await postDuelKing(makePostRequest('http://localhost/api/extrimli/duel-king', {
      sportId: 'duel-king',
      duelMode: 'ARENA',
      fighterExperience: 8,
      opponentTier: 5,
      arenaHazard: 3,
      staminaReserve: 8,
      gearQualityIndex: 9,
      reactionTimeMs: 180,
      recentSessions: 8,
      activeGearCategories: ['helmet', 'pads', 'boots'],
      tournamentState: 'ACTIVE',
      kurGameSignal: { start: 'NaN', target: 8, step: 0 },
    }));

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Extrimli-Degraded') === 'true', 'expected degraded header');
    assert(response.headers.get('X-Extrimli-Duel-King-Kur-Signal-Status') === 'DEGRADED', 'expected DEGRADED KUR signal header');
    const body = await response.json() as {
      data: { valid: boolean; degraded: boolean; kurGameSignal: { status: string; applied: boolean } };
    };
    assert(body.data.valid === true, 'expected DUEL KING response to stay valid');
    assert(body.data.degraded === true, 'expected degraded response for invalid KUR signal');
    assert(body.data.kurGameSignal.status === 'DEGRADED', 'expected DEGRADED KUR signal');
    assert(body.data.kurGameSignal.applied === false, 'invalid KUR signal should not be applied');
  });

  await test('POST /api/extrimli/duel-king degrades for invalid DUR/MOL payload without 500', async () => {
    const response = await postDuelKing(makePostRequest('http://localhost/api/extrimli/duel-king', {
      sportId: 'duel-king',
      duelMode: 'ARENA',
      fighterExperience: 8,
      opponentTier: 5,
      arenaHazard: 3,
      staminaReserve: 8,
      gearQualityIndex: 9,
      reactionTimeMs: 180,
      recentSessions: 8,
      activeGearCategories: ['helmet', 'pads', 'boots'],
      tournamentState: 'ACTIVE',
      durGameSignal: { start: 'NaN', target: 8, step: 0 },
      molGameSignal: { start: 0, target: null, step: 1 },
    }));

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Extrimli-Degraded') === 'true', 'expected degraded header');
    assert(response.headers.get('X-Extrimli-Duel-King-Dur-Signal-Status') === 'DEGRADED', 'expected DEGRADED DUR signal header');
    assert(response.headers.get('X-Extrimli-Duel-King-Mol-Signal-Status') === 'DEGRADED', 'expected DEGRADED MOL signal header');
    const body = await response.json() as {
      data: {
        valid: boolean;
        degraded: boolean;
        durGameSignal: { status: string; applied: boolean };
        molGameSignal: { status: string; applied: boolean };
      };
    };
    assert(body.data.valid === true, 'expected DUEL KING response to stay valid');
    assert(body.data.degraded === true, 'expected degraded response for invalid DUR/MOL signals');
    assert(body.data.durGameSignal.status === 'DEGRADED', 'expected DEGRADED DUR signal');
    assert(body.data.molGameSignal.status === 'DEGRADED', 'expected DEGRADED MOL signal');
    assert(body.data.durGameSignal.applied === false, 'invalid DUR signal should not be applied');
    assert(body.data.molGameSignal.applied === false, 'invalid MOL signal should not be applied');
  });

  await test('POST /api/extrimli/duel-king treats null KUR numeric fields as degraded signal', async () => {
    const response = await postDuelKing(makePostRequest('http://localhost/api/extrimli/duel-king', {
      sportId: 'duel-king',
      duelMode: 'ARENA',
      fighterExperience: 8,
      opponentTier: 5,
      arenaHazard: 3,
      staminaReserve: 8,
      gearQualityIndex: 9,
      reactionTimeMs: 180,
      recentSessions: 8,
      activeGearCategories: ['helmet', 'pads', 'boots'],
      tournamentState: 'ACTIVE',
      kurGameSignal: { start: null, target: 8, step: 2 },
    }));

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Extrimli-Duel-King-Kur-Signal-Status') === 'DEGRADED', 'expected DEGRADED KUR signal header for null field');
    const body = await response.json() as {
      data: { valid: boolean; degraded: boolean; kurGameSignal: { status: string } };
    };
    assert(body.data.valid === true, 'core DUEL KING result should remain valid');
    assert(body.data.degraded === true, 'null KUR field should degrade response');
    assert(body.data.kurGameSignal.status === 'DEGRADED', 'expected DEGRADED KUR signal in body');
  });

  await test('POST /api/extrimli/duel-king accepts numeric-string KUR payload fields', async () => {
    const response = await postDuelKing(makePostRequest('http://localhost/api/extrimli/duel-king', {
      sportId: 'duel-king',
      duelMode: 'ARENA',
      fighterExperience: 8,
      opponentTier: 5,
      arenaHazard: 3,
      staminaReserve: 8,
      gearQualityIndex: 9,
      reactionTimeMs: 180,
      recentSessions: 8,
      activeGearCategories: ['helmet', 'pads', 'boots'],
      tournamentState: 'ACTIVE',
      kurGameSignal: { start: '0', target: '8', step: '2' },
    }));

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Extrimli-Duel-King-Kur-Signal-Status') === 'LIVE', 'expected LIVE KUR signal header for numeric strings');
    const body = await response.json() as {
      data: { valid: boolean; degraded: boolean; kurGameSignal: { status: string; applied: boolean } };
    };
    assert(body.data.valid === true, 'expected valid DUEL KING response');
    assert(body.data.degraded === false, 'numeric-string KUR payload should not degrade');
    assert(body.data.kurGameSignal.status === 'LIVE', 'expected LIVE KUR signal in body');
    assert(body.data.kurGameSignal.applied === true, 'expected KUR signal to be applied');
  });

  await test('POST /api/extrimli/duel-king returns degraded 200 when partial signals are missing', async () => {
    const response = await postDuelKing(makePostRequest('http://localhost/api/extrimli/duel-king', {
      sportId: 'duel-king',
      duelMode: 'TACTICAL',
      fighterExperience: 7,
      opponentTier: 6,
      arenaHazard: 5,
      staminaReserve: 7,
      gearQualityIndex: 8,
      reactionTimeMs: 240,
    }));

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Extrimli-Degraded') === 'true', 'expected degraded header');
    const body = await response.json() as { data: { valid: boolean; degraded: boolean; tournamentState: string } };
    assert(body.data.valid === true, 'partial DUEL KING response should stay valid');
    assert(body.data.degraded === true, 'partial DUEL KING response should be degraded');
    assert(body.data.tournamentState === 'DEGRADED', `unexpected tournamentState: ${body.data.tournamentState}`);
  });

  await test('POST /api/extrimli/duel-king returns 422 for unknown duel mode', async () => {
    const response = await postDuelKing(makePostRequest('http://localhost/api/extrimli/duel-king', {
      sportId: 'duel-king',
      duelMode: 'BOSS',
      fighterExperience: 7,
      opponentTier: 6,
      arenaHazard: 5,
      staminaReserve: 7,
      gearQualityIndex: 8,
      reactionTimeMs: 240,
    }));

    assert(response.status === 422, `expected 422, got ${response.status}`);
    const body = await response.json() as { data: { valid: boolean } };
    assert(body.data.valid === false, 'unknown duel mode must be invalid');
  });

  await test('POST /api/extrimli/duel-king returns 422 for non-finite payload values', async () => {
    const response = await postDuelKing(makePostRequest('http://localhost/api/extrimli/duel-king', {
      sportId: 'duel-king',
      duelMode: 'SURVIVAL',
      fighterExperience: 7,
      opponentTier: 'NaN',
      arenaHazard: 5,
      staminaReserve: 7,
      gearQualityIndex: 8,
      reactionTimeMs: 240,
    }));

    assert(response.status === 422, `expected 422, got ${response.status}`);
  });

  await test('POST /api/extrimli/duel-king returns 400 for missing required fields', async () => {
    const response = await postDuelKing(makePostRequest('http://localhost/api/extrimli/duel-king', {
      sportId: 'duel-king',
      duelMode: 'ARENA',
    }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/extrimli/duel-king returns 400 for unknown gear category', async () => {
    const response = await postDuelKing(makePostRequest('http://localhost/api/extrimli/duel-king', {
      sportId: 'duel-king',
      duelMode: 'ARENA',
      fighterExperience: 7,
      opponentTier: 6,
      arenaHazard: 5,
      staminaReserve: 7,
      gearQualityIndex: 8,
      reactionTimeMs: 240,
      activeGearCategories: ['helmet', 'laser-glove'],
    }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/extrimli/duel-king returns 400 for invalid JSON', async () => {
    const request = new Request('http://localhost/api/extrimli/duel-king', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'INVALID JSON {{{',
    }) as unknown as NextRequest;

    const response = await postDuelKing(request);
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/extrimli/read-voice preview returns prepared voice payload and headers', async () => {
    const response = await postReadVoice(makePostRequest('http://localhost/api/extrimli/read-voice', {
      text: 'Prepare for a controlled descent.',
      modifiers: ['hard', 'ultra', 'rage', 'dilit'],
      locale: 'en',
      preview: true,
    }));

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Extrimli-Contract-Version') === 'v1', 'missing contract header');
    const body = await response.json() as { data: { requestLabel: string; selectedVoice: string; modifiers: string[] } };
    assert(body.data.requestLabel === 'EXTRIMLI HARD ULTRA RAGE DILIT', `unexpected label: ${body.data.requestLabel}`);
    assert(body.data.selectedVoice === 'onyx', `unexpected voice: ${body.data.selectedVoice}`);
    assert(body.data.modifiers.length === 4, `expected 4 modifiers, got ${body.data.modifiers.length}`);
  });

  await test('POST /api/extrimli/read-voice requires auth for audio rendering', async () => {
    const response = await postReadVoice(makePostRequest('http://localhost/api/extrimli/read-voice', {
      text: 'Prepare for a controlled descent.',
      rage: true,
    }));

    assert(response.status === 401, `expected 401, got ${response.status}`);
  });

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
  if (failed > 0) {
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error('Fatal:', error);
  process.exit(1);
});
