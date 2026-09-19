import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/ai-iq-programski-jezik/health/route';
import { POST as EVALUATE_POST } from '../../app/api/ai-iq-programski-jezik/evaluate/route';
import { POST as COMPILE_POST } from '../../app/api/ai-iq-programski-jezik/compile/route';
import {
  _resetAiiqLanguageMetrics,
  AIIQ_LANG_API_RESPONSE_MAX_MS,
  AIIQ_LANG_CONTRACT_VERSION,
  AIIQ_LANG_MODULE_VERSION,
  AIIQ_LANG_PERSONA_ID,
} from '../../lib/ai-iq-programski-jezik';

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

function makeRequest(url: string, body: unknown): NextRequest {
  return new Request(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

async function runTests(): Promise<void> {
  _resetAiiqLanguageMetrics();

  console.log('\n🔗 [ai-iq-programski-jezik] route tests\n');

  await test('GET /health returns report and headers', async () => {
    const start = performance.now();
    const response = await GET();
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-AIIQ-Lang-Contract-Version') === AIIQ_LANG_CONTRACT_VERSION, 'missing contract header');
    assert(response.headers.get('X-AIIQ-Lang-Module-Version') === AIIQ_LANG_MODULE_VERSION, 'missing module header');
    assert(elapsed <= AIIQ_LANG_API_RESPONSE_MAX_MS, `health response ${elapsed.toFixed(1)}ms exceeds ${AIIQ_LANG_API_RESPONSE_MAX_MS}ms`);

    const body = await response.json() as { data: { personaId: string } };
    assert(body.data.personaId === AIIQ_LANG_PERSONA_ID, `unexpected persona id: ${body.data.personaId}`);
  });

  await test('POST /evaluate returns 200 for valid payload', async () => {
    const start = performance.now();
    const response = await EVALUATE_POST(makeRequest('http://localhost/api/ai-iq-programski-jezik/evaluate', {
      referenceId: 'route-eval-ok',
      goal: 'AI-native plan execution',
      mode: 'HYBRID',
      promptComplexity: 84,
      ruleCoverage: 86,
      orchestrationReadiness: 82,
      autonomyLevel: 79,
      riskLevel: 28,
      explainabilityNeed: 90,
      securityPolicyScore: 88,
      fallbackConfigured: true,
    }));
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-AIIQ-Lang-Valid') === 'true', 'missing valid header');
    assert(elapsed <= AIIQ_LANG_API_RESPONSE_MAX_MS, `evaluate response ${elapsed.toFixed(1)}ms exceeds ${AIIQ_LANG_API_RESPONSE_MAX_MS}ms`);

    const body = await response.json() as {
      data: {
        valid: boolean;
        status: string;
        integrationProfile: {
          profileId: string;
          signalMapping: {
            SINEMETRICKO: {
              technicalSource: string;
              governanceSource: string;
            };
          };
          unifiedSignalStatus: {
            sinemetricko: string;
          };
          acceptanceCriteria: {
            preserveDokDikDakDukContract: boolean;
            sinemetrickoAdditiveInput: boolean;
          };
          governanceLink: {
            rolloutSnapshot: { promotionFreeze: boolean };
            downstreamReference: { linkedRepo: string };
          };
        };
      };
    };
    assert(body.data.valid, 'result should be valid');
    assert(['READY', 'AI_NATIVE_READY'].includes(body.data.status), `unexpected status: ${body.data.status}`);
    assert(body.data.integrationProfile.profileId === 'EXTRIMLI-EXTRONDOL-EXTREM', 'missing additive integration profile');
    assert(body.data.integrationProfile.signalMapping.SINEMETRICKO.technicalSource === '/api/extrimli/extrem', 'missing SINEMETRICKO technical source');
    assert(body.data.integrationProfile.signalMapping.SINEMETRICKO.governanceSource === '/api/extrimli/extrondol', 'missing SINEMETRICKO governance source');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(body.data.integrationProfile.unifiedSignalStatus.sinemetricko), 'invalid SINEMETRICKO status');
    assert(body.data.integrationProfile.acceptanceCriteria.preserveDokDikDakDukContract, 'DOK/DIK/DAK/DUK contract lock must be enabled');
    assert(body.data.integrationProfile.acceptanceCriteria.sinemetrickoAdditiveInput, 'sinemetricko additive lock must be enabled');
    assert(body.data.integrationProfile.governanceLink.downstreamReference.linkedRepo === 'spaja86/IO-OPENUI-AO', 'missing downstream linked repo');
    assert(body.data.integrationProfile.governanceLink.rolloutSnapshot.promotionFreeze === false, 'valid route payload should not be frozen');
  });

  await test('POST /evaluate returns 400 for shallow shape mismatch', async () => {
    const response = await EVALUATE_POST(makeRequest('http://localhost/api/ai-iq-programski-jezik/evaluate', {
      goal: 'x',
      mode: 'HYBRID',
      promptComplexity: '84',
      ruleCoverage: 86,
      orchestrationReadiness: 82,
      autonomyLevel: 79,
      riskLevel: 28,
      explainabilityNeed: 90,
      securityPolicyScore: 88,
      fallbackConfigured: true,
    }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /evaluate blocked payload exposes frozen governance snapshot', async () => {
    const response = await EVALUATE_POST(makeRequest('http://localhost/api/ai-iq-programski-jezik/evaluate', {
      goal: 'high risk governance check',
      mode: 'AI_NATIVE',
      promptComplexity: 88,
      ruleCoverage: 88,
      orchestrationReadiness: 88,
      autonomyLevel: 88,
      riskLevel: 95,
      explainabilityNeed: 88,
      securityPolicyScore: 90,
      fallbackConfigured: true,
    }));

    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as {
      data: {
        status: string;
        integrationProfile: { governanceLink: { rolloutSnapshot: { promotionFreeze: boolean } } };
      };
    };
    assert(body.data.status === 'BLOCKED', `expected BLOCKED, got ${body.data.status}`);
    assert(body.data.integrationProfile.governanceLink.rolloutSnapshot.promotionFreeze, 'blocked evaluate payload must freeze promotion');
  });

  await test('POST /compile returns 200 for valid source', async () => {
    const response = await COMPILE_POST(makeRequest('http://localhost/api/ai-iq-programski-jezik/compile', {
      referenceId: 'route-compile-ok',
      source: [
        'INTENT: AI-native orchestration',
        'RULE: NO_SECRET output',
        'RULE: ALLOWLIST tool=internal',
        'AI: plan synthesis',
        'ORCHESTRATE: staged rollout',
        'OUTPUT: status score warnings',
      ].join('\n'),
      targetMode: 'AI_NATIVE',
      strictSecurity: true,
      featureFlagAiIqLanguage: true,
    }));

    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as { data: { valid: boolean; securityPass: boolean } };
    assert(body.data.valid, 'compile should be valid');
    assert(body.data.securityPass, 'security should pass');
  });

  await test('POST /compile keeps valid output but freezes promotion when AI flag is disabled', async () => {
    const response = await COMPILE_POST(makeRequest('http://localhost/api/ai-iq-programski-jezik/compile', {
      source: [
        'INTENT: AI-native orchestration',
        'RULE: NO_SECRET output',
        'RULE: ALLOWLIST tool=internal',
        'AI: plan synthesis',
        'ORCHESTRATE: staged rollout',
        'OUTPUT: status score warnings',
      ].join('\n'),
      targetMode: 'AI_NATIVE',
      strictSecurity: true,
      featureFlagAiIqLanguage: false,
    }));

    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as {
      data: {
        valid: boolean;
        integrationProfile: { governanceLink: { rolloutSnapshot: { promotionFreeze: boolean } } };
      };
    };
    assert(body.data.valid, 'compile should remain valid');
    assert(body.data.integrationProfile.governanceLink.rolloutSnapshot.promotionFreeze, 'AI-disabled compile should freeze promotion');
  });

  await test('POST /compile returns 422 when source cannot compile', async () => {
    const response = await COMPILE_POST(makeRequest('http://localhost/api/ai-iq-programski-jezik/compile', {
      source: 'INVALID LINE WITHOUT KEYWORD',
      targetMode: 'AI_NATIVE',
      strictSecurity: true,
      featureFlagAiIqLanguage: true,
    }));

    assert(response.status === 422, `expected 422, got ${response.status}`);
    const body = await response.json() as { data: { valid: boolean } };
    assert(body.data.valid === false, 'compile should be invalid');
  });

  await test('POST /compile returns 400 for invalid JSON', async () => {
    const request = new Request('http://localhost/api/ai-iq-programski-jezik/compile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'INVALID JSON {{{',
    }) as unknown as NextRequest;

    const response = await COMPILE_POST(request);
    assert(response.status === 400, `expected 400, got ${response.status}`);
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
