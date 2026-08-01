import type { DimenzijaNivo } from './dimenzije';

export interface SuccessCriterion {
  id: string;
  naziv: string;
  cilj: string;
}

export interface UserJourney {
  id: string;
  naziv: string;
  koraci: string[];
}

export interface ScopeDefinition {
  mustHave: string[];
  optional: string[];
}

export interface NarrativeAssets {
  tagline: string;
  raceName: string;
  seasonName: string;
  uiPrefix: string;
  automationTag: string;
}

export interface FairnessConstraints {
  maxPlayers: number;
  minPlayers: number;
  maxNitroBoostsPerPlayer: number;
  maxCollisionPenaltyMs: number;
  maxLatencyCompensationMs: number;
}

export interface AnotherRacesPlan {
  goal: string;
  successCriteria: SuccessCriterion[];
  targetUsers: string[];
  supportedPlatforms: string[];
  userJourneys: UserJourney[];
  scope: ScopeDefinition;
  narrative: NarrativeAssets;
  fairness: FairnessConstraints;
}

export interface RaceSetupInput {
  lobbyId: string;
  platform: 'web' | 'mobile' | 'linked-repo';
  dimenzija: DimenzijaNivo;
  players: string[];
  nitroBoostsPerPlayer: number;
  collisionPenaltyMs: number;
  latencyCompensationMs: number;
}

export interface RaceResultInput {
  playerId: string;
  finishPosition: number;
  lapTimeMs: number;
  penaltiesMs: number;
  disconnected: boolean;
}

export const BACK_TO_SPACES_FOR_ANOTHER_RACES: AnotherRacesPlan = {
  goal: 'Uvesti kompetitivni svemirski trkački režim sa fer pravilima i cross-repo operativnom sinhronizacijom.',
  successCriteria: [
    { id: 'bstar-1', naziv: 'Session completion', cilj: '>= 95% trka bez prekida sesije' },
    { id: 'bstar-2', naziv: 'Fairness compliance', cilj: '100% trka u granicama definisanih fairness pravila' },
    { id: 'bstar-3', naziv: 'Performance budget', cilj: '<= 100ms server-side evaluacija rezultata po akciji' },
    { id: 'bstar-4', naziv: 'Cross-repo sync', cilj: 'Svi obavezni labeli i reference sinhronizovani između repozitorijuma' },
  ],
  targetUsers: [
    'Postojeći gaming korisnici AI-IQ-SUPER-PLATFORMA',
    'IO-OPENUI-AO laboratorijski testeri',
    'Takmičarski timovi kojima je potreban anti-cheat i audit trag',
  ],
  supportedPlatforms: ['web', 'mobile', 'linked-repo'],
  userJourneys: [
    {
      id: 'journey-lobby',
      naziv: 'Kreiranje i start trke',
      koraci: ['Ulazak u lobby', 'Izbor dimenzije', 'Validacija fairness pravila', 'Start trke'],
    },
    {
      id: 'journey-competitive',
      naziv: 'Kompetitivna trka',
      koraci: ['Krugovi', 'Nitro upotreba', 'Penalty obrada', 'Rangiranje i rezultat'],
    },
    {
      id: 'journey-cross-repo',
      naziv: 'Cross-repo praćenje',
      koraci: ['Labeling', 'Workflow validacija', 'Audit log', 'Follow-up reference'],
    },
  ],
  scope: {
    mustHave: [
      'Katalog igrice + API prisustvo',
      'Definisana fairness pravila i edge-case validacija',
      'Feature flag i automation metadata',
      'Workflow za validaciju label-ovanih PR promena',
    ],
    optional: [
      'Turnirski mod',
      'Napredna telemetrija po vozaču',
      'Specijalni sezonski skinovi',
    ],
  },
  narrative: {
    tagline: 'Back to Spaces for Another Races',
    raceName: 'Another Races Galactic Circuit',
    seasonName: 'Season Orbit-1',
    uiPrefix: 'ANOTHER-RACES',
    automationTag: 'race:another-races',
  },
  fairness: {
    minPlayers: 2,
    maxPlayers: 8,
    maxNitroBoostsPerPlayer: 3,
    maxCollisionPenaltyMs: 4000,
    maxLatencyCompensationMs: 250,
  },
};

export function validateRaceSetup(input: RaceSetupInput): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const constraints = BACK_TO_SPACES_FOR_ANOTHER_RACES.fairness;
  const uniquePlayers = new Set(input.players);

  if (!input.lobbyId.trim()) errors.push('lobbyId je obavezan');
  if (input.players.length < constraints.minPlayers) errors.push(`minimum igrača je ${constraints.minPlayers}`);
  if (input.players.length > constraints.maxPlayers) errors.push(`maksimum igrača je ${constraints.maxPlayers}`);
  if (uniquePlayers.size !== input.players.length) errors.push('player IDs moraju biti jedinstveni');
  if (input.nitroBoostsPerPlayer < 0 || input.nitroBoostsPerPlayer > constraints.maxNitroBoostsPerPlayer) {
    errors.push(`nitroBoostsPerPlayer mora biti 0-${constraints.maxNitroBoostsPerPlayer}`);
  }
  if (input.collisionPenaltyMs < 0 || input.collisionPenaltyMs > constraints.maxCollisionPenaltyMs) {
    errors.push(`collisionPenaltyMs mora biti 0-${constraints.maxCollisionPenaltyMs}`);
  }
  if (input.latencyCompensationMs < 0 || input.latencyCompensationMs > constraints.maxLatencyCompensationMs) {
    errors.push(`latencyCompensationMs mora biti 0-${constraints.maxLatencyCompensationMs}`);
  }

  return { valid: errors.length === 0, errors };
}

export function normalizeRaceResult(input: RaceResultInput): RaceResultInput {
  return {
    ...input,
    finishPosition: Number.isFinite(input.finishPosition) && input.finishPosition > 0
      ? Math.floor(input.finishPosition)
      : 9999,
    lapTimeMs: Number.isFinite(input.lapTimeMs) && input.lapTimeMs >= 0 ? Math.floor(input.lapTimeMs) : 0,
    penaltiesMs: Number.isFinite(input.penaltiesMs) && input.penaltiesMs >= 0 ? Math.floor(input.penaltiesMs) : 0,
  };
}

export function calculateRaceScore(input: RaceResultInput): number {
  const normalized = normalizeRaceResult(input);
  if (normalized.disconnected) return 0;

  const placementScore = Math.max(0, 120 - (normalized.finishPosition - 1) * 15);
  const speedBonus = Math.max(0, 60_000 - normalized.lapTimeMs) / 1000;
  const penaltyCost = normalized.penaltiesMs / 1000;
  return Math.max(0, Math.round((placementScore + speedBonus - penaltyCost) * 100) / 100);
}
