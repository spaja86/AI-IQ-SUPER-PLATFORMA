import {
  _resetPersonaBankStore,
  getPersona,
  registerPersona,
} from '../../lib/persona-bank';
import {
  EXTRIMLI_WORLD_BANK_PERSONA_CONTRACT_VERSION,
  getExtrimliWorldBankPersonaReport,
} from '../../lib/extrimli-world-bank-persona';

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

async function runTests(): Promise<void> {
  console.log('\n🔗 [extrimli-world-bank-persona] mapping contract tests\n');

  await test('preview report exposes canonical contracts and sources', () => {
    const report = getExtrimliWorldBankPersonaReport();
    assert(report.contractVersion === EXTRIMLI_WORLD_BANK_PERSONA_CONTRACT_VERSION, 'contract mismatch');
    assert(report.sourceOfTruth === '/api/extrimli/world-bank-persona', 'sourceOfTruth mismatch');
    assert(report.sourceContracts.worldBank === '/api/ai-iq-world-bank', 'world bank source mismatch');
    assert(report.sourceContracts.extrondol === '/api/extrimli/extrondol', 'extrondol source mismatch');
    assert(report.sourceContracts.personaBank === '/api/persona-bank', 'persona bank source mismatch');
    assert(report.personaId === 'extrimli-core', 'personaId mismatch');
  });

  await test('governance hold blocks promotion and maps to dormant target status', () => {
    const report = getExtrimliWorldBankPersonaReport();
    assert(report.governanceGate.blocked, 'expected blocked governance gate by default');
    assert(report.lifecycle.decision === 'HOLD', 'expected HOLD lifecycle decision');
    assert(report.lifecycle.targetPersonaStatus === 'dormant', 'expected dormant target status');
    assert(report.lifecycle.promotionAllowed === false, 'promotion must be blocked');
    assert(report.governanceGate.missingEvidence.length >= 1, 'missing evidence must be present');
  });

  await test('apply mode updates existing extrimli persona and appends audit log', () => {
    _resetPersonaBankStore();
    registerPersona(
      {
        id: 'extrimli-core',
        name: 'EXTRIMLI Seed',
        type: 'extrimli',
        octave: 7,
        hipermrezaNode: 56,
        attributes: {
          traits: ['seed'],
          skills: ['seed'],
          tone: 'seed',
          domain: 'seed',
        },
        linkedAgents: ['extrimli-validator-agent'],
      },
      'seed-agent',
    );

    const report = getExtrimliWorldBankPersonaReport({
      mode: 'apply',
      agentId: 'extrimli-validator-agent',
    });
    assert(report.writeResult.attempted, 'apply must attempt write');
    assert(report.writeResult.operation === 'update', 'expected update operation');
    assert(report.writeResult.personaStatusAfter === 'dormant', 'expected conservative dormant status');
    assert(report.writeResult.auditEntriesAfter >= 2, 'audit log should be extended');

    const persona = getPersona('extrimli-core');
    assert(persona !== null, 'persona must exist after apply');
    assert(persona!.attributes.domain === 'extreme-sports/financial-readiness', 'domain mapping mismatch');
    assert(persona!.crossRepoRef === 'extrimli-core', 'crossRepoRef mismatch');
    assert(persona!.status === 'dormant', 'status mismatch after apply');
  });

  await test('explicit governance evidence clears core onboarding/sync/human blockers', () => {
    _resetPersonaBankStore();
    registerPersona(
      {
        id: 'extrimli-core',
        name: 'EXTRIMLI Seed',
        type: 'extrimli',
        octave: 7,
        hipermrezaNode: 56,
        attributes: {
          traits: ['seed'],
          skills: ['seed'],
          tone: 'seed',
          domain: 'seed',
        },
        linkedAgents: ['extrimli-validator-agent'],
      },
      'seed-agent',
    );

    const report = getExtrimliWorldBankPersonaReport({
      mode: 'apply',
      agentId: 'extrimli-validator-agent',
      evidence: {
        auditTrailComplete: true,
        downstreamSyncComplete: true,
        humanReviewComplete: true,
        onboardingComplete: true,
      },
    });
    assert(!report.governanceGate.missingEvidence.includes('onboarding-complete'), 'onboarding blocker should be cleared');
    assert(!report.governanceGate.missingEvidence.includes('downstream-sync-complete'), 'downstream sync blocker should be cleared');
    assert(!report.governanceGate.missingEvidence.includes('human-review-complete'), 'human review blocker should be cleared');
    assert(!report.governanceGate.missingEvidence.includes('audit-trail-complete'), 'audit blocker should be cleared');
    assert(report.governanceGate.promotionFreeze === report.governanceGate.blocked, 'block state should mirror promotion freeze when evidence is complete');
    assert(['active', 'dormant'].includes(report.writeResult.personaStatusAfter ?? ''), 'unexpected persona status');
  });

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    console.error('\nFailures:');
    for (const f of failures) console.error(`- ${f}`);
    process.exit(1);
  }
}

void runTests();
