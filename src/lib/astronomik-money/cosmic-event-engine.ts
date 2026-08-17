// SpajaUltraOmegaCore -∞Ω+∞ — ASTRONOMIK MONEY: Cosmic Event Engine
// Kompanija SPAJA — Digitalna Industrija

import type { CosmicEvent, CosmicEventType, PortfolioComposition } from './types';
import { ASTRONOMIK_BLACK_HOLE_WARNING_THRESHOLD } from './types';

// ─── Event severity impact on resilience score (0–200) ───────────────────────
// Each event type reduces cosmic resilience by a base penalty × severity (0–1)

const EVENT_PENALTY: Record<CosmicEventType, number> = {
  SUPERNOVA: 80,
  SOLAR_FLARE: 40,
  ECLIPSE: 30,
  METEOR_SHOWER: 10,
  BLACK_HOLE_PROXIMITY: 60,
};

const EVENT_DESCRIPTIONS: Record<CosmicEventType, string> = {
  SUPERNOVA: 'Market crash — severe capital implosion risk',
  SOLAR_FLARE: 'Volatility spike — high short-term turbulence',
  ECLIPSE: 'Liquidity shadow — assets become hard to exit',
  METEOR_SHOWER: 'Opportunity rain — short-term entry windows opening',
  BLACK_HOLE_PROXIMITY: 'Capital trap warning — illiquid allocation too high',
};

// ─── Auto-detect events from portfolio composition ────────────────────────────

export function detectAutoEvents(composition: PortfolioComposition): CosmicEvent[] {
  const events: CosmicEvent[] = [];

  const blackHoleRatio = composition.classCoverage['BLACK_HOLE'] ?? 0;
  if (blackHoleRatio > ASTRONOMIK_BLACK_HOLE_WARNING_THRESHOLD) {
    events.push({
      type: 'BLACK_HOLE_PROXIMITY',
      severity: Math.min(1, blackHoleRatio * 2),
      description: EVENT_DESCRIPTIONS['BLACK_HOLE_PROXIMITY'],
    });
  }

  return events;
}

// ─── Compute cosmic resilience (0–200) ───────────────────────────────────────

export function computeCosmicResilience(events: CosmicEvent[]): number {
  if (events.length === 0) return 200;

  let totalPenalty = 0;
  for (const event of events) {
    const basePenalty = EVENT_PENALTY[event.type] ?? 0;
    const severity = Math.min(1, Math.max(0, isNaN(event.severity) ? 0 : event.severity));
    totalPenalty += basePenalty * severity;
  }

  return Math.round(Math.max(0, 200 - totalPenalty));
}

export function enrichEventsWithDescriptions(events: CosmicEvent[]): CosmicEvent[] {
  return events.map((e) => ({
    ...e,
    description: e.description ?? EVENT_DESCRIPTIONS[e.type],
  }));
}
