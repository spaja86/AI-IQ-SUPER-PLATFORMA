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
          developerAndCreateRepoWideReflectionGovernance: { sourceOfTruth: string; status: string };
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
    assert(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.readinessModel.join(',') === 'READY,WATCH,BLOCKED', 'unexpected developer/create readiness model');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.readiness.status), 'unexpected developer/create reflection status');
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
        radniTaktMozgaMislilac: { term: string; contractVersion: string; readiness: { status: string; score: number }; epilogijaCovecnosti: { title: string } };
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
          funkcinalnoProgramiranjeEnergetskogMisaonogTokaStatus: string;
          funkcionalnoProgramiranjeUzvisenogMisanogTokaStatus: string;
          funkcionalnoProgramiranjePravednogMisaonogTokaStatus: string;
          radniTaktMozgaMislilacStatus: string;
          paradijogonalnoProgrimiranjeStatus: string;
          proporcionalnoProgramiranjeStatus: string;
          spajinoProporcionalnoProgramiranjeUniverzitetStatus: string;
          vrhProgramskogEkviladentaStatus: string;
        };
        epilogijaCovecnosti: { title: string; canonicalNarrativeId: string; citation: string; interpretation: string };
        dokerKuratIzekDokarTrack: { boundarySurface: string; publicStatus: string; tokenSummaries: Array<{ token: string; status: string }> };
        blockers: string[];
      };
    };
    assert(body.data.surfaceName === 'SPAJA KOD', 'unexpected SPAJA KOD surface');
    assert(body.data.sourceOfTruth === '/api/extrimli/spaja-kod', 'unexpected SPAJA KOD source');
    assert(body.data.rawPatternVisibility === 'HIDDEN', 'SPAJA KOD must hide raw pattern visibility');
    assert(body.data.completeness.consistent === true, 'SPAJA KOD must be consistent');
    assert(body.data.completeness.exportReady === true, 'SPAJA KOD must be export ready');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.readiness.status), 'unexpected SPAJA KOD readiness status');
    assert(['ALLOW', 'WARN', 'FREEZE'].includes(body.data.readiness.governanceOutcome), 'unexpected SPAJA KOD governance outcome');
    assert(typeof body.data.readiness.promotionFreeze === 'boolean', 'SPAJA KOD promotionFreeze should be boolean');
    assert(['READY', 'BLOCKED'].includes(body.data.publicSignals.auditStatus), 'unexpected SPAJA KOD audit status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.funkcinalnoProgramiranjeEnergetskogMisaonogTokaStatus), 'unexpected SPAJA KOD functional energy-flow summary status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.funkcionalnoProgramiranjeUzvisenogMisanogTokaStatus), 'unexpected SPAJA KOD elevated thought-flow summary status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.funkcionalnoProgramiranjePravednogMisaonogTokaStatus), 'unexpected SPAJA KOD fair thought-flow summary status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.radniTaktMozgaMislilacStatus), 'unexpected SPAJA KOD radni takt summary status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.paradijogonalnoProgrimiranjeStatus), 'unexpected SPAJA KOD paradijogonalno summary status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.proporcionalnoProgramiranjeStatus), 'unexpected SPAJA KOD proportional programming summary status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.spajinoProporcionalnoProgramiranjeUniverzitetStatus), 'unexpected SPAJA KOD university summary status');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.publicSignals.vrhProgramskogEkviladentaStatus), 'unexpected SPAJA KOD vrh summary status');
    assert(body.data.epilogijaCovecnosti.title === 'EPILOGIJA ČOVEČANSTVA', 'unexpected SPAJA KOD epilog title');
    assert(body.data.epilogijaCovecnosti.canonicalNarrativeId === 'zivot-je-igra-sitni-koraci-covecanstvo', 'unexpected SPAJA KOD canonical epilog narrative id');
    assert(body.data.epilogijaCovecnosti.citation.includes('Život je igra'), 'SPAJA KOD epilog citation should preserve canonical narrative');
    assert(body.data.epilogijaCovecnosti.interpretation.length > 0, 'SPAJA KOD epilog interpretation should be present');
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
