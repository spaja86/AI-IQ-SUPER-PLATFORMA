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
import { GET as getDuelKing, POST as postDuelKing } from '../../app/api/extrimli/duel-king/route';
import { _resetDestructionMetrics } from '../../lib/extrimli';
import { _resetDuelKingMetrics } from '../../lib/extrimli-duel-king';

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
      data: { sourceOfTruth: string; orchestrationReadinessScore: number; rollout: { currentWawe: string; promotionFreeze: boolean } };
    };
    assert(body.data.sourceOfTruth === '/api/extrimli/extrondol', 'unexpected EXTRONDOL sourceOfTruth');
    assert(body.data.orchestrationReadinessScore >= 0 && body.data.orchestrationReadinessScore <= 100, 'unexpected EXTRONDOL orchestrationReadinessScore');
    assert(['WAWE-1', 'WAWE-2', 'WAWE-3', 'WAWE-4', 'WAWE-5'].includes(body.data.rollout.currentWawe), 'unexpected currentWawe');
    assert(typeof body.data.rollout.promotionFreeze === 'boolean', 'promotionFreeze should be boolean');
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
