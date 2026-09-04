// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI
// Kompanija SPAJA — Digitalna Industrija

import type { AthleteSession, PerformanceReport, PersonalBest } from './types';

const sessionStore: Map<string, AthleteSession[]> = new Map();

const PB_METRICS: Array<keyof AthleteSession & ('speedKph' | 'altitudeM' | 'distanceKm' | 'gForce')> = [
  'speedKph',
  'altitudeM',
  'distanceKm',
  'gForce',
];

function calcPersonalBests(sessions: AthleteSession[]): PersonalBest[] {
  const bests: PersonalBest[] = [];

  for (const metric of PB_METRICS) {
    let best: PersonalBest | null = null;

    for (const session of sessions) {
      const val = session[metric];
      if (typeof val !== 'number' || !Number.isFinite(val)) continue;
      if (!best || val > best.value) {
        best = { metric, value: val, sessionId: session.sessionId, timestamp: session.timestamp };
      }
    }

    if (best) bests.push(best);
  }

  return bests;
}

function calcImprovementRate(sessions: AthleteSession[]): number {
  if (sessions.length < 2) return 0;

  const sorted = [...sessions].sort((a, b) => a.timestamp - b.timestamp);
  let totalImprovements = 0;
  let count = 0;

  for (const metric of PB_METRICS) {
    const vals = sorted
      .map((s) => s[metric])
      .filter((v): v is number => typeof v === 'number' && Number.isFinite(v));

    if (vals.length < 2) continue;

    const first = vals[0];
    const last  = vals[vals.length - 1];

    if (first === 0) continue;

    totalImprovements += (last - first) / first;
    count += 1;
  }

  if (count === 0) return 0;
  return Math.round((totalImprovements / count) * 10000) / 100; // %
}

export function logSession(session: AthleteSession): void {
  if (!session.athleteId || !session.sessionId || !session.sportId) {
    throw new Error('session must have athleteId, sessionId, and sportId');
  }
  const existing = sessionStore.get(session.athleteId) ?? [];
  existing.push({ ...session });
  sessionStore.set(session.athleteId, existing);
}

export function getPerformanceReport(athleteId: string): PerformanceReport {
  const warnings: string[] = [];

  if (!athleteId || typeof athleteId !== 'string') {
    return { athleteId: '', sessions: [], personalBests: [], improvementRate: 0, valid: false, warnings: ['athleteId must be a non-empty string'] };
  }

  const sessions = sessionStore.get(athleteId) ?? [];

  if (sessions.length === 0) {
    warnings.push('no sessions found for this athlete');
  }

  const personalBests   = calcPersonalBests(sessions);
  const improvementRate = calcImprovementRate(sessions);

  return { athleteId, sessions, personalBests, improvementRate, valid: true, warnings };
}

export function _resetSessionStore(): void {
  sessionStore.clear();
}
